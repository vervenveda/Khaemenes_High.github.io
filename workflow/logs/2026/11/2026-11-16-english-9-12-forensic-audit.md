# 2026-11-16 · English 9–12 Forensic Source Audit

- **Date/timezone:** 2026-11-16 · America/New_York
- **Repository:** `vervenveda/Khaemenes_High.github.io`
- **Scope:** English 9, English 10, English 11, English 12
- **Types:** audit, test-review, upgrade-planning, decision, follow-up
- **Status:** Source review complete; production validation HOLD
- **Source:** GitHub source inspection and summarized discussion; not a verbatim transcript
- **Recent release reference:** [a0a143b](https://github.com/vervenveda/Khaemenes_High.github.io/commit/a0a143b9289d37e6de10775a548182bcd9d3bfd4)

## Decisions
Keep English 9's distinct architecture; retain a coherent learning experience for all four grades. Protect the 80% mastery requirement, learner isolation, assessment attempt history, and educator approval boundaries. Do not equate local developmental writing evidence with an official grade.

## Source observations

| ID | Files | Observation | Status |
| --- | --- | --- | --- |
| ELA-01 | `english-{9,10,11,12}/assets/curriculum-data.js` | Each grade has 12 units, 36 weeks and 36 canonical reading assignments | Verified by source inspection |
| ELA-02 | English 9 curriculum | Reading data is stored in `weekPlans[].readingSuggestion` | Verified |
| ELA-03 | English 10–12 curricula | Reading data is stored in `readingAssignments[]` | Verified |
| ELA-04 | `courses/shared/english-evidence-studio-v1.js` | Shared engine supports grade-specific writing tasks and both reading data contracts | Verified source |
| ELA-05 | `english-{9,10,11,12}/evidence-studio.html` | Four studio entry pages are committed | Verified source |
| ELA-06 | `english-{9,10,11,12}/records/progress-report.html` | Grade 9 reading statistics differ from Grades 10–12 | Verified source |
| ELA-07 | `.github/workflows/english-reading-sync-validation.yml` | CI workflow definition exists; success of its latest job was not checked in this audit | Unverified runtime |

All course paths above are relative to `courses/language-arts/` unless otherwise indicated.

## Priority issues / upgrade candidates

1. **High:** Validate published Evidence Studio in real browsers, with test learners, phone/tablet rotation, export, printing and isolation checks.
2. **Medium:** Standardize the core Reading Development indicators across all four courses while preserving grade-specific architecture.
3. **Medium:** Provide educator-reviewed handoff of student writing artifacts to the official portfolio; no automatic mastery or grade.
4. **Medium:** Stress-test per-input saving, storage failure, cross-tab changes and cross-device continuity.
5. **Medium:** Enforce regression checks for both Grade 9 and upper-grade curriculum schemas.
6. **Medium:** Verify scaffolding, exemplars, targeted feedback and spaced retrieval in all 144 weekly plans.
7. **Low:** Check actual rendered headers, text contrast, typography, button placement and responsive layouts.

## Test register

| Test | Environment | Result | Evidence |
| --- | --- | --- | --- |
| Examine curriculum datasets and count units, weeks and reading assignments | GitHub file content inspection | PASS — structural checks | Four `assets/curriculum-data.js` files |
| Check studio scripts and release notes exist | GitHub file content inspection | PASS — source presence only | Shared studio engine and release document |
| Execute Node regression suite | Not executed | NOT RUN | `courses/language-arts/tests/english-9-12-evidence-studio-regression.mjs` |
| Published GitHub Pages/CI result validation | Not performed | HOLD | Requires actual CI and browser results |
| Learner A/B isolation, saved drafts, downloadable ZIP/JSON, printing | Not performed | HOLD | Requires browser acceptance evidence |

## Repairs, upgrades and Codex updates

No curriculum or application code was modified as part of this source audit. Workflow documentation was created separately at the repository root. No Codex runtime update is claimed.

## Carryover
- [ ] Run Evidence Studio regression suite and obtain actual output.
- [ ] Verify GitHub Actions and published route behavior.
- [ ] Test synthetic learners, device rotation and file exports in browsers.
- [ ] Align baseline reading metrics across English 9–12.
- [ ] Define human-reviewed portfolio acceptance and progress attribution.
- [ ] Confirm whether the Academy intends 36 or 42 instructional weeks.

## Safeguards and closure
Do not log personal learner records, passwords, tokens, private files or unredacted student exports. Source inspection is not evidence of deployment or complete browser functionality.

## Addendum · Priority 1 cross-tab conflict repair (2026-11-16)

**Confirmed source defect:** The existing `storage` event handler disabled text fields when the active learner or current week record changed in another tab, but the Save control was still callable and `save()` had no persistent conflict guard. A stale tab could therefore overwrite the current learner/week record despite the warning.

**Committed repair:** [361f82e](https://github.com/vervenveda/Khaemenes_High.github.io/commit/361f82e5ef1976ca87dfed639c392dcc0f3ee4e5) updates `courses/shared/english-evidence-studio-v1.js` to set a persistent `conflictLocked` flag, refuse subsequent saves/exports, and disable Save/Export controls on a conflicting storage event.

**Committed regressions:** [4928269](https://github.com/vervenveda/Khaemenes_High.github.io/commit/4928269470204de782d61d191291330b6765e20e) extends `courses/language-arts/tests/english-9-12-evidence-studio-regression.mjs` with a cross-tab stale-write prevention scenario for Grades 9–12 and a learner-switch save-lock check.

**Verification status:** Source edits and GitHub commits confirmed. `node --test courses/language-arts/tests/english-9-12-evidence-studio-regression.mjs` is **NOT RUN** in this session; GitHub Actions conclusion and real-browser cross-tab behavior are **UNVERIFIED**. No official grades or assessment/mastery records were edited.

## Addendum · Priority 1 recovery from failed local saves (2026-11-16)

**Confirmed source defect:** Before this repair, `exportPacket()` and the Print Studio handler immediately returned if `save()` failed. Browser storage quota failures therefore blocked the student's recovery-copy actions while a potentially substantial draft remained visible.

**Source repair committed:** [709e5fd](https://github.com/vervenveda/Khaemenes_High.github.io/commit/709e5fd9801e4aa5b49b8ffe8392ee5e46eb232e) allows authenticated, learner-scoped export and printing from the current in-memory draft when a local save fails. Export metadata explicitly marks `persistedOnDevice: false`, and the warning instructs the learner to verify the downloaded backup. Cross-tab conflict and invalid-learner blocks remain enforced.

**Regression additions committed:** [1ddbd07](https://github.com/vervenveda/Khaemenes_High.github.io/commit/1ddbd074e2b61e814e6c8a5f011074d6b525edd4) adds 3 scenarios: quota failure recovery for all four grades, stale-record export/print denial, and anonymous export/print denial. The suite now includes these scenarios but its result is not certified.

**Evidence status:** Commits confirmed via GitHub connector. Local repository download failed due unavailable DNS/network access, so `node --test courses/language-arts/tests/english-9-12-evidence-studio-regression.mjs` **NOT RUN** here. CI conclusion, actual download completion, PDF printing, tablet layouts, and storage-full browser behavior remain **HOLD** until separately verified.

**Next checkpoint:** Run the native Node suite in CI or local clone, then browser-verify actual export under quota pressure; investigate per-keystroke double writes and index-write failure semantics without weakening profile isolation.
