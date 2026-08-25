# SofL website claims ledger

## Release status

**BLOCKED — do not deploy publicly.**

The two new comparative-performance claims were supplied for visual review but
do not yet have matched evidence in this workspace. All figures remain subject
to final owner approval.

## Externally visible numerical claims

| Claim | Visible context and qualification | Provenance | Status |
| --- | --- | --- | --- |
| `28× faster` | Matched commercial baseline; N64 reference workload; relative execution time | User direction, 2026-08-25. Exact baseline and artifact not supplied. | **Blocked** |
| `3,000×` | Reference Python implementation; explicitly described as not optimized native code | User direction, 2026-08-25. Python implementation and artifact not supplied. | **Blocked** |
| `4,096 × 64` | Paths × fixing dates for the qualified N64 reference workload | Supplied website brief, 2026-08-25 | Review required |
| `1 CPU core` | Intel Sapphire Rapids; engine-running request-to-result boundary | Supplied website brief, 2026-08-25 | Review required |
| `~20× lower observed absolute error` | GeoCV versus plain on the qualified N64 ATM GBM contract; explicitly case-specific | Supplied website brief, 2026-08-25 | Review required |
| `≈ 0.0234` | Plain absolute error, 4,096 paths, N = 64 | Supplied website brief, 2026-08-25 | Review required |
| `≈ 0.00113` | GeoCV absolute error, 4,096 paths, N = 64 | Supplied website brief, 2026-08-25 | Review required |
| `7.11 × 10⁻¹⁵` | Analytic geometric absolute error | Supplied website brief, 2026-08-25 | Review required |
| `N = 2 … 250` | Compatible published Asian reference cases passed | Supplied website brief, 2026-08-25 | Review required |
| `16 × 1,048,576` | Independent N64 reference sampling ladder | Supplied website brief, 2026-08-25 | Review required |
| Contract values | `S0 = 100`, `K = 100`, `r = 3%`, `q = 0`, `σ = 20%`, `T = 1 year`, `N = 64`, `4,096` fixed QMC paths | Supplied website brief, 2026-08-25 | Review required |
| Reference method | Sixteen independent replications, 1,048,576 requested samples each, Student-t 95% CI | Supplied website brief, 2026-08-25 | Review required |

No microsecond latency is displayed in the production page.

## Evidence required for the `28×` claim

- Name and version of the commercial baseline.
- Same contract, path count, fixing count, numerical precision, outputs, and
  lifecycle boundary.
- Same CPU model, pinning, frequency policy, compiler/runtime conditions, and
  warm/fresh state definition.
- Raw native timing artifact at a new path; no emulated timing.
- Frozen aggregation rule and exact displayed ratio.
- Approval of whether the public label may say “commercial baseline,” name the
  vendor, or use a narrower description.

## Evidence required for the `3,000×` claim

- Frozen Python source, Python version, dependencies, and invocation.
- Exact equivalence of contract, path/fixing counts, outputs, precision, and
  lifecycle boundary.
- Hardware and runtime environment.
- Raw native timing artifact and aggregation method.
- Public qualifier stating that the baseline is a reference implementation and
  not optimized native code.

## Copy exclusions checked

The public page must not contain unqualified “world's fastest,” “fastest in
finance,” “industry-leading,” “best-in-class,” “production proven,”
“bank-grade,” or named competitor claims without separately approved evidence.
