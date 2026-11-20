# Grade 09 readiness presentation cleanup · Science and English
Date: 2026-11-19 ET
Source: three user screenshots captured 21:49–21:51 local time; High School main repository
Scope: *presentation only*; no assessment bank, response handler, mastery calculation, learner record or Science lesson engine modified.

## Screenshot findings
1. Science 9 Unit 01 Day 01 is blocked by the legitimate NAIB readiness entry gate. Do not bypass it to reach the lesson-engine pilot; that learner readiness is course-owned.
2. English 9 readiness entry shows a small white dialog on an oversized blank parchment page; its actual owner is `courses/language-arts/english-9/assets/course.js`, not a separate assessment CSS sheet.
3. Science 9 diagnostic Question 1 displays a permanent right-hand Progress sidebar, reducing usable question width. Scientific Practices label and some gold text are low contrast.
4. The screenshots contain tightly stacked top strips. Repository source explicitly contains both official tickers; their removal is prohibited. Whether the apparent *extra* upper strip is a redundant utility/header row or a required canonical ticker could not be confirmed by static source alone. Do not silently hide either ticker or a potentially authoritative breadcrumb.

## Changes made
- `bf56b56` — `courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html`: moved the existing Progress question-dot navigator into a collapsed native `<details>` immediately under the Scientific Practices question-category row. The original `#questionDots` ID is retained, and the original `#submitButton` now sits outside the collapsed disclosure, visible and disabled until answers satisfy the assessment's existing enablement logic. All 24 question prompts/answers/scoring scripts remain untouched.
- `97d69ee` — updated only the existing `readiness-vnv-ka-blueprint-v1.css` owner; one-column centered max 880 px question card, responsive question navigation, text contrast darkened to charcoal/deep brown, 7 px radii and 16 px minimum assessment controls. No additional stylesheet or global chrome layer.
- `0acf1fb` — redesigned only the existing English 9 gate in `assets/course.js`, retaining the same entry decision/readiness authority and links while providing a centered, responsive parchment dialog, Cinzel heading, descriptive eyebrow, charcoal/cream buttons and readable body text.
- `6305b6d` / `8a16014` — English 9 landing and English 9 diagnostic imports use a new version token for `assets/course.js` to prevent the older readiness dialog being reused from cache.
- `2c0b3da` — `tools/test-grade09-readiness-layout-contract.mjs` source regression asserts unique assessment selectors, progress placement, centered layout and original scoring/route presence.
- `658cb34` — independent GitHub CI workflow `.github/workflows/grade09-readiness-ui-regression.yml` runs JavaScript syntax and the UI source contract when relevant files change.

## Verified
Via GitHub contents API, post-commit source verification: original Science `#domainLabel`, `#questionNumber`, `#questionPrompt`, `#options`, `#questionDots`, Previous, Next and Submit IDs each present uniquely. Progress disclosure is below the category; Submit remains outside it. Official ticker script links remain. Existing Science readiness routing and 24-question authority remain. The updated English gate JavaScript parses successfully and retains `entryContract.isReady` and the gate's original decision.
**No deployed authenticated-browser or GitHub Actions result was observed.** The above are source-level checks, not end-to-end acceptance.

## Outstanding
- Isolate the extra visible strip **above the tickers** in the user's rendered browser using DOM inspection, identify its specific component owner and then remove only redundant markup. Do not hide one of the two required canonical tickers or alter the protected Vervenveda gateway as a workaround.
- Confirm English 9 gate and Science diagnostic UI with browser/device rendering, 100%, tablet portrait/landscape, keyboard navigation, question-dot operation, Submit enablement, answer preservation, grade access, and footer.
- Confirm whether the user wants a modal-style Progress dialog rather than the implemented inline native accordion (the user explicitly offered the accordion alternative).
