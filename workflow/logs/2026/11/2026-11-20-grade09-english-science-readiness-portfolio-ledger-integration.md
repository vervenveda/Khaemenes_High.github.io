# Grade09 English 9 and Science 9 readiness → Academy continuation ledger
Date: 2026-11-20
Status: SOURCE IMPLEMENTATION COMMITTED / SYNTHETIC IN-MEMORY CHECK / LIVE CI AND STUDENT DEVICE PENDING

## Forensic source owners
- English 9 readiness `courses/language-arts/english-9/assessments/diagnostic/index.html`: learner-scoped `khaemenes_english9_readiness_records_v1` array and companion `khaemenes-english9-readiness-v1`; each history entry contains `assessment_id=english9-readiness-gateway`, `course_id=english-9`, `learner_id`, raw_score earned/possible (10), timestamp and overall_percent. No teacher-reviewed writing grade is inferred.
- Science 9 `courses/science/integrated-science-9/diagnostic/readiness-app.js`: learner-scoped `khaemenes_science_u00_v1`, `diagnostic` object with 24 scored questions and `completedAt`. Source includes private answer list, which is never copied to ledger.
- Existing continuation readers `courses/shared/high-school-english-continuation.js` and `high-school-science-continuation.js` publish general course navigation/progress but do not currently publish these validated readiness scores as scored items.

## Integration
- Add `courses/shared/grade09-english-science-readiness-publisher.js`, loaded by existing `portfolio/index.html` after Grade Context and before the report. This publishes two distinct readiness pseudo-course indexes, `english-9-readiness` and `integrated-science-9-readiness`, to the **existing** Academy learner continuation ledger.
- Requires exact verified selected Grade 09 learner, schema-specific eligible scored source evidence and numerical bounds; originals untouched, no loose unscoped discovery, no answer snapshots. Uses source owner values for score/time, not invented grades. Explicitly rejects unknown existing ledger record ownership, repeated rows or absent evidence. Publication is idempotent on matching assessment rows.
- Portfolio report ignores these readiness pseudo-course indexes when calculating official subject grades/averages; they are still discoverable by Student Records counts-only checker.
- Add `tools/validate-grade09-english-science-readiness-publisher.mjs` (13 synthetic assertions) and wire to existing Student Portfolio and Homeschool Report workflow. No new button, chrome layer, storage namespace or cloud connection.

## Verification
- In-process mock testing before final Science bound correction: 12/13 initial cases passed; **detected and corrected invalid 25/24 score acceptance**.
- After correction, targeted Science 25/24 rejection and 24/24 acceptance PASS. Static post-commit checks 8/8 PASS, including both JavaScript parses, script load order, subject-grade exclusion, no cloud calls, validation bound, test file presence.
- The committed standalone 13-case Node test suite and GitHub Actions workflow results have **not yet been independently observed as PASS**. Real student-device browser observations remain PENDING.

## Safety and next actions
Preserve original saved assessment/gradebook bytes. Do not promote readiness into official course grades or credit. Do not assume browser-local evidence has reached Account Cloud or STOS T03. After CI PASS, test Grade09 Portfolio in same canonical browser origin: readiness ledger rows should appear in Student Records connection counts; if grades/portfolios differ between devices, remain local until approved authenticated Account Cloud is commissioned. Next scope: separate English 9 fixed-form unit/midterm/final assessment records and Science 9 cumulative exam evidence, each with unique owner-specific schema and verifiable learner attribution.
