# Pre-Algebra Family Records Office

The Academy Family Learning Center is the parent-facing records doorway. This course-level Records Office connects to the canonical Family Registry and creates Pre-Algebra progress summaries, detailed mastery records, portfolio evidence packets, contemporaneous activity and reading logs, full administrative packets, and a parent-issued course completion certificate. Data stays in the browser unless exported. Print or save records for signatures and retain them with the learner's secure educational portfolio.

## Record trust boundary

Generated reports organize editable browser-local evidence. This system does not claim government issuance or accreditation, independent authentication, or universal district acceptance. Reports do not replace jurisdiction-specific evaluation, portfolio, attendance, transcript, or termination requirements. Parents and administrators should confirm current local requirements before submission.

Pre-Algebra currently has two legitimate browser-local evidence streams:

1. **36-week portal progress** — stored under `KHAE_OPEN_PREALGEBRA_FORGE_V2`. This data is organized inside learner profiles used by the course portal and Records Office.
2. **Unit 01–13 lesson mastery evidence** — stored under `khaemenes-prealgebra-unitNN-progress-v1`. These unit keys currently do **not** contain a learner identifier and are therefore classified as **unscoped browser unit evidence**.

The Records Office must not silently attach unscoped unit evidence to whichever learner profile happens to be selected. Unit evidence may be reviewed, exported, or explicitly associated through the learner-association workflow, but automatic learner attribution is prohibited until an intentional identity binding exists.

## Explicit learner association

`unit-evidence-association.html` provides the deliberate bridge between the unscoped Unit 01–13 evidence and a learner profile from the 36-week portal.

The association workflow:

- requires a learner to be selected deliberately;
- requires an explicit confirmation statement;
- stores the association separately from both the source evidence and learner progress;
- permits only one active learner binding for the browser's unscoped evidence set;
- requires release before rebinding the same evidence set to a different learner;
- preserves association/release history;
- fingerprints the evidence snapshot at confirmation time;
- reports when later practice or retakes cause the evidence to differ from the confirmed snapshot;
- never changes scores, mastery, lesson progress, or learner profiles;
- never converts local browser evidence into an authenticated or validated institutional record.

The preferred fingerprint is SHA-256 through the browser Web Crypto API. A local non-cryptographic fallback may be used only as a change detector on older browsers; neither method is represented as a digital signature or proof of authorship.

## Integrated records continuity view

`integrated-records-view.html` is the read-only bridge between the existing Family Records Office and the hardened Unit 01–13 mastery system.

It reads:

- the learner-scoped 36-week portal record;
- the current explicit learner association;
- the current Unit 01–13 evidence snapshot.

It displays those evidence streams side by side only when an explicit learner association exists. It never copies Unit 01–13 scores into the 36-week learner profile, never rewrites either source, and never upgrades association into authentication. If the unit evidence changes after association, the page flags the continuity state for review rather than silently presenting the old fingerprint as current.

The integrated view can export a `khaemenes.prealgebra.combined-records-context` JSON file. That export is a read-only context package, not a merged or independently validated academic record.

## PA-13.3 cumulative assessment contract

The compact Unit 02–13 cumulative assessment engines now use a shared durable mastery contract:

- first, latest, and best cumulative assessment scores are retained;
- a later lower voluntary retake cannot erase previously demonstrated mastery;
- the latest attempt remains visible for instructional feedback while the best score remains the mastery authority;
- legacy flat assessment results are migrated into a one-attempt history record rather than discarded;
- Reset clears the current form and draft only and preserves saved mastery evidence;
- each scored attempt emits domain, skill, item, unit, and resource metadata suitable for future curriculum-quality and adaptive-support routing;
- when an assessment question does not yet have an explicit skill tag, the engine derives a deterministic skill slug from its domain as a compatibility fallback;
- generated item IDs and unit IDs are derived from the current assessment configuration/storage key rather than being hard-coded to Unit 02.

This contract hardens evidence continuity but does not authenticate browser-local assessment records or grant institutional authority.

## Contracts and tools

- `record-contract-v1.json` defines the course-level trust classes and export boundaries.
- `unit-evidence-bridge.js` safely reads Unit 01–13 browser evidence and exposes it as unscoped evidence without changing mastery or learner records.
- `unit-evidence-review.html` provides a centered, printable, read-only review and JSON export of the Unit 01–13 evidence currently stored in the browser. It does not assign that evidence to a learner.
- `unit-evidence-association.js` implements explicit, reversible, fingerprinted learner association without altering source evidence.
- `unit-evidence-association.html` provides the human-facing confirmation, release, status, and history workflow.
- `unit-evidence-association-contract-v1.json` defines the association rules, states, required fields, fingerprint purpose, and release behavior.
- `integrated-records-view.html` presents the associated 36-week portal record and Unit 01–13 mastery evidence together without merging or rewriting either source.
- `legacy-record-normalizer.js` converts older Unit 01 lesson exports, older scored assessment results, and older assessment drafts into the current trust-aware record shapes. Normalization does not authenticate the source or increase its authority.
- `lesson-record-builder.js` defines the reusable lesson learning-record shape for trust-aware exports.
- `compact-engine-reference.js` is the canonical PA-13.2 compact lesson-engine snapshot used by Units 02–13.

### Assessment record distinction

Submitted/scored Unit 01 mastery checks are `khaemenes.assessment.result-record` evidence. Unsubmitted work is `khaemenes.assessment.draft-record` and may never grant mastery. The public assessment wrapper preserves diagnostic domain evidence and learner reasoning while labeling the result as browser-local, self-scored, unscoped evidence requiring review before portfolio use.

The Unit 02–13 compact cumulative assessment cores now preserve durable attempt/mastery history and emit diagnostic skill/item metadata. Their wrapper/export normalization remains part of the PA-13.3 follow-on work so scored results and unfinished drafts receive the same explicit trust-aware record-type distinction already implemented for Unit 01.

### Authority rule

**Resources teach. Course engines verify. Browser exports report evidence. Explicit association identifies the intended learner locally. The integrated view provides continuity without silently merging records. A protected institutional records workflow is still required before an exported browser record can be treated as independently validated academic documentation.**
