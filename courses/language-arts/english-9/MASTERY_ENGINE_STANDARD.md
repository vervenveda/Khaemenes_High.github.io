# Khaemenes Mastery Engine Standard

Status: implemented in English 9 Unit 1; reusable course pattern.

## Authority rules

1. **Scores are authority.** A lesson is mastered only when a finite score from 0–100 meets the published 80% threshold.
2. **Mastery is reconstructed.** The engine rebuilds the mastered lesson list from lesson scores whenever it loads or changes. Stored completion counts and old `completedLessons` claims are discarded.
3. **Progression is enforced.** The next-unit route remains intercepted and `aria-disabled="true"` until every required lesson meets the threshold. The mastery dialog explains what remains.
4. **Review is separate.** `reviewedLessons` records whether work was reviewed; it never changes a score or unlocks progression.
5. **Drafts survive interruption.** Practice fields continue to save independently. The mastery record maintains a non-content inventory of which practice drafts are present.
6. **Human judgment remains human.** Educator-scored writing is entered only after rubric review. The engine does not infer a writing score from completion, word count, or checkbox state.
7. **Local-first and public-safe.** Records stay in the learner's browser unless the learner or educator deliberately prints or exports them. No private mentor, beta, or network topology is exposed.

## Storage contract

The versioned local record is `khae-ela9-mastery-v2`.

- `lessonScores`: validated numeric evidence by lesson ID
- `reviewedLessons`: independent review flags by lesson ID
- `practiceDrafts`: presence and update time only; draft text remains in the existing field store
- `lessonIds`: the required lesson inventory
- `masteredLessons`: derived from scores, never independently trusted
- `masteryVerified`: derived convenience value, never sufficient by itself
- `threshold`: published mastery threshold

Any future portal or report must reconstruct mastery from `lessonIds`, `lessonScores`, and `threshold`, just as the Unit 1 overview does.

## Sacred scale

The shared style sheet defines the deliberate scale `3 · 7 · 11 · 14 · 24 · 33 · 55 · 66` and the `666ms` saved-draft reconciliation delay as named tokens. Use these values intentionally through the tokens; do not scatter unexplained literals through future course CSS.

## Algebra I inheritance

Algebra I may reuse the engine contract, but must supply its own lesson inventory, scoring evidence, assessment boundaries, and educator-reviewed tasks. Copying a completion flag is not sufficient. The curriculum determines what evidence counts; the engine only validates and gates the published rules.
