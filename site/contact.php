<?php
declare(strict_types=1);

// The recipient and sender are configured outside the web root and repository.
ini_set('display_errors', '0');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');

function respond(int $status, string $message): void
{
    http_response_code($status);
    if (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $status === 200, 'message' => $message]);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        header("Content-Security-Policy: default-src 'none'; style-src 'self'; base-uri 'none'; frame-ancestors 'none'");
        $safe = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
        echo '<!doctype html><html lang="en"><meta charset="utf-8">'
            . '<meta name="viewport" content="width=device-width, initial-scale=1">'
            . '<title>Contact — SofL</title><link rel="stylesheet" href="./styles.css?v=20260905-contact">'
            . '<main class="shell section-pad"><h1>Contact SofL</h1><p>' . $safe
            . '</p><p><a href="./#contact-form">Return to SofL</a></p></main></html>';
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'Please use the contact form to send a message.');
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) {
    respond(413, 'Your message is too long. Please shorten it and try again.');
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ['https://sofl.io', 'https://www.sofl.io'], true)) {
    respond(403, 'Please submit the form from the SofL website.');
}
if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') {
    respond(403, 'Please submit the form from the SofL website.');
}

$fields = [];
foreach (['name' => 100, 'email' => 254, 'company' => 150, 'message' => 5000, 'website' => 200] as $key => $limit) {
    $value = $_POST[$key] ?? '';
    if (!is_string($value) || strlen($value) > $limit || preg_match('//u', $value) !== 1) {
        respond(422, 'Please check your form fields and their length.');
    }
    $fields[$key] = trim($value);
}
if ($fields['website'] !== '') {
    respond(422, 'The submission could not be accepted.');
}
if ($fields['name'] === '' || strlen($fields['message']) < 20
    || !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)
    || preg_match('/[\r\n\x00]/', $fields['name'] . $fields['email'] . $fields['company'])
    || strpos($fields['message'], "\0") !== false) {
    respond(422, 'Please enter your name, a valid email and a message of at least 20 characters.');
}

$privateRoot = dirname(__DIR__);
$configPath = $privateRoot . '/sofl-contact-config.php';
if (!is_file($configPath)) {
    respond(503, 'Message submission is temporarily unavailable. Please try again later.');
}
try {
    $config = require $configPath;
    if (!is_array($config)) {
        throw new RuntimeException('Invalid configuration');
    }
    foreach (['recipient', 'sender'] as $key) {
        if (!isset($config[$key]) || !is_string($config[$key])
            || !filter_var($config[$key], FILTER_VALIDATE_EMAIL)
            || preg_match('/[\r\n]/', $config[$key])) {
            throw new RuntimeException('Invalid configuration');
        }
    }
    if (!isset($config['smtp_password']) || !is_string($config['smtp_password'])
        || $config['smtp_password'] === '') {
        throw new RuntimeException('SMTP configuration missing');
    }

    // One bounded, locked file; no message contents or raw IP addresses stored.
    $ratePath = $privateRoot . '/sofl-contact-rate.json';
    $oldMask = umask(0077);
    $handle = fopen($ratePath, 'c+');
    umask($oldMask);
    if ($handle === false || !flock($handle, LOCK_EX)) {
        throw new RuntimeException('Rate storage unavailable');
    }
    $state = json_decode(stream_get_contents($handle), true);
    if (!is_array($state)) $state = [];
    $now = time();
    foreach ($state as $key => $times) {
        $times = array_values(array_filter((array) $times, static fn($t) => is_int($t) && $t > $now - 3600));
        if ($times === []) unset($state[$key]);
        else $state[$key] = $times;
    }
    $client = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $times = $state[$client] ?? [];
    $total = array_sum(array_map('count', $state));
    if (count($times) >= 5 || $total >= 40 || ($times !== [] && end($times) > $now - 30)) {
        flock($handle, LOCK_UN);
        fclose($handle);
        header('Retry-After: 3600');
        respond(429, 'Too many messages have been submitted. Please try again in an hour.');
    }
    $times[] = $now;
    $state[$client] = $times;
    rewind($handle);
    if (!ftruncate($handle, 0) || fwrite($handle, json_encode($state)) === false || !fflush($handle)) {
        flock($handle, LOCK_UN);
        fclose($handle);
        throw new RuntimeException('Rate storage unavailable');
    }
    flock($handle, LOCK_UN);
    fclose($handle);

    $body = "SofL website enquiry\n\nName: " . $fields['name']
        . "\nEmail: " . $fields['email'] . "\nCompany: " . $fields['company']
        . "\n\nMessage:\n" . $fields['message'];
    require_once __DIR__ . '/vendor/phpmailer/Exception.php';
    require_once __DIR__ . '/vendor/phpmailer/SMTP.php';
    require_once __DIR__ . '/vendor/phpmailer/PHPMailer.php';
    $mailer = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = 'mail.privateemail.com';
    $mailer->Port = 465;
    $mailer->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    $mailer->SMTPAuth = true;
    $mailer->Username = $config['sender'];
    $mailer->Password = $config['smtp_password'];
    $mailer->SMTPDebug = 0;
    $mailer->Timeout = 15;
    $mailer->CharSet = 'UTF-8';
    $mailer->setFrom($config['sender'], 'SofL website');
    $mailer->addAddress($config['recipient']);
    $mailer->addReplyTo($fields['email'], $fields['name']);
    $mailer->Subject = 'SofL technical evaluation enquiry';
    $mailer->Body = $body;
    $mailer->send();
} catch (Throwable $error) {
    // Never return mail configuration, addresses or exception details to visitors.
    error_log('SofL contact: submission service unavailable.');
    respond(503, 'The message could not be submitted. Please try again later.');
}
respond(200, 'Your message has been submitted. Thank you for contacting SofL.');
