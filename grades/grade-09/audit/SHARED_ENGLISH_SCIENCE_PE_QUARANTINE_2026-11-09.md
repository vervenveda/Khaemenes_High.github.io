# Grade 09 — Shared English, Science Portfolio, and PE Quarantine Hardening
**Assessment date:** 2026-11-09
**Disposition:** Review-branch only. No real learner record read; no import, no cloud upload or live deployment.

## Findings from source

### Bubble 1 — English 9 shared dashboard
`courses/language-arts/english-9/index.html` persists the entire class/browser dashboard in `ELA9_36_WEEK_PORTAL_V2`. Its students array can contain more than one learner. Automatically including the raw shared dashboard in a selected learner export would expose sibling records.

**Staged remediation:** `grades/grade-09/migration/legacy-shared-record-guard-v1.js` finds exactly one dashboard student whose `academyLearnerId` matches the selected learner ID. It projects only that student's record (never the raw container), preserving the source container key and marking the projection as unverified browser evidence. It fails closed on duplicate matches, malformed structure, oversized JSON, or changed raw data. Name-only matching is prohibited. The original shared dashboard remains on its device unchanged; complete preservation of the original multi-learner container requires a separate guardian-authorized family recovery procedure.

### Bubble 2 — Science 9 formative portfolio
`science-evidence-portfolio.js` uses `kh_sci9_formative_v1:<lowercased-learner-id>:units/unit-XX/<activity>.html`. It already has a separate learner-checked portfolio export/restore with missing-only semantics; this is *not* included in the Science 9 portal-state export.

**Staged remediation:** Extend the Grade 9 supplemental exporter with the exact recognized formative portfolio key shape for the selected normalized learner token. Preserve the original source key and raw value (including saved notes and observations) without altering grades, restoring records, or reading other learner values.

### Bubble 3 — PE 9 grade-wide owner ambiguity
PE uses shared `khae.pe.v1.grade9`, `khae-pe-g9-w*-days-v1` and `khae-pe-assessment-v1-*` keys without authenticated learner identity.

**Staged remediation:** Add a *key-name-only* quarantine audit that counts matching PE record families without reading record values, leaking assessment IDs, attributing records to the selected learner, or importing anything. There is deliberately **no automatic PE export/ownership claim** in this work.

### Bubble 4 — Combined export false completeness and oversized payloads
The supplemental page previously contained only exact-suffix source records; the new shared dashboard projection requires a combined size boundary.

**Staged remediation:** Integrate the selected English projection into the unlinked review UI and add a 20 MiB combined JSON size limit. The UI visibly reports excluded/ambiguous keys and PE quarantine counts, with `complete_grade09_backup=false`. Re-check selected learner before download.

### Bubble 5 — Browser-local IDs are not authenticated ownership
Both Family Portal active learner selection and Science portfolio session IDs are browser-local. They can guide which *candidate* keys to preserve but cannot prove legal or academic identity.

**Release gate:** Only an authenticated learner/family authority can resolve identity, approve a legacy/PE ownership claim, or import restored evidence into Account Cloud. Do not infer provenance from name or key suffix alone.

## Files staged
- `grades/grade-09/migration/legacy-shared-record-guard-v1.js`
- `grades/grade-09/migration/supplementary-course-export-v1.js` (extended science portfolio key coverage)
- `grades/grade-09/migration/supplementary-export-review.html` (unlinked manual review utility)
- `grades/grade-09/tests/legacy-shared-record-guard.test.cjs`
- `grades/grade-09/tests/supplementary-export-review.test.cjs` (additional checks)

## Verification status
- Source and test JavaScript compiled in isolated evaluation.
- Synthetic English shared dashboard projected one explicitly matched record and excluded sibling content.
- Synthetic PE quarantine counted key families without reading any value.
- Synthetic Science portfolio capture preserved exact raw evidence for a valid learner-token format while excluding another learner's records.
- Source-level checks only; full Node test runner, real browser, second-device restore, real learner identity/consent, privacy review and encrypted capture are **not** completed.

## Migration constraints
No real learner data has been exported. The manual review page emits **unencrypted JSON** and remains unlinked; it is not authorized for use with real student data pending end-to-end and security verification. Other-origin courses, unscoped legacy work, unknown assessment producers and unsaved drafts remain outside this export. The branch must be reconciled with current `main` before release; never deploy these safeguards as proof of live T03 persistence.
