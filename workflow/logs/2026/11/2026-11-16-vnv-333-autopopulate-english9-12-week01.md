# VNV 333 Network + AutoPopulate Tickers · English 9–12 Week 01
**Date:** 2026-11-16
**Repository:** `vervenveda/Khaemenes_High.github.io`
**Scope:** English 9–12 Week 01 individual daily lessons (20 routes)
**State:** COMMITTED · STATIC SOURCE PASS · LIVE VISUAL ACCEPTANCE HOLD

## Requested authority review
Reviewed the actual default-branch `vervenveda/vervenveda.github.io/index.html` and its first-party ticker scripts. The gateway uses a protected **native** `#networkTicker` section around line 4278, native CSS/animation (`networkTickerMove`) and a native pause button `#tickerControl`. The page's `VNVGatewayBootstrap.mountTicker()` mounts its AutoPopulate strip from `/assets/vnv-ticker-autopopulate.js` at the end of the page. On the gateway, `#vnvGatewayAutoTickerSlot` reserves the AutoPopulate strip's height to prevent visual movement. The gateway itself remains untouched.

For other ecosystem pages the reusable ticker authorities are:
- `https://vervenveda.com/assets/vnv-333-ticker.js`, `#vnv333NetworkTicker`, first-party script, distinct pause key.
- `https://vervenveda.com/assets/vnv-ticker-autopopulate.js`, `#vnvTickerAutoPopulate`, discovers current-page links and has its own pause key.

**Do not copy the homepage's native `#networkTicker` markup into other pages or inject both implementations of the 333 strip.**

## Implementation committed
Change in `assets/high-school-global-chrome-v2.js`, commit `08ca14512c4d4232ce62cb6b2b0777c93e0c0dba`:
- For English 9 Days 01–05, English 10 Monday–Friday and English 11/12 Days 01–05, load the authoritative 333 and AutoPopulate scripts in order, after the canonical shared header is mounted.
- Mount each only if its corresponding canonical DOM ID is absent; do not duplicate the gateway markup or third-party scripts.
- AutoPopulate discovers actual lesson navigation and labels itself by English grade, up to twelve links. Exclude the other ticker, downloads, skip links and sign-out actions.
- Keep previously introduced no-remount observer guards for stable daily pages.
- Set a read-only document dataset diagnostic for successful/partial ticker pair mounting.
- No lesson content, forms, assessment rules, grade writers, saved work, active learner, or progression keys are touched.

## Static verification
- GitHub re-fetch SHA of shared display script: `0bd78be001a2d905351f49d3014f41f824f6e69e`.
- Shared JavaScript parsed: **PASS**.
- Target route matching: **20/20 PASS**.
- References to both canonical ticker libraries: **PASS**.
- Duplicate ticker DOM ID guards: **PASS**.
- Protected VNV main index and ticker source files: **NO EDITS**.
- Independent, direct browser/DOM verification of rendering: **NOT RUN**.

## Live acceptance checklist (HOLD)
1. On a representative day page for English 9, 10, 11, 12, confirm exactly one `#vnv333NetworkTicker` and exactly one `#vnvTickerAutoPopulate`.
2. Confirm both strips render in the expected order above the header, without duplicated menu/header/dock.
3. Test pause/resume separately on each ticker, with keyboard and screen reader.
4. Verify the second ticker's items originate from valid links within the current lesson and no Github repository links are introduced as actions.
5. Confirm sticky offsets and reading-page controls have no overlap or horizontal clipping on desktop, tablet portrait/landscape and mobile.
6. Verify lesson load, readiness gate, saved work, exports and the 80% mastery requirement with an approved beta test learner.
7. If scripts are blocked by the browser or site, record the Network and Console errors before calling the feature fully released.

**Release decision:** Static integration completed. Do not mark cross-grade live visual/functional acceptance as passed until browser testing confirms it.
