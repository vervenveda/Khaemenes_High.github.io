# Mathematics Course Consistency Sweep

**Review branch:** `audit/math-course-consistency`
**Date:** 2026-10-12
**Courses in scope:** Pre-Algebra, Algebra I, Algebra II, and Geometry.

## Shared repairs staged

- Added `courses/mathematics/assets/math-course-standard-v1.css` with the requested 55px eyebrow, 33px H1, and 24px H2 typography, centered heading treatment, responsive equal-height card grids, focus-visible styling, and mobile layout fallbacks.
- Imported the shared presentation contract into all 13 Pre-Algebra unit stylesheets, all 9 Algebra I unit stylesheets, and the shared Algebra II and Geometry stylesheets.
- Added `math-course-page-standard-v1.js` and loaded it from each Pre-Algebra unit lesson engine plus the shared Algebra I, Algebra II, and Geometry lesson engines. It supplies a breadcrumb fallback, a relevant shared learning-game link when the lesson has no game link, and the existing universal Beta Program button.
- Added `math-game-navigation-v1.js` to all 47 shared math game pages. When launched from a lesson, the game receives course/unit/lesson context and offers a return-to-lesson breadcrumb. The existing Beta Program widget is also loaded on game pages.
- Added the shared stylesheet and Beta Program button to all four course landing pages.
- Added `tools/validate-math-course-ui-contract.mjs` and a GitHub Actions workflow to guard lesson-engine integration, typography imports, fallback-game targets, Beta-button coverage, and game return-navigation wiring.

## Repository scale discovered

| Course | Lesson HTML pages |
|---|---:|
| Pre-Algebra | 103 |
| Algebra I | 87 |
| Algebra II | 92 |
| Geometry | 90 |
| **Total** | **372** |

The shared mathematics games directory contains 47 game pages.

## Important implementation notes

- Existing Pre-Algebra companion games are preserved; the shared enhancement adds a contextual query string so the game can return to the correct lesson. Where a course lesson lacks an explicit game link, the enhancement inserts a relevant game companion based on lesson title/path keywords.
- Existing progression, assessment, mastery, and learner-record engines are not rewritten by the presentation layer.
- The requested 55px eyebrow is intentionally implemented as 55px, not a smaller responsive clamp. This is a large eyebrow size and should be checked on narrow screens; the stylesheet allows wrapping and centers the text.
- The new validator is a source-level guard. A passing result verifies wiring and file presence, not that every button's event handler behaves correctly in a live browser or that all external destinations respond.
- Desktop/mobile visual review, keyboard walkthrough, screen-reader testing, and runtime clicking of every control remain necessary before declaring full end-to-end verification complete.
