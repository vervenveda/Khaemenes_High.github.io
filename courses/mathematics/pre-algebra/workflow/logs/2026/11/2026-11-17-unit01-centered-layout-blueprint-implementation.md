# Pre-Algebra Unit 01 · Centered Layout Blueprint Implementation

**Date:** 2026-11-17  
**Type:** repair · layout normalization · shared chrome  
**Authority:** `workflow/blueprints/high-school-landing-pages/pre-algebra.md`

## Scope

First implementation block under the new High School landing-page blueprint:
- Unit 01 dashboard
- Unit 01 Lesson 01
- their approved presentation blueprint stylesheets

No curriculum, scoring, learner records, mastery thresholds, course chronology, question banks, or assessment history were intentionally changed.

## Verified source observations

Before repair:
- Unit 01 source contained a `minmax(0,1fr) 330px` overview/record split and sticky `.side` rail.
- The approved Unit 01 blueprint still rendered overview + record as two equal columns rather than one centered content axis.
- Lesson 01 source contained a `minmax(0,1fr) 333px` lesson/record split and sticky `.lesson-side` rail.
- The approved Lesson 01 blueprint still authorized a 270–345px lesson record rail.
- Unit 01 and Lesson 01 lacked the translator.
- Lesson 01 contained competing direct header initialization in addition to High School global chrome.
- Both pages directly loaded the ecosystem toolbar while High School global chrome also owns toolbar loading/mounting.

## Committed repairs

### Unit 01
- Converted the approved `.unit-layout` to one centered column.
- Converted the former unit-record side actions to an equal 4-column grid, collapsing to 2 columns and then 1.
- Replaced the unit-record `<aside>` with a normal labeled section.
- Removed legacy sticky 330px page-side layout from inline source.
- Added the official VNV translator.
- Removed the redundant direct ecosystem-toolbar script; High School global chrome is the sole header/hamburger/toolbar owner.

### Lesson 01
- Converted the approved `.lesson-layout` to one centered column.
- Made lesson-record controls an equal 4-column action grid, collapsing to 2 and then 1.
- Replaced the lesson-record `<aside>` with a normal labeled section.
- Removed legacy sticky 333px page-side layout from inline source.
- Added the official VNV translator.
- Removed redundant direct header initialization and redundant direct ecosystem-toolbar script; High School global chrome owns header/hamburger/toolbar.
- Retained the explicit 333 + AutoPopulate ticker pair because the global chrome ticker branch is not the general Pre-Algebra ticker owner.

## Commits

- `12605cc1` — Unit 01 approved blueprint: centered single-column layout.
- `bbb693a9` — Lesson 01 approved blueprint: remove side rail, equalize actions.
- `bcd004c8` / `6fb64df3` — initial HTML structure/translator alignment.
- `b2bb7ab9` / `758a8c87` — chrome ownership cleanup pass.
- `c271005c` — remove legacy Unit 01 inline side-rail declaration and duplicate toolbar source.
- `a707c4bd` — remove legacy Lesson 01 inline side-rail declaration and duplicate header/toolbar sources.

## Static validation

PASS:
- no semantic `<aside class="card side">` or `<aside class="card lesson-side">` remains;
- no sticky Unit 01 or Lesson 01 record side rail remains;
- approved Unit 01 and Lesson 01 blueprint layers use one content column;
- translator is present once on both pages;
- High School global chrome is present once on both pages;
- ticker pair remains present on both pages;
- direct competing header/toolbar ownership was removed from the model pages.

The remaining `330px` source match in Unit 01 belongs to the **printable worksheet header/record composition**, not a page side rail; it is an allowed functional/print layout exception.

## Known cleanup debt / HOLD

- Legacy inline CSS still contains several sub-16px declarations. Approved blueprint layers override student-facing instances to 16–18px, but source-level typography cleanup remains desirable.
- Browser/device acceptance is **HOLD** until rendered desktop, tablet, portrait phone and landscape tablet behavior is observed.
- Units 02–13 and Lessons 02+ have not yet been normalized by this session.
- Do not propagate the Unit 01 pattern coursewide until the rendered model is accepted.

## Next recommended step

Render/accept Unit 01 + Lesson 01 as the model. After acceptance, propagate the same centered shell and chrome ownership pattern to Unit 02, then use shared assets/engines wherever possible rather than editing hundreds of pages independently.
