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
- Lessons with one or more registered canonical game placements: 87
- Lessons with no registered canonical game placement: 0
- Grade 9 lesson-level game coverage: 100%

Coverage reached 100% after:
- Equation Balance Lab v2 added `literal-formulas` for U03-L05.
- Model Forge v1 added five modelling modes for U03-L07 and U13-L01 through U13-L04.

## Gap closure

All six previously identified gaps are now closed.

- U03-L05 — Equation Balance Lab · `literal-formulas`
- U03-L07 — Model Forge · `equation-models`
- U13-L01 — Model Forge · `frame`
- U13-L02 — Model Forge · `design`
- U13-L03 — Model Forge · `validate`
- U13-L04 — Model Forge · `sensitivity`

U13-L05 continues to use Algebra Evidence and Modelling Challenge for presentation, defense, and reflection.

## Build result

Only one new shared game was required:
- **Model Forge v1**

And one existing game was upgraded:
- **Equation Balance Lab v2**

This avoids six separate apps and preserves one coherent modelling progression across Algebra I.

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
