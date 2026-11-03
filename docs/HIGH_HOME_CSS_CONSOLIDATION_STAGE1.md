# High School landing page — CSS consolidation staging notes

**Status:** Staging branch only. Do **not** merge to `main` until runtime and offline acceptance checks pass.

**Baseline:** `f887c44d66f537bf38e98d4e99c6f489bb71a5e9` (2026-11-03). The original `main/index.html` remains untouched.

## Stage 1: structural extraction

- 26 legacy inline `<style>` blocks have been lifted into six ordered CSS assets: `assets/high-home-01-base.css` through `assets/high-home-06-footer.css`.
- The six stylesheet references stay at the same original cascade boundaries around the pre-existing parchment stylesheet, Academy shared stylesheet, and late shared-component scripts.
- No CSS declaration was intentionally rewritten or removed in this stage. CSS still has many overridden and `!important` declarations, for later forensic elimination.
- The homepage's HTML, scripts, student controls, High School Directory drawer, header mount, two tickers, official dock, and footer remain otherwise unchanged.
- Additional CSS files use only repository-relative URLs, with no external service or build tooling.

## Validation already performed

- Controlled, offline Chromium style-comparison experiment (scripts/remote resources disabled) at 1440px, 1024px, and 390px widths: 0 differences in the 900px-tall screenshot, and no differences among 22 sampled computed-style targets. This validates the order-preserving CSS extraction **only** under that controlled environment.
- Static source invariants: 15 scripts, 79 anchors, one High School Directory drawer, one footer, one header loader, one of each shared ticker loader, one shared toolbar loader.
- The tests **do not** establish that the full live site works correctly: dynamic menu mounts, live translated text, service-worker timing, network font loading, persisted learner state, and end-to-end mobile navigation still require checking.

## Before any live promotion

1. Verify all six CSS URLs load with HTTP 200 and correct `text/css` MIME type on the deployed path.
2. Check desktop/tablet/mobile layout with shared header, tickers, translated UI, High School Directory, toolbar, and footer actively loaded. Confirm no duplicate controls.
3. Address offline deployment: `service-worker.js` currently does not list these six new assets in its initial precache bundle. They may be cached after an online visit, but new-install offline availability is not guaranteed. Review a tightly scoped precache plan without triggering unnecessary re-downloads of hundreds of games.
4. Review the remaining repeated selectors and contradictory `!important` declarations **section by section**, with screenshot and functional verification after each logical cleanup.
5. Obtain the owner's visual approval before promotion. Do not reset, delete, or rewrite learner storage or academic scripts as part of a CSS-only cleanup.

**Protected reference:** Verve N Veda homepage must remain untouched.
