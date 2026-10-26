# Algebra I · Unit 01 · Emergency Lesson Accessibility Forensic Audit
Date: 2026-10-26
Branch: `main`

## Reported problem
Parent and student saw only the bottom "Lesson Evidence" card and the Arcade/Academy utility controls after attempts to make workflow cards clickable. The screenshot's scrollbar thumb was visibly positioned near the bottom of the Chrome viewport, so the viewport appears scrolled down to the ungraded formative-evidence area. This is a plausible browser scroll-restoration symptom; screenshot alone is not sufficient to prove that the main Algebra I lesson engine has vanished.

## Definitive source checks
- All six Unit 01 HTML files exist on `main`; every one has exactly one HTML document, a `<main id="main"></main>` render target, the Unit 01 curriculum-data loader and the Unit 01 lesson engine.
- **All relative script and stylesheet URLs in these six HTML lesson pages resolve to actual repository files.** No missing local dependency was found.
- `units/unit-01/assets/unit01-data.js`: 6 authored lessons, 4 objectives and 4 concepts each, mystery/problem and misconception-repair writing each, **60 original lesson-check questions (10 per lesson)**. Mastery target remains 80%.
- The canonical Unit 01 lesson engine produces a full instruction journey: Mystery → Discover → Learn → Algebra Lab → Wrong Answer Museum → Defend → Lesson Check, including feedback, written evidence, and assessment submission.
- The Unit 01 lesson engine, its data and Lesson 01 HTML were **not changed** by the workflow-card experiment. The three files that *were* modified have been restored byte-for-byte to the pre-experiment baseline commit `536df8b2dd71df55e42bcedee53aac740ace1885`:
  `courses/mathematics/assets/course-lesson-workflow-v1.js`
  `courses/mathematics/assets/course-lesson-workflow-v1.css`
  `courses/mathematics/algebra-1/assets/algebra1-workflow-adapter-v1.js`.
- The experiment's temporary audit document, test and workflow were removed from `main`.
- The ecosystem directory visible in the previous screenshot was a global Verve N Veda menu CSS-loader issue, not Algebra I curriculum. Its shared JS now loads `vnv-ecosystem-menu.css` and defaults the drawer to hidden even if CSS fails.

## Stronger regression gate installed
`courses/mathematics/algebra-1/tools/browser-audit-unit01-full-curriculum.mjs` uses Playwright Chromium, localhost serving and **fictional isolated localStorage records** to require:
- Lesson 01 complete public reading with no learner profile;
- each of six lessons visibly displaying its own true title, a real instruction workspace, the seven original section headings and at least ten check questions;
- a working Submit & Score control and no unexpected ecosystem overlay;
- local curriculum data still containing six lessons and 60 authored original questions.
The existing `.github/workflows/algebra1-browser-regression.yml` now invokes the new strict browser check after installing Chromium. The workflow may run from the `main` updates, but successful CI execution has **not been confirmed**. Source inventory is PASS, browser-runtime certification PENDING.

## Safety boundaries
No curriculum, lesson engine, authored questions, mastery rules, enrolled student record, or browser-local saved work was deleted or modified by this audit. No user should clear browser storage to troubleshoot this layout. Browser scripts cached by an older service worker could complicate deployment, but the specific student device's cache status has not been observed.

## Immediate diagnostic
On the original Grade 9/Algebra I Unit 01 Lesson 01 browser tab, press **Command + Up Arrow** (Mac Chrome) to navigate to the top. The main Algebra I heading should appear above the separate ungraded Lesson Evidence panel. The lesson's available Unit Home, Course Home, mathematics sections, and check are distinct from the evidence card. If there is still no visible main lesson at the top after a normal refresh, capture the top viewport and any browser console error before further modifying the curriculum.
