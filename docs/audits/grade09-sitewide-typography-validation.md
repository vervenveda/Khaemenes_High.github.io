# Issue 5 · Grade 9 parchment and high-school typography

**Validated:** October 13, 2026  
**Scope:** Public high-school pages with a full HTML head, including English 9, Integrated Science 9, mathematics, and other available public learning pages.  
**Exclusions:** STOS files and HTML fragments without a full document head.

## Typography specification

| Element | Target |
| --- | --- |
| Eyebrow / kicker | 55 px |
| H1 heading | 33 px |
| H2 / descriptor | 24 px |
| Body | 14 px |
| Display / heading family | Cinzel, followed by installed serif fallbacks |
| Body / controls family | Brandon Grotesque, followed by installed sans-serif fallbacks |

No font downloads or third-party dependencies are introduced. Browser-installed alternatives are used when preferred fonts are unavailable.

## Confirmed changes

- Refreshed the embedded local typography rules across **2,725 public HTML documents** using `tools/apply-typography-standard.py`.
- Reinforced consistent body and heading fonts in the shared Grade 9 parchment stylesheet.
- Preserved the English 9 and Integrated Science 9 responsive layouts, learner selectors, assessments, portfolios, and course records.
- Retained the existing Grade 9 parchment first-paint and contrast behavior.
- Kept STOS files outside the visual changes.

## Validation

- `python3 tools/apply-typography-standard.py --check`
- `node tools/test-sitewide-typography.mjs`
- `node tools/test-grade09-visual-consistency.mjs`
- `python3 tools/validate-sitewide-routes.py`
- `node scripts/validate_learner_scoped_persistence.mjs`
- `node tools/test-upper-english-records.mjs`
- `git diff --check`

All passed in the main-branch typography refresh workflow.

## Browser-testing note

Automated source verification does not establish actual font availability, contrast, line wrapping, or readability on each device. Confirm the appearance of 55 px eyebrow headings and 14 px body text on phones, tablets, and desktop browsers during student testing. The site uses local fonts and does not bundle proprietary font files.
