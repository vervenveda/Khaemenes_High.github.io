# High School Physical Education Hardening Status

**Surface:** `courses/physical-education/index.html`  
**Latest portal code commit:** `a0b7f4a5090ffb656516d888629ed724a08f038c`  
**Latest Grade 9 instructional-bank commit:** `be4abc8ffa38355b0fbb9f652690e9675b43aa34`

## Repairs applied

- Aligned the Grade 9 completion predicate and attempt creation with each week's validated bank and the 80% mastery threshold.
- All 36 Grade 9 weeks can now use randomized 20-question attempts. Each bank has at least 25 questions. The portal selects 20 per attempt, shuffles question and answer order, and applies the 80% threshold. Teacher review remains required for formal credit.
- Marked Grades 10–12 current three-question checks as formative. Their topic spines are not represented as grade-specific randomized mastery banks or teacher-verified credit.
- Fixed a retake blocker: failed Grade 9 attempts no longer reuse a submitted attempt ID. Every retry receives a new attempt identity; prior attempt snapshots remain immutable and reviewable with the learner's answers, correct answers and rationales.
- Preserved the 80% threshold and the existing rule that browser-local results are provisional and require authorized teacher review for formal mastery.

## Question-bank inspection

The Grade 9 instructional source contains 36 weekly units and five instructional days per week. Current assessment readiness:

| Weeks | Questions available per week |
|---|---:|
| 1–5 | 30 each |
| 6–36 | 25 each |

For all 36 weeks, source-level validation found unique prompts within each week's bank, at least three distinct choices per question, an in-range correct index, and a non-empty rationale. The engine selects 20 questions and shuffles both question order and answer order.

## Remaining release work

1. Author and review the remaining 20+ question banks for Grade 9 Weeks 9–36.
2. Replace Grade 10–12 topic-spine checks with grade-specific instruction, abundant independent question banks, randomized attempts, rationales, saved attempt snapshots and explicit teacher-review records.
3. Extend midterm/final coverage and assess all coursewide routes and persistence in live browsers.

## Validation boundary

- The updated inline JavaScript parses successfully.
- Course data was inspected directly from the repository's `main` branch.
- These are source/data checks, not a live-browser regression run. Browser-local records remain drafts; static pages cannot certify mastery or transcript credit.
