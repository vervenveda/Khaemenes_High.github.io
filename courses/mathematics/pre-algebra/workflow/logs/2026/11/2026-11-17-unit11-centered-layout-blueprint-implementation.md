# Pre-Algebra Unit 11 · Centered Layout Blueprint Implementation

**Date:** 2026-11-17  
**Type:** repair · layout normalization · shared chrome  
**Authority:** `workflow/blueprints/high-school-landing-pages/pre-algebra.md`

## Scope

Eleventh implementation block under the stable High School landing-page blueprint:
- Unit 11 canonical dashboard
- Unit 11 Lessons 01–08
- new Unit 11 presentation blueprint overlay

No curriculum content, scoring logic, learner records, mastery thresholds, question banks, assessment history or course chronology were intentionally changed.

## Verified source observations

Before repair:
- Unit 11 canonical `index.html` used a `minmax(0,1fr) 330px` dashboard split with a sticky local-record rail.
- Unit 11 has one canonical landing page; no long-named duplicate landing file was present in the unit root.
- Unit 11 had no dedicated centered VNV/KA blueprint stylesheet.
- Lessons 01–08 each used a `minmax(0,1fr) 310px` lesson/record split with a sticky lesson-record rail.
- Lesson pages lacked the 333 ticker, AutoPopulate ticker and translator.
- Unit and lesson pages directly loaded the ecosystem toolbar in addition to High School global chrome.
- The dashboard also contains an internal `minmax(0,1.25fr) minmax(300px,.75fr)` geometry/design workspace.

## Committed repairs

### Unit 11 blueprint
Created:
`assets/unit11-vnv-ka-blueprint-v1.css`

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

### Unit 11 dashboard
The canonical `index.html` was aligned:
- removed the legacy 330px sticky side rail;
- replaced the local-record `aside` with a labeled section;
- attached the Unit 11 blueprint stylesheet;
- added `ka-unit11-approved` body class;
- added the official VNV translator;
- retained the canonical dual-ticker loader;
- removed redundant direct ecosystem-toolbar loading.

### Unit 11 Lessons 01–08
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

## Functional layout exception

The dashboard's internal `minmax(0,1.25fr) minmax(300px,.75fr)` geometry/design workspace was preserved. It supports diagrams, measurement/design controls and visual working space; it is not a persistent page side rail or peer-content card split. The universal blueprint permits unequal internal functional layouts where the task requires different working areas.

## Commits

- `6e5eaa50` — create Unit 11 centered blueprint.
- `05780e05` — normalize canonical Unit 11 dashboard.
- `10cdb455` — Lesson 01.
- `46c2812e` — Lesson 02.
- `bee0e43e` — Lesson 03.
- `60017eb2` — Lesson 04.
- `9a47ee16` — Lesson 05.
- `f22792b1` — Lesson 06.
- `eb8b07a7` — Lesson 07.
- `57bd250e` — Lesson 08.

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

Proceed to Unit 12 using Units 01–11 as the established course pattern, then continue one unit at a time with static validation and workflow evidence.
