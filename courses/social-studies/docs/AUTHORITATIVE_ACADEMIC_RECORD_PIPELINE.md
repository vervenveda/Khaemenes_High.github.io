# Social Studies Authoritative Academic Record Pipeline

## Authority rule

The course-owned learner record remains the only runtime authority for:
- lesson completion,
- assignment submission and evaluator scores,
- weekly objective mastery,
- constructed-response review,
- midterm/final or major-assessment scores,
- capstone/graduation gates,
- final credit issuance.

The shared `social-studies-academic-record-v1.js` bridge is **read-only and derived**. It does not create a second gradebook, write a new storage key, unlock curriculum, score written work, or issue credit.

## Academic Record export

Each active Social Studies course report now offers **Export Academic Record**.

Schema: `khaemenes-social-studies-academic-record-v1`

The export is intended for Student Portfolio/transcript evidence ingestion and contains:
- learner/course identification,
- completed lessons,
- assignment submission and evaluator-review status,
- assignment scores when the authoritative course record contains them,
- weekly best objective score, mastery state and attempt count,
- sanitized Monte Carlo attempt receipts and review-skill labels,
- constructed-response completion/evaluator-review state,
- major assessment scores/status,
- course mastery and final-credit status where the course owns those gates.

The export intentionally omits:
- assessment prompt text,
- answer choices,
- answer keys,
- learner answer selections,
- raw learner assignment prose.

## Evidence boundary

The Common Evidence Ledger remains a source-analysis worksheet. It does not certify mastery or become part of the formal grade unless an evaluator explicitly incorporates its evidence into the course-owned record.

Activity completion remains evidence, not a teacher grade. Teacher-scored writing and final-credit issuance remain evaluator-authoritative.
