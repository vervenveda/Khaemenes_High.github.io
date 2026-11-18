# 2026-11-18 · High School landing — Chrome DevTools topology preflight

## Scope
- Source: `vervenveda/Khaemenes_High.github.io/index.html` and its explicitly loaded scripts.
- Public URL: `https://vervenveda.com/Khaemenes_High.github.io/`.
- This is a static/source and public-HTML review. **It is not a direct Chrome DevTools session or a verified CPU profile.** Browser acceptance and main-thread freeze diagnosis remain pending.
- No learner data, local browser storage, account cloud or STOS modification.

## Observed source topology
1. Legacy local navigation: `#drawerBg`, `#menuButton`, `#closeButton`, `#drawerSearch`, `#drawerContent` in `index.html`; local click/keyboard handlers around source lines 1724–1744.
2. Canonical VNV header and branched hamburger: `vnv-header-autopopulate.js` plus `VNV_HEADER.mount()` around source lines 1912–1917; shared module additionally loaded/mounted by `assets/high-school-global-chrome-v2.js`. Different UI ownership pathways need DevTools review. Idempotent mounting may avoid duplicate DOM but not redundant initialization cost.
3. Canonical VNV 333 and AutoPopulate tickers are loaded explicitly at lines 1914–1916. `high-navigation-v1.js` can inject `vnv-dual-ticker-v1.js` if absent; this also checks/mounts the pair.
4. A ticker/header offset reconciliation observer appears around lines 2069–2117; this is separate from the shared global-chrome observer. The latter was recently excluded from High School landing and student profile paths in `assets/high-school-global-chrome-v2.js`.
5. Semantic title hierarchy script `assets/high-school-global-chrome-v2.js` registers an observer on `document.documentElement` with `subtree:true`; callback is RAF-batched, but the traversal may still be costly on large DOMs. Requires a Chrome Performance trace to substantiate actual cost.
6. Opt-in audit loader at end of `index.html` loads `assets/high-vnv-chrome-audit-optin.js` only when `chrome_audit=1`; the deep report includes layout measurements and is now refresh-on-demand after first rendering.
7. The landing page registers `./service-worker.js` at window load. DevTools Application > Service Workers and Network > Disable cache (DevTools open) should verify stale script serving before any cache deletion.
8. Small explicit CSS font declarations (e.g. 9px) exist earlier in the landing-page source, while shared typography adds a 16px text floor. Browser computed style is the authority; do not use source font declarations alone to claim visible typography is 9px.

## DevTools read-only acceptance sequence
1. Test without `?chrome_audit=1`.
2. Open Chrome DevTools on landing page; **Console > Preserve log**, **Network > Preserve log**, reload once. Record uncaught exceptions and failed JavaScript URLs without copying account/cookie headers.
3. In Elements, check number and parent of `#vnv333NetworkTicker`, `#vnvTickerAutoPopulate`, `#vnvHeaderAutoPopulate`, `#vnvEnrichedMenuOverlay`, `#drawerBg`, and `#vnvEcosystemUtilityDock`. Closed menu overlays should be hidden, not removed.
4. Use the DevTools Performance panel to record 3–5 seconds during an actual stall, inspect Long Tasks, MutationObserver callbacks, `mountHeader`, `mountToolbar`, `normalizeHierarchy`, layout/recalculate-style activity.
5. Use Elements 'Inspect' and `document.elementsFromPoint` to determine whether an invisible overlay intercepts intended button clicks.
6. In Application > Service Workers, inspect controller/update status; do not blindly unregister or clear family/local data.
7. Verify each primary link by destination (family, student, courses, grade); dynamic learner routing may depend on selected learner state and cannot be authenticated by source alone.

## Release decision
**HOLD on 'fully responsive' or 'all links repaired'.** Static checks and successful focused CI cannot verify real Chrome's main-thread event processing. Record screenshots/Performance trace outcome before further application-code changes.
