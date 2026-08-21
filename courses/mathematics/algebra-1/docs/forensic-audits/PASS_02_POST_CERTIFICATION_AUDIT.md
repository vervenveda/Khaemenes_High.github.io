# Algebra I Forensic Audit — Pass 02
Date: 2026-08-21
Branch: audit/algebra1-post-certification-v2
Baseline: certified first-draft branch at 9a6f02752c46e7014793395f2df8c6848d91d0ff

## Scope
Second forensic pass after first-draft certification. This pass does not change grading policy or mastery thresholds. It focuses on production reconciliation, duplicate-file integrity, academic-package parity, learner-record language, and repeatable audit discipline.

## Finding A1-P02-001 — Production branch reconciliation required
Severity: HIGH
Status: OPEN

The certified Algebra I branch and `main` have diverged. The certified branch contains the hardened assessment/reset/evidence architecture while `main` contains several later repository changes. Production should not be treated as the certified Algebra I baseline until the legitimate `main`-only changes are reconciled with the certified branch without discarding either side.

Evidence example: the certified assessment engine preserves scored result evidence when a learner resets the current form; the older main-side engine removed both draft and result records. The certified behavior is authoritative under the Golden Course Specification.

Required repair:
1. reconcile `main`-only changes onto a candidate based on the certified branch;
2. preserve the certified Algebra I course engines and evidence contracts;
3. rerun first-draft validation and forensic audit after reconciliation;
4. merge only after green evidence.

## Finding A1-P02-002 — Duplicate top-level Unit 13 answer-key artifact
Severity: MEDIUM
Status: OPEN — SAFE REPAIR PATH VERIFIED

Both of these files exist and carry the same Unit 13 answer-key dataset:
- `assessments/answer-key.json`
- `assessments/answer-keys.json`

They are semantically identical; the plural file differs only by a trailing newline. However, the service worker currently precaches the plural path. The assessment grading engine does not load either top-level file for scoring; runtime scoring uses each question object's canonical numeric `answer` field. The distinct file `units/unit-13/assessment/answer-key.json` is a separate unit-local artifact and must remain.

Safe repair order:
1. repoint service-worker precache from `./assessments/answer-keys.json` to `./assessments/answer-key.json`;
2. bump the Algebra I cache version so deployed clients cannot retain a stale precache contract;
3. verify no remaining runtime/reference dependency on the plural file;
4. delete only `assessments/answer-keys.json`;
5. rerun offline/runtime/forensic validation.

This is an integrity cleanup only. It does not change any answer, score, assessment, mastery threshold, or grading policy.

## Finding A1-P02-003 — Development/construction records remain in learner-facing root
Severity: LOW-MEDIUM
Status: OPEN

The course root still contains historical construction artifacts including:
- `ALGEBRA1_FIRST_DRAFT_PROGRESS.md`
- `GRADE10_ALGEBRA1_FILE_MANIFEST.md`
- `HIGH_SCHOOL_PROFILE_SNIPPET.html`
- `MATHEMATICS_PORTAL_GRADE10_INTEGRATION.md`
- `UNIT_13_QA_REPORT.json`
- `UPDATE_NOTES.md`
- `UPLOAD_GRADE10_ALGEBRA1_FIRST.md`
- `UPLOAD_MAP.md`

These records should be preserved as provenance, not deleted blindly. Recommended destination: `docs/development-history/` with an index explaining that they are historical build records and not learner curriculum.

## Finding A1-P02-004 — Structural unit parity is strong; instructional-depth parity requires measurement
Severity: MEDIUM
Status: OPEN

All 13 units expose the expected structural package: lessons, Foundation/Core/Extended practice, mastery check, answer key, project, family guide, teacher guide, standards map, vocabulary, and unit metadata. This is strong structural parity.

Depth is not yet proven equivalent. Early/middle rebuilt unit banks commonly contain five explicit scored items per lesson (for example Unit 02 has 35 questions across seven lessons), while later hardened units carry much deeper banks. The next parity audit must measure lesson depth, interactive work, explanation quality, misconception handling, pathway depth, and assessment coverage rather than merely file presence.

Required parity dimensions:
- lesson instructional depth;
- worked examples and misconception support;
- Foundation/Core/Extended differentiation;
- meaningful interactive work;
- scored-question density and coverage;
- explanation presence and quality;
- teacher/family guidance specificity;
- project/lab evidence quality;
- standards/vocabulary alignment.

## Finding A1-P02-005 — Grade calculation is correct; evidence-source language should be clearer
Severity: LOW-MEDIUM
Status: OPEN

The certified record engine retains the exact course-grade formula:
- Coursework: 40%
- Midterm: 20%
- Final: 30%
- Capstone: 10%

The 80% mastery/progression threshold remains separate from the weighted course-grade calculation. No grading logic change is recommended.

Recommended language hardening:
- identify midterm/final values as course-engine-derived when imported from canonical local evidence;
- identify coursework averages as calculated/entered from documented course evidence rather than independently authenticated identity evidence;
- identify capstone/portfolio score as a human-reviewed or program-attested component unless a future canonical scorer is formally adopted;
- state clearly that a parent/program administrator validates identity, portfolio evidence, instructional hours, dates, and credit issuance;
- preserve the distinction between browser-local evidence and an independently authenticated institutional record.

## Finding A1-P02-006 — Repeatable forensic suite added
Severity: POSITIVE CONTROL
Status: IMPLEMENTED

A post-certification forensic audit suite has been added to the protected audit branch and wired after the existing first-draft validator. The suite is intended to check course duration, unit/lesson inventory, package parity, question-bank integrity, unique identifiers/prompts/choices, valid answer indexes, explanation presence, navigation/resource consistency, record/grading invariants, and mathematical/template flags.

## Pass 02 repair order
1. Reconcile certified Algebra I with legitimate `main`-only repository changes.
2. Canonicalize the top-level Unit 13 answer-key filename safely, including service-worker cache migration.
3. Relocate root construction history into a historical documentation area.
4. Harden learner-facing grade/evidence language without changing 40/20/30/10 or the 80% mastery rule.
5. Run quantitative 13-unit depth parity measurement.
6. Rerun first-draft validation plus forensic audit.

## Preservation rule
No certified Algebra I behavior is changed without concrete evidence that the change improves correctness, accessibility, maintainability, instructional quality, trust, or learner experience.