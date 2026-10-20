# Grade 9 Historical Vocabulary Audit — 20 October 2026

## Verified inventory
- Canonical glossary: `data/glossary.json`, 214 unique entries.
- Every one of the 36 weeks has six assigned glossary terms (216 week-to-term assignments; some terms recur).
- Standalone mastery assessments: 36 canonical `weeks/week-XX/quiz.json` files, ten objective items each; all have in-range answer indices.
- Only Weeks 1–3 explicitly contain `masteryPercent: 80` in the weekly quiz file. Other weeks depend on course-level logic and require runtime verification; do not infer that the gate is absent.
- Week 27 uses `weeks/week-27/student-packet-v2.html`; do not create a duplicate file.

## Detected lesson/glossary drift before repairs
Raw source text search found glossary terms absent from multiple canonical packet bodies, especially Weeks 10–23 (e.g. iconoclasm, griot, shogunate, demography, printing press, indulgence, Middle Passage). The raw-text method is an initial screening, not proof of a pedagogical gap. Highlighting was inconsistent with the glossary terminology.

## Repairs committed
- Added `resources/weekly-vocabulary.html`: six-term shuffled formative matching-style multiple-choice practice per selected week, with 80% practice target, read-only glossary source, printable review, and JSON export of completed attempt.
- Added prominent quiz access to `index.html` and `app.html`.
- Added a clearly highlighted glossary panel and weekly quiz link to each of the 36 canonical weekly student packets, without modifying the existing reading, weekly quiz, learner records, or progression code.
- Each panel uses the glossary's recorded definition and week mapping rather than inventing terms.

## Still required to certify academy-wide coverage
1. Verify visually that weekly vocabulary buttons, `<mark>` styling, quiz interactions, downloads, keyboard flow, and 255px/mobile layout work in browsers and print correctly.
2. Distinguish a term displayed in the new weekly panel from true introduction and application **inside the reading itself**; audit instructional explanations, examples, and assessments lesson by lesson.
3. Audit Math (Pre-Algebra, Algebra I, Geometry, Algebra II), English/Language Arts 9–12, Science 9–12, and other high-school courses for actual lesson-linked vocabulary, reviewed banks, and vocabulary quizzes. The presence of JSON vocabulary files alone is not sufficient evidence of a weekly quiz.
4. Verify the Grade 9 official portal's 80% gate runtime and assessment grading behavior. Formative vocabulary practice is separate from, and does not unlock, the official weekly mastery quiz.
5. If vocabulary quizzes are to become *required* for progression, integrate scores into the official course record only after explicit learner-journey and retake testing.
6. Expand and independently subject-review the glossary where the lesson contains important concepts absent from the six assigned terms; do not automatically scrape every capitalized or bold phrase into the dictionary.

## Implementation principle
One canonical grade-level glossary, no duplicate competing dictionary; reusable weekly practice UI; subject-specific terminology and independent source review; preserve the official 80% mastery integrity.
