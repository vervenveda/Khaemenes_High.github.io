# High School Physical Education Hardening Status

## Learner-path regression pass — 2026-10-19

**Portal repair commit:** `2a1b5e4229240745d9ef817ff8f7bbcbfb1479b5`

### Repairs applied

- **Resume selected answers:** Grade 9 assessment choices are now saved into the existing in-progress attempt snapshot as the learner selects them. When the same attempt reloads, selected choices are restored with the same randomized questions and option order.
- **Export attempt snapshots:** Grade 9 journal export now includes referenced assessment attempt snapshots alongside weekly records and the five-day learning journal.
- **Import journal control:** Added a Grade 9 journal import path with a schema/grade check and a confirmation before replacing local journal records. Imported assessment attempts are given fresh local identities and the journal references are remapped to avoid colliding with existing immutable submissions.
- **Restore daily records cleanly:** Import replaces the exported day records, clearing stale local day records where the import contains none.
- **Provisional status retained:** Import/export and locally stored scores do not create teacher verification or authenticated academic credit.

### Regression checks performed

- Portal inline JavaScript syntax: PASS.
- Assessment engine syntax: PASS.
- Bank remains valid: 36 weeks, 180 instructional days, 925 questions, globally unique prompts, valid choices/indices/rationales.
- Engine logic simulation: 20 unique items per attempt; correct options stay aligned after answer shuffling; unanswered submission is rejected; 15/20 = 75% fails; 16/20 = 80% passes; 17/20 = 85% passes.
- In-progress answers remain available after reloading the attempt from local storage.
- Submitted attempts reject resubmission/modification; snapshots remain explicitly unverified.
- Portal source wiring contains the 80% gate, sequential next-week lock, Week 18 midterm prerequisite, and final prerequisite requiring all 36 validated weeks plus approved midterm state.

### Validation boundary

This pass includes source checks and logic-level simulations, **not a live browser/device regression**. The remaining live checks are mouse/keyboard interaction, small-screen layout, storage quota/disabled-storage handling, reload through the actual hosted page, and export/import using a real downloaded file. Local browser storage is not tamper-proof and remains provisional evidence. Teacher review and formal approval are still separate.

---

**Surface:** `courses/physical-education/index.html`  
**Latest portal gate-fix commit:** `d709135256e72591cff943f2d9e4d43dfca5b6bf`  
**Latest Grade 9 item-bank diversity commit:** `f05b65a414d93bf286634222cc14487f91475cc9`

## Latest pass — Grade 9 assessment diversity

### Changes applied

- Replaced the first five generic/repeated weekly assessment prompts for **Weeks 9–36** with 140 topic-derived questions across varied forms: applied planning, constrained decision-making, evidence quality, misconception correction, success criteria, accessible adaptations, safety responses, and limits of conclusions.
- Generated each revised set using the relevant week's title, focus skill, misconception, and correction rather than applying a global template without regard to subject matter.
- Balanced the correct option positions across the 140 new items: **47 / 47 / 46** across the three answer positions before runtime answer shuffling.
- Left the remaining 20 items per week and the complete Weeks 1–8 banks intact.
- Kept the 80% mastery policy unchanged. The portal still selects 20 questions for a Grade 9 attempt, shuffles question order and answer order, and saves attempt snapshots.
- Maintained the separate Grade 10–12 preview pathway. Their generic formative checks cannot issue mastery or unlock progression.
- Kept Grade 9 midterm readiness tied to validated weekly completion. A saved exam draft remains unverified and cannot count as teacher approval for final eligibility.

## Data and wiring validation

- 36 weekly units; five instructional days per week (180 days).
- 925 total items in the Grade 9 banks. Weeks 1–5 contain 30 items each; Weeks 6–36 contain 25 items each.
- All 925 prompts are unique across the Grade 9 bank. Every week has unique prompts within its bank.
- Every item has three distinct choices, a valid correct-choice index and a non-empty rationale.
- The 140 revised items contain 140 unique prompts and balanced stored answer positions.
- Source syntax checks passed for the portal and assessment engine.
- A logic-level simulation selected 20 unique questions from each of the 36 weekly banks successfully. This was not a live browser/device regression.

## Remaining priorities

1. **Live browser regression.** Exercise first attempts, unanswered questions, failed retakes, passed attempts, reload/resume, export/import, and next-week locking on desktop and tablet. Verify saved attempts remain immutable after submission.
2. **Pedagogical review of question quality.** Structural checks do not prove distractor quality, reading-level suitability, or scientific validity. A teacher should review a sample from every week, especially safety and health-related items, before formal use.
3. **Develop Grades 10–12 as full courses.** Replace outline-only topics and three-question formative checks with grade-specific weekly lessons, larger reviewed question banks, practical evidence, rubrics, and controlled mastery gates.

## Scope and safety

- Student records remain browser-local unless deliberately exported by the learner.
- Local scores and journals are learning evidence, not authenticated teacher approval, transcript credit, or enrollment records.
- Pre-K remains a separate repository and developmentally distinct PE program: `Khaemenes_Preschool.github.io`.
- This status describes source review and logic-level checks, not formal standards certification or live-browser testing.
