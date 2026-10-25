# High School Assessment Phase 2 Hardening — 2026-10-24

## Scope

This record closes the four assessment-specific Phase 2 findings from the October 24 curriculum deep-dive audit while preserving the Academy's non-regression boundaries.

### Preserved without weakening

- 80% mastery minimum;
- learner-scoped saved records and best-score history;
- randomized fresh retakes where authoritative;
- specialist course engines;
- separation of public learning from confidential secure assessment;
- educator review for essays, CER, labs, projects, research, speaking, capstones and defenses;
- local-first/offline core behavior;
- accessibility support without lowering cognitive demand;
- work on `main` only.

## 1. Grade 12 Social Studies — transfer assessment source of truth

**Finding:** the live runtime had already advanced to transfer-oriented questions, but the checked-in weekly quiz files and course-data artifacts still contained older recall-heavy banks.

**Repair:**
- synchronized all 36 `week-XX/quiz.json` files to the live transfer banks;
- synchronized `data/course-data.json` and `course-data.js`;
- recorded `bankVersion: transfer-v3`;
- preserved the 80% weekly gate and existing learner score history;
- did not weaken randomized form behavior.

**Regression contract:**
- 36 × 10 = 360 objective items;
- no more than 20% stand-alone vocabulary recall per weekly bank;
- at least 50% disciplinary transfer/source/data/map/case reasoning;
- stable IDs, valid four-option mappings, skill/source metadata, versioned banks.

Validator:  
`node courses/social-studies/grade-12/validation/validate-transfer-quizzes.mjs`

## 2. English 10–12 — passage/source anchor guarantee

**Finding:** 36-week supplemental banks existed and were already wired into the weekly Monte Carlo pool, but a random five-of-seven draw could omit the passage/source item. Several weeks also used scenario reasoning without an explicit text/source anchor.

**Repair:**
- upgraded English 10, 11 and 12 supplemental banks to `v4-passage-anchored`;
- every one of the 108 weeks now marks the first supplemental item as a passage/source anchor;
- added original instructional micro-passages/source notes where the earlier item was not explicitly anchored;
- changed future supplemental IDs to include the bank version, preventing a changed item from masquerading as the same active form;
- weekly draws now request a first-party Monte Carlo `sourceQuotas` requirement of one `passage-anchor` item;
- retained five-question weekly form length, random question/answer order, immutable submitted attempts, best-score history and the 80% target.

This closes the audit's **weekly** passage-anchor requirement. It does not claim that every unit/midterm/final item is passage-based.

Validator:  
`node courses/language-arts/validate-upper-english-passage-anchors.mjs`

## 3. Algebra I — balanced first visible lesson-check form

**Finding:** raw question data contain concentrated answer indices, especially in later units. The live engine already remapped choices correctly, but independent shuffling did not guarantee a balanced visible distribution on a five-question lesson check.

**Repair:**
- lesson checks now schedule correct positions across four choices before first render;
- a five-question lesson form has a 2/1/1/1 distribution, with the position receiving the extra correct answer randomized;
- every retake rebuilds a newly balanced mapped form;
- the post-render DOM shuffler now leaves already-balanced lesson forms intact;
- formal Unit Mastery was intentionally left unchanged.

**Integrity check:** all 87 Algebra I lessons / 435 lesson-check questions retain four choices and correct answer-text mappings.

Validator:  
`node courses/mathematics/algebra-1/tools/validate-lesson-option-balance.mjs`

## 4. Biology 10, Chemistry 11, Physics & Engineering 12 — secure assessment blueprints

**Finding:** the public repository correctly withheld confidential midterm/final item banks, but that also meant an auditor could not see the intended cognitive design of secure assessment.

**Repair:**
- published a public `assessments/SECURE_ASSESSMENT_BLUEPRINT.md` for each upper-science course;
- linked each blueprint from the course assessment boundary page;
- documented standards/domain coverage, cognitive evidence families, weekly transfer requirement, 80% mastery, Week 18 midterm, Week 36 final, closed-book secure administration, correction history, educator-reviewed performance evidence, accommodations and the public/protected boundary;
- explicitly prohibited publication of secure prompts, stimuli, answer choices, answer keys, form seeds, signing material and private learner/reviewer records.

**Public-bank evidence check:** every ordinary instructional week (1–17 and 19–35) in all three upper-science courses currently contains at least one evidence, quantitative, model, application, method or design item. Weeks 18 and 36 are the documented cumulative assessment windows.

Validator:  
`node courses/science/validate-upper-science-assessment-blueprints.mjs`

## One-command Phase 2 check

Run:

`node tools/validate-phase2-assessment-evidence.mjs`


## Canonical consolidated forensic assessment

The four Phase 2 checks are now consolidated into one source-level forensic instrument:

- `tools/forensic-assessment-audit.mjs`
- report: `docs/FORENSIC_ASSESSMENT_CONSOLIDATED_2026-10-24.md`

The compatibility command `tools/validate-phase2-assessment-evidence.mjs` now delegates to that instrument. The consolidated audit reports PASS/WARN/FAIL findings, exact and template-similarity signals, explanation/option/answer integrity, learner-visible answer-position protections, passage/source anchors, science transfer coverage, and the secure/public assessment boundary.

## Certification boundary

These repository checks certify public assessment architecture, mappings, metadata and published cognitive blueprints. They **do not claim to inspect or certify confidential secure midterm/final item quality when those protected items are intentionally absent from the public repository**. Secure-item certification must occur inside the authorized assessment authority with fictional/test learner records where applicable.
