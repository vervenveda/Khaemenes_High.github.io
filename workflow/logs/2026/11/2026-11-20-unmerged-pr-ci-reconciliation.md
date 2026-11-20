# High School unmerged PR + failing workflow reconciliation
Date: 2026-11-20
Status: SOURCE REPAIRS COMMITTED; BROAD RELEASE GREEN NOT YET VERIFIED; NO PRS MERGED OR CLOSED

## Open pull-request inventory
12 open PRs: #84, #83, #82, #81, #80, #79, #78, #77, #61, #59, #32, #11.
Seven drafts (#78–84). Prior GitHub mergeability returned false for 11 PRs; only #82 was mergeable into its PR #81 branch (not into main). #84 modifies Grade09 Schedule ownership; #83 modifies retired global Chrome references and Electives; #82 changes 36 files; #81/80 overlap English assessment CSS. #79/78 change student lesson routes. Old PRs #77, #61, #59, #32, #11 each need source-to-main reconciliation rather than bulk merging.

## Failures reproduced from GitHub Actions logs
- Portfolio regression: stale assertion expected `record.courseId==="algebra-1-readiness"`, but report correctly excludes multiple readiness/objective evidence sidecars in one array.
- Grade-aware execution matrix: English9 source `curriculum.json` actually stores `weeks:36`; 80% gate lives in actual English9 executable HTML, while test incorrectly demanded `weeksCount` and `passingTarget` on that JSON.
- Grade11 landing parity: missing sixth slot Psychology/Life Skills; Personal Finance incorrectly occupied an eight-class slot while labels were `Subject nn of 08` rather than canonical six core + two elective labels.
- High School route validator: English9 intentionally has sole inline canonical CSS owner and no `high-navigation-v1.css`; test required competing CSS.
- Grade09 quicklink workflow: tried checking retired `seven-class-schedule.js`, and two older tests demanded retired `grade09ScheduleDialog`; current Grade09 Schedule has its own `schedule/index.html`.
- Lower-right toolbar audit demanded a retired helper name instead of asserting the existing idempotent canonical dock guard.
- High Mentor Bridge Validation: file `stos/khaemenes/assets/vnv-beta-link.js` contains live URL references; current security test explicitly requires STOS neutral files contain no network transport markers. This remains a **SECURITY HOLD** until the actual STOS bridge is reviewed; do not weaken this test or activate it.

## Targeted changes on main
1. `tools/validate-algebra1-readiness-continuation-publisher.mjs`: assert current sidecar exclusion in Portfolio rather than obsolete single condition. GitHub Actions `Student Portfolio and Homeschool Report` PASS at commit `398bd84408`.
2. `tests/test-course-execution-matrix.cjs`: accept actual source schema `weeks:36` and verify English9's executable 80% gate without modifying curriculum. Grade-aware execution matrix PASS at `8b6e4c782`.
3. `grades/grade-11/index.html`: restore Psychology/Life Skills as Core06; keep Personal Finance as separate companion link; label six core and two elective slots to match other grades. Four-grade and Public Entry validations PASS at `8b6e4c782`. Psychology route uses existing Grade11 Student Schedule, not invented course URL.
4. `tools/test-high-navigation-routes.mjs`: respect English9 approved inline CSS owner rather than load another .css layer. Subsequent Public Entry validation PASS.
5. `.github/workflows/high-student-profile-quicklink-validation.yml`: remove syntax check of missing retired `seven-class-schedule.js`.
6. `tools/audit-lower-right-utility-conflicts.mjs`: validate existing `vnvEcosystemUtilityDock` guard in canonical navigation.
7. `tests/grade09-dashboard-entry-regression.test.mjs` and `tools/validate-high-student-journey.mjs`: verify the canonical dedicated Schedule page, not legacy Schedule dialog.
No Assessment/learner records, grades, STOS cloud records, or VNV gateway files were changed.

## Current acceptance boundary
The latest full set of CI checks may still be running or awaiting completion. Successful checks at older commits do not certify a new release HEAD. High Mentor Bridge security hold remains. No PR merge decisions have been executed. Do not bulk merge #78–84 or overwrite canonical Grade09 navigation to satisfy outdated branches.
