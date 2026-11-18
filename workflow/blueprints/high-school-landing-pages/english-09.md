# English 9 · Language Arts & Literature · Landing Page Blueprint

**Parent authority:** [Canonical High School Landing Page Blueprint](CANONICAL_HIGH_SCHOOL_LANDING_PAGE_BLUEPRINT.md)  
**Canonical landing route:** `courses/language-arts/english-9/index.html`  
**Recorded:** 2026-11-17

## Current source observation

Current landing source contains a legacy 310px + 1fr pattern, though later shared work has introduced centered/unified lesson presentation in parts of the course.

This observation is diagnostic only. It does not make legacy architecture authoritative.

## Required target architecture

Centered English portal with no side rail. Reading, writing, vocabulary, progress, Reading Headquarters, assignments, and course map become centered sections. Long reading/writing instruction stays full width; tool collections use equal grids.

## Course-specific rules

- Retire 310px major side rail.
- Preserve Reading Log/reading evidence and learner records.
- Full canonical chrome and translator; official toolbar on public learning pages.
- Continue using unified lesson-engine work where already validated.

## Shared requirements

- exactly one eligible 333 ticker and one AutoPopulate ticker;
- exactly one official High School header and enriched hamburger;
- translator on ordinary public/student learning surfaces;
- one official six-control ecosystem toolbar where eligible;
- one centered primary hero;
- no persistent left or right side column;
- major peer card groups equal-width and symmetrical;
- minimum 16px readable text;
- centered footer;
- responsive 4/2/1, 3/2/1, or 2/1 grid behavior as content count requires;
- no changes to learner records, scoring, mastery, assessment history or course chronology during visual normalization.

## Acceptance

A repair is not complete until rendered output is checked at desktop, tablet and phone widths and the workflow log records affected files, commit SHA, static/browser results, remaining holds and any intentional exception.

## English 9 implementation reference · 2026-11-18

The earlier 310px + 1fr source CSS remains as inactive legacy in the file, but the later `khaemenes-english-centered-landing-v1` rule changes the rendered `.app` to a centered block with no fixed side navigation. **The rendered layout, not the old declaration alone, is the acceptance subject.** Legacy declarations should be retired only after visual acceptance, without touching course logic.

### Verified source wiring and intended visuals
- `courses/language-arts/english-9/index.html` contains the canonical `high-school-global-chrome-v2.js` loader, official translator and `high-navigation-v1.js` with no second institutional header. Global chrome mounts the VNV header and directory hamburger; the VNV official toolbar owns the lower-right six-control 3-column × 2-row dock (Profile, Search, Updates, Mentor, Support, Beta).
- The landing now explicitly loads `assets/vnv-dual-ticker-v1.js` and `courses/shared/high-school-class-tools-left-v1.js` once; `high-navigation-v1.js` also detects/deduplicates the ticker guard. Preserve the 333 Network ticker and AutoPopulate ticker as independent, idempotent entities.
- English 9 provides a compact centered **six-control 3×2 primary course navigation**: Home, Lessons, Tools, Writing, Assess, Guide. On tablet and phone it becomes **two equal columns** and **three rows**; do not force two lonely cards into a third row on a larger screen.
- A **separate left floating Tools disclosure** is collapsed by default. Its two-column expanded panel links Reading, Writing, Lessons, Assess, Search, Parent plus Print and Course; subject-specific URLs belong in the reusable resource resolver, never the learner-record layer.
- Learner profile, supplementary practice, and teacher/course information are `<details>` sections, **closed by default**. Do not expose all 36 weekly choices or long option sets on the initial landing.
- One primary centered H1 `#mainTitle` in the hero; local course context is a small paragraph, **not** a second H1 or institutional masthead.
- Cinzel for titles, Brandon Grotesque/Nunito for text; minimum 16px readable controls; no heavy font weights; charcoal controls with cream text; parchment body and gently contrasting hero/panel surfaces; 7px radii; symmetric gaps; centered footer.
- Long learning content stays in a single centered column; **do not invent persistent layout sidebars**. Floating left and right resource docks are tools, not primary content columns. Ensure they do not overlap one another or obscure essential text, especially on phones; account for reduced-motion and print.
- Assessments/closed-book examinations may suppress study/search utilities and must retain their separate secure layout and mastery rules.

### Changes made
1. `courses/shared/high-school-class-tools-left-v1.js` added in commit `7d11790c0038dc4c373b328668a6f84d398c6b6f`; link to existing Week 01 lesson repaired in `ff0e5970077535ad96599aaf0582c9d143d21b43`.
2. Dual-ticker and left-tools script hooks on English 9 landing: `40660e71bac816ff279d3655d470b17a42ee8e03`.
3. Centered six-button course nav and collapsible visual contract: `45dfdacc85eca5f5471489df709704211de9b28a`.
4. Grade 09 visual regression updated to distinguish intended nav class and six labels from outdated exact-class assertion: `67ef7c7e29f0a04f6f18aa3834cbd3f73843c4ee`.
5. Eliminated duplicate course masthead and gave the hero its sole primary H1: `ffa6369a4241f631a56424a116dd9aff33304411`.

### Acceptance still outstanding
- Source inspection and GitHub route/ticker checks do not confirm that the remote VNV header/menu, VNV ticker mounts, either toolbar, or mobile line wrapping look correct in a live browser. Verify visual output, bounding boxes, computed fonts, 333/AutoPopulate/header/toolbar instance counts, exactly one official menu, and 255/375/768/1280px widths before marking exceptional visual parity.
- Grade 10–12 pages are **not** changed by this English 9 landing-page rollout. Port the proven components and grid tokens after Grade 9 browser acceptance.
- The left-tool resolver must be course-availability-checked and specialized before loading on upper English pages; Grade 9 use is the current bound rollout.
- No learner-data synchronization, account persistence, grades, student profile, or assessment engines were altered for these visual changes.

### Responsive collision and equal-card follow-up
- Left resources moved above the official lower-right rail for viewports up to 720px, avoiding competing dock hit targets; commit `81604e72518f2971a042d9e1c19526cd97299459`. Still requires browser bounding-box verification.
- The English 9 dashboard's historical 8+4 card splits now stack as two full-width centered sections. Peer 6/6 and 3/3/3/3 cards remain balanced at desktop, become two equal columns on tablet and one on phone; commit `dcbd3f0b4868062a672adfd9d76d1344ad9a341c`.
