# Unit 01 · Checkpoint 2
## Lesson 01 — Number Families & the Real Number System

Status: **Hardened reference lesson**

### Scope
This checkpoint upgrades Lesson 01 from a short concept/practice page into the reference interactive workbook lesson for Grade 9 Pre-Algebra.

### Student-facing upgrades
- Expanded instructional reading into four structured reading panels.
- Added an interactive six-family number-set explorer.
- Added four ungraded quick checks with immediate explanations.
- Added four fully worked examples.
- Added a guided-notes field saved locally.
- Added a deliberate 33-second visual/rest pause.
- Expanded scored lesson practice from 6 questions to **20 unique questions**.
- Added automatic practice-answer draft saving.
- Added an answered-question progress meter.
- Standardized lesson mastery at **80% (16/20)**.
- Added a professional mastery-gate modal that prevents moving to the next lesson until the current lesson reaches 80%.
- Preserved Foundation / Core / Extended pathways.
- Preserved multilingual vocabulary support.
- Preserved local reflection, export, theme, and print tools.

### Architecture upgrades
- `lesson-engine.js` now supports optional `reading_sections`, `number_sets`, and `quick_checks` data for future lessons.
- Lesson notes and practice drafts are stored separately in the existing Unit 01 local progress record.
- Manual “Mark Lesson Reviewed” remains separate from scored lesson mastery.
- Navigation unlocks only from a saved practice score at or above 80%.
- The updated engine remains backward-compatible with Lessons 02–06 while they await their individual deep-content passes.
- Unit 01 `unit-map.json` now reflects Lesson 01's expanded objectives and 60–75 minute duration.
- Lesson 01's embedded Unit Map fallback now matches the hardened 80% Unit 01 configuration.

### QA completed
- Shared lesson engine JavaScript syntax: PASS (`node --check`).
- Lesson data JSON extraction/parsing: PASS.
- Scored question count: 20.
- Every answer index is inside its option range.
- Reading panels: 4.
- Number-family explorer sets: 6.
- Ungraded quick checks: 4.
- Lesson 01 local stylesheet/script/link targets: PASS.
- Natural-number convention is stated consistently in Lesson 01: natural numbers begin at 1; zero is whole.

### Mastery contract
Lesson 01 is considered mastered only when the student's latest scored practice result is **80% or higher**. With 20 questions, this requires at least **16 correct answers**. A review mark does not unlock Lesson 02.

### Files changed
- `lessons/lesson-01-number-systems.html`
- `assets/lesson-engine.js`
- `unit-map.json`
- `CHECKPOINT_2_LESSON01_AUDIT.md`

### Next checkpoint
Lesson 02 — Factors, Multiples & Factor Pairs:
- deeper reading
- interactive factor-pair lab
- 20 verified practice questions
- same workbook rhythm and 80% progression contract
