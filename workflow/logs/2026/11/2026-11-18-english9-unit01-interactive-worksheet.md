# 2026-11-18 · English 9 Unit 01 Accessible Interactive Practice Worksheet

**Types:** source audit · instructional upgrade · accessibility · codex  
**Status:** new page and overview links committed and source-fetched; real-browser/device acceptance **HOLD**. Existing Unit 01 mastery authority unchanged.

## User need
English 9 Unit 01 is difficult for the owner to preview when 80% mastery gates block later material. Create an independently accessible, centered, spacious worksheet that accepts touch-screen and keyboard input, while preserving course mastery requirements and Academic evidence.

## Exact source inspection
Inspected:
- `courses/language-arts/english-9/units/unit-01/index.html`
- `units/unit-01/reading-dossier.html`
- `units/unit-01/vocabulary.json`
- `assessments/unit-01/index.html`
- `weeks/week-01/day-01/index.html`
- `weeks/week-03/day-15/index.html`
- `assets/unit01-evidence-v1.js`, `assets/unit01-evidence-v1.css`, and `assets/fixed-assessment-v1.js`

Source-derived academic contract:
- Unit 01 **Foundations of Scholarly Reading & Writing**, three weeks, 15 days.
- Instructional tasks: annotation; observation versus inference; qualified claim, textual evidence, warrant; analytical paragraph; conventions, revision, and academic integrity.
- Verified first-party reading: **The First Annotation**, embedded in Unit 01 overview, with a reading custody dossier. Additional external published extensions are HOLD until individually identified/custodied.
- Reading-response rubric: comprehension 20, textual evidence 25, interpretation 25, writing clarity 15, revision 15 (100 total).
- Original Day 15 independent assessment uses **Text C / Text D**, 450–650 words, applied 10-item conventions check, and human-evaluated 8/10 mastery. This separate assessment must not be overridden, previewed through a generated answer key, or replaced by a reading microtext exercise.

## Implementation
Added `courses/language-arts/english-9/units/unit-01/interactive-worksheet.html`:
1. Read and annotate verified first-party microtext, touch/keyboard toggle buttons with `aria-pressed` and two evidence-note textareas.
2. Distinguish observation and inference with accessible radio controls, qualified inference and uncertainty responses.
3. Build a claim, cite details, write warrant and acknowledge limits.
4. Independently compose an evidence-based analytical **practice** paragraph.
5. Preserve original and revised paragraphs separately, describe conventions correction and substantive revision.
6. Reflect, check evidence, view existing 100-point human rubric, and explicitly export/import the work.

**Presentation:** centered single-column layout max 920px, 16px minimum prose/controls, Cinzel headers 33/24px, Brandon Grotesque/Nunito body, charcoal/cream/gold with restrained green, radius 7px; symmetric 2-column internal response areas collapse to one column on small devices. All inputs have labels; skip link, visible focus, semantic fieldset/legend, status live region, touch targets at least 48px.

**Evidence safety:** No browser localStorage/sessionStorage writes, no hidden auto-save, no score/grading/mastery/unlock calls, no new server endpoint. Explicit JSON export and opt-in local JSON import (schema/bounded input validation) and print control. The page cautions that closing without exporting loses unsaved answers. This is a **supplementary practice worksheet**, not the independent assessment.

Linked the worksheet twice from `units/unit-01/index.html`: a hero action and an accessible centered preparation panel.

## Source checks
- GitHub creation and update commits returned successfully.
- Fetched worksheet and overview again: page exists (~21.6 KB), 6 numbered stages, 2 overview links, no localStorage in worksheet, 80% distinction present.
- Initial static precommit assertions for reading, 6 stages, absence of mastery writes, export/import handlers, accessibility hooks, and rubric totals passed.
- **Not tested:** live page rendering, actual keyboard-only navigation, mobile/tablet touch behavior, real download/import, print output, ticker/header idempotency, runtime JavaScript console, or screen reader QA. No actual student mastery grade or records changed.

## Next acceptance
Manually load the worksheet directly from the public GitHub Pages route (so owner can inspect regardless of 80% mastery locks), check at 320px/mobile and landscape tablet as well as desktop. Enter fictional practice answers; export, reload, import, verify answer fidelity, and test keyboard tab/space/enter, labels, large tap targets, print, and no course mastery changes. Avoid real learner records in this acceptance.

**Mastery policy:** Day 15 independent 8/10 evaluator review remains authoritative. Do not use practice completion or the Unit overview's simple completion control as evidence of mastery.
