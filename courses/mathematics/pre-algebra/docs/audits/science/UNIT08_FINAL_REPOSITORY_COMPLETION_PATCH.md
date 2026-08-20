# Unit 08 Final Repository Completion Patch

**Prepared August 3, 2026**

## Repository findings corrected

1. Unit 08 student and educator files were installed, but the root course map still identified Unit 07 as the current release.
2. The three Units 05–07 cumulative educator resources were absent from `teacher-resources/science/`.
3. The Unit 08 motion graph accepted any strictly increasing finite times but scaled horizontal position by `time / maxTime`. This could fail when the final time was zero and could mis-scale records whose first time was not zero.

## Corrected behavior

- Course release status is `unit-08-open`.
- Current release is `Unit 08 — Motion, Forces & Energy`.
- Units 00–08 are open and Units 09–12 are planned.
- The three Units 05–07 educator resources are restored.
- Motion-graph horizontal scaling now uses `(time − minimum time) ÷ elapsed time`.
- Negative starting times and nonzero starting times display correctly when the record is strictly increasing.
- The application explicitly verifies a positive elapsed interval.
- Existing motion calculations, local storage key, practice scenario, and student route remain unchanged.

## Replacement paths

```text
courses/science/integrated-science-9/course-map.json
courses/science/integrated-science-9/units/unit-08/motion-lab.js
```

## Added paths

```text
teacher-resources/science/UNITS05-07_CUMULATIVE_ANSWER_KEY.md
teacher-resources/science/UNITS05-07_CUMULATIVE_RUBRIC.md
teacher-resources/science/UNITS05-07_CUMULATIVE_ADMINISTRATION_GUIDE.md
docs/audits/science/UNIT08_FINAL_REPOSITORY_COMPLETION_PATCH.md
```

## Deployment tests

1. Confirm the Science 9 map identifies Unit 08 as current.
2. Confirm all three cumulative educator files open.
3. Enter times `10, 11, 12, 13, 14`; the motion graph must use the full width.
4. Enter times `−4, −3, −2, −1, 0`; the graph must remain finite and display correctly.
5. Enter duplicate or decreasing times; the laboratory must reject the record.
