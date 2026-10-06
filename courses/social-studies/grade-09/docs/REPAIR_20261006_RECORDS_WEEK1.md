# October 6, 2026 — learner records and Week 1 repair

The student entry path now reads placement for the selected Academy learner. Learner-specific course, readiness, foundation and backup records share a guarded local record adapter. Older unassigned records remain in their original namespace; they are not silently assigned to a child. This is browser continuity, not protected account authentication or STOS synchronization.

Corrupt records, changed learner selection, conflicting tab snapshots, oversized records and failed storage writes pause saving visibly. Backups carry course and learner identity; import validates before changing the course database. This is a browser preflight conflict check, not a durable server transaction or an atomic cross-device compare-and-swap.

The landing has one next action and collapsed supporting resources. Continuation uses actual readiness/foundations or the active returning learner and resumes the earliest week still awaiting evidence/review. Explicit week selection remains available for preview. Browsing a lesson does not award mastery.

Week 1 instruction has been consolidated into both canonical data files. The upgraded packet is a five-day, four-step workspace with a complete, explicitly fictional six-record meeting evidence set, a coordinate map and witness table. Source, map and argument assignments retain keys 1-1, 1-2 and 1-3. Existing writing loads; revisions preserve prior evaluation evidence and require a new score. Baseline, daily notes and position save with the same learner course record. Printed work and learner backups remain available. Day numbers describe order, not deadlines.

Evaluator tools now score weekly constructed responses out of five and display Week 1 baseline/notes. A weekly grade combines the current 20-point objective attempt with its evaluated five-point response. New objective attempts or edited response text invalidate the earlier written evaluation. Examination categories combine objective and written percentages by published points: 90+60 for midterm; 110+60 for final. Missing scores remain pending; valid zeroes count. An official final grade requires 108 evaluated assignments, 36 complete weekly quizzes, 36 reflection evaluations and both complete examinations. Progress counters remain distinct from academic grades.

Service-worker activation removes only this course’s older cache names and preloads the focused Week 1 and new helpers. It does not promise the entire course is available offline without prior downloads. Course scripts use cache versions so the repaired helpers replace older copies.

## Validation

- tests/record-context.mjs: two learner contexts, legacy preservation, matching/wrong-owner import, corrupt/stale/quota failures, duplicate/prototype schema rejection and active-only return entry.
- tests/grade-integrity.mjs: pending versus zero, weekly response pairing, examination weighting, complete-evidence final-grade requirement and consolidated Week 1 instruction.
- tests/week1-workspace.mjs: one visible step, saved position, assignment preservation, review invalidation, immutable baseline, unsaved draft backup and complete source/map structure.
- Assessment structural validator: all 36 weeks, 360 objective questions and 36 constructed responses pass with no warnings.
- Static script and route checks supplement the synthetic tests; deployed public landing/placement/workspace inspection follows publication.

## Remaining inspection and repair

- Reconcile and expand later units’ source packs, app instruction and printable packet variants.
- Weeks 26–27 local model repair is recorded in `REPAIR_20261006_LOCAL_LABS.md`; the canonical lab pages no longer require an online Finance dependency.
- Review the remaining legacy top-level week directories and broken legacy styling/return references.
- Verify all historical sources, distractors and current-information resources independently.
- Validate continuity on the student's physical tablet and confirm evaluator scoring against preserved evidence.
- Protected Academy account authority and STOS synchronization remain separate commissioning work; no STOS services or real account records were changed.
