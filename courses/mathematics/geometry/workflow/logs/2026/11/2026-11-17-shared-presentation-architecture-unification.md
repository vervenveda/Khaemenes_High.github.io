# 2026-11-17 · Geometry Shared Presentation Architecture Unification

- Repository: `vervenveda/Khaemenes_High.github.io`
- Timezone: America/New_York
- Type: repair · shared architecture · chrome · accessibility
- State: source/shared-runtime repair PASS; rendered browser/device acceptance HOLD

## Goal

Normalize Geometry's course-wide presentation architecture without editing 90 lessons individually and without changing learner data, mastery gates, assessment logic, proofs, diagrams, or curriculum content.

## Shared presentation unifier

Created:
- `courses/mathematics/geometry/assets/geometry-presentation-unifier-v1.js`

Responsibilities:
- load the canonical dual-ticker pair idempotently;
- load the official translator idempotently;
- demote legacy Geometry `.site-header` markup to an unbranded `.geometry-local-nav`;
- preserve useful local Geometry controls;
- remove repeated `.hero-badge` institutional logo treatment;
- install a runtime 16px readability floor with sufficient specificity to override the legacy embedded 14px page rule.

Commits:
- initial module: `49693b1d12892f5c15dea22bb40c0478d95eb066`
- runtime readability authority: `94fbec0c794d5573e02b0aac0c6fccd02b2d84aa`

## Shared CSS repairs

`courses/mathematics/geometry/assets/styles.css`

Repairs:
- removed `minmax(0,1fr) 330px` practice rail;
- `.practice-side` is no longer sticky;
- removed both legacy 310px lesson-rail patterns;
- lesson support region now becomes an equal two-column centered grid, then one column on small screens;
- normalized explicit small text declarations;
- added Geometry local-navigation styling;
- added shared 16px readable-text floor.

Commits:
- `8a56ac534e6c579881816f7dab758935b2478ee2`
- remaining lesson-sidebar rail cleanup: `510004da4fdcbae403ab6d0625b2efac58afcb4c`

## Shared runtime propagation

The unifier is loaded through the existing Geometry runtime classes rather than by manually editing every page.

### Course landing runtime
- `assets/app.js`
- commit `7a52ff524fb95502273ba897644750e47b9bc8a1`

### Unit dashboards
- `assets/unit-index-gates.js`
- commit `e0faa5847229dcb700d0cf84ec3a9c8a4d7ce92c`

All Unit 01–13 entry pages already load this shared gate runtime.

### Lessons
- `assets/lesson-tools.js`
- commit `7b4f6b7b08981e69f434c315717e7fe313532d48`

Representative early/middle/capstone lessons all load this runtime, allowing the shared presentation unifier to reach lesson pages without 90 manual edits.

### Assessments / diagnostic
- `assets/assessment-engine.js`
- commit `3c4cb28b26eedc0184a7d79be08d60893a03b872`

The readiness Diagnostic uses this shared assessment engine.

## Landing-specific repair

`courses/mathematics/geometry/index.html`

Repairs:
- removed inline 330px practice rail;
- removed inline 310px lesson rail;
- normalized explicit small presentation text;
- added direct presentation-unifier loader as a landing fallback.

Commit:
- `d0f0000b61d93c699b7414d7693dab2e42fa55d0`

## Blueprint update

Geometry now explicitly follows the canonical rule:
- one canonical High School branded header;
- optional one unbranded Geometry local navigation strip;
- Geometry/unit heroes preserved as course identity;
- no repeated institutional K/logo treatment.

Blueprint commit:
- `c6717ec7d40e2afa0027eb63a08bf0af1e3a97eb`

## Static verification

PASS:
- shared stylesheet contains no 330px practice rail;
- shared stylesheet contains no 310px lesson rail;
- shared stylesheet contains no sticky practice/lesson side rail;
- unifier contains dual-ticker loader;
- unifier contains translator loader;
- unifier contains runtime 16px readability authority;
- course landing reaches the unifier directly;
- Unit 01–13 reach it through `unit-index-gates.js`;
- representative lessons reach it through `lesson-tools.js`;
- Diagnostic reaches it through `assessment-engine.js`;
- canonical High School global chrome remains present on sampled entry/lesson pages.

## Important source-vs-rendered distinction

Many individual Geometry HTML files still contain their historical 14px embedded style and branded legacy header markup. These are now normalized by the shared runtime at render time. They have not yet been mechanically rewritten in all 90 lesson files.

This is intentional for maintainability: one shared authority is preferred over 90 duplicated presentation patches.

## Remaining HOLD

Rendered/browser acceptance is still required to verify:
- exactly one visible canonical header;
- one visible Geometry local nav where useful;
- exactly one 333 ticker + one AutoPopulate ticker;
- translator appears once;
- no sticky-stack collisions;
- diagram widths remain generous;
- lesson support grid looks balanced in tablet landscape;
- no horizontal overflow;
- protected assessments remain appropriately low-distraction.

## Next action

Inspect live/rendered Geometry landing, Diagnostic, Unit 01, Unit 06, Unit 13, and representative lessons. Fix any runtime collision or spacing issue before moving into curriculum-depth refinements.
