# Grade09 English 9 Objective Evidence / Science 9 Cumulative Assessment Ownership
Date: 2026-11-20
Status: SOURCE CHANGES COMMITTED; SYNTHETIC ENGLISH PUBLISHER CHECKS 12/12 PASS; POST-COMMIT STATIC CHECKS 10/10 PASS; GITHUB ACTIONS & REAL BROWSER PENDING.

## English 9 source inventory
The actual English 9 midterm and final pages load `assets/fixed-assessment-v1.js`, which calls the canonical `KhaemenesHighAssessmentAdapter.complete()` for `kind=midterm` or `kind=final` and a fixed-form question count (30 and 50 respectively). The canonical Monte Carlo engine retains attempts (id, kind, completedAt, summary.correct/total/score/sessionId). The source key is `khae-ela9-assessment-v2:<kind>:learner:<encoded id>` under the Academy Course Entry Contract. Writing remains separately evaluator-reviewed. English 9 Unit 01's `assessments/unit-01/index.html` is an evaluator-evidence gateway, NOT a source of numeric unit grades; no grades were fabricated.

## Implementation
- `courses/shared/english9-objective-assessment-publisher.js`: validates only Grade09 matching active learner and learner-scoped 30-point midterm/50-point final assessment attempts, including reconciled percentage and timestamp, then publishes a separate `english-9-objective-evidence` course-summary index to the existing Academy continuation ledger. It sends only earned/possible/time/id, never question IDs/answers/reviewSkills. Requires original source authority, does not copy unscoped evidence, never changes scores/mastery/credit, and rejects conflicting record ownership.
- `portfolio/index.html`: loads the publisher after the common Grade09 learner context; bumps the report's cache version.
- `portfolio/portfolio-academic-report.js`: excludes objective sidecar from general course-grade averages, but explicitly renders its scored objective midterm/final section and includes it in JSON export/assessment count, marked as not a verified official grade.
- `tools/validate-student-portfolio-refresh.mjs`: cache assertion aligned to current source.
- `tools/validate-english9-objective-assessment-publisher.mjs`: 13-case standalone synthetic test committed; included in existing portfolio GitHub Actions workflow.

## Science 9 census and explicit HOLD
Direct inspection of `courses/science/integrated-science-9/assessments/units-01-04/index.html`, `assessments/midterm-practice/index.html`, and `assessments/final-exam/index.html` finds local keys:
- `khaemenes_science_units01_04_benchmark_v1` — 60-point objective benchmark; 40-point constructed responses subject to evaluator scoring.
- `khaemenes_science_midterm_u00_06_v1` — 70-question public-practice midterm objective.
- `khaemenes_science9_final_exam_v1` — 104-question public-practice final objective.
These pages use raw unscoped localStorage keys and preserve answers inside state; the final explicitly labels public practice and not an official grade. A direct continuation publisher would risk incorrectly claiming ownership and certification. NO AUTOMATIC IMPORT, ATTRIBUTION, OR OFFICIAL GRADE PUBLICATION WAS ENABLED FOR THESE SCIENCE EXAMS.
Science 9 readiness is already published separately via its learner-scoped 24-question source.

## Verification and safety
Executed a synthetic in-memory English 9 publisher harness: 12/12 PASS (midterm/final extraction, separation, answer exclusion, idempotency, foreign learner denial, absent-scoped-source denial, grade denial, owner conflicts, invalid score denial, single-exam preservation). Post-commit source/script-order/syntax checks 10/10 PASS.
The committed standalone 13-case test and GitHub Actions outcome were not independently observed; user-device acceptance pending.
No original course assessment source modified; no actual student records accessed; no Cloud/STOS T03 transfer; no browser cache deletion; no public repository education data.

## Next gates
1. Independently run full GitHub Actions portfolio regression and resolve any failures.
2. Confirm English objective midterm/final in learner's portfolio on the same browser/origin without retaking tests; verify JSON export and attempts.
3. Identify Science 9's canonical learner-linked assessment authorities and separate public-practice versus evaluator-certified exams. Build an explicitly authorized source-specific association mechanism before any import or ledger write, with synthetic no-cross-learner tests and readback.
4. Only after authentic protected cloud commissioning, test durable receipts/readback for family records.
