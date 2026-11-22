# Khaemenes Science Lesson Engine — Research-Informed Prototype v0.1

**Program:** Verve N Veda / Khaemenes Academy · Science 9–12  
**Pilot:** Integrated Science 9, Unit 01, Day 01 — *From Phenomena to Questions*  
**Date:** 2026-11-19  
**Status:** Pilot mounted on Science 9 Day 01; expansion HOLD pending browser and instructional acceptance

## Purpose
Science requires a distinctive learning experience. Students should **retrieve, observe, predict, learn, model, investigate, support claims with evidence, revise, and retrieve again**. The prototype adapts our existing Mathematics and English lesson-engine principles without replacing authentic Science content or assessments.

## Research foundation (design principles, not a claim that seven is an optimal number)
- National Academies, *A Framework for K–12 Science Education*: science and engineering practices, core disciplinary ideas, crosscutting concepts; https://nap.nationalacademies.org/catalog/13165/a-framework-for-k-12-science-education-practices-crosscutting-concepts
- National Academies, *Science and Engineering for Grades 6–12: Investigation and Design at the Center*: coherent investigation and explanation; https://nap.nationalacademies.org/catalog/25216/science-and-engineering-for-grades-6-12-investigation-and-design-at-the-center
- Institute of Education Sciences, *Organizing Instruction and Study to Improve Student Learning*: spaced review, retrieval with feedback and connection of representations; https://ies.ed.gov/ncee/WWC/Docs/practiceguide/20072004.pdf
- National Research Council, *America's Lab Report*: integrate laboratory experience with science learning goals; https://nap.nationalacademies.org/catalog/11311/americas-lab-report-investigations-in-high-school-science
- Mayer & Moreno, cognitive load and multimedia-learning research: chunk, signal, align relevant visuals with explanation; use primary publications when determining production behavior.

These principles motivate the architecture; the number and order of panels must be evaluated with learners.

## Seven instructional stages
1. **Recall & Prepare** — activate prior knowledge, objectives and materials
2. **Observe & Predict** — observable phenomenon separated from assumed explanation
3. **Learn & Model** — explicit teaching, investigable questions and operational definitions
4. **Guided Investigation** — match the research question to an ethical evidence method
5. **Evidence Investigation** — assess sufficiency and uncertainty; simulated dataset reasoning with immediate explanatory feedback
6. **Explain & Revise** — Claim, Evidence, Reasoning, limitations and portfolio evidence
7. **Reflect & Retrieve** — exit reflection, optional retrieval prompt and original course completion button

### Specialized science features
- Fictional paper-helicopter dataset: three short-wing and three long-wing descent-time examples. The prototype explicitly labels these as invented data; it tests whether a student overclaims causation.
- Optional ungraded CER writing fields: Claim, Evidence, Reasoning, Limitation. These are in-memory only, not submitted or persisted.
- Original Atlas and Question & Evidence Studio links, vocabulary integration, mentor prompt and portfolio instructions remain in the original lesson source.
- Safety panel must remain visible regardless of selected stage; no real experiment is authorized by the prototype.
- Section progress means **visited stages** only. It never constitutes achievement, evidence submission, grade, mastery or 80% unlock.

## Ownership and implementation firewall
- **Instructional page:** existing `courses/science/integrated-science-9/units/unit-01/lessons/day-01.html` remains the sole authoritative lesson body.
- **Reusable presentation controller:** `courses/shared/science-lesson-engine-v0.1.js`; one script, no dependencies, idempotent mount; activated only on a page with `data-science-engine="science9-u01-d01"`.
- **Workflow demonstration:** `workflow/engines/science/science-lesson-engine-prototype-v0.1.html`, a synthetic demonstration with a disabled course-completion button.
- **Chrome:** existing official tickers, header, right toolbar, and lower-left tools retain exclusive authority. No duplicated shell, no global CSS rewrite, no novel injected toolbar.
- **Mastery:** course's original `unit01.js` and existing assessment, grade and learner authority unchanged. The native `data-page-complete="day01"` action remains original.
- **Persistence:** no engine localStorage, sessionStorage, indexedDB, cookies or network writes. In-memory CER notes are lost on reload. Existing student-owned evidence storage is unmodified.
- **Failure mode:** if selectors or sections mismatch, engine does not mount; the original lesson is still visible. Styles apply only under the `science-engine-on` class and are not loaded elsewhere.
- **Printing:** show original lesson sections, including work students want to print; the prototype control bar is removed in print.
- **Accessibility:** text-based and keyboard-usable controls, visible focus outline, accessible section status; 16 px minimum control text and 7 px radius.
- **Offline:** no new remote runtime assets; the small controller is a local repository script. Full offline certification depends on existing service worker and deployment behavior.
- **Evaluation:** seven stages are testable instructional scaffolding, not authoritative curricular grading.

## Acceptance tests before Grade 9 broad rollout
1. Run `node --check courses/shared/science-lesson-engine-v0.1.js`.
2. Run `node tools/test-science9-lesson-engine-prototype.mjs`.
3. In a clean signed-out browser: open the workflow demonstration and confirm each stage works; no grade or learner data writes.
4. In an authorized synthetic learner profile: open the actual Science 9 Unit 01 Day 01, confirm original safety note is always visible, stage transitions preserve lesson headings and interactive evidence audit, existing Mark Lesson Complete remains course-owned, and no duplicate tickers/header/toolbars appear.
5. Test original page without JavaScript (fallback), printing, tab navigation, focus, screen readers, portrait and landscape tablet widths, long responses and low bandwidth.
6. Verify canonical continuation and readiness gate: the pilot must not change diagnostic, unit gating, historical learner submissions, or source dossier evidence.
7. Record instructor and student feedback on cognitive burden and scientific reasoning before considering Day 02 or additional units.

## Do not expand automatically
Science 9 contains multiple unit-specific lesson engines and laboratory boundaries. The present script maps only the verified Unit 01 Day 01 headings. **Do not auto-mount it across other lessons** by copying script tags or guessing sections. Adapt once the pilot has verified safety and content parity.

## Current status
Code and documentation committed to GitHub. JavaScript syntax was checked on authored source before commit. GitHub Actions conclusions, browser rendering, learner-specific functionality, and mobile acceptance still require independent verification.


## Curriculum hardening update — 2026-11-22

The Unit 01 Day 01 pilot now treats the Science A+++ daily lesson contract as an engine-level acceptance target, not only a presentation sequence.

Added to the pilot contract:
- explicit essential question;
- six-term inquiry vocabulary module with retrieval;
- Observe → Predict → Test writing scaffold;
- quantitative fictional dataset example with units, means, comparison and accessible graph;
- four feedback-enabled reasoning checks;
- canonical Lesson 01 evidence rubric synchronized with `teacher-resources/science/unit-01/UNIT01_RUBRICS.md`;
- rubric ID `sci9-u01-d01-evidence-v1` for drift detection.

The engine still does not award grades, write mastery, replace learner-scoped evidence, or own the Unit 01 record. Human review and existing Unit 01 mastery authority remain canonical.
