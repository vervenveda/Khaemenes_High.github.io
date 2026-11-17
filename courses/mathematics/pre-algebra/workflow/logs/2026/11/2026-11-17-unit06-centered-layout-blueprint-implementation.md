# Pre-Algebra Unit 06 · Centered Layout Blueprint Implementation

**Date:** 2026-11-17  
**Type:** repair · layout normalization · shared chrome  
**Authority:** `workflow/blueprints/high-school-landing-pages/pre-algebra.md`

## Scope

Sixth implementation block under the stable High School landing-page blueprint:
- Unit 06 canonical dashboard
- Unit 06 Lessons 01–07
- new Unit 06 presentation blueprint overlay

No curriculum content, scoring logic, learner records, mastery thresholds, question banks, assessment history or course chronology were intentionally changed.

## Verified source observations

Before repair:
- Unit 06 canonical `index.html` used a `minmax(0,1fr) 330px` dashboard split with a sticky local-record rail.
- Unit 06 has one canonical landing page; unlike Units 03–05, no long-named duplicate landing file was present in the unit root.
- Unit 06 had no dedicated centered VNV/KA blueprint stylesheet.
- Lessons 01–07 each used a `minmax(0,1fr) 310px` lesson/record split with a sticky lesson-record rail.
- Lesson pages lacked the 333 ticker, AutoPopulate ticker and translator.
- Unit and lesson pages directly loaded the ecosystem toolbar in addition to High School global chrome.

## Committed repairs

### Unit 06 blueprint
Created:
`assets/unit06-vnv-ka-blueprint-v1.css`

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

### Unit 06 dashboard
The canonical `index.html` was aligned:
- removed the legacy 330px sticky side rail;
- replaced the local-record `aside` with a labeled section;
- attached the Unit 06 blueprint stylesheet;
- added `ka-unit06-approved` body class;
- added the official VNV translator;
- retained the canonical dual-ticker loader;
- removed redundant direct ecosystem-toolbar loading.

### Unit 06 Lessons 01–07
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

- `1e1c20dd` — create Unit 06 centered blueprint.
- `4abb1788` — normalize canonical Unit 06 dashboard.
- `1f8dce9f` — Lesson 01.
- `20357d4d` — Lesson 02.
- `0b9c739d` — Lesson 03.
- `f0f76f7f` — Lesson 04.
- `153a7141` — Lesson 05.
- `63e67089` — Lesson 06.
- `50782a7b` — Lesson 07.

## Static validation

PASS across the canonical dashboard and Lessons 01–07:
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

Proceed to Unit 07 using Units 01–06 as the established course pattern, then continue one unit at a time with static validation and workflow evidence.
