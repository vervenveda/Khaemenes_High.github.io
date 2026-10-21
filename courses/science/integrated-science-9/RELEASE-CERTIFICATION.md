# Khaemenes Academy — Grade 9 Science Release Certification

**Status:** CONDITIONAL — automated source and simulated behavior checks passing; real-browser/device certification outstanding.

**Scope:** Science 9 Units 01–12, formative evidence in Units 02–12, learner-scoped portfolio, backup and restore. Do not equate formative evidence with completed or mastered lessons.

## Automated evidence (20 October 2026)

- Science 9 learner journey regression (includes simulated portfolio behavioral checks): **PASS**.
  https://github.com/vervenveda/Khaemenes_High.github.io/actions/runs/39538024679
- Source validation checks cover unit lesson tool connections, learner-scoped save keys, backup schema and matching, missing-only restoration, learner-switch clearing, and printable-evidence source rules.
- These tests are not physical-browser, offline, mobile, assistive technology, or cross-device verification.

## Human browser / device certification record

Complete on a test learner ID and **never import a test backup into a real student's browser**. Start from a browser profile with disposable test data. Attach screenshots or record URLs/notes and the tested commit SHA for each item.

| ID | Test | Expected result | Status | Tester / date / evidence |
| --- | --- | --- | --- | --- |
| B01 | Load Science 9 portal and Units 02, 06, 09, 12 | Lessons and investigations open; no broken buttons | NOT TESTED | |
| B02 | Set distinct test learners A and B | B cannot see A's formative notes | NOT TESTED | |
| B03 | Save evidence for A in each representative lab | Reopen same learner and activity; exact notes recover | NOT TESTED | |
| B04 | Export single-record JSON and full portfolio JSON | Files download, parse, and retain all text | NOT TESTED | |
| B05 | Restore portfolio on fresh separate browser profile/device with same test learner ID | Preview counts accurately; missing records appear | NOT TESTED | |
| B06 | Restore over existing evidence | Existing notes preserved, no silent replacement | NOT TESTED | |
| B07 | Import backup for wrong learner or malformed JSON | Rejected; no data changed | NOT TESTED | |
| B08 | Switch learner while restore picker is open or during import | Stops and clears outdated evidence | NOT TESTED | |
| B09 | Print portfolio and each investigation | Academy / grade / unit / student / date / typed notes legible | NOT TESTED | |
| B10 | Set viewport to 255px | No clipped cards, sideways page scroll, or unusable controls | NOT TESTED | |
| B11 | Keyboard-only operation and screen reader announcements | Controls focusable, labels and status messages understandable | NOT TESTED | |
| B12 | Disconnect network after initial local page load | Formative save/reopen/print works with supported offline resources | NOT TESTED | |
| B13 | Complete scored check as learner A | Formative operations do not change verifiedScore or mastery | NOT TESTED | |
| B14 | Export portfolio after restoring new notes | Export contains restored records, not stale page data | NOT TESTED | |

## Evidence log template

- **Test ID:**
- **Commit SHA:**
- **Browser, version and OS:**
- **Viewport/device:**
- **Learner IDs (test-only):**
- **Steps and test data:**
- **Observed outcome:**
- **Expected outcome:**
- **Pass / Fail / Blocked:**
- **Evidence path or screenshot:** 
- **Defect issue / repair commit:** 
- **Retest date / reviewer:**

## Release gate

A release can be marked **CERTIFIED** only when B01–B14 have been performed on the release commit and passed (or documented with an approved, explicit waiver), no critical defects remain, the relevant GitHub workflows are green, and the evidence log cites the exact tested SHA. Any functional changes after certification require targeted retesting.

**Privacy:** These portfolio records are local browser storage, not password-protected accounts. A selected learner ID helps prevent accidental mixing but does not provide authentication, encrypted storage, or protection against another person using the same browser. Back up valuable work outside the browser.


## Guided manual test procedure (disposable learner only)

Use a **new browser profile**, not one used by a real learner. Open the [Science 9 portal](./index.html), select a clearly fictional test learner ID such as `qa_student01`, and preserve a copy of any test-only backup elsewhere.

1. **B01–B03 (lesson and recovery):** Open an investigation in each of [Unit 02](./units/unit-02/), [Unit 06](./units/unit-06/), [Unit 09](./units/unit-09/), and [Unit 12](./units/unit-12/). Enter recognizable unique text, press **Save notes locally**, reload, and check that the exact text returns.
2. **B04–B07 (backup isolation):** Open the [portfolio](./science-evidence-portfolio.html) and export JSON. On a distinct fresh profile, set the *same* disposable learner ID, select that file under **Restore portfolio backup**, inspect its record counts, and select **Restore missing records only**. Confirm imported evidence displays on reload. Repeat with a different learner ID and verify rejection. Do not run this test on genuine learner records.
3. **B08 and B14 (switch and freshness):** With the portfolio visible, change the test learner selection in another tab and return. Confirm stale records disappear. Reopen the original learner, save a new test note, then export the portfolio and check that it includes the new record.
4. **B09–B10 (print and 255px):** In browser developer tools, set the page viewport to **255 CSS pixels** and inspect all actions from top to bottom. Look for clipping, overlap or horizontal scrolling; record screenshots. Use Print Preview to verify every typed observation wraps, Academy/grade/unit and review fields remain readable, and no important content is hidden.
5. **B11–B13 (accessibility, offline and grading):** Navigate the entire workflow using only Tab/Shift+Tab, Enter and Space; inspect visible labels and feedback. With assets previously loaded, disable the network and check which interactions still function. Compare the test learner's graded result immediately before and after formative evidence operations.

For each observation, fill in the **Evidence log template** above; attach the commit SHA, viewport, browser version and screenshots. If any step is blocked, mark it **BLOCKED** and record why—do not substitute an automated source-level assertion for hands-on verification.

## Immediate release gate observations

- **Last verified automated status (2026-10-20):** Science 9 learner-journey and student-experience workflows passed; https://github.com/vervenveda/Khaemenes_High.github.io/actions/runs/39538144322 and https://github.com/vervenveda/Khaemenes_High.github.io/actions/runs/39538144223 .
- **Device verification:** B01–B14 remain **NOT TESTED** unless a reviewer completes the corresponding evidence log.
- **Important offline qualification:** Opening a GitHub Pages URL with the network disconnected is not proof the whole course works offline; offline availability depends on previously cached files or local copies. Test the specific capability in question.
