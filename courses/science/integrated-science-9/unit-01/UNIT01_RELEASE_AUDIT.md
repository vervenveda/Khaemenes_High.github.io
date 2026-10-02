# Unit 01 Final Release Audit

Course: KH-SCI-IIS9 — International Integrated Science 9
Unit: 01 — Scientific Inquiry, Measurement & Evidence
Audit status: structurally release-ready with one documented public-static assessment limitation

## Release determination

Unit 01 is the current A++++ reference implementation for the Science 9 reconstruction. Its instructional sequence, investigations, assessment boundaries, human-scored evidence, mastery progression, standards evidence, Mentor/Beta inheritance, ProTool integration, safety language, and Unit 02 prerequisite gate have been reconciled.

This release determination does **not** claim that public client-side answer keys are secret. Objective quiz and assessment scoring remain browser-delivered and therefore inspectable by a technically deliberate learner. This is acceptable only as a documented local-first/formative limitation. Truly secret high-stakes keys require protected grading outside public client source.

## Instructional sequence verified

1. Day 01 — phenomena to investigable questions
2. Day 02 — variables and operational definitions
3. Day 03 — fair tests, controls, sampling, replication
4. Day 04 — measurement quality, resolution, bias, uncertainty
5. Day 05 — preregistered investigation planning
6. Day 06 — raw-data integrity and analysis
7. Day 07 — tables, graphs, scale, visualization integrity
8. Day 08 — uncertainty, association, causation, confounding
9. Day 09 — CER, source tracing, Evidence Citation Studio, PROSE revision
10. Day 10 — independent transfer, mastery, correction, reflection

## Required performance evidence

- Paper Helicopter Investigation: complete scientific audit trail
- Urban Shade & Surface Temperature Dataset Laboratory: observational inference and causal reasoning
- Independent Paper Absorbency Design Task: human-scored, mastery benchmark 32/40
- Mastery Quiz: 12/15 minimum
- Unit Objective Assessment: 20/24 minimum (smallest whole-number score meeting ≥80%)
- Constructed Response 1: human-scored, 16/20 minimum
- Constructed Response 2: human-scored, 16/20 minimum
- Instructor/parent-educator evidence verification
- Final reflection

## Runtime progression verified

Unit 01 completion requires 17 recorded requirements:

- Days 01–10
- helicopter investigation
- dataset laboratory
- mastery quiz
- design task with rubric mastery
- objective assessment
- human verification including both constructed-response mastery scores
- reflection

The course-level `completedUnits` record receives `u01` only when all requirements are met. Unit 02 checks that course-level state and blocks progress recording until `u01` is present.

## Mentor / Beta / privacy boundary

The shared Science theme loader supplies the public Beta Program and Mentor controls. Shared widgets receive sanitized page context only. They are not intended to receive student names, answers, scores, localStorage contents, credentials, or private routing information.

Mentor support is used for conferences, correction, explanation, reflection, and revision. It is explicitly separated from independent mastery attempts.

## ProTool integration verified

Context-sensitive Unit 01 integration includes, where pedagogically appropriate:

- Khaemenes Scientific Calculator
- Evidence Citation Studio
- Atlas Evidence Analysis
- PROSE Editorial Suite
- Unit 01 Dataset Laboratory
- Investigation Design Task

Tools support exploration, checking, visualization, citation, and revision; they do not replace measurements, reasoning, safety review, source evaluation, or mastery.

## Safety verification

Student investigations are framed as Tier 1 / low-risk activities with explicit stop conditions. The helicopter investigation prohibits climbing to increase drop height. The absorbency transfer assessment is design-only on its assessment page and does not authorize experimental execution.

## Standards evidence

`STANDARDS_MAPPING.md` is present and maps Unit 01 outcomes to actual student evidence/assessment locations while preserving the course governance boundary against invented or unverified jurisdiction-specific codes.

## Release validator

Run from repository root:

```bash
node courses/science/integrated-science-9/tools/validate-unit01.mjs
```

A failed required check blocks release. The validator intentionally emits a warning for client-visible objective answer indexes rather than representing them as secret.

## Remaining limitation

The only known intentional architecture limitation in this release is public static client-side objective-key visibility through deliberate source inspection. No claim of cryptographic or server-grade assessment security is made.

## Reference-standard rule

Future Science units should meet or exceed Unit 01 in:

- phenomenon/objective alignment
- explicit scientific instruction
- authentic investigation/data work
- measurement and uncertainty reasoning
- evidence provenance
- CER and source literacy
- tool/game/app integration by purpose
- Mentor + Beta availability
- ≥80% mastery gating
- human review for nuanced scientific performance
- safety/accessibility/printability
- standards evidence
- regression validation
