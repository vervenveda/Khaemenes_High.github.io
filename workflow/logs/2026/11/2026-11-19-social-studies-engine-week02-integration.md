# Social Studies Lesson Engine — Week 02 Integration
Date: 2026-11-19 · Repository: vervenveda/Khaemenes_High.github.io
Change class: curriculum-specific presentation and navigation only

## Scope
User authorized **one week at a time** following successful source-level Week 01 integration. This batch is Week 02 only, across Grade 09 Global Studies, Grade 10 U.S. History, Grade 11 Government/Law/Economics, and Grade 12 Global Politics/Senior Research. No Week 03 or later packet touched.

## Curriculum mapping (verified against authentic Week 02 source packets)
- Grade 09 · **Geography and Human Systems**: location/scale, projection tradeoffs, migration/spatial pattern evidence, environment-versus-agency and geographic determinism, Week 02 evidence argument and mastery.
- Grade 10 · **Indigenous Nations, Atlantic Encounters, and Colonization**: Indigenous agency and sovereignty, charters/covenants/Native diplomacy, regional historical geography, comparison of competing evidence/interpretations. Both live Week 02 paths exist and were patched: `grade-10/week-02/student-packet.html` and `grade-10/weeks/week-02/student-packet.html`. They are distinct original files, not assumed aliases.
- Grade 11 · **Philosophical Foundations of Government**: intellectual traditions, natural rights, common law, Enlightenment ideas, documented influence vs superficial resemblance, evidence-grounded civic argument and original correction.
- Grade 12 · **Evidence, Methodology, and Academic Integrity**: researchable questions, source provenance, methods, reproducibility, integrity agreement, verified dossier and original capstone checkpoint.

## Source implementation
- `courses/shared/social-studies-lesson-engine-v0.1.js` contains new WEEK02 course-specific guidance. It identifies only native `week-02/student-packet.html` or `weeks/week-02/student-packet.html` routes. Grade 09 Week 01 continues using the **original day/phase controller**; Grade 09 Week 02 and Grades 10–12 use their verified native five daily `h3` lesson sections. No required headings => engine fails open, original lesson remains intact.
- Each of the five real Week 02 packet files received **only** a `data-social-studies-engine` opt-in attribute and one versioned script tag. No body content, assessments, questions, source studies, or evidence forms rewritten.
- The four previously integrated Week 01 packets and workflow demonstration updated to the same versioned shared script `20261119-social-studies-week02-v3` for cache coherency.
- `tools/test-social-studies-lesson-engine-v0.1.mjs` upgraded for latest engine and `tools/test-social-studies-week02-engine.mjs` added to validate all five packet paths, 25 native daily headings and no new persistence.
- `.github/workflows/social-studies-lesson-engine-pilot.yml` now monitors both weeks and runs both source tests.

## Source verification
After commits, fetched the shared engine, original Grade 09 Week 01, five Week 02 packet files and regression files from GitHub. Confirmed:
- Shared engine parses as JavaScript.
- Grade 09 Week 01 still has required entry gate, day/phase nav and matching script import.
- All five Week 02 files import the new engine version and have grade-scoped opt-in.
- The 5 Monday–Friday headings are present in **each** packet (25 total) and are matched by the engine's native heading selectors.
- Existing formative evidence owner references remain intact.
- Engine is restricted to presentation and a temporary ungraded scratchpad; no independent record saving, question scoring, or mastery unlock.

## Remaining holds
- The automated GitHub Actions jobs were committed, but no actual successful workflow run was observed in this session.
- No logged-in synthetic-student browser test, print evaluation, screen reader test, portrait/landscape tablet acceptance, or offline cache validation was performed.
- Grade 10 has two original Week 02 packet routes; both were updated to maintain link consistency, but the canonical ownership between them requires a separate audit before any consolidation.
- The research-specific Grade 12 assignment and required integrity agreement remain owned by existing course; engine cannot award that completion.
- **Do not automatically extend to Week 03.** Inspect next week's actual source packets and evidence owners individually before each week's rollout.

## Commits
Shared engine `fa76570`, compatibility correction `4747aa1`; Week 02 packets `596b79e`, `19789ef`, `1c160dd`, `e7be8b6`, `228e4b7`; Week 01 loader refreshes `47e8cb8`, `4fd427e`, `dbf0625`, `82cedfb`; Week 02 regression `3244af3` and `f277abc`; old regression update `1da2392`; CI `b25e739`.
