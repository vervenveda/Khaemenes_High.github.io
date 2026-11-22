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
