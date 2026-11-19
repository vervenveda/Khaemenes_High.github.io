# 2026-11-19 · High School Mathematics Five-Item Forensic Hardening Pass

- **Repository:** `vervenveda/Khaemenes_High.github.io`
- **Scope:** Pre-Algebra, Algebra I, Geometry, Algebra II
- **Mode:** targeted source repair after fresh forensic audit
- **Assessment safety:** question banks, answer keys, scoring formulas, mastery threshold (80%), learner-record schemas, and assessment attempt data were not rewritten.

## 1 · Retired High School chrome regulator references

The deleted runtime `/assets/high-school-global-chrome-v2.js` was still referenced by Mathematics lesson and assessment pages.

Repairs:
- Removed the dead loader from the four audited representative lessons.
- Enumerated the four core courses' assessment centers, cumulative assessments, weekly mastery surfaces, and 13 unit mastery checks per course.
- Removed the retired loader wherever present across those assessment surfaces.
- No replacement regulator or presentation observer was introduced.

Preservation boundary:
- Existing local headers, assessment workspaces, question banks, scoring engines, storage adapters, worker recovery, and mastery logic remain intact.

## 2 · Course landing entry routes

The four clean course landing pages had profile/family/enrollment links but no direct instructional doorway.

Repairs:
- Added **Enter Course** → `units/unit-01/index.html`
- Added **Assessments** → `assessments/`
- Preserved Learner Profile, Parent Profile, and Enrollment.
- Updated the shared minimal landing grid to `auto-fit` so five actions remain balanced.
- The Enter Course action is visually distinguished without changing the course's underlying routing authority.

Affected:
- `pre-algebra/index.html`
- `algebra-1/index.html`
- `geometry/index.html`
- `algebra-2/index.html`
- `assets/math-minimal-landing-v1.css`

## 3 · Pre-Algebra weekly mastery route

The canonical mathematics manifest declared:
`assessments/weekly-mastery.html`

The route was absent even though the underlying weekly authority already existed.

Existing authorities preserved:
- `course-map-v2.json` — 36-week unit map
- `prealgebra-weekly-mastery-v2.js` — 360 unique weekly questions
- 10 questions per week
- five dimensions:
  - procedural fluency
  - multi-step application
  - representation/interpretation
  - error analysis
  - transfer reasoning
- v2 blueprint: 8 current-focus + 2 delayed-retrieval questions
- mastery threshold: 8/10 = 80%

Repair:
- Created `pre-algebra/assessments/weekly-mastery.html` as a thin host.
- The page fetches the canonical course map, initializes the existing v2 weekly bank, and hands that bank to `math-weekly-mastery-engine-v1.js`.
- The route fails closed if the 36-week map or 36-week bank cannot be verified.
- No new assessment questions were authored.

## 4 · Shared mathematics hardening parity

Canonical shared hardening layer:
`courses/mathematics/assets/math-hardening-loader-v1.js`

It loads:
- verified mathematics storage adapter
- canonical mathematics learner record
- progress contract
- storage health
- evidence authority
- progression ledger

Before this pass:
- Algebra II entered the hardening layer through `lesson-tools.js`.
- Pre-Algebra, Algebra I, and Geometry v2 lesson adapters did not explicitly guarantee the same entry path.

Repair:
- Added an idempotent shared-hardening loader invocation to:
  - `prealgebra-math-lesson-v2-adapter.js`
  - `algebra1-math-lesson-v2-adapter.js`
  - `geometry-math-lesson-v2-adapter.js`
- Algebra II's existing `lesson-tools.js` hardening entry remains unchanged.
- The loader is fail-soft: existing lesson behavior remains usable if the shared hardening dependency cannot load.

## 5 · Algebra II assessment contract correction

The prior `algebra-2/assessments/assessment-map.json` was stale:
- it documented unit mastery as 10 questions per attempt,
- and did not describe the live weekly mastery progression.

Current source authority verified:
- 36-course-week structure
- Week 01 = 40-question readiness diagnostic
- Week 18 = Midterm
- 34 graded instructional weekly mastery checks
- 10 questions per graded week
- two questions in each of five reasoning dimensions
- 80% weekly mastery threshold
- 13 unit mastery checks
- 25 questions per unit mastery form
- 20/25 = 80%
- five questions per reasoning dimension
- fixed-form correction/retry policy
- strict progression chain requiring lesson + weekly + unit evidence
- Midterm required before Week 19 / Unit 07 progression
- Final requires the complete prior evidence chain

Repair:
- Updated `assessment-map.json` to schema version 3.1 and documented the live topology.
- Preserved the existing Midterm 60-question and Final 100-question declarations.
- Retained the legacy 156 base-bank count only as a labeled legacy-base count because current supplemental depth banks extend beyond it.

## Verification snapshot

- Four course landings: direct Enter Course present
- Four course landings: Assessments route present
- Pre-Algebra weekly route: canonical course map reference present
- Pre-Algebra weekly route: v2 weekly bank reference present
- Pre-Algebra weekly route: retired chrome regulator reference absent
- Pre-Algebra v2 adapter: shared hardening reference present
- Algebra I v2 adapter: shared hardening reference present
- Geometry v2 adapter: shared hardening reference present
- Algebra II lesson tools: shared hardening reference present
- Algebra II assessment map: 34 graded instructional weeks documented
- Algebra II assessment map: 25 questions per unit documented
- Algebra II assessment map: five questions per dimension documented
- Representative lesson pages: retired chrome regulator reference absent
- Core assessment surfaces: retired chrome loader removed where found

## Follow-up boundary

This pass intentionally did **not** perform a blind rewrite of every lesson HTML file in Mathematics. The four audited representative lesson pages were cleaned, and the shared lesson adapters now supply the canonical hardening path. A future lesson-by-lesson source sweep may separately inventory any residual dead chrome loader tags on non-representative lesson HTML, but that work should remain isolated from curriculum and assessment logic.
