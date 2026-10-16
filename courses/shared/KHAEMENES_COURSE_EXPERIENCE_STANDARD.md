# Khaemenes Course Experience Standard · v1

This is the shared student-facing standard for Khaemenes Academy course portals.

## Two internal benchmarks

**Visual benchmark:** Khaemenes Academy front desk.

Use a parchment-first page, dark navy/forest contrast selectively, restrained gold, generous breathing room, balanced grids, compact controls, clear hierarchy, and secondary information in menus or dialogs rather than permanent page blocks.

**Experience benchmark:** Khaemenes High Pre-Algebra.

A learner should be able to enter a course and immediately understand who they are, where they are, what they should do now, what mastery is required, what tool or practice can help, and what comes next.

## Student journey contract

Every major course home should make these actions easy to find:

**Persistent learner toolbar:** High School learning surfaces use one compact fixed utility toolbar. Its controls are equal height and width, use 7px geometry, and never overlap or displace lesson content. The standard order is **Preserved Work** (only when needed), **Student Profile**, **Beta Program**. Preserved Work opens above the toolbar; Student Profile routes to the Academy student profile/pinned-course workspace.

1. Continue Learning
2. Current Unit / Week
3. Current Mastery
4. Course Map
5. Games / Tools / Studios appropriate to the subject
6. Portfolio or evidence record
7. Assessments
8. Profile / Pin to Profile
9. Ask Mentor
10. School Menu

Every lesson should end with one explicit **Your Next Step** state:

- continue to the next unlocked lesson;
- complete the required weekly mastery gate;
- complete the unit mastery gate;
- review and correct work before advancing; or
- complete the next cumulative assessment / capstone requirement.

The existing course progression engine remains authoritative. Presentation code may explain or link to the next requirement but must not bypass, duplicate, or weaken mastery gates.

## Visual contract

- Parchment base: #f4f0e7
- Light paper surface: #fffdf8 / #fffefb
- Ink: #17211d
- Navy: #102b43
- Forest: #233e34
- Gold: #b48b45
- Muted: #6f7a73
- 7px radius for student-facing buttons, cards, panels, menus, and dialogs
- Cinzel / ceremonial serif for course titles and headings
- Brandon Grotesque / Avenir / Segoe fallbacks for body copy
- Avoid permanent full-width notices above the course title
- Avoid floating administrative controls when the same action can live in a menu
- Use dark contrast in deliberate bands, headers, menus, or footer areas rather than making the entire learning surface dark
- Keep primary content widths readable and grids balanced
- Do not split words merely to preserve a card width; wrap whole words and rebalance the grid instead

## Information hierarchy

Above the fold should answer:

**Where am I?**
Course and current learning stage.

**What should I do now?**
One primary Continue Learning action.

**How am I doing?**
A concise mastery/progress state.

Administrative material such as architecture notes, repository research, standards evidence, exports, and technical validation belongs in Course Information, Teacher/Records, or a secondary menu unless the learner directly needs it.

## Preservation rules

Presentation upgrades must preserve:

- existing curriculum content;
- assessment question banks and keys;
- mastery thresholds and progression gates;
- learner-scoped persistence;
- local backups and exports;
- accessibility behavior;
- offline/PWA behavior;
- teacher records;
- STOS preservation requirements;
- canonical course URLs and repository structure.

No public page should expose private network architecture or secrets.

## Pilot

Geometry & Spatial Design is the first course migrated to this standard. Its pilot should be used to test the pattern before applying it to Algebra II, Algebra I gaps, English, Science, and Social Studies.
