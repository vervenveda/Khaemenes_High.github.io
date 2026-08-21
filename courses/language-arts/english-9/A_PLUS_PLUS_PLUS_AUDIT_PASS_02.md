# English 9 · Khaemenes A+++ Audit Pass 02

**Scope:** legacy portal reconciliation, mastery authority, learner attribution, backup and recovery

**Disposition:** reconciliation contract implemented; named-learner reporting remains blocked pending verified identity binding

## Forensic finding

English 9 contained two independent local records:

1. The legacy 36-week portal stored named students, daily activity checkmarks, practice quizzes, notes, repeat logs, and practice exams.
2. The coursebook mastery engine stored validated lesson evidence and enforced the 80% progression threshold.

The legacy portal calculated an apparent course grade from activity completion and practice scores. That value could be mistaken for academic mastery even though it excluded human-scored work and did not use the canonical coursebook record.

The coursebook record is currently browser-local and does not contain a verified learner identifier. Automatically attaching it to whichever named student is selected in the legacy portal would create a records-trust failure in a multi-student browser.

## Repairs applied

- Added a read-only evidence reconciler with a versioned public contract.
- Preserved legacy activity without allowing it to award mastery, unlock progression, or overwrite coursebook evidence.
- Replaced “course grade,” “completion,” and “done” claims with accurate practice, historical-activity, and review language.
- Added a separate canonical unit-mastery table based on best lesson scores.
- Marked browser-local mastery attribution as unverified and prohibited automatic attachment to the selected portal student.
- Added a versioned local backup containing separate legacy and canonical records.
- Preserved support for older legacy-only backups.
- Required explicit confirmation before restoring canonical evidence from a new backup.
- Added regression tests proving that perfect legacy activity cannot create mastery and that a lower retake cannot erase a higher canonical best score.

## Authority contract

| Record | Permitted use | Prohibited use |
|---|---|---|
| Coursebook lesson evidence | Determine unit mastery at the published threshold | Attribute to a named student without verified identity |
| Legacy activity checkmarks | Document review and participation history | Award mastery, grades, or progression |
| Legacy practice quizzes and exams | Guide review and preserve attempts | Become an official course grade by themselves |
| Eiren guidance | Offer transparent Language Arts support | Grade, promote, place, or alter records |

## Remaining blocker

Canonical family and administrative reporting must wait for a verified, permission-aware learner identity provider. Until that boundary exists, the browser mastery record must remain visibly separate from named legacy student records.

No private topology, repository locations, internal hierarchy, or service-routing details are exposed by the implementation.
