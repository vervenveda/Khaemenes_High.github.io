# Khaemenes High School · Canonical Landing Page Blueprint

**Status:** Stable architecture authority  
**Established:** 2026-11-17  
**Scope:** Public-facing High School course landing pages and student learning portals in `Khaemenes_High.github.io`.

This file is the high-school-wide layout contract. Course-specific files in this directory may specialize content organization, but they may not weaken the shared rules below without a documented workflow decision.

## 1. Canonical shared chrome

Ordinary student-facing landing pages must render exactly one approved instance of each eligible shared component, in this order:

1. 333 Network ticker
2. AutoPopulate page-link ticker
3. official Khaemenes High / VNV header
4. one enriched hamburger / directory control
5. translator rail
6. centered page hero
7. centered page content
8. centered footer
9. official six-control VNV ecosystem toolbar at lower right

Preferred authoritative assets:
- `https://vervenveda.com/assets/vnv-333-ticker.js`
- `https://vervenveda.com/assets/vnv-ticker-autopopulate.js`
- `https://vervenveda.com/assets/vnv-header-autopopulate.js` or the approved High School global chrome wrapper
- `https://vervenveda.com/assets/vnv-language.js` / approved Linguistics authority
- `https://vervenveda.com/assets/vnv-ecosystem-toolbar.js`

All mounts must be idempotent. Existing canonical components are reused; a loader must never create a second instance.

## 2. Centered architecture

Public student landing pages use one centered content axis.

Required:
- no persistent left sidebar;
- no persistent right sidebar;
- no major `8+4`, `9+3`, `1fr + 300–350px`, or similar primary-content split;
- maximum readable content width chosen for the course, centered with `margin-inline:auto`;
- long instructional reading may remain left-aligned inside a centered full-width card;
- utility information formerly kept in a sidebar must become a centered full-width section, collapsible panel, or equal card grid.

A DOM element named `.sidebar` or `<aside>` may remain temporarily during migration only if the final rendered layout is single-column and the element is not visually or semantically a side rail. Long-term cleanup should remove misleading legacy structure.

## 3. Hero contract

Every landing page has one primary hero:
- institutional/category eyebrow;
- one dominant page title;
- concise description below;
- balanced meaningful actions;
- no competing second page-wide title.

Typography target:
- primary title: up to 66px Cinzel;
- section titles: approximately 33–44px as hierarchy requires;
- body, controls, navigation, labels and instructional copy: minimum 16px;
- font weight generally 333–444;
- radius: 7px.

## 4. Grid contract

Major content cards must be equal-width and visually balanced.

Preferred desktop patterns:
- 2 cards → 2 equal columns;
- 3 cards → 3 equal columns;
- 4 cards → 4 equal columns;
- 6 cards → 3×2 or 2×3;
- 8 cards → 4×2;
- odd counts → intentionally center the final row or promote the final card to a full-width concluding card.

Tablet generally collapses to two equal columns; mobile to one.

Unequal widths are permitted for small functional control rows such as `input + button`, not for major content sections.

Cards in one visual group should have:
- equal minimum height;
- aligned titles and descriptions;
- controls/actions aligned consistently, preferably at the bottom;
- equal gap and padding;
- no clipped text.

## 5. Header contract

High School identity remains shared. Grade/course personality is expressed below the header.

Student academic header actions should resolve to the approved High School destinations (Profile, Lessons/Courses, Grades where applicable, Games where applicable, Home) without duplicating a second page header.

The hamburger remains top-right and owns the enriched directory behavior.

## 5A. Secondary course / repository navigation

A second navigation layer is permitted when a course or repository needs local routes that do not belong in the ecosystem-wide header.

It is **not** a second site header.

Required:
- render as a compact `<nav>` or equivalent local navigation strip below the canonical header/tickers;
- no repeated K badge, Academy logo, VNV logo, institutional lockup, or second branded masthead;
- no second hero-sized course identity;
- local text labels such as `Algebra I`, `English 10`, or `Unit 04` are permitted as navigation context;
- local links may include Course Home, Units, Lessons, Assessments, Teacher/Family resources, tools, or repository-specific controls;
- the canonical hamburger remains the ecosystem/directory authority;
- do not duplicate Profile, ecosystem-wide destinations, or other canonical-header actions unless a documented accessibility need requires it;
- local navigation may be sticky only if it does not cover the canonical ticker/header stack or consume excessive learning space;
- repeated legacy branded headers must be demoted to this local-navigation role or removed.

Acceptance distinction:
- **canonical branded header:** exactly one;
- **secondary local navigation:** zero or one as needed;
- **primary hero:** exactly one.

## 6. Translator and toolbar

The translator belongs on ordinary public/student learning pages. It must not be duplicated.

The official VNV ecosystem toolbar is six controls in a 3-column × 2-row grid. Do not invent three additional controls to make a 3×3 square.

## 7. Assessment exception

Closed-book or protected assessments may intentionally use reduced-distraction chrome. Do not force study/navigation utilities onto a protected exam merely for visual parity.

Assessment pages must still retain:
- clear Academy/course identity;
- accessible typography;
- centered layout;
- no sidebars;
- safe return/submit behavior;
- no learner-data regression.

## 8. Data and behavior protection

Visual normalization must never:
- clear or rename learner storage;
- alter grades, mastery, attempts, assessment history or provenance;
- change the 80% mastery rule where it applies;
- alter authentication or account authority;
- change course chronology;
- silently replace course data sources.

Presentation scripts must remain separate from academic evidence and scoring logic.

## 9. Acceptance protocol

Before declaring a landing page compliant, verify rendered output:
- 333 ticker = 1 where eligible;
- AutoPopulate ticker = 1 where eligible;
- official header = 1;
- hamburger/menu = 1;
- translator rail = 1 where eligible;
- ecosystem toolbar = 1 where eligible;
- primary hero = 1;
- footer = 1;
- no persistent side columns;
- major card grids equal and symmetric;
- no instructional text below 16px;
- no horizontal overflow at supported phone/tablet/desktop widths;
- print behavior remains usable;
- existing learner data and assessment behavior unchanged.

## 10. Migration rule

Do not rewrite a functioning course wholesale. Normalize one page class at a time, preserve validated curriculum and behavior, test, record the commit and outcome, then propagate the proven pattern.

**Governing principle:** standardize the infrastructure, preserve course personality, protect the learner.
