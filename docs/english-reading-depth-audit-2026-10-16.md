# Khaemenes High · English and Language Arts Reading-Depth Audit
Updated: 2026-10-16. Scope: repository `main`; English 9–12, prioritizing Unit 01 / Week 02. This is a curriculum and static-route audit, not a substitute for a teacher observing students.

## Existing strengths preserved
- **English 9:** 36-week plan, 12 units, and already isolated Week 02 Days 06–10, with original texts and its existing unit-reading and progress pathways. No wholesale replacement of these lessons.
- **English 10:** 36 weeks, 12 units, a weekly five-day classroom, an existing original text (*The Unfinished Map*) with a worked inference model, and an isolated Week 01.
- **English 11:** 36 weeks, 12 units, weekly five-day classrooms, unit reading, short original daily stories, and the five standalone Week 01 deep lessons.
- **English 12:** 36 weeks, 12 units, weekly five-day classrooms, unit reading, short original daily stories, and five standalone Week 01 deep lessons.

## Gap found
Longer reading assignments were not consistently identified or linked from the canonical curriculum metadata, Unit 01 assignments, and the five daily Week 02 lesson sections. Advanced courses in particular had short practice stories but weaker bridges to sustained source comparison. Rebuilding those originals would introduce duplicate progress paths; instead we extended the same reading spine.

## Repairs in this pass
1. **English 10 Week 02:** added original *A Route Drawn in Blue* and a simulated committee field note, with observation/inference/qualification instruction and five differentiated work prompts.
2. **English 11 Week 02:** added original *A Margin Full of Questions* and a fictional three-document source set to model provenance, ethical paraphrase, chronology, counterreadings, and historical humility.
3. **English 12 Week 02:** added original *A Label Revised in Pencil* and four fictional institutional sources for high-complexity analysis of records, testimony, missing survey information, and qualified synthesis.
4. Both `curriculum.json` and `assets/curriculum-data.js` name the actual assigned Week 02 reading. Unit 01 reading pages, weekly entry points, daily tasks, and the read-only dossiers interlink.
5. No grade calculations, quiz questions, learner identities, localStorage keys, mastery gates, or existing reading passages were replaced.

## Learning quality checks
Each new dossier supplies multiple texts with declared fictional status, an explicit teaching model, day-linked annotation and writing assignments, source evaluation, a misconception check, a model response, access scaffolds, and teacher criteria. Students return to the existing gradebook/portfolio authority. These are formative support readings, not authenticated historical documents or separate exams.

## Remaining curriculum priorities
- Extend text-based daily instruction across **Weeks 03–36** without overwriting isolated upgraded units; inventory teacher-vetted full-length works and licensing/availability before declaring them assigned.
- Revise repeated generic weekly quiz items in a controlled, versioned assessment migration **without invalidating scores already earned**; 36 weekly quizzes in English 10–12 currently include repeated task-format questions.
- Verify the quantity and quality of sustained literary, rhetorical, and informational reading across all 12 units per grade, including author/context diversity and level-appropriate demands.
- Audit and align rubric anchors, accessibility support, original sources, and teacher evaluation procedures across English 9–12.
- Run student beta tests for accessibility, fatigue, reading difficulty, offline caching, and persistence across learner changes.

## Automated guard
Run `node tools/validate-english-reading-sync.mjs`. CI workflow: `english-reading-sync-validation.yml`.
