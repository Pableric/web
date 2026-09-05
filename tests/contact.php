<?php
// Isolated handler tests with a fake mailer; no SMTP connection is made.
declare(strict_types=1);
$root = sys_get_temp_dir() . '/sofl-contact-test-' . bin2hex(random_bytes(6));
mkdir($root . '/public_html', 0700, true);
copy(__DIR__ . '/../site/contact.php', $root . '/public_html/contact.php');
mkdir($root . '/public_html/vendor/phpmailer', 0700, true);
copy(__DIR__ . '/fake-mailer.php', $root . '/public_html/vendor/phpmailer/PHPMailer.php');
file_put_contents($root . '/public_html/vendor/phpmailer/SMTP.php', '<?php');
file_put_contents($root . '/public_html/vendor/phpmailer/Exception.php', '<?php');
$valid = ['name' => 'Test Visitor', 'email' => 'visitor@example.org',
    'company' => 'Example', 'message' => 'Please discuss a technical evaluation with our team.'];
$count = 0;
function check(string $label, int $expected, array $fields, array $server = [], string $transport = '/bin/true'): void
{
    global $root, $count;
    $server = array_merge(['REQUEST_METHOD' => 'POST', 'HTTP_ACCEPT' => 'application/json',
        'REMOTE_ADDR' => '127.0.0.1', 'HTTP_ORIGIN' => 'https://sofl.io'], $server);
    $code = '$_SERVER=' . var_export($server, true) . ';$_POST=' . var_export($fields, true) . ';'
        . 'register_shutdown_function(function(){echo "\\nSTATUS=".http_response_code();});'
        . 'require ' . var_export($root . '/public_html/contact.php', true) . ';';
    exec(escapeshellarg(PHP_BINARY) . ' -d ' . escapeshellarg('sendmail_path=' . $transport)
        . ' -r ' . escapeshellarg($code) . ' 2>/dev/null', $lines, $exit);
    $output = implode("\n", $lines);
    if ($exit !== 0 || !str_ends_with($output, 'STATUS=' . $expected)) {
        throw new RuntimeException($label . ': ' . $output);
    }
    if (str_contains($output, 'recipient@example.org') || str_contains($output, 'sender@example.org')) {
        throw new RuntimeException('Private configuration leaked');
    }
    if ($server['HTTP_ACCEPT'] === 'application/json') {
        $json = json_decode(explode("\nSTATUS=", $output)[0], true);
        if (!is_array($json) || $json['ok'] !== ($expected === 200)) {
            throw new RuntimeException('Invalid response: ' . $output);
        }
    }
    $count++;
    echo "PASS $label\n";
}
check('GET rejected', 405, [], ['REQUEST_METHOD' => 'GET']);
check('cross-site rejected', 403, $valid, ['HTTP_ORIGIN' => 'https://attacker.example']);
check('large body rejected', 413, $valid, ['CONTENT_LENGTH' => '30000']);
check('array input rejected', 422, array_merge($valid, ['name' => ['bad']]));
check('header injection rejected', 422, array_merge($valid, ['email' => "a@example.org\r\nBcc:b@example.org"]));
check('honeypot rejected', 422, array_merge($valid, ['website' => 'spam']));
check('short message rejected', 422, array_merge($valid, ['message' => 'Hi']));
check('missing config fails closed', 503, $valid);
file_put_contents($root . '/sofl-contact-config.php', "<?php return ['recipient'=>'recipient@example.org','sender'=>'sender@example.org'];");
check('missing SMTP password fails closed', 503, $valid);
file_put_contents($root . '/sofl-contact-config.php', "<?php return ['recipient'=>'recipient@example.org','sender'=>'sender@example.org','smtp_password'=>'fake-test-password'];");
check('mail transport failure is honest', 503, $valid, [], '/bin/false');
unlink($root . '/sofl-contact-rate.json');
check('accepted submission', 200, $valid);
check('duplicate limited', 429, $valid);
unlink($root . '/sofl-contact-rate.json');
check('no-JS response', 200, $valid, ['HTTP_ACCEPT' => 'text/html']);
$state = [];
for ($i = 0; $i < 40; $i++) $state['client-' . $i] = [time()];
file_put_contents($root . '/sofl-contact-rate.json', json_encode($state));
check('global limit', 429, $valid);
file_put_contents($root . '/sofl-contact-rate.json', json_encode([hash('sha256', '127.0.0.1') => [time() - 3601]]));
check('expired entries reclaimed', 200, $valid);
foreach ([$root . '/public_html/contact.php', $root . '/sofl-contact-config.php', $root . '/sofl-contact-rate.json'] as $path) unlink($path);
foreach (['PHPMailer.php', 'SMTP.php', 'Exception.php'] as $file) unlink($root . '/public_html/vendor/phpmailer/' . $file);
rmdir($root . '/public_html/vendor/phpmailer');
rmdir($root . '/public_html/vendor');
rmdir($root . '/public_html');
rmdir($root);
echo "$count checks passed; no email sent.\n";
