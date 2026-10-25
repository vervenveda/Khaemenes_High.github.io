# Algebra I · Fresh Forensic Reaudit — 2026-10-25

**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Branch:** `main`  
**Scope:** learner launch, lesson checks, retakes, assessment banks, misconception evidence, progression, and saved attempt evidence  
**Status:** five audit bubbles repaired on `main` at source level; real-browser regression remains to be executed

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

---

## Post-audit repair record · 2026-10-25

The five findings above have now been pushed out on `main` without lowering the 80% mastery threshold or rewriting historical attempts.

### Bubble 1 · RESOLVED — Unit 01 restored to ten-question lesson checks

`units/unit-01/assets/unit01.js` now limits lesson forms to **10**, not 8. Lessons 1–5 therefore grade all ten authored questions; Lesson 6 continues to have a larger synthesis pool but presents a ten-question randomized mastery check.

Implementation commit: `8ab7e84461522ec316eedfd5bbd5aba1dd46e279`.

### Bubble 2 · RESOLVED — Units 02–09 balance the first visible form

Every dedicated Unit 02–09 core now rebuilds the displayed form before the learner answers it. For four-option questions, the runtime constructs a balanced correct-position schedule and remaps the answer key to the delivered option order. A ten-question lesson form therefore has a **3/3/2/2** correct-position distribution in randomized positional order rather than exposing the authored-bank skew.

The authored bank is intentionally left untouched for provenance. Its position distribution remains a forensic signal, not a learner-visible pattern.

Core commits:

- Unit 02: `339dcf9359971677b4fdbdea0a65c074bdd9573a`
- Unit 03: `29b57eb54af48f63896c7601f679d49f7e2df35f`
- Unit 04: `b2d76d774fd8e2c55e47a580794f445c685f3cbf`
- Unit 05: `accf6eadd4b082a499e8214210d63f5d93680081`
- Unit 06: `69bbefcda3546fbc0103214f13a10b0e4ce8f81f`
- Unit 07: `dfa90bb441923bf69ff257b218c038b1199b1efa`
- Unit 08: `3210a86a516acce986a83c7e09f9da1e83f21c30`
- Unit 09: `19b5c4eb7b0d0643872801913a4666b5fe1b98c3`

### Bubble 3 · RESOLVED — retakes now change questions as well as option order

The existing **435-item shared Algebra I bank** contains exactly **5 aligned questions for every Unit 02–09 lesson**. The loaders now make that bank available to the dedicated cores.

Each Unit 02–09 lesson now has a runtime pool of:

- 10 dedicated questions; plus
- 5 lesson-aligned shared alternates; equals
- **15 aligned questions per lesson**.

The first attempt preserves the ten dedicated questions but balances their delivered option positions. A retake uses **5 aligned alternate questions + 5 dedicated questions**, then balances the delivered option positions again. Subsequent retakes prioritize dedicated questions that were absent from the immediately previous form, so question-set freshness is no longer simulated by option-label movement alone.

All **55 Unit 02–09 lessons** therefore have aligned alternate pools, totaling **275 supplemental questions**.

Loader commits:

- Unit 02: `cc4988dee6dbdb5a3bbefa6a48149cf71dd9ce19`
- Unit 03: `d2dee53075a42f72dc83823b6edff82fc6e4a968`
- Unit 04: `47fe2d99a3c11298d9c2e152d5670b6437e7bfec`
- Unit 05: `655f27fe38dbaa812939e8f2876f788807c833e4`
- Unit 06: `beb4d4c8bbcc159f07211f453ea8417d37c0b409`
- Unit 07: `7f17990016ba5bb5ce6c89de503dbb9f43db22d2`
- Unit 08: `31dd32f8b7df1e1da7a2d1596482a4d663730a2a`
- Unit 09: `fe8a9e6487624304c214e6cb1c3489ef6027330b`

The alternate bank was already included in both Algebra I service-worker cache manifests, so this repair does not create a new online-only dependency.

### Bubble 4 · RESOLVED — forensic certification is now runtime-aware

A new dedicated validator now audits the learner-facing architecture:

`tools/validate-runtime-assessment-banks.mjs`

It verifies:

- **610 dedicated Unit 01–09 questions**;
- **61 dedicated lessons**, 10 questions each;
- Unit 01 ten-question runtime contract;
- Unit 02–09 balanced first-form markers;
- Unit 02–09 selected-answer snapshot schema;
- **55/55** aligned alternate lesson pools;
- **275** alternate questions;
- 15-question lesson-pool size;
- alternate-bank loader wiring;
- offline-cache coverage.

Validator commit: `20a2601df5aa98c5846832192c2a573e623e7610`.

The Academy-wide `tools/forensic-assessment-audit.mjs` now distinguishes the 610 dedicated Unit 01–09 bank from the 435-item shared bank instead of treating the latter as a proxy for the entire live course.

Forensic integration commit: `6367df407aa5f6e16eae5102304f1d345b9746e7`.

This correction also makes one remaining coverage fact explicit: the existing 271 misconception-mapped Algebra I items belong to the shared bank, while the **610 dedicated item IDs currently have no direct misconception-map entries**. That is now an honest WARN rather than a certification blind spot.

### Bubble 5 · RESOLVED — selected-answer evidence retained in Units 02–09

New Unit 02–09 attempts save a versioned `answerSnapshot` containing, for every delivered question:

- stable item ID;
- dedicated or aligned-alternate source;
- selected delivered option index;
- selected original option index;
- correct delivered option index;
- correct original option index;
- selected and correct option text;
- timestamp, attempt number, 80% threshold and mastery result;
- `formVersion: "algebra1-runtime-balanced-v2"`.

Historical records are not rewritten. Existing score/best-score storage remains backward-compatible.

## Source-level regression status

After the runtime patches, all touched Unit 01–09 JavaScript files were re-fetched from `main` and parsed successfully. The new runtime-aware validator and consolidated forensic auditor also retain parseable JavaScript syntax.

This certification remains **source-level**. A real-browser journey should still exercise first attempt → submit → lock → retry → reload → evidence inspection across representative Units 01, 05, and 09 before calling the browser experience fully certified.
