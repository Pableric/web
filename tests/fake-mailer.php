<?php
// Test double only; outside site/ and never deployed.
namespace PHPMailer\PHPMailer;
class PHPMailer
{
    const ENCRYPTION_SMTPS = 'ssl';
    public $Host, $Port, $SMTPSecure, $SMTPAuth, $Username, $Password;
    public $SMTPDebug, $Timeout, $CharSet, $Subject, $Body;
    private $recipient, $sender, $reply;
    public function __construct($exceptions = true) {}
    public function isSMTP() {}
    public function setFrom($address, $name) { $this->sender = $address; }
    public function addAddress($address) { $this->recipient = $address; }
    public function addReplyTo($address, $name) { $this->reply = $address; }
    public function send()
    {
        if ($this->Host !== 'mail.privateemail.com' || $this->Port !== 465
            || $this->SMTPSecure !== 'ssl' || $this->SMTPAuth !== true
            || $this->SMTPDebug !== 0 || $this->Username !== $this->sender
            || $this->recipient !== 'recipient@example.org' || $this->reply !== 'visitor@example.org'
            || $this->Password !== 'fake-test-password') {
            throw new \RuntimeException('SMTP setup mismatch');
        }
        if (ini_get('sendmail_path') === '/bin/false') throw new \RuntimeException('Simulated SMTP failure');
        return true;
    }
}
