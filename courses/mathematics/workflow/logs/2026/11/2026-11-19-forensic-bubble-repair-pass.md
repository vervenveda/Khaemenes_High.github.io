# High School Mathematics · Forensic Bubble Repair Pass

**Date:** 2026-11-19  
**Scope:** Pre-Algebra · Algebra I · Geometry · Algebra II  
**Goal:** push out the five forensic audit bubbles while preserving assessment authority and the Mathematics Engine assessment firewall.

## Guardrails

- Do not migrate or rewrite formal assessment content as part of lesson-engine hardening.
- Preserve the 80% mastery authorities already owned by each course.
- Repair validators at their authority point when the failure is caused by stale path or architecture assumptions.
- Keep Algebra II Mathematics Engine rollout on HOLD until Geometry release/launch/game validation is green.
- Record every repair and verification result here.

## Bubble 1 · Geometry strict-release regression

### Finding
The dedicated Geometry release validator was still testing the retired assessment implementation:
- external diagnostic bank loader;
- historical 20-question unit contract;
- `unit-mastery-source-v2.js`;
- `assessment-engine.js`;
- `GEO_ASSESSMENT_CONFIG` on every assessment surface.

The current Geometry assessment blueprint is newer:
- self-contained 40-question readiness diagnostic;
- current 25-question unit mastery checks;
- exactly 20/25 = 80% mastery;
- five reasoning dimensions × five questions on current depth forms;
- `unit-mastery-source-v3.js` + `unit-assessment-engine-v3.js` on standard unit checks;
- self-contained mixed-evidence Midterm and Final surfaces.

### Repair
Replaced the stale validation assumptions in:
`courses/mathematics/geometry/tools/validate-release.mjs`

The validator now audits the current assessment blueprint **without changing assessment pages or scoring logic**.

Commit:
`970e6c2c3a11cbefb7c1822171b22037d691d92a`

Status: **CI verification pending**

## Bubble 2 · Four-course lesson-launch contract

### Finding
The launch validator treated deployed site-root references such as:
`/Khaemenes_High.github.io/assets/high-school-global-chrome-v2.js`
as repository-root paths containing the deployment prefix. This produced hundreds of false missing-dependency failures across Geometry and Algebra II.

### Repair
Normalized the deployment prefix before local dependency lookup in:
`courses/mathematics/tools/validate-four-course-lesson-launch.mjs`

Commit:
`5e6ccd20b85bbcce6b7417eccfab19dbbb7f5ec5`

Status: **CI verification pending**

## Bubble 3 · Shared-game validation

### Finding
The shared-game validator had the same site-root resolution defect for canonical game pages, causing valid global chrome references to be resolved underneath each game directory.

### Repair
Normalized absolute deployed site-root references in:
`courses/mathematics/tools/validate-shared-games.mjs`

Commit:
`1b66324b0f87cf2a453573aa90abad0d8bb5afa3`

This removes false broken-reference noise so remaining game failures represent real wiring differences.

Status: **CI verification pending**

## Bubble 4 · Geometry / Algebra II local validation density

Status: **OPEN**

Next action after the three red contracts are clean:
- add course-local launch/engine/assessment-firewall regression coverage for Geometry;
- add equivalent course-local architecture coverage for Algebra II;
- keep shared department tests as a second layer rather than the only layer.

## Bubble 5 · Algebra II Mathematics Engine migration gate

Status: **HOLD BY DESIGN**

Algebra II remains academically Exceptional, but Mathematics Engine v2.2.3 migration will not begin until:
1. Geometry strict release is green;
2. four-course lesson launch is green;
3. shared-game contract is green or remaining failures are explicitly classified and repaired;
4. Geometry local regression coverage is strengthened.

## Assessment firewall

No assessment page, question bank, scoring routine, mastery threshold, Midterm, Final, or diagnostic content was modified in this repair pass so far.


## Verification checkpoint 1

After the first validator repairs:

- Geometry strict release errors dropped from **70 → 4**.
- Four-course / launch-day validation dropped to **3 Algebra I assertions** after the site-root dependency fix.
- Shared-game validation no longer reports false global-chrome path failures; remaining failures represent real placement/wiring mismatches.

Additional repairs:

### Algebra I launch contract modernization
Updated:
`courses/mathematics/tools/validate-prealgebra-algebra1-launch.mjs`

The validator now accepts:
- canonical shared-chrome/ticker mounting rather than requiring a literal ticker DOM copy;
- the current readiness/grade separation wording;
- the current self-contained `const CONFIG` diagnostic blueprint as well as the historical `window.EXAM_CONFIG` form.

Commit:
`c22b600b01ba95481dedc55fd639e9396ca91e5e`

### Geometry cumulative assessment literal verification
Updated:
`courses/mathematics/geometry/tools/validate-release.mjs`

Midterm/Final validation now verifies the live JavaScript-literal `CONFIG` contract directly:
- `record_key`;
- `mastery_threshold:80`;
- selected-response count;
- constructed-response count;
- selected / constructed / overall 80% rules;
- evaluator/reviewer evidence.

No assessment content or scoring logic changed.

Commit:
`06dfe2ce6cfe6b36abdbb40d7114446b490d9f53`

Status: **next CI run pending**


## Verification checkpoint 2

### Geometry release and higher-math gate

- **Geometry Release Validation: PASS**
- **Higher Mathematics Local Regression: PASS**
- Mathematics Engine lesson-shell integrity has remained **PASS** throughout this repair cycle.
- Geometry now has course-local regression coverage for all 90 adopted lessons, adapter version parity, course-entry coverage, native mastery authority, and the assessment firewall.
- Algebra II now has a course-local engine-readiness/HOLD regression covering all 92 lessons and protected assessment routes.
- A repository-level higher-math gate blocks an Algebra II Mathematics Engine adapter until Geometry is formally authorized for the next migration stage.

### Pre-Algebra hardening discovered during launch validation

The department launch chain exposed one real service-worker boundary issue: successful assessment navigations could be cached by the generic navigation path.

Repaired:
- `courses/mathematics/pre-algebra/service-worker.js`
- cache release advanced to `v24-assessment-firewall-20261119`;
- runtime navigation caching now stores only reusable lesson pages;
- assessment / diagnostic / records exclusions remain outside reusable offline storage;
- canonical component hashes refreshed after the approved service-worker repair.

No assessment question, scoring routine, mastery threshold, Midterm, Final, or diagnostic content changed.

The Pre-Algebra launch chain now passes:
- lesson launch contract;
- component integrity;
- assessment depth;
- Academy mastery gates.

### Algebra I validator modernization

The launch chain then exposed older audit assumptions left behind by the rebuilt assessment architecture.

Completed:
- whole-course validator now recognizes the current 60-selected + 6-constructed Midterm and 100-selected + 10-constructed Final;
- reset validation recognizes current draft replacement while preserving scored evidence;
- assessment-depth harness is isolated from browser-only hardening-loader DOM dependencies;
- late-unit assessment audit now targets the current `unit-mastery-engine-v3.js` architecture:
  - 25 fixed lesson-balanced questions;
  - exact 20/25 = 80% mastery;
  - fixed no-shuffle retry form;
  - verified persistence required before mastery credit;
  - canonical prior-unit, Midterm, lesson, and weekly prerequisites;
  - reconstructable answer evidence;
  - current Unit 10–13 supplemental/rebuilt banks;
- cumulative audit now targets the current self-contained mixed-evidence Midterm/Final rather than retired `window.EXAM_CONFIG` surfaces.

Latest Algebra I assessment-depth modernization commit:
`001c8fd8c05fc623853270e0c170dc198495a189`

### Shared-game architecture

The shared-game chain now passes its canonical registry, repair-behavior, cross-course synchronization, formative-game, and storage/link stages.

Headless test harness modernization completed so current accessible game DOM patterns are supported:
- external chrome scripts are excluded from inline gameplay extraction;
- removable dynamic nodes are supported;
- text nodes are supported;
- Model Forge `newChallenge` interface is recognized.

The canonical registry-driven lesson bridge remains practice-only and assessment-excluded.

### Bubble status

1. Geometry strict-release regression — **PUSHED OUT / PASS**
2. Four-course lesson-launch contract — **substantially cleared; final downstream chain verification in progress**
3. Shared-game registration/wiring — **architecture repaired; final downstream suite verification in progress**
4. Geometry / Algebra II local validation density — **PUSHED OUT / PASS**
5. Algebra II Mathematics Engine migration gate — **PUSHED OUT / HOLD ENFORCED**
