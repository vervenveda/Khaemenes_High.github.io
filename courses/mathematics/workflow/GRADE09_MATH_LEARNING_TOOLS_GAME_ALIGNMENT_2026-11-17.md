# Grade 9 Mathematics Learning Tools & Game Alignment Audit

Date: 2026-11-17
Scope: Algebra I lesson pathway (87 lessons), with Pre-Algebra retained as a placement alternative.
Status: Read-only inventory and matching plan. No mastery, grading, or learner records changed.

## Canonical sources reviewed

1. Verve N Veda ecosystem directory
   - `ecosystem/master-ecosystem-directory.json`
2. Canonical mathematics shared game library
   - `courses/mathematics/assets/learning-games/`
   - 70 canonical game folders
3. Mathematics game registry
   - `courses/mathematics/assets/learning-games/game-registry.json`
4. Algebra I lesson resource map
   - `courses/mathematics/algebra-1/assets/lesson-resource-map.js`
5. Verve N Veda Arcade
   - `vervenveda/arcade.github.io`
6. ProReSources / ProTools
   - Khaemenes Scientific Calculator
   - Ohmic CAD Studio
   - Khaemenes mathematics template pack

## Inventory highlights

### Shared mathematics games already available

The canonical mathematics library includes 70 shared game folders. High-value Algebra I resources include:

- Number Family
- Factor Structure Lab
- Prime Spy / Composite Catch
- GCF / LCM Challenge
- Operation Stepper
- Estimate Defender
- Integer Compass
- Opposite Mirror
- Integer Rank
- Integer Sum Lab
- Opposite Shift
- Sign Forge
- Quotient Check / Dividing Integers
- Coordinated Mission Control
- Equation Balance Lab
- Inequality Number Line
- Algebra Language Lab
- Equivalence Forge
- Expression Translator Studio
- Slope & Rate Studio
- Statistics Detective
- Linear Systems Mission
- Exponent Properties Lab
- Exponent Pattern Explorer
- Scientific Notation Operations Mission
- Sequence & Series Studio
- Interest Fees Decision Lab
- Polynomial Factoring Forge
- Quadratic Graph Lab
- Perfect Powers Roots Quest
- Right Triangle Trig
- Circle Theorem Studio
- Algebra Reasoning Foundations
- Algebra Structure and Balance Challenge
- Algebra Functions and Systems Challenge
- Algebra Exponents to Radicals Challenge
- Algebra Evidence and Modelling Challenge

### Arcade resources with mathematical value

- Jenny's Sudoku — logic / number reasoning
- Six by Six — logic / pattern recognition
- Pattern Pirates — pattern recognition
- Chess Studio — strategy / planning
- Checkers Variant Lab — strategy / planning
- Backgammon — strategy / probability
- Sacred Geometry — geometric reasoning
- Mandala Rings — symmetry / geometric reasoning
- Geometry Sanctuary — spatial reasoning
- Factors & Multiples
- Number Family
- Primes & Divisibility

These Arcade games are useful as enrichment and logic practice. Lesson-specific canonical math games should remain the primary direct lesson companion.

### ProReSources tools with mathematical value

- Khaemenes Scientific Calculator — calculation / verification
- Ohmic CAD Studio — geometry, measurement, modelling, design
- Mathematics Core Templates:
  - assessment correction
  - concept reference
  - data / graph study
  - error analysis
  - math model study
  - mathematical reasoning
  - problem-solving journal
  - proof framework
  - vocabulary / conjecture
  - worked example

## Algebra I coverage result

- Total Algebra I lessons: 87
- Lessons with one or more registered canonical game placements: 81
- Lessons with no registered canonical game placement: 6
- Total current Algebra I game placements: 88
- Some lessons intentionally have more than one game when the concepts are meaningfully different.

Coverage: 93.1% of Algebra I lessons already have a canonical game companion.

## Six remaining lesson gaps

### U03-L05 — Literal Equations & Rearranging Formulas

Recommendation: **Adapt existing game — no new game required.**

Extend `Equation Balance Lab` with a `literal-formulas` mode.

Mode goals:
- isolate a requested variable;
- preserve equality across symbolic transformations;
- distinguish equivalent rearrangements;
- verify by substitution;
- include formulas with multiple variables and coefficients.

### U03-L07 — Rate, Mixture, Distance & Financial Equation Models

Recommendation: **New multi-mode modelling game preferred.**

Existing Slope & Rate Studio, Market Math Mission, Small Business Math Lab, and financial games cover pieces of this lesson, but none provides a unified equation-modelling experience across rate, mixture, distance, and finance.

Suggested shared game: **Model Forge** (working title)

Mode: `equation-models`
- identify quantities and units;
- choose the unknown;
- construct an equation from context;
- solve;
- verify units and reasonableness;
- switch among rate, mixture, distance, and finance scenarios.

### U13-L01 — Frame a Complex & Ethical Modelling Question

Recommendation: **Use new Model Forge rather than a separate game.**

Mode: `frame`
- distinguish solvable questions from vague questions;
- identify stakeholders and constraints;
- state what the model can and cannot answer;
- flag ethical/fairness considerations.

### U13-L02 — Choose Variables, Assumptions, Data & Representations

Recommendation: **Use Model Forge.**

Mode: `design`
- choose variables;
- classify assumptions;
- select data;
- choose table / graph / equation / system;
- identify missing evidence.

### U13-L03 — Build, Calculate, Validate & Revise the Model

Recommendation: **Use Model Forge.**

Mode: `validate`
- build a model;
- calculate;
- compare prediction to evidence;
- detect a poor assumption;
- revise and recompute.

### U13-L04 — Test Sensitivity, Uncertainty & Fairness

Recommendation: **Use Model Forge.**

Mode: `sensitivity`
- vary one assumption at a time;
- identify break-even changes;
- compare outcomes across plausible ranges;
- distinguish uncertainty from error;
- assess fairness and unmodelled costs.

U13-L05 already has **Algebra Evidence and Modelling Challenge** for presentation, defense, and reflection.

## Recommended build count

Do not create six separate games.

Recommended:
1. Extend **Equation Balance Lab** with one literal-equations mode.
2. Create **one new shared Model Forge game** with five course modes:
   - equation-models
   - frame
   - design
   - validate
   - sensitivity

This closes all six Algebra I lesson gaps with only one new game plus one mode extension.

## Toolbar / archive recommendation

The ecosystem Learning Tools archive should distinguish:
- **Lesson companions** — canonical mathematics shared games matched to a lesson.
- **Enrichment** — Arcade logic/strategy games.
- **Tools** — calculator, CAD, graphing / modelling utilities.
- **Materials** — ProReSources math templates and lesson printables.

The lesson engine should request resources by course + unit + lesson rather than display the complete game library indiscriminately.

## Next implementation pass

1. Add archive metadata for the 70 canonical mathematics shared games so the Learning Tools toolbar can discover them.
2. Add lesson tags: course, unit, lesson, mode, level, concept.
3. Wire Algebra I's 81 existing matches into the lesson-level Games/Tools launcher.
4. Extend Equation Balance Lab for U03-L05.
5. Add Model Forge when available and wire the five remaining modelling lessons.
6. Validate tablet / Opera launch behavior and ensure game progress is supportive evidence only, never official mastery.
