# English 9–12 · Student-facing Class Doorway Sweep
Date: 2026-11-19 ET
Repository: vervenveda/Khaemenes_High.github.io
Mode: surgical route reconciliation only; curriculum and public landings untouched.

## Goal
All Student Profile Class/Schedule/pinned/Daily Lessons/Today and Daily Focus Language Arts buttons must enter an existing instructional lesson or required course-owned step, not the minimalist public English course home. Keep public English landing pages independent.

## Confirmed source regressions and repairs
1. Grade 9 generic continuation could treat a historical saved public English 9 course home as the last lesson and route the Class button back to that landing. ce1191d: resolve saved landing to existing Week 01 Day 01; historical saved data unchanged.
2. Grade 9 eight-class course choice grid rendered a separate public Course Home anchor beside Week 01 First Lesson. cd82ece: English 9 now labels that anchor 'Continue English Lesson' and resolves through KhaemenesGrade09Courses. No changes for other subjects.
3. Grade 9 Daily Lessons imported unversioned copies of the course registry and seven-class schedule. 0295b68: use version tokens for repaired source.
4. Grades 10–12 Schedule small Open buttons and Today secondary Open links used the public course URL instead of the shared Class step(). eafc505 and 59671ce: both use step(item).dest, consistent with pinned classes, Manage Classes and main Class button.
5. Grades 10–12 Daily Focus Classwork/Review used slot.href (public course landing). f59dc8a: all personal classwork/checkpoint links reuse the shared grade-aware student Class route resolver; fallback firstStepHref only if the resolver is unavailable.
6. English 10–12 saved continuation publisher provides Week URLs; first-week dedicated day-01 files exist, while later weeks have instructional day anchors in their weekly page. ba4aa87: Week 01 enters the existing dedicated first lesson, later weeks enter the current native weekly #monday section rather than inventing absent lesson files. No inference of precise unfinished day; course retains progression authority.
7. Grade 10–12 Student Profile script version tokens updated: a00f004 / ee326b7 / 45af194.

## Verified native source evidence
- English 9 Week 01 Day 01: weeks/week-01/day-01/index.html
- English 10 Week 01 Monday: weeks/week-01/monday/index.html
- English 11/12 Week 01 Day 01: weeks/week-01/lessons/day-01.html
- English 10/11/12 Week 02 indexes exist and expose id="monday" section.
- Existing shared English snapshots are read using historical ela10/ela11/ela12 aliases (from earlier repair), and only approved course URLs are used.

## New regression checks
- 9b0ffb2: tools/test-high-school-english-student-doorways.mjs covers first lesson existence, Week 02 Monday anchors, Schedule, Daily Focus, Grade 09 course shortcut and script versions.
- 9d3fe85: existing English Class Route Integrity CI workflow now invokes student-door regression, Grade 09 route test, and syntax checks.
- a2d3f7f: extends student-door test to cover Today secondary course links.
- de69da9: extends Grade 09 in-memory test with a historical public-home launch scenario.

## Preservation / acceptance
- No English lesson body, assessments, grades, mastery threshold, learner identity, account data, CSS or Vervenveda gateway edited.
- Public-facing course homes remain unchanged.
- GitHub commits verified by content API; successful CI workflow execution and authenticated browser/device acceptance are NOT yet independently verified.
- Explicitly unverified: exact intra-week last-incomplete day when publisher supplies only the week URL; currently follows native Monday lesson anchor. A new day-level continuation feature requires evidence-backed course-specific work, not guessed files.
- Page chrome/toolbar runtime and all other independent student-facing cross-repository links remain separate QA items.
