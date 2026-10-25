# Algebra I Post-Capstone Forensic Reaudit — Five New Bubbles — 2026-10-25

**Audit baseline:** current `main` at `15084509d9eb477b585cbade3cfa73e001dc9de8`  
**Current validation state:** Algebra I Browser Regression, Whole-Course Validation, Responsive + Deep Lesson Validation, Student Experience Validation, and High School Mathematics Lesson Launch Validation are green on the current documentation head.

This pass begins only after the first five late-unit/capstone bubbles were closed. It intentionally looks beyond the already-certified Unit 01–13 mastery runtime and asks where cumulative assessment and course-completion evidence are still weaker than the architecture beneath them.

## New Bubble 1 — Midterm and Final selected-response retakes are fixed forms, not abundant Monte Carlo forms

The cumulative assessments embed their complete selected-response forms directly in:

- `assessments/midterm-units-01-06.html` — 60 delivered / 60 authored
- `assessments/final-exam-36-weeks.html` — 100 delivered / 100 authored

`assets/exam-engine.js` renders `C.questions` directly on every attempt. Resetting an assessment clears the draft but recreates the same question set.

Visible option order is also deterministic:
`optionOrder(q,i)` hashes only `${C.id}:${i}:options-v2`.

Therefore:
- a retake receives the same questions;
- the same question indexes are reused;
- the same option ordering is reconstructed;
- no abundance pool exists beyond the delivered form.

This is a direct cumulative-assessment version of the Monte Carlo problem previously repaired in unit mastery.

### Upgrade boundary

Create abundant cumulative banks and blueprint-balanced form generation:
- Midterm: deliver 60 from a substantially larger eligible pool;
- Final: deliver 100 from a substantially larger eligible pool;
- preserve unit/domain weighting;
- unseen-first low-overlap retakes;
- stable item IDs, form seed/version, source metadata, and offline support.

## New Bubble 2 — “Human-reviewed” Midterm/Final mastery has no evaluator identity or attestation inside the exam evidence

`assets/exam-engine.js` allows the evaluator panel to save numeric scores for each constructed response.

The resulting attempt records:
`evaluator_review.classification = "local-human-review"`
and
`constructed_response.review_complete = true`.

But it does not capture:
- evaluator name;
- evaluator role/credential;
- evaluator attestation;
- review note;
- review record ID.

`assets/mastery-authority-v1.js` treats a cumulative attempt as reviewed mastery when:

- `mastery===true`;
- `legacy_selected_only!==true`;
- `constructed_response.review_complete===true`.

No evaluator identity is required by that authority rule.

This matters before the final certificate: reviewed Midterm mastery is a prerequisite for Units 07–13, so a browser user can currently enter the constructed-response rubric scores and satisfy the “human-reviewed” progression flag without a reviewer identity record.

### Upgrade boundary

Make evaluator review a versioned evidence object with:
- evaluator/issuer name;
- role;
- explicit attestation;
- review timestamp;
- optional notes;
- a stable review record ID;
- fail-closed authority checks.

Do not claim authentication; continue to label the record browser-local and editable.

## New Bubble 3 — Cumulative selected-response attempts do not preserve reconstructable answer-level evidence

The modern unit mastery system stores immutable answer snapshots with selected/correct original and displayed indexes, option order, item IDs, form metadata, sources, and misconception metadata.

The cumulative `selectedResult()` record does not store equivalent selected-response detail.

It stores aggregate fields such as:
- score;
- total;
- percent;
- breakdown;
- mastery status.

The selected choices remain only in the current draft key. When the draft is reset, the scored attempt history does not retain an answer snapshot.

As a result, a historical Midterm/Final attempt cannot independently reconstruct:
- which option the learner selected on each item;
- the displayed option order;
- per-item correctness;
- item IDs;
- form/bank version;
- form seed;
- selection policy.

### Upgrade boundary

Bring cumulative evidence to parity with `algebra1-answer-evidence-v2` or a cumulative v3 derivative:
- stable item IDs;
- per-answer snapshots;
- original/display indexes;
- selected/correct text;
- option order;
- form version/bank version/selection policy;
- attempt number and form seed;
- immutable historical attempts.

## New Bubble 4 — Midterm and Final selected-response banks are shallow, duplicated, and unevenly weighted

Fresh measurements from the embedded cumulative banks:

### Midterm
- 60 questions total
- Unit weighting: exactly 10 each for Units 01–06
- difficulty 1: **41/60**
- difficulty 2: **13/60**
- difficulty 3: **6/60**
- unique prompt texts: **53/60**
- **11 items** belong to exact duplicate-prompt groups
- four exact duplicate-prompt groups

Largest duplicate:
- “Which relation is not a function?” appears **4 times**.

### Final
- 100 questions total
- Unit 01: **15**
- Units 02–12: **7 each**
- Unit 13: **8**
- difficulty 1: **74/100**
- difficulty 2: **15/100**
- difficulty 3: **11/100**
- unique prompt texts: **88/100**
- **18 items** belong to exact duplicate-prompt groups
- six exact duplicate-prompt groups

The final therefore gives Unit 01 more than twice the selected-response weight of most other units.

The current Unit 13 final selected-response contribution is especially weak relative to the newly certified capstone:
- 8 Unit 13 selected-response items;
- only three distinct prompt concepts dominate them;
- “Strong first step in modelling?” appears 3 times;
- “What does sensitivity analysis test?” appears 3 times;
- “Most defensible conclusion?” appears 2 times.

The constructed-response portion is substantially deeper, but the selected-response half has not caught up to the course’s current difficulty and modelling architecture.

### Upgrade boundary

Rebuild cumulative blueprint quality before expanding the bank:
- explicit per-unit/domain weighting;
- difficulty floor/target;
- no exact prompt duplicates on a delivered form;
- stronger Units 10–13 representation;
- quantitative Unit 13 capstone items in the Final;
- validator-enforced blueprint distributions.

## New Bubble 5 — The capstone completion gate is a typed scalar, not a structured project-evaluation record

The Unit 13 project now contains strong portfolio/oral-defence requirements, but the project page does not persist an evaluator rubric result.

The course completion record currently accepts:
`capstonePass = numeric(fields.capstone) >= 80`.

The completion page does require:
- evaluator identity;
- completion date;
- evaluator attestation;
- all unit/weekly/cumulative gates.

However, the capstone itself is still represented only by a manually typed percentage.

The following are not required for the capstone gate:
- rubric-category scores;
- oral-defence result;
- project evaluation timestamp;
- linked portfolio/evidence record;
- portfolio record ID (the field exists but is not a completion requirement);
- structured revision/sensitivity/fairness evidence.

This creates a mismatch between the sophisticated Unit 13 project requirements and the evidence actually consumed by course completion.

### Upgrade boundary

Create a local structured capstone evaluation record:
- rubric categories totaling 100;
- evaluator identity/attestation;
- portfolio record ID;
- oral-defence completion;
- required evidence checklist;
- score >=80;
- export/import;
- course-completion gate reads this record instead of an unlinked scalar.

## Additional diagnostic — Unit 13 quantitative retake horizon

Not counted as one of the five bubbles above, but worth preserving for the next pass:

Unit 13 currently has 20 dedicated capstone-depth items and requires exactly 10 per form, two per lesson. Because each lesson has four depth items and an immediate retake must avoid the prior two, the second attempt necessarily uses the complementary two depth items per lesson. A third immediate retake can then reuse the first depth pair.

The current contract correctly guarantees **0/20 immediate prior-form overlap**, but it does not guarantee long-horizon novelty across more than two Unit 13 attempts.

This should be considered when Bubble 1 expands cumulative abundance and when future Unit 13 banks move toward the preferred 3× abundance standard for each protected blueprint strand.

## Recommended repair order

1. **Bubble 2 — evaluator review identity/attestation.** This is an authority/progression issue.
2. **Bubble 3 — cumulative answer-level evidence parity.** Historical exam evidence should be reconstructable before form randomization expands.
3. **Bubble 4 — rebuild cumulative blueprints and remove duplicate/shallow weighting.**
4. **Bubble 1 — add abundant Monte Carlo Midterm/Final pools after the blueprint is trustworthy.**
5. **Bubble 5 — structured capstone evaluator record tied into completion.**

The order deliberately separates assessment authority, evidence integrity, bank quality, randomized delivery, and capstone completion evidence so each can be tested independently.
