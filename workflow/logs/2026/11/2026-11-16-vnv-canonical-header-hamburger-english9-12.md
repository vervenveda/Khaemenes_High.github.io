# VNV/KA Official Header and Enriched Hamburger · English 9–12 Week 01

**Date:** 2026-11-16
**Repository:** `vervenveda/Khaemenes_High.github.io`
**Scope:** 20 Week 01 daily lesson routes across English 9, 10, 11 and 12
**Status:** COMMITTED · STATIC VALIDATION PASS · LIVE VISUAL AND INTERACTION ACCEPTANCE HOLD

## Canonical source audit
Checked the actual VNV gateway repository `vervenveda/vervenveda.github.io/index.html` (site-local native header and `#menuButton` / `#menuOverlay` around lines 4336 and 4391) and its reusable shared asset:
`vervenveda/vervenveda.github.io/assets/vnv-header-autopopulate.js` (source was 43,766 characters at audit).

The reusable asset contains **both**:
- `window.VNV_HEADER.mount(...)`: approved idempotent `#vnvHeaderAutoPopulate`, left identity, center links, single top-right `.vnv-header-menu-button`, sticky offset reconciliation
- `window.VNV_ENRICHED_MENU.mount/open/close`: the approved categorized searchable `#vnvEnrichedMenuOverlay` hamburger drawer

Do not copy the gateway's native `#menuOverlay` or `#menuButton` to migrated lesson pages. The original `vervenveda/vervenveda.github.io/index.html` remains protected and unchanged.

## Original issue / scope
The high-school shared script already loaded the canonical header but did not explicitly replace older local header markup on these daily routes. Grade 10 has a `header.site-header` with theme and course navigation. Grades 11/12 use `body > header.wrap` as an instructional hero with next-day links. Naive deletion would remove useful lesson navigation. The shared header initially mounts before the two ticker scripts; its offset must be recalculated after ticker creation.

## Committed implementation
Primary file: `assets/high-school-global-chrome-v2.js`

- Commit `26555683e12297161e893dc950a812e0b3f34c14`: targeted legacy normalization, preserve English 10 controls by moving them into the existing breadcrumb; convert Grades 11/12's instructional header into a lesson **section** without deleting content or navigation; call `VNV_HEADER.mount({replaceLegacy:true,...})` on Week 01 daily routes; reconcile header offset after canonical ticker pair is mounted.
- Commit `c24e9b1ff743b95012072a17aff2bb8fdfd032bc`: remove redundant enriched menu initialization. Official header owns the hamburger/overlay, avoiding repeated menu-data loading.
- Commit `4cff71e9f2605fee84e7dee38eab96b878d08cf8`: route profile links for all four English grades to the correct grade 09/10/11/12 profile; restore centered Grade 11/12 instructional hero presentation.

The original grade-specific lessons, progress, source workspaces and course-mastering boundaries are unchanged. No new student storage or assessment writes.

## Static validation
- Refetched changed shared script, current source SHA `515e8cc45ced2e0bde813313ded3362713a67267`
- JavaScript source parse: **PASS**
- Target route identification: **20/20 PASS**
- Grade profile resolution: 5 routes each for 09, 10, 11, 12
- Approved VNV header and enriched menu authority: **CONFIRMED IN SHARED SOURCE**
- Original gateway `index.html`: **NO EDIT**
- Neither grading/maturity logic nor learner save schema modified.

## Live acceptance HOLD
1. Render one representative day page per grade and verify the canonical header is above the lesson and below both tickers, exactly once.
2. Open/close the top-right hamburger; verify the categorized folders, search, keyboard focus/ESC, and actual page destinations.
3. Confirm Grade 10 theme control and course links survive relocated legacy chrome, and Grade 11/12's lesson title, weekly return and next-day links remain visible.
4. Verify the header's profile link goes to the matching grade, as expected on the user’s actual deployment domain.
5. Test on tablet portrait/landscape and Mac at 100%, 125%, 150% browser zoom; no sticky overlap, page clipping or duplicate footers.
6. Verify the 333 and AutoPopulate strips each have one pause control and do not displace the canonical header.
7. Student progression and storage must be checked with an authorized beta learner; no readiness/mastery bypass.

**Release decision:** Implementation committed and statically checked. Browser behavior and navigation are **not yet independently verified**.
