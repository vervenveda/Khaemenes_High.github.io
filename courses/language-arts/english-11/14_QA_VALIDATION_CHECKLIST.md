# A+++ QA / Validation Checklist — English 11

Use the release gates in `../ENGLISH_9_12_A_PLUS_PLUS_PLUS_CANONICAL_CONTRACT.md#8-release-gates`.

Course-specific checks:
- [ ] 12 units present
- [ ] 36 weeks present
- [ ] 180 daily blocks represented by the course curriculum
- [ ] UNIT01–UNIT12 evidence-alignment records present
- [ ] 80% mastery threshold explicit
- [ ] Completion does not grant mastery
- [ ] Attempt history contract present
- [ ] Human-review boundary preserved
- [ ] Source custody preserved
- [ ] Typography release override present
- [ ] Release-readiness regression test passes
- [ ] Assessment authority/answer keys unchanged by curriculum presentation upgrades

## Shared four-grade regression

- [ ] Run `tests/cross-grade-regression.mjs`.
- [ ] The shared suite must pass before an English 9–12 release is called parity-safe.
- [ ] Do not fork the shared test logic into grade-local copies; update `courses/language-arts/tests/english-9-12-regression.mjs` instead.
