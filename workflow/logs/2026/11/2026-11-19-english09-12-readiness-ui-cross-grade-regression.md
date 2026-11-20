# 2026-11-19 — English 9–12 Readiness UI Source Audit and Single CSS Consolidation

**Scope:** English 9, 10, 11, 12 course dashboards and official readiness diagnostic pages.
**Source branch:** `fix/english09-12-unified-readiness-css-regression-20261119`.
**Status:** Shared readiness source-guard PASS; production release HOLD pending actual browser/device checks and independent chrome defect.

## Why this audit was requested
A user-supplied English 9 screenshot shows its readiness card isolated above incorrectly mounted 333/auto tickers and official header. The initial English 9 fix was in draft PR #80, but the user requested explicit cross-grade regression review and **one CSS owner** instead of grade-specific styling layers.

## Findings by grade

| Grade | Readiness experience | Source status |
| --- | --- | --- |
| English 9 | `assets/course.js` creates a learner/readiness-blocking **dialog** on the full course dashboard. It uses an 80% readiness evidence gate. | Existing draft fix: root chrome anchor, centered readable card, Student Profile return, no global chrome inerting; new shared CSS replaces duplicated inline popup presentation. |
| English 10 | Separate real `assessments/diagnostic/index.html` form; **no Grade 9-style dialog** exists on full course `index.html`. | Shared readiness CSS applied to diagnostic and registered for course page. Native assessment engine unchanged. |
| English 11 | Separate real diagnostic form and upper-grade assessment adapter; **no Grade 9-style dialog**. | Shared readiness CSS applied; native assessment engine unchanged. |
| English 12 | Separate real diagnostic form and upper-grade assessment adapter; **no Grade 9-style dialog**. | Shared readiness CSS applied; native assessment engine unchanged. |

The source check does not claim four identical readiness dialogs. **Academic readiness decisions remain native to each grade.**

## Shared presentation owner

- New `courses/language-arts/assets/english-readiness-ui-v1.css` is the **single source** of readiness card / assessment entry styling across these grades.
- Loaded once from each of four course `index.html` files, and once from each grade's `assessments/diagnostic/index.html`.
- English 9's previous 3 KB inline readiness CSS block was removed, but its existing broader course CSS owner remains for ordinary dashboard visuals.
- The CSS is scoped to the Grade 9 dialog or `body[data-english-readiness-grade]` on genuine diagnostics, so it does not restyle lesson engines or unrelated assessments.
- Minimum text 16px (including overriding legacy important 14px typography rules), centered bounded hero/card, charcoal and cream button contrast, 7px radius, responsive controls, visible focus and print considerations.
- No VNV gateway source modified.

## Assessment firewall / exact source preservation

- For each diagnostic page, removing only the new stylesheet link and `data-english-readiness-grade` attribute produces the *original Git blob* from main:
  - English 9 `8844759ae97857f9117ab62b9c6a24e871ad4757`
  - English 10 `430fda49a6c751e3adf3df91bca1eccade0bde9c`
  - English 11 `8a1be64b53f0d8fc9fdea0313ef77ffafa7a8048`
  - English 12 `dd26e349f76b5404e32578a80a16aedf9ef48e38`
- English 10–12 full course dashboards likewise remain exactly equal to their original blobs after removing the one new stylesheet link. English 9 retains the independent centered-chrome fix inherited from draft PR #80.
- No quiz questions, evaluator logic, learner records, grade thresholds, progression rules, unit files or lesson pages edited.

## Regression validation

- `tools/validate-english-09-12-readiness-css.mjs` runs in `.github/workflows/english-09-12-readiness-css-integrity.yml`.
- Confirms all eight pages use the same CSS link once, source-level 16px and contrast contract, exact preservation of all four assessments, unchanged English 10–12 dashboard source, and existing English 9 readiness/80% contract.
- **PASS:** https://github.com/vervenveda/Khaemenes_High.github.io/actions/runs/44642622170

## Independent cross-grade chrome regression (HOLD)

- English 9 dashboard has canonical VNV 333 ticker + auto ticker + header scripts. Its earlier root insertion issue is corrected in PR #80.
- English 10, 11, 12 **source code includes** `/Khaemenes_High.github.io/assets/high-school-global-chrome-v2.js` but an exhaustive untruncated repository tree inspection found **no such file**. These course pages also have a hidden retired header, and no standalone 333/auto/header loader in their `index.html`.
- Therefore canonical chrome/runtime readiness for English 10–12 is **not verified**; a separate audited canonical-mount remediation is required before overall site acceptance. This consolidated CSS change deliberately does not inject replacement chrome scripts blindly.
- The shared English 9–12 readiness diagnostic pages contain legacy header markup and are **not** assumed to have canonical top chrome without a browser test. Do not assert that source-level CSS checks prove universal header, tickers, hamburger, translator, or right toolbar appear live.

## Release decision

**HOLD**. Pending desktop/tablet portrait+landscape/mobile/print acceptance, clear grade-by-grade official top chrome mount audit, keyboard focus tests and completion of independent High School routing/Curriculum workflow failures. No rollback or auto-merge.
