# Contact form: one-time Namecheap setup

Do this before deploying the form update. No mailbox credentials belong in Git.

1. In cPanel File Manager, go to your account home directory, one level above
   `public_html` (the same directory that contains `repositories`).
2. Create `sofl-contact-config.php` there, **outside public_html and outside the
   Git clone**. Paste this template and privately replace the two placeholders:

   ```php
   <?php
   return [
       'recipient' => 'YOUR_PRIVATE_RECEIVING_ADDRESS',
       'sender' => 'YOUR_HOSTING_APPROVED_SENDER_ADDRESS',
   ];
   ```

3. Set its permissions to `600`. The account running PHP needs read access.
   The account home must also be writable by PHP for `sofl-contact-rate.json`.
4. Choose PHP 8.1 or newer in cPanel's PHP settings.
5. Use **Git Version Control → Manage → Pull or Deploy → Update from Remote**,
   then **Deploy HEAD Commit**. The existing `.cpanel.yml` copies only `site/`.
6. Send one real test enquiry through the website. Confirm receipt and that
   Reply responds to the visitor. Check spam and cPanel Track Delivery if needed.

For PHP `mail()`, Namecheap requires a sender on a domain hosted on its server
with suitable local mail routing. Use the hosting-approved sender, not the
visitor's address. The visitor goes in Reply-To. If the domain uses an external
mail provider, ask Namecheap which sender/subdomain is valid for PHP mail; do
not change the main domain's routing blindly. SMTP would need a separate setup.
See [Namecheap contact-form guidance](https://www.namecheap.com/support/knowledgebase/article/10038/31/how-to-configure-a-contact-form-with-us/).

The handler returns a generic unavailable response if configuration is missing
or mail submission fails. It never returns the configured addresses or errors.
Messages are delivered to the fixed configured recipient only; no automatic
visitor confirmation email is sent. The form also works without JavaScript,
using a simple response page.

Local verification for this change: JavaScript syntax and Git whitespace checks
passed; current production and prototype source contain no recipient address or
email links. PHP execution and actual email delivery remain unverified and must
be tested on Namecheap. `tests/contact.php` provides isolated PHP checks with
fake mail transports for a PHP-equipped development environment; it was not run
locally. No container is needed on Namecheap.

Do not deploy this PHP endpoint on a static-only hosting service. The current
local Python server previews the layout only. For a functional development
preview use PHP's built-in server, with a fake mail transport for tests.

Copy deployment does not remove obsolete files already in `public_html`.
Historical Git commits and screenshots can still contain former contact links;
removing current links cannot revoke previously published addresses.
