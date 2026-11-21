# 2026-11-20 — Existing Grade 09 learner ↔ family ↔ courses ↔ Account Cloud reconciliation

**Type:** forensic evidence preservation · source-only reconciliation · regression guard
**Status:** SOURCE MODEL COMMITTED; REAL STUDENT ATTRIBUTION AND CLOUD SYNC HOLD.
**Identity boundary:** Never write the learner's actual Account ID, Family ID, Student ID, personal data, assessment responses, or identifying values to public GitHub.

## Founder-observed account/assessment
- Parent reports existing family and student Account ID(s), first created on learner laptop and later found on separate Mac through Chrome Developer Tools. The original private Account Cloud log `2026-11-20-academy-high-family-registry-parity.md` recorded `accountIdPresent=true` on Academy Home and High School and one family/one learner. It did NOT compare actual ID bytes or prove server persistence.
- Parent confirms this learner is in **Grade 09** and passed a mathematics placement/readiness assessment.
- Earlier High School `2026-11-20-grade09-algebra1-readiness-confirmed-link-refresh-v2.md` records family-reported **Algebra I readiness 36/36, November 19, 2026**, but original attempt, date and learner-scope identity were **not independently verified**.
- An earlier expected-nickname exact match returned `false`. Do not equate this with no enrollment; **do not silently attach an unscoped attempt to the selected learner**.

## Source topology
- Existing Academy family registry `vervenveda/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js` contains local family/learner links; **local IDs are not protected service credentials**.
- High School `courses/shared/high-school-eight-class.js` describes eight-subject schedule; Grade 9 `grades/grade-09/student-profile/eight-class-schedule.js` and `student-course-registry.js` handle learner-scoped pins/continuation, without conferring academic mastery.
- `portfolio/portfolio-student-record-connections.js` inspects selected learner evidence locally and explicitly sets `cloudSynced:false`.
- English 9 and Science 9 readiness can be published through `courses/shared/grade09-english-science-readiness-publisher.js`; originals remain course-owned and readiness is not an official course grade.
- Algebra I readiness previously included a **user-confirmed, idempotent link action** for valid unscoped diagnostic evidence to the selected registered learner, retaining the original; no automatic link or live browser acceptance is proven.
- The Account Cloud private `ACCOUNT_CLOUD_PROTOCOL_V2.md` requires verified independent guardian/learner identity, exact versioned evidence, native T03 durable receipts, recordVersion/baseVersion and server authorization before student records can be stored.

## No-write reconciliation stage implemented
- `grades/grade-09/student-profile/account-cloud/grade09-family-course-reconciliation.mjs` provides a strict source-only Grade 9 eight-subject **review map**. Mathematics placement, language and electives remain individually selected and are not invented.
- The guard rejects unverified learner identity, parent-family access, Grade 9 placement, assessment provenance, learner mismatch, and absent commissioned service/session/durable readback. It never takes raw account IDs, raw records, scores, or credentials.
- Even hypothetical validated witness flags produce `INDEPENDENT_REVIEW_REQUIRED`, **never authorized storage, enrollment, grading, sync or deletion**.
- Eleven synthetic Node test cases and source-only GitHub Action guard; CI outcome recorded after execution.

## Required verified operations before actual cloud sync
1. Locally inspect originating-device Grade 9 registered learner identity and exact existing Account ID/Family ID. Do not disclose the ID in chat or public GitHub.
2. Confirm whether the passed test was Algebra I readiness, other math placement, or another readiness assessment; read authoritative scored attempt, its learner attribution, timestamp and source. Preserve unscoped diagnostic untouched until independently verified learner confirmation.
3. Select/confirm mathematics placement, world language, life skills and elective; pin the eight Grade 9 courses via the **existing** per-learner schedule controls only after learner identity is confirmed.
4. Require protected, independently authenticated parent-learner binding and an Account Cloud service with issued, authorized session; verify T03 off-controller commit/readback, record version, conflict detection, audit, recovery, and same-ID access on clean second device.
5. Import only explicitly approved learner-scoped records with exact source provenance, no duplicate account, and receipts; assessment engines retain grades/mastery.

**Outcome:** protected account cloud cannot yet be truthfully marked synced; the parent/student existing accounts and the reported passing assessment have not been modified, reissued, linked, exported or uploaded by this work. No 333 Network/cloud operations.
