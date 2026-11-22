# High School Running Progress Log · 2026-11-22

## Purpose

This is the active High School workflow journal for ongoing audits, hardening, repairs, validation, and release-state notes.

Use this file as the running source-of-truth for work performed after 2026-11-22. Add new entries at the top of the **Running entries** section as work is completed.

## Standing watch items

- Keep watching for any residue from the retired High School global chrome/page-regulator architecture.
- The retired `high-school-global-chrome-v2.js` asset must not return to runtime HTML, JavaScript, service-worker caches, generators, tests, validators, or lesson engines.
- Science lesson engines remain instructional-only and must not own tickers, header/hamburger, translator/language chrome, ecosystem toolbar, or other page-shell systems.
- Preserve learner records, mastery authority, assessment ownership, and existing routes during presentation or engine work.
- Distinguish source verification from browser/device certification.
- Record PR/commit references and PASS/HOLD status for each substantive change.

## Running entries

### 2026-11-22 · Upper Science Instruction Engine v1 pilot

**Type:** upgrade · science engine · architecture

**Scope:** Biology 10 pilot; future Chemistry 11 and Physics 12 expansion.

Work in progress:
- created shared `courses/shared/upper-science-instruction-engine-v1.js`;
- established seven upper-science instructional stages;
- mounted the engine opt-in on Biology 10 · Week 01 · Day 01;
- preserved the existing lesson body, formative evidence bridge, course routes and provenance;
- added a fail-open semantic section mapper;
- keeps safety content visible during guided navigation;
- added explicit engine firewall: no mastery, completion, records, storage, network, chrome, translator, ticker or toolbar ownership;
- added dedicated source/CI contract;
- documented the engine in `workflow/blueprints/upper-science-instruction-engine-v1.md`.

Validation:
- Upper Science Instruction Engine v1 — PASS;
- Upper High School Daily Instruction Validation — PASS;
- Biology 10 Course Integrity — PASS;
- Biology 10 upper-science structural validation — PASS;
- Biology 10 secure assessment blueprint validation — PASS;
- Biology 10 upper-science student regression — PASS after aligning the regression with the current retention-pool architecture;
- Science 9 Lesson Engine Pilot Integrity — PASS;
- No Page Regulator Regression — PASS;
- Public Entry Route Validation — PASS;
- Grade 10 English and Biology Assessment Presentation — PASS.

PR: **#98**  
Final SHA: `b97937fbf5d5d2bc99d7ad92cea0e385d9044255`

Status: **MERGED · BIOLOGY 10 PILOT VALIDATED**

---


### 2026-11-22 · Retired High School chrome residue purge and permanent guard

**Type:** repair · audit · regression hardening

**Merged PR:** #96  
**Final SHA:** `a81195bb786ef22717073fe839711588476c09e7`

Work completed:
- confirmed the retired global chrome asset was already absent from public HTML loaders;
- expanded the no-page-regulator scan from HTML-only to HTML/JS/MJS/CJS runtime source;
- removed remaining retired-chrome references from mathematics service-worker cache rules;
- removed old validator/test allowlists and regression expectations that still treated the retired chrome as valid;
- removed retired-chrome references from English, mathematics, science, social-studies, navigation, readiness, and visual-regression probes;
- replaced the obsolete typography audit that depended on the retired global chrome asset;
- locked the shared Science lesson engine to instructional-only ownership.

Science engine forbidden ownership:
- retired High School global chrome;
- 333 ticker;
- auto-populating ticker;
- VNV header/hamburger;
- ecosystem toolbar;
- translator/language chrome.

Validation:
- Science 9 Lesson Engine Pilot Integrity passed on the purge branch before the broader source cleanup.
- Strengthened repository guard was updated to catch future runtime reintroduction.
- Hosted Actions queue was backed up during final cleanup; do not interpret queued checks as PASS.

Status: **MERGED · RETIRED CHROME PURGE HARDENED · CONTINUE WATCH**

---

### 2026-11-22 · High School Science canonical course landing layer

**Type:** upgrade · navigation · presentation

**Merged PR:** #95  
**Final SHA:** `e6413a1f7371717d7f675673a0d09d6410648250`

Work completed:
- added dedicated `landing.html` pages for Science 9, Biology 10, Chemistry 11, and Physics & Engineering 12;
- preserved existing course-root `index.html` files as the full class portals;
- routed the Science department cards through the new landing layer;
- implemented charcoal / cream / parchment presentation;
- implemented 33px Academy eyebrow, 66px course title, 24px descriptor;
- added Learner Profile, Parent Profile, and Enrollment access buttons;
- added concise About section;
- added symmetrical 2×2 Course Features grid with popup information and links;
- standardized 7px corners and button/card symmetry;
- added source-level landing contract validation.

Validation:
- Science Course Landing Canonical Contract — PASS;
- High School Dual Ticker Coverage — PASS;
- Public Entry Route Validation — PASS;
- Science 9 learner journey — PASS;
- Grade 09 Science and English Readiness UI — PASS.

Status: **MERGED · LANDING LAYER STABLE**

---

### 2026-11-22 · Science lesson engine v0.2 curriculum hardening

**Type:** upgrade · curriculum · lesson engine · rubric sync

**Merged PR:** #94  
**Final SHA:** `b82804587ea11430e8ef64be450722f22ba99cad`

Work completed:
- hardened shared Science lesson engine pilot to v0.2;
- synchronized Grade 9 · Unit 01 · Lesson 01 to the hardened engine;
- added explicit essential question;
- added six-term inquiry vocabulary block with retrieval;
- added Observe → Predict → Test scaffold;
- added quantitative fictional evidence example with units and means;
- added accessible graph comparison;
- added four feedback-enabled reasoning checks;
- added CER/revision scaffold while preserving existing evidence ownership;
- synchronized the Lesson 01 evidence rubric across:
  - teacher resource,
  - live lesson,
  - engine contract,
  - isolated prototype;
- established rubric ID `sci9-u01-d01-evidence-v1`;
- preserved Unit 01 mastery and learner-record authority outside the engine.

Validation:
- Science 9 Lesson Engine Pilot Integrity — PASS;
- Science 9 learner journey — PASS;
- Science 9 learner isolation — PASS;
- JavaScript syntax — PASS;
- curriculum/rubric drift regression — PASS.

Known unrelated hold:
- broader Science Student Experience workflow had a Grades 10–12 assessment-flow failure occurring before Grade 9 execution.

Status: **MERGED · SCIENCE ENGINE PILOT HARDENED**

---

## Next logging rule

For each new High School task:
1. append a concise dated entry here;
2. link any dedicated detailed log when one is created;
3. record affected course/grade;
4. record PR and final SHA when merged;
5. record source PASS separately from browser/device PASS;
6. carry unresolved HOLD items forward until closed;
7. note any retired chrome/page-regulator residue immediately if discovered.
