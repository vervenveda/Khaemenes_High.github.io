# Khaemenes Academy — High School Science A+++ Curriculum Standard
**Status:** Engineering and instructional implementation blueprint, not a claim that every course is complete  
**Audit date:** 2026-10-14  
**Target branch:** main  
**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Stewardship:** Preserve existing lessons, learner evidence, archived assets, routes, and dormant STOS files. Changes should be additive and tested before any replacement.

## 1. Verified starting inventory
- Integrated Science 9: 565 course files, including 363 HTML files and an existing deep daily-lesson/assessment architecture. Unit 01 includes 10 daily lessons, inquiry activities, a 15-item quiz, and human-scored evidence.
- Biology & Biotechnology 10: 36 separate weekly student pages, 36-week course map, course dashboard, assessment boundary page; 30 objective questions embedded in the dashboard.
- Chemistry & Materials Science 11: same 36-week architecture and a 30-question dashboard bank.
- Physics & Engineering 12: same 36-week architecture and a 30-question dashboard bank.
- The three upper-course weekly pages use a five-day rhythm: Monday phenomenon, Tuesday concepts, Wednesday data, Thursday investigation, Friday claim–evidence–reasoning (CER).
- Department benchmark guidance names NGSS three-dimensional learning and college-readiness frameworks, with correct non-AP-authorized disclaimers.
- Existing upper-science validator checks map/file completeness, not student-facing runtime functionality or content depth.

## 2. Confirmed upgrade gaps
1. Upper-grade weekly pages contain short instructional prompts and vague references such as “Open text on enzymes” rather than a self-contained, sufficiently detailed student reading with verifiable links and offline alternatives.
2. Representative Biology 10 Week 04 does not supply the reaction-rate dataset it asks students to graph or a directly linked interactive enzyme investigation.
3. Upper-grade dashboards put the same first 15 public JavaScript-bank questions on every midterm and the same 30 public-bank questions on every final. Treat these as *practice*, never confidential closed-book authoritative examinations.
4. Standalone weekly notes and dashboard state use separate localStorage schemes; require a tested evidence/portfolio bridge, preserving past storage keys and allowing backup/export.
5. Upper-science validator does not test gameplay, quiz integrity, link resolution, assessment scoring, accessibility, or persistence across refresh.
6. Only Grade 9 currently has an extensive collection of dedicated lesson pages, lab/task files, scoring guides, and documented evidence gates.
7. Target 25% inquiry time exists as policy, but the existing week-level pages do not independently prove a timed, completed laboratory log.

## 3. Course progression — retain 36 weeks / five learning days
### Grade 9 · International Integrated Science
Build on existing Units 00–12: investigative skills, biology, ecology, chemistry, physics, Earth and space systems, engineering, scientific communication. Preserve the present mastery quizzes, rubrics, safety arrangements, progress records, and lessons. Harden content accuracy, tools, navigation, and continuity.

### Grade 10 · International Biology & Biotechnology
Weeks 1–8 inquiry, chemistry of life, cells; 9–18 energy and homeostasis, semester synthesis/midterm; 19–26 heredity, molecular biology, biotech; 27–34 evolution and ecology; 35–36 capstone and final defense. Add an illustrated cells/enzymes/genetics laboratory studio and carefully scoped field/data alternatives.

### Grade 11 · International Chemistry & Materials
Weeks 1–5 measurement, atomic theory, periodic patterns; 6–13 bonds, structure, states, solutions; 14–18 reactions/stoichiometry and midterm; 19–25 kinetics and thermochemistry; 26–34 equilibrium, acids/bases, electrochemistry, materials; 35–36 capstone and final defense. Provide atom/bond builders, equation-balancing practice, mole-to-mass calculators, and safe datasets; hazardous procedures are not a home activity.

### Grade 12 · International Physics & Engineering
Weeks 1–9 measurement, kinematics, forces, gravitation; 10–18 energy, momentum, midterm; 19–28 rotation, oscillations, waves, fluids and thermal physics; 29–34 fields, circuits, design and space systems; 35–36 engineering capstone and final defense. Provide motion/force and circuit simulators without dangerous electricity, lasers, projectile systems, or loud sounds.

## 4. Required A+++ daily lesson content contract
Every new or upgraded daily lesson contains:
- **Identity & navigation:** course, week/day, exact objective, essential question, prior/next lesson, student profile/portfolio route, review status.
- **Phenomenon / hook:** genuine puzzling observation or data; one prediction distinct from evidence.
- **Explicit teaching:** accessible 600–1000-word *target* explanatory reading when appropriate; definitions, scientifically correct causal story, diagrams with text alternatives, 2 progressively solved examples and a misconception/counterexample.
- **Vocabulary:** 5–8 context-rich terms, pronunciation where helpful, accurate definition, original example, quick matching or retrieval challenge; spaced review in later lessons.
- **Inquiry / math:** a numbered worked data example, units, graph labels, uncertainty, and one independent data challenge with an answer or rubric available for *practice*.
- **Activity:** one real local-first game/tool or hands-on observation or curated dataset, with explicit input → predicted result → observed result → explanation; no dead buttons and no external runtime dependency.
- **Differentiation:** Foundation (scaffold), Core, Extended (depth/transfer); accessible alternatives, keyboard use, print mode, and offline text fallback.
- **Practice check:** 3–7 feedback-enabled questions assessing reasoning, not only recall; fresh order without repeating a question in an attempt.
- **Evidence:** CER or other short constructed response; source citation, limitations, portfolio export/import and preservation across refresh.
- **Teacher/parent notes:** prerequisites, pacing (45–60 min), materials, misconception diagnosis, safety, expected responses, sample rubric, and adjustments.
- **Audit metadata:** learning objective, NGSS practice/crosscutting/core-idea linkage, tested links, review date, learning evidence target.

**Do not count five prompts on one week page as five fully developed lessons until this contract is met.**

## 5. Weekly workflow — five robust, standalone lesson pages
- Monday: mystery phenomenon, prior-knowledge check, measurable question and initial model.
- Tuesday: full reading, labeled diagrams, vocabulary, worked examples and misconception checks.
- Wednesday: dataset/table/graph calculator or analysis, uncertainty and reasoning exercises.
- Thursday: safe hands-on/field study or offline interactive simulation with recorded observations and a teacher-approved alternative.
- Friday: cumulative quiz, CER writing, corrections, portfolio selection, and reflection.

Each week links clearly to its five daily lessons and an overview containing objectives, materials, vocabulary, rubric, and referenced readings. Do not duplicate or delete student evidence while adding routes.

## 6. Learning games & tools contract
All core tools are vanilla HTML/CSS/JS, runnable standalone with no CDNs, external fonts, APIs, telemetry, or external runtime. State and personal work use localStorage in the browser with a clear memory-only warning if unavailable, plus JSON export/import.
Starter studios:
- **Shared:** Scientific Method Challenge; Variable & Control Laboratory; SI Units Converter; Data Table and Graph Explorer; CER Evidence Builder; Science Vocabulary Arcade.
- **Biology:** Cell Explorer; Osmosis Explorer; Enzyme Rate Explorer; DNA-to-Protein Builder; Punnett & Probability Lab; Food-Web Dynamics.
- **Chemistry:** Atom Builder; Periodic Trends Explorer; Bonding & Lewis Model Studio; Equation Balance Lab; Stoichiometry Practice; Reaction Rate Simulator; Titration Data Explorer.
- **Physics:** Motion Graph Studio; Forces/Free-Body Builder; Energy & Momentum Lab; Wave and Resonance Studio; Series/Parallel Circuit Simulator; Engineering Constraints Studio.

Tool pass criteria: scientifically correct reference cases; reset/new-puzzle behavior; no accidental duplicate scoring; keyboard/touch accessibility; offline navigation; small-screen wrapping; cleanup without erasing earned progress; lessons point to exactly one canonical maintained copy of each shared tool.

## 7. Labs, experiments and safety
Each lab package has a driving question; age-appropriate safe materials; hazard class and stop conditions; teacher supervision designation; reproducible procedure; measurements/table with units; chart/model; controlled comparison; CER; uncertainty; disposal/cleanup; differentiated simulation or supplied-data fallback; explicit scoring rubric.
- Require teacher approval and safety review for chemical, biological, heat, glassware, electrical, pressure, outdoor/field, or human-subject risks.
- Do not direct unsupervised students to mix household cleaners, culture unknown organisms, ingest samples, use mains electricity, powerful lasers, or hazardous reagents.
- Aim for >=25% documented inquiry/lab/design/data time in Grades 10–12, not a claim of completion merely because a policy says so.
- Simulations must permit student prediction, parameter change, observation, data recording, and comparison; a passive animation alone is not counted as a meaningful lab.

## 8. Assessment model
**Weekly:** 5–10 formative questions, open-book practice feedback; 80% mastery target and correction cycle.  
**Units:** objective items plus a graph/data problem and human-scored CER/lab performance rubric.  
**Midterm:** cumulative blueprint with multiple forms, mixed topics and data interpretation; closed-book if institutionally supervised.  
**Final:** comprehensive blueprint, application/data/graph items, practical/capstone evidence and student defense.  
**Integrity boundary:** Static public web pages and localStorage cannot safeguard secret question banks or authenticate exam supervision. Do not publish confidential keys or treat local, editable grades as official records. Keep public randomized question banks for practice; authoritative exams and reviewed results belong to separately controlled educator administration outside this public repository.
**Grading:** Track raw scores, rubric categories, attempts, dates, correction evidence, accessibility accommodations where appropriate and teacher verification separately. Apply 80% to essential outcomes without making a low-stakes score overwrite valid evidence.

## 9. Student records and portfolio bridge
- Maintain namespaced local records (course, unit, day, activity, student profile identifier only when user selects it).
- Version schemas. Migrate/merge historical browser keys *without erasure*; back up before migration.
- Multiple-tab conflict protection and explicit per-learner data separation.
- Export/import JSON, print/PDF-friendly summary, a laboratory notebook, and recovery warnings if storage is unavailable.
- No live server, cross-device sync, or STOS functionality implied by a localStorage “cloud”.
- Preserved STOS assets are dormant; do not expose private architecture or secrets in public pages.

## 10. Presentation standard
Preserve current layout intent and adopt Verve N Veda's crisp, centered parchment presentation where approved; balanced symmetric grids; no overlap/cropped words; 7px controls/cards on upgraded lessons; restrained Cinzel headings with Brandon Grotesque fallback; keyboard focus, semantic headings, mobile 255px stress test and print mode. Check oversized 55px eyebrow overrides on narrow displays *visually* before applying broader typography changes. Do not replace the existing academy ecosystem menu with a newly invented one.

## 11. CI / forensic acceptance gates
1. Inventory expected 36 weeks / 180 daily lesson destinations per upper course when fully expanded; detect missing pages.
2. Crawl internal href/src targets, navigation, student breadcrumbs and optional external resource link disclosures.
3. Check tool registry: every linked game and experiment exists, launches, resets, scores once and preserves progress.
4. Assess question-bank format, option uniqueness, correct-answer index, syllabus coverage, data accuracy, remediation paths and exam privacy model.
5. Validate science calculations/units with reference datasets, edge cases and accessible fallback results.
6. Verify learner evidence survival across reloads and separate profiles; JSON export/import round trips.
7. Audit labs for supervision and safety; confirm supplied datasets and offline substitutes.
8. Verify contrast, 7px controls, centered titles, no clipped labels, reduced-motion, mobile (including 255px), keyboard access, and print.
9. Run syntax and deterministic tests in CI; actual browser interaction testing remains a separate necessary gate.
10. Confirm no external runtime dependency or dormant STOS file changes and that existing mathematics/language courses are not modified.

## 12. Recommended implementation order
**Phase 1:** Validate audit baseline and publish this shared teaching contract (this document).  
**Phase 2:** Pilot Biology 10 Week 04, Enzymes & Reaction Rates, as a fully taught five-day unit with offline rate simulator, fixed sample dataset, vocabulary, quizzes and teacher notes.  
**Phase 3:** Pilot Chemistry 11 Week 14, Reaction Evidence & Equations, with a conservation-of-mass dataset and canonical equation balancer.  
**Phase 4:** Pilot Physics 12 Week 02–03, Motion & Graphs, with graphing simulation and data-based mastery.  
**Phase 5:** Generalize tested lesson template and tools throughout all 36 weeks in each upper course while auditing Science 9.  
**Phase 6:** Establish new assessment blueprints, public-practice-vs-supervised boundary and portfolio migration.  
**Phase 7:** Complete student beta testing, accuracy reviews, safety review, cross-course bridge, CI/browser release verification and official grade/course mapping.

## 13. First pilot: Biology 10 Week 04 acceptance rubric
The week must teach activation energy, enzyme specificity, denaturation, reaction-rate graphs and limits of models; include correct original reading, five-day lessons, >5 vocabulary terms, at least two solved graph examples, a validated fictional temperature-vs-rate dataset with units and uncertainty, a local interactive enzyme-rate simulator with parameter controls and repeat trials, a safe/no-unknown-biological-sample alternative, 10+ diverse practice questions with feedback, a scored analysis/CER rubric, teacher keys outside public student practice UI as appropriate, progress export/restore and working links.
**Do not claim completion until tested.**

## Re-audit update — 2026-10-19 (upper-science Step 2)

This update supersedes older gap statements where current source demonstrates that an upgrade has already landed. It does not certify every page or scientific answer.

### Current state re-verified
- Biology 10, Chemistry 11, and Physics & Engineering 12 each have 36 weekly overview pages and 180 daily lesson pages in the repository tree.
- Current public practice banks structurally contain 180 Biology questions, 339 Chemistry questions, and 180 Physics questions. All three have unique IDs and prompts in the source-level scan; sampled records had valid option arrays, answer indices, explanations, week tags, source tags, and type tags.
- All three course dashboards call the shared Monte Carlo assessment interface (`openSession` / `materialize`) and label these browser-delivered exams as practice. Assessment-boundary pages distinguish public formative learner evidence from confidential supervised examinations. Do not replace this working approach with fixed public question lists.
- Representative day lessons exist and contain self-contained instructional readings. Biology 10 Week 04 Tuesday explains activation energy, active-site interactions, temperature limits, pH, and experimental controls. Chemistry 11 Week 14 Tuesday covers coefficients, subscripts, atom conservation, state symbols, and model limitations.

### Repairs made in this pass
- Biology 10 Week 04 overview now links the vague “Open text on enzymes and reaction-energy diagrams” reference directly to the self-contained Tuesday lesson.
- Chemistry 11 Week 14 overview now links the vague “Open text on equations and conservation” reference directly to the self-contained Tuesday lesson.
- Chemistry question-bank auditing now normalizes case and whitespace without stripping scientific signs. For example, `-150 kJ/mol` and `150 kJ/mol` must remain distinct answer choices; removing punctuation can incorrectly conflate them.
- Added `courses/science/tools/audit-upper-science-question-banks.mjs`, a shared structural audit for all three upper-grade public practice banks. Run it with Node from the repository root. It checks IDs, prompt duplication, option duplication, answer indexes, explanations, week/source/type tags, bank size, and optional template/difficulty review notes.

### Still open after Step 2
- Run the new Node audit in a checkout and capture actual output; source-level inspection in this session is not a substitute for executing repository tests.
- Review question families with repeated wording for cognitive variety and transfer. Parameterized calculation variants are useful practice, but the bank should also assess interpretation, model critique, evidence evaluation, and application.
- Scan all 108 weekly overview pages for vague reading references and confirm each points to an actual lesson or a self-contained offline reading.
- Run live-browser regression for question randomization, score-once behavior, persistence across refresh, source-appropriate option rendering, accessibility, and learner-scoped records.
- Recheck standards alignment, answer-key correctness, dataset mathematics, and lab safety separately. Structural bank checks do not establish scientific correctness or formal jurisdictional compliance.

### Step 2 completion — all 108 upper-grade weekly overview pages scanned (2026-10-19)

The overview sweep covered Biology 10 Weeks 01–36, Chemistry 11 Weeks 01–36, and Physics & Engineering 12 Weeks 01–36. All 108 overviews contained links to the five expected day pages in the source-level link-count scan. This is not an HTTP/browser click test.

#### Reading-reference repairs
Where a week said only “Open text …” even though its Tuesday lesson already contained the explanatory reading, its prompt now links directly to that lesson and names the subject focus:

- Biology 10: Weeks 04, 06, 08, 09, 10, 13, 14, 15, 19, 22, 23, 24, 25, and 33.
- Chemistry 11: Weeks 04, 06, 07, 08, 10, 12, 14, 16, 24, 27, and 30.
- Physics & Engineering 12: Weeks 04, 07, 11, and 12.

The direct links target each corresponding `lessons/day-02.html` file. Existing lab tools, datasets, daily lesson content, student evidence, and route structure were retained. Weeks not listed above had no matching “open text/textbook/coming soon” phrase under this targeted scan, and the five-day overview links were present in each scanned source.

#### Capstone source instruction strengthened
Biology 10, Chemistry 11, and Physics & Engineering 12 Week 35 now require at least two relevant credible sources, recording source identity/details, what claim the source supports, and a limitation or uncertainty. The assignment is no longer an unexplained “student-selected trusted sources” placeholder.

#### Assessment verification and automation
- Source-level JSON parsing and schema checks found Biology 10: 180 items / 36 weeks; Chemistry 11: 339 items / 34 tagged weeks; Physics & Engineering 12: 180 items / 36 weeks. Every inspected item had a unique ID and prompt, valid answer index, options array, explanation, and source/type tags. The Chemistry bank's Weeks 18 and 36 are not tagged, apparently because those are cumulative exam weeks; confirm this intentional design during the next assessment-map review rather than treating it as an automatic defect.
- The Chemistry-specific option normalizer now preserves scientific signs and punctuation, preventing positive and negative numerical answers from being treated as duplicates.
- Added `courses/science/tools/audit-upper-science-question-banks.mjs` and `.github/workflows/upper-science-question-bank-validation.yml`. The workflow runs the shared bank audit and Chemistry-specific audit on relevant pushes and pull requests, and supports manual dispatch.
- The workflow file is committed. Its post-commit Actions result was not independently retrieved in this audit session; treat automated test execution as pending until a green run is observed.

#### Remaining boundary
Step 2's *source-level repair pass* is complete. This does not mean all scientific answer keys have been independently validated or that every browser interaction has passed. Step 3 must still verify real student flows: browser-rendered choices, no double scoring, randomized sessions, local persistence and export, learner scoping, accessibility, and actual click/HTTP navigation. The new structural audit deliberately does not claim to replace those tests.

