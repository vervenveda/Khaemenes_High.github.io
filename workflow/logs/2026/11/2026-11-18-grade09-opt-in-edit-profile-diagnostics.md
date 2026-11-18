# 2026-11-18 · Grade 09 Edit Profile opt-in VNV chrome forensic diagnostics

**User-supplied blueprint:** `DIAGNOSTISC OPT IN(2).pdf` (five pages). The document identifies `grades/grade-09/student-profile/vnv-chrome-forensic-probe.js` and activation through `?chrome_audit=1`. The source is already loaded on the Grade 09 Student Dashboard; the requested Edit My Profile page lacked its script reference.

## Completed
- Installed the **existing shared probe** on `grades/grade-09/student-profile/profile/index.html`, before its profile scripts, using the relative path `../vnv-chrome-forensic-probe.js?v=20261118-profile-opt-in`. No duplicated diagnostic JavaScript.
- Retained the existing Dashboard installation.
- Hardened the shared probe to launch only for exact `chrome_audit=1` (not a bare query flag) and to remain dismissed after clicking **Close diagnostics**. Text floor of diagnostic panel is 16px.
- Retained native MutationObserver and error/rejection listeners for VNV 333 ticker, AutoPopulate ticker, header and branched menu. The console API remains `KhaemenesGrade09ChromeAudit.snapshot()` and `.events()`.
- Added `tests/grade09-profile-opt-in-chrome-probe.test.mjs` to check installation, strict opt-in, privacy exclusions, target IDs and dismissal.
- Updated `.github/workflows/grade09-dashboard-interaction-guards.yml` to run the new test and syntax check on future changes.

## Privacy and authority
The probe reads DOM geometry/styles and transient JS errors; it does **not** read family registry, learner identity, storage, cookies, passwords, scores or course progress, and sends no network requests. It is inactive on normal visits. This modification does not activate Account Cloud or STOS.

## How to use
- Dashboard: `https://vervenveda.com/Khaemenes_High.github.io/grades/grade-09/student-profile/?chrome_audit=1`
- Edit My Profile: `https://vervenveda.com/Khaemenes_High.github.io/grades/grade-09/student-profile/profile/?chrome_audit=1`
- Console: `KhaemenesGrade09ChromeAudit.snapshot()` / `KhaemenesGrade09ChromeAudit.events()`
- Remove `chrome_audit=1` to use the pages normally.

## Verification boundary
Source edits were committed. The focused GitHub Actions regression was triggered and its verdict is to be checked separately. Real browser interaction and timing confirmation are not implied by source checks. The uploaded PDF also mentions a historical `scheduleAutoContrast is not defined` rejection; the current error status requires a fresh probe run and was not independently reproduced here.
