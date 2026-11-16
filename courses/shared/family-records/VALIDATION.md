# High School Family Learning Archive — Phase 1 Validation
Date: 2026-11-16

## Scope
The read-only archive at `courses/shared/family-records/` exports only course-key values ending in the currently selected Academy learner's exact `:learner:<encoded learner ID>` suffix. The active learner is obtained from the Academy family registry on the same origin. An explicit user checkbox is required. The export has a SHA-256 checksum over the payload where Web Crypto is available.

No writes to progress, grades, assessment submissions, family registry, or learner bindings. No automatic migration, server upload, email, or STOS restore. There is no certified identity verification. Do not call these exports official transcripts.

## Current course entry integration
The shared `courses/shared/course-entry-contract.js` mounts a visible archive link on supported landing pages when that script is included.
- Mathematics: pre-algebra, algebra-1, geometry, algebra-2.
- Language Arts: english-10, english-11, english-12.
- Science: integrated-science-9, biology-10, chemistry-11, physics-engineering-12.
- Social Studies: grade-10, grade-11, grade-12.

The following require a dedicated preservation mapping before they can be called fully integrated:
- English 9: has no shared learner-scope script on its course landing.
- Science 9: has a separate course-specific backup guard; the archive must be tested against it.
- Social Studies 9: landing has no shared learner-scope script.
- Additional subject courses (PE, languages, electives, mathematics transition courses) are not audited or registered in this phase.

No live-browser or real-student export test has been completed.

## Synthetic test matrix to run before claiming production readiness
1. Learner A selected, scoped record A present: export includes only A records.
2. Learner B selected, A and B records present: export includes B only, never A.
3. No selected learner or invalid registry: export disabled.
4. Legacy unscoped keys: never exported or assigned to a learner; originals preserved.
5. Same-course multi-student object: excluded unless it unambiguously contains exactly one student.
6. Missing, blocked, or quota-limited storage: fail visibly and do not claim an archive exists.
7. File downloaded on Android tablet and desktop browser: actual JSON parses and checksum matches the included payload.
8. Test a page with the canonical chrome: no new fixed toolbar, no duplicate header, no interference with assessment controls.
9. Verify the downloader on the exact production origin holding the learner data; other origins have separate browser storage.
10. Verify no records are posted, transmitted, committed, or logged externally.

## Migration restrictions
Keep the old Opera tablet and its original profile/storage untouched. Do not assume an export exists until a file is verified. Do not change student mastery or historical results during rollout. T03 commissioning and authenticated family delivery are independent workstreams.
