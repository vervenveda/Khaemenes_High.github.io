# Social Studies Written-Evidence Progression Contract

## Purpose

A principal assignment may not satisfy weekly progression merely because a browser flag says it was submitted.

For Grades 10–12 and Grade 11 Personal Finance, written assignment evidence is considered complete only when:

1. the assignment is marked submitted; and
2. the saved assignment text contains a nonblank student response, evidence note, or note identifying a submitted attachment.

Grade 9 remains stricter: its learner-record authority also requires evaluator-scored principal assignments and evaluator scoring of the constructed response before weekly progression.

## Canonical helper

The active Grades 10–12 engines use:

```js
function assignmentEvidenceComplete(a){
  return !!a?.submitted && String(a.text || '').trim().length > 0;
}
```

The same definition is used for weekly mastery and assignment completion statistics.

## Submission behavior

New blank submissions are blocked at the submission handler.

If an older record contains `submitted: true` but has blank assignment text, that record does not satisfy the mastery gate after this contract is applied.

Saving a blank draft after a prior submission also removes that assignment from effective mastery because the gate evaluates the current persisted evidence, not the historical submission flag alone.

## Grade 12 graduation audit

Grade 12's 108-assignment completion gate uses the same substantive-evidence definition as weekly progression.

The weekly engine and graduation audit therefore cannot disagree about whether a principal assignment actually exists as evidence.

## Learner-facing language

Weekly rubric and lock messages must state that all three principal assignments require a written response, evidence note, or identified attachment before the week unlocks.

## Evaluator authority

This contract does not make browser text self-grading.

Constructed responses and other evaluator-reviewed components remain subject to the existing human-review boundaries. The contract only prevents empty evidence from being counted as completed work.
