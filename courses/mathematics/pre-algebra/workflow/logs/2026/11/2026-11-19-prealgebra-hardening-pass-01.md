# Pre-Algebra Hardening Pass 01

**Date:** 2026-11-19  
**Type:** audit · repair · hardening  
**Scope:** shared Pre-Algebra lesson runtime only; assessments intentionally unchanged.

## Verified observations

1. Unit 01 already uses the newer Math Engine lesson shell and shared Pre-Algebra v2 adapter.
2. Units 02–13 use the shared adapter/core to normalize legacy lesson markup at runtime.
3. Legacy embedded typography can force eyebrow/kicker text to 55px, competing with the canonical title hierarchy.
4. The lesson core calculated and retained in-memory scores even when a persistent browser write could not be verified, but the learner-facing status did not clearly surface that failure.
5. The direct lesson export contained score/attempt/reflection evidence but did not include the shared completion checklist, quick-check state, or guided-note evidence.
6. Core navigation can render a mastery-based next link before the v2 completion adapter applies the stricter checklist + mastery contract.

## Committed changes

### Shared lesson adapter
Path: `courses/mathematics/pre-algebra/assets/prealgebra-math-lesson-v2-adapter.js`

- Bumped runtime marker to **2.3.0**.
- Added a high-specificity eyebrow/kicker override so legacy 55px category labels cannot overtake lesson titles.
- Preserved the 16px ordinary-text floor, collapsed-section system, completion checklist, and 80% mastery contract.

Commit: `5a1548a9b48f594199476db875208377082adcff`

### Shared lesson core
Path: `courses/mathematics/pre-algebra/assets/prealgebra-lesson-engine-core-v2.js`

- Added verified persistence state tracking.
- Learner-facing lesson status now warns when storage cannot be verified as persistent.
- Score submission, lesson review, and reflection save now surface persistence failure instead of implying a durable save.
- Lesson export now includes:
  - section checklist state,
  - quick-check state,
  - guided notes,
  - score/attempt/reflection evidence,
  - storage persistence state/error.
- After core navigation renders, the v2 adapter explicitly re-applies the full completion gate so **checklist + ≥80% mastery** remains the final progression authority.

Commits:
- `4084232fcd437ff20e281e6a83e01ebf8195a1ff`
- `0afe4b94d60cf8b056624eda6ca271cab964482f`

## Assessment safety

No midterm, final, mastery-check question bank, answer key, score threshold, official attempt history, or assessment page was edited in this pass.

## Static verification

PASS:
- adapter version marker = 2.3.0
- legacy eyebrow 55px override present
- explicit persistence warning present
- lesson export includes section checks
- lesson export includes quick checks
- lesson export includes guided notes
- post-render completion gate re-check present
- no assessment-specific logic added to the modified shared files

## Remaining HOLD

- Browser/device acceptance: desktop, tablet portrait, tablet landscape, and phone.
- Live storage-failure simulation to confirm warning copy and export behavior.
- Representative lesson smoke test in Unit 01, a mid-course unit, and Unit 13.
- Curriculum-specificity sweep remains separate from this runtime hardening pass.
