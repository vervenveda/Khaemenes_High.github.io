# Grade 9 frontend preservation hardening — key discovery

Date: 2026-11-09
Branch: `audit/grade09-account-cloud-preservation-2026-11-09`
Status: source-only staged; no runtime activation; no Account Cloud upload.

## Implemented
Added `grades/grade-09/migration/storage-key-discovery-v1.js`, an explicitly invoked **read-only key-name scanner**. It takes an injected Storage-like source, the previously published versioned Grade 9 migration inventory, and an explicit HTTPS origin. It does not access global browser storage by itself and does not read, write, delete, download, or transmit any stored value.

Every known matching key is tagged with its course group and an ownership **classification, not proof**. Scoped `:learner:` suffixes yield `scoped-owner-unverified`, not `verified`. Grade-wide PE keys are always `ambiguous-unclaimed`. Unmatched keys are counted but omitted from results. This stage produces no learner records, hashes, account assertions, migration payloads or backups.

## Verified by isolated JS invocation
- Helper source and authored test source compiled.
- Synthetic keys `khae.pe.v1.grade9`, `khae-pe-g9-w02-days-v1`, `psych101_grade9_journal_v1:learner:synthetic-A`, `khae-ela9-progress-v1:learner:synthetic-B` matched the intended groups.
- PE: ambiguous owner; Psychology and English: scoped owner unverified.
- An unknown synthetic key was counted but excluded.
- The injected storage's `getItem` and `setItem` were not invoked.
- `cloud_uploaded` and `migration_ready` remain `false`.

## Test coverage staged
`grades/grade-09/tests/storage-key-discovery.test.cjs` includes six synthetic checks for fail-closed initialization, PE legacy ownership, learner suffix classification, unknown-key confidentiality, no stored-value reads/transfers, and bounded scanning. **Node test runner not executed yet**.

## Constraints and next gates
1. This is not a backup: record values and integrity hashes have not been captured. Do not retire source data.
2. A single origin cannot read another origin's localStorage. Run future consented backups separately at each correct origin.
3. Matching `keys` in the initial manifest is incomplete for science sessions, English artifacts, Grade 9 profile customization, and external electives. Continue mapping producer scripts before claiming exhaustive discovery.
4. No automatic assignment of Grade 9 PE or other legacy records to a learner. Require verified ownership and explicit consent.
5. Actual record capture, encrypted export, restore verification, protected authentication and T03 transaction receipts remain separate engineering stages.
6. Do not add the helper to live Student Profile pages until privacy review, compatibility checks and production approval.

No grade, score, learner profile, student file or terminal state was modified by these changes.
