# Pre-Algebra Unit 02 · Centered Layout Blueprint Implementation

**Date:** 2026-11-17  
**Type:** repair · layout normalization · shared chrome  
**Authority:** `workflow/blueprints/high-school-landing-pages/pre-algebra.md`

## Scope

Second implementation block under the stable High School landing-page blueprint:
- Unit 02 dashboard
- Unit 02 Lessons 01–08

No curriculum content, scoring logic, learner records, mastery thresholds, question banks, assessment history or course chronology were intentionally changed.

## Verified source observations

Before repair:
- Unit 02 source contained a `minmax(0,1fr) 330px` unit overview / local-record split with a sticky side rail.
- The approved Unit 02 blueprint also rendered the overview and unit record as two columns.
- Unit 02 directly loaded the VNV ecosystem toolbar even though High School global chrome already owns toolbar mounting.
- Unit 02 lacked the translator.
- Unit 02 Lesson 01 contained a `minmax(0,1fr) 310px` lesson / lesson-record split with a sticky record rail.
- Lesson 01 lacked the 333 ticker, AutoPopulate ticker and translator.
- Lesson 01 directly loaded the ecosystem toolbar in addition to High School global chrome.

## Committed repairs

### Unit 02 dashboard
- Converted the approved `.unit-layout` to one centered column.
- Converted local unit-record actions to an equal responsive grid under the course blueprint.
- Replaced the unit-record `<aside>` with a labeled section.
- Removed the legacy inline 330px sticky side-rail declaration.
- Added the official VNV translator.
- Removed redundant direct ecosystem-toolbar ownership; High School global chrome remains the sole header/hamburger/toolbar owner.
- Preserved the Signed Number Lab as a legitimate internal functional grid.

### Unit 02 Lesson 01
- Converted `.lesson-layout` to one centered column.
- Removed the legacy 310px sticky lesson-record rail.
- Replaced the lesson-record `<aside>` with a labeled section.
- Converted the five lesson-record actions to five equal columns on desktop, two columns on tablet with the final odd action spanning the row, and one column on phone.
- Added the canonical 333 ticker.
- Added the canonical AutoPopulate ticker.
- Added the official VNV translator.
- Removed redundant direct ecosystem-toolbar ownership; High School global chrome remains the header/hamburger/toolbar owner.

## Commits

- `91298aa4` — Unit 02 approved blueprint normalized to centered single-column layout.
- `193793b0` — Unit 02 HTML structure, translator and chrome ownership aligned.
- `749a8ae0` — Unit 02 Lesson 01 centered layout and full public-learning chrome.

## Static validation

PASS:
- no active 310/330/333px major content side rail remains on Unit 02 or Lesson 01;
- no sticky `.side` or `.lesson-side` rail remains;
- no `<aside class="card side">` or `<aside class="card lesson-side">` remains;
- Unit 02 approved blueprint uses one centered content column;
- Unit 02 loads one translator, one dual-ticker owner and one High School global chrome owner;
- Lesson 01 loads one 333 ticker, one AutoPopulate ticker, one translator and one High School global chrome owner;
- redundant direct ecosystem-toolbar source was removed from the two model pages.

## Preserved exceptions

- The Signed Number Lab uses an internal three-control grid because it is a functional interaction row, not a page-level side column.
- Small input/select/action compositions may remain unequal where the controls perform different functions; major peer content cards remain subject to equal-grid rules.

## HOLD

- Rendered desktop/tablet/phone acceptance remains HOLD.
- Lessons 02–08 remain on their previous layouts until normalized.
- Remaining legacy sub-16px source declarations should be cleaned after structural propagation; do not combine that cleanup with scoring/data changes.

## Unit-wide propagation completed

Lessons 02–08 were normalized after the Lesson 01 model was validated in source.

Additional lesson commits:
- `8b697565` — Lesson 02
- `03c94ef5` — Lesson 03
- `659be972` — Lesson 04
- `7ce3c797` — Lesson 05
- `7cb5f774` — Lesson 06
- `753d2fe0` — Lesson 07
- `05030a01` — Lesson 08
- residual sticky declarations removed in follow-up commits `63a0b79b`, `ff6f4a46`, `1fde5ebc`, `9ccee687`, and `ab265809`.

Final unit-wide static validation confirms all eight Unit 02 lessons:
- no 310/330/333px lesson side rail;
- no sticky lesson-record panel;
- no semantic lesson-record `aside`;
- exactly one explicit 333 ticker;
- exactly one explicit AutoPopulate ticker;
- exactly one translator;
- exactly one High School global chrome owner;
- no direct competing ecosystem-toolbar source.

## Next step

Use Unit 02 as the second confirmed model and propagate the centered unit-dashboard + lesson shell pattern to Unit 03, followed by a fresh static audit before moving to Unit 04.
