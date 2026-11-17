# ProReSources Mathematics Tool Inventory — Grade 9 Integration

Date: 2026-11-17
Repository reviewed: `vervenveda/proresource_hub.github.io`
Primary target: Algebra I / Grade 9 lesson-aware Learning Tools archive.

## Confirmed interactive mathematics tools

### Khaemenes Scientific Calculator

Canonical public URL:
`https://vervenveda.github.io/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/`

Validated capabilities from v4.1 release:
- standard precedence and parentheses;
- right-associative exponentiation;
- unary-negative precedence;
- trigonometric and inverse-trigonometric functions;
- roots, logarithms, powers, reciprocals and absolute value;
- factorials with domain limits;
- calculator-style percentages;
- degree and radian modes;
- constants, memory and previous-answer handling;
- scientific notation;
- implicit multiplication;
- local history and backup/export;
- offline manifest/service worker.

Release validation: 24/24 automated release checks passed; parser/domain tests are documented in the calculator validation report.

Recommended Algebra I use:
- U01 precision / percent error
- U03 literal formulas, proportions, rate/mixture/distance/finance models
- U05 function evaluation
- U06 slope and modelling calculations
- U08 exponents/scientific notation
- U10 quadratics
- U11 radicals / coordinate calculations
- U12 financial mathematics / statistics calculations
- U13 modelling checks

Assessment restrictions remain authoritative; calculator availability should be lesson-aware and assessment-aware.

### OHMIC Foundry / Ohmic CAD Studio

Canonical public URL:
`https://vervenveda.github.io/proresource_hub.github.io/Protools/Ohmic_CAD_Studio.html`

Confirmed capabilities:
- line, wall, room, door, window, dimension, text and symbol drafting;
- grid and snapping;
- exact X/Y coordinates;
- width/height and rotation controls;
- dimensions / measurement;
- millimeter-native geometry with mm/cm/in/ft display;
- room/zone area analysis;
- layers and symbol library;
- scale notes;
- model metadata / tolerances / material notes;
- project autosave, recovery snapshots and version history;
- project JSON, SVG, PNG and basic DXF export;
- print/PDF.

Recommended Algebra I use:
- U01-L04 Units, Rates & Dimensional Analysis
- U01-L05 Precision, Rounding, Significant Figures & Percent Error
- U06-L08 Linear Modelling, Prediction & Decision-Making
- U11-L05 Midpoint, Coordinate Geometry & Geometric Constraints
- selected U13 modelling/design contexts

OHMIC is especially strong for Geometry and should become a major lesson-aware tool there later.

## Khaemenes Mathematics Core material pack

Location:
`templates/packs/khaemenes-mathematics-core/`

10 canonical templates:

1. Worked Example
2. Mathematical Reasoning
3. Proof Framework
4. Mathematics Error Analysis
5. Graph & Data Investigation
6. Mathematical Modeling Task
7. Formula & Concept Organizer
8. Problem-Solving Journal
9. Mathematical Vocabulary & Conjecture
10. Mathematics Assessment Correction

These belong under **Materials**, not Games.

### Strong Algebra I matches

- Worked Example → equations, inequalities, systems, factoring, quadratics, radicals
- Mathematical Reasoning → argument, verification, evidence, constraints
- Error Analysis → U01-L06, verification, model limitations, revision
- Graph & Data Investigation → functions, slope, regression, statistics
- Mathematical Modeling Task → U03-L07, linear modelling, optimization, U13
- Formula & Concept Organizer → notation, formulas, function forms, vocabulary
- Problem-Solving Journal → synthesis, decision-making, optimization, capstone
- Vocabulary & Conjecture → structure, patterns, sequences
- Assessment Correction → post-assessment review / retry workflow
- Proof Framework → limited Algebra I use; primary value is Geometry

## Scholarly mathematics resources

Additional useful ProReSources templates:
- Mathematical Investigation Laboratory
- Proof Workshop
- Theorem & Proof Exposition

These should primarily serve Geometry, Algebra II, Precalculus and higher mathematics.

## Inventory result

ProReSources contains:
- 2 high-value interactive math tools suitable for direct lesson launch;
- 10 Mathematics Core lesson-material templates;
- 3 higher-level scholarly mathematics templates;
- Evidence & Citation Studio as a cross-curricular research/evidence tool rather than a routine Algebra I math tool.

## Grade 9 mapping result

A conservative concept match found at least one meaningful ProReSources companion for 74 of 87 Algebra I lessons.

Do not attach every resource to every lesson. The lesson-aware archive should expose only tools whose function directly supports the lesson concept.

## Recommended toolbar structure

**Games**
- canonical matched mathematics games

**Materials**
- lesson-matched Mathematics Core templates
- printables
- approved videos

**Tools**
- Scientific Calculator
- OHMIC CAD when relevant
- future graphing / data utilities

This keeps the toolbar useful and prevents resource overload.

## Next implementation

1. Extend the mathematics archive schema with `materials` and richer `shared_tools` records.
2. Add lesson placements for the Scientific Calculator.
3. Add focused OHMIC placements.
4. Add Mathematics Core template placements by lesson concept.
5. Update the toolbar Materials panel to read these lesson-aware resources.
6. Preserve assessment-specific calculator restrictions.
