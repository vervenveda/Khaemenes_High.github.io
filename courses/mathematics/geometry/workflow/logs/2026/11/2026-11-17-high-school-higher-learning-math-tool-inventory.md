# 2026-11-17 · High School & Higher Learning Mathematics Tool Inventory

- Repositories audited:
  - `vervenveda/Khaemenes_High.github.io`
  - `vervenveda/Khaemenes_Higher_Learning.github.io`
- Type: inventory · tool discovery · mathematics ecosystem
- State: source inventory PASS; integration design pending

## Finding

Additional mathematics tools were distributed across High School and Higher Learning rather than being centralized in ProReSources or Arcade.

This is important because the Academy already owns many of the interactive experiences that would otherwise be candidates for new development.

## High School mathematics learning-games library

Location:
- `courses/mathematics/assets/learning-games/`

Verified learner-facing tools include:

### Geometry-direct
- `geometry-foundations-sort/index.html`
  - Geometry Foundations Sort
  - classification / foundational vocabulary and concept recognition

- `angle-polygon-studio/index.html`
  - Angle & Polygon Studio
  - angle and polygon reasoning

- `circle-theorem-studio/index.html`
  - Circle Theorem Studio
  - challenge generation
  - diagram
  - hint
  - worked solution
  - reasoning/explanation
  - progress JSON export

- `geometric-probability-lab/index.html`
  - Geometric Probability Lab

- `surface-volume-studio/index.html`
  - Surface & Volume Studio

### Algebra / function / trig / statistics / number tools
- `algebra-evidence-interval-lab/index.html`
- `algebra-evidence-modelling-challenge/index.html`
- `algebra-exponents-radicals-challenge/index.html`
- `algebra-functions-systems-challenge/index.html`
- `algebra-language-lab/index.html`
- `algebra-reasoning-foundations/index.html`
- `algebra-structure-balance-challenge/index.html`
- `exponent-pattern-explorer/index.html`
- `expression-translator-studio/index.html`
- `function-transformation-studio/index.html`
  - mission mode
  - free exploration
  - coordinate laboratory
  - parent/transformed function comparison
  - hints/explanations
  - practice export

- `inequality-number-line/index.html`
- `matrix-mission-control/index.html`
- `number-family/index.html`
- `percent-benchmark-studio/index.html`
- `percentage-point-change-studio/index.html`
- `polynomial-zeros-explorer/index.html`
- `probability-quest/index.html`
- `sequence-series-studio/index.html`
- `slope-and-rate-studio/index.html`
- `statistics-detective/index.html`
- `trigonometric-wave-studio/index.html`
  - wave workshop
  - interactive periodic graph
  - reasoning console
  - hint / worked solution
  - private learning journal
  - JSON export

## High School Algebra I applied laboratories

Location:
- `courses/mathematics/algebra-1/labs/`

Verified labs:
- `linear-model-lab.html`
- `quadratic-design-lab.html`
- `systems-constraints-lab.html`
- `integrated-modelling-lab.html`
- `exponential-change-lab.html`
- `financial-evidence-lab.html`

Related Algebra I resource studio:
- `courses/mathematics/algebra-1/instructional-repair-pack/resource-studio/`

This indicates High School already has a parallel model of course-specific interactive labs that can inform Geometry.

## Higher Learning mathematics tool suites

These are advanced tools and should not automatically be dropped into High School unchanged. However, their interaction patterns, visualizations and engines may be reusable.

### Abstract Algebra
`courses/abstract-algebra/tools/`
- Cayley Table & Group Explorer
- Coset, Quotient & Homomorphism Lab
- Finite Field & Polynomial Studio

### Calculus II
`courses/calculus-ii/tools/`
- Integration Methods Lab
- Polar Curve Lab
- Series & Convergence Lab

### Differential Equations
`courses/differential-equations/tools/`
- Direction Field & Numerical Solver Lab
- Oscillation & Resonance Lab
- Phase Plane & Linear Systems Lab

### Discrete Mathematics
`courses/discrete-mathematics/tools/`
- Combinatorics & Recurrence Lab
- Graph Theory Studio
- Logic, Sets & SAT Lab

### Introduction to Proofs
`courses/introduction-to-proofs/tools/`
- Lemma Dependency Map
- Proof Strategy Studio
- Quantifier & Counterexample Lab

These three are particularly relevant conceptually to High School Geometry proof instruction, but should be simplified/adapted rather than exposed wholesale.

### Linear Algebra
`courses/linear-algebra/tools/`
- Eigen & SVD Lab
- Matrix Row Reduction Lab
- Linear Transformation Studio

The Transformation Studio may provide reusable interaction patterns for High School transformation geometry.

### Calculus I
- `courses/mathematics/calculus-1/tools/limits-laboratory/index.html`
- numerical table + interactive graph + explanation/verification model

### Statistics
`courses/statistics/tools/`
- Data Explorer & Distribution Lab
- Inference & Regression Lab
- Sampling & Simulation Lab

### Topology / Differential Geometry
`courses/topology-differential-geometry/tools/`
- Finite Topology & Continuity Lab
- Geodesic & Gauss–Bonnet Studio
- Polygon Gluing & Surface Classification Studio
- Simplicial Homology Studio
- Surface & Curvature Studio

These are Higher Learning tools, but Polygon Gluing and Surface/Curvature may provide future enrichment bridges for advanced Geometry students.

## Immediate Geometry implications

Before building a new Geometry interaction, first check whether one already exists in:
1. High School `courses/mathematics/assets/learning-games/`
2. High School course-specific labs
3. ProReSources Protools
4. Arcade
5. Higher Learning tools

### Strong High School Geometry candidates already present
- Geometry Foundations Sort
- Angle & Polygon Studio
- Circle Theorem Studio
- Geometric Probability Lab
- Surface & Volume Studio

### Strong adjacent tools
- Function Transformation Studio
- Trigonometric Wave Studio
- OHMIC CAD Studio
- Scientific Calculator
- Sacred Geometry Sanctuary
- Mandala Rings

### Proof-support concepts available upstream
- Proof Strategy Studio
- Lemma Dependency Map
- Quantifier & Counterexample Lab

## Architectural recommendation

Create one **Mathematics Tool Registry** rather than relying on folder location.

Each tool record should eventually include:
- canonical ID;
- display name;
- source repository;
- source path;
- subject/course;
- concept tags;
- grade/level range;
- launch mode;
- whether it is instructional, practice, enrichment or assessment-adjacent;
- whether it exports evidence;
- whether it stores local progress;
- calculator/tool policy;
- device status;
- whether it is approved for protected assessments.

This would allow Geometry, Pre-Algebra, Algebra I and future math courses to call tools by concept rather than hard-coded repository URLs.

## Guardrail

Discovery does not mean automatic integration. High School Geometry should use age-appropriate tools deliberately and preserve the clean interactive worksheet as the primary learning surface.
