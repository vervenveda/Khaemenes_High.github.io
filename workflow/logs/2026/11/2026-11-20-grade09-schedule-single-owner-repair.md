# Grade 09 Schedule button — single-owner repair
Date: 2026-11-20
Scope: Surgical repair of the existing redesigned Grade09 Schedule. No new component layer.

## Root cause established in current main source
`dashboard-layout.js` constructed a Schedule dialog and appended the original `.grade09-priority-schedule` into its body. Later the **same script reparented the schedule out of the dialog** into the page, set `schedule.hidden=true` and `aria-hidden=true`. This left the Schedule modal disconnected from its content. Separately `class-progress-dialog.js` had a second legacy Schedule dialog constructor guarded only by existence checks, producing redundant ownership and timing risk.

## Repairs
1. `dashboard-layout.js`: retain its original redesigned dialog as sole owner; keep the original live schedule mounted within it, visible and without `aria-hidden`. Preserve a visible fallback if its dialog fails to mount. Never change student schedule data or saved class pins.
2. `class-progress-dialog.js`: remove the entire redundant legacy Schedule-dialog IIFE, leaving its `grade09ClassProgressDialog` implementation unchanged.
3. `index.html`: bump only the two affected script cache revisions to ensure browser retrieval of corrected source.

## Static post-commit verification
- PASS — single Schedule constructor in loaded ownership
- PASS — Schedule no longer hidden in layout
- PASS — Schedule shown in dialog
- PASS — Schedule toolbar handler
- PASS — Progress popup preserved
- PASS — Grade09 uses fixed source revisions
- PASS — All eight toolbar actions preserved
Result: 7/7 static checks PASS.

## Not yet verified
- Live browser clicking Schedule and observing complete eight-class grid, scroll behavior, close/reopen, and tablet portrait/landscape.
- Source-level check does not establish runtime HTTP performance, cache propagation or end-to-end course links.
- No Account Cloud writes/sync/encryption; no family, learner or course records read/written/deleted.
