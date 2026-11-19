# Pre-Algebra Unit 03 · Centered Layout Blueprint Implementation

**Date:** 2026-11-17  
**Type:** repair · layout normalization · shared chrome  
**Authority:** `workflow/blueprints/high-school-landing-pages/pre-algebra.md`

## Scope

Third implementation block under the stable High School landing-page blueprint:
- Unit 03 canonical dashboard
- Unit 03 older public duplicate landing file
- Unit 03 Lessons 01–08
- new Unit 03 presentation blueprint overlay

No curriculum content, scoring logic, learner records, mastery thresholds, question banks, assessment history or course chronology were intentionally changed.

## Verified source observations

Before repair:
- Unit 03 canonical `index.html` used a `minmax(0,1fr) 330px` dashboard split with a sticky local-record rail.
- `Unit_03_Fractions_Decimals_Rational_Numbers_Verve_Arithmetic_index.html` duplicated the same public landing architecture and could drift from the canonical route.
- Unit 03 had no dedicated VNV/KA centered blueprint stylesheet.
- Lessons 01–08 each used a `minmax(0,1fr) 310px` lesson/record split with a sticky lesson-record rail.
- Lessons lacked the 333 ticker, AutoPopulate ticker and translator.
- Unit and lesson pages directly loaded the VNV ecosystem toolbar while High School global chrome also owns toolbar mounting.

## Committed repairs

### Unit 03 blueprint
Created:
`assets/unit03-vnv-ka-blueprint-v1.css`

The presentation overlay establishes:
- one centered content axis;
- max 1120px course content width;
- centered hero and actions;
- one-column unit overview/record flow;
- four equal unit-record actions, collapsing 4 → 2 → 1;
- 3-column lesson/resource/glossary grids;
- 4-column representation grid, collapsing 4 → 2 → 1;
- 16px minimum controls/supporting copy and 18px instructional copy where covered;
- centered footer;
- 7px card/control radius.

### Unit 03 landing pages
Both the canonical `index.html` and older public duplicate landing file were aligned:
- removed legacy 330px sticky side rail;
- replaced the local-record `aside` with a labeled section;
- attached the Unit 03 blueprint stylesheet;
- added `ka-unit03-approved` body class;
- added the official VNV translator;
- ensured the canonical dual-ticker loader is present;
- removed redundant direct ecosystem-toolbar loading.

The canonical route remains `units/unit-03/index.html`. The long-named duplicate remains a compatibility/public duplicate and should not become the editing authority.

### Unit 03 Lessons 01–08
Every lesson now:
- uses one centered lesson column;
- has no 310px side rail;
- has no sticky lesson-record panel;
- uses a labeled section instead of a lesson-record `aside`;
- uses an equal five-action lesson-record grid on desktop, 2-column tablet with the odd final action centered across the row, and one-column phone layout;
- loads one official 333 ticker;
- loads one AutoPopulate ticker;
- loads one VNV translator;
- uses High School global chrome as the single header/hamburger/toolbar owner;
- no longer directly loads a competing ecosystem-toolbar script.

## Commits

- `e89ff278` — create Unit 03 centered blueprint.
- `358ed0e0` — normalize canonical Unit 03 dashboard.
- `20362ffe` — normalize older public duplicate Unit 03 landing file.
- `82317c05` — Lesson 01.
- `7dcb8f8a` — Lesson 02.
- `3327eff2` — Lesson 03.
- `7304eac3` — Lesson 04.
- `3a7ba633` — Lesson 05.
- `1c242425` — Lesson 06.
- `f50c2513` — Lesson 07.
- `82b7565b` — Lesson 08.

## Static validation

PASS across canonical dashboard, compatibility landing copy and Lessons 01–08:
- no 310/330/333px major page side rail;
- no sticky `.side` or `.lesson-side`;
- no unit/lesson record `aside`;
- one translator per public learning page;
- one eligible ticker owner/pair per page;
- one High School global chrome owner;
- no direct competing ecosystem-toolbar source.

## Important topology note

Unit 03 currently has two public landing HTML files:
- **canonical:** `index.html`
- **compatibility/legacy:** `Unit_03_Fractions_Decimals_Rational_Numbers_Verve_Arithmetic_index.html`

Both are visually aligned in this session to prevent drift. Future academic/content changes should target the canonical `index.html` unless a separate workflow decision retires or redirects the compatibility copy.

## HOLD

- Browser/device acceptance remains HOLD.
- Legacy sub-16px declarations still exist in older inline theme CSS; the new Unit 03 blueprint and readability layers override many student-facing instances, but source-level typography cleanup remains future work.
- Practice, project, family/teacher guide, worksheet and assessment pages were not visually normalized in this pass.

## Next step

Proceed to Unit 04 using Units 01–03 as the stable course pattern, then continue one unit at a time with static validation and workflow evidence.
