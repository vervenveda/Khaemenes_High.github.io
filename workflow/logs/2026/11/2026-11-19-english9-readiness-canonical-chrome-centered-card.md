# English 9 readiness popup · canonical VNV chrome and centered card

Date: 2026-11-19

## User symptom
Captured public English 9 landing screenshot: readiness assessment popup/card sits in a very large cream area while the official 333 and auto tickers plus Khaemenes header render well below it. Buttons are insufficiently contrasted and card feels detached from page chrome.

## Root-cause evidence
The official VNV ticker assets find an insertion anchor with `[data-khae-header],.site-header,header`; the existing English 9 course page contained a dashboard header within `div.app` but lacked an explicit root chrome anchor. Therefore the canonical tickers and header could mount inside the course dashboard instead of before it. The old readiness gate also used inline card/button styles and set `inert=true` on every body child including canonically mounted chrome, and linked "English 9 home" back to the same readiness-blocked page.

## Scoped recovery branch
`fix/english9-readiness-centered-canonical-chrome-20261119`

### HTML source
`courses/language-arts/english-9/index.html`
- Adds one hidden `data-khae-header` mount anchor before `div.app`, so the canonical ticker auto-discovery inserts both top tickers and the official VNV header ahead of instructional content.
- Adds targeted CSS **within the existing single canonical English 9 CSS owner** (`khaemenes-english9-canonical-css-v2`). No second UI layer, no duplicate scripts, no changes to the gateway.
- The blocked-readiness presentation is centered in the viewport, width <=620px, with 7px borders, responsive spacing, 16px readable text, dark charcoal primary button with cream text, and an unmistakable alternate Student Profile action.
- Keeps official 333, auto-populating ticker, header/hamburger, lower-left class tools, lower-right ecosystem toolbar and translator scripts as single owners.

### Nonacademic UI script
`courses/language-arts/english-9/assets/course.js`
- Readiness decision and 80% evidence threshold left unchanged.
- Keeps diagnostic and Foundation bridge hrefs unchanged.
- Replaces inline DOM styling with semantic readiness CSS classes.
- Only marks `body > .app` as inert while readiness blocks the course, rather than disabling unrelated canonical header/tickers/toolbars.
- Replaces the loop-to-self "English 9 home" action with Student Profile.

## Validation
- `tools/validate-english9-readiness-canonical-chrome.mjs`: source-level invariants for mount order, no duplicate VNV assets, consistent readiness CSS, original academic threshold and diagnostic routes, scope of inert state, and inline JS compilation.
- `.github/workflows/english9-readiness-canonical-chrome-integrity.yml`: isolated read-only CI.
- GitHub Actions run `44641515665`: validation step PASS.

## HOLD
This is an isolated recovery branch, **not a published production change**. Browser acceptance required for viewport positioning, 333 + auto ticker uniqueness, hamburger opening, toolbar overlays and readiness navigation on desktop/tablet/mobile. No assessments, mastery records, curriculum, Account Cloud, STOS or global VNV gateway modified.
