# 2026-11-20 — Grade 09 Student Profile: Schedule and Student Portfolio forensic feature audit

**Type:** live-main GitHub source inspection · topology · student experience · learner isolation · no-write CI
**Scope:** current Grade 09 canonical profile, separate Schedule page, shared student Portfolio, grades 10–12 parity, Academy family/Account Cloud boundary.
**Evidence limitation:** no founder/learner browser, assessment attempts, localStorage, device or protected Account Cloud runtime accessed in this audit.

## Verified architecture
1. Grade09 toolbar in `grades/grade-09/student-profile/dashboard-layout.js` uses **Schedule → `schedule/`** and **Student Portfolio → `../../../portfolio/index.html?grade=09`**, both direct links, with canonical eight-tool order Schedule, Student Progress, Student Portfolio, KlasaiPeer / Edit Profile, Edit Background, Yearbook, Creative Tools.
2. `grades/grade-09/student-profile/schedule/index.html` is current independent Schedule owner, using `grades/shared/high-school-schedule-page.js`. The old `.grade09-priority-schedule` remains a hidden inert data mount. Do **not** revive the historical modal or duplicate its owner.
3. Schedule requires active grade-context, Academy Student Profile and course-entry contract learner IDs to match. It reads eight subject slots and learner-scoped continuation records; shows progress and quiz/test averages separately, missing evidence as “Not yet reported”; course pins write through canonical high-school pin/Grade09 registry helpers, not a cloud store. Current course continuation resolver controls Class/Options links.
4. `portfolio/index.html` is the single Portfolio workspace for Grades 9–12, with grade-aware dashboard return, add/edit evidence form, saved work, search/filter, JSON backup/import, homeschool progress report, print/export, independent parent/teacher review and Student Records Connection Check.
5. `portfolio/portfolio-academic-report.js` checks three active learner sources before reporting, refreshes on button and continuation events, suppresses stale grades, separates readiness from official grades/credit, and never issues a certified transcript. `portfolio/portfolio-student-record-connections.js` is a read-only evidence census and explicitly declares `cloudSynced:false`, `syncsCloud:false`.
6. `grades/shared/grade09-blueprint-upper-grade.js` links Grades 10–12 to the same grade-aware Schedule pages and Portfolio workspace. Existing independent CI scripts also protect the toolbar and synthetic Portfolio refresh.

## Five prioritized bubbles (all subject to verification; no undeclared repairs)
**P1 — Student-specific browser acceptance HOLD.** Source routes exist; actual Grade 9 device click-through, eight class rendering, back navigation, pin persistence, and Portfolio load on her laptop/Mac have NOT been executed here. Preserve exact existing learner and family Account IDs.

**P2 — Assessment visibility and provenance HOLD.** Earlier founder reported Algebra I readiness 36/36. Historical logs identify possible unscoped diagnostic output and a user-confirmed learner link action in Portfolio. Verify the original exact course-owner result/attempt, identity and timestamp before linking. Do not retake or silently attribute the diagnostic. Readiness must not automatically become an Algebra I official course score.

**P3 — Portfolio account-bound import gap (source-confirmed).** `portfolio/index.html` exports `{schema,entries}` and imports into the *active* learner after confirmation. The backup envelope contains **no independently verifiable learner/family ID binding or immutable origin receipt**. It is therefore insufficient for protected cross-device account restore; do not automatically merge a downloaded portfolio with a cloud learner account. Review privacy-safe authenticated receipt/evidence schema before migration.

**P4 — Schedule/Portfolio source-of-truth split (source-confirmed).** Schedule shows learner-scoped pins and continuation evidence; Portfolio shows student-authored evidence and reported course results; neither is canonical family/guardian authentication. The Account Cloud is not commissioned, and a valid local family record is not proof of a protected session. No Cloud synchronization or durable recovery can be certified.

**P5 — Owner and stale identity regression risk (review required).** Historical November 20 Schedule modal repair describes a superseded popup, but current main routes to a dedicated page. Prevent duplicate modal/legacy schedule ownership from returning. Portfolio workspace loads browser-local entries for the selected learner at page initialization; tests should check that switching the learner while the tab remains open cannot expose an older learner's cached entries or allow incorrect import, and that the schedule's old snapshot selection does not hide newer course evidence. Do not change the live profile until isolated behavioral verification.

## This pass's regression guard
- `tests/grade09-schedule-portfolio-feature-audit.test.mjs`: ten source-only checks of canonical toolbar, Schedule page, identity gating, separate metrics, pin owner, four-grade workspace links, Portfolio actions, learner-scoped report, assessment/credit boundaries and Account Cloud disabled state.
- `.github/workflows/grade09-schedule-portfolio-audit.yml`: runs the ten checks, no sensitive data, source-only checkout.
- No core page, JS owner, CSS, course grade, pin, Account ID or STOS runtime changed by this audit.

## Recommended execution order
1. CI and page-route source tests PASS; note exact commit, not broad workflow status.
2. Original learner browser: verify correct Grade09 profile, Schedule class list and course choices **without changing pins during discovery**.
3. Portfolio: press **Refresh Academic Evidence**, check source-state feedback, locate original Algebra I readiness under learner-attributed or explicitly unscoped evidence, do not override or retake.
4. Only after learner validation, perform two-device privacy-safe record equivalence and backup acceptance tests.
5. Commission independent authenticated Academy Account Cloud/T03 before any remote write, idempotent receipt, or claim of “synced.”

**Status:** source audit complete; browser QA and Account Cloud record transfer HOLD.
