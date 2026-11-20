# Social Studies Lesson Engine · Weeks 04–36 Source Integration
Date: 2026-11-19 ET
Repository: vervenveda/Khaemenes_High.github.io
Status: Source integration committed, runtime/CI validation pending, one original packet missing

## Mandate and boundaries
User authorized completing Social Studies Engine integration to the **end of each course**, following the first three week-by-week curriculum pilots. These four original High School Social Studies courses end in **Week 36**, not Week 42. Repository source queries returned no Week 37 packet under standard Grade 9–12 course directories.

No subject content, historical sources, assignment rubrics, quiz answers, grade records, mastery thresholds, native learner evidence storage, Academy header, tickers or Vervenveda gateway changed. Grade 9 Week 01 retains its 20 native Read/Practice/Write/Check activities. Weeks 02 and 03 retain previously authored specialized inquiry guidance.

## Actual 36-week source census and exception
Unique grade-weeks expected: 36 × 4 = **144**.
Existing student packet coverage integrated: **143/144 unique grade-weeks**.
Original HTML packet files targeted and integrated: **178** (Grade 10 holds separate direct `week-NN/` and `weeks/week-NN/` paths from Week 02 onward).

**HOLD: Grade 09 Week 27.** `courses/social-studies/grade-09/weeks/week-27/student-packet.html` is absent in the source repository. Also checked the alternate `grade-09/week-27/student-packet.html`, `weeks/week-27/index.html` and `weeks/week-27/student-packet/index.html` without finding the course material; repository keyword search gave no matching result. Nothing was invented or created to occupy that path. Grade 9 therefore cannot be represented as 36/36 yet.

## Engine architecture v0.1
Canonical owner: `courses/shared/social-studies-lesson-engine-v0.1.js`.

For **Weeks 04–36**, the engine reads the actual week from the existing packet URL, verifies `body[data-social-studies-engine]` matches that course grade, and derives the **five original Monday–Friday heading targets** from the current page. It reads the existing H1 title, original essential question where identifiable, and an original lesson objective/description when present, while preserving four grade-specific inquiry focus labels. The engine refuses to mount if the five ordered daily headings are missing or ambiguous. It never creates parallel content, submits forms, unlocks mastery, or manages evidence storage.

A source-audit correction was needed: some Grade 9 weekly packets put five `h3` daily tasks in **one `section.card`**. The adapter now navigates to the actual `h3` itself for later weeks (and Grade 9 Week 02–03), rather than relying on unique parent cards. This preserves the full original packet.

The optional Source Analysis & Corroboration scratchpad is temporary, explicitly ungraded, and outside learner persistence.

## Changes committed
- Shared engine new source-derived Weeks 04–36 adapter: `848a5a4`; Grade 9 shared-card correction: `451910a`.
- Original packets Weeks 04–36: each existing file was fetched and validated before a **minimal two-element edit**, a grade opt-in attribute and one versioned engine import (`20261119-social-studies-complete-v5`). Batches ran sequentially, covering Grade 09 except the absent Week 27, Grade 10 dual routes, Grade 11 and Grade 12.
- Week 01–03 packet script versions refreshed to the same shared owner. No lesson data altered.
- Previous Week 01–03 regression tests refreshed for the new engine source.
- New `tools/test-social-studies-full-course-integration.mjs` to validate all 144 grade/weeks, dual Grade 10 routes, 178 source files, 885 native weekday headings outside the special Grade 9 Week 01 phase player, formative evidence references, the 36-week capstone routes, and the explicit Grade 9 Week 27 HOLD.
- `.github/workflows/social-studies-lesson-engine-pilot.yml` now watches all Social Studies student-packet files and runs the full-course source check.

## Source checks completed
During the live GitHub connector integration, **each committed Week 04–36 file** was inspected for five correctly ordered Monday–Friday headings, its original `high-school-formative-evidence-v1.js` script, and a single `<body>`; sources with structural mismatches were not overwritten. No such mismatch was observed on existing files; the Grade 9 Week 27 file was not present.
The shared engine JavaScript passed parsing via `new Function`. Representative Grade 9, Grade 10, Grade 11, Grade 12, review Week 18 and capstone Week 36 HTML were inspected for their native lesson structures. This is **source-level validation**, not a confirmed execution of GitHub Actions.

## Release holds and next repairs
1. **Restore or develop Grade 9 Week 27 from approved curriculum evidence**, without guessing its source text. Only then integrate the engine and revise the coverage test to 144/144.
2. **CI workflow conclusion**: confirm that GitHub Actions successfully executed source tests, rather than assuming a committed workflow means a passed run.
3. **Authenticated browser QA**: inspect grade-specific navigation, Grade 9 Week 01 original day/phase behavior, Grade 9 later shared-card scrolling, learner gate, saved evidence, print, screen-reader and keyboard operation, and tablet portrait/landscape.
4. **Production deployment**: confirm the GitHub Pages build includes the shared engine and packet HTML; this has not been independently verified.
5. Course-specific assessments, midterms, finals, civic capstones, senior thesis and oral defense are not replaced or graded by this navigation engine.

## Explicit release status
**Source-integrated: 143 of 144 grade-weeks.** 
**Missing course source: Grade 09 Week 27.**
**GitHub Actions PASS: unverified.**
**Live browser/learner flow PASS: unverified.**

## Final alternate-route reconciliation · 2026-11-19

A further forensic check discovered previously uncounted original packet variants:
- Grade 10 `courses/social-studies/grade-10/weeks/week-01/student-packet.html` is a genuine second Week 01 packet and now uses the engine.
- Grade 09 `courses/social-studies/grade-09/week-NN/student-packet.html` contains genuine alternate (older) lesson packets for **30 weeks**, now also integrated with the same grade-specific engine. These legacy packets do **not** have the newer `high-school-formative-evidence-v1.js` module, so no existing evidence owner was invented or added there.
- Grade 09 direct Week 01, 06, 07, 09, and 10 are canonical **redirect-only** compatibility pages; preserved untouched because their canonical destinations already include the engine.
- Grade 09 Week 27 remains absent in both direct and nested directory layouts.

**Revised and authoritative physical-file census:** 143 of 144 distinct grade/weeks covered; **209 genuine instructional HTML packets integrated** (replacing the earlier 178 estimate), **1040 original Monday–Friday headings** outside the Grade 09 Week 01 phase player, and five intact Grade 09 redirect pages. The Grade 10 alternate Week 01 and 30 older Grade 09 packets account for the 31 additional actual lesson files.

`tools/test-social-studies-full-course-integration.mjs` has been revised to make this distinction and fail on missing or duplicate lesson controls. This corrects the earlier source-census estimate; it does not certify the GitHub Actions or authenticated browser result.

**Release hold remains:** Grade 09 Week 27 course source missing; browser, learner storage, accessibility and workflow run PASS still unverified.


## RESOLVED — Grade 09 Week 27 recovered from authoritative existing source (2026-11-20)

**This section supersedes every earlier Week 27 missing/HOLD statement above.**

The canonical Grade 09 `courses/social-studies/grade-09/app.js` explicitly uses `weeks/week-27/student-packet-v2.html` for Week 27. The original **Student Packet v2** was located and inspected at that path. It is not missing or an invented replacement. Original course-data.js confirms its approved topic **Capitalism, Socialism, Labor, and Reform**, Unit 6; essential question: *What should markets, governments, employers, workers, and communities each control?* Its original five weekday activities, source laboratory, economic reasoning lab, assessment v2.0, and evidence authority remain intact.

Recovery changes:
- Shared lesson engine now accepts the exact historical filename `student-packet-v2.html` as well as standard `student-packet.html` within approved Social Studies grade/week routes.
- Real Grade 9 Week 27 `weeks/week-27/student-packet-v2.html` opted in using the existing shared engine, with no curriculum rewrite or record/grading ownership changes.
- Standard `weeks/week-27/student-packet.html` and alternate `week-27/student-packet.html` are **redirect-only compatibility doorways** to that original v2 packet. Their old URLs now lead to the authoritative file.
- `tools/test-social-studies-full-course-integration.mjs` now expects **144/144 unique grade-weeks**, **210 genuine instructional HTML packet files**, **1,045 native weekday headings** outside the original Grade 9 Week 1 20-phase player, and **7 intentional compatibility redirects**. The test verifies that course app.js and course-data.js still identify the v2 original and that Week 27's original content/evidence contracts exist.

Focused post-commit connector verification confirms: shared JS parses, exact v2 route recognized, five Week 27 day headings preserved, original assessment and economic lab intact, both redirect URLs correct, course app and data ownership unchanged, no new engine persistence. **Actual GitHub Actions successful conclusion and authenticated browser acceptance remain unverified.**

The old missing Week 27 finding was a filename-discovery false alarm, now resolved without recreating teaching material.
