# Pre-Algebra Course Repair Log

**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Course path:** `courses/mathematics/pre-algebra/`  
**Repair focus:** assignment submission language, auto-grading trust, responsive lesson layout, and student-facing consistency.

---

## Repair wave 01 — Units 01–04 submission-language patch

### Completed

The shared unit stylesheets for Units 01–04 were updated so the main student-facing lesson action is visually standardized as:

> **Submit Assignment**

The secondary review action is visually standardized as:

> **Save Lesson Review**

The score/status area now receives a clearer visible prefix:

> **Assignment status:**

### Files updated

- `units/unit-01/assets/unit.css`
- `units/unit-02/assets/unit.css`
- `units/unit-03/assets/unit.css`
- `units/unit-04/assets/unit.css`

### Why this was done first

Many lesson HTML files are compressed into long single-line documents. A shared stylesheet patch repairs the daily student-facing experience without risking accidental damage to the existing lesson JavaScript, scoring handlers, local progress keys, or answer logic.

### Important remaining item

This first repair wave is a visible-interface repair. The deeper semantic pass should still replace the actual HTML button text inside each lesson page when the lesson files are normalized or safely edited. That will make the accessible name match the visible label for screen readers and browser translation tools.

---

## Course-wide standard now being enforced

The intended student flow is:

1. Learn the lesson.
2. Complete the practice.
3. Press **Submit Assignment**.
4. The system scores the submitted work where auto-grading is available.
5. The score is saved locally under the course progress system.
6. Parents or teachers may review the saved result afterward.
7. Mastery unlocks the next step when the course threshold is met.

---

## Next recommended repair wave

1. Verify Units 01–04 live pages on laptop, tablet, and phone.
2. Replace compressed lesson HTML labels directly when safe.
3. Continue the shared stylesheet patch through Units 05–13.
4. Audit assessments and tests for the same language standard: **Submit Test**, **Score Recorded**, **Parent/Teacher Review Available**.


---

## Repair wave 02 — shared lesson workflow, non-invasive integration

### Completed

The Academy-wide mathematics lesson workflow is now attached to Pre-Algebra through the existing per-unit lesson-engine wrappers rather than by rewriting individual lesson pages.

The visible sequence is:

> **Learn → Practice → Submit → Mastery → Review & Continue**

### Integrity protections

- Existing Pre-Algebra lesson engines remain authoritative.
- Existing lesson score and best-score records remain the source of the 80% lesson mastery decision.
- The workflow reads canonical Pre-Algebra progress; it does not write a passing score.
- The workflow points **Submit Assignment** to the existing native submission control.
- A Continue link appears only when the existing lesson navigation is already unlocked.
- Review/reflection markers are browser-local supporting evidence only and cannot unlock progression.
- Existing games, video companions, question banks, readiness routing, unit gates, assessments, records, projects, and course styling were not replaced.
- The strong dark Pre-Algebra dashboard aesthetic remains unchanged.

### Shared files

- `assets/prealgebra-workflow-adapter-v1.js`
- `../assets/course-lesson-workflow-v1.js`
- `../assets/course-lesson-workflow-v1.css`

All Unit 01–13 lesson-engine wrappers load the adapter only after their native lesson engine is available.

### Offline support

The Pre-Algebra service-worker release cache was bumped and now pre-caches the adapter plus the shared workflow JavaScript and CSS. Existing runtime caching of visited lesson pages and local support assets remains intact.

### Source validation

Representative custom and generic unit wrappers parse successfully after integration, including Units 01, 02, 04, 10, and 13. The adapter and updated service worker also pass JavaScript parse validation.

### Next surgical pass

1. Behavioral regression test: two learner profiles on one browser.
2. Verify workflow rendering on representative early, middle, and late lessons at desktop/tablet/phone widths.
3. Confirm lesson submission, retry, 80% unlock, print evidence, JSON export, games, videos, and offline recovery remain intact.
4. Only after those checks, use the preserved Pre-Algebra dark visual language as the reference for Algebra I, Geometry, and Algebra II.


---

## Repair wave 03 — learner isolation, mastery-boundary and semantic regression pass

### Verified

- Pre-Algebra is covered by the shared `learner-scope-v1.js` configuration. All `khaemenes-prealgebra-` and readiness-prefixed records are redirected to the active Academy learner.
- If the Academy learner changes while a lesson page remains open, the shared learner-scope layer blocks further course-record writes until the page is reloaded.
- Native lesson mastery remains a strict `>= 80` comparison. A 79% result remains below mastery; an 80% result satisfies the lesson gate.
- Retry attempts preserve the best demonstrated score rather than allowing a later lower score to erase prior mastery.
- Shared workflow review markers remain non-authoritative and cannot unlock progression.
- Shared workflow Continue is derived only from an already-unlocked native next-step link.
- Lesson evidence export and print controls remain present in the native lesson engines; the shared workflow adds its own clearly non-authoritative supporting-evidence export and Academy print header.
- The service worker release caches the Pre-Algebra workflow adapter and shared workflow CSS/JavaScript, while visited lesson pages and local course assets continue to be cached through the existing runtime policy.

### Semantic repair completed

The generic lesson-engine cores for Units 02–13 now use:

- **Submit Assignment** for the native scored action.
- **Save Lesson Review** / **Remove Lesson Review** for the separate review marker.

The element IDs, event handlers, score calculation, attempt history, best-score preservation, lesson gates, and unit gates were not changed.

Unit 01 keeps its custom lesson architecture; its existing wrapper already normalizes the same student-facing action language after native rendering.

### Source integrity

All files changed in this repair were parsed before commit. No question bank, answer key, video record, game placement, unit map, assessment bank, project, mastery threshold, or learner record schema was rewritten.

### Browser-level follow-up

A final human/browser smoke test is still recommended for one early lesson, one middle lesson, and one late lesson on desktop/tablet/phone, including profile switching after reload, 79% and 80% attempts, retry, print, export, game/video launch, and offline revisit. This is a runtime presentation check, not a known source defect.


## Mathematics-wide dashboard component parity

Pre-Algebra participates in the shared landing/dashboard component pass through `../assets/math-dashboard-parity-v1.css`.

The pass standardizes Academy-first title hierarchy, hero proportions, lighter typography, 7 px controls, dashboard metrics, card depth, unit and lesson navigation, status presentation, support/tool cards, responsive behavior, and white print evidence while preserving this course's existing layout identity.

The shared layer is cached by this course's service worker for offline use. No mastery authority, score calculation, question bank, assessment engine, learner record, course gate, project, lab, or curriculum file was modified as part of this component-parity pass.

Khaemenes Mathematics upgrade sequencing policy: shared upgrades are applied to Pre-Algebra, Algebra I, Geometry, and Algebra II before the next upgrade category begins.


## Mathematics-wide student journey status pass

Pre-Algebra now participates in the shared read-only student journey layer through `../assets/math-student-journey-v1.js` and `../assets/math-student-journey-v1.css`.

The course home summarizes the learner's current unit, current lesson, latest available attempt, best mastery evidence, next requirement, gate state, and one primary **Continue Learning** action. The summary reads the course's existing learner-scoped evidence and authoritative progression rules; it cannot write scores, award mastery, or bypass gates.

Where a true latest-attempt value is not stored, the interface shows an em dash rather than substituting the best score. Geometry weekly boundary gates, cumulative Midterm gates, Algebra II readiness, and course-specific unit mastery remain intact.

The shared journey assets are cached for offline course-home use.
