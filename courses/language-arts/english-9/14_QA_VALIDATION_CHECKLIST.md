# A+++ QA / Validation Checklist

## Curriculum
- [ ] 12 units present
- [ ] 36 weeks present
- [ ] 180 daily blocks present
- [ ] Every unit has canonical evidence
- [ ] Every week has mastery check/correction/reassessment

## Assessment
- [ ] Every canonical assessment has an ID
- [ ] Every objective item has skill tags
- [ ] Mastery threshold is explicit
- [ ] Attempt history is preserved
- [ ] Lower retake cannot erase prior mastery
- [ ] Human-review work is clearly marked

## Accessibility
- [ ] Keyboard
- [ ] Screen reader
- [ ] Focus
- [ ] Contrast
- [ ] Reduced motion
- [ ] Print
- [ ] Alternate response modes where valid

## Technical
- [ ] No broken internal links
- [ ] No duplicate IDs
- [ ] Valid HTML
- [ ] Valid JSON
- [ ] Valid assessment answer structures
- [ ] No console errors
- [ ] Local-first behavior preserved

## Academic integrity
- [ ] AI may support process where permitted
- [ ] Student authorship remains visible
- [ ] Source/citation evidence retained
- [ ] Human review remains authoritative for complex work

## Shared four-grade regression

- [ ] Run `tests/cross-grade-regression.mjs`.
- [ ] The shared suite must pass before an English 9–12 release is called parity-safe.
- [ ] Do not fork the shared test logic into grade-local copies; update `courses/language-arts/tests/english-9-12-regression.mjs` instead.
