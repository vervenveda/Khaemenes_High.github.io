# 2026-11-16 · English 9–12 Academic Curriculum Alignment Audit

- **Repository:** `vervenveda/Khaemenes_High.github.io`
- **Date/timezone:** November 16, 2026 · America/New_York
- **Type:** forensic source audit · curriculum repair · assessment metadata · regression validation
- **Status:** Source-level alignment review complete; remaining editorial and browser/Node verification HOLD
- **Scope:** All four canonical `assets/curriculum-data.js` datasets and Unit 01 assessment landing pages, plus sampled Week 01 routes
- **Boundary:** No student work, grades, mastery decisions or assessment attempts accessed or modified

## Verified source-level coverage

| Course | Units | Weeks | Assigned-reading records | Weekly course-bank questions* | Unlabeled question skills after this repair |
| --- | ---: | ---: | ---: | ---: | ---: |
| English 9 | 12 | 36 | 36 | Separate Grade 9 assessment architecture | Not measured using upper-grade schema |
| English 10 | 12 | 36 | 36 | 180 (5 per week) | 72 |
| English 11 | 12 | 36 | 36 | 180 (5 per week) | 66 |
| English 12 | 12 | 36 | 36 | 180 (5 per week) | 0 |

*These counts describe `weeks[].quiz` question records, **not** the full Monte Carlo assessment banks, unit exam forms or actual questions delivered to the learner.

The source-level structural inspection found no missing weekly question prompts, answer-option arrays, valid correct-answer indices, answer explanations, basic weekly writing tasks, essential questions, unit assessment product descriptions, or assigned-reading title/author fields in the inspected canonical data. All 36 upper-grade reading records have the expected week numbers. **This does not establish that every question is sufficiently rigorous, non-redundant, fair, correctly keyed by subject-matter review, or delivered as intended in a browser.**

## Findings and decisions

| ID | Priority | Finding | Action / status |
| --- | --- | --- | --- |
| ELA-A01 | High | English 9 Week 12 lesson teaches comparative poem translation and performance, but its canonical `readingSuggestion` was an unrelated student-selected short story | **Repaired** with paired teacher-approved translations of a poem, edition/translator citations and oral interpretation task |
| ELA-A02 | High | English 9 Week 24 teaches data, visual rhetoric and accessibility, but its canonical `readingSuggestion` was a poem for performance | **Repaired** with source-verifiable data visualization and accessibility analysis |
| ELA-A03 | Medium | English 10 lacked `skill` labels on 108 of its 180 weekly question records. Exactly 36 were explicitly worded as weekly-transfer checks | **Repaired** the 36 self-identifying `Weekly Transfer` tags; 72 remaining require question-specific editorial classification |
| ELA-A04 | Medium | English 11 has 66 unlabeled weekly question skill tags | **Open** for question-specific human editorial review; no generic or invented labels assigned |
| ELA-A05 | Medium | English 9 uses distinct unit-evaluator demonstrations and 8/10 reviewed mastery; English 10–12 split selected-response scoring and performance artifacts | **Preserve** these authority boundaries. Verify rubrics and evaluator intake separately rather than overwriting Grade 9 architecture |
| ELA-A06 | Medium | Unit assessment pages describe appropriate performance products, but a landing-page description alone does not prove completed educator review, actual rubric scoring, or faithful delivery | **HOLD** for deeper route/rubric and browser tests |
| ELA-A07 | Medium | Current canonical course data models 36 weeks; the broader Academy has sometimes planned 42-week schedules | **Decision needed** before any 42-week expansion. Do not fabricate six weeks or silently alter established course coverage |

## Direct source repairs

- [55978d8](https://github.com/vervenveda/Khaemenes_High.github.io/commit/55978d8a0fedd7f9cd4aa9ad088e1dc651071b21): change only English 9 Week 12 and Week 24 `readingSuggestion` records in the canonical curriculum. Each is now aligned with the existing unit scope, weekly question, writing product and evidence objective; neither links to an unverified or unlawful full-text source.
- [65bfb96](https://github.com/vervenveda/Khaemenes_High.github.io/commit/65bfb966efc7726ad5adb4128aad7a5ff832b669): annotate exactly 36 English 10 weekly transfer questions with `skill: "Weekly Transfer"`. Preserve question texts, options, correct answers, explanations and all scoring/milestone metadata.
- [ec38813](https://github.com/vervenveda/Khaemenes_High.github.io/commit/ec388131f0cb2f75f4d58792230b2b6418a0fa2c): create `courses/language-arts/tests/english-9-12-curriculum-alignment-audit.mjs`, a native Node, read-only regression for all four data architectures. It checks 12-unit/36-week structure, consistent numbering, reading fields, essential questions, writing tasks, upper-grade mastery-evidence descriptors, weekly question shape/correct-answer indices/rationales, and unit assessments/standards. Missing upper-grade `skill` tags appear as warnings, not invented completions.
- [d1d8859](https://github.com/vervenveda/Khaemenes_High.github.io/commit/d1d88594bfb89e7be371599b5112612f907377ec): add the audit suite to the English reading alignment GitHub Actions workflow.

## Validation register

| Validation | Result | Basis |
| --- | --- | --- |
| Curriculum source JSON structure / 12 units / 36 weeks per grade | PASS (direct V8 inspection) | Four canonical datasets |
| Reading title/author present and upper-grade reading weeks numbered | PASS (direct V8 inspection) | 144 reading records |
| Upper-grade weekly quiz shape, correct-answer ranges, nonempty explanations | PASS (source metadata inspection) | 540 `weeks[].quiz` questions |
| English 9 Week 12/24 reading suggestion changes | PASS (freshly parsed source, after update) | Source file parse and targeted fields |
| English 10 transfer skill tagging count | PASS (source transformation inspection) | 36 tags, 72 blanks remaining |
| Native Node regression execution | NOT RUN | `node --test courses/language-arts/tests/english-9-12-curriculum-alignment-audit.mjs` |
| Published browser routes / CI conclusion / substantive item correctness | HOLD | Need actual test results and educator review |

## Editorial next steps

1. Classify the 72 remaining unlabeled English 10 quiz items and 66 English 11 items **by actual question intent**, not by a bulk placeholder.
2. Audit all 12 units' assessment routes, rubric criteria, teacher handoff, and performance artifacts in each grade; distinguish selected-response evidence from evaluator-approved writing and speaking.
3. Review representative lesson/reading/task/assessment chains at the beginning, middle, and end of every course, then expand sampling to all 36 weeks.
4. Run the read-only Node suite in the repository and inspect GitHub Actions results. Browser-test four grades including offline reading metadata and tablet layouts.
5. Keep assignments source lawful, learner data private, and all actual grades, attempts, teacher approvals and 80% mastery gates unchanged.

This is an evidence-based *source audit*, not an accreditation finding or certification that the 144 instructional weeks have undergone human pedagogical validation.
