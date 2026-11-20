# 2026-11-20 · Integrated Science 9 assessment shell verification

## Scope

Canonical VNV/Khaemenes assessment-shell normalization for Integrated Science 9.

Covered front-door / cumulative surfaces:
- Assessment Center
- Unit 00 diagnostic landing
- Science 9 readiness diagnostic
- Units 01–04 cumulative benchmark
- Midterm practice benchmark
- Units 05–07 cumulative benchmark
- Units 08–09 transition benchmark
- Units 10–12 cumulative benchmark
- Comprehensive final practice assessment

Covered unit assessment surfaces:
- Unit 01–12 `mastery-quiz.html`
- Unit 01–12 `unit-assessment.html`

Total protected science assessment pages covered by the new validator: **33**.

## Presentation cleanup

Removed legacy local `site-header` ownership and embedded `khaemenes-typography-standard` blocks from the cumulative benchmark pages and all 24 unit assessment pages.

The Science 9 Assessment Center itself contained one remaining embedded typography authority; it was removed in commit:
`77f6d1843bbf3736c8a19da9e85602023ff301bc`

Every covered page now uses the shared assessment shell with:
- one 333 ticker
- one AutoPopulate ticker
- one official hamburger-only VNV/Khaemenes header
- one lower-left class tools / translator path
- one lower-right ecosystem toolbar

## Protected runtime evidence

The following assessment owners were retained:
- `monte-carlo-assessment-v1.js`
- per-assessment cumulative question banks
- `readiness-app.js`
- `readiness-routing.js`
- Unit 01–12 `question-bank.js`
- Unit 01–12 `quiz-app.js`
- Unit 01–12 `assessment-app.js`
- learner scope `integrated-science-9`

Observed cumulative objective thresholds remained intact:
- Units 01–04: 48/60
- Midterm practice: 56/70
- Units 05–07: 48/60
- Units 08–09: 48/60
- Units 10–12: 48/60
- Final practice: 84/104

Unit assessment pages retain their published 80% mastery contracts, correction/retest language, and human-scored constructed-response boundaries where present.

## Regression coverage

New validator:
`tools/validate-science9-assessment-vnv-shell.mjs`

Validator creation commit:
`1068cacb7a985e8100ae26b06f0d28e5bc90405a`

Workflow integration commit:
`a907179abcd95c93d134e1adfac37259b1b407ba`

The validator is now included in `.github/workflows/no-page-regulator.yml`.

## Source verification

Direct repository-source verification of:
- Units 01–06 mastery + unit assessment pages: PASS
- Units 07–12 mastery + unit assessment pages: PASS
- Assessment Center + readiness + cumulative benchmark/final pages: PASS

No local site headers, embedded typography authority, duplicate canonical tickers/header/tools/ecosystem loaders, or missing protected science runtimes were found in the verified set.

## Hosted CI / browser boundary

**SOURCE VALIDATION: PASS**

**HOSTED GITHUB ACTIONS RUN: UNVERIFIED** — the GitHub connector returned no workflow run for the workflow-integration commit.

**BROWSER / DEVICE ACCEPTANCE: HOLD**
