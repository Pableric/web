# SofL website

Static public website for `sofl.io`. There is no build step, backend, CMS,
analytics, cookie state, or runtime third-party dependency.

The selected visual direction is a monochrome scientific-editorial system:
compact boxed navigation, oversized sans/serif typography, asymmetrical proof
cards, and a simple animated relative-performance field.

The hero sequence uses a locally hosted GSAP 3.15 core build to orchestrate an
inline SVG. GSAP has no runtime dependencies or external network request; its
license notice is retained in `site/js/vendor/gsap.min.js`.

The approved SofL artwork is stored as the optimized transparent asset
`site/assets/logo.png` and is used in the header and footer. The leadership
portrait is stored locally as `site/assets/deni-ceo.webp`; neither asset makes
an external request.

## Status

**Review build — public deployment is blocked.**

The visible `28×` commercial-baseline comparison and `3,000×` Python
comparison require final matched-baseline evidence and copy approval. See
[`review/CLAIMS.md`](./review/CLAIMS.md).

## Directories

- `site/` — the complete upload-ready static website;
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

The email address is not shown in visible page copy. Evaluation buttons use a
labeled `mailto:` link. This keeps the interface clean, but the destination is
necessarily present in the HTML source. Avoiding source exposure would require
a form relay or another backend service, which is intentionally outside v1.

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
- Confirm keyboard focus, mobile menu, details disclosure, and mail links.
- Test with JavaScript disabled and with reduced motion enabled.
- Run Lighthouse against the locally served `site/` and retain its HTML/JSON
  reports under a new `review/lighthouse/` path.
- Confirm no third-party network requests are introduced.

## Fonts

Instrument Sans is bundled locally in WOFF2 format. Its SIL Open Font License
is included at `site/assets/fonts/OFL.txt`.
