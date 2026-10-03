# Shared Mathematics Assets

This directory is the department-level home for reusable Mathematics learning resources.

## Canonical shared structure

```text
courses/mathematics/assets/
├── video-library/
└── learning-games/
```

## Architectural rule

**Shared assets describe mathematics content. Individual courses decide where and when those assets are used.**

A reusable asset must not be named for a specific course, unit, lesson, week, or day.

Use topic- or resource-based names such as:

- `number-family`
- `factors-and-multiples`
- `integer-compass`
- `absolute-value`
- `fraction-forge`
- `rational-rank`
- `ratio-atelier`
- `coordinate-plane`

Avoid names such as:

- `unit-02-03-integer-rank`
- `lesson-07-dividing-integers`
- `prealgebra-u03-l06-*`

Course placement belongs in course-specific maps or lesson companion configuration, not in the shared asset name.

## Legacy safety rule

Existing Pre-Algebra games and legacy course-local media remain in their current locations because they are already connected to working lessons. They are supported legacy assets and must not be moved or renamed simply to match the new structure.

From this point forward, new reusable Mathematics videos and games should be created under this shared `assets` directory using curriculum-neutral topic names.

## Reuse

The same shared asset may be referenced by Pre-Algebra, Algebra 1, Geometry, Algebra 2, GED/Readiness, or another Mathematics course when academically appropriate.

## Migration principle

**Do not break a working course to improve folder organization.** Existing connected assets stay in place unless a later migration is explicitly planned, mapped, tested, and protected by compatibility routes.
