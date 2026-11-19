# Pre-Algebra Mathematics Engine v2.2.1 · Course Rollout

Date: 2026-11-19

## Canonical references

- Exact workflow HTML clone:
  `workflow/blueprints/pre-algebra-mathematics-engine-v2.2.1-reference.html`
- Approved live reference:
  `courses/mathematics/pre-algebra/units/unit-01/lessons/lesson-01-number-systems.html`
- Canonical presentation:
  `https://vervenveda.com/assets/khaemenes-math-engine-v2.css?v=2.2.1`
- Course-wide legacy lesson normalizer:
  `courses/mathematics/pre-algebra/assets/prealgebra-math-lesson-v2-adapter.js?v=2.2.1`

## Rollout coverage

Standard lesson pages migrated in Units 01–13: **97**

- Unit 01: 6 lessons
- Unit 02: 8 lessons
- Unit 03: 8 lessons
- Unit 04: 8 lessons
- Unit 05: 8 lessons
- Unit 06: 7 lessons
- Unit 07: 8 lessons
- Unit 08: 8 lessons
- Unit 09: 7 lessons
- Unit 10: 8 lessons
- Unit 11: 8 lessons
- Unit 12: 8 lessons
- Unit 13: 5 lessons

The 97-page count includes the clean live Unit 01 Lesson 01 canonical page and 96 legacy lesson pages migrated through the shared v2 adapter.

Unit 00 readiness/diagnostic lessons are intentionally excluded because they use a different diagnostic architecture.

## What every migrated lesson inherits

- canonical High School chrome ownership;
- Mathematics Engine v2.2.1 presentation;
- charcoal + crisp cream + khaki parchment palette;
- Cinzel title hierarchy;
- Brandon Grotesque / Nunito body typography;
- 16px absolute minimum text, with 18px preferred lesson body;
- progressive-disclosure charcoal lesson bars;
- 3-minute reset language where the old 33-second reset exists;
- left-aligned reading/problem-list bullets;
- question-number left rail;
- collapsed Reading Room;
- collapsed lesson-specific explorer/laboratory;
- collapsed Quick Check;
- collapsed Worked Examples;
- collapsed Pathway Support;
- collapsed Vocabulary Bridge;
- collapsed Global/Application;
- collapsed Guided Notes;
- collapsed Lesson Practice;
- collapsed Reflection;
- Lesson Completion Checklist after Reflection;
- clickable checklist navigation that opens and jumps to a section;
- passive study sections manually checkable;
- activity-backed sections synchronized to learner evidence;
- Lesson Practice auto-completes only at >=80% mastery;
- Next Lesson unlocks only after checklist completion AND >=80% mastery.

## Preservation contract

The migration does not replace lesson curriculum, question banks, learning games, specialized laboratories, unit maps, vocabulary stores, assessment scoring, or learner-record keys.

The protected Pre-Algebra course landing page remains unchanged.

## Implementation status

**COURSE LESSON SHELL ROLLOUT: COMPLETE FOR UNITS 01–13**

Next QA stage:
1. Representative visual/runtime check in each unit.
2. Verify specialized lab controls after DOM normalization.
3. Verify no legacy header duplicates remain visible.
4. Verify effective rendered text remains >=16px.
5. Verify checklist/mastery gate on one lesson per unit.
