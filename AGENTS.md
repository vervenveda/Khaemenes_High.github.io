# Khaemenes Academy High School — Codex instructions

**Guiding principle: “Make the learning challenging, not the navigation.”**

Before creating or editing Academy courses or lessons, consult the canonical cross-grade blueprint:

- [Khaemenes Course Codex Blueprint v1](https://github.com/vervenveda/vervenveda.github.io/blob/main/assets/KHAEMENES-COURSE-CODEX-BLUEPRINT-v1.md)
- [Universal Lesson Presentation Standard v1](https://github.com/vervenveda/vervenveda.github.io/blob/main/assets/KHAEMENES-LESSON-STANDARD-v1.md)
- [Shared opt-in stylesheet](https://vervenveda.com/assets/khaemenes-lesson-standard-v1.css)

## Non-negotiable implementation rules

1. Work on **main** as authorized. First inspect actual course/lesson markup, existing CSS/JS, progression rules, student data storage and accessibility behavior. Keep changes small, reversible, and scoped.
2. Never delete or truncate academic instruction, examples, activities, evidence questions, printable worksheets or learning records merely to simplify the page.
3. Prefer the four-stage lesson navigation: **Prepare → Learn & Practice → Deepen Understanding → Reflect & Finish**, with a compact roadmap and no hidden mandatory material. Keep original instructional section order on migrations.
4. Use the Academy full-width official header, canonical K badge, hamburger at top-right, 333 and AutoPopulate tickers (where appropriate), **breadcrumbs directly below the header**, one official ecosystem toolbar, and centered footer. No duplicate menu/mentor/beta/profile widgets.
5. Color/style: charcoal `#202724`, cream `#fff8e9`, parchment `#f4f0e7`, ivory `#fffdf8`, gold `#b8995c`, Cinzel headings, Brandon Grotesque/Nunito fallback, maximum font weight 444, 7px radius. Lesson unit/day label centered at 24–33px. Body/controls >=16px.
6. Separate the **presentation contract** from subject-owned assessment engines. Keep 80% mastery gates, retry rules, identity checks, grade calculations and progress records unchanged unless an explicitly authorized academic repair is requested.
7. Provide editable, printable response areas, explicit save states and learner-scoped persistence. Do not imply a local-browser save has reached a server/cloud. Preserve work on failure.
8. Verify actual responsive layout, keyboard/focus, accessible labels, normal zoom, print and failure states. Source-level tests are not runtime certification; report both accurately.
9. Do not introduce secret credentials or internal architecture into public-facing pages or documentation.

For existing Science 9 Unit 00 reference, inspect `courses/science/integrated-science-9/diagnostic/lessons/day-01.html`, the scoped stylesheet `diagnostic/lesson-vnv-ka-blueprint-v1.css`, and regression tests under `diagnostic/tests/`. The pilot is **not** a blanket approval to replace the educational design of all grades/courses; certify a representative lesson before batch migration.
