# High School Science Curriculum Certification Log

**Program:** Khaemenes Academy High School Science  
**Scope:** Grades 9–12  
**Audit generation:** v1  
**Established:** 2026-11-22

## Certification denominator

Repository tree verification confirms exactly **720 daily lesson destinations**:

- Grade 9 — Integrated Science: 180
- Grade 10 — Biology & Biotechnology: 180
- Grade 11 — Chemistry & Materials Science: 180
- Grade 12 — Physics & Engineering: 180

This inventory is the fixed denominator for the curriculum certification audit. File presence alone does not certify instructional quality.

## Common daily instructional contract

Each daily lesson is audited for visible evidence of:

1. phenomenon / observation / prediction
2. explicit scientific teaching
3. vocabulary
4. worked example
5. data, graph, model, table, or diagram reasoning
6. investigation / laboratory / simulation / engineering activity
7. guided or independent practice
8. misconception diagnosis or correction
9. retrieval / spaced review
10. constructed scientific explanation or CER
11. differentiation / scaffold / extended pathway
12. teacher or parent guidance / rubric
13. standards connection

Depth certification additionally requires an adequate visible instructional body and discipline-specific reasoning.

## Discipline-specific depth

### Grade 9 — Integrated Science
- cross-disciplinary systems/cause/energy/scale/stability reasoning
- evidence-quality and source-evaluation habits

### Grade 10 — Biology & Biotechnology
- structure/function or biological mechanism
- biological evidence across molecular, cellular, organismal, population, or ecological levels

### Grade 11 — Chemistry & Materials Science
- particle/atomic/molecular representation
- quantitative chemistry such as stoichiometry, concentration, energy, equilibrium, pH, kinetics, or dimensional reasoning

### Grade 12 — Physics & Engineering
- mathematical or graphical modeling
- engineering constraints, criteria, trade-offs, prototypes, or design decisions

## Additional forensic indicators

The audit separately measures:

- designated science-engine mounting
- vocabulary visibility
- inquiry/lab/design visibility
- CER / constructed evidence
- safety language
- uncertainty, error, limitations, precision, or evidence-quality language

## Interpretation rule

A missing source marker means an instructional element is not clearly visible in the daily page source. It does **not** automatically mean the underlying curriculum lacks that concept. This distinction is intentional so the audit can separate:

- curriculum missing
- curriculum present but not represented by the lesson engine
- curriculum represented but instructionally shallow

Browser interaction testing, scientific-answer verification, laboratory safety review, and human evaluation remain separate release gates.

## Current implementation

- Added `courses/science/tools/audit-high-school-science-curriculum-certification-v1.mjs`.
- Added `.github/workflows/high-school-science-curriculum-certification.yml`.
- CI preserves a machine-readable JSON certification artifact.
- Non-strict mode inventories and reports deficiencies without falsely declaring incomplete lessons complete.
- `--strict` is reserved for the later release gate when all 720 lessons are expected to satisfy the full depth contract.

## Current hardening order

1. Grade 9 — certify curriculum-to-engine representation and repair visible gaps.
2. Grade 10 — expand the verified Upper Science deep-lesson contract beyond the existing pilot/certified areas.
3. Grade 11 — strengthen quantitative and particle-model reasoning lesson by lesson.
4. Grade 12 — strengthen mathematical modeling and engineering-decision progression lesson by lesson.
5. Run the complete 720-lesson strict certification before A+++ release status.

## Running log

### 2026-11-22
- Re-audited four-year science topology.
- Verified the intended progression remains Integrated Science 9 → Biology 10 → Chemistry 11 → Physics & Engineering 12.
- Verified 180 daily lesson destinations per grade, 720 total.
- Established one common certification rubric with grade-specific depth criteria.
- Added repository audit tooling and CI workflow.
- Next hardening target: Grade 9 curriculum-to-engine representation, followed by Grade 10.


### 2026-11-22 · Grade 9 engine hardening pass 1
- Confirmed Science 9 had no canonical dedicated instructional engine file; Grades 10–12 use the separate shared Upper Science engine.
- Added `courses/science/integrated-science-9/science9-instruction-engine-v1.js`.
- Engine is presentation/contract-only and does not own mastery, storage, grades, evidence, routes, tickers, header, translator, or toolbar.
- Mounted the Science 9 engine in native/non-destructive mode on all 5 Unit 00 readiness lessons.
- Mounted the Science 9 engine in native/non-destructive mode on all 10 Unit 01 lessons.
- Verified representative first/last pages expose `data-science-engine="science9-v1"` and exactly one engine loader.
- Grade 9 canonical engine coverage has therefore moved from 0 known mounted daily lessons to 15/180 known mounted daily lessons.
- Next target: Unit 02 (Cells & the Organization of Life), followed by Units 03–12 in controlled batches, with depth gaps repaired as they are discovered rather than only adding engine markers.


### 2026-11-22 · Grade 9 engine hardening pass 2 — Unit 02
- Audited all 15 Unit 02 daily lessons (Cells & the Organization of Life).
- Confirmed existing pages are instructionally substantial, generally ~1,000–1,600 visible words, with strong evidence/investigation content.
- Identified recurring representation gaps rather than wholesale curriculum gaps: inconsistent explicit vocabulary, worked-example, misconception-repair, and retrieval sections.
- Mounted the canonical Science 9 engine on all 15 Unit 02 daily lessons in native/non-destructive mode.
- Added a topic-specific Unit 02 reasoning checkpoint to every daily lesson covering vocabulary, worked reasoning, misconception repair, retrieval, and explanation.
- Added explicit phenomenon/investigation reinforcement where the audit showed the clearest visibility gaps (including Days 12 and 15).
- Preserved all existing lesson content, mastery rules, assessment logic, evidence storage, and student routes.
- Verified representative Days 01, 08, 12, and 15 contain one engine loader, the Science 9 engine marker, the new reasoning checkpoint, and explicit curriculum-contract metadata.
- Grade 9 known canonical engine coverage is now 30/180 daily lessons.
- Next target: Unit 03 — Body Systems & Homeostasis.


### 2026-11-22 · Grade 9 engine hardening pass 3 — Unit 03
- Audited all 15 Unit 03 daily lessons (Body Systems & Homeostasis).
- Confirmed the unit is already substantial, with representative lesson bodies ranging from roughly 935 to 1,970 visible words and strong retrieval/evidence coverage.
- Identified the recurring certification gaps as explicit worked examples and misconception repair; several lessons also lacked a clearly labeled phenomenon/investigation frame or constructed-evidence language.
- Mounted the canonical Science 9 engine on all 15 Unit 03 daily lessons in native/non-destructive mode.
- Added a topic-specific Unit 03 reasoning checkpoint to every lesson with vocabulary, worked reasoning, misconception repair, retrieval, and explanation.
- Added explicit phenomenon/system-investigation prompts where visibility was weakest, including homeostasis, liver/glucose regulation, nervous coordination, and endocrine coordination.
- Strengthened explicit CER/evidence-revision representation on the integrated case-study and synthesis/mastery lessons.
- Preserved existing lesson content, assessment logic, mastery, evidence storage, and student routes.
- Verified representative Days 01, 07, 11, 14, and 15 contain the engine marker, exactly one engine loader, and the new reasoning checkpoint.
- Grade 9 known canonical engine coverage is now 45/180 daily lessons.
- Next target: Unit 04 — Cell Division, Reproduction & Inheritance.


### 2026-11-22 · Grade 9 engine hardening pass 4 — Unit 04
- Audited all 15 Unit 04 daily lessons (Cell Division, Reproduction & Inheritance).
- Found Unit 04 notably thinner than Units 02–03: most daily pages were roughly 590–805 visible words, with one laboratory lesson near 1,036 words.
- Existing strengths included vocabulary, retrieval, misconception work, and evidence prompts.
- Primary deficiencies were missing explicit phenomena, missing worked examples, inconsistent investigation framing, and limited explicit-teaching depth.
- Mounted the canonical Science 9 engine on all 15 Unit 04 daily lessons in native/non-destructive mode.
- Added a Unit 04 depth checkpoint to every lesson containing a phenomenon, expanded explicit teaching, a worked example, and an investigation/explanation prompt.
- Strengthened chromosome-number reasoning, DNA replication, mitosis/meiosis distinctions, ploidy, genotype/phenotype logic, Punnett-square probability, non-Mendelian inheritance, mutation, genetic technology, and synthesis.
- Preserved existing mastery, assessment, evidence-storage, navigation, and lesson content.
- Verified representative Days 01, 05, 10, 12, and 15 contain one engine loader and the full Unit 04 depth checkpoint.
- Grade 9 known canonical engine coverage is now 60/180 daily lessons.
- Next target: Unit 05 — Ecosystems, Evolution & Biodiversity.


### 2026-11-22 · Grade 9 engine hardening pass 5 — Unit 05
- Audited all 15 Unit 05 daily lessons (Ecosystems, Evolution & Biodiversity).
- Found the unit moderately thin compared with Units 02–03: most daily pages were roughly 640–880 visible words.
- Existing strengths included misconception work, retrieval, evidence prompts, differentiation, and uncertainty/limitations.
- Primary recurring gaps were explicit vocabulary and worked examples, with several ecology lessons also lacking clear quantitative/investigation framing.
- Mounted the canonical Science 9 engine on all 15 Unit 05 daily lessons in native/non-destructive mode.
- Added a Unit 05 depth checkpoint to every lesson with explicit vocabulary, worked examples, and investigation/explanation prompts.
- Strengthened quantitative ecology reasoning for energy transfer, matter cycling, sampling, population growth, carrying capacity, indirect effects, disturbance, and conservation trade-offs.
- Strengthened evolution reasoning for variation, natural selection, allele-frequency change, drift, gene flow, reproductive isolation, speciation, fossil inference, and phylogenetic evidence.
- Clarified the human-origins lesson so scientific evidence/interpretation is distinguished from worldview or philosophical claims without conflating domains.
- Preserved existing mastery, assessment, evidence-storage, navigation, and lesson content.
- Verified representative Days 01, 05, 10, 14, and 15 contain one engine loader and the Unit 05 depth checkpoint.
- Grade 9 known canonical engine coverage is now 75/180 daily lessons.
- Next target: Unit 06 — Atomic Structure & Periodic Patterns.


### 2026-11-22 · Grade 9 engine hardening pass 6 — Unit 06
- Audited all 15 Unit 06 daily lessons (Atomic Structure & Periodic Patterns).
- Found Unit 06 structurally stronger than Units 04–05: all lessons already exposed phenomena, vocabulary, quantitative content, models/investigation, misconception work, retrieval, and evidence.
- The consistent deficiency was explicit worked reasoning; only one daily page clearly exposed a worked example before this pass.
- Mounted the canonical Science 9 engine on all 15 Unit 06 daily lessons in native/non-destructive mode.
- Added a Unit 06 worked-reasoning checkpoint to every lesson with a worked example plus model/quantitative reasoning.
- Strengthened atomic composition, isotope notation, relative atomic mass, spectral evidence, electron configurations, ion formation, periodic-table structure, classification, group trends, and periodic-pattern data interpretation.
- Explicitly reinforced model limitations so shell diagrams, periodic trends, and spectra are treated as evidence-bearing models rather than literal pictures or memorized slogans.
- Preserved existing mastery, assessment, evidence-storage, navigation, and lesson content.
- Verified representative Days 01, 04, 07, 10, 14, and 15 contain one engine loader and the Unit 06 worked-reasoning checkpoint.
- Grade 9 known canonical engine coverage is now 90/180 daily lessons.
- Next target: Unit 07 — Bonding, Reactions & Matter.


### 2026-11-22 · Grade 9 engine hardening pass 7 — Unit 07
- Audited all 15 Unit 07 daily lessons (Bonding, Reactions & Matter).
- Found the unit conceptually well organized but thin in visible instructional depth: most lessons were roughly 557–619 visible words.
- Existing strengths included phenomena, vocabulary, quantitative/formula content, models/investigation, misconception work, retrieval, and evidence.
- The recurring deficiency was explicit worked reasoning; no daily lesson clearly exposed a full worked example before this pass.
- Mounted the canonical Science 9 engine on all 15 Unit 07 daily lessons in native/non-destructive mode.
- Added a Unit 07 chemistry-reasoning checkpoint to every lesson with a worked example plus particle-model/quantitative explanation.
- Strengthened ionic charge balance, covalent models, molecular polarity, giant structures, relative formula mass, word/symbol equations, state symbols, balancing equations, evidence of chemical change, reaction energy, bond energy, activation energy, catalysts, collision theory, rates, equilibrium, and industrial trade-offs.
- Reinforced conservation by distinguishing coefficients from subscripts and energy transfer by distinguishing bond breaking/forming from temperature observations.
- Preserved existing mastery, assessment, evidence-storage, navigation, and lesson content.
- Verified representative Days 01, 03, 07, 09, 12, 14, and 15 contain one engine loader and the Unit 07 chemistry-reasoning checkpoint.
- Grade 9 known canonical engine coverage is now 105/180 daily lessons.
- Next target: Unit 08 — Motion, Forces & Energy.


### 2026-11-22 · Grade 9 engine hardening passes 8–9 — Units 08 and 09
- Audited all 30 daily lessons across Unit 08 (Motion, Forces & Energy) and Unit 09 (Electricity, Waves & Information).
- Unit 08 lessons were generally about 601–688 visible words; Unit 09 lessons were generally about 602–670 visible words.
- Both units already had strong vocabulary, quantitative content, models/investigation, misconception work, retrieval, and evidence.
- The major shared deficiency was explicit worked reasoning; Unit 08 also lacked clearly labeled phenomena on most ordinary lesson days.
- Mounted the canonical Science 9 engine on all 30 daily lessons in native/non-destructive mode.
- Unit 08: added a physics-reasoning checkpoint to every lesson with phenomenon framing, worked examples, and quantitative/model explanation. Strengthened SI/vector reasoning, motion graphs, uncertainty, free-body diagrams, Newton's laws, momentum/impulse, work, kinetic/gravitational energy, conservation, efficiency, power, and engineering trade-offs.
- Unit 09: added an electricity-and-waves checkpoint to every lesson with phenomenon framing, worked examples, and quantitative/model explanation. Strengthened charge/current/voltage, Ohm's law, series/parallel circuits, circuit data uncertainty, electrical power/energy, electromagnets, induction, wave equation, wave behavior, sound, EM spectrum, wave-particle models, and analog/digital information transfer.
- Preserved existing mastery, assessment, evidence-storage, navigation, and lesson content.
- Verified representative Unit 08 Days 01, 05, 10, 15 and Unit 09 Days 01, 05, 09, 13, 15 contain one engine loader and their unit-specific reasoning checkpoint.
- Grade 9 known canonical engine coverage is now 135/180 daily lessons.
- Next two-unit block: Unit 10 — Earth Systems & Biogeochemical Cycles, and Unit 11 — Dynamic Earth, Climate & Space.


### 2026-11-22 · Grade 9 engine hardening passes 10–11 — Units 10 and 11
- Audited all 30 daily lessons across Unit 10 (Earth Systems & Biogeochemical Cycles) and Unit 11 (Dynamic Earth, Climate & Space).
- Unit 10 lessons were generally about 589–669 visible words; Unit 11 lessons were generally about 645–704 visible words.
- Unit 10 already had strong vocabulary, models/investigation, misconception work, retrieval, and evidence, but lacked explicit phenomena on nearly every ordinary lesson day and had no clear worked examples.
- Unit 11 was already phenomenon-rich and structurally stronger; its main recurring gap was explicit worked quantitative/model reasoning.
- Mounted the canonical Science 9 engine on all 30 daily lessons in native/non-destructive mode.
- Unit 10: added an Earth-systems checkpoint to every lesson with phenomenon framing, worked examples, and systems/model explanation. Strengthened Earth-sphere interactions, interior evidence, convection and plate motion, boundary hazards, seismic inference, rock cycling, erosion, watersheds, carbon/nutrient cycles, residence time, greenhouse physics, climate data, feedbacks, and uncertainty.
- Unit 11: added a space-systems checkpoint to every lesson with worked examples and model/evidence explanation. Strengthened frames of reference, seasons/phases, light-time, gravity/orbits, scale models, solar-system formation, fusion and space weather, spectra/telescopes, stellar evolution, exoplanet transit inference and bias, cosmic distance, expansion evidence, Big Bang model limits, and responsible exploration.
- Preserved existing mastery, assessment, evidence-storage, navigation, and lesson content.
- Verified representative Unit 10 Days 01, 05, 10, 15 and Unit 11 Days 01, 05, 10, 12, 14, 15 contain one engine loader and their unit-specific reasoning checkpoint.
- Grade 9 known canonical engine coverage is now 165/180 daily lessons.
- Next target: Unit 12 — Sustainable Engineering Capstone, followed by a full Grade 9 Science certification audit.


### 2026-11-22 · Grade 9 engine hardening pass 12 — Unit 12 + source-level Grade 9 certification
- Audited all 15 Unit 12 daily lessons (Sustainable Engineering Capstone); visible lesson depth was approximately 621–692 words before this pass.
- Existing strengths included vocabulary, quantitative/design content, investigation/prototyping, misconception work, retrieval, evidence, risk, and stakeholder reasoning.
- Primary recurring gaps were explicit worked examples and phenomenon framing on ordinary lesson days.
- Mounted the canonical Science 9 engine on all 15 Unit 12 daily lessons in native/non-destructive mode.
- Added a Unit 12 engineering-evidence checkpoint to every lesson with design-phenomenon framing, worked examples, quantitative engineering reasoning, and evidence-based design decisions.
- Strengthened need statements, criteria/constraints, baselines, decision matrices, biomimicry, materials/life-cycle reasoning, prototype plans, testing, uncertainty, zero-baseline-safe optimization, circularity, reliability, risk, iteration, ethics/equity/accessibility, and capstone evidence chains.
- Historical score-total literals 20/30 and 15/25 were not found by repository code search on the current default branch; no claim is made here about browser-rendered totals without runtime verification.
- Day 09 now explicitly states that percent improvement is undefined when baseline mean is zero and requires absolute change, a physically meaningful nonzero reference, or another appropriate metric rather than division by zero.
- Representative Unit 12 Days 01, 05, 09, 12, and 15 verify one canonical engine loader plus the Unit 12 engineering-evidence checkpoint.
- Grade 9 known canonical engine coverage is now 180/180 daily lessons.
- Source-level Grade 9 curriculum certification result: PASS for inventory completion and canonical engine mounting across the tracked 180-lesson hardening program.
- Curriculum depth was materially strengthened across all 12 units; unit-specific worked reasoning, phenomena, investigation/evidence, misconception repair, retrieval, differentiation, uncertainty, and model limitations were preserved or strengthened according to each unit's audit findings.
- Browser/runtime behavior, confidential assessment security, and GitHub Actions workflow conclusion remain separate verification layers; this source-level certification does not claim those checks passed unless directly observed.


### 2026-11-22 · Grade 9 post-certification forensic audit — five curriculum bubbles pushed out
- Scope: full Grade 9 Integrated Science course after 180/180 daily lesson engine hardening.
- Bubble 1 — quarterly investigations existed in the curriculum promise but not as four explicit student-facing interdisciplinary experiences. Added four cumulative investigations at Weeks 9, 18, 27, and 36 plus a landing page and assessment-map wiring.
- Bubble 2 — the curriculum promised a midterm practical + written assessment, while the public assessment layer exposed a written midterm-practice package without a clearly named practical practice layer. Quarter 2 now explicitly serves as the public midterm-practical practice layer while official midterm authority remains protected.
- Bubble 3 — vocabulary and retrieval were strong inside lessons but lacked an explicit delayed cross-unit spiral. Added SPIRAL_RETRIEVAL_VOCABULARY_MAP.md with same-lesson, delayed, next-unit, quarterly, and cumulative retrieval expectations.
- Bubble 4 — cross-unit conceptual coherence was implicit in the curriculum but not codified as required transfer. Added CROSS_UNIT_COHERENCE_MAP.md with bridges from inquiry → biology → chemistry → physics → Earth/space → engineering.
- Bubble 5 — inquiry/lab/design work was distributed across units but lacked one course-level practical progression. Added INQUIRY_LAB_SPINE.md defining unit evidence artifacts, skill progression, quality requirements, and quarterly practical checkpoints.
- Updated CURRICULUM_MAP.md, README.md, assessments/assessment-map.json, and assessments/index.html so the new course spine is canonical and discoverable.
- This pass strengthens curriculum coherence and assessment architecture. It does not change the separate browser/device release-certification boundary in RELEASE-CERTIFICATION.md.
