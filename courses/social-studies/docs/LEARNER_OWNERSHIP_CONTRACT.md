# Social Studies Learner Ownership Contract

## Scope

This contract applies to the active Social Studies learner records for:

- Grade 10 United States History Honors
- Grade 11 Government, Law & Economics Honors
- Grade 11 Personal Financial Literacy & Money Management Honors
- Grade 12 Global Politics, International Relations & Senior Research Honors

Grade 9 already uses its dedicated `grade09-records.js` Academy learner contract.

## Ownership rule

A locally selected course student ID is not sufficient authority for academic credit.

The course record is bound to the Academy learner selected at page entry:

```
<legacy course storage key>:academy:<encoded Academy learner id>
```

Every persisted scoped record includes `academyLearnerId`.

If the active Academy learner changes while the course page remains open, the page refuses further authoritative reads/writes until reload.

## Concurrent-tab protection

Each course records the exact storage snapshot read at load. Before every save it confirms that the stored bytes are unchanged. If another tab has modified the record, the save is rejected rather than overwriting newer work.

Every successful save is read back and verified.

## Legacy records

Historical unscoped course keys are preserved byte-for-byte and are **not automatically assigned** to the active Academy learner.

If an unscoped legacy record exists, the course may display a notice that unassigned legacy bytes exist. It must not reveal, migrate, overwrite, or adopt those bytes automatically.

Recovery occurs only through an explicit backup/import action for the correct learner.

## Backup identity

New backups include `academyLearnerId`.

A backup that explicitly identifies a different Academy learner is rejected.

Older ownerless backups remain recoverable through explicit user-selected import because they predate the ownership field; selecting the file is the deliberate recovery action.

## Assessment and portfolio storage

Randomized assessment storage derives from the learner-scoped course key, so assessment sessions inherit Academy learner ownership.

The Social Studies Academic Record remains a read-only derived export and does not become a second gradebook.
