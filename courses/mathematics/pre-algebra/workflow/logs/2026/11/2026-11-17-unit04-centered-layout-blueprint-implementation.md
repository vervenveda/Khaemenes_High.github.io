# Pre-Algebra Unit 04 · Centered Layout Blueprint Implementation

**Date:** 2026-11-17  
**Type:** repair · layout normalization · shared chrome  
**Authority:** `workflow/blueprints/high-school-landing-pages/pre-algebra.md`

## Scope

Fourth implementation block under the stable High School landing-page blueprint:
- Unit 04 canonical dashboard
- Unit 04 older public duplicate landing file
- Unit 04 Lessons 01–08
- new Unit 04 presentation blueprint overlay

No curriculum content, scoring logic, learner records, mastery thresholds, question banks, assessment history or course chronology were intentionally changed.

## Verified source observations

Before repair:
- Unit 04 canonical `index.html` used a `minmax(0,1fr) 330px` dashboard split with a sticky local-record rail.
- `Unit_04_Ratios_Rates_Proportional_Reasoning_Verve_Arithmetic_index.html` duplicated the same public landing architecture and could drift from the canonical route.
- Unit 04 had no dedicated centered VNV/KA blueprint stylesheet.
- Lessons 01–08 each used a `minmax(0,1fr) 310px` lesson/record split with a sticky lesson-record rail.
- Lesson pages lacked the 333 ticker, AutoPopulate ticker and translator.
- Unit and lesson pages directly loaded the ecosystem toolbar in addition to High School global chrome.

## Committed repairs

### Unit 04 blueprint
Created:
`assets/unit04-vnv-ka-blueprint-v1.css`

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

### Unit 04 landing pages
Both the canonical `index.html` and compatibility landing file were aligned:
- removed the legacy 330px sticky side rail;
- replaced the local-record `aside` with a labeled section;
- attached the Unit 04 blueprint stylesheet;
- added `ka-unit04-approved` body class;
- added the official VNV translator;
- ensured the dual-ticker loader is present;
- removed redundant direct ecosystem-toolbar loading.

The canonical route remains `units/unit-04/index.html`.

### Unit 04 Lessons 01–08
Every lesson now:
- uses one centered lesson column;
- has no 310px side rail;
- has no sticky lesson-record panel;
- uses a labeled section instead of a lesson-record `aside`;
- uses an equal five-action lesson-record grid on desktop;
- collapses the action grid to two columns on tablet with the odd final action spanning the row;
- collapses to one column on phone;
- loads one 333 ticker;
- loads one AutoPopulate ticker;
- loads one VNV translator;
- uses High School global chrome as the single header/hamburger/toolbar owner;
- no longer directly loads a competing ecosystem-toolbar script.

## Commits

- `f6f1bf4a` — create Unit 04 centered blueprint.
- `48e4e5d8` — normalize canonical Unit 04 dashboard.
- `7e0b6095` — normalize compatibility Unit 04 landing copy.
- `25481f69` — Lesson 01.
- `39ba0d0e` — Lesson 02.
- `23b935f8` — Lesson 03.
- `a9225d3c` — Lesson 04.
- `4e81d66b` — Lesson 05.
- `3d1c1711` — Lesson 06.
- `7f8f3f5d` — Lesson 07.
- `105853a5` — Lesson 08.
- `eed3e5d9` / `c41a8627` — responsive action-grid completion for Lessons 01–02.

## Static validation

PASS across canonical dashboard, compatibility landing copy and Lessons 01–08:
- no 310/330/333px major page side rail;
- no sticky `.side` or `.lesson-side`;
- no unit/lesson record `aside`;
- one translator per public learning page;
- one eligible ticker owner/pair per page;
- one High School global chrome owner;
- no direct competing ecosystem-toolbar source;
- all lesson action grids include responsive 5 → 2 → 1 behavior.

## Important topology note

Unit 04 currently has two public landing HTML files:
- **canonical:** `index.html`
- **compatibility/legacy:** `Unit_04_Ratios_Rates_Proportional_Reasoning_Verve_Arithmetic_index.html`

Both are visually aligned to prevent drift. Future academic/content changes should target the canonical `index.html` unless a workflow decision retires or redirects the compatibility copy.

## HOLD

- Browser/device acceptance remains HOLD.
- Legacy sub-16px declarations remain in older inline theme CSS; blueprint/readability layers override many student-facing instances, but source-level typography cleanup remains future work.
- Practice, project, family/teacher guide, worksheet and assessment pages were not visually normalized in this pass.

## Next step

Proceed to Unit 05 using Units 01–04 as the established course pattern, then continue one unit at a time with static validation and workflow evidence.
