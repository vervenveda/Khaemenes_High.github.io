# Grade 09 Cross-Course Static Validation — 2026-08-16

**Branch:** `hardening/archaemenes-highschool`  
**Validation type:** source/file-architecture inspection only  
**Browser/deployment execution:** NOT performed

## Purpose

This checkpoint verifies that the Grade 09 hardening layers are attached coherently before live browser, learner-switch, mobile, keyboard, and print testing.

It does not certify generated assessment content or runtime behavior.

## Shared authority expectations

The hardened Grade 09 design consistently targets:

- Family Registry = learner identity and formal placement authority;
- NAIB = intake, interpretation, delegation, and connection;
- Khaemenes Academy = institutional learning context;
- Archaemenes = Academy mentor, not grader;
- course portals = course-specific learning evidence;
- 80% = formal mastery minimum;
- preview/practice state = separate from formal learner records;
- no course page silently promotes/demotes or rewrites Family Registry placement.

## Readiness and support architecture

### Grade 09 Readiness Gateway

Present at `courses/readiness/grade-09/` with separate Math, ELA, Science, Social Studies, and Research/Academic Readiness evidence.

Known production blockers remain: independent item verification, cut-score calibration, constructed-response evidence, duplicate analysis, answer-position audit, and live learner-isolation tests.

### Foundations Studio

All five support paths are present:

- `courses/foundations/grade-09/mathematics/`
- `courses/foundations/grade-09/literacy/`
- `courses/foundations/grade-09/science/`
- `courses/foundations/grade-09/global-inquiry/`
- `courses/foundations/grade-09/research-study/`

Each remains a forensic candidate pending generated-bank/content and browser validation.

## Formal course hardening attachment

### English 9

Academy-facing wrapper loads, in order:

1. High School continuity;
2. English Academy bridge;
3. English forensic-quality layer.

The forensic layer stages 36 dedicated weekly banks, differentiated daily lesson purposes, an independent midterm, and an independent final.

**Static status:** layers attached.  
**Still unverified:** runtime lexical compatibility, generated-item correctness/uniqueness, answer distribution, browser behavior.

### Integrated Science 9

Academy-facing wrapper loads, in order:

1. High School continuity;
2. Science Academy bridge;
3. Science forensic-quality layer;
4. Science cumulative-evidence synchronization layer.

The cumulative synchronizer recognizes the repository's submitted objective records for Units 01–04, Units 05–07, Units 08–09, and the comprehensive final, and is designed to merge those records into learner-scoped Science evidence.

A standalone midterm record remains absent and is deliberately not fabricated.

**Static status:** layers attached.  
**Still unverified:** runtime synchronization/load order, cumulative gate policy, numeric/generated bank correctness, browser behavior.

### Global Studies Honors 9

Academy-facing wrapper loads, in order:

1. High School continuity;
2. Global Studies Academy bridge;
3. 36-week forensic curriculum-quality layer;
4. dedicated objective-bank replacement;
5. deterministic answer-position balancing layer.

The hardened objective architecture contains 180 week-specific objective items plus independent 18-item midterm and 24-item final pools.

**Static status:** layers attached.  
**Still unverified:** all 222 new item keys/facts, semantic duplicates, final runtime answer distribution, browser behavior.

### Pre-Algebra Bridge

The original 148 KB monolithic portal is preserved as `legacy.html` with blob SHA `1f86cf98681502de7be0749c79805faba14eea1f`, matching the former hardened-branch `index.html` source before wrapper conversion.

The Academy-facing wrapper now loads:

1. High School continuity;
2. Pre-Algebra Academy continuity/learner-scoping bridge;
3. Pre-Algebra forensic question-bank layer;
4. formal mastery-gate layer.

The hardening path also contains `readiness/`, a separate 32-item Foundation → Pre-Algebra verification assessment.

**Static status:** original preserved and layers attached.  
**Still unverified:** generated numeric banks, distractor collisions, runtime gating/load order, learner isolation, browser behavior.

## Relative-path/source-level checks completed

Source inspection confirms the new Pre-Algebra wrapper references local `legacy.html`, its three local hardening assets, the shared High School continuity asset, the new readiness assessment, Mathematics Foundations, Mathematics Department, and Ninth Grade landing using repository-relative paths consistent with its directory depth.

Mathematics Foundations now links back to the dedicated Pre-Algebra readiness verification.

## Cross-course concerns that intentionally remain open

1. No current hardening layer in this checkpoint has been executed in a real browser by this validation pass.
2. Iframe compatibility wrappers use `allow-scripts allow-same-origin`; they are transition/compatibility containers, not hostile-code security boundaries.
3. Runtime-injected legacy functions rely on classic-script lexical visibility and must be browser-tested.
4. Generated question families can still produce numeric or distractor edge cases until fully enumerated.
5. Readiness/placement scores are advisory evidence, not formal Registry placement changes.
6. The Science midterm record remains a known explicit gap.
7. Student-facing answer-key exposure, print layout, mobile overflow, keyboard focus, and accessibility need live verification.

## Next validation pass

The next pass should be browser/live interaction testing with at least:

- formal Grade 09 Learner A;
- formal Grade 09 Learner B;
- Grade 08 preview learner;
- no active learner / practice state.

For each formal course verify: prerequisite locks, 79% vs 80% behavior, reassessment, semester/exam gates, learner switching, persistence, report/print behavior, and preview isolation.

## Static verdict

**Grade 09 is structurally much stronger and the planned hardening layers are attached, but source-level attachment is not the same as runtime certification. Do not merge/publish or label A+++ until content verification and live/browser validation pass.**
