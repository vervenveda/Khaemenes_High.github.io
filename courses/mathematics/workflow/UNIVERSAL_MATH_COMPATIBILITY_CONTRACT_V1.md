# Universal Mathematics Compatibility Contract v1

Status: Active on Pre-Algebra, Algebra I, Geometry, and Algebra II.

## Viewport contract

Target widths:
- 255 px
- 320 px
- 360 px
- 768 px
- 1024 px
- laptop / desktop

Required behavior:
- no horizontal page overflow;
- equal controls remain usable;
- grids collapse to one column when necessary;
- tablet landscape removes sticky side columns that can compress lesson content;
- media never exceed the viewport;
- tables scroll inside their own wrapper rather than forcing page overflow;
- primary interactive targets are at least 44 px high.

## Browser/storage contract

The shared compatibility layer performs a reversible localStorage availability probe using a temporary test key only.

If storage is unavailable:
- lesson reading remains available;
- the learner receives a visible warning;
- the system does not silently treat missing records as zero;
- the warning recommends exporting from a browser where the learner record is available before browser data is changed or cleared.

No learner score, mastery, portfolio, or identity data is written by the compatibility layer.

## PWA contract

Each core mathematics course now has:
- a linked manifest.webmanifest;
- an explicit app id;
- start_url and scope of ./;
- standalone display mode;
- education + mathematics categories;
- shortcuts for Lessons, Diagnostic, Assessments, and Calculator;
- service-worker registration from the landing page.

## Offline canonical assets

Each course service worker caches:
- ../assets/math-course-shell-v1.js
- ../assets/math-learning-tools-v2.js
- ../assets/math-progress-contract-v1.js
- ../assets/math-compatibility-v1.js
- ./course-map-v2.json

Course-specific offline lesson, assessment, and project caches remain owned by each course's existing service worker.

## Authority boundary

This contract does not:
- replace course service workers;
- migrate browser-local learner records;
- authenticate learner identity;
- alter mastery gates;
- change the 80% mastery threshold;
- claim that browser-local storage is durable account cloud storage.

Future STOS/account-cloud migration should consume exported/authorized learner records through a separate authenticated intake path.
