# English 9–12 · Canonical VNV Ecosystem Landing Contract (2026-11-19)

**Recovery branch:** `recovery/english-09-12-minimal-lesson-boundaries-20261119`
**Production:** HOLD · no merge · no assessment, student data, or live site modifications.

## Source of authority
Read live canonical `vervenveda/vervenveda.github.io/index.html`, current blob `543b8aeaa47b2b18ebec33e6a4029075cedc4596`.
- VNV gateway defines a native 333 ticker and loads canonical `/assets/vnv-ticker-autopopulate.js`, with ticker stack control. It does not authorize copying the entire gateway ticker DOM into each course.
- Gateway header contains official site-header and menu button tied to the branched menu overlay; reusable `vnv-header-autopopulate.js` is the approved consumer interface.
- Gateway loads `/assets/vnv-class-tools-toolbar.js?v=1.6.1` and `https://vervenveda.com/assets/vnv-ecosystem-toolbar.js`.
- Gateway translator owner is Khaemenes Linguistics via `khaemenes-translator-loader.js`, with `vnv-language.js` fallback. On English course pages, translator is opened **inside** the lower-left toolbar via the existing idempotent `english-landing-class-tools-v1.js` mount. Do not create a second translator rail.

## English course entrance contract
All four English course `index.html` files now reuse:
1. `../../../assets/vnv-dual-ticker-v1.js` to mount one 333 and one auto-populating ticker.
2. Official `vnv-header-autopopulate.js` and guarded `english-minimal-header-mount-v1.js`; no duplicate handcrafted header.
3. Single `../assets/english-minimal-landing-v1.css` owner, providing charcoal hero, 33px Academy eyebrow, 66px English title on desktop, 24px course descriptor (responsive on narrow screens), and 7px button corners.
4. Exactly three centered primary access buttons: **Learner Profile / Parent Profile / Enrollment**. They are not student Class launchers and must not substitute for current-lesson routing.
5. One About section; 2×2 Course Features grid; centered charcoal footer.
6. One lower-left VNV class-tools toolbar with embedded translator, and one lower-right VNV ecosystem dock.
7. No academic course engine, grade, score, or learner-state logic on the minimalist landing.

## Preserved instruction
- All four full current `index.html` workspaces were copied byte-for-byte as `course-workspace.html` before any landing change.
- Each grade has 36 week-index HTML pages and native daily learning material. The full workspace retains the course registry, curriculum, mastery and progression authority.
- English 9 Day 1 has an isolated presentation-only six-stage guide in its existing canonical single visual owner. This is not a new scoring or persistence engine.

## Validation
- `tools/validate-english-minimal-lesson-boundary.mjs` now asserts preserved workspace blob identities, all 144 week-index files, initial real lesson routes, canonical component scripts, exactly three primary access links, single CSS owner and 2×2 feature grid.
- Focused recovery validation **PASS** on branch GitHub Actions run `44638185160` after updating guard expectations to reflect the exact three-button canonical requirement.
- Source identity and JS syntax are verified by CI; **live browser toolbar/header count, visually correct branched hamburger and translator behavior remain HOLD** until interaction tests.

## Explicit release boundaries
Do not merge this branch without a browser viewport pass (desktop, tablet portrait/landscape, mobile, print), student Class→current lesson route tests with stale/recent/no evidence, and cross-repository CSS/chrome acceptance. No public VNV gateway index change is required or approved.
