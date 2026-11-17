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


## Unit 01 Lesson 01 instructional prototype

Unit 01 · Lesson 01 is now the prototype for the shared mathematics lesson sequence.

Canonical order:

1. Recall
2. See
3. Worked
4. Explain
5. Guided
6. Independent
7. Error
8. Transfer
9. Feedback
10. Reflect

Implementation notes:
- existing lesson topic and six-problem printable worksheet preserved;
- worksheet is the Independent step;
- Error, Transfer, Feedback and Reflect occur after independent work;
- optional Practice, CAD and Game supports use one-word labels;
- external practice tools are explicitly non-authoritative for mastery;
- the existing `lesson-tools.js` remains the source of the 80% lesson mastery gate;
- no assessment key, storage key, progression threshold, or grading logic was changed.

Prototype commits:
- initial instructional prototype: `55da62f12b89fa5b35196193b88c24d6bd893b7a`
- corrected canonical sequence order: `d35821fe57c342799b43f3d027a1be21a63abcc2`

Source validation:
- exact flow order PASS;
- duplicate flow-step IDs: 0;
- printable worksheet count: 1;
- lesson main container count: 1;
- lesson support container count: 1;
- Geometry lesson mastery engine remains loaded.
