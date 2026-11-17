# 2026-11-17 · Geometry Lesson Support Compaction

- Repository: `vervenveda/Khaemenes_High.github.io`
- Scope: Geometry lesson presentation layer
- State: source repair PASS; rendered browser/device acceptance remains separate

## Starting point

The prior Geometry workflow left the next target as the lesson-support experience after the former right sidebar was converted into a centered support area.

The repeated support blocks are:
- Vocabulary
- Learning Pathways
- Connected Studio
- Local Completion

The goal is to reduce lesson length and cognitive clutter without hiding progression/mastery controls.

## Repair

Updated:

`courses/mathematics/geometry/assets/geometry-presentation-unifier-v1.js`

The shared presentation unifier now:

1. finds the Geometry lesson support container;
2. converts Vocabulary, Learning Pathways, and Connected Studio into collapsed `details` cards;
3. leaves Local Completion fully visible and immediately usable;
4. renders the collapsed support cards as a centered equal three-column row on wide screens;
5. gives Local Completion a centered full-width row;
6. collapses to one column on smaller viewports;
7. keeps 16px minimum readable text through the existing Geometry readable-floor rule;
8. changes presentation only.

Commit:
- `061427d5ea2a2d4b92a4e992fd5629a33c923c46`

## Boundaries

No changes were made to:
- 80% mastery requirements
- lesson progression gates
- assessment records
- grade calculations
- learner storage keys
- STOS authority
- worksheet questions
- teacher keys

## Next instructional target

Use Unit 01 · Lesson 01 as the prototype for the mathematics interactive-worksheet sequence:

Recall → See → Worked Example → Explain → Guided Try → Independent Worksheet → Error Analysis → Transfer → Feedback → Reflect

The prototype should integrate existing Geometry games/tools where instructionally relevant without turning games into mastery authorities.

Toolbar labels must follow the canonical learner-toolbar rule:

**one word · one line · fixed height**

For High School the context launcher remains **Class**.
