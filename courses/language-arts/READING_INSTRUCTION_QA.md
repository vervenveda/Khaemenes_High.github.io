# Khaemenes Academy · English 9–12 Reading and Instruction Audit

**Audit date:** 2026-10-16  
**Repository:** `vervenveda/Khaemenes_High.github.io` · `main`  
**Purpose:** Preserve upgraded course content while improving reading depth, teacher modeling, source access, evidence quality, and learner continuity.

## Course-wide inventory and interpretation

| Course | Weekly classrooms | Individually isolated teaching pages (baseline) | Daily instruction inside weekly classrooms | Curriculum structure |
| --- | ---: | ---: | --- | --- |
| English 9 | 36 | 65 across Weeks 01–13 | Strongly developed early; subsequent weeks mainly weekly pages | 12 units, 36 weeks |
| English 10 | 36 | 5 in Week 01 | Five structured instructional sections per week | 12 units, 36 weeks |
| English 11 | 36 | 5 in Week 01 | Five structured instructional sections per week | 12 units, 36 weeks |
| English 12 | 36 | 5 in Week 01 | Five structured instructional sections per week | 12 units, 36 weeks |

**Interpretation:** A lack of standalone day files is not proof of an absent day lesson. Upper-English weekly pages include five day sections; grade 9 has an extensive first 13 weeks of isolated daily studios. Retain their canonical pages, lesson data, and course state rather than cloning them. Existing student evidence belongs in the course's weekly and portfolio records.

## High-priority findings

1. **Reading depth varies more than course outlines suggest.** A unit home can contain a very short original microtext, while its week plan requests sustained literary or rhetorical analysis. Some units expect full-length or teacher-approved works not contained in the unit's short passage. Instruction must not falsely label a practice microtext as an adequate substitute for a full play, major speech, poetry collection, or novel.
2. **Genre–objective mismatch can be easy to miss.** Before this pass, English 9 Unit 05 focused on drama yet provided a very short poetry reading; English 11 Unit 05 emphasized rhetorical argument while its attached microtext concerned poetic ambiguity; English 12 Unit 05 emphasized argument and media verification while its attached microtext featured an open-ended literary scene. Keep those original assets as related materials, but add genuinely aligned reading.
3. **Different grades have different lesson-entry architectures.** English 9's first 13 weeks have individual day folders; English 10 has Week 01 studios; English 11 and 12 have Week 01 deep-instruction pages. A shared approach must preserve existing daily routes and supply support where weekly-only instructional pages are still canonical.
4. **Substantive reading requires explicit analytical teaching.** A reading assignment should include accessible text or a precise approved-source route, sufficient length for the objective, genre/context discussion, an annotated worked model, guided and independent responses, a misconception or interpretation check, formative feedback, and teacher notes.
5. **Original and invented sources must remain distinguishable.** Fictional historical-style documents, mock policy evidence, and simulated datasets are effective for practicing analysis, but they may not be presented as authentic archives, real municipal data, or independent corroboration.
6. **Assessments and records are not to be replaced by reading companions.** English 10–12 have canonical five-item weekly quizzes, separately weighted course assessments, learner-specific records, recovery behavior, and score integrity checks. Existing curriculum-quality tests cover 108 English 10–12 weeks, canonical/browser lesson parity, answer rotation, and applied quiz prompts. A reading self-check is formative, not automatically a new official grade.
7. **Offline consistency matters.** English 10–12 have dedicated service workers and course data caches. New reading dossiers must be precached with their shared stylesheet and cache version advanced. English 9 currently does not have the same course service-worker arrangement; offline access requires previously available local material or deliberate cache planning.

## Repairs delivered in this pass · Unit 05 / Weeks 13–15

| Course | Focus of added extended dossier | Path from course root |
| --- | --- | --- |
| English 9 | Three scenes: blocking, conflicting duties, character evidence, alternate staging | `units/unit-05/reading-dossier.html` |
| English 10 | Two opinion pieces, a quantitative policy dossier, and an ethical debate | `units/unit-05/reading-dossier.html` |
| English 11 | Rhetorical address, competing arguments, fictional contemporaneous writer comparison | `units/unit-05/reading-dossier.html` |
| English 12 | Argument warrants, fair counterclaims, missing follow-up data, verification of a misleading chart | `units/unit-05/reading-dossier.html` |

Each extended dossier includes **three complete source sets**, linked directly from the existing Unit 05 home and Week 13–15 pages, with explicit reading guidance, a worked close-reading model, independent tasks, teacher notes, and a formative check with a model answer. **Total: 12 reading sets and 12 low-stakes model responses.** The original unit microtexts remain intact.

For English 9, the new scenes reinforce dramatic interpretation but do not displace the longer assigned `Antigone` or `Julius Caesar` selection. For English 11, fictitious period-style writing is identified as invented rather than authentic historical material. For English 10 and 12, illustrative figures are labeled fictitious and are not presented as real survey or town data.

English 10, 11, and 12 service workers now precache their Unit 05 dossier and the shared stylesheet; existing offline curriculum assets remain listed.

## Acceptance criteria for future unit hardening

- All three weeks of the unit have a topic-matched reading source or a reliable, clearly specified literature selection.
- A student can reach the relevant reading in one click from the weekly classroom and return to the correct daily work.
- The text supports a **real close reading**, not merely a generic prompt that cannot be answered from the source.
- Evidence questions distinguish observation, citation, inference, reasoning, counterreading, and limitations at the grade-appropriate level.
- Each weekly selection contains an explanatory worked model, demanding independent writing, and actionable teacher guidance.
- Source labels clearly distinguish original fiction, public-domain authentic texts, simulations, and external research.
- No new reading companion edits quiz grades, pins, portfolio content, mastery progress, or learner identifiers.
- Local links, offline caches where available, keyboard navigation, print presentation, and responsive 7px-radius UI are checked.
- Existing upgraded lessons are left untouched unless an actual regression or content error is verified.

## Recommended subsequent sequence

**Next pass:** audit and strengthen **Unit 06 / Weeks 16–18** across English 9–12, paying particular attention to actual reading selections, instructional modeling, and midterm boundaries. Afterward prioritize other units where source genre or length does not support their stated assessments. Follow with a full grade-by-grade media/source authenticity and writing-rubric check, then end-to-end student switching and offline beta testing.

**Verification:** `node tools/validate-english-unit05-reading.mjs`, the existing `tools/validate-ela-curriculum-quality.mjs`, the English 9 and 10 daily-lesson validators, route validation, learner record integrity checks, and GitHub Pages deployment.

This is **the completed Unit 05 alignment pass and a course-wide risk inventory**, not a claim that every source in all 144 weekly classrooms has been substantially rewritten or professionally reviewed.
