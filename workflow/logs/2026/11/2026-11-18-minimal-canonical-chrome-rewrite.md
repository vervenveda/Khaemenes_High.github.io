# November 18, 2026 · Minimal canonical chrome rewrite

## Reason

The shared High School chrome had accumulated responsibilities beyond a site shell. It performed document-wide typography scans and overrides, semantic heading normalization, English lesson presentation changes, course-specific helper loading, ticker mounting, toolbar cleanup, and repeated presentation reconciliation. A separate navigation fallback also retained a whole-document toolbar cleanup observer.

During same-day High School work, pages became unresponsive or failed to load reliably. The earlier source audit had already placed live browser responsiveness on HOLD.

## Recovery architecture

The compatibility filename remains:

`assets/high-school-global-chrome-v2.js`

Its implementation is now **minimal canonical chrome v3.0.0** so existing HTML files do not require mass edits.

The file now owns only:

1. one missing official VNV/Khaemenes header;
2. one missing official lower-right ecosystem toolbar;
3. delegation to the isolated `assets/vnv-dual-ticker-v1.js` guard so the 333 and AutoPopulate ticker pair remain available without chrome owning ticker implementation.

The file no longer owns:

- whole-document MutationObservers;
- typography scanning or computed-style rewriting;
- semantic hierarchy mutation;
- resize-triggered presentation remounts;
- course-specific Geometry or Pre-Algebra helpers;
- English unified-lesson presentation;
- Class Tools / learner-rail injection;
- removal of competing floating controls;
- curriculum, assessment, mastery, grade, learner-record or storage behavior.

## Navigation hardening

`assets/high-navigation-v1.js` retains breadcrumbs, learner/profile routing and ticker-guard ownership.

Its lower-right toolbar block is now fallback-only. The prior whole-document MutationObserver and continuous legacy-floater deletion were removed. The minimal global chrome is the primary ecosystem-toolbar owner.

## Source verification

Current committed source checks:

- minimal chrome contains no executable `new MutationObserver`;
- no `setInterval`;
- no `getComputedStyle` scan;
- no `requestAnimationFrame` typography loop;
- no direct `vnv-333-ticker.js` or `vnv-ticker-autopopulate.js` ownership;
- no Geometry, Pre-Algebra, English lesson-engine or Class Tools loader;
- Algebra I diagnostic still contains `questionHost`, `startAssessmentButton` and `assets/exam-engine.js`;
- existing public-page forensic probes remain excluded by the regression test.

Commits in this recovery sequence:

- `1da0beff0194dff0e5546889ca562a49f8426d6c` — minimal one-time chrome shell;
- `7a6f7d33ede18af1da8dee02f4b25c85005ad04d` — navigation toolbar observer removal;
- `2bd63db3d1f138c31c40d4c85c7819e974f0c2a2` — minimal-shell regression contract;
- `cbf82945df68599a34b0b14a6ae40434088e1a50` — regression matcher correction;
- `38d05dd7f76e64b9a713e41af7bd9b95a3c1d6e4` — isolated ticker-guard delegation;
- `b70477fee88cb130d9408ddfb06ea2af7c351270` — ticker-delegation regression requirement.

## Acceptance boundary

This is a source-level stability repair. It does **not** claim live browser certification yet.

Do not clear learner local storage, course records, grades, assessment attempts, Family Registry data or Account Cloud/STOS records to test this change.

Because the High School service worker can initially return cached-first JavaScript, browser acceptance should use a normal controlled reload and verify the delivered chrome asset version before making further application changes.

Expected browser acceptance:

- page remains responsive after repeated navigation;
- exactly one 333 ticker and one AutoPopulate ticker;
- exactly one official header/hamburger;
- exactly one official lower-right ecosystem toolbar;
- no duplicate floating chrome;
- course controls and assessment entry remain clickable;
- desktop, tablet portrait/landscape and mobile layouts remain usable.

Status: **SOURCE REWRITE COMPLETE · LIVE BROWSER ACCEPTANCE HOLD**.
