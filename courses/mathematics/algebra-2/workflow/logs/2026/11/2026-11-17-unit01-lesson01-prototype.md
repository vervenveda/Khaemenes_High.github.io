# 2026-11-17 · Algebra II Unit 01 Lesson 01 Prototype

- Repository: `vervenveda/Khaemenes_High.github.io`
- Course: Algebra II & Advanced Functions
- Lesson: Unit 01 · Lesson 01 · Function Language, Notation & Evaluation
- State: source validation PASS; rendered browser/device acceptance remains separate

## Goal

Test the Geometry instructional sequence against a more symbolic mathematics course without copying Geometry-specific content.

Canonical sequence:

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

## Findings before repair

Algebra II already had stronger progression and note-protection logic than Geometry:
- scoped local progression authority;
- lesson mastery evidence;
- protected note drafts;
- conflict detection;
- export/import note recovery;
- read-only fallback when progression verification is unavailable.

These systems were preserved.

Presentation gaps:
- persistent 310px lesson side rail;
- older sub-16px course styles;
- long uninterrupted lesson sequence;
- guided and independent work combined in one section.

## Shared presentation repair

Added:
`courses/mathematics/algebra-2/assets/algebra2-presentation-unifier-v1.js`

The unifier:
- enforces a 16px readable floor;
- converts the lesson layout to one centered primary column;
- moves the former lesson-side cards into a centered equal 3-column support grid;
- collapses to one column on smaller viewports;
- changes presentation only.

Loaded through:
`courses/mathematics/algebra-2/assets/lesson-tools.js`

Commits:
- presentation unifier: `4a17ba16fda8127ddacef23fa4255251b1dae0d2`
- loader: `b187e850f5ca8634bae74dbf89b08ee9508eb6e7`

## Unit 01 Lesson 01 prototype

Reorganized the lesson around the canonical 10-step flow using actual function-notation content.

Highlights:
- Recall distinguishes expression/rule from evaluated output;
- See visualizes input → rule → output;
- Worked models substitution with grouping;
- Explain emphasizes meaning of function notation and contextual units;
- Guided evaluates `g(3)=2x³−5x`;
- Independent preserves substantive learner work;
- Error repairs the misconception that `f(3)` means multiplication;
- Transfer creates a real function model with units and limitations;
- Feedback checks substitution, grouping, units and verification;
- Reflect asks the learner to explain the notation concept in their own words.

One-word support labels:
- Practice
- Calculator
- Lab

These supports are explicitly non-authoritative for mastery.

Prototype commit:
- `7386eafb86250eaa6b20adeef2e92a09eb630751`

## Source validation

PASS:
- exact 10-step order;
- duplicate flow steps: 0;
- one-word instructional support buttons;
- lesson-tools loader remains present;
- lesson completion and lesson note controls remain present;
- Algebra II workflow adapter remains loaded;
- shared presentation unifier remains loaded;
- 16px readable floor present;
- centered no-side-column lesson layout present.

## Authority boundaries

No changes were made to:
- 80% mastery threshold;
- progression state;
- assessment evidence;
- note storage schema;
- learner scope;
- midterm/final logic;
- assessment history;
- STOS authority.

## Next target

Audit Unit 01 Lessons 02–06 against this prototype.

Do not mechanically rewrite them. Preserve lesson-specific pedagogy and only normalize:
- 10-step learning flow;
- centered support layout;
- readable floor;
- one-word support controls;
- optional tools as non-authoritative practice.
