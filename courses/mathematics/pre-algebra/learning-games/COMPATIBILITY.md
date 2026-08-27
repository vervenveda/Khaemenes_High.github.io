# Learning-game compatibility paths

These small redirect files preserve older Pre-Algebra lesson/game URLs while the learning-game library is being normalized for reuse across Mathematics courses.

They are compatibility shims only. Existing connected Pre-Algebra games remain in their current `unit-XX-YY-*` directories as supported legacy course assets. No game logic, scoring, or instructional content is duplicated here.

## Cutover rule

Do not rename or relocate the existing connected Pre-Algebra games merely to match the new shared architecture.

Beginning with new reusable Mathematics games, create the canonical game under:

`courses/mathematics/assets/learning-games/<topic-or-game-name>/`

Shared game names must be topic- or game-based and must not include unit, lesson, week, grade, or course-placement numbers.

Pre-Algebra and other Mathematics courses should reference the shared game from the pertinent lesson or course-specific placement map.
