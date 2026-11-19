# Pre-Algebra Unit 08 · Centered Layout Blueprint Implementation

**Date:** 2026-11-17  
**Type:** repair · layout normalization · shared chrome  
**Authority:** `workflow/blueprints/high-school-landing-pages/pre-algebra.md`

## Scope

Eighth implementation block under the stable High School landing-page blueprint:
- Unit 08 canonical dashboard
- Unit 08 Lessons 01–08
- new Unit 08 presentation blueprint overlay

No curriculum content, scoring logic, learner records, mastery thresholds, question banks, assessment history or course chronology were intentionally changed.

## Verified source observations

Before repair:
- Unit 08 canonical `index.html` used a `minmax(0,1fr) 330px` dashboard split with a sticky local-record rail.
- Unit 08 has one canonical landing page; no long-named duplicate landing file was present in the unit root.
- Unit 08 had no dedicated centered VNV/KA blueprint stylesheet.
- Lessons 01–08 each used a `minmax(0,1fr) 310px` lesson/record split with a sticky lesson-record rail.
- Lesson pages lacked the 333 ticker, AutoPopulate ticker and translator.
- Unit and lesson pages directly loaded the ecosystem toolbar in addition to High School global chrome.

## Committed repairs

### Unit 08 blueprint
Created:
`assets/unit08-vnv-ka-blueprint-v1.css`

The presentation overlay establishes:
- one centered content axis;
- max 1120px course content width;
- centered hero and actions;
- one-column unit overview/record flow;
- four equal unit-record actions, collapsing 4 → 2 → 1;
- equal 3-column lesson/resource/glossary grids, collapsing 3 → 2 → 1;
- equal 4-column representation grids where used, collapsing 4 → 2 → 1;
- 16px minimum controls/supporting copy and 18px instructional copy where covered;
- centered footer;
- 7px card/control radius.

### Unit 08 dashboard
The canonical `index.html` was aligned:
- removed the legacy 330px sticky side rail;
- replaced the local-record `aside` with a labeled section;
- attached the Unit 08 blueprint stylesheet;
- added `ka-unit08-approved` body class;
- added the official VNV translator;
- retained the canonical dual-ticker loader;
- removed redundant direct ecosystem-toolbar loading.

### Unit 08 Lessons 01–08
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

- `91b71e60` — create Unit 08 centered blueprint.
- `ecd178d9` — normalize canonical Unit 08 dashboard.
- `5f1708f5` — Lesson 01.
- `8a3d2ffc` — Lesson 02.
- `381bafe2` — Lesson 03.
- `86eb1886` — Lesson 04.
- `e17eefaa` — Lesson 05.
- `3f63cc46` — Lesson 06.
- `3de5e9d6` — Lesson 07.
- `943f7319` — Lesson 08.

## Static validation

PASS across the canonical dashboard and Lessons 01–08:
- no 310/330/333px major page side rail;
- no sticky `.side` or `.lesson-side`;
- no unit/lesson record `aside`;
- one translator per public learning page;
- one eligible ticker owner/pair per page;
- one High School global chrome owner;
- no direct competing ecosystem-toolbar source;
- all lesson action grids include responsive 5 → 2 → 1 behavior.

## HOLD

- Browser/device acceptance remains HOLD.
- Legacy sub-16px declarations remain in older inline theme CSS; blueprint/readability layers override many student-facing instances, but source-level typography cleanup remains future work.
- Practice, project, family/teacher guide, worksheet and assessment pages were not visually normalized in this pass.

## Next step

Proceed to Unit 09 using Units 01–08 as the established course pattern, then continue one unit at a time with static validation and workflow evidence.
