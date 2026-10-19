# High School Physical Education Hardening Status

**Surface:** `courses/physical-education/index.html`  
**Latest audit-fix commit:** `d709135256e72591cff943f2d9e4d43dfca5b6bf`  
**Latest Grade 9 instructional-bank commit:** `be4abc8ffa38355b0fbb9f652690e9675b43aa34`

## Latest forensic re-audit

### Fixes confirmed on main

- **Mastery gates are Grade 9 only.** A week counts as passed only when the student has the matching Grade 9 weekly assessment schema, a passing quiz result, at least 80%, and saved practice evidence and reflection. Grades 10–12's generic formative checks cannot award mastery or unlock progression.
- **Grades 10–12 remain navigable previews.** Their 36-week topic outlines remain accessible for study, but the portal now labels them as previews and saves their three-question checks as formative records rather than mastery records. Detailed grade-specific instruction and randomized assessment banks remain to be authored.
- **Midterm prerequisites use validated weekly completion.** The Grade 9 midterm readiness count now checks the same validated weekly completion predicate instead of counting any legacy record that happens to have an 80% score.
- **A saved midterm draft does not unlock final readiness.** The final readiness state requires all 36 validated Grade 9 weekly records and an explicitly teacher-approved, verified midterm record. The current page saves exam responses as unverified drafts for print/export and external review; it does not itself certify the exam.
- **The existing 80% policy is retained.** Local scores and journals remain practice evidence, not transcript credit or an authenticated teacher record.
- Pre-K remains separated in `Khaemenes_Preschool.github.io`; its 42-lesson portal, 126-item check pool, individualized adult guidance, accessible alternatives, and linked printable teacher guide are still present.

## Grade 9 bank validation

The instructional JSON contains 36 weeks and 180 instructional days (five per week). It includes 925 weekly assessment questions: 30 questions in Weeks 1–5 and 25 questions in Weeks 6–36. Source-level checks confirm that every week has a unique prompt within its bank, three or more distinct choices per question, a valid correct-choice index, and a non-empty rationale.

The portal selects 20 questions per Grade 9 attempt and shuffles question and answer order. These checks validate data structure and source wiring, not item difficulty calibration or a live browser journey.

## Three remaining audit priorities

1. **Question quality and item-bank diversity.** Weeks 9–36 retain five repeated prompt structures per weekly bank (target statement, access barrier, evidence choice, safety response, and revision). Keep essential cross-cutting safety checks, but replace generic scaffolds with topic-specific scenarios, misconception checks, application items, and plausible distractors; then review difficulty and answer rationale distribution.
2. **Full browser regression.** Test first attempts, incomplete attempts, failed retakes, passed attempts, reload/resume, export/import, and next-week lock states in desktop and tablet browsers. Source syntax checks have passed, but an interactive regression was not run in this audit.
3. **Build Grades 10–12 as real courses.** Replace each generic topic spine with grade-specific weekly lessons, 20+ reviewed questions per week, randomized snapshots, practical evidence, instructor rubrics, and the same mastery policy before those grades receive formal progression gates.

## Validation boundary

- The high-school portal, Pre-K portal, and Pre-K teacher guide inline JavaScript pass syntax checks.
- The Grade 9 JSON parses; all 36 weekly banks pass structural checks.
- This is not a live-browser/device regression, a formal standards-alignment certification, or teacher verification of student learning.
