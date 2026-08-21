# Algebra I · Unit 11 Content Rebuild

This package upgrades Unit 11 without changing Units 1–10.

## What it fixes

- 120 unique Unit 11 questions: 20 per lesson.
- Existing q0346–q0375 IDs remain valid for the five-question lesson checks.
- Foundation/Core/Extended practice now draws from a substantially broader bank.
- A blueprint mastery override guarantees all six lessons appear in the 20-question mastery check.
- The Unit 11 project becomes a real coordinate-geometry/accessibility design investigation.
- No new gradebook is introduced; the mastery override writes to the existing Unit 11 progress record.

## Files to add/replace

1. **ADD** `assets/unit-11-content-upgrade.js`
2. **REPLACE** `assets/unit-page.js`
3. **REPLACE** `units/unit-11/assessment/answer-key.json`
4. **ADD** `units/unit-11/assessment/unit-11-mastery-blueprint.js`
5. **ADD** `units/unit-11/projects/unit-11-project-upgrade.js`

## Two small HTML includes

In `units/unit-11/assessment/mastery-check.html`, immediately after the existing `unit-page.js` script tag:

```html
<script src="unit-11-mastery-blueprint.js"></script>
```

In `units/unit-11/projects/coordinate-geometry-accessibility-design.html`, immediately after the existing `unit-page.js` script tag:

```html
<script src="unit-11-project-upgrade.js"></script>
```

The replacement `assets/unit-page.js` automatically loads `unit-11-content-upgrade.js` **only when PAGE_REF.unit === 11**. Other units continue directly to the existing `unit-page-core.js`.

## QA performed

- 120/120 prompts unique.
- 120/120 IDs unique.
- 20 questions per lesson.
- Legacy lesson-check IDs q0346–q0375 preserved.
- Every answer_text exists in its options.
- Every answer index is generated from the exact correct option.
- No changes to Units 1–10.
