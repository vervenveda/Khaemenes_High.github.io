# Grade 09 Cross-Course Static Validation — 2026-08-16

**Branch:** `hardening/archaemenes-highschool`  
**Validation type:** source/file-architecture inspection and static forensic repair  
**Browser/deployment execution:** NOT performed

## Purpose

This checkpoint verifies that the Grade 09 hardening layers are attached coherently and removes source-level defects that could invalidate later browser testing. It does not claim live runtime certification.

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

## Forensic defect discovered during this pass: nested runtime-template injection

Several compatibility layers wrapped an injected legacy runtime inside an outer JavaScript template literal while the injected body itself contained unescaped template literals. This is a source-level syntax hazard: the outer loader can terminate early before the intended runtime reaches the iframe.

The affected Grade 09 paths identified in this pass included:

- Pre-Algebra mastery/repair code;
- Integrated Science Academy/quality/cumulative code;
- Global Studies Academy/quality code.

### Repair standard applied

Where the nested-template pattern was present, the large injected body was moved to a normal external runtime file and the outer hardening asset was reduced to a small iframe loader. Dynamic runtime scripts are marked `async=false` where ordering matters.

This makes the loader/runtime boundary inspectable and removes the nested-backtick failure mode without changing the preserved legacy portal.

## Readiness and support architecture

### Grade 09 Readiness Gateway

Present at `courses/readiness/grade-09/` with separate Math, ELA, Science, Social Studies, and Research/Academic Readiness evidence.

The source bank contains 50 common-core readiness items and 10 possible follow-up verification items. The existing scoring remains subject-by-subject; no single overall score controls placement.

**Repair in this pass:** `assets/readiness-answer-balance.js` now deterministically changes displayed answer order while preserving each radio input's original scoring value. This removes the strong stored-answer-position pattern without changing item keys.

**Still open:** independent content/key verification, duplicate/near-duplicate review, constructed-response evidence, cut-score calibration, and live learner-isolation/accessibility testing. Current thresholds remain policy candidates rather than validated psychometric cut scores.

### Foundations Studio

All five support paths remain present:

- `courses/foundations/grade-09/mathematics/`
- `courses/foundations/grade-09/literacy/`
- `courses/foundations/grade-09/science/`
- `courses/foundations/grade-09/global-inquiry/`
- `courses/foundations/grade-09/research-study/`

Each remains a forensic candidate pending generated-bank/content and browser validation.

## Formal course hardening attachment

### English 9

Academy-facing wrapper loads:

1. High School continuity;
2. English Academy bridge;
3. English forensic-quality layer.

The forensic layer stages 36 dedicated weekly banks, differentiated daily lesson purposes, an independent midterm, and an independent final.

Static inspection did not reveal the nested-template defect found in the other converted layers.

**Still unverified:** all new keys/content, semantic duplicates, final answer distribution, browser/mobile/print/learner-switch behavior.

### Integrated Science 9

Academy-facing wrapper loads:

1. High School continuity;
2. Science Academy bridge;
3. Science forensic-quality loader/runtime;
4. Science cumulative-evidence loader/runtime;
5. assessment-navigation correction.

#### Repairs completed in this pass

- Science Academy hardening now uses external `science9-bridge-runtime.js` rather than a vulnerable nested runtime string.
- Science forensic quality now uses external `science9-forensic-runtime.js`.
- Cumulative synchronization now uses external `science9-cumulative-runtime.js`.
- The Assessment Center is no longer globally locked until Week 18; individual milestones remain independently gated at their intended weekly prerequisites.
- The quality runtime builds a mixed weekly evidence set using domain content plus vocabulary-in-context, evidence quality, investigation design, CER, source use, and safety/model-limit reasoning.
- The formal Science record now preserves `cumulative` evidence when ordinary course progress is saved.

#### Critical learner-isolation repair

The repository's cumulative benchmark pages still write generic browser-local keys. Automatically copying those generic results to whichever Family Registry learner happens to be active would create a cross-learner attribution risk.

That silent synchronization has been removed. A raw cumulative result is now treated as **unattributed evidence**. In formal mode, the user must explicitly confirm that the active learner completed the latest benchmark before it is copied into that learner's formal Science record. The attribution fingerprint includes score, total, and submission timestamp; a later attempt therefore requires fresh confirmation. Preview mode cannot claim formal evidence.

A standalone Science midterm record remains absent and is deliberately not fabricated.

**Still unverified:** browser execution, cumulative-claim UX, weekly generated content edge cases, full cumulative-gate policy, print/mobile/accessibility.

### Global Studies Honors 9

Academy-facing wrapper loads:

1. High School continuity;
2. Global Studies Academy loader/runtime;
3. Global Studies forensic curriculum loader/runtime;
4. dedicated objective-bank replacement;
5. deterministic answer-position balancing layer.

#### Repairs completed in this pass

- `global9-academy-bridge.js` now delegates its iframe behavior to external `global9-bridge-runtime.js`, removing the nested-template syntax hazard.
- `global9-forensic-quality.js` now delegates to external `global9-forensic-runtime.js`.
- The new forensic runtime differentiates each week by the actual week title/topic while preserving a common five-day historical-thinking progression: inquiry → source/corroboration → map/data/comparison → argument/counterclaim → synthesis/portfolio.
- Purposeful resources are selected from existing Verve N Veda systems based on the week's topic rather than appearing as detached links.
- `global9-objective-bank.js` was inspected for the same nested-template problem; its objective data use ordinary quoted strings and no nested template-literal defect was found in the injected body.

The hardened objective architecture remains 180 week-specific objective items plus independent 18-item midterm and 24-item final pools, followed by deterministic answer-position balancing.

**Still unverified:** independent verification of all 222 objective items, semantic duplicate analysis, final answer-position count, browser/mobile/print/learner-switch behavior.

### Pre-Algebra Bridge

The original monolithic portal remains preserved as `legacy.html` with blob SHA `1f86cf98681502de7be0749c79805faba14eea1f`.

Academy-facing wrapper now loads:

1. High School continuity;
2. Pre-Algebra Academy continuity/learner-scoping bridge;
3. prior forensic-quality compatibility layer;
4. new external forensic bank-repair runtime;
5. external distractor-sanity runtime;
6. external formal mastery runtime.

#### Repairs completed in this pass

- Removed the nested-template hazard from the mastery and new forensic layers by using external runtimes.
- Added explicit bank coverage for powers/roots, equations, inequalities, coordinate/functions, geometry, data/probability, and mathematical modelling instead of falling back to generic number items.
- Rebuilt all 36 weekly banks with varied parameters and balanced answer placement.
- Corrected identified distractor-collision classes and added a final exact-choice collision sanity pass.
- Corrected an initial GCF generator assumption by constructing values whose GCF is actually guaranteed.
- Midterm now draws from 18 independently salted transfer banks rather than copying weekly items.
- Final now draws from 36 independently salted transfer banks rather than copying weekly items.
- Formal gate remains: complete lessons + assignments + 80% weekly mastery; Week 19 also requires an 80% midterm; final requires all 36 weeks plus the midterm.

The separate 32-item Foundation → Pre-Algebra readiness verification remains present.

**Still unverified:** exhaustive generated-family enumeration, independent mathematical key verification, browser execution, learner A/B isolation, mobile/print/accessibility.

## Cross-course concerns that intentionally remain open

1. No current hardening layer in this checkpoint has been executed in a real browser by this validation pass.
2. Iframe compatibility wrappers use `allow-scripts allow-same-origin`; they are transition/compatibility containers, not hostile-code security boundaries.
3. External iframe runtimes still depend on the preserved legacy pages exposing the expected classic-script functions and state names; browser testing is required to prove those contracts.
4. Generated question families still require exhaustive or independently sampled answer verification before A+++ approval.
5. Readiness/placement scores are advisory evidence, not formal Registry placement changes.
6. The Science midterm record remains a known explicit gap.
7. Student-facing answer-key exposure, print layout, mobile overflow, keyboard focus, and accessibility still need live verification.

## Next validation pass

Before merge/publish review, perform browser/live interaction testing with at least:

- formal Grade 09 Learner A;
- formal Grade 09 Learner B;
- Grade 08 preview learner;
- no active learner / practice state.

For each formal course verify: prerequisite locks, 79% vs 80% behavior, reassessment, semester/exam gates, learner switching, persistence, report/print behavior, cumulative attribution where applicable, and preview isolation.

## Static verdict

**The forensic pass found and removed several source-level runtime hazards that the earlier attachment audit could not prove away, including a real cross-learner Science evidence-attribution risk. Grade 09 is materially safer and more coherent, but static repair is not browser certification. Do not merge/publish or label A+++ until item verification and live/browser validation pass.**
