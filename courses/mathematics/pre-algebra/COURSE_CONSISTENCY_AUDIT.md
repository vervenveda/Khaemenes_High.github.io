# Pre-Algebra Course Consistency Audit

**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Course path:** `courses/mathematics/pre-algebra/`  
**Audit focus:** lesson-page consistency, assignment language, grading semantics, navigation clarity, and parent/teacher review readiness.

---

## 1. Course-wide standard to enforce

The Pre-Algebra course should present every live lesson with the same student-facing expectation:

> The student completes the lesson practice, submits the assignment, the system records the score where auto-grading is available, and parents/teachers may review the work afterward.

This means the core action language should be consistent across the course:

- Use **Submit Assignment** for the main scored action.
- Use **Save Draft** only for unfinished work.
- Use **Review Lesson** or **Mark Lesson Reviewed** only as a secondary reading/progress action, never as a substitute for assignment submission.
- Use **Mastery** only when the submitted score meets the course threshold.
- Keep **reviewed**, **submitted**, **scored**, and **mastered** as separate states.

---

## 2. Course structure findings

The Pre-Algebra course is not using one fixed lesson count per unit. That is acceptable, but it means consistency must be checked by behavior and interface pattern, not by assuming every unit has the same number of files.

Observed structure pattern:

- Unit 00 exists as a support/readiness unit.
- Units 01–13 are the official course units.
- Several core units have 7 or 8 lesson files.
- Unit 13 has a shorter capstone/readiness structure.
- Later units use much larger lesson files, which suggests expanded embedded content and/or fuller independent lesson pages.

This is not automatically a problem. The course can remain strong with varied lesson counts as long as the student experience remains predictable.

---

## 3. Primary inconsistency found

The most important inconsistency is not the curriculum sequence. The main issue is **language mismatch between the lesson interface and the grading model**.

Several lesson pages use auto-grading logic and submission handlers, but the visible student-facing button language still suggests informal checking, such as:

- **Check My Answers**
- **Mark Lesson Reviewed**

Those labels make the activity feel like optional self-check practice, even when the page is functioning as a scored lesson assignment.

### Required correction

Across all lesson pages, the main action should become:

> **Submit Assignment**

Supporting result language should say:

> Your assignment has been submitted and scored. Parents or teachers may review the saved result.

Avoid phrasing that implies the teacher is the first grader when the system is already auto-scoring the practice.

---

## 4. State-language standard

Use this vocabulary consistently:

| State | Meaning | Student-facing language |
|---|---|---|
| Draft | Work is saved but not scored | `Draft saved on this device.` |
| Submitted | Student pressed the main assignment button | `Assignment submitted.` |
| Scored | System calculated a score | `Score recorded.` |
| Mastered | Score meets the mastery threshold | `Mastery earned.` |
| Reviewed | Student opened/read lesson material or parent/teacher reviewed work | `Lesson reviewed.` |

Do not treat `reviewed` as the same thing as `mastered`.

---

## 5. Navigation and page-shell consistency checklist

Every lesson page should have:

- Course breadcrumb back to Pre-Algebra home.
- Unit breadcrumb back to the current unit index.
- Previous lesson link when available.
- Next lesson link when available.
- Unit assessment link after the final lesson of a unit.
- Print button or print-friendly layout.
- Calculator/tool link when relevant.
- Student-safe privacy note for locally stored progress.
- Clear score/status area near the submission section.

---

## 6. Lesson interaction consistency checklist

Every scored lesson should have:

- One clearly identified scored practice/assignment section.
- A main button labeled **Submit Assignment**.
- A visible score result after submission.
- Local score saving under the course progress system.
- Draft saving that does not falsely mark mastery.
- Retry behavior that is clear to the student.
- A mastery threshold message matching the course rule.
- Parent/teacher review language after submission.

---

## 7. Repair priority

### Priority A — language and trust repair

Replace informal or ambiguous action labels across lesson pages:

- `Check My Answers` → `Submit Assignment`
- `Mark Lesson Reviewed` → keep only as a secondary reading/review action, or rename to `Save Lesson Review`
- `Teacher will assess` → `Submitted work is saved for parent/teacher review` when auto-scoring is active

### Priority B — status and mastery repair

Standardize result messages:

- `Assignment submitted.`
- `Score recorded: __%.`
- `Mastery earned.`
- `Keep practicing; mastery is earned at 80%.`

### Priority C — navigation repair

Verify all lesson pages link correctly to:

- Pre-Algebra course home
- Unit home
- Previous lesson
- Next lesson
- Unit assessment
- Calculator/tools where appropriate

### Priority D — style repair

Preserve each unit’s visual identity, but standardize:

- button hierarchy
- status panel placement
- printable layout
- card spacing
- mobile behavior
- black body text and clear math readability

---

## 8. Recommended patch strategy

Do not rewrite the whole course at once.

Recommended sequence:

1. Patch Unit 01 manually because its stylesheet and lesson shell are more custom.
2. Patch Units 02–04 together if they share the same compact lesson shell.
3. Patch Units 05–08 as the next group after checking their shared strings and handlers.
4. Patch Units 09–12 carefully because their lesson files are larger and may include more embedded interaction.
5. Patch Unit 13 last because it is a capstone/readiness unit and may need slightly different language.
6. Re-run a string audit after each group.

---

## 9. Final course rule

The Pre-Algebra course should feel like a real school course, not a loose set of practice pages.

The consistent pattern should be:

> Learn → Practice → Submit Assignment → Score Recorded → Mastery Checked → Parent/Teacher Review Available → Continue.

This keeps the course aligned with the Khaemenes Academy standard while preserving the local-first, privacy-respecting design.
