# English 9 · Week 01 Days 01–05 · Shared Loading and Reading View Repair
**Date:** 2026-11-16  
**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Scope:** English 9 Week 01 individual daily lesson routes, Day 01 through Day 05  
**Status:** SOURCE REPAIR COMMITTED · STATIC JAVASCRIPT SYNTAX PASS · LIVE LOADING/VIEWING HOLD

## Incident
Founder reports that all five direct-link daily pages fail to load properly. This is a shared-course incident, distinct from the previously reviewed Reading Log defect. Source review was performed on live default-branch repository files. Attempts to retrieve the published GitHub Pages URLs externally were blocked by browser retrieval, so no live HTTP, network or console result is asserted.

## Confirmed risks in source
- `courses/language-arts/english-9/assets/daily-lesson.js` read `localStorage.getItem("khaemenes_active_learner_v1")` without a try/catch before initializing the page; a storage exception could abort execution with status stuck at its initial “Checking learner and saved work…” message.
- `assets/high-school-global-chrome-v2.js` installed a full-subtree MutationObserver that called header and toolbar mount functions on every added/removed node. The observation created avoidable repeated work on day pages with dynamic evidence components; actual browser event-loop behavior remains unverified.
- The five pages lacked dedicated in-page reading-size controls. Browser zoom behavior itself remains a separate diagnostic target.
- All five pages retain their individually committed instructional Reasoning Laboratory sections.

## Commits
| Change | Commit |
| --- | --- |
| Fail-closed handling of inaccessible browser storage in shared daily lesson engine | `23da1aaa1d3bd65e66ef932b99d414f0ed2b1bdd` |
| Skip broad global-chrome subtree remount observer only on Week 01 Days 01–05 | `0a7103c53ae614f0492a200d16c94baa6f6c9749` |
| Add scoped A−, A+, Reset reading-view controls to daily lesson engine | `494c2e40ed9ff72e424a5c29c9bd4a58e54dfbaf` |

## Scope and guardrails
- No lesson content was deleted or replaced.
- The existing readiness check still requires an authorized learner and the approved 80% mastery prerequisites to save official work.
- Without a valid profile/readiness or with unavailable storage, official writes stay disabled; a read-only preview remains available.
- Original `data-save-field`, progress keys, assessment answers, practice history, first-draft preservation, export behavior and source provenance are unchanged.
- Changes do not introduce a new academic grade writer or any new persistent storage key.
- Reading-view enlargement is a local presentation control, not browser-window zoom; it changes the lesson shell scaling and does not store its state.

## Static verification after commit
- Re-fetched both updated shared scripts from GitHub.
- Parsed each with JavaScript `new Function`: **2/2 PASS**.
- Verified expected guards and reading-view code are in retrieved scripts: **PASS**.
- Re-fetched five daily pages; all **5/5** still reference the shared lesson engine, course entry contract, canonical chrome script, day-specific evidence enhancement and existing JSON export button.
- Shared optional source-custody, Unit 01 evidence, formative-evidence, learning-context and return-to-classes assets exist in repository.

## Outstanding acceptance checks (HOLD)
1. Open Day 01–05 in the browser with Network/Console tools; confirm no indefinitely pending resource or uncaught exception.
2. Confirm the lesson status changes from "Checking learner and saved work…" to an informative read-only or ready state.
3. Verify A+/A−/Reset buttons on desktop, tablet, mobile, and at zoomed viewport sizes; no clipped UI.
4. Verify keyboard navigation, open/close details and native browser zoom; the latter is not fixed by the in-page text controls.
5. With approved beta learner test data only: verify draft recovery, read-only unauthenticated access, readiness denial, 80% gating, practice scoring, evidence-prepared status and JSON export.
6. Check the official header/menu, toolbar, ticket strips and no duplicated global chrome.
7. Re-evaluate any persistent loading problem with actual Chrome network errors before further changes.

## Release decision
All changes committed and statically checked; **functional resolution is NOT confirmed**. Do not expand this loading fix to other grades without browser evidence.
