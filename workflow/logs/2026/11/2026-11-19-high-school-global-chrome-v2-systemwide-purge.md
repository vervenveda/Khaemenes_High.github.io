# 2026-11-19 — Retired High School Global Chrome v2 System-Wide Purge

**Decision:** The owner explicitly identified `high-school-global-chrome-v2.js` as a bug, and authorized its isolation, disengagement and purge.

**Repository:** `vervenveda/Khaemenes_High.github.io` only.
**Branch:** `fix/purge-retired-high-school-global-chrome-v2-20261119`
**Base:** the guarded English 9–12 unified readiness branch (stacked); **production main not modified**.
**Mode:** reversible source updates, no repository-wide reset, no lesson/assessment/learner-data changes.

## Root cause

The named script has no tracked implementation in the current High School repository but many live pages, offline worker caches and older CI tests referenced it. The dependency caused missing network requests and unreliable canonical header/ticker population. Earlier regression guards also expected the missing file, making some checks inherently impossible to pass.

## Removed active dependencies

- English 10, 11, 12 full course indexes (3): removed obsolete script imports.
- Science 9–12 indexes (4): removed obsolete script imports.
- Social Studies 9–12 indexes (4): removed obsolete script imports.
- Electives index (1): removed obsolete import while retaining its original Academy header, menu and ecosystem toolbar.
- Mathematics offline service workers (4): removed obsolete asset from Algebra I's pre-cache inventory and from path recognizers in Pre-Algebra, Algebra I, Geometry and Algebra II. All assessment/lesson cache entries remain.
- `assets/high-navigation-v1.js`: retired the old `__KHAEMENES_HIGH_GLOBAL_CHROME_V2__` runtime fallback-suppression sentinel. Existing canonical dual-ticker, navigation and official ecosystem dock fallback remain.
- Two workflow references to the missing file removed/replaced by real native checks.
- Positive tester/validator allowlists or bogus missing-asset expectations were updated to inspect real VNV dual ticker, English shared CSS, native worker recovery and official assets. Legitimate historical snapshots and negative `no obsolete chrome` regression assertions remain as audit evidence, not active dependencies.

## Canonical restoration without a new regulator

For the English 10–12, Science 9–12 and Social Studies 9–12 active course entry pages, a **single official VNV header library** is loaded from `https://vervenveda.com/assets/vnv-header-autopopulate.js?v=2.1.0`. A minimal direct mount uses `window.VNV_HEADER.mount` after the **existing High School dual-ticker-ready event**. An invisible `data-khae-header` anchor before the course body establishes 333 → auto ticker → official header DOM order. The `high-navigation-v1.js` native dual ticker guard and official lower-right ecosystem-toolbar fallback stay the only owners of those surfaces. Existing lower-left class tools and instructional dashboards are not replaced.

No new global chrome engine, permanent regulator, mutation loop or shared CSS overlay was introduced.

## Automated source proof

`tools/validate-retired-high-school-global-chrome-purge.mjs`:
- inventories all **5,906 current active runtime/deployment source files**, excluding historical workflows, blueprints and nonexecuting negative guard tests;
- checks no executable imports or runtime sentinel references remain;
- verifies 3 English official-header routes, 8 Science/Social official-header routes, the Electives existing header and all 4 Math offline worker source syntax;
- ensures preservation of VNV's native 333 + auto ticker, official header and official ecosystem dock.

`.github/workflows/retired-high-school-global-chrome-purge.yml` additionally runs the High School canonical typography and English 9–12 readiness CSS / exact diagnostic source-integrity checks.

**Source CI: PASS** — https://github.com/vervenveda/Khaemenes_High.github.io/actions/runs/44645491938
- `ACTIVE_SOURCE_CENSUS_PASS 5906 files checked`
- `RETIRED_CHROME_REMOVED English 10/11/12 ... PASS`
- `CANONICAL_SUBJECT_CHROME_PASS 8 subject pages; 4 math service workers; electives`
- `HIGH_SCHOOL_GLOBAL_CHROME_PURGE_PASS`
- `ENGLISH_09_12_SHARED_READINESS_CSS_PASS`

## Acceptance boundaries / HOLD

- The code is on a **protected branch**, not merged into `main`. Stacked baseline includes the separate English readiness CSS changes; do not merge it indiscriminately.
- Desktop, tablet portrait/landscape, mobile, offline worker update, print, Chrome sticky ordering and hamburger/translator interactions require real-browser verification.
- Existing CI failures in High School learning architecture, older course quality validators and profile routes are independent and are **not certified resolved** by this source-only purge.
- Do not delete or edit history containing the retired dependency; historic evidence is kept for forensic traceability.
- Do not modify Verve N Veda protected gateway index, STOS, identity, account cloud, lesson scores, unit gates, quizzes, midterms or finals.

## Regression prevention

Keep the new active-source scan in CI. Any attempted reintroduction of the named import or sentinel into live source will fail source acceptance. Use official VNV ecosystem components directly, never resurrect the retired global chrome module.
