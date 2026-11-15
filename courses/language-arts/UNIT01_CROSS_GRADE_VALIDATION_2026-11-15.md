# High School English · Unit 01 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** English 9, 10, 11 and 12 · Unit 01 · Weeks 01–03  
**Mode:** Structural/runtime-source validation. Existing learner records, grades, assessment keys and mastery authority were not modified.

## Executive result

**PASS WITH REPAIRS COMPLETED**

The four Unit 01 implementations now form one developmental architecture with grade-specific scaffolding. The specialized evidence layers are presentation/instruction only and contain no learner-storage, network-write or grading authority.

Two cross-grade defects were found and repaired during validation:

1. A shared JavaScript edit contained four literal `\n` escape sequences outside strings. These were replaced with real line breaks. The shared engine now parses successfully.
2. Legacy weekly-page typography contained old 55px eyebrow declarations and several sub-16px source rules. A canonical evidence-layer typography guard now outranks those legacy declarations at runtime without rewriting individual curriculum pages.

## Developmental progression

| Grade | Unit 01 cognitive responsibility |
| --- | --- |
| English 9 | Identify → infer → support |
| English 10 | Compare → qualify → judge reasoning |
| English 11 | Select method → evaluate → synthesize → counter |
| English 12 | Set inquiry → choose method → test → defend → audit |

The page rhythm stays predictable while intellectual control moves progressively to the learner.

## Safety and authority validation

Specialized files checked:

- English 9 `assets/unit01-evidence-v1.js`
- English 10 `assets/unit01-evidence-v1.js`
- English 11 `assets/unit01-evidence-v1.js`
- English 12 `assets/unit01-evidence-v1.js`
- shared `courses/shared/evidence-based-english-v1.js`

Results:

- `localStorage` writes in specialized/shared evidence layers: **0**
- `sessionStorage` writes: **0**
- network `fetch()` calls: **0**
- learner-record write calls: **0**
- assessment-answer mutation: **0**
- mastery-award logic added: **0**
- new evidence-layer font declarations below 16px: **0**, except the intentional Academy eyebrow category size of 14px in the shared typography guard
- JavaScript syntax: **PASS** for shared engine, all specialized layers and all touched course/daily loaders

Existing course engines continue to own learner records. Existing assessment engines continue to own quiz/test scoring. Written mastery remains dependent on the relevant student artifact and evaluator authority.

## Duplicate-layer validation

The shared evidence engine maintains a specialized Unit 01 guard for English 9–12 Weeks 01–03. This prevents generic retrieval/exit prompts from being added on top of the grade-specific Unit 01 prompts.

The shared learning-cycle card may still appear on weekly/unit pages because it is a common orientation element; specialized daily retrieval prompts remain grade-specific.

## Loader topology

### English 9
Specialized Unit 01 retrieval is loaded through the existing Week 1, Week 2 and Week 3 daily engines. The canonical daily lessons remain the instructional authority; weekly pages continue to function as hubs/workspaces.

### English 10
The main English 10 course engine loads the Unit 01 layer for Weeks 01–03. This supports both the five Week 1 studios and the embedded Week 2–3 daily classrooms.

### English 11
Weeks 02–03 load through the main course engine. The five Week 01 companion lessons load the specialized layer directly.

### English 12
Weeks 02–03 load through the main course engine. The five Week 01 companion lessons load the specialized senior layer directly.

## Typography and visual hierarchy

The shared evidence stylesheet now enforces the Academy evidence-page standards above legacy week CSS:

- body and interactive-content floor: 16px
- eyebrow/category label: 14px Cinzel
- section-head title: 33px Cinzel, weight 400, centered
- buttons/primary controls: minimum 44px touch height
- learning/retrieval cards: 7px radius
- long reading/prose measure: approximately 74–76 characters
- responsive learning-cycle grid: 5 columns → 2 columns → 1 column
- reduced-motion preference respected
- print layout removes decorative shadow and preserves readable structure

The override is centralized in `courses/shared/evidence-based-english-v1.css`; individual curriculum pages do not need repetitive typography patches.

## Reading and source custody validation

Unit 01 reading chains remain locally embedded or local-repository resources. Fictional instructional sources are identified as fictional/simulated where relevant. Optional media never supersedes the written lesson.

The four grades retain their distinct reading responsibilities:

- Grade 9: repeated anchor reading + unfamiliar transfer
- Grade 10: paired-source scope and credibility
- Grade 11: provenance, conflicting testimony and method-aware synthesis
- Grade 12: source authority, quantitative uncertainty, translation limits, technology verification and authorship trail

## Mobile/tablet structural validation

The new evidence layers introduce no fixed page widths, fixed-position instructional cards, horizontal transforms, or viewport-dependent absolute positioning. New cards use bounded character measure, fluid width and responsive grids. Existing course/mobile CSS remains authoritative outside the evidence components.

No new lower-right floating controls were introduced; the official ecosystem toolbar remains separate from instructional content.

## Assessment/mastery validation

The evidence architecture deliberately preserves these boundaries:

- completion ≠ mastery;
- formative retrieval/checks ≠ evaluator judgment;
- quiz thresholds remain owned by existing assessment code;
- Grade 9 independent assessment/evaluator flow remains untouched;
- Grades 10–12 project/portfolio evidence remains in existing learner records;
- no new storage key was introduced by the cross-grade evidence layers.

## Repairs completed during this validation

### Shared-engine parse repair
Commit: `a6467e7bd950e32c3a917d8488148295619428b7`

Replaced four accidental literal escaped-newline tokens with actual line breaks.

### Canonical typography guard
Commit: `069b1b23d868b219c22cd1b18025eaddaca1c092`

Added a centralized Academy typography/touch-target override to the shared evidence stylesheet so legacy embedded week rules cannot force 55px eyebrow text or sub-16px instructional controls.

## Propagation rules for Units 02–12

When promoting this architecture:

1. Preserve each unit's actual texts, assessments and unique intellectual focus.
2. Reuse the shared cognitive architecture; do not clone Unit 01 content.
3. Build a unit-specific spaced retrieval map rather than generic recall.
4. Continue the grade-level scaffold fade.
5. Use real worked reasoning examples for demanding skills.
6. Keep support pathways optional and cognitively equivalent.
7. Keep completion, practice and evaluator mastery separate.
8. Add no learner-storage authority to instructional enhancement layers.
9. Maintain local/offline reading custody wherever legally possible.
10. Run syntax, typography, duplicate-layer and storage-authority validation before promotion.

## Release decision

**Unit 01 architecture is approved as the propagation blueprint for English 9–12.**

The safest next phase is a unit-by-unit propagation beginning with Unit 02 across all four grades, validating one unit family before moving to Unit 03.
