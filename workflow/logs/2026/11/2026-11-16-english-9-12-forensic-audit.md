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

## Addendum · Autosave and interrupted progress-index writes (2026-11-16)

**Confirmed source observations:** The shared Evidence Studio saved the draft plus the progress index on every input event. Index-write failures were caught alongside the weekly draft write and displayed as a generic save failure despite possible successful persistence of the draft.

**Shared-engine repair:** [48f4f5a](https://github.com/vervenveda/Khaemenes_High.github.io/commit/48f4f5a96e8c2eb507e2067648d50d208b47e0ad) adds a 700-ms debounced autosave, timer clearing on explicit save and cross-tab conflict, and separate weekly draft-write and progress-index-write results. The Save button, week switching and pagehide flush pending changes. When the draft saves but its index does not, the interface says that the draft is saved while summary synchronization is pending; it permits retry before navigating to another week. The records remain learner-scoped, per grade/week.

**Regression additions:** [1f7fe59](https://github.com/vervenveda/Khaemenes_High.github.io/commit/1f7fe59a32a4020bb5d7cec818e5e14a64e21262) adds synthetic delayed autosave and flush-before-navigation scenarios for English 9–12. [bde1d8d](https://github.com/vervenveda/Khaemenes_High.github.io/commit/bde1d8d7f60f3ed9ffddc106ca3b2d1daaeaafd0) extends coverage for a simulated one-time progress-index failure and retry.

**Verification hold:** Source and tests were committed. The repository could not be cloned into the execution container because GitHub DNS access was unavailable. Therefore the Node regression suite was **NOT RUN**, and GitHub Actions success, real quota behavior, and browser performance are **UNVERIFIED**. The new tests are present, not certified passing. No course grade, passing threshold, mastery evidence, teacher sign-off, or assessment attempt was changed.

**Next actions:**
- [ ] Run `node --test courses/language-arts/tests/english-9-12-evidence-studio-regression.mjs` and inspect output.
- [ ] Browser-test rapid input, storage full, index-write denial, navigation, pagehide, tab conflicts, print and JSON downloads.
- [ ] Verify that the full record remains recoverable and reading/progress widgets reflect real data.

## Addendum · Universal Reading Development Report (2026-11-16)

**Objective:** Align the six core non-grading reading indicators across English 9, 10, 11, and 12, preserving each grade's canonical learner record schema and English 9's distinct architecture.

**Source changes committed:**
- [60db3be](https://github.com/vervenveda/Khaemenes_High.github.io/commit/60db3be07b2b9447a874922ad2fb255d27526521): English 9 progress adapter now derives reading entries, assigned weeks explicitly logged, independent entries, minutes, week/unit representation, and source distribution from the existing learner-scoped 30–500-row ledger and weekly tracker. Unclassified legacy entries remain unclassified.
- [944d44e](https://github.com/vervenveda/Khaemenes_High.github.io/commit/944d44edaba378e6d797cbeb5a7344cbe19425e3): English 9 Student Progress now displays the six universal indicator cards and source distribution while retaining its separate weekly reflections indicator.
- [fe98adf](https://github.com/vervenveda/Khaemenes_High.github.io/commit/fe98adff9853e929cc602de5ce76fa766dc5a3bf): English 9 reading report now withholds learner data when the active Academy profile is missing or changed; blank reading status is no longer treated as active reading.
- [0d7969e](https://github.com/vervenveda/Khaemenes_High.github.io/commit/0d7969efb1d7bed38aaea07ec59cf96124d09cf9): Load the learner contract before English 9 course/progress scripts.
- English 10 [ad80ec0](https://github.com/vervenveda/Khaemenes_High.github.io/commit/ad80ec014daac66812e794afd92a803ef2c7d632), English 11 [7ec65ea](https://github.com/vervenveda/Khaemenes_High.github.io/commit/7ec65eabf3f477f74c642a1612c7231d27b357ea), English 12 [4f51ea6](https://github.com/vervenveda/Khaemenes_High.github.io/commit/4f51ea6379a94280f0fe16970e589803f1cea429): clarify “Assigned Weeks Logged” terminology; labels must not suggest graded or confirmed-complete assignment coverage.
- [7d41705](https://github.com/vervenveda/Khaemenes_High.github.io/commit/7d417051d12591fb25fad76c4d2af27eabc779e7): correct legacy reading minutes parser escaping found during synthetic runtime checking.

**Validation provisions:**
- [50a6472](https://github.com/vervenveda/Khaemenes_High.github.io/commit/50a64726ff530f4b3ac56832cca4d7cd2e6c402f): Node regression suite for four-grade cards, Grade 9 source adapter, identity guard, and upper-grade engine preservation.
- [d95bb30](https://github.com/vervenveda/Khaemenes_High.github.io/commit/d95bb3001a5f873da3c7e381dffce597cb24ec26): add the new suite to the reading alignment CI workflow.

**Evidence:** Direct V8 syntax check for the English 9 progress script **PASS**. A synthetic Grade 9 runtime exercise with three ledger entries (assigned, independent, unclassified), a weekly reading record, “12 pages” and “45 minutes” produced **entries 3; assigned weeks 1/36; independent 1; minutes 65; represented weeks 2/36; represented units 1/12** after the parser fix. This verifies that scenario only. Full Node suite and actual browser rendering, learner device isolation, cross-tab refresh, and CI conclusion are **NOT VERIFIED** in this session (remote raw GitHub DNS inaccessible to local execution container).

**Privacy and authority:** No learner data was used; no changes to reading entries, assessment scores, mastery gates, or official gradebooks. Entries without an explicit type are not assumed assigned or independent. “Logged” is not a certificate of reading completion.

**Next actions:**
- [ ] Run and review `node --test courses/language-arts/tests/english-9-12-reading-development-report-regression.mjs` and GitHub Actions status.
- [ ] Visually inspect all four Student Progress pages on desktop and mobile/tablet.
- [ ] Review overlap between Grade 9 portal minutes and ledger minutes before asserting a deduplicated total in production; current report describes recorded activity, not unique session duration.
- [ ] Verify upper-grade assigned-title matching before introducing any strict “canonical assigned reading completed” indicator.
