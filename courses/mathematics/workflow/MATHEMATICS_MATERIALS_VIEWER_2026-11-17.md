# Khaemenes Mathematics Materials Viewer — 2026-11-17

## Canonical viewer

`courses/mathematics/materials-viewer/index.html`

Purpose:
- provide one polished learner-facing surface for all Mathematics Core templates;
- preserve lesson context in the URL;
- avoid exposing raw ProReSources template fragments directly;
- support local drafts, JSON export, print/PDF and learner reflection;
- remain separate from grades, mastery and progression authority.

## Active template families

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

## Archive integration

`ecosystem/learning-tools/mathematics.json`

- 10 active Mathematics Core materials
- 454 lesson placements
- each material `public_url` points to the shared viewer with a template query
- toolbar appends course, unit, lesson and lesson title

Example:
`/courses/mathematics/materials-viewer/?template=mathematical-modeling-task&course=algebra-1&unit=13&lesson=03&title=Build...`

## Viewer behavior

- centered, symmetrical Academy layout
- minimum 16px text
- editable sections appropriate to each template
- local browser draft storage keyed by course/unit/lesson/template
- explicit Save Draft
- JSON export
- Print / PDF
- Clear Draft confirmation
- storage-unavailable warning with export fallback
- no official grade writes
- no mastery writes
- no course unlock writes

## Shared toolbar

`assets/vnv-class-tools-toolbar.js` v1.5.0

Materials panel:
- resolves exact lesson context;
- exposes active Mathematics Core resources;
- passes lesson metadata into the viewer;
- retains general Materials behavior off lesson surfaces.

## Four-course rollout

All current math lesson engines now request toolbar v1.5.0:
- Pre-Algebra: all 13 unit lesson engines
- Algebra I: shared lesson resource bridge
- Geometry: shared lesson-tools.js
- Algebra II: shared lesson-tools.js

## Current mathematics resource totals

- 83 canonical games
- 370 game placements
- 278 interactive-tool placements
- 454 Mathematics Core material placements

## Governance

The viewer is a learning workspace, not an assessment authority.
Assessment calculator restrictions and mastery gates remain authoritative.
Raw ProReSources fragments remain implementation sources only; students should enter through the shared viewer.
