# Khaemenes High · Social Studies versus Pre-Algebra Reaudit
Date: 2026-10-20
Scope: Compared actual source for Pre-Algebra's canonical index.html with Social Studies department and all four grade landing pages. This is a targeted structural/source audit, not a verified end-to-end browser test.

## Findings
Pre-Algebra is a mature ~153 KB interactive course home with visible Academy home identity, pinned profile, integrated Tools & Games menu, extensive lesson and assessment UI, student progress, export, mastery and an offline service worker. Grade 9 Social Studies currently has a ~7 KB navigation/pathway home, separate app and weekly packet, weekly vocabulary tool and local labs. Grades 10–12 already have large, self-contained course portals (~366–395 KB), mastery/progress/reader/assessment code, plus shared course-entry and learner-scope scripts. A blanket replacement with Pre-Algebra markup risks existing student records and should not be attempted.

## Consistency matrix
1. Academy-first title and clean course context — partial; bring Grade 9 and advanced pages under consistent header hierarchy without overwriting course engines.
2. Visible direct access to original practice and visual tools — now linked on grade 09, 10, 11, 12 home pages. The shared Visual Studio is separate, local, printable and JSON-exportable. Some older labs already exist.
3. Week-by-week lesson materials — existing, must be audited per week and not presumed missing.
4. Reader, source pack, print, export — grade-specific and variable; check actual student pathways before standardizing.
5. Vocabulary — explicit weekly practice in Grade 9, references in Grades 10–11, Grade 12 entry lacks obvious vocabulary label in source inspection. Audit per week for highlighted words + quizzes.
6. Mastery — references and engines present but need executable cross-grade tests of the 80% gate and separation between formative and certified scores.
7. Profile / learner identity — Pre-Algebra references canonical shared learner scope; Grades 10–12 load shared learner-scope scripts but have legacy student array and automatic 'First Student' creation in their page scripts. This needs a careful identity-boundary regression before modification.
8. 255px / accessibility / print — requires actual browser testing in each grade and multi-page printed record check.
9. Original visualization coverage — inventory established in VISUAL_LEARNING_AUDIT_2026-10-20.md; need actual 144-week lesson-specific crosswalk. Historical maps must have sourced dated boundaries and labels; avoid inventing geographic facts.

## Implemented in this pass
Inserted a compact, accessible link to the original Khaemenes Social Studies Visual Studio in each grade landing page. No assessment, lesson, score, learner profile, localStorage or existing scripts altered.

## Next implementation plan
A. Grade 9: model a Pre-Algebra-inspired student tools shelf, weekly stepper with clear 80% status labels, and open reading / locked graded progression, keeping the current readiness contract.
B. Grades 10–12: before any refactor, establish Playwright regression of persistence, imported evidence, grade switching, reader/print, 80% gates, page width 255px and student identity.
C. Visual coverage matrix for each week: documentary evidence, dated map, timeline, quantitative graph, comparison and activity; mark missing vs existing by checking actual unit content.
D. Original Academy sourced asset packs; complete maps/graphs with provenance and accessible text equivalents. Never equate original code with original historical source material.
E. Keep 36-week course architecture intact, no external classroom vendor embeds, original local HTML/SVG/CSS/JS and offline resilience.
