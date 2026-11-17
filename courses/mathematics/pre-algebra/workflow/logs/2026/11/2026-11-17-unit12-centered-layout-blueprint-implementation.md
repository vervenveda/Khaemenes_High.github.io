# Pre-Algebra Unit 12 · Centered Layout Blueprint Implementation

**Date:** 2026-11-17  
**Type:** repair · layout normalization · shared chrome  
**Authority:** `workflow/blueprints/high-school-landing-pages/pre-algebra.md`

## Scope

Twelfth implementation block under the stable High School landing-page blueprint:
- Unit 12 canonical dashboard
- Unit 12 Lessons 01–08
- new Unit 12 presentation blueprint overlay

No curriculum content, scoring logic, learner records, mastery thresholds, question banks, assessment history or course chronology were intentionally changed.

## Verified source observations

Before repair:
- Unit 12 canonical `index.html` used a `minmax(0,1fr) 330px` dashboard split with a sticky local-record rail.
- Unit 12 has one canonical landing page; no long-named duplicate landing file was present in the unit root.
- Unit 12 had no dedicated centered VNV/KA blueprint stylesheet.
- Lessons 01–08 each used a `minmax(0,1fr) 310px` lesson/record split with a sticky lesson-record rail.
- Lesson pages lacked the 333 ticker, AutoPopulate ticker and translator.
- Unit and lesson pages directly loaded the ecosystem toolbar in addition to High School global chrome.
- Unit 12 dashboard also directly loaded `vnv-header-autopopulate.js`, creating competing header ownership with High School global chrome.

## Committed repairs

### Unit 12 blueprint
Created:
`assets/unit12-vnv-ka-blueprint-v1.css`

The presentation overlay establishes:
- one centered content axis;
- max 1120px course content width;
- centered hero and actions;
- one-column unit overview/record flow;
- four equal unit-record actions, collapsing 4 → 2 → 1;
- equal 3-column lesson/resource/glossary grids, collapsing 3 → 2 → 1;
- 16px minimum controls/supporting copy and 18px instructional copy where covered;
- centered footer;
- 7px card/control radius.

### Unit 12 dashboard
The canonical `index.html` was aligned:
- removed the legacy 330px sticky side rail;
- replaced the local-record `aside` with a labeled section;
- attached the Unit 12 blueprint stylesheet;
- added `ka-unit12-approved` body class;
- added the official VNV translator;
- preserved the explicit 333 + AutoPopulate ticker pair;
- removed redundant direct ecosystem-toolbar loading;
- removed redundant direct `vnv-header-autopopulate.js` loading so High School global chrome is the sole header/hamburger/toolbar owner.

### Unit 12 Lessons 01–08
Every lesson now:
- uses one centered lesson column;
- has no 310px side rail;
- has no sticky lesson-record panel;
- uses a labeled section instead of a lesson-record `aside`;
- uses an equal five-action lesson-record grid on desktop;
- collapses to two columns on tablet with the odd final action spanning the row;
- collapses to one column on phone;
- loads one 333 ticker;
- loads one AutoPopulate ticker;
- loads one VNV translator;
- uses High School global chrome as the single header/hamburger/toolbar owner;
- no longer directly loads a competing ecosystem-toolbar script.

## Commits

- `40b0f56b` — create Unit 12 centered blueprint.
- `9eefd503` — normalize canonical Unit 12 dashboard and chrome ownership.
- `1959ebfe` — Lesson 01.
- `c90115c6` — Lesson 02.
- `dd3922b2` — Lesson 03.
- `29fb89f8` — Lesson 04.
- `04071810` — Lesson 05.
- `4c76c4b2` — Lesson 06.
- `dfde4a8a` — Lesson 07.
- `59eeedb5` — Lesson 08.

## Static validation

PASS across the canonical dashboard and Lessons 01–08:
- no 310/330/333px major page side rail;
- no sticky `.side` or `.lesson-side`;
- no unit/lesson record `aside`;
- one translator per public learning page;
- one eligible ticker owner/pair per page;
- one High School global chrome owner;
- no direct competing ecosystem-toolbar source;
- no direct competing header-autopopulate source;
- all lesson action grids include responsive 5 → 2 → 1 behavior.

## Assessment/data separation

This pass intentionally did **not** modify Unit 12 assessment totals, score display logic, mastery calculations, attempt history, question banks, or prototype-testing math. Any previously identified mismatch in displayed totals or divide-by-zero behavior remains a separate assessment/logic repair and must be handled under a dedicated workflow entry.

## HOLD

- Browser/device acceptance remains HOLD.
- Legacy sub-16px declarations remain in older inline theme CSS; blueprint/readability layers override many student-facing instances, but source-level typography cleanup remains future work.
- Practice, project, family/teacher guide, worksheet and assessment pages were not visually normalized in this pass.

## Next step

Proceed to Unit 13 using Units 01–12 as the established course pattern, then complete a course-wide static normalization audit before addressing remaining assessment/typography debt.
