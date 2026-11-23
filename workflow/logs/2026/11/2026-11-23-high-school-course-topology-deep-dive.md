# High School Course Topology Deep Dive — 2026-11-23

## Scope
Repository-wide topology audit of Khaemenes High course ownership after Math/Science retired-engine purge.

## Canonical course families
Core registered families:
- Mathematics
- English / Language Arts
- Science
- Social Studies
- Physical Education
- Senior Capstone

Additional course/elective topology:
- courses/electives/career-professional-studies
- courses/electives/computing-digital-technology
- courses/electives/fine-arts-visual-studio
- courses/electives/health-wellness-human-development
- courses/electives/music-music-theory
- courses/electives/world-languages-linguistics
- separate top-level electives tree containing Psychology 101 and older elective routing

## Strong topology
- Mathematics: canonical placement-based specialist engines; Precalculus/Calculus remain explicit Higher Learning handoffs.
- Science: current engine ownership cleaned; retired shared/pilot engines removed.
- English: four canonical course roots with specialist course assessment ownership.
- Social Studies: four grade roots and explicit course ownership.
- Senior Capstone: registered specialist course.
- Public entry route validation is green.
- Dependency crawl is green after Science legacy purge.

## Structural inconsistencies
1. High School learning registry covers 16 core courses but omits PE, Capstone, elective families and Psychology.
2. Course execution matrix covers 22 entries but omits Grade 9 PE, elective families, Psychology and Technology preview.
3. Two elective roots coexist: canonical-looking courses/electives/ and older top-level electives/.
4. Grade-specific compatibility/preview pages exist outside course roots, including Grade 10 Algebra I compatibility doorway and Grade 10 Technology under-construction page.
5. courses/shared/shared/ remains a suspicious nested shared layer requiring classification as canonical/compatibility/archive.
6. Learning registry formative counts remain stale at 1482; current measured core surfaces are 1484.
7. Grade-aware execution matrix CI and repository route CI still fail later tests for stale validator assumptions even though public routes and dependency crawl pass.

## Authority HOLDs
- Social Studies 9–12: portfolio publisher pending verification.
- PE 10–12: portfolio publisher pending verification.
- Precalculus/Trigonometry and Calculus I: cross-repository authority/persistence/completion holds are intentional Higher Learning boundaries.

## Topology verdict
Core Math and Science are suitable as architectural reference families. Repository-level course ownership is not yet fully normalized because elective, Psychology, PE Grade 9, Technology preview, and compatibility/federated routes are represented in multiple registries or not represented at all.

## Recommended next five bubbles
1. Create a canonical High School Subject/Course Ownership Manifest that supersedes scattered registry assumptions.
2. Reconcile courses/electives/ vs top-level electives/ and designate one canonical elective root.
3. Register PE Grade 9, Senior Capstone, Psychology and all active elective families in the canonical manifest/matrix.
4. Classify and reduce grade-level compatibility routes and under-construction course previews so they never appear to own curriculum.
5. Purge or formally classify nested shared/shared and stale registry/validator assumptions; make counts manifest-derived instead of hard-coded.
