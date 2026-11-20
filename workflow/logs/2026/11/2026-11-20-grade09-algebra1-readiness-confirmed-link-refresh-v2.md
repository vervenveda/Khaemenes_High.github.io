# Grade09 Algebra I readiness — Portfolio Refresh v2
Date: 2026-11-20
Status: SOURCE REPAIR COMMITTED / JS PARSE PASS / REAL LEARNER BROWSER RETEST REQUIRED

## User-reported regression
The learner reportedly completed Algebra I readiness on 2026-11-19, score reported by family as 36/36, but Refresh Academic Evidence in the Grade 9 Student Portfolio still did not show the score. This report does not have browser/device access, so the actual attempt score and timestamp have **not** been verified.

## Concrete code findings
- Diagnostic originally persists `khaemenes-algebra1-diagnostic-result-v1` without an attached learner suffix. Learner-scoped archival requires the diagnostic's Begin Lesson attribution path, which may be bypassed.
- Portfolio v3 read only scoped result scores. Unscoped results were signaled but not linked from Portfolio.
- Portfolio v3 also returned early when the independently loaded course continuation ledger was unavailable, suppressing otherwise valid readiness evidence.

## Repairs in `portfolio/portfolio-academic-report.js`
- Continue to read exact learner-scoped diagnostic results by ID `KH-MATH-A1-DIAGNOSTIC` and 36/36 score constraints, keeping readiness separate from official course grade.
- Do not let temporarily missing course-continuation service suppress independently saved diagnostic evidence.
- Validate the original unscoped diagnostic before enabling learner-link action; expose `Review & Link My Saved Algebra I Result` only for a valid scored attempt.
- Require user confirmation that the selected learner completed it, re-check selected learner identity afterwards, create/merge a learner-scoped copy idempotently, read it back, and retain original diagnostic untouched. Deny conflicting learner-scoped evidence.
- No automatic student attribution, no grade/mastery authority change, no cloud sync claim, no deletion, no automatic local cleanup.
- Update `portfolio/index.html` cache revision to `20261120-algebra-readiness-confirm-v4`.

## Verification
Fetched committed source and parsed JS with `new Function`: **SYNTAX_PASS**. Verified new link button source, explicit confirmation guard, deletion API absence, and absence of former ledger-dependent early exit.
**No** live browser click, verified learner ID, originating-device storage read, saved receipt, full runtime test, or independent protected Account Cloud readback has occurred.

## Device-specific next acceptance
Open `https://vervenveda.com/Khaemenes_High.github.io/portfolio/index.html?grade=09` on the original browser/device with the registered Grade 9 learner selected.
1. Press Refresh Academic Evidence.
2. If `Review & Link My Saved Algebra I Result` appears, confirm only if this learner took that test. Validate score/date afterwards.
3. If linked score already appears, confirm 36/36 and Nov 19 timestamp.
4. If no evidence appears, do read-only origin/key status inspection on originating device (do NOT retake or clear browser data). If a different device, Account Cloud has not yet proven synchronized persistence.
5. Export original diagnostic result and safely preserve it before any migration.
