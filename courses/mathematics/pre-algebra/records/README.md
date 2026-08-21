# Pre-Algebra Family Records Office

The Academy Family Learning Center is the parent-facing records doorway. This course-level Records Office connects to the canonical Family Registry and creates Pre-Algebra progress summaries, detailed mastery records, portfolio evidence packets, contemporaneous activity and reading logs, full administrative packets, and a parent-issued course completion certificate. Data stays in the browser unless exported. Print or save records for signatures and retain them with the learner's secure educational portfolio.

## Record trust boundary

Generated reports organize editable browser-local evidence. This system does not claim government issuance or accreditation, independent authentication, or universal district acceptance. Reports do not replace jurisdiction-specific evaluation, portfolio, attendance, transcript, or termination requirements. Parents and administrators should confirm current local requirements before submission.

Pre-Algebra currently has two legitimate browser-local evidence streams:

1. **36-week portal progress** — stored under `KHAE_OPEN_PREALGEBRA_FORGE_V2`. This data is organized inside learner profiles used by the course portal and Records Office.
2. **Unit 01–13 lesson mastery evidence** — stored under `khaemenes-prealgebra-unitNN-progress-v1`. These unit keys currently do **not** contain a learner identifier and are therefore classified as **unscoped browser unit evidence**.

The Records Office must not silently attach unscoped unit evidence to whichever learner profile happens to be selected. Unit evidence may be reviewed, exported, or explicitly associated through a future adoption/validation workflow, but automatic learner attribution is prohibited until a trustworthy identity binding exists.

## Contracts and tools

- `record-contract-v1.json` defines the course-level trust classes and export boundaries.
- `unit-evidence-bridge.js` safely reads Unit 01–13 browser evidence and exposes it as unscoped evidence without changing mastery or learner records.
- `unit-evidence-review.html` provides a centered, printable, read-only review and JSON export of the Unit 01–13 evidence currently stored in the browser. It does not assign that evidence to a learner.
- `lesson-record-builder.js` defines the normalized `khaemenes.lesson.learning-record` object used by the hardened lesson export contract.
- `legacy-record-normalizer.js` converts older Unit 01 flat lesson exports and legacy Unit 01 assessment/draft exports into the PA-13.2 record shapes without increasing their authority.
- `compact-engine-reference.js` is the canonical PA-13.2 compact lesson-engine snapshot used by Units 02–13.
- `PA-13.2-EXPORT-SCHEMA.md` documents the normalized lesson record fields and mastery states.

## Unit 01 assessment exports

The Unit 01 assessment wrapper now distinguishes two export types:

- `khaemenes.assessment.result-record` — a submitted, self-scored browser-local assessment result. It may carry score, percent, mastery state, domain performance, answers, and learner reasoning, but remains unscoped and independently unverified.
- `khaemenes.assessment.draft-record` — an unfinished draft containing current answers/reasoning. It is explicitly non-mastery evidence and can never grant progression.

Older assessment exports can be normalized through `legacy-record-normalizer.js`. Normalization changes structure and labeling only; it does not authenticate the source or increase record authority.

### Authority rule

**Resources teach. Course engines verify. Browser exports report evidence. A protected institutional records workflow is required before an exported browser record can be treated as independently validated academic documentation.**
