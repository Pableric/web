# SofL website QA summary

- Date: 2026-08-25
- Production directory: `site/`
- Audit URL: local static server at `http://127.0.0.1:4193/`

## Lighthouse

Current homepage reports, including the final logo and leadership section, are
in [`lighthouse/2026-08-25-logo-leadership/`](./lighthouse/2026-08-25-logo-leadership/).

| Mode | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 97 | 100 | 100 | 100 | 2.2 s | 0.001 | 10 ms |
| Desktop | 100 | 100 | 100 | 100 | 0.5 s | 0.002 | 0 ms |

Earlier dated audits remain preserved under `review/lighthouse/`. The first
scored 95 for accessibility because one 10px label measured 4.45:1 contrast;
the later and current audits reach 100.

The audit includes the locally hosted GSAP 3.15 core build. GSAP is 72,927
bytes raw and 28,284 bytes gzip. Lighthouse observed only same-origin requests;
there are no external runtime requests.

## Responsive captures

Current completed-state hero captures are in
[`screenshots/home-ratio-cut-2026-08-25/`](./screenshots/home-ratio-cut-2026-08-25/). They were
captured with reduced motion enabled so the final composition is deterministic.

Logo and leadership captures at 1440 × 1100 and 390 × 844 are in
[`screenshots/logo-leadership-2026-08-25/`](./screenshots/logo-leadership-2026-08-25/).

The full layout-match capture set remains in
[`screenshots/layout-match-2026-08-25-v5/`](./screenshots/layout-match-2026-08-25-v5/).

- 2482 × 1023 exact supplied-reference viewport check;
- 1994 × 1113 reference-viewport geometry check;
- 1440 × 1100;
- 1280 × 1000;
- 1024 × 1000;
- 768 × 1000;
- 430 × 932;
- 390 × 844.

## Animation lab

The private 20-candidate motion gallery is in `animation-lab/`; it is outside
the production `site/` directory and carries `noindex, nofollow` metadata.

Current lab captures are in
[`screenshots/animation-lab-2026-08-25-v2/`](./screenshots/animation-lab-2026-08-25-v2/),
including a single 1440px image containing all 20 completed states.

Current lab Lighthouse reports are in
[`lighthouse/2026-08-25-animation-lab-v3/`](./lighthouse/2026-08-25-animation-lab-v3/).

| Mode | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 99 | 100 | 100 | 60* | 2.0 s | 0.005 | 20 ms |
| Desktop | 100 | 100 | 100 | 60* | 0.5 s | 0.003 | 0 ms |

`*` The lab's SEO score is intentionally reduced because search indexing is
explicitly blocked. This is the correct state for private claim exploration.

Only candidates close to the viewport are initialized. Off-screen timelines
are paused, completed scenes do not loop, and reduced-motion users receive the
final static composition.

## Manual and static checks

- Semantic landmark and heading structure audited by Lighthouse.
- Keyboard focus styles, skip link, native mobile disclosure, methodology
  disclosure, and evaluation links are present.
- Core content remains visible with JavaScript disabled.
- The homepage promotes animation-lab candidate `06 — Ratio Cut`: a faint
  `FASTER` word field enters, a precision rule sweeps downward, and the `28×`
  comparison is revealed before the evidence bars resolve. It does not loop.
- Reduced motion bypasses GSAP and resolves every animation immediately into
  its complete state.
- No horizontal overflow was observed at the six required widths.
- The production palette is neutral black, white, and gray; no color accent is
  present in the interface, favicon, logo, or social-preview asset.
- The supplied logo is rendered from a 7.4 KB optimized transparent PNG in the
  header and footer. The supplied CEO portrait is a local 86 KB WebP, lazy
  loaded below the fold with explicit intrinsic dimensions and descriptive alt
  text.
- All production files, fonts, favicon, social image, `robots.txt`, and
  `sitemap.xml` return HTTP 200 locally.
- SVG and sitemap XML parse successfully.
- GSAP is served locally, retains its license notice, and introduces no
  third-party runtime request.
- No visible email address is rendered; the destination remains in labeled
  `mailto:` links as documented in the README.
- No microsecond figure is rendered.
- Prohibited superlatives, named competitor copy, and proprietary architecture
  terminology were not found in `site/`.

## Release gate

Visual and technical QA is complete. Public release remains blocked solely by
the claims review in [`CLAIMS.md`](./CLAIMS.md), especially the `28×` and
`3,000×` comparisons.
