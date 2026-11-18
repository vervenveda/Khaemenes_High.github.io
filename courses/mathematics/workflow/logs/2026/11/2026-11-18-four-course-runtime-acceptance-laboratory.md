# High School Mathematics · Four-Course Runtime Acceptance Laboratory

**Date:** 2026-11-18  
**Courses:** Pre-Algebra · Algebra I · Geometry · Algebra II  
**Phase:** rendered-browser acceptance infrastructure  
**Source validation:** PASS  
**Production rendered sweep:** HOLD until executed from an HTTP(S) browser that can reach the Academy site

## Purpose

The four mathematics courses already reached source-controlled Exceptional status. This phase creates a real rendered-browser acceptance layer so responsive/device claims can be measured rather than inferred from HTML/CSS source.

## Runtime Acceptance Laboratory

Added:

`courses/mathematics/runtime-acceptance/index.html`

The laboratory is same-origin and non-destructive.

### Viewport profiles

- Desktop · 1440 × 900
- Tablet landscape · 1180 × 820
- Tablet portrait · 820 × 1180
- Phone · 390 × 844

### Core sweep

The Core Sweep measures three representative surfaces in each course:

- course landing;
- Unit 01 Lesson 01;
- Unit 01 formal mastery check.

That is 12 surfaces × 4 viewport profiles = 48 rendered cases.

### Full sweep

The Full Sweep adds:

- comprehensive final;
- Teacher / Records Center;
- Unit 01 applied investigation;
- Geometry Spaced Retention Lab.

All target routes were verified present on `main`.

## Automated acceptance checks

For each rendered case the laboratory checks:

- HTTP route health;
- same-origin iframe render;
- document title;
- main landmark;
- duplicate IDs;
- visible readable text below 16px;
- unnamed visible controls;
- button controls below 44px;
- document-level horizontal overflow;
- horizontally clipped interactive controls;
- visible GitHub repository links;
- canonical High School header count;
- canonical hamburger count;
- official ecosystem toolbar count;
- known floating-control duplication;
- fixed/sticky footer overlap;
- unexpected full-screen fixed overlays.

Math landing pages additionally require:

- exactly one canonical 333 ticker;
- exactly one canonical AutoPopulate ticker;
- mounted mathematics ticker-pair state.

## Storage failure fixture

Added:

`courses/mathematics/runtime-acceptance/storage-failure-fixture.html`

The fixture uses temporary diagnostic keys only.

It verifies:

1. a normal storage write is not reported persistent until read-back verification succeeds;
2. a deliberately forced `QuotaExceededError` produces:
   - `persisted:false`;
   - `verified:false`;
   - memory fallback retained;
   - readable in-memory recovery;
3. temporary diagnostic keys are cleaned afterward.

No learner records, grades, mastery evidence, or Academy identity keys are touched.

## Ticker parity repair discovered during runtime preparation

The fresh runtime-oriented audit found that canonical High School chrome automatically mounted the 333 + AutoPopulate pair for English Week 01, but not for all four mathematics landing pages.

The shared chrome now recognizes:

- Pre-Algebra landing;
- Algebra I landing;
- Geometry landing;
- Algebra II landing.

It mounts the official pair idempotently.

A timing defect was also addressed: Pre-Algebra already declared deferred ticker scripts later in the document. A script-tag existence check could therefore succeed before the ticker APIs had executed. The shared chrome now waits for the actual `VNV333Ticker.mount` and `VNV_TICKER.autoPopulate` APIs before mounting.

Source syntax validation of the repaired global chrome: PASS.

## Target topology validation

All Full Sweep routes were checked directly in the repository.

Every target surface exists.

Every target surface also includes:

- `course-entry-contract.js`;
- `high-school-global-chrome-v2.js`.

## Laboratory self-validation

- Runtime laboratory inline JavaScript syntax: PASS.
- Storage fixture inline JavaScript syntax: PASS.
- Global High School chrome after ticker repair syntax: PASS.
- All target routes: PASS.
- Shared course-entry + global chrome coverage on all target routes: PASS.

## Manual sign-offs intentionally not automated

The laboratory keeps these separate rather than falsely certifying them:

- physical tablet rotation and touch feel;
- browser Print / Save PDF pagination;
- Geometry diagram / CAD manipulation;
- disposable-learner assessment submit/correct/retake/export/recovery;
- keyboard-only and screen-reader operation;
- production loading of first-party VNV external services.

## Responsive-risk repairs completed during laboratory preparation

### Algebra II lesson / practice symmetry

A static responsive-risk pass found that Algebra II still used desktop side columns:

- lesson content: main + 310px sticky side rail;
- practice content: main + 330px sticky side rail.

This conflicted with the current mathematics presentation rule: centered, symmetrical lesson content with no side columns.

The shared Algebra II stylesheet and landing-page mirror now use:

- one-column lesson layout at every viewport;
- former lesson-side content below the main lesson;
- two equal support cards on wide screens;
- one support-card column below 700px;
- one-column practice layout with static support content.

Representative Pre-Algebra, Algebra I, and Geometry Unit 01 lesson sources were also checked. Their effective lesson layouts are already one-column.

### Canonical mathematics footer fallback

The Full Sweep topology audit found inconsistent footer coverage:

- Pre-Algebra representative surfaces: complete;
- Algebra II representative surfaces: complete;
- Algebra I: several lesson/assessment/teacher surfaces lacked a footer;
- Geometry: several assessment/teacher/project surfaces lacked a footer.

The shared course-entry contract now injects a footer **only when a mathematics page has no footer**.

Canonical fallback footer:

- charcoal background;
- centered content;
- light cream 16px text;
- course-aware label;
- idempotent;
- presentation only;
- no learner records or assessment logic touched.

The runtime laboratory now treats missing footer presence as a hard failure.

### Stricter runtime policy

The laboratory now treats the following as hard FAIL conditions:

- canonical High School header missing or duplicated;
- canonical hamburger missing or duplicated;
- official ecosystem toolbar missing or duplicated;
- footer missing;
- multi-column `.lesson-layout` on a lesson surface.

This prevents an incomplete chrome or a reintroduced lesson sidebar from receiving an automated PASS.

## Final shared-source self-check

Validated after the responsive-risk repairs:

- `course-entry-contract.js` syntax: PASS;
- `high-school-global-chrome-v2.js` syntax: PASS;
- runtime laboratory inline JavaScript syntax: PASS;
- canonical fallback footer present in shared contract: PASS;
- mathematics ticker-pair mount and API wait present in global chrome: PASS;
- single-column lesson policy present in runtime acceptance lab: PASS.

## Acceptance boundary

This phase does **not** change the department verdict that the curriculum/source architecture is Exceptional.

It changes the runtime state from “no standardized acceptance mechanism” to:

**RUNTIME ACCEPTANCE LABORATORY READY · PRODUCTION RENDERED SWEEP HOLD**

A production browser run of the Core Sweep should be the next acceptance action. Any FAIL should reopen only the affected page/category rather than weakening the source-level curriculum verdict.
