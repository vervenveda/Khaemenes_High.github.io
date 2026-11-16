# English 10–12 · Week 01 Daily Lesson Loading and Reading-View Parity

**Date:** 2026-11-16
**Repository:** `vervenveda/Khaemenes_High.github.io`
**Change type:** Shared presentation stability, grade-preserving enhancement
**Status:** SOURCE COMMITTED · STATIC VALIDATION PASS · LIVE BROWSER ACCEPTANCE HOLD

## Reason
After a founder-confirmed English 9 Week 01 daily-page loading recovery, extend the relevant **shared chrome stability** and **non-grading reading-view controls** to the corresponding English 10, 11, and 12 daily lesson pages without copying the English 9 academic engine or its storage format.

## Topology inspected
- English 10: `courses/language-arts/english-10/weeks/week-01/{monday,tuesday,wednesday,thursday,friday}/index.html`
- English 11: `courses/language-arts/english-11/weeks/week-01/lessons/day-01.html` to `day-05.html`
- English 12: `courses/language-arts/english-12/weeks/week-01/lessons/day-01.html` to `day-05.html`

All 15 paths exist on the repository default branch and contain the same shared `assets/high-school-global-chrome-v2.js` reference. They do **not** all share the English 9 daily-lesson engine. English 10 owns learner-scoped weekday studios; English 11/12 have separate non-grading companion pages tied to each weekly workspace.

## Implementation
Commit: `3b415925ab21f2646860aed55fe453d3e46d04b7`
File: `assets/high-school-global-chrome-v2.js`

- Added a narrow pathname selector for Week 01 English 10 weekday studios and English 11/12 five companion pages.
- Prevented the broad document-subtree MutationObserver from repeatedly calling header/toolbar mounts on **these 15 daily routes**. Existing one-time canonical header/toolbar initialization still runs, and other pages retain their unchanged observation behavior.
- Added a single idempotent reading-size control group at the beginning of the main reading area: A−, A+, Reset. Scale is bounded to 100–140% and held only in page memory (no learner keys or new persistence).
- The reading-view controls do not attempt to override native browser zoom or change grading.
- English 9's previous five-day exception remains unmodified.

## Source verification performed
- Fetched all 15 target lesson files; all exist and include the shared global chrome script: **15/15 PASS**.
- Re-fetched the updated shared script and parsed with `new Function`: **PASS**.
- Tested selector against representative English 10 weekday route, English 11 Day 01, English 12 Day 05: **PASS**.
- Tested selector against English 9 Day 01: **EXCLUDED** (its existing separate treatment remains).
- No course-specific data file, assessment item, rubric, `data-save-field` name, storage key, or mastery gate was edited.

## Verification limits
**Not yet verified** by live browser: page-loading speed, failed network requests, actual button function, zoom/overflow on tablet, keyboard and screen-reader interaction, header/dock correctness, direct-link playback or learner save/export flows. The preceding English 9 success was user-reported and does not prove these grades independently work in the browser.

## Next acceptance test
1. Open the first daily page for Grades 10, 11 and 12; confirm stable first paint and no stuck loading state.
2. Test A+, A−, Reset and standard browser zoom in each; verify no clipped cards, responsive horizontal scrolling or toolbar overlap.
3. Navigate to the following daily lesson, then back to the weekly source and learner workspace.
4. For an authorized test learner, verify English 10 saved work and grade-specific progress; verify English 11/12 companion pages do not create an additional grading authority.
5. Verify the official header, ticker, and lower-right toolbar mount once.
6. Record real browser outcomes before propagating to Weeks 02–36.

**Release classification:** Shared-source implementation complete; live student acceptance pending.
