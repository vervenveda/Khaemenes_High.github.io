# Khaemenes Academy | English 9–12 Reading-to-Writing Evidence Studio

Release: 2026-11-16  
Scope: English 9, English 10, English 11, and English 12  
Status: Committed on main; synthetic integration tested; GitHub Pages browser delivery and CI run results still require verification.

## Canonical design

- One shared engine: `courses/shared/english-evidence-studio-v1.js`
- One centered VNV/KA stylesheet: `courses/shared/english-evidence-studio-v1.css`
- Four separate student routes: `courses/language-arts/english-{9,10,11,12}/evidence-studio.html`
- Entry points from all four course homepages and Reading Headquarters.
- Reading Headquarters week-specific entry points for 9, 11, 12; English 10 studio supports selecting Week 01–36.
- Activity summary and links in each Student Progress and Student Portfolio page.
- Canonical assigned reading is loaded directly from each grade's preexisting `assets/curriculum-data.js`; no duplicate reading dataset.

## Grade-specific instructional progression

| Course | Evidence Studio practice |
|---|---|
| English 9 | Claim, close-reading evidence, explanation, accurate locator |
| English 10 | Comparative analysis, rhetoric, and counterclaims |
| English 11 | Three explained details or sources, synthesis, qualification, counter-interpretations |
| English 12 | Original scholarly argument, provenance, counterargument, oral-defense preparation |

Five student stages: interpretation; evidence chains; draft/counterargument; feedback and revision; reflection/oral defense. Grade-specific guidance is planning feedback, **not** an automated grade.

## Record custody and privacy

- Student work is stored in separate keys for learner, course, and week.
- The existing Academy course-entry contract validates the active learner and scopes each record.
- Unregistered or invalid learners do not create anonymous saved reading/writing records.
- Switching the active learner or cross-tab changes pauses editing and saving; work remains on screen.
- JSON export retains the original draft, evidence, citations, review notes, revised draft, reflection, and oral defense when present.
- The Print Studio control produces a full-length print view that includes long form drafts and revisions.

## Existing academic authority preserved

No change to:

- weekly quiz or unit assessment engines
- prior assessment attempts
- grades, numeric project scores, or grade weights
- 80% mastery threshold or unlocking
- teacher/parent evaluator sign-off
- Grade 9's distinct course architecture
- English 10–12's canonical curriculum and record schemas

Studio activity counts (weeks started, revised, reflected) are developmental indicators **only**. Exported packets need to be added to the student's existing portfolio and reviewed by a teacher or parent educator. No automatic official portfolio grade or cloud synchronization is implied.

## Quality checks

- Source files committed and fetched back from GitHub.
- Shared JavaScript syntax evaluated successfully.
- Four simulated student interactions: canonical assignment load; draft/revision save; week switching and record isolation; correct grade-level challenge visibility.
- Course and studio entry points verified in GitHub source.
- All four studio pages contain distinct, nonduplicated field IDs, the learner contract, and canonical curriculum data loader.
- Regression suite: `node --test courses/language-arts/tests/english-9-12-evidence-studio-regression.mjs`
- CI: `.github/workflows/english-reading-sync-validation.yml` updated to run the new suite for touched studio paths.

### Still to verify in an actual browser

1. Sign in as a test learner; open the Week 01 studio from Reading Headquarters.
2. Enter claim, evidence, citation locator, first draft, feedback, revision and reflection.
3. Reload; confirm saved work remains for that learner only.
4. Switch to Week 02; confirm Week 01 remains unchanged.
5. Test learner B; confirm learner A's drafts cannot be read or overwritten.
6. Download JSON evidence and verify it exists on disk.
7. Print a long original and revised essay; confirm no clipping.
8. Check desktop, phone and tablet portrait/landscape navigation, contrast and focus.
9. Run the Node regression suite and confirm GitHub Actions job conclusion.
10. Verify published GitHub Pages content at the actual deployment domain.

This release does not claim completion of the production Account Cloud integration.
