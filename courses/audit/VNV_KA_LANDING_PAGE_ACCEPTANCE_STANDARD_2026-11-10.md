# VNV / Khaemenes Academy — Page construction acceptance policy

**Reference:** User-supplied *Verve N Veda & Khaemenes Academy — Canonical Page Architecture & Design Blueprint*, version 1.0, nine pages (2026-11-10).
**Scope:** New and changed public learning, administrative landing, ecosystem, grade, resource and portal pages. Private/admin systems must undergo their own security review; never expose controls by normalizing public chrome.

## Protected exceptions and themes
- The approved Verve N Veda homepage is protected. **Do not change** it to force compliance.
- Standardize shared architecture; preserve each campus's independent personality.
- High School: charcoal / forest, cream type, parchment contrast, restrained gold/burgundy/navy/hunter green.
- Preschool and Kindergarten: age-appropriate customization; no washed-out or low-contrast text.
- Specialized subject styling is permitted; semantics, navigation, accessibility, canonical ownership, and data protection are not optional.

## Page review contract
1. Record the last approved page version; inventory all tickers, headers, menus, toolbars, viewers, directory owners, footers and relevant scripts.
2. One original 333 ticker and one idempotent AutoPopulate ticker where eligible; one official header with identity left and enriched categorized hamburger at right; one lower-right ecosystem toolbar; one centered footer. Never duplicate or invent substitutes. Shared script owners:
   - `https://vervenveda.com/assets/vnv-333-ticker.js`
   - `https://vervenveda.com/assets/vnv-ticker-autopopulate.js`
   - `https://vervenveda.com/assets/vnv-ecosystem-toolbar.js`
   Current approved homepage preserves its original native ticker exception.
3. Hierarchy: institutional eyebrow (33px Cinzel), page title (66px Cinzel), major heading (44px Cinzel), restrained font weight 333–444, description 18px preferred. All newly authored text at least 16px; labels/forms/captions 18px minimum. Responsive scaling allowed when hierarchy remains clear.
4. Center the hero (identity, title, short description and useful balanced actions). Use 7px radius, contrasting charcoal/cream or parchment/charcoal buttons, aligned consistent-height action grids; never clip content for symmetry. No fake buttons.
5. Test navigation with keyboard, tablet and mobile; validate link targets, modals, headings, contrast, accessible names, translated content, focus order and print where applicable. Include the directory doorway; keep directory source centralized at `/ecosystem/master-ecosystem-directory.json`.
6. Preserve all learner evidence, mastery, history, user profiles and storage. Never clear localStorage or invoke admin/private actions as a visual shortcut. Public visual conformity is not a substitute for admin authority verification.
7. Record DOM instance counts for tickers/header/menu/toolbar/footer and screenshots at representative breakpoints. **Fail the page if duplicate chrome, broken actions, unreadable text, hidden content or learner-data regression remains.** Stop affected batch and revert only localized failures.
8. Obtain visual approval before proceeding with bulk page rollout.

## Honors switchyard review (staged)
- Updated `courses/mathematics/algebra-1/honors/index.html` for institutional eyebrow, centered hero and typography, theme, aligned cards, responsive menu and footer, and canonical ticker/toolbar script references.
- **Not yet validated in real browser:** runtime ticker mounts/overlap, menu interaction and official toolbar ownership. The new header is a styled local navigation shell pending verification against the centrally owned enriched menu component.
- **Do not mark complete** until runtime canonical components and the three-actor approval boundary are verified.
- The parent-approved Honors lane remains closed. No production or STOS change.

## Consistency note
The blueprint describes an *approved enriched branched hamburger*. A locally authored `details` menu with links is a temporary, semantic fallback, not proof the enriched navigation standard has been satisfied. Replace it with a verified shared menu only after confirming correct ownership and paths.
