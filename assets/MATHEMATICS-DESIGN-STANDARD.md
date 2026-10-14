# Khaemenes Academy — shared mathematics presentation standard

**Canonical implementation:** [math-course-visual-unifier.css](./math-course-visual-unifier.css). The shared stylesheet is already imported by the Algebra I, Geometry and Algebra II course stylesheets.

## Inspiration and goals

Preserve the Pre-Algebra experience: calm, legible presentation; visible learning pathways; approachable mathematics; clear response feedback; accessible interactive controls; and consistent resources. Use the clean Verven Veda parchment presentation as the unifying visual language, without copying the older Pre-Algebra dark-screen colors.

## Standards

- **Typography:** Cinzel-family headings, Brandon Grotesque/Avenir-style readable body fallbacks. Avoid overly heavy headings. Body reading approximately 1.7 line height and 74-character maximum line length in reading sections.
- **Layout:** balanced cards, 7px rounded corners, predictable content gaps, responsive single-column reading at narrow widths, minimum 44px button targets.
- **Controls:** keyboard-visible focus and clear disabled states. Dynamic scoring and status information remain text-accessible.
- **Teaching:** prioritize explanation, worked examples, guided practice, correction, then independent transfer. Keep demonstrations and actual graded controls distinct.
- **Visuals:** limit horizontal overflow for figures and formula blocks; keep tables and mathematical symbols accessible.
- **Printing:** neutral white/black, preserved question text and answer spaces. Course-specific student worksheet rules take precedence.
- **Privacy:** styling must never alter scoring, navigation authority, learner-specific evidence storage, STOS artifacts or offline-cache semantics.

## Existing course imports

- Algebra I: `courses/mathematics/algebra-1/assets/styles.css`
- Geometry: `courses/mathematics/geometry/assets/styles.css`
- Algebra II: `courses/mathematics/algebra-2/assets/styles.css`

All use `@import url("../../../../assets/math-course-visual-unifier.css?v=20261013");`. Update the query string together when deploying new CSS if cache refresh is needed.

## Validation before further changes

1. Verify the stylesheet import on each course and representative lessons.
2. Test narrow mobile and landscape viewport sizes, keyboard focus, reduced motion, and print preview.
3. Check student pathways, mastery-locked elements, inline reading, card grids, games and mathematics diagrams.
4. Verify no JavaScript, mastery authority, or storage files were touched by a presentation change.
5. Preserve canonical main branch and STOS neutrality. Do not create separate theme forks for different courses.
