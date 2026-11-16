# Khaemenes Academy · Research-Based English Lesson Design Standard
**Proposal:** v1.0.0 · **Date:** 2026-11-16 · **Applies to:** English 9–12
**Governance:** DESIGN PLAN ONLY · NOT YET ENFORCED ON THE LIVE LESSONS
**Parent engine:** `courses/shared/english-unified-lesson-engine-v1.js`
**Page architecture reference:** VNV/KA Canonical Page Architecture & Design Blueprint v1.0

## Scope and source boundaries
This specification synthesizes the literature review and the founder's 2026-11-16 screenshot of an English 9 Week 01 Day 01 page. The screenshot visibly includes two very slim top ticker strips, the academy navigation header, lesson provenance/source card, the first-day title, unified lesson path panel, task cards, reading passage and lower-right toolbar. The **entire browser webpage appears at an unusually tiny scale** relative to its Chrome window. This **does not establish whether Chrome browser zoom, the Academy's in-page reading-size control, CSS, or device scaling caused it**. Inspect the browser zoom and computed font sizes before attributing a bug to the page. Do not silently set zoom or reset user preferences.

The following recommendations are **research-informed product hypotheses**. The referenced research does not establish that this exact seven-stage KA design improves student test scores. Test it.

## Evidence register
| Research / standard | What the source supports | Proposed design implication | Qualification |
| --- | --- | --- | --- |
| Mayer & Moreno, *Nine Ways to Reduce Cognitive Load in Multimedia Learning*, Educational Psychologist 38(1), 2003, https://doi.org/10.1207/S15326985EP3801_6 | Limited capacity, competing visual/verbal demands and strategies to mitigate instructional cognitive load | Keep source text and its related evidence question adjacent; remove duplicated directions and unrelated animated distractions during focused reading | Direct tests emphasize multimedia learning, not this exact HTML layout |
| Dunlosky et al., *Improving Students' Learning With Effective Learning Techniques*, Psychological Science in the Public Interest 14(1), 2013, https://doi.org/10.1177/1529100612453266 | Practice testing and distributed practice have high utility across many learning tasks; rereading/highlighting alone less reliably effective | Include low-stakes recall, distributed review and meaningful feedback without treating clicks as mastery | This is pedagogy evidence, not a page-navigation experiment |
| CAST, *Universal Design for Learning Guidelines 3.0*, 2024, https://udlguidelines.cast.org/ | Customize display, support multiple representations, develop self-regulation and actionable feedback | Responsive reflow, accessible display controls, multiple ways to understand material and optional supports | Accessibility/UDL guidance is not a guarantee of learning gains |
| Menu depth and metacognitive support in e-learning, Frontiers in Education 2023, https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2023.1161460/full | Direct experiments on menu architecture and checklist-related learning measures | Measure navigation effectiveness rather than assuming fewer menus always improve learning | Do not overstate a null or context-specific finding |
| Signaling principle evidence, ERIC record EJ1269127, https://eric.ed.gov/?id=EJ1269127 | Visual cues can assist attention in multimedia learning | Reserved visual emphasis for objective, example, evidence, feedback | Effect sizes from earlier review need direct rechecking before numerical reproduction |
| W3C WCAG 2.2, https://www.w3.org/TR/WCAG22/ | Accessibility criteria for resizing text, reflow, keyboard focus, labels, contrast | Accessibility must be measured at 200% text and narrow viewport; do not disable native browser zoom | Technical accessibility standard, not an efficacy trial |

Do not put unverified effect-size claims in public-facing Academy copy. Use the published research as a rationale for controlled testing, not marketing promises.

## Canonical seven-stage instruction flow
1. **Recall**: concise prior-knowledge question; use existing formative answers, never make a new grade.
2. **Learn**: single student-friendly goal, lesson objective and success evidence.
3. **Read**: authentic, source-provenance-aware, sufficiently complete reading; visibly related questions immediately alongside material. Keep required reading visible by default.
4. **Worked example**: expert modeling of evidence, reasoning and limitations; no answer leakage for protected assessments.
5. **Guided practice**: scaffold with explicit feedback and an optional extension.
6. **Independent application**: preserve student-authored evidence using existing grade-specific fields/portfolio routes; include transfer to a new passage when appropriate.
7. **Review and reflect**: brief retrieval, revision/next steps; distinguish practice indicators from the authoritative 80% mastery gate.

**Interaction rule:** stage navigation is an optional overview, not a mandatory stepper and never a new progression authority. Do not dynamically hide student writing controls or assessment instructions. Required reading and essential tasks remain visible/keyboard reachable; support, examples, and extensions can be collapsed by default.

## Centered VNV/KA page structure
- One official 333 ticker and one AutoPopulate ticker, each mounted once with independently operable pause.
- One official VNV/KA header and searchable right-side hamburger; no competing page-wide headers or utility bars.
- Compact hero: institutional eyebrow (not a competing large title), prominent page title, one measurable objective, a single 'Begin learning' anchor, and a brief real progress indicator only if authoritative learner data are available.
- Use Cinzel for titles and a readable body (Nunito/Brandon Grotesque or fallback). No body, button, labels or instructions smaller than 16px; preferred descriptions 18px. Restrained weight 333–444.
- Charcoal `#202724`, light cream `#FFF8E9` and parchment surfaces, with gold reserved for meaning. Keep text/background contrast under explicit review. 7px radius, centered symmetrical cards, no persistent side navigation.
- Prioritize an approximately 65–80-character reading line, responsive max-width and strong 200%+ browser-zoom reflow. This is an initial heuristic, not a strict research-established line length.
- Open passage next to its questions; explanations adjacent to practice; action buttons at the foot of each card. Use even grids that collapse 4→2→1 where appropriate, never prevent ordinary scrolling.
- Centered footer, official lower-right dock with no obstruction of text fields, screen-reader announcements or sticky overlays.
- **Focused Reading** toggles improved line spacing and reduced decorative movement; provide opt-in pause/suppression of ticker motion **without destroying mounted tickers**. Preserve independent pause preference where technically possible. Never hide essential navigation or accessibility controls.
- Never apply `html { zoom: ... }`, `user-scalable=no` or CSS transform scaling to the entire page. In-page reading adjustments should alter reading content safely; test native Ctrl/Cmd +/- and touch zoom separately.

## Academic quality by grade
| Grade | Reading and analytic emphasis | Expected independent output | Scaffold policy |
| --- | --- | --- | --- |
| **9** | Observation vs inference; precise evidence; annotation and grounded claim | Defensible paragraph and short multi-paragraph analysis, with honest uncertainty | More visible models, source annotation steps and sentence-frame help |
| **10** | Context, characterization of sources and comparison; evidence-supported argument | Multi-source analysis, counterreading and purposeful revision | Transfer from modeled example to fewer hints across week |
| **11** | Rhetorical situation, public discourse, argument and source reliability | Rhetorical analysis evaluating audience/purpose, competing interpretations and missing evidence | Source comparison tools, advanced counterclaims, progressively fading frames |
| **12** | Ethical research, source provenance, synthesis, transfer and independent defense | Mature synthesis, qualification, source evaluation and oral/written defense | Minimal mandatory scaffolding; optional deep research notes and rigorous self-checks |

The uniform **shell** must not produce uniform *content depth*. Preserve existing source custody and assignment distinctions in each curriculum.

## Implementation backlog (work in sequence)
### Phase 0 · Measure and freeze representative pages (no visual changes)
- Archive source SHA and note the exact Grade 9 Day 1 screenshot concern.
- Capture browser window zoom percentage, computed body/paragraph size, device pixel ratio, view width, viewport clipping, current two ticker heights and header position.
- Verify English 9, 10, 11, 12 Week 01 Day 1 current teaching text, navigation and saved-field identifiers. Read-only inventory.
- Establish core telemetry using **local read-only manual QA**, not learner tracking or network reporting.

### Phase 1 · Shared shell and controls in the unified engine (pilot 20 Week 1 pages)
- Change only `courses/shared/english-unified-lesson-engine-v1.js` for a compact stage-aware 'Your Lesson Path' overview; remove redundant intro text and avoid second giant headline.
- Clarify contrast and button order without changing core course inputs.
- Add a safe Focused Reading mode for distraction reduction; preserve user control of ticker pause.
- Align reading width, adjacent evidence prompts, 16px minimum and reflow. Preserve current HTML and sources.
- Include idempotence test; ensure enabling/disabling cannot cause duplicate headers, tickers or floating toolbars.

### Phase 2 · Grade-specific academically correct stages
- For each grade's Week 01 pilot, classify existing headings and activities into Recall, Learn, Read, Worked example, Practice, Apply, Review.
- **Map**, don't delete or duplicate existing instruction, reading, reflective fields, quizzes or exercises.
- Build a 'where does my work save?' affordance tied to the existing authorized data owners.
- Respect 80% readiness and unit mastery and independent human review.

### Phase 3 · Accessible learning validation and research pilot
- Conduct keyboard-only, screen-reader, tablet portrait/landscape, native browser zoom at 100%, 125%, 150%, 200% and text scaling tests.
- Verify scroll flow, visible headings, real anchors, one source card, no overlays/duplicate chrome, print and JSON export.
- For authorized tester cohort, compare comprehension, delayed retention, transfer and usability with comparable original lessons; record evidence without publishing private student data.
- A user-visible visual approval and test PASS are release gates; no unverified browser outcomes.

### Phase 4 · Data-driven curriculum migration
- Inventory **all** lesson content, media/source provenance, assessment contracts and exact `data-save-field` IDs first.
- Version a comprehensive JSON schema with source references, reading passages, objectives, models, practice, extension, independent tasks and existing assessment **references** (never assessment answer leakage).
- Convert one controlled Unit 02 pilot only; compare output and academic depth against original before extending to more weeks.
- Migrate by grade or unit with rollback, not a mass rewrite; keep original markdown/HTML as recoverable authority until proven parity.

## Acceptance criteria
- One 333, one auto ticker, one header with single branched hamburger, one official lower-right toolbar, one footer.
- Zero duplicate IDs, zero missing navigation destinations, no accidental GitHub repository links in student buttons.
- Body/form text >=16px; visible and usable at 200% zoom and narrow mobile width; no hidden required instruction.
- No frozen load screen, no black blocking overlay, no unclickable buttons, no unintended page scaling.
- No grade changes, lost local records, altered 80% thresholds, invalid unlock flags, or changed export semantics.
- Each grade can express its own course-specific higher-order reasoning requirements.
- Representative real-browser PASS and founder visual approval before cross-week rollout.

## Release authority
This document is a design specification and staged plan, **not proof that the changes have been implemented**. Code changes, QA results and approvals must be recorded as separate dated workflow logs.
