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

### Authority rule

**Resources teach. Course engines verify. Browser exports report evidence. A protected institutional records workflow is required before an exported browser record can be treated as independently validated academic documentation.**
