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
