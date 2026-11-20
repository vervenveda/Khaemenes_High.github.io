# Grade 09 Student Profile → Account Cloud directory (2026-11-20)
Status: SOURCE MAP COMMITTED / LIVE SYNC NOT PERFORMED

## Forensic findings
Canonical `grades/grade-09/student-profile/index.html` references `dashboard-layout.js` which creates the 2×4 `khaeProfileToolRail`. Verified exact order: Schedule, Student Progress, Student Portfolio, KlasaiPeer / Edit Profile, Edit Background, Yearbook, Creative Tools.

Each button is a UI entry point, not necessarily the owner of records. `class-progress-dialog.js` rehomes existing academic checkpoint/progress DOM and has no independent transcript authority. `student-profile-details.js` and `student-profile-preferences.js` use learner-scoped profile context; some preferences are browser local. `Yearbook` and `KlasaiPeer` cross to separate features and require consent/auth review. The existing family registry was owner-reported as one family / one learner, but learner identity (Ahja) remains independently unconfirmed.

## Additive implementation
- `grades/grade-09/student-profile/account-cloud/grade09-directory-preview.mjs`: pure eight-section metadata-only directory mapping. No browser reads, uploads, writes, deletes, passwords or learner IDs. Always mode `SOURCE_ONLY_NOT_SYNCED`.
- `grades/grade-09/student-profile/tests/grade09-directory-preview.test.mjs`: 18 synthetic assertions covering toolbar count and order, source ownership, consent, field injection, accidental live-mode promotion and no writes.
- `grades/grade-09/student-profile/account-cloud/README.md`: scope and activation gates.
- Account Cloud private repository corresponding contract: `contracts/GRADE09_STUDENT_PROFILE_DIRECTORY_BRIDGE_V1.md`.

## Verification
Fetched source and inspected control flow of actual Grade 09 owner scripts prior to writing preview. Source commit completed. **18-case Node test suite is committed but not yet independently executed** (this tool session cannot download public source into Node runtime). No production browser smoke test executed. Do not claim 18/18 PASS. No authenticated native Account Cloud endpoint established. No source existing Grade09 profile file edited, no active script reference added, no private family/learner records accessed, and no STOS terminal modified.

## Next action
Run the exact checked-out test file under a separate external Node test runner, then implement an explicitly authorized read-only *metadata census* from the active Grade 09 profile, with no raw student values in logs. Finally test protected synthetic Account Cloud upstream handshake and durable receipt before ever enabling live sync.
