# High School Physical Education Hardening Status

**Surface:** `courses/physical-education/index.html`  
**Latest portal code commit:** `c00c4b649bae1ee269b3e0c7d40ab690539c6f0e`  
**Latest Grade 9 instructional-bank commit:** `8eb63db34246d00fff7c5b9e3c97329d343b63bd`

## Repairs applied

- Aligned the Grade 9 completion predicate with the assessment engine's released range: Weeks 1–8 may use the randomized 20-question attempt when the week supplies at least 20 reviewed-format items.
- Grade 9 Weeks 1–12 can now use randomized 20-question attempts, because their banks contain at least 25 questions each. Weeks 13–36 remain unreleased for mastery: an approved 20-question bank is required before a week can award local mastery or unlock the next week.
- Marked Grades 10–12 current three-question checks as formative. Their topic spines are not represented as grade-specific randomized mastery banks or teacher-verified credit.
- Fixed a retake blocker: failed Grade 9 attempts no longer reuse a submitted attempt ID. Every retry receives a new attempt identity; prior attempt snapshots remain immutable and reviewable with the learner's answers, correct answers and rationales.
- Preserved the 80% threshold and the existing rule that browser-local results are provisional and require authorized teacher review for formal mastery.

## Question-bank inspection

The Grade 9 instructional source contains 36 weekly units and five instructional days per week. Current assessment readiness:

| Weeks | Questions available per week |
|---|---:|
| 1–5 | 30 each |
| 6–12 | 25 each |
| 13–36 | 5 each |

For Weeks 1–12, source-level validation found unique prompts within each week's bank, at least three distinct choices per question, an in-range correct index, and a non-empty rationale. The engine selects 20 questions and shuffles both question order and answer order.

## Remaining release work

1. Author and review the remaining 20+ question banks for Grade 9 Weeks 9–36.
2. Replace Grade 10–12 topic-spine checks with grade-specific instruction, abundant independent question banks, randomized attempts, rationales, saved attempt snapshots and explicit teacher-review records.
3. Extend midterm/final coverage and assess all coursewide routes and persistence in live browsers.

## Validation boundary

- The updated inline JavaScript parses successfully.
- Course data was inspected directly from the repository's `main` branch.
- These are source/data checks, not a live-browser regression run. Browser-local records remain drafts; static pages cannot certify mastery or transcript credit.
