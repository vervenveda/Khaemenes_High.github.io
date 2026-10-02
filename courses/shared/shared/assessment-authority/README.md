# Khaemenes High · Public-Safe Assessment Authority Contract

This directory carries only the **public-safe boundary contracts** needed by learner-facing High School courses.

## Authority

- Browser-delivered practice, diagnostics, weekly mastery checks, unit checks, midterms, and finals whose scoring material is delivered to the learner device are **public/self-check evidence**. They support learning but are not confidential or independently authoritative by themselves.
- A **supervised secure assessment** uses newly authored unpublished questions. Answer keys, scoring rubrics, private grader execution, student response custody, and private signing material remain behind the **Noema + NAIB/Administration backend boundary**.
- Archaemenes may guide preparation and reflection but does not reveal locked assessments, grade protected responses, sign credentials, or alter mastery.
- Course Engine retains course mastery/progression authority.

## Public files retained here

- `ASSESSMENT_CLASSIFICATION.md`
- response-package schema
- administrator-approved-record handoff schema
- signed-record verification schema
- canonical signed-record verification specification

## Deliberately excluded

No confidential question bank, answer key, private grader, production signer, encrypted signing vault, private repository path, live private key, or student response package is permitted in this repository.

## Standalone Assessment Authority repository

The useful **public protocol** is now locally represented here. The old standalone Assessment Authority repository should not be deleted solely on this basis until its confidential/private operational functions have been migrated into the protected Noema + Administration backend. After that migration is independently verified, the standalone repository can be archived as historical evidence rather than remain an operational dependency.
