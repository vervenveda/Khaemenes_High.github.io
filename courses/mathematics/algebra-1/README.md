# Algebra I · Unit 13 Capstone Rebuild

Unit 13: **Integrated Mathematical Modelling Capstone**

## What this fixes

The prior 25-item capstone bank reused essentially three answer ideas across five lessons. This package replaces that shallow layer while preserving the course architecture.

- 100 unique questions: 20 per capstone lesson.
- Existing IDs `q0411`–`q0435` preserved.
- Balanced 20-question mastery: exactly 4 questions from each lesson.
- Stronger modelling portfolio + oral defence.
- Existing Unit 13 progress record remains authoritative.
- Unit-page loader continues to support Unit 11 and Unit 12 upgrades.

## Files

1. **ADD** `assets/unit-13-content-upgrade.js`
2. **REPLACE** `assets/unit-page.js`
3. **REPLACE** `units/unit-13/assessment/answer-key.json`
4. **ADD** `units/unit-13/assessment/unit-13-mastery-blueprint.js`
5. **ADD** `units/unit-13/projects/unit-13-project-upgrade.js`

## HTML includes

Add after the existing shared `unit-page.js` script on:

`units/unit-13/assessment/mastery-check.html`

```html
<script src="unit-13-mastery-blueprint.js"></script>
```

Add after the existing shared `unit-page.js` script on the Unit 13 project page:

```html
<script src="unit-13-project-upgrade.js"></script>
```

## QA

- 100/100 unique prompts
- 100/100 unique IDs
- 20 questions per lesson
- q0411–q0435 preserved
- Unit 11 loader preserved
- Unit 12 loader preserved
- Unit 13 loader active
