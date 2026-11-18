# November 18, 2026 · High School UI freeze and diagnostic observer recovery

## User report
High School and Grade 09 Student Profile both unresponsive, including diagnostics. User shared an additional screenshot during the recovery.

## Source-level root-cause candidate
Both affected pages import `assets/high-school-global-chrome-v2.js`, which had a document-wide `MutationObserver` on `document.documentElement`; on every child insertion/removal it ran `mountHeader()`, `mountToolbar()`, `cleanupKnownFloaters()`, `preserveExportMarker()`, `scheduleTypography()`. Both pages also have explicit shared chrome mounts or other dynamically inserted widgets. That combination can cause repeated expensive rendering/reinitialization and interfere with interaction. Source-level inference only; a CPU trace/DOM log is still needed to declare runtime root cause.

The High School opt-in deep probe additionally generated a full-page forensic report on each tracked event; a large DOM audit repeatedly invoked during page changes can itself worsen freezes.

## Changes
- `assets/high-school-global-chrome-v2.js`: keep normal initial chrome setup, but do **not** attach the blanket remount observer on the High School front hall (`/Khaemenes_High.github.io/`) or student-profile routes (Grade 09–12). Other course pages retain their original observer for now.
- `assets/high-vnv-chrome-audit-optin.js`: preserve the opt-in report and event timeline; only render the large report automatically on initial panel creation. Later events are available through **Refresh snapshot** and the console instead of triggering full scans every time.
- `tests/high-chrome-observer-recovery.test.mjs` added.
- `.github/workflows/grade09-dashboard-interaction-guards.yml` expanded to syntax-check both shared files and execute the new regression.
- Initial CI runs failed because patch transport inserted literal backslash-n text. Both files were corrected in follow-up commits; the final focused run passed: https://github.com/vervenveda/Khaemenes_High.github.io/actions/runs/44374471352

## Scope and limits
Changes do not touch learner identity, family accounts, storage, grades, assessments, or STOS authority. They do not remove the official ticker pair, VNV header/hamburger or toolbars. The underlying source loop may still exist in a different observer or rendering module; production/browser responsiveness must be tested with a hard reload in a clean tab.

## Acceptance
1. Verify High School landing without diagnostic first: click a header/menu, student entry and footer buttons.
2. Verify Grade 09 Student Dashboard without diagnostic: click Daily Lessons, profile tools and dismiss popup.
3. Verify diagnostic only after base navigation responds; use `?chrome_audit=1`, click Refresh snapshot once, Close diagnostics, and confirm no automatic re-open.
4. On browser failure, identify script error, hit-test obstruction, and CPU/DOM mutation load rather than making unrelated design changes.
