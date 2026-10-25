# Algebra I · Fresh Forensic Reaudit — 2026-10-25

**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Branch:** `main`  
**Scope:** learner launch, lesson checks, retakes, assessment banks, misconception evidence, progression, and saved attempt evidence  
**Status:** five actionable bubbles identified; no learner-facing behavior changed by this audit

## What remains strong

The fresh pass confirms that several earlier repairs remain intact:

- canonical mastery threshold remains 80%;
- graded answers are locked after submission;
- best scores and attempt histories are preserved;
- weekly mastery remains 36 × 10 with Week 1 separated as readiness evidence;
- Units 01–09 use dedicated lesson banks with 10 authored questions per lesson;
- formal unit mastery gates require prerequisite lesson and weekly mastery;
- Units 07–13 preserve the reviewed mixed-evidence Midterm gate;
- cumulative Midterm/Final scoring preserves selected-response plus constructed-response review;
- public records continue to identify browser-local evidence as editable and unauthenticated;
- offline coverage retains the active course engines and unit assets.

The remaining issues are therefore not a collapse of the course. They are assessment-consistency and evidence-quality gaps between the dedicated first-half engines and the newer shared late-unit/forensic architecture.

---

## Bubble 1 · Unit 01 lesson check silently drops 2 of its 10 authored questions

**Severity:** High  
**Surface:** active learner lesson checks · Unit 01

The Unit 01 dedicated bank contains exactly **10 questions per lesson**, matching the course contract.

However, the active Unit 01 runtime does:

```js
if(key.startsWith("lesson-")&&chosen.length>8)chosen=chosen.slice(0,8);
```

Therefore a Unit 01 learner is graded on **8 questions**, not 10, even though:

- the dedicated bank provides 10;
- the course map declares 10-question lesson evidence for Units 01–09;
- Units 02–09 present all 10 questions.

### Why this matters

An 80% threshold means different discrete evidence depending on item count:

- 8-question check: 7/8 = 87.5% is the first passing integer score;
- 10-question check: 8/10 = 80% is the intended threshold.

Unit 01 is therefore operating under a materially different mastery granularity than Units 02–09.

### Surgical repair

Remove the eight-question slice for Unit 01 lesson checks and retain all ten authored questions while preserving current question/option randomization, attempt locking, saved best score, and weekly gates.

---

## Bubble 2 · Units 02–09 expose severe first-attempt answer-position patterns

**Severity:** Critical  
**Surface:** active learner lesson checks, practice, and dedicated mastery forms

The dedicated Units 02–09 render authored option order directly on the **first attempt**. Option reshuffling is installed only after a graded attempt.

Across the active dedicated Units 01–09 banks, authored correct-answer positions are:

- position 1: **532**
- position 2: **49**
- position 3: **28**
- position 4: **1**

More importantly, Units **05–09 place every correct answer in authored position 1**:

- Unit 05: 70 / 70
- Unit 06: 80 / 80
- Unit 07: 70 / 70
- Unit 08: 60 / 60
- Unit 09: 70 / 70

All **61 lessons** in Units 01–09 exceed a one-position balance tolerance in their authored banks.

The newer shared lesson renderer already solves this problem by constructing a balanced learner-visible answer schedule and remapping the keyed answer before display. The dedicated Units 02–09 do not yet use that protection on first render.

### Why this matters

A learner can infer a positional pattern without understanding the mathematics. This is an assessment-validity defect even though the answer keys themselves are mathematically correct.

### Surgical repair

Backport the shared balanced-option-order logic into the dedicated Unit 02–09 binders so the **first visible attempt and every retake** use remapped balanced positions. Preserve the original stored bank order and answer key.

---

## Bubble 3 · Units 02–09 retakes reshuffle choices, but not questions

**Severity:** High  
**Surface:** lesson and practice retakes · dedicated Units 02–09

After grading, Units 02–09 correctly lock the original inputs. The retry button then moves the existing option labels into a different order.

It does **not** choose a fresh question set.

For lesson checks this means:

- the same 10 prompts reappear;
- only option presentation changes;
- the learner already received the explanation for every missed question.

Unit 01 is stronger here: it has a 10-item lesson bank and builds a randomized 8-item attempt, so retakes can vary the selected prompts. The shared later-unit renderer also supports fresh randomized selection when a larger pool exists.

### Why this matters

A retake that repeats every prompt after showing explanations can reward recognition/memory rather than renewed problem solving. It also falls short of the intended “fresh retake” behavior established elsewhere in the mathematics program.

### Surgical repair

Create a minimum alternate lesson pool for Units 02–09 or split the existing 10-item bank into form-safe selection pools only after expanding each lesson bank. Retakes should change **questions and option order**, while attempt history and best score remain immutable.

Do not create fake freshness by only reordering the same choices.

---

## Bubble 4 · The consolidated Algebra I forensic audit is pointed at the wrong bank for Units 01–09

**Severity:** Critical  
**Surface:** Academy assessment certification and misconception mapping

The current consolidated forensic instrument audits:

`courses/mathematics/algebra-1/assets/question-bank.js`

That shared bank contains:

- **435 items**
- 87 lesson groups
- 5 shared items per lesson
- **271 misconception-mapped items / 813 distractor rationales**

But the active learner path for Units 01–09 uses dedicated unit banks:

- Unit 01: 60 items
- Unit 02: 70
- Unit 03: 70
- Unit 04: 60
- Unit 05: 70
- Unit 06: 80
- Unit 07: 70
- Unit 08: 60
- Unit 09: 70
- **Total: 610 active dedicated items**

Forensic overlap between those 610 active questions and the shared 435-item bank:

- stable item-ID overlap: **0**
- exact prompt overlap: **1**

Therefore the present “271 Algebra I items mapped” metric does **not** describe misconception coverage for the active Units 01–09 lesson banks.

The current consolidated auditor can also report first-form balance as PASS because it inspects the shared `unit-page-core.js`, while the dedicated Units 02–09 use separate cores that retain the first-attempt positional problem described in Bubble 2.

### Why this matters

This is a certification blind spot: the test suite can truthfully pass the files it inspects while missing the learner-facing bank that dominates the first 26 instructional weeks.

### Surgical repair

Upgrade the Algebra I forensic model to distinguish:

1. dedicated active banks for Units 01–09;
2. shared active banks for Units 10–13;
3. weekly mastery bank;
4. formal unit mastery blueprints;
5. cumulative assessment bank.

Misconception coverage and answer-position checks must report against the **runtime-authoritative bank for each surface**, not against one convenient aggregate file.

---

## Bubble 5 · Units 02–09 save scores and item IDs, but lose the learner’s selected-answer trail

**Severity:** High  
**Surface:** local evidence, correction cycles, parent/teacher review

Unit 01 attempt records preserve an `answerSnapshot`.

The shared late-unit engine preserves selected `answers`.

Units 02–09 currently save records shaped primarily as:

```js
{
  key,
  score,
  correct,
  total,
  at,
  items
}
```

They do **not** retain which option the learner selected for each item.

### Why this matters

After the page is closed, a teacher/parent can see a score and which questions appeared, but cannot reconstruct:

- which distractor was selected;
- which misconception pattern occurred;
- whether the same misconception persisted across attempts;
- which correction should be prioritized.

This also prevents the new misconception-mapping work from becoming genuinely useful learner evidence for Units 02–09.

### Surgical repair

Bring the Unit 02–09 attempt schema up to the Unit 01/shared standard by storing an immutable selected-answer snapshot for each attempt:

- stable item ID;
- selected original option index;
- correct original option index;
- delivered option order or remap information where needed;
- mastery threshold and pass/fail;
- timestamp and attempt number.

Do not rewrite historical attempts. New records should be versioned and backward-compatible.

---

## Recommended push order

1. **Bubble 2 — first-attempt answer-position balance.** This is the most direct assessment-validity defect and currently affects hundreds of active questions.
2. **Bubble 5 — selected-answer evidence.** Add this while touching the Unit 02–09 binders so future misconception analysis has usable data.
3. **Bubble 1 — restore Unit 01 to 10/10 lesson questions.** Small, contained, and brings the live runtime back to the declared mastery contract.
4. **Bubble 4 — make the forensic auditor runtime-aware.** Once the active engines are corrected, certify the banks learners actually see.
5. **Bubble 3 — build true fresh-question retakes.** This requires expanding or restructuring dedicated lesson banks, so it should follow the safer runtime repairs rather than being faked with choice-only shuffling.

## Certification boundary

This is a source-level forensic reaudit. The repository evidence is sufficient to identify the five issues above, but this report does not claim a real-browser regression has run after future repairs.

The current course remains protected by its existing 80% mastery gates, answer locking, weekly progression, mixed-evidence Midterm/Final rules, and local evidence trust labels. These five repairs should preserve those boundaries.
