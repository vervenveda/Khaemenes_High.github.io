# English 9 · Unit 01 Depth and Comprehensiveness Upgrade
**Date:** 2026-11-16  
**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Scope:** English 9, Week 01, Days 01–05; Unit 01 Weeks 02–03 remain follow-ups  
**Entry types:** academic audit, instructional upgrade, source validation  
**State:** WEEK 01 ENHANCEMENT COMMITTED; STATIC SOURCE CHECK PASS; BROWSER AND STUDENT ACCEPTANCE HOLD

## Purpose
Improve the depth of learning without making the experience longer or more burdensome. Preserve the existing 12-unit/36-week/180-block continuum, original reading, assignment wording, weekly workspace, stable learner-scoped fields, 80% mastery boundary, evaluator review, offline-friendly learning and accessible writing alternatives.

## Audit evidence and baseline
- `courses/language-arts/english-9/curriculum.json` holds 12 units and the 36-week plan.
- Week 1 already has 5 individual daily pages, original passages, practice items, response fields, export buttons and an authoritative weekly workspace.
- Week 2 Day 6 provides useful explicit claim-ladder instruction, supporting the decision to retain models and reasoning checks instead of simply adding questions.
- The Week 25 novel study requires a verified complete novel; local calibration fiction cannot substitute for full-book reading.
- Curriculum/lesson specification mismatch: Unit 6 central curriculum says four-to-six-minute speech; Week 18 page says three-to-five-minute speech. Resolution pending a curriculum-level decision.
- Later sampled weeks use integrated weekly five-day lesson blocks, while Weeks 01–13 have verified individual-day routes. Delivery normalization remains a later stage, not a missing-content finding.

## Applied and committed: Week 01
Five additive, initially collapsed `Reasoning Laboratory` sections were inserted before each day's original reading section. Their unique day-specific scaffold is:
1. Retrieve prior thinking without notes, then check.
2. Examine a faithful worked reasoning example from the lesson passage.
3. Identify an unsupported inference or overly easy interpretation.
4. Transfer reasoning into the existing writing field or paper record, and revise.

| Day | Upgrade target | Commit |
| --- | --- | --- |
| 01 | Observation versus inference and uncertainty | `bf91d1982df0abf94470ee675f4f4970b92648fa` |
| 02 | Evidence distributed across paragraphs; test a pattern | `0f3d61b5055bde555f570bbb28ba7624fdef4fea` |
| 03 | Annotations as questions and linked, testable ideas | `66a2e0191b3f7644f2edfa1fd8c19c7835ce46b2` |
| 04 | Claim/evidence/warrant/significance and substantive revision | `09f351596ab4ef39e861333fba9a0e18a59f9687` |
| 05 | Independent transfer, qualifying claims, and counterreading | `358dcb9616aefd546e43e7773f4800c20cb5e97b` |

### Integrity boundaries
- Existing student response `data-save-field` names and scripts were not edited.
- No new form fields, persistence keys, network dependencies, score writers, gradebook changes, mastery switches or assessment answer changes.
- Optional scaffolds are ungraded; they refer students back to existing response fields or paper work.
- All added sections use semantic `section`, `h2`, `details`, `summary` structure, with unique IDs per daily page.
- The permanent first-draft snapshot, export and correction paths remain under pre-existing controls.

## Validation performed
After commits, re-fetched all five updated pages from GitHub default branch and checked:
- Unique Day N source marker and corresponding heading ID: **5/5 PASS**
- Four scaffold stages (retrieve, worked model, misconception challenge, transfer): **5/5 PASS**
- Original learner response field identifier present: **5/5 PASS**
- Original daily-lesson script reference present: **5/5 PASS**

These are source-integrity checks only. **NOT VERIFIED:** responsive rendering, keyboard/screen-reader behavior, JavaScript runtime, local saved-work recovery, offline service worker, learner acceptance or human rubric outcomes. No learner records were used.

## Next steps
1. Student-test Week 01 on desktop and tablet, with zoom, narrow viewport, keyboard-only disclosure and save/export regression.
2. Apply differentiated, day-specific scaffolds to Weeks 02–03, after checking each original lesson for the appropriate skill, text and existing response keys.
3. Complete a five-day lesson-depth checklist per week: authentic text access, explicit model, guided reasoning, independent output, transfer, retrieval, meaningful feedback, vocabulary/language teaching and accessible mode.
4. Audit Units 02–12 sequentially for authentic reading, exemplar depth, writing/revision, spoken evidence and cumulative retrieval.
5. Resolve inconsistent speech timing in curriculum versus Week 18; coordinate rubric and accessibility contracts.
6. Normalize individual-day delivery beyond Week 13 only if justified by beta testing; preserve weekly source authority and existing student work.
7. Add skill-specific progress indicators without converting informal retrieval or participation into academic mastery.

## Release decision
**Week 01 source upgrade committed and statically verified.** Live student-readiness remains **HOLD** until regression and device testing. This log records commits and observed outcomes, not a claim of completed full-course repair.
