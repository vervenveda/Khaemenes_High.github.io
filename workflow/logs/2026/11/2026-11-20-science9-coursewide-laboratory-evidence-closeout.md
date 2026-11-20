# 2026-11-20 · Science 9 course-wide laboratory/evidence closeout

## Scope

Course-wide normalization and regression coverage for Integrated Science 9 laboratory/evidence workspaces.

### Units 01–09

Canonicalized:
- 27 interactive laboratory/evidence workspaces
- 16 linked Unit 06–09 question-check gates

Preserved:
- unit runtime files
- `science-formative-evidence.js` where used
- dedicated lab/app runtimes where present
- dedicated question-check app runtimes
- 7/8 mastery thresholds for the linked checks
- correction / retake behavior

### Units 10–12

Previously completed in the same session:
- 12 interactive laboratories
- 12 linked 7/8 question checks

Protected Unit 12 prototype-testing zero-baseline guard remains intact.

## Unit 12 totals correction

A real display/runtime mismatch was found:

- `mastery-quiz.html` displayed **20 objective questions / 16 needed**
- live `quiz-app.js` uses `FORM_COUNT=15`

The page display was corrected to:

**15 objective questions · mastery threshold 12/15 (80%)**

The full Unit 12 unit assessment remains correctly aligned:

**25 objective questions · mastery threshold 20/25 (80%)**

The scoring engines were not changed.

Display correction commit:
`ae786fea395703996adb1b41711f1dfab93dd4f0`

Validator protection commit:
`ff850c76ebb0ed1b2bb08fcf0ddf7ff0d8f30f31`

## Science 9 regression coverage

The dedicated validator now covers the major assessment, record, focused-practice, laboratory and linked-check surfaces, including:
- readiness / cumulative assessment fronts
- Unit 01–12 mastery quizzes and unit assessments
- printable and student-record companions
- Unit 05 focused evidence checks
- Units 01–12 laboratory/evidence workspaces
- linked Unit 06–12 7/8 checks
- Unit 12 zero-baseline guard
- Unit 12 displayed/runtime assessment totals

Current protected page count in the validator: **116 pages**.

## Source verification

- Units 01–05 laboratories: PASS
- Units 06–07 laboratories: PASS
- Units 08–09 laboratories: PASS
- Units 06–07 linked checks: PASS
- Units 08–09 linked checks: PASS
- Units 10–12 laboratories: PASS
- Units 10–12 linked checks: PASS
- Unit 12 display/runtime totals: PASS
- Unit 12 zero-baseline guard: PASS

Hosted GitHub Actions: UNVERIFIED.
Browser/device acceptance: HOLD.
