# ARSHIF to English 9 Integration Audit

Audit date: 2026-08-21

Repository reviewed: `vervenveda/Arshif.github.io`
Scope: public halls, public Faith-area apps, curriculum usefulness, source/rights boundaries, accessibility dependencies, and safe English 9 routing.

## Decision

ARSHIF remains an independent canonical archive. English 9 may link to selected public dossiers and halls, but must not copy an entire Hall, rely on ARSHIF for required instruction, or import ARSHIF quiz scores into the formal English 9 record.

The English 9 lesson owns:

- the required passage and named edition or translator;
- directions, scaffolds, and accommodations;
- standards and assessed performance;
- rubric, feedback, revision, and record evidence.

ARSHIF supplies optional discovery, context, comparison, and extended reading.

## Repository-level findings

- Ten formal Hall directories, one Reading Room interface, fifteen Faith-area apps, and thirty-three HTML interfaces were present in the reviewed tree.
- The formal Halls are local-first single-page applications. They use browser storage for learner-controlled notes, favorites, and progress and do not use runtime `fetch` in the inspected Hall pages.
- Hall pages load the shared public beta-link script. Several older Faith apps also load Google Fonts and therefore are not fully offline.
- Rights notices consistently distinguish public-domain works from copyrighted translations, editions, images, adaptations, recordings, or performances.
- Many Halls include sources, validation notes, high-school alignment, assessment frameworks, and PROSE integration documents.
- Validation documents confirm preservation and syntax checks, but they do not replace an independent accuracy, accessibility, age-appropriateness, or live-link audit.

## Hall ratings and English 9 disposition

| Hall | Curriculum value | Readiness | English 9 use | Rating |
|---|---|---|---|---:|
| World Classics & Humanities | Exceptional global work map, edition guidance, context, themes, reading status, dossiers | Strong; verify each selected link and edition | Units 2, 3, 5, 9, and 12 | 9.2/10 |
| Indigenous Oral Traditions & Storywork | Protocol-first, community-authority and data-sovereignty boundaries, public-context model | Strong; never convert living or restricted knowledge into extractive assignments | Units 2, 3, 7, and 11 | 9.4/10 |
| Poetry 101–603 | Large world-poetry archive, craft glossary, poem lab, research and progression | Strong; verify poem/translation rights before reproduction | Unit 4 and portfolio enrichment | 9.0/10 |
| Theatre 101–603 | Global theatre, script analysis, performance safety, rights checks, dramaturgy | Strong; performance rights remain separate from reading rights | Unit 5 and oral-defense practice | 9.0/10 |
| Philosophy 101–603 | World-centered reasoning, counterargument, dialogue, claim testing | Strong; source-specific attribution still required | Units 6, 10, and 12 | 8.8/10 |
| Travelogues & Exploration | Point of view, route, map, colonial record, counter-source, field ethics | Strong enrichment; selected materials require bias and provenance review | Units 7 and 8 | 8.6/10 |
| Palimpsest / Lost Books | Textual survival, censorship, fragments, editions, preservation | Strong research extension; not a substitute for a named readable text | Units 7, 9, and 12 | 8.3/10 |
| Historical–Biblical Parallels | Evidence labels, manuscripts, archaeology, religious literacy boundary | Valuable but faith-aware; prayers and confessional elements make it optional in universal English 9 | Optional Units 2 and 7 extension | 7.6/10 |
| Children’s Classics / Literacy | Extensive differentiated reading and family literacy supports | Useful intervention and extension; below-grade pathways must not lower the grade-level target | Reading support and multilingual bridge | 8.2/10 |
| Culinary Arts / Foodways | Technical writing, cultural context, procedures, safety, source use | Strong cross-curricular extension; large page and public health links need live verification | Optional Unit 8 technical-writing pathway | 8.0/10 |

## Faith-area app disposition

### Conditional, optional use

- **Truth Tribe Creation Atlas:** relevant to Unit 2 comparison, but its explicitly devotional framing does not meet the neutral posture required for a universal core lesson. It may be offered as an opt-in faith-study extension. Its “Indigenous Origins · Many Nations” grouping is too broad for assessed comparison; use nation- and community-specific sources through the protocol-first Hall instead.
- **Text, Transmission & Canon / Bible Before Canon / Bible & History tools:** useful for religious literacy and textual transmission when clearly labeled as optional. Prayer, Apply activities, and confessional framing may not be required English 9 work.
- **Yahushua Study and Testament tools:** substantial faith-study resources, but not default English 9 academic authorities. Selected historical claims require source-by-source corroboration.

### Do not route from English 9 in current form

- **Zionism mini-course:** a sensitive modern political-history topic presented without an adequate visible source and historiography layer in the inspected file. It requires a separate balanced, sourced, expert-reviewed audit.
- **Open Sources Portal:** contains a mixture of institutional, public-domain, commercial, user-uploaded, and uncertain third-party document hosts. English 9 must link directly to a verified lawful edition rather than route students through the mixed directory.
- **Generic Biblical Web Directory:** combines academic, devotional, denominational, and popular-apologetics sources without enough source-type labeling for formal evidence.

## Maintenance risks observed

1. The deployed directory name `literacy-indiginous-oral-traditions` contains a spelling error. Do not rename it casually because current public routes may depend on it; use a planned redirect migration if it is ever corrected.
2. `testament_index.html` and `testament_study_portal_index.html` are byte-identical in the reviewed revision. The Truth Tribe class and kids files are also byte-identical. Duplicates increase maintenance drift risk.
3. The Faith landing page appears to route several app links as though the files were directly inside `Faith/`, while the reviewed files are inside `Faith/apps/`. This should be verified separately before the Faith landing page is promoted.
4. Several older apps use Google Fonts. Their fallback fonts work, but they are not fully offline and create an external request.
5. Hall work cards often route to search pages rather than a fixed edition. English 9 must name and verify the actual edition used in instruction.
6. Modern translation recommendations are academically helpful but may be copyrighted. Recommendation does not grant reproduction rights.

## Approved English 9 routes

### Unit 2

- World Classics dossiers for `The Epic of Gilgamesh`, `Odyssey`, `Mahabharata`, `Popol Vuh`, `Sundiata Epic`, and related traditions.
- Indigenous Oral Traditions & Storywork Hall for protocol, community authority, oral-performance context, translation ethics, and respectful comparison.
- The Multilingual Translator for directions, vocabulary, learner-owned notes, and translation criticism under the course evidence boundary.

### Later units

- Poetry Hall → Unit 4.
- Theatre Hall → Unit 5.
- Philosophy Hall → Units 6 and 10.
- Travelogues Hall → Units 7 and 8.
- Palimpsest Vault → Units 7 and 9.
- World Classics Hall → Units 3, 5, 9, and 12.

## Promotion gate for any ARSHIF item

An ARSHIF resource becomes an English 9 lesson route only when the course records:

1. exact Hall and dossier;
2. lesson purpose;
3. author, tradition, translator, edition, and date where applicable;
4. rights/access status;
5. source authority and known limitations;
6. accessibility and multilingual alternatives;
7. written/offline fallback;
8. whether the resource is core, optional, extension, or faith-study;
9. evidence allowed from the activity;
10. educator verification date.

No Hall score, favorite, completion flag, or time counter is automatically formal English 9 evidence.
