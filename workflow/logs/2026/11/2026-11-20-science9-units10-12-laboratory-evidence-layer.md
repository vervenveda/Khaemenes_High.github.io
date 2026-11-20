# 2026-11-20 · Science 9 Units 10–12 laboratory evidence layer

## Scope

Canonical-shell normalization for the interactive laboratory and linked evidence-check pathway in Integrated Science 9 Units 10–12.

### Laboratories

Covered 12 interactive laboratories:
- Unit 10: Earth Interior & Plate Evidence, Watershed & Surface Change, Biogeochemical Cycles, Climate Energy Balance
- Unit 11: Solar-System Scale & Orbit, Stellar Spectra & Light, Exoplanet Transit, Galaxy Redshift & Expansion
- Unit 12: Decision Matrix, Prototype Testing, Life Cycle / Circularity, Risk / Reliability / Resilience

All laboratory-specific `*-lab.js` runtime owners were retained.

### Linked evidence checks

Covered 12 linked 8-question evidence checks, one per laboratory.

Each retained its dedicated `*-question-app.js` runtime and the published **7/8 mastery threshold**, with corrections and retakes permitted.

## Presentation cleanup

Removed where present:
- local `site-header`
- embedded `khaemenes-typography-standard`
- ecosystem-only shell ownership

Each page now uses:
- one canonical 333 ticker
- one AutoPopulate ticker
- one official hamburger-only header
- one lower-left class tools / translator path
- one lower-right ecosystem toolbar

## Unit 12 Prototype Testing safeguard

The zero-baseline guard remains intact:
- `Math.abs(bm)>1e-12`
- percent improvement becomes `null` for zero baseline
- UI reports `Not defined (zero baseline)`

No calculation logic was replaced.

## Regression coverage

`tools/validate-science9-assessment-vnv-shell.mjs` was extended to cover:
- 12 laboratories
- 12 laboratory checks
- laboratory runtime ownership
- dedicated question-check runtime ownership
- 7/8 threshold retention
- Unit 12 zero-baseline protection

Validator extension commit:
`9b0b07e6f7b88f5676f228a5825af5bb217ddabe`

## Verification

Units 10–12 laboratories: **PASS**

Units 10–12 laboratory checks: **PASS**

Hosted GitHub Actions: UNVERIFIED.
Browser/device acceptance: HOLD.
