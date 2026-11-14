# Khaemenes Academy — Grade 9 Science Release Certification

**Status:** CONDITIONAL / SOURCE-VALIDATED — Units 00–12 are open; automated source and simulated-behavior checks are active; real-browser/device certification remains outstanding.

**Scope:** International Integrated Science 9 (KH-SCI-IIS9), readiness plus Units 01–12, public formative assessments, learner-scoped evidence, portfolio, backup/restore and course navigation.

## Release-state boundary

- **Open:** student route is available.
- **Source validated:** automated repository and simulated-behavior checks pass.
- **Browser/device validated:** the B01–B14 human checks pass on the exact release SHA.
- **Certified:** browser/device evidence is complete and no critical defect remains.
- **Transcript-authoritative:** protected supervised summative evidence has been accepted by the Academy's authoritative academic-record system.

Public formative evidence must never be promoted directly to official mastery merely because it exists in browser storage.

## Current automated evidence — 14 November 2026

On the audited `main` release, Science-specific automation includes:

- Science Student Experience Regression
- Science 9 learner journey regression
- Science 9 learner isolation validation
- Science 9 backup integrity
- Science 9 landing and unit blueprint checks
- Science 9 question-bank and answer-integrity checks
- Grade-aware course execution matrix

These checks exercise source structure, learner scoping, persistence/concurrency safeguards, assessment structure, records, public routes and simulated portfolio behavior. They are **not substitutes** for physical browser, offline, mobile, print or assistive-technology verification.

## Human browser / device certification record

Use only disposable test learner IDs and never import a test backup into a genuine learner profile.

| ID | Test | Expected result | Status | Tester / date / evidence |
| --- | --- | --- | --- | --- |
| B01 | Load portal and representative Units 02, 06, 09, 12 | Lessons/investigations open; navigation and shared Academy shell are usable | NOT TESTED | |
| B02 | Set distinct test learners A and B | B cannot see A's formative notes | NOT TESTED | |
| B03 | Save evidence for A in representative investigations | Reload restores exact learner-scoped text | NOT TESTED | |
| B04 | Export single-record JSON and full portfolio JSON | Files download, parse and retain all text | NOT TESTED | |
| B05 | Restore on a fresh separate browser profile/device with same test learner | Preview counts accurately; missing records restore | NOT TESTED | |
| B06 | Restore where evidence already exists | Existing notes are preserved; no silent replacement | NOT TESTED | |
| B07 | Import wrong-learner or malformed backup | Rejected; no learner data changes | NOT TESTED | |
| B08 | Switch learner during restore/import workflow | Stale context is cleared and operation stops safely | NOT TESTED | |
| B09 | Print portfolio and representative investigations | Academy/grade/unit/student/date/typed evidence remain legible | NOT TESTED | |
| B10 | Set viewport to 255 CSS px | No clipped cards, sideways page scroll or unusable controls | NOT TESTED | |
| B11 | Keyboard-only and screen-reader review | Controls focus, labels/status messages are understandable | NOT TESTED | |
| B12 | Disconnect network after supported resources are loaded | Documented local/offline capabilities work; unavailable network features fail gracefully | NOT TESTED | |
| B13 | Complete scored check as learner A | Formative evidence operations do not forge official mastery | NOT TESTED | |
| B14 | Export after restoring and adding new notes | Export contains the current restored/new records, not stale data | NOT TESTED | |

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

## Protected summative boundary

The public midterm and final are practice/formative resources. Official midterm/final mastery must be separately supervised, authenticated and protected. The final release audit must identify the exact authoritative handoff that accepts official Science 9 completion into the Academy academic record/account system. Until that handoff is verified, public practice records and local portfolio evidence are not transcript authority.

## Release gate

Mark the course **CERTIFIED** only when B01–B14 have been performed on the exact release commit and passed (or carry an explicit approved waiver), relevant automated workflows are green, no critical defect remains, and the evidence log cites the tested SHA.

**Privacy:** Browser-local portfolio records are not authentication, encryption or durable cloud persistence. Preserve valuable learner work through the approved Academy retention/export path.

## Immediate qualification

Opening a hosted page and then disconnecting the network does not prove full offline operation. Offline availability depends on the specific resources already cached or packaged. Test and report the exact capability rather than making a blanket offline claim.
