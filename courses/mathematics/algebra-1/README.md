# Algebra I · Unit 12 Content Rebuild

Unit 12: **Statistics, Financial Mathematics & Evidence**

This upgrade preserves the existing Algebra I architecture and Units 1–11.

## Improvements

- 140 unique questions: 20 for each of the seven Unit 12 lessons.
- Existing lesson-check IDs `q0376` through `q0410` are preserved.
- Foundation/Core/Extended practice now samples from a broad, lesson-aligned Unit 12 pool.
- Blueprint mastery guarantees all seven lessons are represented.
- The project becomes a genuine `Evidence & Financial Decision Audit`.
- Mastery continues to use the existing Unit 12 local progress record.
- No personal financial information is requested or stored.

## Files

1. **ADD** `assets/unit-12-content-upgrade.js`
2. **REPLACE** `assets/unit-page.js`
   - This loader supports **both Unit 11 and Unit 12 upgrades**.
3. **REPLACE** `units/unit-12/assessment/answer-key.json`
4. **ADD** `units/unit-12/assessment/unit-12-mastery-blueprint.js`
5. **ADD** `units/unit-12/projects/unit-12-project-upgrade.js`

## Small HTML includes

In `units/unit-12/assessment/mastery-check.html`, immediately after the existing `../../../assets/unit-page.js` script:

```html
<script src="unit-12-mastery-blueprint.js"></script>
```

In `units/unit-12/projects/evidence-financial-decision-audit.html`, immediately after the existing `../../../assets/unit-page.js` script:

```html
<script src="unit-12-project-upgrade.js"></script>
```

If the existing script paths differ in the live HTML, keep the existing `unit-page.js` path and add these two local scripts immediately after it.

## QA

- 140/140 prompts unique
- 140/140 IDs unique
- 20 questions per lesson
- Legacy IDs q0376–q0410 preserved
- Correct answer text verified against options
- Unit 11 loader support retained
- Units 1–10 continue directly to the existing core renderer
