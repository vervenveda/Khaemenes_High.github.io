# English 9–12 · Unified Lesson Engine v1 · Pilot
**Date:** 2026-11-16
**Repository:** `vervenveda/Khaemenes_High.github.io`
**Status:** IMPLEMENTATION COMMITTED · STATIC ROUTE TEST PASS · LIVE BROWSER ACCEPTANCE HOLD

## Decision and purpose
Build one first-party, centrally maintained, idempotent lesson presentation layer with grade adapters, instead of individually modifying hundreds of lesson HTML files for navigation, reading focus and shared UI changes. **Preserve grade-specific content and student-state authorities.**

## Existing topology confirmed
- English 9: `weeks/week-01/day-01/index.html` through `day-05/index.html`, grade-specific `assets/daily-lesson.js` owns learner evidence/prepared statuses.
- English 10: `weeks/week-01/monday/index.html` through `friday/index.html`, distinct weekly studio and learner-scope record engine.
- English 11 and 12: `weeks/week-01/lessons/day-01.html` through `day-05.html`, grade-specific independent companions with authoritative saved work in the weekly classroom.
- All 20 sample pages already load `assets/high-school-global-chrome-v2.js`.

## Source changes
1. **Created** `courses/shared/english-unified-lesson-engine-v1.js` · commit `0b3a33150777ef431fda61ac8c83aaec329406d6`.
   - One shared section/lesson navigator with grade/week/day metadata.
   - Grade-specific route detection, automatic internal section map, centered, accessible disclosure and focus viewing.
   - Idempotent mount; creates no new academic storage or data writes.
   - Opt-in static, safely text-rendered JSON section schema for future data-only lesson authoring; existing lesson texts are not replaced.
2. **Updated** `assets/high-school-global-chrome-v2.js` · commit `76d76aa599f22cf479fd5bd725012cda2835b381`.
   - Loads unified engine only on the 20 previously identified Week 01 daily routes, through the single already-included high-school chrome script.
   - No per-day file changed. Original HTML remains compatible.
3. **Added documentation** `courses/shared/ENGLISH_UNIFIED_LESSON_ENGINE_V1.md` · commit `76a9958be2534d0bebc05184980b1787c1c051dd`.
   - Adapters, future migration format, scope, guardrails, QA and surgical rollback.

## Validation evidence
- Re-fetched engine source from GitHub; JavaScript `new Function` parse PASS.
- Executed engine `route()` with inert mock window/document on all 20 known Week 01 daily URLs: **20/20 recognized** with correct grade/day mapping.
- Negative routes for reading logs, graded exams, and science: **3/3 excluded**.
- Re-fetched and parsed modified shared bootstrap script: PASS.
- No new localStorage/sessionStorage calls, assessment score mutation, or grading-authority handoff in new engine.
- No VNV public gateway or saved learner records modified.

## Deliberate nonclaims / next work
**Browser rendering has NOT been run.** Before increasing from 20 pages to the wider 36-week program, confirm one per grade, plus tablet/zoom, keyboard, nav anchors, footer/header/tickers and record save/export. A full curriculum conversion into JSON is **NOT complete**. Content migration must keep official reading/source custody, human-reviewed writing, and stable learner evidence identifiers. Avoid replacing grade-specific logic just because the page looks similar.

## Next release gates
1. User acceptance on English 9, 10, 11, 12 Week 01 sample pages.
2. Test and harden opt-in JSON renderer against malformed data and inaccessible headings.
3. Build a versioned lesson content schema, validator and safe migrator for one Unit 02 course slice.
4. Add automated smoke tests for real HTML source, connected routes and source contracts.
5. Expand the **loader** scope only after verified pilot; no individual lesson file edits needed for shared UI rollout.
6. Keep progress recorded by grade and week, with no learner data in workflow files.

**Release: scoped pilot, source-integrated, user/browser validation pending.**
