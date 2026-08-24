# Pre-Algebra Course Repair Log

**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Course path:** `courses/mathematics/pre-algebra/`  
**Repair focus:** assignment submission language, auto-grading trust, responsive lesson layout, and student-facing consistency.

---

## Repair wave 01 — Units 01–04 submission-language patch

### Completed

The shared unit stylesheets for Units 01–04 were updated so the main student-facing lesson action is visually standardized as:

> **Submit Assignment**

The secondary review action is visually standardized as:

> **Save Lesson Review**

The score/status area now receives a clearer visible prefix:

> **Assignment status:**

### Files updated

- `units/unit-01/assets/unit.css`
- `units/unit-02/assets/unit.css`
- `units/unit-03/assets/unit.css`
- `units/unit-04/assets/unit.css`

### Why this was done first

Many lesson HTML files are compressed into long single-line documents. A shared stylesheet patch repairs the daily student-facing experience without risking accidental damage to the existing lesson JavaScript, scoring handlers, local progress keys, or answer logic.

### Important remaining item

This first repair wave is a visible-interface repair. The deeper semantic pass should still replace the actual HTML button text inside each lesson page when the lesson files are normalized or safely edited. That will make the accessible name match the visible label for screen readers and browser translation tools.

---

## Course-wide standard now being enforced

The intended student flow is:

1. Learn the lesson.
2. Complete the practice.
3. Press **Submit Assignment**.
4. The system scores the submitted work where auto-grading is available.
5. The score is saved locally under the course progress system.
6. Parents or teachers may review the saved result afterward.
7. Mastery unlocks the next step when the course threshold is met.

---

## Next recommended repair wave

1. Verify Units 01–04 live pages on laptop, tablet, and phone.
2. Replace compressed lesson HTML labels directly when safe.
3. Continue the shared stylesheet patch through Units 05–13.
4. Audit assessments and tests for the same language standard: **Submit Test**, **Score Recorded**, **Parent/Teacher Review Available**.
