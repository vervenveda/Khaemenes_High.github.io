# Khaemenes Mathematics Resource Gap Classification — 2026-10-20

## Current status

All four core mathematics courses now have **zero genuine new-game development gaps**.

A lesson may still intentionally have no game when a calculator, CAD tool, modelling task, lab, portfolio, or evidence workflow is the stronger companion. Those lessons are classified as **tool-sufficient**, not deficient.

| Course | Lessons | Canonical game coverage | Intentional tool-sufficient lessons | Genuine new-game gaps |
|---|---:|---:|---:|---:|
| Pre-Algebra | 97 | **86** | 11 | **0** |
| Algebra I | 87 | **81** | 6 | **0** |
| Geometry | 90 | **63** | 27 | **0** |
| Algebra II | 92 | **87** | 5 | **0** |

## Canonical game-library milestone

The shared registry now contains **82 canonical mathematics games**.

Recent completed clusters:

- **Algebra-language cluster** — Algebra Language Lab, Expression Translator Studio, Equivalence Forge.
- **Geometry/measurement cluster** — Angle & Polygon Studio, Boundary & Area Lab, Pythagorean Distance Mission, Surface & Volume Studio.
- **Piecewise-functions repair** — Piecewise Boundary Lab.
- **Geometry visual-reasoning cluster** — Geometry Foundations Sort, Quadrilateral Detective, Polygon Design Lab, Geometric Probability Lab.

These games are formative support only. They never award official 80% mastery, modify assessment evidence, or bypass course progression.

## Intentional tool-sufficient lessons

### Pre-Algebra (11)

- U07-L07 — Formulas Multivariable Expressions
- U07-L08 — Structural Modelling Patterns Error Analysis
- U08-L07 — Rearranging Formulas Literal Equations
- U10-L04 — Tables Graphs Equations Words
- U11-L01 — Measurement Systems Units Precision
- U11-L08 — Coordinate Geometry Design Constraints Error
- U13-L01 — Frame Meaningful Safe Answerable Question
- U13-L02 — Select Variables Mathematics Data Representations
- U13-L03 — Build Calculate Verify Revise Model
- U13-L04 — Test Assumptions Sensitivity Uncertainty Fairness
- U13-L05 — Communicate Defend Reflect Readiness

### Algebra I (6)

- U03-L05 — Literal Equations & Rearranging Formulas
- U03-L07 — Rate, Mixture, Distance & Financial Equation Models
- U13-L01 — Frame a Complex & Ethical Modelling Question
- U13-L02 — Choose Variables, Assumptions, Data & Representations
- U13-L03 — Build, Calculate, Validate & Revise the Model
- U13-L04 — Test Sensitivity, Uncertainty & Fairness

### Geometry (27)

- U01-L04 — Compass-and-Straightedge Constructions
- U09-L01 — Locus as a Set of Points Meeting a Condition
- U09-L02 — Perpendicular and Angle Bisector Loci
- U09-L03 — Distance from a Point to a Line
- U09-L05 — Circle-Line Intersections and Tangency
- U09-L06 — Parabolas as Distance Loci
- U09-L07 — Voronoi Thinking, Nearest-Point Regions & Design
- U11-L01 — Prisms, Cylinders & Cavalieri’s Principle
- U11-L02 — Pyramids and Cones
- U11-L03 — Spheres: Surface Area and Volume
- U11-L04 — Nets and Surface Area of Prisms and Pyramids
- U11-L05 — Surface Area of Cylinders and Cones
- U11-L06 — Cross-Sections and Solids of Revolution
- U11-L07 — Similarity, Scale and Volume Relationships
- U12-L01 — CAD Workspace, Units, Grid and Snap
- U12-L02 — Precision Lines, Angles and Dimensions
- U12-L03 — Layers, Objects and Geometric Organization
- U12-L04 — Scale Plans, Rooms and Openings
- U12-L05 — Area, Perimeter and Material Schedules
- U12-L06 — Transformations, Repetition and Modular Design
- U12-L07 — Export, Print/PDF, SVG, DXF and Design Defense
- U13-L01 — Frame a Geometric Design or Investigation
- U13-L02 — Develop Constructions, Models and Proof
- U13-L03 — Test Measurements, Sensitivity and Limitations
- U13-L04 — Prepare a Printable Technical Portfolio
- U13-L05 — Present, Defend and Revise the Design
- U13-L06 — Final Synthesis, Examination and Completion Record

### Algebra II (5)

- U04-L08 — Rational Models, Rates & Work Problems
- U13-L01 — Frame a Meaningful, Ethical & Answerable Question
- U13-L02 — Select Variables, Functions, Data & Assumptions
- U13-L03 — Build, Compute, Visualize & Validate the Model
- U13-L04 — Test Sensitivity, Uncertainty, Fairness & Limitations

## Shared-game offline architecture

The canonical game library remains shared under `courses/mathematics/assets/learning-games/`.

A mathematics-root service worker at `courses/mathematics/service-worker.js` now precaches the shared game library, registry, and launcher. It is registered from both the mathematics landing page and the shared game launcher. The four course-specific workers remain authoritative for course-local pages and records.

Source validation confirms the root worker and launcher parse successfully and all 82 canonical game paths exist. Live browser/offline navigation QA is still required before claiming runtime certification.
