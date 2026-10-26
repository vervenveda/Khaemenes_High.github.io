# Algebra I — Workflow Card Navigation and Parchment Contrast Audit
Date: 2026-10-26
Branch: `main`

## Request and source evidence
The ten workflow tiles across Algebra I lessons were inert `<article>` elements in the shared Mathematics workflow module. The user requested actual in-page card links to the corresponding instructional/work sections, with the crisp Pre-Algebra parchment and contrasting charcoal palette.

The workflow is loaded through `courses/mathematics/algebra-1/assets/lesson-resource-bridge-v1.js`, which loads `algebra1-workflow-adapter-v1.js`, then the shared `courses/mathematics/assets/course-lesson-workflow-v1.js`. The registry contains 87 Algebra I lesson HTML files across 13 units; all thirteen representative Unit 01–13 Lesson 01 pages examined include the lesson-resource bridge.

## Changes
1. Opted **Algebra I only** into workflow navigation with `enableStageNavigation:true`. Other Mathematics courses are not forced to adopt the new card behavior.
2. Each stage resolves a *real* lesson element, then becomes an accessible anchor:
   - Learn: objectives/lesson reading
   - Worked Example: actual worked example section when present
   - Practice: practice, lab or guided exercise
   - Game / Tool: a present lesson game companion
   - Optional Video: an available, certified video companion only
   - Submit Assignment: existing submit/score control
   - 80% Mastery: canonical score/status display
   - Review: existing reflection field
   - Evidence: existing export control
   - Continue: existing continuation control, **only after canonical mastery and only if the actual link is visible**
3. A stage with no present destination remains a noninteractive article. In particular, unavailable videos cannot generate invented links and locked continuation cannot bypass the existing mastery authority.
4. Added scroll anchors, destination focus for assistive technologies and visible keyboard focus indicators. Does not remove native buttons, inputs or textareas from the keyboard tab sequence. Does not target unopened dialogs or collapsed details.
5. Scoped the workflow cards and worksheet to **Pre-Algebra-inspired parchment (#fffdfa / #f5f1e8) and charcoal (#202925)** with forest and restrained gold details, soft shadows, 7px corner radius and regular-weight typography. Does **not** re-theme assessments, existing lesson content or other courses.

## Verification performed
- Shared JavaScript and Algebra I adapter passed JavaScript syntax compilation after each code edit.
- An isolated DOM-behavior simulation verified the card conversion for present Learn, Example, Practice, Game, Submit, Mastery, Review and Evidence destinations; absent Video stayed unlinked; Continue stayed unlinked before mastery and gained a link after the simulated authority confirmed mastery and the native continuation control appeared.
- Thirteen representative lesson entry files (the first lesson of each unit) include the resource bridge; a new Node regression test is configured to inventory **all 87 lesson files** when CI runs.
- A new source and behavioral regression `courses/mathematics/algebra-1/tests/lesson-workflow-navigation-regression.mjs` and `.github/workflows/algebra1-lesson-workflow-navigation.yml` preserve opt-in, ten-stage inventory, selectors, inaccessible/locked stage guardrails, core page coverage and parchment styling.
- Connected GitHub commit status API did not return any completed status checks for the final test commit. **Do not mark CI green** without an actual completed run.

## Remaining browser certification
On an unlocked Unit 01, Unit 06 and Unit 11 lesson:
1. Use keyboard Tab, Enter, and touch to activate all available workflow cards and verify the destination is in view with focus properly moved.
2. Open and close a deep-lesson worked example, then check that it only becomes linked if accessible on the page.
3. Verify disabled Video indicates unavailable when no reviewed placement exists.
4. Complete official quiz submission, inspect the canonical score and verify **below 80%** never exposes Continue.
5. Verify scores, reset/retake, reload and browser-local evidence remain governed by the pre-existing course engines.
6. Inspect a narrow mobile viewport, print styles, and the parchment-to-dark-dashboard transition.

No official mastery gates, assessment banks, questions, answers or Academy learner identity files were modified for this navigation task.
