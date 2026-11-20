# Grade 09 2×4 toolbar forensic sweep — 2026-11-20
Mode: READ_ONLY SOURCE AUDIT; browser execution PENDING. No grade/profile/storage mutation.

Canonical source `grades/grade-09/student-profile/index.html` loads `dashboard-layout.js`, `student-profile-background.js`, `class-progress-dialog.js`, and `study-studio.js`. The earlier additive Account Cloud `account-cloud/grade09-directory-preview.mjs` is **not imported by this page** and cannot itself intercept clicks.

## Eight owners and source wiring (all present in source)
- Schedule — button dialog `grade09ScheduleDialog`, instantiated by dashboard-layout; fallback `schedule/`; route exists.
- Student Progress — button `grade09ClassProgressDialog`, assembled conditionally if `grade09AcademicCheckpoints` and `studentCourseProgress.grade09-class-progress` both exist; fallback reveals `studentCourseProgress`. Runtime presence must be verified.
- Student Portfolio — anchor `../../../portfolio/index.html?grade=09`; target `portfolio/index.html` exists in repository.
- KlasaiPeer — `KhaemenesGrade09StudyStudio.open()`, popup constructed by `study-studio.js`; external fallback not guaranteed.
- Edit Profile — anchor `profile/`; `profile/index.html` exists.
- Edit Background — `grade09BackgroundDialog`; constructed by `student-profile-background.js` only after required profile and toolbar owner elements exist. Runtime presence must be verified.
- Yearbook — `KhaemenesGrade09Yearbook.open()`, constructed by `dashboard-layout.js`; external yearbook destination exists in VNV repository inventory.
- Creative Tools — reveal `khaeStudentEcosystemTools`; constructed by `grades/shared/student-ecosystem-tools.js`; source file loaded before dashboard-layout.

## Concrete risk markers
- A static handler is not proof of success in a real device browser: an upstream script error may prevent a popup from mounting.
- Class Progress and Edit Background have conditional mount prerequisites; verify IDs and visibility after page load.
- Links to separate repos (KlasaiPeer fallback and Yearbook) need actual HTTP/cross-origin smoke tests; VNV repository inventory does not contain a `Klasaipeer.github.io` repository under VNV.
- Browser runtime could not be inspected by repository API, and public VNV site fetch was unavailable in this session.
- The source-only Account Cloud adapter has no live page import and cannot be the direct source of a toolbar click interceptor.

## Delivered safe diagnostic
`grades/grade-09/student-profile/tests/grade09-toolbar-live-audit.js` checks eight button labels, count, visibility, expected DOM targets and globals, plus two anchor destinations as browser path strings. It reads no localStorage/IDs, makes no network calls, opens no dialogs, clicks no buttons, does not mutate the page or learner data. This audit must run in Chrome Console **on the Grade09 profile page**; statuses `WIRED_STATIC_CHECK` still require a human click-flow test.

## Status
Static source wiring **8/8 located**; independent live browser audit **PENDING**; no authoritative claim of 8/8 functional. No live fix made without identified fault.
