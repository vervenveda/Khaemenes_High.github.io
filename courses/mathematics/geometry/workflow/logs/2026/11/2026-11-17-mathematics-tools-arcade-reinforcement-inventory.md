# 2026-11-17 · Mathematics Tools & Arcade Reinforcement Inventory

- Repository audited: `vervenveda/proresource_hub.github.io`
- Arcade repository audited: `vervenveda/arcade.github.io`
- High School record location: Geometry workflow
- Type: inventory · instructional tools · mathematics reinforcement
- State: source inventory PASS; lesson integration pending

## Purpose

Map existing Academy-owned mathematics tools and mathematically derived games before building new Geometry interactions. The goal is to reuse strong local-first tools deliberately inside lessons rather than duplicating functionality.

## ProReSources mathematics tools

### Khaemenes Scientific Calculator v4.1
Canonical integration candidate:
- `Protools/Khaemenes_Scientific_Calculator/Khaemenes_Scientific_Calculator_index.html`

Capabilities verified from source/validation:
- arithmetic and calculator precedence;
- parentheses;
- exponents and roots;
- logarithms;
- trigonometric and inverse-trigonometric functions;
- degree/radian modes;
- factorials;
- percentages;
- constants;
- memory/history;
- previous-answer handling;
- scientific notation;
- Euler constant;
- implicit multiplication;
- editable expressions;
- keyboard/accessibility support;
- offline manifest/service worker;
- deterministic self-tests.

Validation record reports:
- 24/24 release checks PASS;
- 30 built-in parser/domain tests;
- 6 extended parser tests.

An older `index.html` identifies itself as v4. Treat v4.1 as the preferred course candidate unless the Protools folder is later consolidated.

### OHMIC Foundry CAD
Gateway:
- `Protools/Ohmic_CAD_index.html`

Studio:
- `Protools/Ohmic_CAD_Studio.html`

Verified Geometry-relevant capabilities:
- line drawing;
- rooms/walls/windows/doors;
- measurement;
- text and symbols;
- grid and snap;
- mm/cm/inches/feet;
- layers and object properties;
- duplicate/edit objects;
- design analysis;
- constraint-based layout generation;
- undo/redo and version history;
- print/PDF;
- JSON;
- SVG + MBD metadata;
- PNG;
- basic DXF;
- part-schedule CSV.

Best fit:
- constructions;
- measurement;
- scale drawing;
- coordinate/spatial design;
- area/perimeter;
- solids/layout concepts;
- modelling;
- Unit 12 CAD;
- capstone work.

## Arcade direct mathematics games

### Geometry / visual-spatial

#### Sacred Geometry Sanctuary
- `Geometry/sacred_geometry_game_index.html`
- radial mandala studio;
- editable layers;
- geometric composition;
- tactical Geometry Duel;
- SVG/PNG export;
- symmetry/radial reasoning potential.

Potential course uses:
- symmetry;
- transformations;
- circles/radial structure;
- design;
- constructions;
- capstone inspiration.

#### Mandala Rings
- `Geometry/mandala_rings_game_index.html`
- strategic placement/movement;
- symmetry scoring;
- pattern library;
- saved patterns.

Potential course uses:
- symmetry;
- transformations;
- rotational/reflection reasoning;
- pattern structure;
- spatial planning.

#### Sacred Geometry player guide
- `Geometry/original-sanctuary-game_index.html`
- companion instructional route for Sanctuary.

### Number sense / Pre-Algebra

#### Number Family Sort
- `Math/number-family.html`
- classify Natural, Whole, Integer, Rational, Irrational and Real numbers.

#### Factors & Multiples
- `Math/factors-multiples.html`
- arrays;
- factor-pair construction;
- completeness reasoning.

#### Prime Numbers, Divisibility & Prime Factorization
- `Math/primes-divisibility.html`
- existing Pre-Algebra lesson/game hybrid;
- divisibility;
- prime structure;
- guided notes;
- 80% lesson progression.

### General mathematical reasoning

#### Jenny's Sudoku
- `Jenny's_Sudoku_index.html`
- constraint reasoning;
- deduction;
- smart hints;
- undo;
- Monte Carlo guess/AI solve.

Best use:
- logic warm-up;
- constraint satisfaction;
- strategic reasoning;
- optional enrichment.

#### Orion's Connect Four
- `Orions_connect_four_index.html`

Important math mechanic:
- Player A must solve mathematics to earn a board drop;
- grade setting;
- topic/difficulty logic;
- XP-based difficulty growth;
- AI opponent.

This is a particularly strong candidate for retrieval practice because mathematics is embedded in the game action rather than merely decorating the game.

#### SixBySix
- `SixbySix_index.html`
- 6×6 spatial strategy;
- special win conditions;
- Monte Carlo AI;
- move evaluation / immediate-threat reasoning.

Potential reinforcement:
- spatial planning;
- combinatorial reasoning;
- probability/AI discussion;
- logic and strategy.

#### Checkers Variant Lab
- `Checkers_Variant_Lab_index.html`
- multiple-board/variant logic;
- AI move preview;
- learning state;
- lookahead/search;
- board-state evaluation;
- Zobrist-style position hashing in source.

Potential reinforcement:
- logical planning;
- coordinate/spatial reasoning;
- algorithms;
- discrete mathematics enrichment.

#### AffixSix
- `AffixSix™_index.html`
- 12×12 connect-six style pattern strategy;
- pattern memory;
- AI learning;
- lookahead and weighted move selection.

Potential reinforcement:
- pattern recognition;
- spatial reasoning;
- discrete strategy;
- AI/mathematical modelling discussions.

### Quantitative / pattern / spatial reasoning assessments

#### Quantum IQ
- `IQ-Quantum_index.html`
- domains include Logic & Deduction, Quantitative, Sequences & Pattern, Verbal & Analogies, Spatial & Mapping;
- adaptive/session profile mechanics.

#### Mini IQ
- `IQ-mini_index.html`
- number-series patterns;
- arithmetic;
- logic/syllogisms;
- spatial/reasoning items.

These are not course mastery authorities. They may be used as optional reasoning/enrichment experiences, not substitutes for mathematics assessments.

## Younger-grade mathematical foundations

### Pattern Pirates
- `games/kids/Pattern_Pirates_index.html`
- pattern recognition;
- hints;
- board/map interaction.

### Shapes
- `games/kids/Shapes_index.html`
- shape recognition;
- multiple early-learning challenge levels.

These belong primarily to younger Academy pathways, not High School Geometry.

## Geometry integration principle

Do not place a generic Arcade button on every lesson and expect students to discover relevance.

Preferred model:
1. interactive worksheet presents the mathematical concept;
2. lesson identifies one relevant tool/game when it genuinely reinforces that concept;
3. student launches it from a small **Practice Lab** or **Try It** card;
4. return path brings the student back to the lesson;
5. game/tool participation is a learning indicator unless a course authority explicitly grades it.

## Initial Geometry mapping

Potential examples:
- Foundations / notation -> no game required; keep focus on precision.
- Transformations / symmetry -> Mandala Rings, Sacred Geometry Sanctuary.
- Coordinate reasoning -> OHMIC CAD where appropriate.
- Right triangles / trig -> Scientific Calculator + OHMIC measurement tasks.
- Circles -> Sacred Geometry Sanctuary / Mandala Rings.
- Area & measurement -> OHMIC CAD.
- Spatial design -> OHMIC CAD.
- Logic/proof enrichment -> Sudoku, Checkers Variant Lab.
- Capstone -> OHMIC CAD + optional Sanctuary visualization.

## Guardrails

- Games must reinforce the target mathematics, not replace instruction.
- Do not use game scores as formal mastery unless an explicit validated bridge is designed.
- Protected assessments remain free of external game/tool assistance except where policy specifically permits calculators.
- Preserve local-first behavior where available.
- Do not require hover.
- Tablet usability must be tested.
- Keep game/tool launchers secondary to the interactive worksheet.

## Next action

Use this inventory while prototyping Geometry Unit 01 Lesson 01. The first lesson does not require a game merely because games exist; it should prove the interactive worksheet architecture first. Later Geometry lessons can receive targeted tool/game mappings where the mathematical relationship is strong.
