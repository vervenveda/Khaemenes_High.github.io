# 2026-11-18 · Grade 09 Dashboard: Daily Start and Profile Tools

- **Types:** source audit · repair · regression
- **Status:** source repairs committed; live browser and learner-state acceptance pending

## Reproduction hypotheses and source evidence
- `grades/grade-09/student-profile/index.html` did not identify its grade on its `body` element, despite the Academy guest-tour script reading `body.dataset.grade`. The script formerly treated the grade dashboard as a generic `/student/` page and intercepted selected profile links.
- The daily entry link in `learningTodayActions` was replaced during asynchronous course continuation resolution. A delayed Algebra I map fetch could leave the daily action in an inconsistent intermediate state.
- `dashboard-layout.js` opened optional external apps using `window.open(...,"noopener,noreferrer")`, which may return null or be blocked. Missing dialog handlers also lacked an exception safeguard.

## Changes
1. Add `data-grade="09"` to the Grade 09 dashboard root.
2. Keep a first-class `Start Daily Lessons` anchor to `daily-lessons/` independent of asynchronous continuation. Course-specific continuation remains a secondary action.
3. Tool rail handles optional popup exceptions, falls back to in-page Schedule/Student Progress, and uses same-tab verified Verve N Veda host navigation for external KlasaiPeer/Yearbook fallbacks.
4. Add `tests/grade09-dashboard-entry-regression.test.mjs` and isolated GitHub Actions workflow `.github/workflows/grade09-dashboard-interaction-guards.yml`.
5. Companion Academy shared visitor popup change adds an existing-learner selection link and avoids repeatedly reopening a guest-only modal after dismissing it.

## Protected authority
No learner enrollment, IDs, grade, mastery, evidence, class pin, account storage, course assessment or STOS data were changed. Public guest protection remains active for actions that require an active Academy learner.

## Acceptance remaining
A live browser must confirm: dashboard responsive after 10+ clicks; direct daily route loads; each of eight profile tool actions works; guest prompt appears at most once per page visit; enrolled Grade 09 bypasses guest prompt; photo/background/yearbook/class dialogs close by button/Escape; 333/auto tickers and official header appear once. Test on desktop, tablet portrait and landscape.

## CI note
A pre-existing broader High School Quick Link workflow reported failures across unrelated course widget requirements, even after the newly added focused Grade 09 test step completed. The isolated workflow provides a specific verdict without claiming the whole High School repository is green.
