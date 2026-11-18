# High School Phase 1 · Release-gate forensic repair
Date: 2026-11-18
Mode: scoped GitHub source repairs + GitHub Actions verification; no learner data used.

## Baseline
Starting inspected tree SHA: `8899967163cbde4d822ad01e90c9bf547efc57ed`.
Failed baseline: public entry routes, sitewide records/routes, and dual-ticker workflow configuration.
No academic scoring, learner-record, storage or mastery logic was intentionally modified.

## Committed source changes
- `tools/validate-public-entry-routes.mjs`: resolve GitHub Pages project-prefixed absolute paths against repository root; reject escaping routes. Commit `1b556fad43d5d51e8d39d8dbee08ba1ad8d85896`.
- `courses/mathematics/pre-algebra/teacher/index.html`: correct two shared-script relative URLs. Commit `f77a31c2b6533f1bfd502f20b50fba3dad838cd8`.
- `.github/workflows/high-school-dual-ticker-coverage.yml`: replace literal escaped newline sequences with YAML newlines. Commit `c7bbb2da2cba0afd5537a91468e9c2137a15b15c`.
- `tools/validate-sitewide-routes.py`: exclude historical `workflow/` HTML snapshots from active-page validation while retaining all other HTML checks. Commit `af0b1c544cdaf09787a2bcaa86341e41d6eb6bf7`.
- `courses/electives/index.html`: add expected canonical navigation CSS/JS. Commit `a8c5bb4869d1d06008c965390bae96bb8bc4a158`.
- `courses/language-arts/english-9/rubrics/index.html`: add official dual-ticker guard. Commit `5f2381206b4fd44edeb563b2aa2692edfbc1f6df`.

## Verified GitHub Actions on 5f2381206b4fd44edeb563b2aa2692edfbc1f6df
PASS:
- Public Entry Route Validation, run 44302109362.
- High School Dual Ticker Coverage, run 44302109445.
- Release Head Integrity, run 44302109455.
- Grade-aware course execution matrix, run 44302109453.
- Sitewide reference step: 3,653 active HTML pages; 41,477 local references; zero missing files.

Open holds (do not mark as passed):
- Record and Route Validation run 44302109796: `courses/social-studies/grade-10/index.html` lacks navigation CSS required by grade-aware navigation test; later steps not run.
- Language Arts Curriculum Quality run 44302109545: English 10 browser curriculum drift from expected generated source.
- English 9 Daily Lesson Validation run 44302109502: Week 3 managed-progress test expectation mismatch.
- High School Learning Architecture Regression run 44302109469: Social Studies 10 missing `highAssessmentDraw` expected integration.
- High School Student Profile Quick Link Validation run 44302109423: several profile/beta-widget and preserved-work contract failures.
- High School Profile Toolbar Coverage run 44302109379: failed; review job logs separately.
- GitHub Pages deploy/runtime browser validation is separate and remains HOLD until independently observed.

## Boundary and next order
1. Verify current branch and jobs after last write.
2. Repair Social Studies 10 navigation asset parity without duplicating header/chrome.
3. Trace English 10 curriculum generated-source authority and Week 3 test-to-implementation parity.
4. Review Social Studies 10 assessment adapter integration and profile widget test contracts.
5. Repeat Actions and browser/learner acceptance tests. Never weaken gates solely to produce green checks; preserve canonical assessment, enrollment, export and historical learner-record boundaries.

## Subsequent scoped repair
- `courses/social-studies/grade-10/index.html`: added existing shared `high-navigation-v1.css` alongside its already loaded navigation JS. Commit `a44fd9ac2e746bf46407192e68c1525922b31700`. The follow-up Actions jobs were triggered; their conclusions are not included in the earlier snapshot. Do not count the navigation suite as passed until its full chain completes.

## Continuation: English 10–12 learner records and offline games
- `courses/language-arts/english-10/assets/course.js` (`0d7039db4580606bb9bab9b8f8a6420bf2adab87`), English 11 (`aeb2304c8656f6f9f33ff61a4381c51f78f6e64c`), English 12 (`32c279ccff4058c8c5bc3fe80609eee936e95e6f`): fix incorrect single-selector `$()` use on collection operations. Preserve scoring and learner records.
- `tools/test-upper-english-records.mjs` (`5c1b2002714939472c0f755b6d2960a060801ce4`): supply browser-standard `URLSearchParams` and `location.search` in the synthetic VM, without changing browser behavior.
- Verified in High School Record and Route Validation run `44303145324`: English 10/11/12 learner record tests PASS, including zero scores, isolation, stale tabs, backup recovery and storage failures.
- `service-worker.js` (`6a2c05393f35e50deb1c6a594c223fb1e500647c`): add canonical Model Forge game to atomic precache and rotate cache version to v41.
- Verified in run `44303145324`: all 83 canonical math games, seven game runtime files, 440 release assets and fail-closed offline install PASS; math note recovery and course-aware offline fallback also PASS.
- `tools/test-math-assessment-submission-integrity.mjs` (`6ebb16229b8c545ecb3fa4b98b5b425c5dea52bc`): supply actual Algebra II `formalGate` lexical context in the score function's synthetic test. Full result remains HOLD pending run `44303264034`.
- Known independent ongoing holds: English curriculum/browser-data drift, English 9 Week 3 progress test drift, Social Studies 10 assessment bridge, profile quick links/toolbar, and browser acceptance. Do not infer these are resolved by the passing subset.

## Continued verification: mathematics assessment, Grade 9 visual contracts
- `tools/test-math-assessment-submission-integrity.mjs`: mock `priorQuestionIds` in the isolated assessment function context; `5845c1fbdd0828049f74af14d75e975bee80f89a`. The full scoring function in production retains original scope and authority; no grade changes made.
- `tools/test-prealgebra-unit01-lesson-structure.mjs`: properly resolve the six pre-algebra lessons' canonical project-root chrome script references, rather than treating them as relative; `1e0e972800346934ff6000817930b0fadf35a5fe`.
- `tools/test-grade09-visual-consistency.mjs`: verify English 9's intentional centered navigation and Science 9's extracted `science9-dashboard-app-v1.js` runtime, including JS syntax and original contrast behavior, rather than demanding retired sidebar/inline-script implementation; commits `72f65b6f21aea5b0e74e7717e57e0780005269f2`, `456defdf19f4f08cdfd919b94c456f7df88904c9`.

### Latest green full workflow
On `456defdf19f4f08cdfd919b94c456f7df88904c9`, `High School Record and Route Validation` run `44303945994` completed SUCCESS. This covers all job steps including navigation, learner-scoped recovery, English 10–12 records, offline ownership and games, math assessment submission, Pre-Algebra Unit 01, advanced math release preflight, mathematics continuity and Grade 9 visual source contracts. Public Entry Route Validation run `44303945895` and Release Head Integrity run `44303945769` also completed SUCCESS.

### Remaining certification boundaries
This is an automated source/synthetic-run milestone, not browser-device acceptance, authenticated STOS final credit, or clearance of separate failing department workflows (English curriculum drift, Week 3 tests, Social Studies adapter, profile/toolbar and other independent course gates). Continue independently auditing those without weakening test assertions.

## Next high-priority hold: Social Studies 10 assessment adapter
The High School Learning Architecture regression `tools/validate-high-school-learning-architecture.mjs` demands the inline tokens `highAssessmentDraw`, `KhaemenesHighAssessmentAdapter`, `attemptId`, `questionIds`, `reviewSkills`, `score>=80`, `highAssessmentComplete` in each of Social Studies 10–12's `index.html`. Social Studies 11 and 12 include all seven in the active page. Grade 10's canonical `index.html` is short and loads `course-data.js` plus `app.js`, and although the shared assessment adapter script is referenced, `app.js` contains none of its runtime integration tokens. Its weekly quiz currently uses a separate local scoring engine. **HOLD:** determine safe integration with the canonical Grade 10 quiz authority, randomized forms, existing learner records, 80% mastery and project/human-review evidence. Do not insert empty tokens or weaken the test. Student-data migration and browser acceptance remain unverified.

## Grade 10 Social Studies randomized assessment integration — verified
Date 2026-11-18. This continuation is a scoped academic source upgrade plus source/VM regression, **not** an authorization or browser-device certification.

### Source changes
- `courses/social-studies/grade-10/app.js`: learner-separated persistent Monte Carlo weekly sessions using canonical `course-data.js` quiz banks; randomized option order; answer restoration; 80% objective mastery; no partial-answer disclosures; separately retained constructed response and evaluator-review requirement; idempotent completion receipts; history-aware best scores; preserves original learner gradebook fields and prior attempt counts. Commit `2a26371cb48341f9e87fc3a431fbc18b708badc5`.
- Corrected existing incorrect single-select `$()` calls on `#weekList` and weekly quiz question inputs to multi-select `$$()`, enabling week navigation and response preservation. Commit `c7d12a01f82242c0717efcb9ab5afdf5b92f26c3`.
- `tools/validate-high-school-learning-architecture.mjs` checks Grade 10's **actual extracted app.js** instead of retired inline source, verifies learner-session contracts; existing Grade 11–12 checks retained. Commits `9ccc60f1c153c021d49a829e39c350e239cfd0f9`, `a89aa97b7d88f3036ded9a888793c7c34b57d16a`.
- `tools/test-social-studies-grade10-session-bridge.mjs` adds behavioral checks of 36 ten-question banks, per-learner isolation, persistent active session and response, retake session rotation, review provenance, fail-closed storage, legacy record byte preservation and 80% policy. Commit `36560dae848e059cacd0ae65d317d3598a182764`.
- `.github/workflows/high-school-learning-architecture-regression.yml`: includes behavioral Grade 10 verification as a mandatory gate. Commit `bdd4cedac8a6b48701a6984272d65f9a5f2543da`.

### Verified workflow evidence
`High School Learning Architecture Regression` run `44305571274` completed **SUCCESS** with both architecture validation and newly added Grade 10 learner-session behavioral test. Output confirms `36×10` question banks and per-learner/refresh/recovery/retake/storage safeguards. The earlier SHA `a89aa97b7d88f3036ded9a888793c7c34b57d16a` also passed the full `High School Record and Route Validation` run `44305277746`, public entry routes `44305277713`, and release-head integrity `44305277695`.

### Remaining holds
- Grade 10 legacy browser QA `tests/test_social_studies_grade10_dashboard.py` expects `#ss10-tools`, inline global report functions and explicit missing-Academy-profile errors from an earlier page version. Current canonical Grade 10 entrance is a separate extracted JS implementation; 5 browser assertions failed, so this is **NOT** a browser acceptance PASS. Investigate actual learner identity/authorization behavior before updating tests or claiming parity.
- Independent English curriculum, English 9 week progression, student profile toolbar/quick link, vocabulary and other department CI holds remain separate.

## Forensic identity boundary discovered during Grade 10 browser QA review
`courses/social-studies/grade-10/app.js` uses `khaemenes_grade10_social_studies_v1` as the historical shared Grade 10 gradebook key, whereas the `social-studies-10` allowlist in `courses/shared/learner-scope-v1.js` currently claims `KHAE_SS10_USH_CLEAN_PORTAL_V1` only. The new Monte Carlo session key separates local student IDs but is **not** itself authenticated Academy learner binding. This means legacy Grade 10 gradebook ownership cannot be certified from the new session test.

**SECURITY HOLD:** design an ownership-preserving transition for unassigned device records and canonical Academy learner binding using the existing learner-scope claim/export safeguards; preserve all historical attempt/assignment data, forbid automatic ownership claims and post-switch writes, and prove read/write denial for guests via Playwright. Do not just add the historical KEY to the allowlist: it would also intercept the current nested Monte Carlo key containing a *local* student ID and could reject or misroute sessions. Update key shape and guards in a coordinated, tested migration. Local/browser identities are never credentials for formal credit.

Independent Grade 10 browser QA currently has five failing assertions against `#ss10-tools`, old inline report helpers, and missing-Academy-profile behavior. Treat them as source/UX discrepancies until real current-page interactions are tested. Do not mark Browser QA PASS from the synthetic Monte Carlo test.
