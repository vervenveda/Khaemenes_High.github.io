# English 9 · Khaemenes Academy Curriculum Continuum

**Checkpoint:** 15 October 2026  
**Canonical source:** [Khaemenes High School](https://github.com/vervenveda/Khaemenes_High.github.io), branch `main`.  
**Maintainer:** Jennifer Kay Pearl.

This file is a **public, curriculum-only technical checkpoint**. It contains no private STOS topology, secrets, private student work or account identifiers.

## Governing educational agreements

- Preserve existing original texts, word counts, academic sequence, rubrics, lesson materials, student work, history and unit navigation.
- Every school day is its own accessible HTML page, linked from the weekly course hub and unit page. Learner writing remains synchronized with its original save keys when available.
- Every lesson deliberately returns to earlier learning through **Connect · Apply · Reflect**; genuine skill transfer matters more than decorative interactivity.
- Four ordinary daily lessons per week each have a five-question formative check. **Best 80%** unlocks the visible, direct next-lesson button.
- The final daily independent demonstration is **not** auto-scored. It retains the original separate writing products and a five-criterion **10-point rubric**. A human-entered **8/10** review on the *exact submitted version* unlocks the following week.
- Preserve original independent Draft 1 records, distinct revisions, explanatory feedback and device-local JSON exports/imports. Never silently replace a student's work.
- The existing `KhaemenesCourseEntryContract`, learner-scoped `khae-ela9-field:` and `khae-ela9-progress-v1` conventions are maintained. Safeguard learner switching, conflicting tabs, damaged records and stale reviews.
- **Security boundary:** GitHub Pages is a public static host. Human-entered reviews are locally recorded evidence, not authenticated or certified official school grades. Official private grading authority requires a separate approved implementation.
- Preserve the Academy parchment aesthetic, balanced centered grids, 7px corners, accessible controls, menu/breadcrumb links, PROSE compatibility and free access. Avoid added third-party runtimes.

## Completed individual lesson sequence

| Week | Focus | Days | Independent assessment requirement |
| --- | --- | --- | --- |
| 04 | Why Humans Make Myths | 16–20 | 300–450-word myth analysis; 8/10 rubric |
| 05 | Epic Heroes & Cultural Values | 21–25 | 400–550-word independent comparison; 45-minute target; 8/10 |
| 06 | Comparative Myth Synthesis | 26–30 | 700–900-word comparison, 4–6 pattern map, approximately two-minute oral or 180–250-word written defense; 8/10 |
| 07 | Character, Conflict & Setting | 31–35 | 300–450-word literary analysis, 350–550-word revised scene, 100–150-word craft commentary; 8/10 |
| 08 | Point of View, Structure & Irony | 36–40 | 350–500-word analysis, 180–260-word perspective rewrite, 100–140-word craft note; 8/10 |
| 09 | Original Narrative Workshop | 41–45 | 900–1,400-word story, at least six craft annotations, 250–350-word commentary; 8/10 |
| 10 | Image, Diction & Figurative Language | 46–50 | 300–450-word analysis of *Inventory at Dusk*, two original revised poems (12–20 and 8–16 nonblank lines), 120–180-word craft note; 8/10 |

## Week 10 file map and verified publication

- Original course poetry preserved: *After Rain* (Day 46), *Borrowed Coat* (Day 47), *Kitchen Light, 2:13 A.M.* (Day 48); independent *Inventory at Dusk* (Day 50).
- Weekly hub: `weeks/week-10/index.html`.
- Individual lessons: `weeks/week-10/day-{46,47,48,49,50}/index.html`.
- Shared code: `assets/week10-daily.js`, `assets/week10-assessment.js`, `assets/week10-daily.css`.
- Regression: `tests/week10-daily-regression.mjs`, `tests/week10-daily-behavior.mjs`, included in `.github/workflows/english9-daily-lesson-validation.yml`.
- Days 46–48 retain their original writing keys. Day 49 has a daily response and separate poem drafts/revision notes. Day 50 has an independently completed analysis, two original locked drafts, two finals, two revision rationales, a craft note, personal reflection and review.
- Release `dd74089917fbae9cfd05f1144288435a076b2cee` passed English 9 daily validations, routes, profile quick links, record validation, release integrity and Pages deployment. The placement workflow then flagged three whitespace-only lines; these were corrected in `a4c94a165d1d81694ec4a155291a1cec0d201919`, on which all triggered workflows passed (placement workflow did not rerun on the corrected commit).
- A separate English 9 landing-page report-template syntax issue was repaired by escaping an embedded closing script tag. The actual student profile widget was restored as a properly loaded page script.

## Former verified checkpoints

- Week 07: `5bfef38a6cedd06faeff082cb06482e0c0e1cbd4`.
- Week 08: `f8bb302bbc750ad8b331c6b53d533ef7a8d4b29b`.
- Week 09 test correction: `1e392f25396012c48e1f9ca36d76240944555bb2`.
- Week 10 corrected release: `a4c94a165d1d81694ec4a155291a1cec0d201919`.

## Resume protocol

1. Read this file and confirm current `main` SHA and GitHub Actions conclusions before editing. Never assume a transcript is the current repository truth.
2. Inspect Week 11's **existing** text, readings, rubric and assessment products. Create five new individual lessons only in accordance with that source.
3. Retain prior progress keys, free access, independent work and passing thresholds. Add the next-week button only after mastery and validation.
4. Run lesson-level structural and simulated learner behavior regression, public route validation, student profile link validation, release integrity and GitHub Pages deployment.
5. Beta test on student devices; automated success does not prove every browser/device interaction.
6. Continue to English 12 grade by grade after finishing English 9.

**Avoid putting security-sensitive infrastructure, private keys, internal authority paths or personal student data into this public documentation.**
