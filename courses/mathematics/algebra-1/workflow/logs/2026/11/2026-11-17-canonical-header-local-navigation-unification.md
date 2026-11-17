# 2026-11-17 · Algebra I Canonical Header and Local Navigation Unification

- Repository: `vervenveda/Khaemenes_High.github.io`
- Timezone: America/New_York
- Type: decision · repair · chrome unification
- State: source repair PASS; rendered browser/device acceptance HOLD
- Cross-course authority updated: `workflow/blueprints/high-school-landing-pages/CANONICAL_HIGH_SCHOOL_LANDING_PAGE_BLUEPRINT.md`

## Decision

High School student pages use exactly one canonical branded ecosystem header.

A second repository/course navigation layer is allowed when it serves local course routes, but it is not a second site header. It must be rendered as a compact unbranded local navigation strip and must not repeat:
- K / Academy logo marks;
- institutional brand lockups;
- a second hero-sized identity;
- ecosystem-wide header actions already owned by the canonical header.

This preserves useful repository/course menus without creating competing headers.

## Algebra I audit result

Confirmed duplicate-branded source headers existed on:
- `courses/mathematics/algebra-1/index.html`
- `courses/mathematics/algebra-1/diagnostic/index.html`
- `courses/mathematics/algebra-1/units/unit-10/index.html`
- `courses/mathematics/algebra-1/units/unit-11/index.html`
- `courses/mathematics/algebra-1/units/unit-12/index.html`
- `courses/mathematics/algebra-1/units/unit-13/index.html`

Unit 01–09 entry HTML did not contain a second branded source header and therefore was not rewritten for this issue.

## Committed repairs

### Shared architecture authority
- Canonical blueprint updated with a formal secondary course/repository navigation contract.
  - commit `4b457fd4e7fed0c038a61c55d64f5c645f1038b7`
- Algebra I blueprint updated to apply the shared rule.
  - commit `874475625946e34891a619ed3ba407527014eaca`

### Shared Algebra I styling
- Added `.algebra1-local-nav` presentation as a subordinate course-navigation strip.
- No Academy/K logo or institutional lockup is part of that local strip.
- commit `7b03d69bdd7f72fbae43992a43e1f5470530bda6`

### Diagnostic + Unit 10–13
Existing branded `.site-header` blocks were demoted to compact local `<nav>` structures while preserving useful course links and the existing theme control.
- Diagnostic commit `c7c601cf3bb393dce01e0c435d34b50d1998ea02`
- Unit 10 commit `2a6fb7344e24cbdabebb8edb7df99c18d931c7e9`
- Unit 11 commit `2e060062c8f39a7c2191d944df157ce140476f5d`
- Unit 12 commit `873989f905b5b56c7a7e9fd0306fde7c1ae73e6b`
- Unit 13 commit `a96d29ebcb9a431e5961607dbf973dd0d5235223`

### Course landing
The landing previously contained:
- its own full branded Academy header;
- a custom native network ticker;
- the canonical global-chrome loader at the same time.

Repairs:
- removed the legacy custom ticker markup/controller;
- added the canonical dual-ticker loader;
- retained the canonical High School global-chrome loader;
- converted the useful Algebra I links/course menu into one subordinate unbranded local navigation strip;
- preserved exactly one primary Algebra I hero.
- commit `24b18f679b5e51f1386a6bdffa1575d8aee9dfba`

## Static verification

PASS for repaired sources:
- no second branded HTML `<header class="site-header">` remains on landing, Diagnostic, or Unit 10–13;
- no legacy `id="networkTicker"` remains on Algebra I landing;
- no orphaned native ticker controller remains;
- canonical `vnv-dual-ticker-v1.js` remains/was added on repaired entry surfaces;
- canonical `high-school-global-chrome-v2.js` remains;
- local Algebra I navigation remains available;
- landing retains one primary hero.

## Intentional exceptions

- Unit 01–09 entry HTML did not contain duplicate branded source headers; no unnecessary rewrite was made.
- Protected assessments may continue to use reduced-distraction chrome under the canonical assessment exception.
- Local course navigation may differ in its specific links by page context, provided it remains subordinate and unbranded.

## Remaining HOLD

Rendered acceptance is still required to verify:
- exactly one visible canonical header after runtime mounting;
- exactly one 333 ticker and one AutoPopulate ticker;
- local navigation does not collide with ticker/header sticky offsets;
- tablet portrait/landscape and phone wrapping;
- no horizontal overflow;
- no duplicate hero/logo introduced by runtime scripts.

## Reuse rule for remaining Mathematics courses

When Geometry, Algebra II, Precalculus/Trigonometry and Calculus I are audited:
1. preserve useful local course/repository navigation;
2. remove/demote duplicate institutional branded headers;
3. keep exactly one canonical ecosystem header;
4. do not duplicate logos or hero identities;
5. record each course-specific exception in its workflow.
