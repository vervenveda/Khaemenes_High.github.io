# Khaemenes Academy · Distractor Quality & Misconception Mapping Contract v1

**Version:** 1.0  
**Status:** Active for newly authored and substantially revised selected-response assessment items  
**Scope:** Public/formative and blueprint-visible assessment banks. Protected secure items may implement the same contract inside the authorized assessment authority without exposing their content publicly.

## Purpose

A selected-response item is not high quality merely because it has one correct answer and three different wrong answers. Each distractor should represent a plausible error, misconception, overgeneralization, unit/operation mistake, source-reading error, or model limitation that an educator can recognize and use diagnostically.

This contract adds structured misconception metadata **without changing the learner-facing question, option order, keyed answer, historical score, or mastery threshold**.

## Required item-map record

A reviewed misconception-map entry must contain:

- stable `itemId`;
- `reviewStatus: "reviewed-v1"`;
- the bank's current `prompt` snapshot;
- the current keyed `answerIndex`;
- `correctRationale`;
- exactly one distractor record for every incorrect option;
- each distractor's `optionIndex`, current `optionText`, concise `misconceptionTag`, and educator-facing `rationale`;
- `reviewedAt` date and `reviewMethod`.

The companion map is keyed to the original bank item ID. It must not invent a second grading key.

## Distractor-quality rules

A distractor should:

1. be clearly wrong under the stated problem conditions;
2. remain plausible enough to reveal a recognizable reasoning error;
3. avoid trick wording that tests guessing rather than the target skill;
4. avoid absurd alternatives unless the item is explicitly a misconception screen;
5. avoid duplicating another option in substance;
6. have a rationale that explains the **reasoning error**, not merely "this is incorrect";
7. use the same units, notation, scope, and evidentiary frame as the question where appropriate;
8. avoid encoding protected learner traits or sensitive inferences.

Preferred misconception tags are short kebab-case labels such as:

- `inverse-operation-error`
- `sign-direction-error`
- `coefficient-exponent-confusion`
- `correlation-causation`
- `sample-selection-bias`
- `proton-neutron-confusion`
- `equilibrium-stops-misconception`
- `model-scope-error`

## Drift protection

The validator compares mapped `prompt`, `answerIndex`, and `optionText` values with the live bank. If the underlying item changes, the misconception map must be reviewed again rather than silently carrying an old rationale onto a new question.

## Coverage policy

Version 1 is intentionally staged.

- Newly authored or substantially revised selected-response items should ship with complete misconception mapping.
- Existing banks may be backfilled by reviewed tranches.
- Coverage percentage must be reported honestly.
- Missing mapping is a **WARN**, not an automatic grading failure, until a course declares the metadata mandatory.
- Once a course declares `distractorMappingRequired: true`, missing or drifted mapping becomes a **FAIL** for that course's audit.

## Security boundary

For protected supervised assessments, the public repository may state that the contract is required, but it must not publish protected prompts, options, keys, or distractor rationales if those details would expose confidential forms.

## Non-regression boundaries

This metadata layer must not:

- lower the Academy's 80% mastery floor;
- rewrite completed attempts;
- change a correct answer without an explicit bank revision;
- expose confidential secure-assessment content;
- replace teacher review of open responses;
- require a third-party service;
- weaken offline/local-first operation.

## v1 rollout

The initial reviewed tranche covers:

- Chemistry 11 legacy concept spine: 30 items / 90 distractor rationales;
- Algebra I unit anchors: 13 items / 39 distractor rationales.

That is **43 reviewed items / 129 distractor rationales** establishing year-spanning proof of the contract before broader backfill.
