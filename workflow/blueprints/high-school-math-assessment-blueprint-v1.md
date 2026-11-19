# High School Mathematics Assessment Blueprint · v1

Status: CANONICAL
Date: 2026-11-18

## Scope
Applies to learner-facing assessment surfaces in:
- Pre-Algebra
- Algebra I
- Geometry
- Algebra II

Support pages such as administration guides, printable work pages, and assessment index/hub pages share the same Academy chrome, typography, colors, spacing, and responsive rules, but do not imitate the question worksheet when they are not themselves assessments.

## Canonical learner-assessment structure
1. Official High School chrome remains the shared owner outside the assessment.
2. Distinct charcoal hero with light cream typography and gold divider.
3. Centered title hierarchy:
   - category/kicker
   - assessment title
   - short descriptive subtitle
4. Exactly three symmetrical horizontal charcoal information buttons directly below the hero.
5. Information buttons open bounded modal/dialog panels; explanatory copy is not left as bulky permanent cards.
6. Worksheet identity row: Name · Class/Period · Date · Score.
7. Symmetrical Learning Objective and Directions band.
8. One centered, single-column assessment workspace.
9. Minimum 16 px public text and controls.
10. Questions use clearly numbered worksheet cards.
11. Answer choices are fully clickable labels, not tiny radio targets.
12. Every question includes sufficient work/reasoning space when mathematically appropriate.
13. Visible answered-progress indicator.
14. Long assessments are divided into balanced sections.
15. Section navigation exists at both top and bottom of each question set.
16. Bottom navigation:
    - Previous disabled on first set.
    - Next advances directly to the next set.
    - Last set changes to Review / Submit.
17. Assessment controls: Submit/Score, Save Draft, Export Result, Reset/New Attempt as appropriate.
18. Results preserve course-specific evidence and mastery contracts.
19. Print layout removes navigation/tool chrome and preserves a usable worksheet.
20. Responsive layout collapses cleanly to one column on phones/tablets.

## Runtime ownership rules
- One question configuration owner.
- One question-list/render owner.
- One scoring/submission owner.
- One submit control.
- No competing legacy assessment engine on a rebuilt page.
- No MutationObserver-based assessment repair.
- No polling/setInterval-based assessment remount.
- No duplicate assessment stylesheet generations competing for presentation.
- Shared High School chrome, translator, and learning tools may remain outside the assessment engine when they do not own assessment DOM.
- Course-specific service-worker recovery remains allowed.

## Assessment policy
- Standard mastery threshold remains 80% wherever the course assessment is a mastery gate.
- Diagnostic/readiness assessments remain planning evidence unless the course contract explicitly states otherwise.
- Sub-80 mastery attempts remain evidence and do not unlock the next gated stage.
- Retry behavior preserves the course rule: edit/correct and retry without destructive learner-record clearing.
- Existing learner records, attempt history, evidence keys, and course-specific progression contracts must be preserved during migration.

## Reference implementations
- Pre-Algebra Readiness Diagnostic
- Algebra I Readiness Diagnostic
- Geometry Readiness Diagnostic
- Algebra II Readiness Diagnostic

These four diagnostics are the canonical visual and interaction reference for subsequent midterm, final, weekly/mastery, retention, Unit 0, and unit mastery migrations.

## Migration order
1. Readiness diagnostics — COMPLETE.
2. Midterms and finals.
3. Weekly mastery / retention assessments.
4. Unit 0 exit mastery.
5. Unit 01–13 mastery checks across all four courses.
6. Assessment hubs and support pages receive presentation parity without unnecessary worksheet controls.

## Acceptance checks
For every learner assessment:
- page renders questions without indefinite loading;
- answer labels respond to mouse, keyboard, touch, and tablet rotation;
- progress updates after selection;
- top and bottom section navigation work;
- submit is single-owner;
- save/export behavior remains intact;
- no hidden overlay intercepts answer choices;
- no MutationObserver or polling loop owns assessment DOM;
- 80% mastery logic is unchanged where applicable;
- portrait, landscape, and desktop layouts remain readable;
- print output is clean and usable.
