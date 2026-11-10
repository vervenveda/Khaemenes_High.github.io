# Grade 09 — Account Cloud preservation and migration readiness

Date: November 9, 2026  
Source: `vervenveda/Khaemenes_High.github.io`, Grade 09 landing, student profile and named course producers  
Status: **Inventory staged; no records migrated; account cloud not commissioned or verified.**

## Purpose
Prepare all identified Grade 9 learning work for non-destructive migration to the Academy Account Cloud through STOS T03, avoiding the loss of learner achievements, drafts, assessment histories, journals and learning identity. This is **a source-code contract**, not a backup of a student's browser data. No live browser records or user devices were read.

## Course-by-course findings

| Group | Source behavior | Preservation consideration |
| --- | --- | --- |
| Student Profile | Separate profile, daily note, pins, class launches and mathematics pathway keys | Capture profile and tools as well as grade summaries; some legacy keys are unscoped |
| Pre-Algebra | Device-local state, legacy keys and the shared learner-scoping/claiming adapter | Existing unclaimed data must not be assigned automatically |
| Algebra I | Multiple independent diagnostic, unit, weekly and cumulative assessment records | Capture full attempts, constructed responses and local evidence trust status, not only best score |
| English 9 | Learner-scoped progress and field writing plus independent reading notebooks and book reports | Individual text drafts/annotations are first-class migration records |
| Integrated Science 9 | Course portal state, unit and weekly Monte Carlo/session records, final practice | Identify all underlying MC session and answer keys before declaring complete |
| Social Studies 9 | Custom learner-scoped guarded record API and an export schema | Do not bypass the source's ownership and concurrent-tab protection |
| Psychology 101 | Six distinct key families: progress, assessments, notebook, journal, word bank, preferences | Include weekly/cumulative attempts and creative writing; verify standalone/unscoped mode |
| PE 9 | Shared grade-based state key, daily week records, assessment attempt snapshots | **Highest ownership risk:** keys do not reliably encode learner identity; quarantine until confirmed |
| Foreign Language | Grade 9 link into a separate Linguistics campus | Language-specific assessment/data producers **not yet inventoried**, despite route being present |
| Health/Arts/Music/Computing | Grade landing offers multiple elective entries | Producer files outside named High School paths **not yet inventoried** |

The machine-readable record inventory is `grades/grade-09/audit/account-cloud-migration-inventory-v1.json`. It includes source files and keys, record classes, risks, ownership statuses and cutover conditions.

## Non-negotiable migration workflow

1. **Discovery:** inventory exact storage keys on each student device and site origin, including legacy unscoped keys, course-specific JSON, raw text, submissions, and evidence attachments. Do not send any records to GitHub.
2. **First copy:** capture original raw bytes, original key, source origin/path, capture date, content hash, format version and proven learner ownership. Preserve an offline encrypted backup and verify it can be read before further activity.
3. **Ownership:** bind only records whose learner/family association is verified. Put unclaimed and shared-device keys into an isolated reconciliation queue; never guess from grade, nickname, active browser tab, or the current learner alone.
4. **Staging:** when T03 authority is actually commissioned, authenticate the account and upload encrypted record envelopes through an approved sealed storage boundary. Require idempotency IDs, proof of storage, and replay detection.
5. **Restore verification:** rehydrate a synthetic or consented test account on another device; compare the full key count, raw hashes, attempt histories, drafts, course achievements, and per-learner boundaries. Conflicts must preserve **both** versions.
6. **Cutover:** only after owner signoff and successful cross-device restoration may course progress views rely on cloud copies. Preserve original browser records until retention policy and verified backups authorize a later change.

## Three major gaps to resolve before activating persistence

- **PE Grade 9 ownership:** `khae.pe.v1.grade9` and `khae-pe-g9-w*-days-v1` are grade-wide. Never attach one family's shared-browser contents to the currently signed-in learner by inference.
- **Science and English rich artifacts:** verify complete Monte Carlo response/session keys, writing and reading drafts, book reports, attachments and exports. The initial manifest names known families but does not assert exhaustive discovery.
- **External electives and foreign language:** audit records in the Linguistics, Life Skills and other course repositories as separate source origins. Browser localStorage is **origin-specific**, so a scanner inside the High School pages cannot automatically read records saved on a different hostname/origin.

## Validation and current limits

- The ten-group manifest was created without student data. Critical source files and key patterns were confirmed during source inspection.
- `grades/grade-09/tests/account-cloud-inventory.test.cjs` defines six regression tests for manifest completeness, source availability, trust boundaries and ownership. **The Node test runner and live browsers have not been executed.**
- No T03 commissioning, cloud writes, backups, student data extraction, grade changes, or deployed release occurred.
- Therefore **data-loss prevention is not yet guaranteed**. Safe migration depends on collecting and verifying actual source-device records before any cutover.

## Next staged audit

Complete each Grade 9 course's writable key list and assessment attachments; audit English and Science nested modules, all grade-specific PE daily keys, and foreign-language/elective repositories. Then build an **opt-in, local-only export and backup validation tool** on a separate review branch, with per-learner authorization and no automatic network transfer.
