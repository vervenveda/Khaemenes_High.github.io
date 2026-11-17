# Universal Mathematics Resource Resolver v2

Status: Active on Pre-Algebra, Algebra I, Geometry, and Algebra II.

## Shared implementation

- assets/math-learning-tools-v2.js
- assets/math-course-shell-v1.js routes its Tools control to the shared resolver.

## Student-facing one-word controls

- Calculator
- Graph
- Studio
- Games
- Search
- Parent
- Print
- Course

All controls use equal sizing and a two-column stack that remains usable on narrow screens.

## Course-aware routing

The resolver detects the active mathematics course and changes Graph/Studio destinations where a course-specific resource exists. Shared resources remain available for calculator, games, ecosystem search, parent access, print, and course return.

## Safety and authority

The resolver:
- performs no learner-record writes;
- performs no mastery writes;
- does not change assessment outcomes;
- is hidden on diagnostic and assessment routes;
- keeps assessment tool rules authoritative.

## Legacy cleanup

Geometry and Algebra II no longer import Algebra I's learning-tools-menu-v1.js. Algebra I also uses the shared mathematics resolver. The legacy file remains in place for historical compatibility with any deeper page not yet migrated, but it is no longer a dependency of the four main course landing pages.
