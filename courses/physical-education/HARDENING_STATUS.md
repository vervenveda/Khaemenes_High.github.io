# Curriculum-validity and learner-journey pass — Grade 9 PE Week 9 — 2026-10-19

**Scope:** Week 9, “Movement skill feedback,” in `grade-09-instruction.json`; the Grade 9 course portal remains separate from the reading portal.

### Repair applied

- Replaced Week 9's generic feedback lesson frame with a focused essential question, scenario, and worked model about observable, respectful, consent-aware movement feedback.
- Added the missing week-level concept explanation, technique/observation principles, worked example, and application task.
- Expanded all five daily lessons (Investigate → Demonstrate → Apply → Analyze → Defend) with a topic-specific example, independent task, and explicit success criteria.
- Emphasized observation versus interpretation, consent before feedback or touch, privacy, accessible alternatives, safe stop cues, and limitations of small samples.
- Preserved the existing 25-question Week 9 knowledge bank, its answer/rationale records, the 20-point teacher-reviewed rubric, and its 16/20 (80%) evidence threshold. No mastery policy or portal/reader crossover was introduced.
- Added the Week 9 instructional-depth assertions to the browser regression runner while preserving the 36-week / 925-item bank checks.

### Validation completed

- Instruction JSON parses and the Week 9 record reloads from `main`.
- Five daily lessons each contain instruction, practice, evidence, worked example, independent task and success criteria.
- Week-level instructional-depth fields and 20-point rubric / 16-point passing threshold are present.
- The course portal source already renders these optional week/day fields; the separate reading portal remains untouched.
- Existing question bank count remains 25; prior question data was preserved during the targeted edit.

### Validation boundary

The regression checks were added to the deployed runner source but have **not been executed inside a live browser session here**. After Pages deploys, open `assessment-regression.html` and run the checks, then manually test Week 9 day navigation, learner journal submission, reload/resume, quiz retry, keyboard access and tablet width. This is a source-and-data validation, not formal standards certification or a live visual sign-off.

### Commits

- Curriculum depth repair: `50d35ef6959867bb955bf6897713850adceed54f`
- Week 9 regression coverage: `4987b63174e85687f786112867f074432cae2185`

---

# High School Physical Education Hardening Status

## Fresh forensic pass — Grade 9 Week 1 assessment journey — 2026-10-19

**Scope:** Grade 9 PE student assessment path and its adjacent supplemental Week 1 practice resources. The separate reading resource was not merged into the class portal.

### Bubbles identified and repaired

1. **Daily check answer-position bias and low-value feedback.** The active five-day Grade 9 Week 1 bank stored all 25 daily questions with the correct response at option A and repeated one generic rationale. Correct responses are now balanced within each five-question day (2/2/1 across A/B/C) and within the 20-question weekly check (7/7/6). Options were reordered while retaining the correct answer, and each of the 45 daily/weekly items now has its own rationale grounded in the prompt and correct response.
2. **Separate 30-question Week 1 randomized practice bank.** The bank previously used correct answer positions 21/9/0 across A/B/C. It now uses 10/10/10, with all 30 prompts and 30 rationales retained. The practice bank remains distinct from the daily evidence record and the main Grade 9 course path.
3. **Lost in-progress daily attempts and no failed-weekly retry.** The standalone daily assessment page now stores randomized question order, option order, selected answers and the reflection draft in a separate local session key. Reloading can resume the unfinished attempt. A weekly result below 80% exposes a retry path; each submitted weekly attempt is retained in `weeklyAttempts`, and the latest result remains the current result. Daily submissions stay read-only after submission.
4. **Discoverability.** The PE landing page now names and links the supplemental Grade 9 Week 1 Daily Checks separately from the randomized practice studio, avoiding a hidden/unreachable utility and making its supplemental nature explicit.
5. **Regression coverage.** The browser regression runner now checks the real daily and weekly banks for counts, completeness, unique prompts, varied rationales and balanced answer positions. It also checks the separate 30-question bank and verifies that draft persistence and retry wiring remain present in the deployed daily assessment source.

### Checks performed after the patch

- Updated daily assessment page inline JavaScript syntax: PASS.
- Updated regression runner inline JavaScript syntax: PASS.
- Daily assessment data: 5 daily sections × 5 questions, 20 weekly questions; 45 unique prompts across daily + weekly checks; 45 unique rationales.
- Daily answer positions: each five-question day is 2/2/1 across A/B/C. Weekly answer positions are 7/7/6.
- Randomized practice bank: 30 unique prompts, 30 unique rationales, answer positions balanced 10/10/10.
- Source wiring for saved answers, saved reflection drafts, immutable daily submissions, retry button, retained weekly attempts and landing-page link: PASS.
- Assessment-engine threshold, randomized alignment, attempt immutability and provisional review checks remain covered by the regression runner.

### Validation boundary and remaining next bubble

This is a source/logic audit; **a live browser/device run has not been completed here**. After deployment, run the regression page and manually test a refresh mid-day, a 75% weekly attempt, a retry at 80%, export, keyboard use and a narrow tablet viewport. The next content-quality bubble is independent teacher review of a sample from each Grade 9 week: balanced answer positions and structurally valid items do not by themselves prove distractor quality, reading-level fit or instructional validity.

**Commits for this pass (main):**
- Grade 9 daily + weekly bank rationale/position repair: `0a6a3774cdc0dea7805a672cc8e8187263786f80`
- Separate 30-question bank answer-position repair: `3441a78653f842470f6079609bc2e3d6b3e6931d`
- Daily session persistence and weekly retry: `7ab3377893473bd5af30096ab65696d0c1e50532`, `675ac5e74c14c0de94c451029a0e595d5ea97ea0`
- Regression runner real-bank checks: `8b79fc1b8c895fba9b1f2ef6be4838446b42e36b`
- Supplemental practice link: `1616b9b8a3933c9a552c0e6e00eb2bb88c2f4b3b`

---

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

## Course-wide question-bank hardening — Grade 9 PE — 2026-10-19

**Scope:** `courses/physical-education/grade-09-instruction.json`, the 36-week Grade 9 PE instruction bank, and `assessment-regression.html`. The separate reading portal and assessment experience remain separate; no lesson/reader merger was performed.

### Repairs applied

- Rebalanced the correct-answer positions across all 36 weeks. For 30-question banks, the stored key now distributes 10 correct choices to each of A/B/C. For 25-question banks, the distribution is 9/8/8 in a deterministic shuffled sequence.
- Preserved each original prompt, the intended correct answer text, and the existing rationale while reordering choices and updating the correct index in a coordinated change.
- Rewrote the repeated rationale clusters in Weeks 1, 2, 4 and 6 so that all questions in those banks have question-specific explanations.
- Added individually authored, concept-specific rationales for all 30 Week 3 questions and all 25 questions in each of Weeks 7 and 8.
- Extended the regression runner to fetch and validate the full instruction bank, including grade/mastery metadata, 36-week sequencing, required question counts, three-option structure, in-range answer indices, unique prompts, unique nonblank rationales, balanced answer positions and total question count.

### Validation completed

- Instruction bank parses as JSON.
- 36 weeks validated in sequential order.
- Total: 925 questions (Weeks 1–5: 30 each; Weeks 6–36: 25 each).
- All 925 prompts are unique within their respective week banks; all 925 rationales are nonblank and unique within their respective week banks.
- All weeks pass correct-answer position balance: max difference between A/B/C counts is no more than 1.
- Weeks 1–5 have 10/10/10 distribution; Weeks 6–36 have 9/8/8 distribution.
- When choices were rebalanced, the originally intended answer text was checked to remain at the newly stored correct index.
- Regression runner now includes an automated full-course bank check alongside existing assessment-engine and Week 1 daily/practice checks.

### Verification boundary and next priority

This pass is **source/data validation**, not a completed live browser/device test. The regression runner must still be opened on the deployed site and run after Pages serves the updated assets. Manually check keyboard navigation, a tablet-width viewport, a reload during an unfinished attempt, weekly retry after a score below 80%, an 80% passing attempt, export/import, and the course's official progression/lock flow.

Balanced keys and distinct rationales do not establish that every distractor is equally plausible, every item is free of ambiguity, or every explanation is pedagogically optimal. The next content-quality pass should sample each week's items against the lesson objectives and check reading level, accessibility, physiological accuracy and suitability of distractors. Keep the 80% mastery threshold and teacher-review boundary intact.

### Commits for this pass (main)

- Weeks 3, 7 and 8 rationale/answer-position repair: `90dcdf62bf88e1a3a2edf8b3d2f73332a14479c8`
- Weeks 9–12 answer-position repair: `9d286811dfb15517ce1f16453d525d55608a37da`
- Weeks 13–16 answer-position repair: `506a288047d03327ab39097d074362b9f038cbcf`
- Weeks 17–20 answer-position repair: `1a678db777149ff84c07ae69b79fc6c252ff7958`
- Weeks 21–24 answer-position repair: `3e979b1b6d49831fbb8ac19790d9b22836cd27b5`
- Weeks 25–28 answer-position repair: `6974e5321b8b02a5d2f6399b03e317e5286ae6a9`
- Weeks 29–32 answer-position repair: `45a2d25e39db259697d80237d71ccb14207d05b5`
- Weeks 33–36 answer-position repair: `eb3985eed5ff8f6984ebad39f6f27cb1cf6f6c5b`
- Weeks 1, 2, 4 and 6 rationale/answer-position repair: `9a6a707f441e8daec980a07bc7f1b756d09cd13d`
- Full-course question-bank regression checks: `c54dda0aac8ad39eb121d85d8eb4b6998a4e74ea`

## Grade 9 Week 10 curriculum-validity and learner-journey pass — 2026-10-19

**Scope:** Week 10, “Recreation and inclusive games,” in `grade-09-instruction.json`. The separate mini-textbook reader remains independent; assessment threshold and engine behavior were not changed.

### Findings and repairs

- Confirmed the week provides five sequenced instructional days, each with instruction/practice/evidence/success criteria, a worked model, misconception correction, inclusion-aware teacher notes, a 20-point rubric, a 16/20 performance-evidence threshold, and 25 weekly knowledge-check items.
- Strengthened five assessment items (items 4, 7, 15, 17, and 20) to use clearer, scenario-led decisions and plausible alternatives rather than overly obvious distractors or generic prompts.
- Kept each correct answer paired with its correct rationale and preserved its answer position while editing the item; the 25-item key remains balanced at 9/8/8 across the three answer positions.
- Preserved the Grade 9 80% weekly knowledge gate, independent practice/reflection requirements, teacher-review boundary, and existing standalone reading portal.
- Standards mapping remains flagged for teacher review; indicator codes use the SHAPE America 2024 Grades 9–12+ indicator span and should not be described as state-specific approval.

### Verification

- Updated instruction JSON parses successfully.
- Week 10 still has 25 checks, three distinct options per item, valid answer indices, unique prompts, and non-empty unique rationales.
- Correct-answer distribution remains balanced: 9 / 8 / 8.
- Five-day instructional sequence and practical assessment/rubric structures were preserved.
- Source/data inspection only; a live browser walkthrough on the deployed Pages site is still required for reload/resume, retries, export/import, and next-week unlocking.

### Commit

- Week 10 assessment validity repair: `03a1732c54eacdf7526b14ea7394a1cb6229e22f`



## Grade 9 Week 11 curriculum-validity and learner-journey pass — 2026-10-19

**Scope:** Week 11, “Hydration and environmental safety,” in `grade-09-instruction.json`. The separate reading portal remains independent. This pass does not change the assessment engine, local progress format, or 80% mastery gate.

### Findings and repairs

- The five-day sequence already taught environmental-condition checks, water access and breaks, stop cues, plan comparison, and an actionable safety brief; its 20-point practical rubric and 16/20 evidence threshold were retained.
- Replaced the first five generic assessment prompts with scenario-based decisions directly targeting heat advisories, dizziness/stop cues, unreliable water and shade access, conditions changing mid-session, and inclusive route adaptation.
- Each revised item includes plausible but clearly inferior alternatives and a topic-specific rationale. The intended correct answer remains at the original index for each revised item.
- Preserved the 25-question bank and the balanced correct-answer distribution of 9/8/8 across options A/B/C.
- Extended `assessment-regression.html` with Week 11 checks for required instructional-depth fields, five complete days, the 20-point rubric and 80% practical threshold, question count, scenario relevance, prompt/rationale uniqueness, and answer-position distribution.
- Safety content remains educational, not diagnostic: it directs learners to stop and seek appropriate adult or emergency help for concerning symptoms and avoids universal fluid prescriptions or forced exercise.

### Verification boundary

Source-level validation confirms the revised data remains structurally consistent and preserves the 80% mastery policy. The regression runner's new checks have been committed, but they must still be executed in a browser on the deployed Pages site to claim a live-run pass. The pre-existing teacher-review boundary for standards mapping remains in place.

### Commits

- Week 11 assessment validity repair: `4f7cf7414a19b44c2fd4192649bbcb8b4a39928e`
- Week 11 curriculum regression checks: `ef9e6413944005cfdd0abc3b8bed0556d4913104`

### Next bounded pass

Continue to Week 12, “Teamwork and fair play,” checking that the instruction teaches conflict resolution, role clarity, inclusive collaboration and fair-play decisions before the weekly knowledge check measures them. Preserve the same lesson/assessment separation, practical-evidence rubric, and 80% knowledge mastery gate.
