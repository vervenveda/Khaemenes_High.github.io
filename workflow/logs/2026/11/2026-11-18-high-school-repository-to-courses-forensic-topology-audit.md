# Khaemenes High · Repository-to-Course Forensic Topology Audit
Date: 2026-11-18 ET
Repository: `vervenveda/Khaemenes_High.github.io`
Scope: **read-only inspection of executable application files**; this documentation is the sole change in this audit. Main branch, no merges, no learner data reads, no browser account access.

## Scope and method
- GitHub recursive main tree: approximately 9,462 entries, 7,731 tracked files at time of enumeration. Tree returned complete, not truncated.
- Inspected High School root, 4 grade landing pages, 4 student profile entry HTML files, global chrome, math readiness entry, algebra diagnostic engine, service worker and top-level course landing pages in Mathematics, English, Science, Social Studies, Physical Education.
- Enumerated course directory paths and checked sample local entry routes against tracked files. Dynamic JavaScript-generated links and runtime network destinations are **not** certified from static source.
- Read existing Nov 18 Chrome DevTools preflight and UI freeze observer recovery workflow logs; their runtime HOLD remains in force.
- **No Chrome Performance trace, production browser acceptance or authenticated learner flow** was performed here.

## Topology: authority and traversal
`index.html` High School front hall -> `grades/grade-09..12/index.html` -> `grades/grade-XX/student-profile/index.html` -> Daily Lessons / selected course landings -> diagnostic/readiness -> lessons / assessment engine -> learner-scoped browser evidence + Family Registry / course continuation authority.
A parallel `courses/index.html` branches to `courses/{mathematics,language-arts,science,social-studies,electives,shared}/`.
`assets/high-school-global-chrome-v2.js` owns shared VNV header, hamburger, right-hand ecosystem dock and typography; dual-ticker scripts are also loaded explicitly by various pages.
`service-worker.js` intercepts and caches navigation and assets, creating a possible stale-resource dimension. It does not prove that any specific report is stale.
**Preserve course grade/mastery authority**, registry ownership and existing saved learner evidence during repair.

## Course topology census (tracked files within course root)
| Group | Landing roots and counts | Observations |
|---|---|---|
| Mathematics | Pre-Algebra 705; Algebra I 535; Geometry 431; Algebra II 366 | All four have `diagnostic/index.html` and `assessments/index.html`; distinct assessment engines. |
| Mathematics continuation | Precalculus/Trigonometry 6; Calculus I 6 | High School paths are intentional Higher Learning handoff pages, not complete local course lesson trees. Do not label complete course content absent from High School as a defect without following Higher Learning routes. |
| English | English 9 335; English 10 188; English 11 186; English 12 186 | All have assessments index. English 9 has a much heavier week/day HTML implementation, with shared lesson engines varying by grade. File counts are not educational-quality scores. |
| Science | Integrated Science 9 714; Biology 10 251; Chemistry 11 244; Physics/Engineering 12 322 | Each has a landing and assessments index. Science 9 includes a diagnostic landing. Other courses use different prerequisite/assessment entry formats. |
| Social Studies | Grade 09 464; 10 359; 11 397; 12 234 | Distinct landing and weekly study structures; not a single shared assessment URL shape. Grade 11 Personal Finance has `index.html` (verified by direct directory listing after an earlier unreliable tree-only negative). |
| Physical Education | 15 files within `courses/physical-education/` | Shared PE assessment studio and explicit Grade 09 Week 01/02 banks, not a confirmed four-grade per-course assessment matrix. |
| Electives | Grade 09 Psychology 101 has a large dedicated module; others represented through shared elective pathways | Cross-grade elective assessment/runtime parity remains to be audited separately. |

## Confirmed architecture / source findings
1. **Algebra II diagnostic duplicate loader (CONFIRMED):** `courses/mathematics/algebra-2/diagnostic/index.html` references `../../../shared/math-entry-gate.js` **twice**. The module has no top-level singleton early return and registers `setInterval(publishReadiness,500)` when `data-math-entry="diagnostic"`. This is a concrete duplicate-execution risk. Do not repair until independent duplicate-load regression is added.
2. **Global chrome observers (CONFIRMED, impact not proved):** `assets/high-school-global-chrome-v2.js` attaches a whole-document `MutationObserver` for most non-profile/non-front-hall course pages. On child-list mutations it calls `mountHeader()`, `mountToolbar()`, floater cleanup and schedules typography. Separate semantic hierarchy observer traverses heading candidates. `enforceReadableTextFloor` scans descendant elements and computed styles. High DOM churn (e.g. assessments, English/Math experiences) warrants Chrome Performance evidence. Previous Nov 18 workflow already excluded front hall and profiles from one blanket observer.
3. **Math diagnostic browser polling (CONFIRMED):** `courses/shared/math-entry-gate.js` publishes readiness every 500ms on diagnostic pages. This may be acceptable in isolation but amplifies duplicate includes and demands lifecycle scrutiny.
4. **Multiple chrome ownership pathways (CONFIRMED):** high-school root, grade landings, course landings and student profiles vary in explicit ticker, header, ecosystem toolbar and class-tools loading while shared chrome also attempts to mount components. Canonical source modules are not guaranteed equivalent to single invocation. Idempotence and DOM instance counts must be verified.
5. **Course architecture uneven (CONFIRMED):** mathematics, English, science and social studies have different assessment URLs, engine scripts and storage patterns. Do not apply a single toolbar/DOM patch mechanically to all courses. Use course-specific contracts and tests.
6. **High School student profiles are script-heavy (CONFIRMED):** Grade 09 39 script tags; Grade 10 36; Grade 11 39; Grade 12 38 in profile entry HTML. Load sequencing and missing dependency behavior deserve focused runtime audits before expanding feature injection.
7. **Large embedded landing pages (CONFIRMED):** e.g. English 9 entry ~315KB; Grade 11 and 12 Social Studies entries ~370KB and ~490KB. File size alone does not prove a freeze, but it increases risk when paired with document-wide DOM observation and repeated scans.

## Algebra I diagnostic incident boundary
- On Nov 18, new lower-left six-button class-tools loader was added then **rolled back** after Chrome Page Unresponsive. The Start Assessment entry and existing exam data were preserved. Do not reintroduce the extra loader before a browser Performance trace.
- Following user's observation that questions appeared cut off at 13, `courses/mathematics/algebra-1/assets/exam-engine.js` was modified to page a 36-question diagnostic in three 12-question sections, with saved answer selection, first-unanswered navigation and full print handling. The changes are on main **but lack browser acceptance**. This audit did not edit them or reset records.
- Verify questions 1–12, 13–24, 25–36, radio answer persistence across pages, written responses, incomplete-submit guidance, scoring, printing and reload recovery before any further structural/UI additions.

## Risk-ranked recommended repair sequence
**P0 — Freeze/assessment integrity:** Reproduce Chrome unresponsiveness using DevTools Performance, preserve logs. Inspect shared chrome MutationObserver callbacks, remount counts, and math readiness interval. Validate Algebra I 36-question navigation and persistence. Stop on evidence of looping/stale cache; do not clear learner storage.
**P1 — Single-owner chrome:** Define one header/hamburger, ticker-pair, right dock and left class-tools mount contract with per-page eligibility and duplicate guards. Test the canonical Grade 09 landing and diagnostic without loading redundant scripts.
**P1 — Algebra II duplicate entry gate:** Remove one script reference only after regression confirms exactly one readiness interval and correct learner-scoped behavior. Avoid changing actual assessment questions and mastery.
**P2 — Course-by-course route + assessment acceptance:** Mathematics four diagnostics/units/assessments -> English 9/10/11/12 -> Science 9/10/11/12 -> Social Studies 9/10/11/12 -> PE -> Electives. At each step validate entry, navigation, first/middle/final item, write/reload, submission, export, failure recovery.
**P2 — Student profiles:** Test four-grade Class Progress, Schedule, Daily Lessons, left/right toolbars, guest tour and family separation on real tablet/desktop viewports.
**P3 — Visual harmonization:** After P0/P1, apply centered parchment/charcoal, 16px text floor, symmetric grids, collapsible sections and footer layout without altering course authority.

## Evidence standard
Static file checks, syntax validation, and GitHub Actions are **not** browser usability certification. Maintain separate evidence for (A) source path existence, (B) JS syntax/tests, (C) real-browser render/interactions, (D) learner-scoped persistence, (E) protected assessment provenance. Mark fully verified only after all applicable layers pass. The audit makes **no claim that all lesson links, all 7,731 files or every assessment question are individually validated**.

## Current action
**HOLD feature expansion and broad automated edits**. Preserve latest working heads; use surgical fixes with one commit/one unit of rollback. No executable files were modified by this audit.

## 2026-11-18 update · course landing page observer isolation
- User confirmed that the High School home and student profiles are repaired; the widespread remaining issue concerns individual landing pages.
- Shared source: `assets/high-school-global-chrome-v2.js`. Its non-front-hall/non-profile blanket document-wide remount observer was still running on grade and course landings.
- Surgical patch `d399ba4`: added landing-route exclusions (`stableGradeLanding`, `stableCourseLanding`) to that one observer, preserving initial canonical mount and limiting the change to landing pages. Lessons and diagnostics continue using the existing runtime until separately tested.
- Regression updates `799623f`, `22047d1`: verify exclusions for grade, department and course landings; avoid inadvertently exempting the Algebra I diagnostic/lessons; existing front hall/profile exclusions retained.
- Source checks: JS parses; landing-route guards present; canonical header and toolbar initial setup still present.
- **HOLD**: Browser performance and route-by-route interaction acceptance not yet verified. Semantic hierarchy observer and third-party component interactions remain unprofiled. Do not claim every landing page fixed until real-browser checks pass.

## 2026-11-18 emergency recovery · opt-in forensic runtime detached
- User reported landing pages entirely frozen and requested removal of optional diagnostics.
- `assets/high-school-global-chrome-v2.js` removed its document-wide mutation-driven remount observer and the semantic-hierarchy full-document observer. Initial one-time mount of official VNV header, menu and ecosystem toolbar remains; one-time hierarchy normalization remains.
- Removed published forensic script imports from High School front hall, Grade 09 and Grade 12 landing, Grade 09 Student Profile (including external UI inspector), Science 9 Unit 00 and readiness, and English 9 Day 01.
- The forensic JS files are retained **unloaded** for source provenance/recovery. No learner records or curriculum were edited.
- Updated `tests/high-chrome-observer-recovery.test.mjs` to assert no forensic imports and no blanket observers. Source-level syntax and static checks passed; full test runner and live Chrome responsiveness not certified in this intervention.
- The High School service worker uses cached-first JS with a network refresh, so a controlled reload may initially return older shared scripts; do not delete browser storage or learner evidence. Inspect service-worker version/network delivery if stale behavior persists.
- **Release acceptance HOLD** until actual browser test verifies course landing interactions and document main-thread responsiveness.

## 2026-11-18 continuation · Algebra II duplicate diagnostic loader removed

- Scoped source-only repair; no learner data or course assessment records touched.
- Added `tests/algebra2-diagnostic-single-loader.test.mjs` in commit `506a039febc63a136b2fa53146dd733cc7043fbe` to require exactly one diagnostic readiness gate loader and preserve diagnostic course identity and assessment-engine linkage.
- Removed only the second `../../../shared/math-entry-gate.js` script include from `courses/mathematics/algebra-2/diagnostic/index.html` in commit `9e7d3a5257e31470b0a44f76899d7f0c7d3d2a0d`.
- Post-commit source fetch confirmed exactly one `math-entry-gate.js` script include; `math-algebra2` configuration and `assessment-engine.js` remain referenced.
- Status: **source repair complete; source assertion verified.** Dedicated Node test suite execution, GitHub Actions result and real-browser single-interval / learner-scoped readiness acceptance **HOLD**.
- No broad toolbar changes, persistence migration or browser storage clearing authorized as part of this repair.
