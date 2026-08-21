# English 9 Curriculum Tool and Game Matrix

## Rule

Tools support instruction; they do not define it. No learner must use an external app to receive the complete lesson, demonstrate mastery, or preserve required evidence. Every attached tool must have a specific curriculum purpose, a written alternative, a transparent privacy boundary, and an educator-verifiable output when it is used as evidence.

## Audit classifications

### Approved for planned attachment

| Tool | Repository | Curriculum use | Conditions |
|---|---|---|---|
| PROSE Editorial Gateway / Suite | ProReSource | Drafting, revision, templates, publication, portfolio writing | Verify the current loader/core route and provide plain textarea/print fallback. |
| PROSE Handwriting Lab | ProReSource | Handwriting, fluency, dictation, signatures, printable practice | Optional only; never penalize learners who type, dictate, sign, or use assistive technology. |
| Evidence & Citation Studio | ProReSource | Research provenance, source notes, bibliography, citation practice | Complete functional and iframe-boundary audit before assessment use. |
| Daily Spark Studio | Aurora | Multilingual low-stakes writing, fluency, print/export | Use as warm-up or extension, not graded evidence by default. |
| Story Spark | Aurora | Narrative constraints, idea generation, revision practice | Prompts must not replace learner authorship; preserve prompt and student draft separately. |
| Creative Mind Odyssey | Aurora | Idea development and creative problem framing | Optional enrichment; provide reduced-motion pathway. |
| Daily Journal | Aurora | Reflection, reading response, portfolio growth notes | Local-first; learner controls what enters formal evidence. |
| Quantum Story Seed Orb | Arcade | Deterministic narrative seeds, timed writing, drafts, favorites, import/export | Strong Unit 3 option after accessibility and age-tone review. |
| AffixSix | Arcade | Morphology, roots, prefixes, suffixes, word families | Audit word bank and instructions; add keyboard/screen-reader alternative if needed. |
| Learn a New Word | Arcade | Vocabulary, pronunciation, usage, recall | Audit definitions, level tagging, contrast, and visual accessibility before formal routing. |
| Language Learning Hall frameworks | Linguistics | CEFR/ACTFL reference, mediation, multilingual and intercultural practice | Framework reference only; English 9 remains a distinct course. |

### Conditional - repair or validate first

| Tool | Reason for hold | Required repair/check |
|---|---|---|
| Sovereign Multilingual Translator | Verified implementation has two distinct behaviors: offline exact-text lookup from a browser `localStorage` library, and online translation by sending learner-entered text to the third-party MyMemory API. The online result is cached locally. It does not currently mark machine output, record provenance, set output language/RTL direction, support reviewed course packs, export/import a library, or synchronize across devices. Its copy/inspect blocking and undisclosed keyboard toggle are unsuitable for an accessible public course. | Keep it optional and outside graded evidence. Remove copy/inspect blocking; add a plain privacy/consent gate before any network request; never send personal or assessed writing by default; label machine output as an unreviewed draft; add `lang`, `dir`, bidi isolation, RTL testing, source/provider/time metadata, reviewed course phrase packs, import/export/clear controls, length/rate/error handling, and a no-network fallback. |
| Khaemenes Translation Helper | Local phrase helper and speech are useful; inspected page did not expose verified RTL styling | Add bidi/RTL handling, language metadata, speech-provider notice, source/target limits, human-review status |
| ESL Mastercourse | Useful bridge but not equivalent to grade-level English Language Arts | Diagnostic placement, CEFR-oriented support pathways, explicit bridge into the same grade-level tasks |
| Language Learning Hall v3 / current Hall | Very large single-file applications with valuable content but separate course authority | Use deep links only after route, mobile, accessibility, and evidence-boundary validation |
| Hangman / ESL Trivia | Can lighten vocabulary review but may encourage guessing or decontextualized recall | Grade-band word bank, definitions/context, accessible non-visual mode, no mastery claim from game score |
| Breath & Reset / Emotional Weather | Can reduce overload but are wellbeing supports, not academic tools | Optional, private, non-diagnostic, no counseling claim, no grade/progress inference |

### Do not attach in present form

| Tool | Finding |
|---|---|
| Dictionary Box | Sends searches through an external third-party form and has an older inaccessible interface. |
| Scrabble Word Finder | Sends terms to a third-party “cheat dictionary”; weak instructional alignment and unclear learner-data boundary. |
| Word of the Day | Loads third-party scripts/forms/iframes; availability, privacy, content control, and accessibility are not course-controlled. |
| KhaeClean | Excellent code tool, but not a general English 9 writing editor; reserve for an optional web-publication extension. |

## Unit-by-unit attachment plan

| Unit | Core tool support | Lightening game/enrichment | Missing tool to design |
|---|---|---|---|
| 1. Scholarly Foundations | PROSE; Daily Journal; Handwriting Lab | Learn a New Word; AffixSix | **Close Reading Studio** - annotation, observation/inference sorting, claim-evidence-reasoning, bilingual directions |
| 2. Myth, Epic & Archetype | PROSE comparative-analysis template; Linguistics mediation framework; optional reviewed phrase-pack mode of the translator after repair | AffixSix; optional cultural-symbol matching | **Translation & Tradition Comparison Lab** - parallel passages, translator/edition labels, similarity/difference evidence, cultural-context guardrails |
| 3. Short Fiction & Narrative Craft | PROSE; Story Spark; Quantum Story Seed Orb | Creative Mind Odyssey | **Narrative Craft Lab** - point of view, pacing, dialogue, scene revision, before/after comparison |
| 4. Poetry, Voice & Form | PROSE; Handwriting Lab; optional voice playback | Word/sound pattern game | **Poetry Sound & Form Studio** - meter, lineation, sound devices, read-aloud recording/local playback, accessible visual marking |
| 5. Drama, Choice & Consequence | PROSE scene template; Daily Journal | Role/choice scenario game | **Scene & Seminar Rehearsal** - blocking notes, line interpretation, evidence-based discussion moves, captioned/typed alternative |
| 6. Rhetoric & Public Voice | PROSE speech template; Evidence Studio | Responsible fallacy challenge | **Rhetoric Laboratory** - audience/purpose/context, appeals, evidence quality, fallacy correction, speech rehearsal |
| 7. Research, Evidence & Media Literacy | Evidence & Citation Studio; PROSE annotated bibliography/research templates | Source-verification challenge | **Lateral Reading Investigator** - source opening, claim tracing, corroboration, evidence matrix, transparent scoring |
| 8. Informational & Technical Communication | PROSE procedure/report templates | Clarity and sequence challenge | **Procedure Usability Lab** - reorder steps, detect missing conditions, test with a reader, captions/alt text/accessibility checks |
| 9. Novel & Sustained Inquiry | Daily Journal; PROSE; portfolio templates | Motif/pattern tracker | **Sustained Reading Companion** - schedule, motifs, characters, quotations, conferences, multilingual glossary without plot-answer automation |
| 10. Argument, Debate & Civic Reasoning | Evidence Studio; PROSE argument template | Counterclaim/rebuttal challenge | **Fair Argument Simulator** - steelmanning, relevance/sufficiency, counterexample, rebuttal, ethical persuasion |
| 11. Creative Media & Publication | PROSE Editorial Suite; Aurora creative tools | Creative Wheel / inspiration tools | **Accessible Publication Checker** - hierarchy, contrast, captions, alt text, credits, permissions, house style, proofreading |
| 12. Capstone Portfolio & Oral Defense | PROSE portfolio/reflection templates; Daily Journal | Low-stakes defense question deck | **Oral Defense Rehearsal** - evidence-linked questions, timed answer, self-review, transcript/caption pathway, educator rubric |

## Highest-value new builds

1. **Close Reading Studio** - used in nearly every unit.
2. **Translation & Tradition Comparison Lab** - essential to international Unit 2 and multilingual integrity.
3. **Lateral Reading Investigator** - essential to research and global media literacy.
4. **Rhetoric / Fair Argument Laboratory** - supports Units 6 and 10.
5. **Oral Defense Rehearsal** - supports speaking evidence across Units 5, 6, 10, and 12.
6. **Accessible Publication Checker** - supports Units 8 and 11 and improves every final artifact.

## Attachment semantics

Each unit manifest will declare tools with:

- stable tool ID;
- public URL and repository owner;
- purpose and exact lesson placement;
- `core`, `optional`, `extension`, or `wellbeing-break` role;
- local/network behavior;
- data persistence and export behavior;
- accessibility status;
- multilingual/RTL status;
- evidence type;
- written fallback;
- audit date and approval state.

No tool will be attached merely because it exists.

## Translator evidence boundary

The supplied Pre-Algebra translator is a helpful foundation, but “offline” means exact-match retrieval from entries previously saved in that browser; it is not an offline translation model. “Sovereign” therefore applies only to local storage and retrieval, not to translations produced in online mode.

For English 9:

- it may clarify directions, vocabulary, or learner-owned notes;
- it may not translate a passage for literary analysis and then treat its wording as an authoritative edition;
- it may not produce or revise assessed English on the learner’s behalf;
- learners compare published translations whose translator and edition are named;
- any machine-assisted text is visibly labeled, reviewed by a human before publication, and excluded from mastery scoring unless the task explicitly assesses translation criticism;
- a complete non-network lesson and bilingual glossary remain available without the tool.
