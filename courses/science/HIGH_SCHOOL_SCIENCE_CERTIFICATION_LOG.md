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
