# Khaemenes Mathematics Engine Blueprint — Version 1.0

**Program:** Verve N Veda · Khaemenes Academy Mathematics  
**Scope:** Foundational mathematics through Higher Learning  
**Access principle:** Free public learning access wherever legally and technically possible  
**Design principle:** Standardize the infrastructure. Preserve mathematical depth. Protect the learner.

---

## 1. Mission

The Khaemenes Mathematics Engine is the canonical instructional page system for mathematics across Khaemenes Academy and Khaemenes Higher Learning.

Its purpose is to make rigorous mathematics accessible to learners around the world without forcing every course, grade, unit, lesson, quiz, midterm, final, laboratory, proof exercise, or research task into a separately maintained page architecture.

The engine must:

- preserve existing curriculum and course-specific depth;
- render lessons from authoritative lesson data rather than duplicate curriculum in presentation code;
- reduce visual and runtime competition;
- support secondary, collegiate, proof-based, computational, modelling, statistical, and research mathematics;
- preserve student-owned evidence and learner records;
- work across desktop, tablet, mobile, and print;
- remain usable with low bandwidth and degraded connectivity;
- expose only the learning tools relevant to the current task;
- keep mathematics primary and ecosystem/profile controls secondary;
- never clear learner records during visual or engine migrations.

The engine is not the curriculum.  
The engine is not the grading authority.  
The engine is not the student profile.  
The engine is the canonical mathematics learning surface.

---

## 2. Global page ownership contract

Each shared page feature has exactly one owner.

### Global shell owners

1. **333 Network ticker**
   - one rendered instance;
   - full viewport width;
   - canonical source only.

2. **Verve N Veda AutoPopulate ticker**
   - one rendered instance;
   - full viewport width;
   - canonical source only.

3. **Institutional header and branched hamburger**
   - one approved header;
   - institutional identity at left;
   - hamburger at right;
   - no lesson engine may create a competing page-wide header.

4. **Translator**
   - canonical translator implementation;
   - visually compact on instructional pages;
   - never duplicated.

5. **Lower-left Universal Class Tools toolbar**
   - canonical source: `/assets/vnv-class-tools-toolbar.js`;
   - learning-tool companion;
   - idempotent;
   - navigation/resource support only;
   - may read lesson context but may not change grades or mastery.

6. **Lower-right Ecosystem toolbar**
   - canonical source: `/assets/vnv-ecosystem-toolbar.js`;
   - one instance only;
   - may be suppressed on protected or closed-book examinations when required.

7. **Footer**
   - one centered institutional footer;
   - no duplicate utility strips.

### Mathematics Engine ownership

The Mathematics Engine is the sole owner of the instructional mathematics workspace inside its canonical mount.

No other script may independently insert, reorder, replace, or restyle instructional sections inside the engine-owned mathematics workspace.

### Data and authority services

The following may operate underneath the engine but must not become competing page renderers:

- learner identity/scope;
- persistence;
- learner record;
- mastery/progression;
- evidence ledger;
- storage health;
- rubric validation;
- assessment authority;
- export/record services.

---

## 3. Required global page order

For eligible live mathematics pages:

1. 333 ticker
2. AutoPopulate ticker
3. institutional header + hamburger
4. compact translator
5. mathematics page hero / lesson identity
6. mathematics instructional workspace
7. authorized peripheral toolbars
8. footer

The engine must not render Student Profile photo heroes, profile editors, Family Hub panels, Yearbook controls, or Student Profile personalization toolbars.

The course may know the active learner. The course must not become the learner's profile page.

---

## 4. Universal instructional spine

Every mathematics lesson uses a common cognitive flow, with sections activated according to lesson data and evidence mode.

### Core sequence

1. **Orient**
   - institution;
   - course;
   - unit;
   - lesson;
   - lesson title;
   - concise purpose or essential question;
   - expected time where available.

2. **Remember**
   - short retrieval from prerequisite or earlier learning;
   - normally 2–4 prompts;
   - ungraded unless the lesson explicitly declares otherwise.

3. **Learn**
   - focused concept development;
   - definitions, representations, diagrams, notation, vocabulary;
   - unnecessary material remains collapsed or omitted.

4. **Worked Model**
   - at least one complete mathematical example;
   - reasoning is visible;
   - important transitions are signaled;
   - representations stay spatially close to the explanation.

5. **Guided Work**
   - partial scaffolding;
   - prompts, hints, completion steps, or structured reasoning;
   - guidance may fade as competence increases.

6. **Your Turn**
   - independent student mathematics;
   - workspace immediately adjacent to each task;
   - typed, selected, drawn, graphed, or written response according to task type.

7. **Reasoning Challenge**
   - one or more of:
     - error analysis;
     - compare methods;
     - justify a choice;
     - construct a counterexample;
     - explain why;
     - interpret a representation.

8. **Apply**
   - modelling, application, richer word problem, laboratory, data task, proof extension, or real-world transfer.

9. **Evidence**
   - required mathematical evidence appropriate to the course and lesson;
   - may include computation, proof, graph, written explanation, model, dataset interpretation, laboratory output, or research note.

10. **Reflect / Exit**
    - concise reflection or exit retrieval;
    - what can the learner now explain?
    - what still needs practice?
    - next step.

11. **Continue**
    - previous / next;
    - mastery or progression state;
    - no forced navigation that bypasses course rules.

---

## 5. Level-aware evidence modes

The engine must be level-aware and evidence-aware, not grade-specific.

A lesson declares one primary evidence mode and may declare secondary modes.

### A. Foundational / procedural mode

Best for arithmetic, Pre-Algebra, Algebra I, and many Algebra II skills.

Supports:

- worked examples;
- guided calculation;
- independent problem solving;
- number lines;
- tables;
- equations;
- graphs;
- error analysis;
- contextual word problems;
- mastery checks.

### B. Geometric / visual mode

Supports:

- diagrams;
- constructions;
- coordinate geometry;
- transformations;
- measurement;
- proof;
- visual conjecture;
- diagram annotation;
- geometric laboratories.

### C. Analytical mode

Best for advanced Algebra, Precalculus, Trigonometry, and Calculus.

Supports:

- symbolic derivation;
- graph interpretation;
- multiple representations;
- numerical verification;
- modelling;
- parameter exploration;
- extended worked examples;
- approximation and limiting behavior.

### D. Data / statistics mode

Supports:

- datasets;
- tables;
- plots;
- simulation;
- statistical computation;
- interpretation;
- uncertainty;
- claims and evidence;
- written conclusion;
- reproducibility note.

### E. Proof mode

Best for Introduction to Proofs, Discrete Mathematics, Abstract Algebra, Analysis, and Topology.

Supports:

- definitions;
- examples/nonexamples;
- conjecture;
- proof plan;
- lemma chain;
- proof workspace;
- counterexample;
- proof critique;
- revision;
- mathematical writing.

### F. Computation / systems mode

Best for Linear Algebra, Differential Equations, numerical work, and computational mathematics.

Supports:

- matrix workspace;
- system solving;
- transformations;
- symbolic/numerical computation;
- algorithm steps;
- phase/trajectory interpretation;
- verification;
- modelling evidence.

### G. Research / advanced mode

Best for Real & Complex Analysis, Topology, Differential Geometry, Advanced Geometric Topology, and mathematical physics.

Supports:

- theorem/claim statement;
- prerequisite definitions;
- proof architecture;
- formal derivation;
- computational or visual laboratory;
- reproducibility evidence;
- research note;
- citation/source note where appropriate;
- oral/written defense preparation;
- extended reflection.

---

## 6. Mathematics worksheet visual standard

The live lesson and assessment environments belong to the same visual family.

### Shared visual identity

- Khaemenes Academy / Khaemenes Higher Learning identity centered and clear;
- parchment or paper working surface with charcoal ink;
- restrained gold/forest/navy/burgundy accents according to level;
- Cinzel institutional/title hierarchy;
- Brandon Grotesque or Nunito body;
- minimum readable text: 16px;
- body preferred: 18px;
- 7px control/card radius;
- one-column mathematical reading flow unless the mathematics itself requires a paired representation;
- generous whitespace;
- no decorative clutter competing with mathematical work.

### Problem card contract

Each problem may contain:

- problem number;
- prompt;
- diagram/table/graph where required;
- response area;
- mathematical workspace;
- explanation/justification area when required;
- feedback/status region.

Workspace belongs immediately beside or beneath the problem.

### Assessment adaptation

For quizzes, unit mastery, midterms, finals, and diagnostics:

- Academy masthead;
- assessment title;
- identity/date/score strip where appropriate;
- objective/directions;
- numbered problems;
- generous working space;
- one-column online flow;
- printable two-column layouts allowed where readability is preserved;
- closed-book tool restrictions honored;
- no intrusive ecosystem or study tools over protected examinations.

---

## 7. Progressive disclosure

The engine must not show all available course material merely because it exists.

Default-open content:

- current lesson identity;
- current objective;
- active learning section;
- current problem/workspace;
- immediate next action.

Default-collapsed or secondary content may include:

- full unit map;
- extended vocabulary;
- additional references;
- optional videos;
- extra games;
- teacher notes;
- standards;
- sources;
- enrichment;
- historical evidence;
- long solution appendices.

Depth in the curriculum must not become density in the interface.

---

## 8. Tool context contract

The Mathematics Engine exposes lesson context; the canonical toolbars decide what to show.

Suggested lesson context object:

```js
window.KhaemenesMathContext = {
  version: "1.0.0",
  level: "high-school",
  courseId: "pre-algebra",
  unitId: "unit-01",
  lessonId: "lesson-01",
  evidenceMode: "procedural",
  assessmentMode: false,
  closedBook: false,
  tools: ["calculator","notepad","whiteboard","number-line"],
  resources: ["worksheet","video","game"],
  masteryAuthority: "course-runtime"
};
```

The engine does not hard-code ecosystem URLs when an authoritative directory entry exists.

The lower-left Class Tools toolbar may use this context to match:

- games;
- materials;
- notes;
- calculator;
- graphing tool;
- formula/reference sheet;
- course-specific laboratories;
- search/help.

---

## 9. Rubric architecture

The Mathematics Engine must include a quality validator separate from grading.

### Universal lesson quality dimensions

A lesson cannot receive **Exceptional** status unless required dimensions are satisfied.

1. Clear learning objective
2. Appropriate prerequisite/retrieval activation
3. Conceptual development
4. Worked reasoning
5. Guided reasoning
6. Independent mathematical work
7. Reasoning/error-analysis component
8. Application or transfer
9. Adequate workspace
10. Appropriate mathematical representation
11. Feedback or verification
12. Reflection/exit evidence
13. Accessible typography and controls
14. Responsive layout
15. Persistence/record safety
16. Correct progression/mastery integration
17. No duplicate page engines or instructional overlays
18. Tool relevance
19. Course-specific rigor
20. Print/export behavior where applicable

### Mathematical reasoning dimensions

Courses may require different subsets:

- procedural fluency;
- conceptual understanding;
- representation/interpretation;
- multi-step application;
- error analysis;
- transfer/reasoning;
- modelling;
- proof;
- computation;
- data interpretation;
- mathematical communication;
- research/reproducibility.

### Validator outcome

The validator may report:

- Exceptional
- Strong
- Needs Review
- Incomplete
- Blocked by missing evidence

The validator never changes a student's grade.

---

## 10. International and free-access design

The program is intended to be usable by learners worldwide.

The engine should therefore favor:

- free public access;
- low-dependency vanilla web technology;
- local-first operation;
- graceful failure when optional online resources are unavailable;
- printability;
- download/export where permitted;
- multilingual translation support;
- metric and commonly used international notation where context requires;
- explicit notation definitions;
- accessible keyboard navigation;
- screen-reader semantics;
- reduced-motion support;
- mobile and tablet layouts;
- no mandatory third-party account for public learning content;
- no advertising inside the instructional mathematics surface.

Optional external videos, references, or tools may enrich instruction but must not become the sole path to required learning.

---

## 11. Data and learner protection

Visual or engine upgrades must never:

- clear learner storage;
- reset grades;
- rewrite mastery records;
- falsify completion;
- bypass gates;
- merge learner identities;
- overwrite student-owned evidence;
- silently migrate incompatible data without provenance.

Every migration must be:

- versioned;
- learner-bound;
- validated;
- recoverable;
- exportable where supported;
- explicit about provenance.

Student personalization remains separate from academic evidence.

---

## 12. Engine conflict-prevention contract

When the canonical engine is active:

- only one mathematics lesson engine may mount;
- legacy lesson renderers must detect the canonical owner and stand down;
- independent game spotlight renderers must not inject into the lesson body;
- independent reflection/evidence renderers must expose data services but not create duplicate lesson sections;
- generic lesson presentation CSS must not override the canonical math workspace;
- profile toolbars and profile hero components must not mount inside mathematics pages;
- duplicate toolbars must fail closed;
- duplicate ticker/header/footer mounts must be reported;
- engine mount must be idempotent.

Suggested ownership marker:

```html
<main id="khaemenesMathWorkspace"
      data-khaemenes-math-engine="1.0.0"
      data-engine-owner="canonical">
</main>
```

Suggested global guard:

```js
if (window.KhaemenesMathEngine) return;
```

---

## 12A. Canonical shared implementation assets

All mathematics pages that adopt the universal engine must reference the shared canonical assets below rather than copying their CSS or bootstrap logic locally.

- **Universal stylesheet:** `https://vervenveda.com/assets/khaemenes-math-engine-v1.css`
- **Universal engine/bootstrap:** `https://vervenveda.com/assets/khaemenes-math-engine-v1.js`

These files are the presentation and ownership source of truth.

Rules:

- typography, spacing, radius, worksheet surfaces, problem cards, work areas, responsive breakpoints, and print behavior are upgraded in the canonical stylesheet;
- engine ownership, context, mount guards, and duplicate-component audits are upgraded in the canonical bootstrap;
- adopted lesson pages must not fork these rules into course-local copies except for narrowly scoped course-specific extensions;
- course-local extensions must never override global typography or structural ownership without an explicit documented exception;
- changing a canonical asset intentionally propagates the upgrade to all adopted mathematics pages on their next load;
- deployment must preserve version history and must be tested against representative High School and Higher Learning pages before major visual changes.

## 13. Required engine modules

The implementation should be divided into small modules.

### Presentation

- `math-engine-v1.js`
- `math-engine-v1.css`

### Curriculum adapters

- lesson-data adapter;
- legacy LESSON_DATA adapter;
- JSON lesson adapter;
- Higher Learning course-data adapter.

### Academic services

- rubric validator;
- workspace renderer;
- representation renderer;
- evidence-mode renderer;
- lesson navigation adapter.

### Integration adapters

- learner scope;
- mastery/progression;
- evidence ledger;
- class tools context;
- assessment restrictions;
- print/export.

No module may duplicate an authority owned by another module.

---

## 14. Course progression philosophy

The program supports a continuous mathematics continuum.

Possible pathway:

Foundational Numeracy  
→ Pre-Algebra  
→ Algebra I  
→ Geometry  
→ Algebra II  
→ Precalculus & Trigonometry  
→ Calculus I  
→ Calculus II  
→ Linear Algebra / Differential Equations / Statistics / Discrete Mathematics  
→ Introduction to Proofs  
→ Real & Complex Analysis / Abstract Algebra  
→ Topology & Differential Geometry  
→ Advanced Geometric Topology & Mathematical Physics

Placement flexibility is allowed.

Learners should be able to enter at an appropriate level through transparent readiness evidence rather than age alone.

The engine must support the continuum without forcing all learners through one fixed route.

---

## 15. Mathematics lesson acceptance protocol

Before a lesson is migrated to the canonical engine:

1. preserve the last approved page;
2. inventory scripts, CSS, toolbars, overlays, modals, service workers, and record adapters;
3. identify all runtime owners;
4. classify each dependency as:
   - global shell;
   - math engine;
   - data/authority service;
   - authorized peripheral tool;
   - obsolete/competing renderer;
5. preserve curriculum content and IDs;
6. mount the canonical engine on one representative lesson;
7. validate all lesson interactions;
8. validate persistence and learner binding;
9. validate keyboard and screen-reader operation;
10. validate tablet landscape and portrait;
11. validate desktop and mobile;
12. validate print/export;
13. verify one instance of each approved global component;
14. verify no competing instructional renderer remains active;
15. run the mathematics quality rubric;
16. obtain visual approval;
17. migrate the next lesson only after acceptance.

Failure protocol:

- stop the batch;
- isolate the local failure;
- revert only the specific regression;
- do not perform repository-wide rollback for a localized presentation defect.

---

## 16. Initial implementation sequence

### Phase 1 — Prototype

Use **Pre-Algebra · Unit 01 · Lesson 01** as the canonical prototype.

Target state:

- one math engine;
- one canonical math stylesheet;
- preserved curriculum data;
- preserved learner records;
- preserved mastery rules;
- canonical global shell;
- lower-left Class Tools toolbar;
- lower-right Ecosystem toolbar where allowed;
- no student-profile UI;
- no duplicate lesson evidence form;
- no competing legacy page engine.

### Phase 2 — Unit 01

Migrate Lessons 02–06 after Lesson 01 acceptance.

### Phase 3 — High School mathematics

Migrate:

- Pre-Algebra;
- Algebra I;
- Geometry;
- Algebra II.

### Phase 4 — bridge courses

Migrate:

- Precalculus & Trigonometry;
- Calculus I.

### Phase 5 — collegiate mathematics

Adopt the engine in:

- Calculus II;
- Linear Algebra;
- Differential Equations;
- Statistics;
- Discrete Mathematics;
- Introduction to Proofs;
- Real & Complex Analysis;
- Abstract Algebra;
- Topology & Differential Geometry;
- Advanced Geometric Topology & Mathematical Physics.

Advanced courses retain their proof, laboratory, research, mentor, and student-owned evidence capabilities.

---

## 17. Definition of A+++ / Exceptional

A Khaemenes Mathematics course reaches **A+++ / Exceptional** only when excellence is present in both curriculum and learner experience.

It must demonstrate:

- mathematical correctness;
- depth appropriate to level;
- coherent progression;
- strong worked reasoning;
- meaningful independent work;
- retrieval and spaced review;
- transfer and application;
- error analysis;
- modelling where appropriate;
- proof where appropriate;
- data interpretation where appropriate;
- mathematical communication;
- accessible and responsive presentation;
- appropriate tools;
- protected learner records;
- transparent mastery;
- resilient offline/local-first behavior;
- printable/exportable evidence;
- no competing page authorities;
- no visual clutter that interferes with mathematical attention;
- free and dignified access to the core learning experience.

The goal is not merely to make mathematics pages consistent.

The goal is to create a rigorous, beautiful, resilient, globally accessible mathematics learning environment in which a learner can begin with foundational skills and continue into advanced mathematical study without leaving the same coherent educational ecosystem.

---

**Canonical principle:**  
**One mathematical continuum. One engine architecture. Many levels of reasoning. Free access. Exceptional depth.**
