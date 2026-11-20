# Grade 10 · English diagnostic and Biology assessment presentation parity
Date: 2026-11-19 ET
Repository: vervenveda/Khaemenes_High.github.io
Mode: surgical presentation and navigation only, no assessment or grade ownership changes.

## User request
Carry the approved Grade 09 readiness presentation into tenth grade: centered quiz, progress in an expandable Question Navigator below the subject/title, darker gold labels, consistent 7px/16px VNV controls, no duplicate chrome, while preserving student records and assessment gates.

## Source architecture audit
- English 10 has an existing dedicated diagnostic: `courses/language-arts/english-10/assessments/diagnostic/index.html`. It uses `assets/course.js` and the existing Monte Carlo/assessment adapter. No new assessment was introduced.
- Biology 10 has **no separate standalone readiness diagnostic at the expected Grade 09 paths**. Its public course dashboard `courses/science/biology-10/index.html` contains existing Monte Carlo practice midterm and final, and the weekly mastery views. Therefore the Grade 09 progress design was adapted to its **existing practice assessments only**, not rebranded as a readiness diagnostic or used to bypass placement.
- Both course pages retain their own native chrome and question/grade engine owners. The retired global page regulator was not reinstated.

## Committed modifications
- `f39f7df` English 10 diagnostic HTML: scoped body class `ka-english10-readiness`, native closed `<details>` immediately above the existing question container; original `data-assessment-form` remains unchanged.
- `585cb8b` English 10 original `assets/course.js`: after the existing `renderQuestionSet` call, attaches view-only question navigator with answered counts and keyboard-friendly jump buttons. Scoped only to `id==="diagnostic"`; no answer bank/score/attempt mutation.
- `c9aabcd` English 10 original `assets/course.css`: centered 880px question form, compact progress accordion, 16px controls, charcoal/gold contrast, responsive navigation and print hiding.
- `e5eef17` English diagnostic page cache refresh tokens for existing CSS and JS.
- `1f96382` Biology 10 `biology10-dashboard-app-v1.js`: existing Monte Carlo practice test form now contains closed native Progress accordion and an in-place button navigator; change listeners read radio answers but do not save/grade/reset them.
- `0b628fb` Biology 10 original index CSS section updated (no new stylesheet), centering practice form and styling 7px-radius question navigator, darker category fonts, readable contrast and responsive grid; page's script version refreshed.
- `6503883` Biology course-owned CSS includes narrow overrides for legacy important typography to ensure button text remains readable.
- `619b945` `tools/test-grade10-readiness-layout-contract.mjs` tests structure and original assessment authority.
- `4594a48` `.github/workflows/grade10-readiness-ui-regression.yml` adds syntax checks and source tests on relevant changes.

## Preservation
- English 10 diagnostic question bank, answer keys, Monte Carlo adapter, grade and learner records, submission, report and correction logic unchanged.
- Biology 10 Monte Carlo sessions, saved answers, practice midterm/final sampling, unit mastery 80% gates and learner records unchanged.
- No new subject landing page, placeholder readiness diagnostic, global CSS layer, page regulator or change to Vervenveda gateway.
- No changes to the previous Grade 09 Science pilot or Grade 09 diagnostic.

## Verification / holds
- Post-commit GitHub source inspection confirmed English progress is before original question container, original assessment ID and kind preserved, scoped CSS present, Biology original Monte Carlo methods retained and practice progress disclosure present.
- Original English and Biology JavaScript passed syntax parsing using `new Function`.
- CI workflow **committed** but no passing Actions conclusion observed. Live authenticated browser/device acceptance remains open.
- Browser QA needed for English 10 randomized diagnostic load and button jumps, Biology 10 midterm/final practice load and jumps, preserved radio selection/answers, grade reporting, print, mobile/tablet, and no duplicate ticker/header/bar.
- A standalone Biology 10 **readiness** page was not found; a genuine course-owned readiness diagnostic must be designed separately if the Academy later wants one.
