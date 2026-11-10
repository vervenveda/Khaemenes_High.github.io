# Grade 09 — English, Science, and PE Export Coverage Forensic Audit
**Date:** 2026-11-09
**Status:** review-branch preparation; no student-data export, no T03 upload, no live release.

## Confirmed source coverage and gaps

### English 9
- The portal's `downloadBackup()` exports the main dashboard's `state.students`, `activeId`, and `collectStandaloneEvidence()`.
- `collectStandaloneEvidence()` includes `khae-ela9-progress-v1`, scoped variants, and `khae-ela9-field:*`. It is not restricted to just the current learner's scoped keys on a shared browser.
- `assets/course.js` separately stores reading notebook entries in `khaemenes-reading-notebook-v1:*` and book reports in `khaemenes-book-report-v1:english-9:*`. These are **not** captured by the portal's generic backup.
- Both notebook and book-report surfaces have their own export options; a learner must use those separately to capture complete work. Independent readiness evidence also needs inventory.
- **Migration blocker:** a successful portal-backup download does not certify that all English 9 writing and reports were saved. Avoid auto-binding shared-device records to the active learner.

### Integrated Science 9
- `downloadBackup()` serializes `{version:1,exported,state}`; its primary portal state includes local lesson work and scores.
- Six cumulative benchmark/practice keys are read separately in `assessmentRecords()` and are **not serialized** by `downloadBackup()`.
- Weekly Monte Carlo sessions use generated storage keys and preserve active responses and prior attempts; these are outside the portal-state export unless independently captured.
- The separate Science Evidence Portfolio also needs its own origin/key/storage review.
- **Migration blocker:** include cumulative assessment and weekly session raw originals before labeling the Science export complete.

### Physical Education 9
- `exportData()` includes `khae.pe.v1.grade9` journal state, 36 weeks of daily records, and referenced assessment snapshots from the shared assessment engine.
- The grade-wide journal and daily record keys do **not** prove student ownership. An assessment snapshot might be omitted when its ID is not listed in a week record.
- Existing import behavior previously removed all per-week daily records missing from the incoming archive. This was a destructive loss path.
- **Repair staged:** import now preserves existing daily records whenever the incoming archive omits the week; present weeks still use existing semantics. Further importer conflict hardening is necessary before use with real student records.
- **Migration blocker:** explicit learner ownership verification and a restore test are required.

## Tests and repository changes

- `grades/grade-09/audit/course-export-coverage-v1.json`: machine-readable contract covering three course systems and release gates.
- `grades/grade-09/tests/course-export-coverage.test.cjs`: five source-level regression tests.
- `courses/physical-education/index.html`: one targeted, non-destructive missing-week import guard.

Source-level checks verified the new guard, manifest schema, and test syntax. **Node test execution, full browser workflows, and actual import/restore tests have not been run.**

## Safe next steps

1. Build or extend **opt-in, selected-learner-only supplemental exports** for English's notebooks/reports and Science's cumulative and weekly sessions, preserving original raw keys and exact values. Do not mix family or sibling records.
2. Add an explicit pre-import recovery snapshot and conflict-safe restore for PE; do not assume grade-wide keys belong to the active student.
3. Inventory Science Evidence Portfolio and any additional foreign-language/elective origins.
4. Reconcile this development branch against the updated `main` (three commits behind at audit time); resolve conflicts and run Node/browser tests before merging.
5. Verify downloads and second-device byte-identical restoration on synthetic data before real learner exports.

No real student records, live course gates, academic grades or T03 records were modified by this source audit.
