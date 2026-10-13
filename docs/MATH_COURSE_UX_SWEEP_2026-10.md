# Mathematics Course UX Sweep — October 2026

**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Branch:** `audit/math-course-ux-sweep-2026-10`  
**Scope:** Pre-Algebra, Algebra I, Algebra II, and Geometry lesson-page structure, registered learning-game coverage, typography, Beta Program presence, breadcrumbs/return routes, layout consistency, and control/link validation.

## Executive finding

The shared typography standard is present in all four sampled lesson pages and specifies exactly 55px eyebrows, 33px H1, and 24px H2. However, the course experience is **not yet verified as consistent across every lesson**. Beta buttons are absent from the sampled lessons and game pages; dedicated lesson-game coverage is incomplete in the shared game registry; breadcrumb/return navigation differs by course; and no single automated audit currently verifies all 372 lesson pages and every control end to end.

## Course inventory

Repository-tree inventory of lesson HTML files:

| Course | Lesson pages | Unit index pages | Shared-game registry unique lesson references* |
|---|---:|---:|---:|
| Pre-Algebra | 103 | 14 (Unit 00 plus Units 01–13) | 35 |
| Algebra I | 87 | 13 | 42 |
| Algebra II | 92 | 13 | 80 |
| Geometry | 90 | 13 | 35 |
| **Total** | **372** | **53** | **192 course/lesson references** |

*The game registry contains 47 games and records wired placements. These counts describe the registered shared-game map only; they are not a definitive count of every inline activity that may exist inside lesson content. Duplicate game placements on the same lesson are counted once in the unique-reference column.

## Findings by requirement

### 1. A learning game on every lesson — **GAP / NOT VERIFIED**

The shared registry does not currently provide a one-to-one registered game assignment for every lesson. Registered unique lesson references cover 35/103 Pre-Algebra, 42/87 Algebra I, 80/92 Algebra II, and 35/90 Geometry lessons.

Evidence from source inspection:
- Pre-Algebra Lesson 1 contains a dedicated skill-game section.
- Algebra I's lesson shell is rendered dynamically. The inspected deep-lesson engine does not itself contain game/companion code, and the lesson-resource bridge explicitly says games and video companions are not fabricated there and can be attached later.
- The inspected Algebra II Lesson 1 and Geometry Lesson 1 files do not contain a dedicated game companion in their static markup. Their lesson-tools scripts manage progress/notes/mastery, not game insertion.
- The shared launcher can pass course, unit, lesson, and mode query parameters, which is a good foundation for reliable return-to-lesson routing.

**Required next step:** create a canonical lesson-to-game map covering all 372 lessons. Every lesson should resolve to a topic-appropriate game, pass course/unit/lesson context into the game, and offer a visible return-to-lesson action. Where no topic-specific game exists yet, use a clearly labeled general practice game only as a temporary fallback, then replace it with a reviewed topic-specific activity.

### 2. Beta Program button on every lesson and game — **GAP IN SAMPLED PAGES**

The shared floating Beta Program implementation exists at `assets/vnv-beta-link.js`. It is not referenced by the sampled Pre-Algebra, Algebra I, Algebra II, or Geometry lesson pages, nor by the sampled shared game pages. The button therefore cannot be assumed to appear throughout these learning flows.

**Required next step:** mount the existing Beta Program component through a shared entry/runtime mechanism used by course pages and game pages. Guard against duplicate buttons, preserve keyboard focus visibility, respect reduced-motion preferences, and verify its destination.

### 3. Breadcrumbs and return from games — **INCONSISTENT**

- Algebra II Lesson 1 has a semantic breadcrumb with Academy → course → unit → lesson.
- The sampled Geometry lesson has course/unit links in its header but no semantic breadcrumb nav.
- The sampled Pre-Algebra lesson has navigation links, but its navigation pattern differs from the Algebra II shell.
- Shared game pages have a return-to-mapped-lesson pathway when launched with course context, but they do not use a consistent semantic breadcrumb component in the sampled files.

**Required next step:** standardize the breadcrumb component and labels across courses, unit pages, lessons, and games. Game launches must retain the source course, unit, lesson, and optional mode; each game should show a clear “Return to lesson” link and a fallback “Return to course” link when no valid lesson context is present.

### 4. Typography: eyebrow 55px, H1 33px, H2 24px — **STANDARD EXISTS; FULL COVERAGE NOT RE-RUN**

The shared standard in `assets/typography-standard.css` sets:
- eyebrow/kicker: **55px**
- H1: **33px**
- H2 and designated subtitle/comment roles: **24px**

The rule is embedded in the sampled lesson files. The repository includes `tools/apply-typography-standard.py --check` for a repository-wide check, but a fresh execution result for this sweep was not available from this inspection. A source rule does not prove the final computed style in every browser or dynamically rendered page.

**Required next step:** run the typography tool in check mode and add CI enforcement for the four courses. Browser checks should confirm computed font sizes for actual eyebrow, H1, and H2 elements after JavaScript rendering, including narrow mobile widths. Note that a 55px eyebrow is intentionally larger than a 33px H1 under the requested standard; the visual hierarchy should be handled through spacing, weight, color, and placement rather than silently changing those sizes.

### 5. Equal card grids, centered layout, professional symmetry — **PARTIAL / NO UNIFIED AUDIT**

Course and unit pages use course-specific CSS. The sampled Pre-Algebra unit page uses three-column lesson cards with responsive breakpoints; Algebra II and Geometry use their own grid and shell definitions. This allows individual course identities, but it does not establish one verified spacing/card-height/alignment standard across all courses.

**Required next step:** standardize shared grid primitives:
- equal-width columns and consistent card gaps;
- cards stretched to equal height within each row;
- title and summary areas aligned consistently;
- action rows anchored to the bottom of each card;
- centered content containers with consistent maximum widths;
- responsive breakpoints that collapse to two columns and then one without horizontal overflow;
- consistent focus, hover, disabled, and active states.

Do not force every page into one layout if the instructional activity needs a distinct structure; apply a shared design system while preserving activity-specific content.

### 6. All buttons and links activated — **NOT YET VERIFIED END TO END**

Existing automated validation is distributed across several course-specific scripts and workflows. The Pre-Algebra workflow includes local navigation and accessibility checks. Algebra I has dedicated route and course validation. Algebra II has a validation report with local-route and asset checks, but its recorded report is dated August 2026. Geometry's current `VALIDATION_REPORT.md` explicitly says strict release validation is pending and the previous PASS is superseded.

Source-level inspection cannot prove that every event handler works in a real browser, that dynamically rendered buttons bind correctly, or that every external destination is reachable.

**Required next step:** consolidate the checks into a single course UX audit that:
1. checks every local `href` and `src` against the repository tree;
2. detects missing fragment targets and duplicate IDs;
3. checks every button for a real handler or a native, intentional form action;
4. checks that disabled controls explain why they are disabled;
5. validates course/unit/lesson/game round-trip routes;
6. checks for Beta Program presence and duplicate injection;
7. checks typography declarations and the existence of visible H1/eyebrow content;
8. checks the required lesson-game mapping;
9. emits a course-by-course machine-readable report and fails CI for regressions.

A browser smoke test should then activate representative controls and all navigation paths, including game launch → play → return to lesson → next lesson, on desktop and mobile.

## Existing good foundations

- The shared 55/33/24 typography CSS and repository-wide application/check tool exist.
- The shared mathematics game registry and launcher carry course/unit/lesson context.
- Pre-Algebra, Algebra I, Algebra II, and Geometry each have course-level validation assets.
- The shared game pages include functional game controls and a mapped-lesson return concept.
- Several lesson pages already include course home, unit home, practice, assessment, print, or local progress actions.

## Release recommendation

Treat this sweep as **audit findings, not a production certification**. Do not claim all 372 lessons pass until the full mapping, Beta injection, breadcrumbs, local-route validation, and real-browser control tests have been run. Fix shared runtime patterns first, then course-specific exceptions, and only then rerun the full audit.
