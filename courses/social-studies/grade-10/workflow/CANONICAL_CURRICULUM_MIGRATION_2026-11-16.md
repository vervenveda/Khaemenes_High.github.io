# Grade 10 Social Studies · Canonical Curriculum Migration
**Date:** 2026-11-16  
**Course:** Grade 10 United States History Honors  
**Status:** Production front door migrated

## Purpose
Unify Grade 10 with the canonical curriculum architecture already used across the high-school Social Studies program without rewriting or discarding the existing 36-week U.S. History curriculum.

## Canonical files
- `course-data.js` — authoritative curriculum content.
- `app.js` — authoritative learner portal renderer, mastery logic, reports, and browser record handling.
- `index.html` — lightweight production shell that loads the canonical curriculum and renderer.
- `styles.css` — course presentation layer.

Do not re-embed a second curriculum object inside `index.html`.

## Preserved curriculum
The migration preserves the existing 36-week sequence, 180 daily lessons, 108 principal assignments, 36 weekly mastery quizzes, midterm/final structure, state-localization policy, and 80% Academy mastery standard.

## Learner-record continuity
The former production portal stored records under:
`KHAE_SS10_USH_CLEAN_PORTAL_V1`

The canonical portal stores records under:
`khaemenes_grade10_social_studies_v1`

On first canonical load, `app.js` checks for the legacy record only when no canonical record already exists. Compatible lesson completion, assignment submission, quiz mastery, and exam evidence are copied into the canonical record. The legacy record is not deleted.

## Rollback
The complete pre-migration production page is preserved at:
`workflow/legacy-index-pre-canonical-migration-2026-11-16.html`

This file is for forensic rollback/reference only and must not become the production front door.

## Validation performed
- Production `index.html` contains no embedded `const APP = ...` curriculum.
- `course-data.js` loads before `app.js`.
- Required static learner/navigation controls are present.
- Canonical data contains 36 distinct official weeks.
- Canonical data contains 180 daily lessons.
- Each of the 36 weekly mastery quizzes contains 10 objective questions.
- Existing 80% progression/mastery policy is preserved.
- Mentor context now reads from `window.KHAEMENES_SOCIAL_STUDIES_DATA`.
- Legacy browser record migration is present.

## Next hardening
1. Browser regression-test new learner, returning learner, and migrated legacy learner.
2. Verify Week 18 → midterm → Week 19 gate.
3. Verify printable packets against canonical weekly content.
4. Expand future assessment banks without changing the 10-question learner-facing draw unless deliberately approved.
5. Continue department-wide lesson-engine normalization while retaining grade-specific content.
