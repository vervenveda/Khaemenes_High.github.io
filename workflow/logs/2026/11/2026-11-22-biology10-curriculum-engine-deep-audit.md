# Biology 10 Curriculum ↔ Upper Science Engine Deep Audit · 2026-11-22

## Scope

Deep source audit of:
- the 36-week Biology 10 canonical course map;
- Biology dashboard course-data synchronization;
- Week 01 five-day deep lessons;
- Upper Science Instruction Engine curriculum representation;
- mastery/evidence/assessment authority boundaries.

## Five major findings

### 1. The 36-week Biology curriculum spine is strong and coherent

The sequence progresses through:
- readiness, safety, measurement and quantitative biology;
- chemistry of life, macromolecules, enzymes, cells and transport;
- photosynthesis, respiration and metabolic evidence;
- signaling, homeostasis, cell cycle and semester synthesis;
- meiosis, inheritance and statistical reasoning;
- DNA, gene expression, regulation and biotechnology;
- evolution, population genetics, selection and phylogeny;
- ecology, cycles, population dynamics and biodiversity;
- capstone, comprehensive final and portfolio defense.

The course consistently carries an essential question, phenomenon, laboratory/inquiry expectation, concepts, quantitative focus and standards field for each week.

### 2. Canonical course-map and dashboard data were nearly synchronized, but reading quality had drift

One direct field drift was present at Week 31. More importantly, eight weeks still contained vague reading placeholders such as “Open biology text…”, “Open population-genetics introduction”, or equivalent undefined sources.

Repaired Weeks:
- 02
- 12
- 20
- 28
- 29
- 30
- 31
- 32

Each now directs the learner to the self-contained Tuesday Deep Lesson and names the scientific concepts/evidence expected from that reading. The canonical course map and dashboard payload are synchronized.

### 3. Only one of five Week 01 deep lessons was actually mounted to the Upper Science engine

Before this pass:
- Day 01 used Upper Science Engine v1.1.
- Days 02–05 remained standalone deep lessons.

This meant 80% of the first complete instructional week was not represented through the shared engine contract.

Repair:
- all five Week 01 deep lessons now opt into `upper-science-v1`;
- Day 01 retains accordion presentation;
- Days 02–05 use silent/native engine mode so curriculum mapping occurs without reintroducing the old seven-button interface.

### 4. Important curriculum existed but was not first-class in the deep lesson DOM

The weekly course data contained the essential question and standards, but the deep lessons did not consistently expose:
- canonical essential question;
- daily objective;
- phenomenon/hook;
- retrieval;
- standards/practice emphasis;
- a dedicated constructed explanation / CER revision task.

Repair:
Every Week 01 day now explicitly includes these elements in the authoritative lesson source.

### 5. Engine representation depended too heavily on heading guesses

The engine previously mapped instructional stages mainly from visible headings. That made representation vulnerable to cosmetic title changes.

Repair:
Upper Science Engine v1.2 now uses explicit `data-science-contract` tokens as the authoritative stage mapping signal, with heading matching retained only as fallback compatibility.

## Explicit curriculum representation contract

The engine now audits these 22 instructional elements:

### Recall & Prepare
- essential-question
- objectives
- phenomenon
- safety

### Learn & Model
- explicit-teaching
- vocabulary
- worked-example
- model

### Guided Reasoning
- guided-practice

### Investigate & Analyze
- quantitative
- investigation
- independent-practice

### Check & Correct
- misconception
- formative-check
- retrieval

### Explain & Revise
- explanation
- cer
- evidence-revision

### Reflect & Transfer
- differentiation
- teacher-guidance
- evidence-handoff
- standards

The engine exposes `inspectContract()` so source/runtime checks can report exactly which instructional elements are present or missing.

## Authority firewall preserved

The engine still does not own:
- grades;
- mastery;
- lesson completion;
- course unlocks;
- learner records;
- localStorage/sessionStorage/indexedDB/cookies;
- network writes;
- protected assessments;
- course routes;
- tickers;
- header/hamburger;
- translator;
- ecosystem toolbar;
- retired High School global chrome/page regulator.

## Automated audit added

New:
`courses/science/tools/audit-biology10-curriculum-engine-v1.mjs`

The audit verifies:
- 36/36 Biology weeks;
- required course-map fields;
- course-map ↔ dashboard synchronization;
- no undefined non-exam reading placeholders;
- all five Week 01 deep lessons mounted to the Upper Science engine;
- canonical Week 01 essential question on all five lessons;
- all 22 curriculum representation tokens on all five lessons;
- minimum deep-lesson content floor;
- constructed explanation/CER evidence on all five lessons;
- engine v1.2 semantic mapping;
- engine storage/network/chrome firewall.

## Validation

PASS:
- Upper Science Instruction Engine v1 contract
- Biology 10 curriculum-to-engine audit
- Upper High School Daily Instruction Validation
- Biology 10 Course Integrity
- Upper Science structural validation
- Secure assessment blueprint validation
- Upper Science student regression
- Science Student Experience Regression
- Science 9 Lesson Engine Pilot Integrity
- No Page Regulator Regression
- Public Entry Route Validation

## Remaining boundary

This pass establishes source-level curriculum depth and deterministic engine representation for Biology Week 01 plus course-map/dashboard synchronization.

It does not yet certify that all 180 Biology daily lessons expose the full 22-element engine contract. The next expansion should proceed week-by-week using this audit as the migration gate rather than bulk-mounting the engine by assumption.

Status: **SOURCE-AUDITED · WEEK 01 CONTRACT COMPLETE · BROADER BIOLOGY ROLLOUT READY**
