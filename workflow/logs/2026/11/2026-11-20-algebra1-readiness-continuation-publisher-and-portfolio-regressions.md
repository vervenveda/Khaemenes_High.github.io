# Algebra I readiness → Academy continuation publisher + Student Portfolio regression alignment
Date: 2026-11-20
State: SOURCE COMMITTED, 12/12 IN-MEMORY SYNTHETIC RUNTIME CHECKS PASS, 12/12 POST-COMMIT STATIC CHECKS PASS; GITHUB ACTIONS AND STUDENT-DEVICE ACCEPTANCE NOT VERIFIED.

## Source-derived architecture
The original Algebra I diagnostic saves `khaemenes-algebra1-diagnostic-result-v1` in browser local storage. The explicit learner-confirmed attribution path creates an exact learner-scoped record. The Academy continuation ledger persists a per-learner/per-course summary and accepts assessment items `kind:test` with `earned`, `possible`, `gradedAt`. The Student Portfolio has independent readiness and gradebook views. Account Cloud/STOS T03 production persistence is not commissioned.

## Changes
1. `courses/shared/algebra1-readiness-continuation-publisher.js`: one bounded, additive course publisher for learner-scoped Algebra I 36-item readiness. Requires matching Grade 09 identity and original diagnostic ID, reconciled numeric score and original submission timestamp. Reads the learner-scoped diagnostic through existing Course Entry Contract. Never scans unscoped scores, never modifies assessment answer data, doesn't send raw answers. Publishes a *separate* `courseId=algebra-1-readiness` continuation record, distinguishing it from graded Algebra I coursework. Reads back record and avoids re-publishing identical content.
2. `portfolio/index.html`: load publisher after existing Grade Context and before academic report; bump existing report script cache version. No new toolbar, chrome, new account registry, or alternate ledger.
3. `portfolio/portfolio-academic-report.js`: exclude the separate readiness ledger record from the course-grade report grid and averages, retain existing standalone score/date/attempt presentation; after explicit local attribution, notify readiness publisher, then refresh.
4. `tools/validate-student-portfolio-workspace.mjs`: retire stale hard-coded ledger reference expectation, assert the current dynamically resolved ledger.
5. `tools/validate-student-portfolio-refresh.mjs`: update cache reference and accept missing ledger while allowing independent readiness evidence; do not reintroduce legacy fail-closed report UI that hid a valid readiness result.
6. `tools/validate-algebra1-readiness-continuation-publisher.mjs`: new 12-case synthetic native Node regression suite; CI workflow now invokes it.
7. `.github/workflows/student-portfolio-workspace-regression.yml`: include publisher/tests in path triggers.

## Verification evidence
The live script was fetched after committing and executed with a synthetic in-memory learner/ledger test harness: **12/12 PASS** (exact distinct record, 36 scored points, readiness not grade, no answer copy, idempotency, readback, no raw storage writes, legacy isolation, foreign learner denial, missing ledger denial, other grade denial, invalid score denial). Post-commit source/JS parse and wiring checks **12/12 PASS**.
*These are in-memory and source checks, NOT the independently completed GitHub Actions suite or actual user browser tests.* Workflow runs could not be retrieved through the connector's restricted workflow-list endpoint at the time of this record.

## Holds / non-claims
- The actual minor student's reported 36/36 result on November 19 has not been read, linked, published or verified remotely.
- On the original browser, use the active Grade 9 learner and the existing portfolio `Review & Link My Saved Algebra I Result` only after confirming attribution; then Refresh Academic Evidence and run Student Records Connection & Sync Readiness.
- The publisher is browser-local continuation evidence, **not** authenticated remote storage. It does not create an official Algebra I course grade or award credit.
- No student/parent/learner identifiers or results committed to GitHub. No STOS/Account Cloud live service changes, encryption claims, API transfers or cache purges.
- Cross-device recovery, independent checkout Node test suite results, complete High School workflow clearance and actual browser/tablet acceptance remain pending.
