# 2026-11-20 · Integrated Science 9 assessment support / evidence layer

## Scope

Second-stage Science 9 hardening covering printable companions, student-record pages, and the Unit 12 prototype-testing calculation guard.

### Printable / record support pages

Canonicalized:
- Units 01–04 printable test + student record
- Midterm practice printable form + student record
- Units 05–07 printable test + student record
- Units 08–09 printable test + student record
- Units 10–12 printable test + student record
- Final printable exam + student record

Total support pages: **12**

## Removed conflicts

Across the support pages, removed where present:
- retired `vnv-beta-link.js`
- legacy local `site-header`
- embedded `khaemenes-typography-standard`

Each support page now uses the same canonical assessment shell contract:
- one 333 ticker
- one AutoPopulate ticker
- one official hamburger-only header
- one lower-left class tools / translator path
- one lower-right ecosystem toolbar

Existing printable content and record forms were preserved.

## Unit 12 Prototype Testing Laboratory

The current `units/unit-12/testing-lab.js` already contains a fail-safe zero-baseline guard.

Verified logic:
- `Math.abs(bm)>1e-12`
- `improvement=hasBaseline ? ... : null`
- output `Not defined (zero baseline)`
- explanatory status directs the learner to compare absolute means instead of reporting an invalid percent improvement

No divide-by-zero patch was required because the source is already hardened.

## Regression coverage

The existing Science 9 validator was extended to cover:
- the 12 printable/student-record support pages
- rejection of `vnv-beta-link.js`
- the Unit 12 zero-baseline guard tokens

Validator commit:
`33f7d05026b74bdef5e2daa122de6eceb99df6ee`

Direct source-equivalent verification:
**PASS**

## Boundary

Hosted GitHub Actions run evidence remains unavailable through the connector.

Source validation: PASS.
Hosted CI: UNVERIFIED.
Browser/device acceptance: HOLD.
