# Grade 9 Supplemental Export Hardening — English & Science
**Date:** November 9, 2026  
**Scope:** English 9 independent notes/drafts + Integrated Science 9 cumulative and weekly Monte Carlo stores  
**Status:** Review-branch only. No production deployment, data backup, or T03 upload.

## Delivered
- `grades/grade-09/migration/supplementary-course-export-v1.js` — explicitly invoked, learner-scoped supplemental export of original localStorage key/value strings.
- `grades/grade-09/migration/supplementary-export-review.html` — unlinked manual preparation and downloadable JSON interface with active learner selection check and explicit confirmation.
- `grades/grade-09/tests/supplementary-course-export.test.cjs` — synthetic isolation, unknown and shared record exclusion, bounds, mutation detection, and raw-value integrity cases.
- `grades/grade-09/tests/supplementary-export-review.test.cjs` — source-level consent, network isolation, and release guardrails.

## Included key families
English 9:
- `khae-ela9-progress-v1:learner:<id>`
- `khae-ela9-field:<field>:learner:<id>`
- `khaemenes-reading-notebook-v1:english-9:<unit>:learner:<id>`
- `khaemenes-book-report-v1:english-9:report-<n>:learner:<id>`

Integrated Science 9:
- `khae-grade09-integrated-science-portal-v1:learner:<id>`
- Six named unit benchmark / midterm / final practice keys with learner suffix
- `khae-grade09-integrated-science-portal-v1:learner:<id>::weekly-mc[::unit11-space-v2]::<week>`

These key patterns are grounded in the current course producers. Values are stored as original strings in a manifest so import tooling can later preserve raw semantics.

## Deliberate exclusions
- English dashboard `ELA9_36_WEEK_PORTAL_V2` is a multi-learner store and requires separate authorized extraction; automatic attribution is prohibited.
- Unscoped and other-learner records, PE grade-wide keys, other site origins, portfolios stored elsewhere and drafts not yet saved are not exported.
- A `:learner:` suffix is not identity authentication. The course entry contract's browser-local active selection is checked before capture and again before download, but that is not proof of official ownership.
- No grade, score, mastery, course gating, or existing import logic changed by these additions.

## Integrity and safety
- Read-only enumeration for up to 10,000 keys; captures at most 3,000 known records and up to 20 MiB of UTF-8 key/value data.
- Re-read captured values and check storage count after capture; fail closed if storage changed mid-read. This is a best-effort race check, **not an atomic multi-key snapshot**.
- The export is **plaintext, sensitive student information**. It must remain private and should be encrypted using separately reviewed and approved backup controls immediately after being generated.
- The manual page is unlinked from production navigation and has a `connect-src 'none'` policy. No network upload functionality, no mutation APIs and no cloud integration.
- This is a **supplementary export**, not a complete Grade 9, family, or official academic backup.

## Verification and remaining blockers
- Synthetic module invocation and source-code syntax checks can be performed through connected review tools. The Node test runner, independent browser test, actual downloaded-file reopen, authenticated owner verification and restore on a separate device are not yet completed.
- Main-branch reconciliation is still required before publication. Never merge or deploy until all tests and privacy review pass.
- Further work: English 9 dashboard export ownership, Science Portfolio independent storage, PE conflict-preserving imports and unclaimed legacy data, plus language/elective origins.
- No real learner data was read, exported, or uploaded as part of this source change.
