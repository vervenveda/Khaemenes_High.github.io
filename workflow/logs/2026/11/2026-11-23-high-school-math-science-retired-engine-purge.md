# High School Math + Science Retired Engine Purge — 2026-11-23

## Intent
Verify that retired High School Math and Science engines are not active, remove obsolete hooks/files, migrate stale infrastructure references to current authorities, and add fail-closed CI firewalls.

## Science
- Removed retired Upper Science presentation-controller hooks from all 540 Biology 10, Chemistry 11 and Physics & Engineering 12 daily lessons.
- Removed the retired Science 9 Unit 01 Day 01 prototype double-mount and retained the current Science 9 engine.
- Deleted retired engine files, pilot workflows, tests and blueprints for:
  - `science-lesson-engine-v0.1.js`
  - `upper-science-instruction-engine-v1.js`
- Updated Science validators/browser matrix to treat upper courses as course-native rather than requiring the retired shared engine.
- Added `courses/science/tools/audit-retired-science-engine-hooks-v1.mjs` and wired it into Science certification CI.
- Repaired the remaining Biology Week 01 Day 01 department header asset path.
- Repository dependency failures fell from 536 missing local references before purge to zero at the dependency-crawl step after repair.
- Observed Science CI:
  - retired-engine hook firewall: PASS
  - four-year program authority: PASS
  - Chrome browser/device smoke matrix: PASS
  - Biology 10 Course Integrity: PASS
  - Science Student Experience Regression: PASS
  - strict 720 curriculum-depth gate remains a separate FAIL because of its curriculum-marker semantics, not legacy engine hooks.

## Mathematics
- Verified all 13 Algebra I unit mastery pages load current `unit-mastery-engine-v3.js`; none loaded retired `legacy-mastery-engine-v2.js`.
- Verified the old Pre-Algebra Unit 01 engine preview was not linked from the unit or course home.
- Deleted:
  - `courses/mathematics/algebra-1/assets/legacy-mastery-engine-v2.js`
  - `courses/mathematics/pre-algebra/units/unit-01/lessons/lesson-01-number-systems-engine-preview.html`
- Migrated Algebra I service-worker and stale validator/test references from retired v2 assumptions to the current v3 fixed-form contract.
- Aligned Unit 13 answer-key metadata to the current 25-question fixed-form v3 authority; removed the obsolete v2 per-form quantitative guarantee.
- Added `tools/audit-retired-math-engine-hooks-v1.mjs` and wired it into Mathematics Engine lesson-shell integrity CI.
- Observed Math CI:
  - Reject retired Mathematics engine hooks: PASS
  - Mathematics adapter/version and assessment firewall: PASS
  - Algebra I Whole-Course Validation: PASS
  - Public Entry Route Validation: PASS

## Current architecture boundary
The purge removed obsolete presentation/prototype engine generations only. Current course-specific Math engines, Science 9 current engine, course-native Biology/Chemistry/Physics lesson scripts, assessment engines, records, labs, evidence stores, mastery authorities and learner-scope systems were preserved.

## Result
**RETIRED MATH/SCIENCE ENGINE PURGE: PASS**

Any future active reintroduction of the retired Math or Science engine hooks is now designed to fail CI.
