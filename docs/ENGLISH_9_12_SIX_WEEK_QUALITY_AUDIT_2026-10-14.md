# English 9–12 · Weeks 1–6 educational quality and work-safety audit

Date: 2026-10-14. Scope: source inspection of the four grade tracks, Weeks 1–6, reading-list book report workspace, and existing quiz hooks. **This is not a browser, device, accessibility, or independent learning-outcomes certification.**

## Verified inventory
- Four grades × six weeks × five daily original short-short readings = **120 short reading inserts**.
- Each new insert has a targeted evidence/interpretation question.
- English 10–12 Week 5–6 lesson files retain their existing embedded quiz-data, daily lesson structure and mastery containers. English 9 uses a different assessment structure.
- Grades 9 and 10: **two** full book report workspaces; Grades 11 and 12: **four**.
- ARSHIF has a 48-unit high-school English catalog, but as of this audit only eight full-text unit editions are mirrored. The 120 daily story inserts are not yet preserved as independent ARSHIF archival editions.

## Highest-priority defect repaired
The initial book report page offered export and print but **did not save in-progress report drafts**. Each course's shared JS has been patched to:
1. Read and save the active Academy learner's separate local key per grade and report.
2. Save after editing pauses and on textarea blur; show explicit status.
3. Recover a previous valid local report when reopening the reading-list page.
4. Download JSON backup and restore a validated, grade/report-matched JSON file with confirmation.
5. Fail closed for absent/switched learners. No mastery scores or course grade records modified.

**Caution:** local storage is device/browser-profile specific, private mode and browser data cleanup can remove it. Users must check downloaded files and store a second copy on a dependable device. Exports are manual; no server or cross-device sync is implemented.

## Educational gaps requiring follow-through
1. **Reading depth:** many recent daily readings are microfiction under approximately 100 words, useful for close reading but not sufficient as stand-alone grade-level literary study; prioritize sustained original narratives and nonfiction with increasingly complex structure.
2. **Assessments:** existing mastery quizzes mostly predate new stories. Add objectively scored passage-based questions only with item-level answer verification, distractor quality checks and regression tests; supplementary story checks must not silently change the 80% unlock criterion.
3. **Book reports:** add teacher review checkpoints, verified availability of full texts or clearly identified equivalent substitutions, originality/citation expectations, and a rubric applied consistently without modifying existing results.
4. **Feedback:** develop worked annotations and exemplar/near-miss responses with alternative readings and feedback guidance rather than a single generic question.
5. **ARSHIF preservation:** assign stable story IDs and archive all Academy-authored daily readings with provenance, links and revision metadata; check rights before reproducing any outside text.
6. **Student testing:** test on phones, tablets, Linux, Windows and Mac; check keyboard-only use, screen readers, focus, print and download, storage limits, two-student separation and JSON export/restore.
7. **Data consistency:** a browser refresh or navigation before the debounce period ends can still lose unsaved typing; use blur and future pagehide flush and test that flows.
8. **Learning outcomes:** compare reading comprehension and student writing against external grade-level benchmarks before making comparative superiority claims.

## Non-regression boundaries
- Main branch only.
- Existing academic progress, quiz scores, access gates and report cards left in place.
- No STOS file changes or third-party client dependencies.
- Archive content contains no students' private notes or reports.

## Sign-off
Source presence checks completed for new week 5/6 readings and book report script instrumentation; actual UI and cross-device recovery tests **pending**.
