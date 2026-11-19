# 2026-11-19 · Restore minimalist course entrances, preserve lessons, and reconnect Class routes

**Mode:** protected GitHub recovery branch; no merge, no production alteration, no learner-record writes.

**Branch:** `recovery/minimal-landings-student-lesson-routing-20261119`

## User's governing distinction

- Public course landings are compact course introductions, **not lesson engines**.
- Full course dashboards, unit pages, 97 Pre-Algebra / 87 Algebra I / 90 Geometry canonical lesson-adapter pages and 92 native Algebra II lessons are separate.
- Student Profile > Schedule > Class must route to the student's current authorized lesson, diagnostic or instructional step; a minimalist landing page is not an acceptable fallback.
- Preserve native scoring, lesson gate ownership, assessment firewall, learner identity, and recorded work. Never resolve by a repository-wide rollback.

## Historical minimalist source recovery

Historical minimalist sources were read from individual course history, then copied into this recovery branch with 2×2 course access:
- Pre-Algebra: original minimalist revision `2f57698fd0f115f23bd7f72bbacc5063b4fcfd7a`.
- Algebra I: original minimalist revision `5325d907b010e7`.
- Geometry: original minimalist revision `b45da6665d384d`.
- Algebra II: original minimalist revision `d4d4257d5ee9d4`.

Each original rich `index.html` was preserved byte-for-byte before replacement as sibling `course-workspace.html` in its course directory. Baseline Git blob identities:
- Pre-Algebra: `5d0722d3faca666cf86a7d8f82f02fb1be791a0b`
- Algebra I: `f2a2aa949151e9b7df370b3e1750f3f1181c4521`
- Geometry: `fadcc34d655adceddf1682abc9fcb056b210d190`
- Algebra II: `f3f92be65cdc51ff9724741028523c196f00f2a8`

The minimalist landing provides direct links to the preserved full workspace, readiness diagnostic, Unit 01, and assessment hub; secondary links lead to student/parent profiles. The expected minimalist stylesheet and existing universal header/ticker/toolbars remain. Lesson and assessment source contents were not replaced.

## Student Class routing

- Grade 09: `student-course-registry.js` now defaults Pre-Algebra continuation to the existing diagnostic instead of the course landing and admits stored Pre-Algebra continuation only on an explicitly instructional route.
- Grade 09: `student-schedule-bar.js` no longer makes `Class` link to a course home when no valid instructional step is known. Missing routes are explicitly labelled under verification rather than secretly redirecting.
- Grades 10–12: `grade09-blueprint-upper-grade.js` no longer falls back from missing current step to the course home. Known next-step snapshots and direct first-step/diagnostic routes remain; unresolved routes are held.
- These code changes do **not** award mastery, modify pin selections, or write new learner-state keys.

## Source and CI proof

- `tools/validate-math-minimal-landing-lesson-boundary.mjs` enforces minimal page structure, four direct entry targets, exact preserved workspace Git blobs, existing Unit 01 instructional files, and absence of class-home fallbacks.
- `.github/workflows/minimal-math-lesson-boundary-recovery.yml` performs Node syntax checks on Grade 09 and 10–12 routing owners and the focused source contract; branch run `44634326563` PASS.
- The Mathematics Engine lesson-shell integrity workflow passed on the branch at `44634017748`, confirming the three certified adapter rollouts were not modified.
- Algebra I's legacy launch and first-draft validation were adjusted on the branch to inspect the preserved `course-workspace.html` for detailed course navigation and gates, and `index.html` for minimal doorway. Course gate assertions were retained rather than removed.
- Unit and lesson linkage does **not** establish actual browser rendering or current-lesson provenance. Browser acceptance HOLD.

## Independent defects and release holds

- Pre-Algebra component hash validation reports three mismatches in assessment/administration/certificate files. No assessment or certificate bytes were changed or re-sealed to hide the mismatch.
- Geometry strict release validation reports JavaScript syntax errors in `assets/assessment-engine.js` and `assets/unit-assessment-engine-v3.js`. These are independent of the minimalist landing restoration and require separately gated diagnosis.
- Full Upper Grade Class progression needs learner-scoped browser tests, including unknown/stale/valid snapshot routes. No unverified learner records were used.
- Check deployment and availability of workspace relative assets, script initialization, offline worker cache and desktop/tablet loading before promoting the branch.
- No browser tests performed; no production merge or release authorized.

## Release decision

**HOLD:** Do not merge the branch or claim full recovery until the independent failures and browser validation are resolved. Preserve all snapshots and source history; do not re-run broad revert operations.
