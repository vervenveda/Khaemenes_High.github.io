# Grade09 Algebra I readiness evidence missing from Portfolio Refresh — repair
Date: 2026-11-20
Evidence sought: learner reports Algebra I 36-question readiness assessment completed 2026-11-19 (reported score 36/36; actual device record not yet independently read).
Status: SOURCE FIX COMMITTED / 13 STATIC CHECKS PASS / LIVE BROWSER RECORD & ACCOUNT CLOUD PERSISTENCE HOLD

## Root causes confirmed in source
1. `courses/mathematics/algebra-1/diagnostic/index.html` persists attempts in a distinct browser localStorage key `khaemenes-algebra1-diagnostic-result-v1` and can later attach passing evidence to a learner-scoped key explicitly on its learner-confirmed Begin Lesson action. This diagnostic does not itself publish a regular course grade to the continuation ledger.
2. `portfolio/portfolio-academic-report.js` read only `KhaemenesLearningContinuation.readLearner` and ignored the diagnostic's separate key.
3. Portfolio captured `window.KhaemenesLearningContinuation` at initial evaluation, while the service is injected asynchronously by `courses/shared/course-entry-contract.js`. The static capture could remain unavailable even after a late load.

## Minimal repair (NO changes to assessment engine or saved data)
- Portfolio reads `window.KhaemenesLearningContinuation` afresh on each refresh and listens for `khaemenes-learning-continuation-ready`.
- It checks only the **currently verified selected learner's scoped** Algebra I readiness record and validates exact assessment ID, 36 total points, finite score/percent reconciliation and submitted timestamp.
- Displays linked readiness separately from Algebra I course grades in the report, JSON export, printable view and assessment count; clearly warns it is browser-local, not official course credit or cloud confirmed.
- If only unscoped legacy evidence is found on that device, it **withholds score and ownership attribution** and provides a review link to the existing diagnostic, whose Begin Lesson path can explicitly link eligible attempts. The portfolio itself never copies or mutates unscoped source material.
- Updated `portfolio/index.html` script query version for browser cache refresh.

## Static post-commit checks (13/13)
- Refresh handler retained
- Dynamic continuation getter
- Continuation-ready event
- Original diagnostic key matches
- Exact assessment and 36-item validation
- Learner-scoped read
- Unscoped score withheld
- No portfolio assessment writes
- Official-grade separation
- Printable display
- JSON export
- Script cache revision
- Existing diagnostic learner-confirmed path preserved

## Holds
- **Not** yet established that the particular November 19 attempt exists in the currently opened browser/origin; if taken on a different laptop, its localStorage record may not be here.
- No live Chrome DOM test, independent browser regression, student-specific score verification, encrypted archive, authenticated Account Cloud upload, storage receipt or readback.
- No actual student data, family identity, scores or credentials fetched into GitHub or this audit.
- Do not re-take the assessment merely to resolve portfolio display. Read-only inspect the originating laptop's saved result and preserve a verified copy before any migration.
