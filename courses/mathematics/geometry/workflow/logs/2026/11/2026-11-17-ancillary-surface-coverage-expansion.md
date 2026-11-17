# 2026-11-17 · Geometry Ancillary Surface Coverage Expansion

- Repository: `vervenveda/Khaemenes_High.github.io`
- Timezone: America/New_York
- Type: repair · coverage · canonical chrome
- State: source coverage PASS; rendered browser/device acceptance HOLD

## Finding

The first Geometry unification batch reached:
- course landing;
- Unit 01–13 dashboards;
- lesson pages;
- assessment-engine surfaces.

A second audit showed additional student/family/teacher surfaces that did not directly load the Geometry presentation unifier:
- Foundation/Core/Extended practice pages;
- unit projects;
- family guides;
- teacher guides;
- assessment center pages;
- records/completion pages;
- teacher portal.

Representative Unit 01 and Unit 13 samples all already load the canonical `assets/high-school-global-chrome-v2.js`.

## Repair

Added a Geometry-path-only hook to:
- `assets/high-school-global-chrome-v2.js`

When the current path matches `/courses/mathematics/geometry/`, canonical High School chrome now loads:
- `courses/mathematics/geometry/assets/geometry-presentation-unifier-v1.js`

Commit:
- `ab43b28a6d9c0e5b0b33aea150e1024d9dc0168c`

The hook is path-scoped and does not alter other High School courses.

## Coverage verification

Representative early-course surfaces verified with canonical global chrome:
- Unit 01 Core Practice
- Unit 01 Foundation Practice
- Unit 01 Project
- Unit 01 Family Guide
- Unit 01 Teacher Guide
- Unit 01 Mastery Check
- Assessment Center
- Midterm
- Records
- Completion Certificate
- Teacher portal

Representative capstone surfaces verified:
- Unit 13 Core Practice
- Unit 13 Extended Practice
- Unit 13 Project
- Unit 13 Family Guide
- Unit 13 Teacher Guide
- Unit 13 Mastery Check
- Final Examination

These pages therefore inherit the Geometry unifier through the canonical High School chrome.

## Runtime inheritance

On eligible Geometry pages the inherited unifier provides:
- canonical dual ticker loader;
- translator loader;
- duplicate branded-header demotion to local Geometry navigation;
- repeated hero-badge removal;
- runtime 16px readability authority.

## Browser evidence limitation

The canonical `vervenveda.com` pages are reachable through the text browser, but that crawler does not execute the JavaScript presentation unifier and some landing snapshots are stale. Therefore crawler output is not sufficient evidence of final visible runtime layout.

Rendered viewport acceptance remains HOLD.

## Next architecture target

The Geometry landing dashboard still contains a major asymmetric `col4` + `col8` peer-card split (Learner Record versus Next Step). Normalize major peer cards while preserving functional hierarchy and progress logic.
