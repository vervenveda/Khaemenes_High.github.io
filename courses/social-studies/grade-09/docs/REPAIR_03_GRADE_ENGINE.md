# Repair 03 — Academic Grade Engine Integrity

**Course:** Grade 9 Global Studies Honors  
**Status:** IMPLEMENTED — evaluator data path still requires further teacher-portal hardening

## Problem found
The published grading policy is:

- Assignments — 45%
- Weekly quizzes — 20%
- Midterm — 12%
- Final — 18%
- Journal / discussion / reflection — 5%

The prior student runtime primarily calculated course completion and could display assignment submission counts, lesson completion, and objective assessment scores. Those measures are useful for workflow but are not interchangeable with academic grades.

## Repair implemented
A separate academic-grade engine now reads the canonical browser record and calculates the published weighting scheme without converting completion or submission into academic credit.

New file:

`assets/grade09-socialstudies-grade-engine-v1.js`

### Integrity rules

1. **Assignment submission is not an assignment grade.** Assignment percentages are calculated only from recorded evaluator scores.
2. **Quiz grades use actual objective quiz scores.** Best recorded percentages are used consistently with the existing retake policy.
3. **Midterm and final objective scores are real evidence but do not falsely imply the written portions were evaluated.** A fully official examination result requires evaluator-supplied written/total scoring data.
4. **Journal/discussion/reflection receives no invented score.** The 5% category remains pending until evaluated evidence exists.
5. **Official course grade is withheld until every weighted category contains evaluated evidence.**
6. **A current evaluated-work grade may be displayed for transparency, normalized only across categories that actually contain scores.** It is explicitly labeled provisional/evaluated-work rather than official.
7. **Weights are frozen at 45/20/12/18/5 and sum to 100%.**

## Production integration
The canonical `index.html` now loads the grade engine after the mastery layer. The service worker cache was advanced to v3 and now includes the new grade-engine asset.

During this repair a stale offline-shell target was also found: `teacher/teacher.js` was listed in the service-worker shell but does not exist in the inspected teacher directory. That target has been removed so installation cannot fail because of a nonexistent cached file.

## Remaining work
Repair 03 is functionally established but not yet considered fully closed. The teacher/evaluator portal still needs a hardened scoring interface for:

- assignment rubric scores and possible points;
- journal/discussion/reflection scores;
- written midterm scoring;
- written final scoring;
- evaluator feedback and audit history.

Those evaluator controls should write to the same local record schema consumed by the grade engine. Until then, the engine correctly reports those categories as pending instead of fabricating grades.

## Pass condition for full closure
A deterministic benchmark student record must produce the same result by hand calculation and in the runtime for all five weighted categories, while missing evaluator data must never be silently treated as zero, 100%, or completion credit.
