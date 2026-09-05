# SofL website

Public website for `sofl.io`, with a small PHP contact handler. There is no
build step, CMS, analytics, cookie state, or runtime third-party dependency.

The selected visual direction is a monochrome scientific-editorial system:
compact boxed navigation, oversized sans/serif typography, asymmetrical proof
cards, and a simple animated relative-performance field.

The hero sequence uses a locally hosted GSAP 3.15 core build to orchestrate an
inline SVG. GSAP has no runtime dependencies or external network request; its
license notice is retained in `site/js/vendor/gsap.min.js`.

The approved SofL artwork is stored as the optimized transparent asset
`site/assets/logo.png` and is used in the header and footer. It makes no
external request.

## Status

**Review build — public deployment is blocked.**

The visible `28×` commercial-baseline comparison and `3,000×` Python
comparison require final matched-baseline evidence and copy approval. See
[`review/CLAIMS.md`](./review/CLAIMS.md).

## Directories

- `site/` — the website and PHP contact handler;
- `animation-lab/` — a private, no-index gallery of 20 hero animation studies;
- `prototypes/` — the three first-screen direction studies;
- `review/` — screenshots, claims, source artwork, and audit reports.

The current review set is documented in [`review/QA.md`](./review/QA.md).

Only the contents of `site/` belong in the public web root.

## Local preview

From this directory:

```sh
python3 -m http.server 4173 --directory site
```

Then open `http://127.0.0.1:4173/`.

The page should be served over HTTP while reviewing. Opening `index.html`
directly also works, but a local server more closely matches deployment.

## Animation lab

The animation lab intentionally sits outside `site/`, so it is not included in
the production upload package. From the project root, run:

```sh
python3 -m http.server 4205
```

Then open `http://127.0.0.1:4205/animation-lab/`.

The lab contains 20 finite, replayable SVG/GSAP studies, a large focus mode,
previous/next keyboard navigation, visible-scene replay controls, and a
reduced-motion state. Candidate figures are explicitly marked as concept data
and the page is `noindex, nofollow`.

The production homepage currently promotes candidate `06 — Ratio Cut`. All 20
studies remain in the lab as a reusable motion library for later sections and
future page variants.

## Contact behavior

Evaluation buttons lead to the message form. The PHP handler reads the recipient
and sender from a private file outside the web root and repository. See
[contact setup](./CONTACT-SETUP.md) before deploying this update. PHP 8.1 or newer
is required. A Python static preview cannot process submissions.

The handler validates fields, rejects header injection and cross-site browser
requests, includes a honeypot, and limits each IP to five submissions per hour
with a 30-second cooldown and a site-wide maximum of 40 per hour. These limits
reduce abuse; they do not guarantee zero spam. Rate data expires after an hour
and contains hashed IPs and timestamps, not message contents. A successful
response means the mail server accepted the message, not confirmed inbox delivery.

Previous Git commits and historic review artifacts may still contain the former
address. This change does not rewrite Git history.

## Namecheap cPanel deployment

1. Complete and approve every blocked claim in `review/CLAIMS.md`.
2. Confirm the canonical production URL is `https://sofl.io/`.
3. Back up the current `public_html` directory if it contains existing files.
4. Upload the **contents** of `site/` into `public_html`; do not upload the
   enclosing `site` directory.
5. Preserve the `assets/` and `js/` directory structure.
6. Enable or confirm HTTPS for `sofl.io` and redirect HTTP to HTTPS in cPanel.
7. Check the home page, favicon, social preview image, navigation anchors,
   evaluation buttons, `robots.txt`, and `sitemap.xml` from the public domain.

Do not upload `prototypes/` or `review/`.

## Review checks

- Test widths: 1440, 1280, 1024, 768, 430, and 390px.
- Confirm keyboard focus, mobile menu, details disclosure, and message form.
- Test with JavaScript disabled and with reduced motion enabled.
- Run Lighthouse against the locally served `site/` and retain its HTML/JSON
  reports under a new `review/lighthouse/` path.
- Confirm no third-party network requests are introduced.

## Fonts

Instrument Sans is bundled locally in WOFF2 format. Its SIL Open Font License
is included at `site/assets/fonts/OFL.txt`.
