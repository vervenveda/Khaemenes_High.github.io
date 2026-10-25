# Algebra I · Five More Forensic Bubbles — 2026-10-25

**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Branch:** `main`  
**Scope:** post-repair learner-facing Units 01–09, misconception mapping, retake evidence, persistence, offline use, and diagnostic feedback  
**Status:** fresh source-level audit complete; five new bubbles identified

## What this audit does not repeat

The previous five Algebra I findings remain repaired on `main`:

- Unit 01 lesson checks now use 10 questions;
- Units 02–09 balance learner-visible answer positions on first attempt and retake;
- Units 02–09 retakes use aligned alternate questions rather than option-only reshuffling;
- forensic validation distinguishes the 610 dedicated Unit 01–09 questions from the 435-item shared bank;
- Units 02–09 save versioned answer snapshots.

The new findings below begin after those repairs.

---

## Bubble 1 · 410 of 610 dedicated misconception records are still provisional

**Severity:** High  
**Surface:** Units 02, 03, 04, 06, 07, 08

The dedicated misconception map contains all **610 active Unit 01–09 items** and all **1,830 wrong-option rationale records**, but only **200 items** carry the fully reviewed status:

`lesson-family-reviewed-v1`

The remaining **410 items** are:

`lesson-family-provisional-v1`

Current status by unit:

- Unit 01: 60 reviewed / 0 provisional
- Unit 02: 0 reviewed / 70 provisional
- Unit 03: 0 reviewed / 70 provisional
- Unit 04: 0 reviewed / 60 provisional
- Unit 05: 70 reviewed / 0 provisional
- Unit 06: 0 reviewed / 80 provisional
- Unit 07: 0 reviewed / 70 provisional
- Unit 08: 0 reviewed / 60 provisional
- Unit 09: 70 reviewed / 0 provisional

### Why this matters

The validator correctly proves structural completeness, but structural completeness is not the same as item-writing certification. A provisional family rationale can be useful scaffolding, but it should not be reported as equivalent to a reviewed distractor diagnosis.

### Surgical repair

Review the remaining units systematically, preserving the current prompt/key/option drift protection. Promote a record to `lesson-family-reviewed-v1` only after checking that each distractor rationale describes the actual wrong option rather than merely the lesson family.

---

## Bubble 2 · 70 retake alternate questions still have no misconception mapping

**Severity:** High  
**Surface:** Units 02–09 fresh retakes

The repaired retake engine draws five aligned alternates from the shared 435-item bank. Across Units 02–09 there are **275 aligned alternate items**.

Current shared-map coverage for those retake alternates:

- mapped: **205 / 275**
- unmapped: **70 / 275**

By unit:

- Unit 02: 30 mapped / 5 unmapped
- Unit 03: 24 mapped / 11 unmapped
- Unit 04: 30 mapped / 0 unmapped
- Unit 05: 15 mapped / 20 unmapped
- Unit 06: 35 mapped / 5 unmapped
- Unit 07: 17 mapped / 18 unmapped
- Unit 08: 19 mapped / 11 unmapped
- Unit 09: 35 mapped / 0 unmapped

### Why this matters

A learner can now receive a genuinely fresh retake, but roughly one quarter of the alternate retake bank cannot yet be interpreted through the misconception framework. Diagnostic coverage therefore drops precisely on the fresh forms intended to show whether a misconception persists.

### Surgical repair

Finish misconception mapping for the remaining 70 Unit 02–09 shared alternates, prioritizing Units 05 and 07, which account for 38 of the 70 gaps.

---

## Bubble 3 · The misconception maps are forensic-only; the learner runtime never loads them

**Severity:** High  
**Surface:** Units 01–09 lesson feedback and correction cycles

A source matrix across Unit 01 and all Unit 02–09 cores confirms:

- **0 / 9 runtimes load** `dedicated-assessment-misconceptions-v1.json`;
- **0 / 9 runtimes use** `misconceptionTag`;
- current wrong-answer feedback remains `q.explanation` — the correct-answer explanation.

The Algebra I service-worker manifests also do **not** cache either misconception map.

### Why this matters

The repository now contains thousands of lines of misconception evidence, but a learner who selects a distractor still receives only the generic correct-answer explanation. A parent or teacher working offline cannot ask the lesson runtime, “Which reasoning error did this selected option represent?”

The mapping system is therefore certified as an audit artifact, not yet as a learner-facing diagnostic tool.

### Surgical repair

Create a small first-party misconception resolver that:

1. loads the dedicated map for dedicated items;
2. uses the shared map for aligned alternate items;
3. resolves by stable item ID plus original selected option index;
4. shows a concise misconception-aware correction after submission;
5. stores the misconception tag/map version in the immutable attempt snapshot;
6. is included in the Algebra I offline cache.

The correct-answer explanation should remain visible; the distractor rationale should supplement it, not replace instruction.

---

## Bubble 4 · Unit 01 Lessons 01–05 no longer have genuine fresh-question retakes

**Severity:** High  
**Surface:** Unit 01 retakes

The earlier repair correctly restored Unit 01 lesson checks from 8 questions to the intended **10 questions**.

However, Unit 01 Lessons 01–05 each contain exactly **10 authored questions**. The runtime now presents all ten:

`chosen.length > 10 ? chosen.slice(0,10) : chosen`

Because the source pool and delivered form are both ten items, a new attempt can reshuffle question order and option order but cannot change the question set.

Lesson 06 is different: it augments its ten authored items with **24 synthesis variants**, so it has genuine question-set freshness.

### Why this matters

The repair restored correct mastery granularity but unintentionally removed the selection headroom that previously allowed prompt variation. Unit 01 Lessons 01–05 now lag behind the fresh-retake standard established for Units 02–09.

### Surgical repair

Give Unit 01 Lessons 01–05 the same aligned-alternate architecture used by Units 02–09. The shared Algebra I bank already carries five aligned items per lesson, so the preferred repair is a 15-item runtime pool:

- 10 dedicated;
- 5 aligned alternates;
- first attempt preserves the ten dedicated questions;
- retake mixes five alternates plus five dedicated questions;
- answer positions remain balanced.

---

## Bubble 5 · Unit 01 answer snapshots still use the old evidence schema

**Severity:** High  
**Surface:** Unit 01 persistence and misconception reconstruction

Units 02–09 now save a versioned snapshot containing:

- stable item ID;
- source;
- selected delivered option index;
- selected original option index;
- correct delivered option index;
- correct original option index;
- selected text;
- correct text;
- `formVersion: "algebra1-runtime-balanced-v2"`.

Unit 01 still saves only:

```js
{id, option, answer}
```

Because Unit 01 shuffles options before display, `option` and `answer` describe the delivered form rather than reliably preserving the original bank positions.

### Why this matters

After reload, Unit 01 evidence cannot be resolved to the dedicated misconception map with the same confidence as Units 02–09. It also lacks the text/source/version fields needed to detect historical drift.

### Surgical repair

Move Unit 01 onto the same v2 attempt schema as Units 02–09, including original/delivered indices, option text, source, form version, mastery threshold, attempt number, and future misconception tag/map-version fields.

Historical attempts should remain untouched.

---

## Recommended push order

1. **Bubble 5 — upgrade Unit 01 answer evidence schema.** Smallest surface and establishes one evidence format across Units 01–09.
2. **Bubble 4 — add aligned alternate retakes to Unit 01 Lessons 01–05.** This can reuse the shared bank and the Unit 02–09 form architecture.
3. **Bubble 2 — close the 70-item alternate-map gap.** Once all fresh retake items are interpretable, diagnostic coverage becomes continuous.
4. **Bubble 3 — wire misconception resolution into runtime feedback and offline caching.** Do this after both source banks have complete mappings.
5. **Bubble 1 — complete human review of the 410 provisional dedicated items.** Promote units systematically and keep provisional status visible until review is complete.

This order avoids putting provisional rationale into learner-facing feedback before the coverage and evidence contracts are ready.

## Certification boundary

This is a fresh **source-level** audit of current `main`.

A real-browser regression through representative **Unit 01 → Unit 05 → Unit 09** journeys is still required after the next repairs:

first attempt → submit → locked answers → misconception-aware feedback → fresh retake → reload → inspect saved evidence.

That browser journey should remain a certification boundary rather than being mislabeled as one of the five source defects above.


---

## Execution update · 2026-10-25

The recommended surgical sequence was executed through Bubbles **5 → 4 → 2 → 3** on `main`.

### Bubble 5 · repaired at source level

Unit 01 now saves the same reconstructable answer evidence required by the later runtimes:

- selected displayed option index;
- selected original option index;
- correct displayed and original indexes;
- selected and correct text;
- item source;
- `formVersion: "algebra1-runtime-balanced-v2"`;
- `evidenceSchema: "algebra1-answer-evidence-v2"`;
- bank version, selection policy, eligible-pool size, attempt number, and mastery threshold;
- misconception tag/map source/map version/review status when a mapped distractor is selected.

Historical attempts are not rewritten.

### Bubble 4 · repaired with an abundance-bank standard

Unit 01 Lessons 01–05 now each expose **30 eligible questions for a 10-question graded form**:

- 10 dedicated lesson questions;
- 5 existing shared aligned alternates;
- 15 new stable abundant-bank variants.

That creates `C(30,10) = 30,045,015` possible ten-question sets before answer-position balancing. Retakes use unseen-first blueprint selection and minimize overlap with the immediately preceding form. The new 75-item abundant bank uses stable IDs plus generator/version/seed metadata and is included in offline caching.

Lesson 06 retains its existing synthesis-variant depth and also has access to the shared alternate bank.

### Bubble 2 · structurally repaired without overstating review quality

All **275 / 275** Units 02–09 aligned retake alternates now have misconception-map records.

Current status:

- **205 reviewed**;
- **70 family-level provisional**;
- **0 unmapped**;
- **0 prompt/key/explanation drift**.

The 70 newly mapped records remain explicitly `family-provisional-v1` and are not represented as human-reviewed distractor diagnosis.

### Bubble 3 · repaired with reviewed-only learner feedback

A first-party misconception resolver now loads the dedicated and shared maps locally. Units 01–09:

- resolve mapped wrong answers by stable item ID plus original selected option index;
- save misconception tag, map source, map version, and review status in the immutable answer snapshot;
- append misconception-specific learner correction only when the mapping is reviewed;
- fall back to the ordinary correct-answer explanation for provisional or unavailable mappings;
- cache the resolver and both misconception maps for offline use.

### Bubble 1 · intentionally remains open

The dedicated map still contains:

- **610 total dedicated items**;
- **200 `lesson-family-reviewed-v1`**;
- **410 `lesson-family-provisional-v1`**.

Those 410 records were **not** automatically promoted. The original finding specifically distinguishes family-level provisional reasoning from human-reviewed distractor diagnosis. Preserving that distinction is part of the certification contract.

### Fresh source regression

A post-repair source regression against current `main` found:

- Unit 01 Lessons 01–05: **30 eligible questions each**;
- abundant bank: **75 / 75 unique stable IDs**;
- Units 02–09 aligned misconception coverage: **275 mapped / 205 reviewed / 70 provisional / 0 drift**;
- all Unit 02–09 loaders include the misconception resolver;
- all Unit 02–09 cores await the resolver before grading and preserve original option identity;
- all Unit 01–09 feedback paths gate misconception-specific learner text on reviewed status;
- misconception resolver, shared map, dedicated map, shared question bank, and Unit 01 abundant bank are represented in offline-cache manifests.

No automatic GitHub Actions run was attached to the repaired head, so CI is **not** being labeled green.

### Certification boundary remains unchanged

The real-browser journey is still required:

**Unit 01 → Unit 05 → Unit 09**

first attempt → submit → locked answers → reviewed misconception-aware feedback → fresh retake → reload → inspect saved evidence.

That browser journey remains the final certification boundary and has not been mislabeled as completed.
