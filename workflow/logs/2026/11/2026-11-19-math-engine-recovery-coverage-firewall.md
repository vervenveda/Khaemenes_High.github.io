# 2026-11-19 · Mathematics Engine Recovery and Coverage Firewall

- **Repository:** `vervenveda/Khaemenes_High.github.io`
- **Mode:** guarded source hardening; no rollback, mass lesson rewrite, or learner data changes
- **Target:** preserve the 2026-11-19 v2.2.3 higher-mathematics contract and subsequent v2.3.0 native lesson improvements
- **Status:** three source rollouts confirmed; Algebra II source rollout HOLD; browser/device acceptance HOLD

## Exact recovered source evidence
- `workflow/logs/2026/11/2026-11-19-math-engine-v2.2.3-higher-math-rollout-protocol.md` remains available.
- `courses/mathematics/geometry/workflow/logs/2026/11/2026-11-19-mathematics-engine-v2.2.3-rollout.md` remains available.
- Canonical Mathematics Engine Blueprint v1.1 remains at `workflow/blueprints/khaemenes-mathematics-engine-blueprint-v1.md`.
- The existing course adapters now report internal `VERSION="2.3.0"`; returning to v2.2.3 without a targeted defect would discard later hardening.
- Geometry U01 L06 retains its SVG proof and native `geometry/assets/lesson-tools.js` dependencies; Algebra I U01 L01 retains its native `unit01.js` and `deep-lesson-engine-v1.js` dependency.
- Representative Pre-Algebra and Geometry assessments have no lesson-adapter references.

## Guarded integrity test
- Updated `tools/validate-math-engine-version-sync.mjs` to enforce unit 01–13 lesson inventories, **one adapter per standard lesson**, internal/cache version parity, foreign-adapter rejection, and the assessment/diagnostic/midterm/final firewall. Unit 00 and Pre-Algebra's engine-preview page are outside the approved standard 97-lesson inventory.
- Counts and status (verified by initial CI logs):
  - Pre-Algebra: 97 inventory, 97 adapter references, VERSION 2.3.0, protected hits 0.
  - Algebra I: 87 inventory, 87 adapter references, VERSION 2.3.0, protected hits 0.
  - Geometry: 90 inventory, 90 adapter references, VERSION 2.3.0, protected hits 0.
  - Algebra II: 92 inventory, **0 adapter references**, VERSION 2.3.0 asset present, protected hits 0.
- Initial guard commit `dc0b349402199d0e734b9eb4f8957e34883f1898` correctly exposed Algebra II's absent enrollment as a failure; run `44627346812`.
- Follow-up guard commit `93c70fee4929460fb6de279e037c69f5993a05a9` categorizes Algebra II as explicit **pending**, not a passed or certified rollout. It rejects any unapproved partial enrollment while preserving the 92 existing native lessons. The three completed rollouts retain strict source-coverage enforcement.
- Future adapter candidates are not silently accepted; an approved course inventory and rollout decision must be recorded first.

## Architecture must not change
- Do not replace lesson curriculum, source diagrams, proofs, games, printables, question banks, scoring engines, grade gates or locally recorded lesson evidence.
- Do not clone Pre-Algebra or Algebra I DOM markup into Geometry/Algebra II. Clone governance and quality, adapt the presentation to native mathematics.
- No browser localStorage is a sovereign account-cloud authority; STOS T03 remains uncommissioned in this workflow.
- No edits to `assessments/`, `diagnostic/`, `midterm`, `final`, parent/student profiles, or any grade records.

## Next gates
1. Confirm the guarded CI run `44627518080` passes after pending-rollout classification.
2. Validate Geometry and Algebra I representative lesson rendering in browsers, including tablet portrait and landscape.
3. For Algebra II, perform one ordinary and one lab/multistep lesson proof against native `lesson-tools.js` and existing progression before any 92-lesson adapter enrollment.
4. Add dated acceptance evidence, then explicitly promote Algebra II into the strict validator baseline; never infer a successful rollout from adapter-file existence alone.
5. Keep separate landing navigation and student Schedule lesson-button audits; static adapter coverage does not prove runtime reachability.

## Rollback
The two validator updates only affect `tools/validate-math-engine-version-sync.mjs`. Restore its prior blob via a targeted commit if the new checker itself malfunctions. Do not revert mathematics unit content or production learner state.
