# Science and Social Studies: High School student instructional doorway recovery
Date: 2026-11-19, America/New_York
Repository: vervenveda/Khaemenes_High.github.io
Mode: narrow navigation-only source recovery. No student records, course engines, assessments, grading, or main Vervenveda gateway modified.

## Scope
Grades 9–12, Science (Integrated Science 9, Biology 10, Chemistry 11, Physics & Engineering 12) and Social Studies (Global Studies 9, Social Studies 10, 11, 12).
Student-facing Schedule, Manage Classes, pinned Class, Today shortcuts, Daily Focus Classwork/Review, and independent Daily Lessons.
Public course landing pages remain intact; students should enter required readiness, the actual day lesson, weekly student packet, native week view, or course-owned mastery step, not a minimal public course home.

## Source findings
- The four Science and four Social Studies public course landing pages still loaded the retired `assets/high-school-global-chrome-v2.js` (the actual module was absent). Removed those eight obsolete script references individually; no replacement chrome layer or stylesheet added.
- `courses/shared/high-school-eight-class.js` already defines native first-step lesson locations for all eight courses; all eight destination files were verified through the GitHub contents API.
- Biology 10, Chemistry 11, and Physics 12 Week 02 day-01 lessons exist under `weeks/week-02/lessons/day-01.html`.
- Social Studies 10–12 Week 02 `weeks/week-02/student-packet.html` files exist, and Global Studies 9 Week 02 student packet exists.
- Science 9's `science9-dashboard-app-v1.js` reads `COURSE_QUERY.get("view")` and `COURSE_QUERY.get("week")`. Thus `?view=week&week=N` is the native instructional weekly workspace, not an inert course landing link.
- Upper Science continuation publisher `courses/shared/high-school-science-continuation.js` emits course-specific, learner-scoped nextHref week routes; preserve its status/records.
- A previous Grade 09 course-choice panel had a Course Home link for Science/Social and the course registry could treat historical public home launches as a resume destination.

## Implemented source recovery
1. Removed obsolete global regulator load from Science 9, Biology 10, Chemistry 11, Physics 12 and Social Studies 9, 10, 11, 12 landing pages (eight commits b6a9da1 through 14e712b).
2. Shared Grade 10–12 Class resolver `grades/shared/grade09-blueprint-upper-grade.js` now confines Science/Social continuation snapshots to the appropriate same-origin course; ordinary Science weekly snapshot maps to existing day-01 lesson, ordinary Social Studies weekly snapshot to the genuine student-packet instructional page. Already-existing assessment and corrections surfaces remain owned by their courses. A paused record explicitly uses its course recovery surface; no mastery inference.
3. Grade 10–12 direct Daily Lessons pages now perform the same native course confinement and native weekly step selection for Science and Social Studies, rather than using public `slot.href` when snapshot continuation is absent. Explicit record recovery remains separate.
4. Grade 09 registry now rejects historical saved Science 9 / Global Studies 9 public homes as Class resume destinations and reads the active learner's existing continuation snapshots when available. A Science 9 course-owned native `?view=week` URL is preserved and a readiness-satisfied, no-student-record Science 9 snapshot may begin with the independently verified Unit 01 Day 01 lesson; otherwise canonical readiness and curriculum gates remain authoritative.
5. Grade 09 eight-class course-choice panel's Science/Social shortcuts now read the existing registry and are labelled Continue Science Lesson / Continue Social Studies rather than Course Home.
6. Profile loader version refreshed for all four grades and Grade 09 Daily Lessons course-choice script. Existing upper-grade Daily Focus, Schedule, pinned classes, Today and Manage Classes reuse the shared `step(item)` course-owned destination resolver; no new navigation engine.
7. Added `tools/test-high-school-science-social-student-doorways.mjs`, expanded `tools/test-grade09-lesson-route-normalization.mjs` with synthetic learner-owned science/social snapshots, and added `.github/workflows/high-school-science-social-student-doorways.yml`.

## Non-negotiable preservation
No lesson engine rewrite. No question bank, grading, readiness, mastery threshold, midterm, final, laboratory record, CER, source dossier, parent data, or user storage changed. No public-facing course layouts redesigned. No resurrected page regulator or added global CSS layer. No change to Vervenveda index.

## Acceptance status
- Eight canonical first-step paths and representative Week 02 native lessons/packets: SOURCE FILES VERIFIED.
- GitHub contents commits: WRITTEN/VERIFIED by connector.
- Static regression script and GitHub workflow: COMMITTED; successful execution of workflow jobs NOT independently observed in this session.
- Deployed browser tests including signed-in learner progress continuity, tablet rotation, correct 80% gates, service-worker freshness, and Class/Today link behavior: HOLD.
- Social Studies precise last unfinished week is not inferred if no authorized course-owned continuation snapshot exists. The verified first instructional packet is the safe starting doorway, without altering learner evidence.

## Cross-course regression compatibility addendum
- 9ec854f: Grade 09 continuation snapshot read is fail-closed when the Academy continuation service is unavailable.
- b625d20 / c6f77b6: Grade 09 profile and Daily Lessons import the latest v2 registry script to avoid an older browser-cached continuation implementation.
- 6756498: Grade 10–12 shared student Class resolver preserves explicit Science/Social recovery instead of launching a lesson over an invalid record.
- 0761fe5 / dc2e004 / 42b484c: direct Daily Lessons pages maintain the same explicit recovery exception.
- 8584bbf / 52b9ef5 / 3841d29: upper-grade profiles import v2 guarded shared resolver.
- 89dbd90: source regression additionally checks native Science 9 query-based weekly view and paused-record boundary.
- 57f0e21 / b30871c / 33092cb / 6b26634: existing English, mathematics, and new Science/Social source tests were reconciled so they verify shared class-route behavior rather than stale version token literals or previous English-only source snippets. No student/course behavior changed by these test-only commits.
- Run conclusions and authenticated browser acceptance remain unverified; do not equate committed regression source with a passing runtime workload.
