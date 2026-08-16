# Khaemenes Academy Evidence-Aware Grading Protocol v1

**Status:** Grade 09 hardening pilot  
**Date:** 2026-08-16  
**Scope:** Constructed response, evidence-backed analysis, research tasks, source evaluation, and answer-key review support.

## Purpose

This protocol adds evidence integrity to grading without allowing an automated verifier to become the final academic authority.

The evidence layer may inform feedback, identify weak or contradictory support, and place an assessment item or learner response into review. It must not silently change a score, answer key, mastery state, learner identity, or formal placement.

## Default evidence-aware rubric

| Dimension | Weight |
|---|---:|
| Content understanding | 40% |
| Evidence quality | 20% |
| Source reliability | 15% |
| Claim/evidence alignment | 10% |
| Citation integrity | 10% |
| Epistemic honesty | 5% |

`Epistemic honesty` rewards accurate statements of uncertainty, limitations, disagreement, and the distinction among fact, inference, interpretation, and opinion.

## Evidence dispositions

### Clear

HTURT-aligned result states `verified`, `strongly-supported`, and `supported` may allow the evidence component of a rubric to proceed normally.

### Review

`partially-supported`, `contested`, `disputed`, `unverified`, `insufficient-evidence`, `unresolved`, and `opinion-or-interpretation` require contextual review before the evidence result is used against the learner.

### Hold

`unsupported`, `misleading`, `false`, and `historically-anachronistic` create a review hold when they materially affect the answer key or factual basis of a graded response.

A hold does **not** automatically mark the learner wrong. It freezes the disputed evidence-dependent decision for review.

## Challenge-the-key protocol

When a learner response conflicts with the stored answer key but presents material evidence that challenges the key:

1. preserve the learner's submitted response and original score state;
2. create an `answer-key-review-hold` record;
3. do not silently alter the answer key or score;
4. review the underlying factual claim, source provenance, chronology, source independence, contradictory evidence, and uncertainty;
5. resolve the item through governed academic review;
6. if the item was defective, correct the item and apply reassessment or score remediation consistently to affected learners.

## Privacy boundary

The browser-side review queue stores only compact review metadata. It must not store credentials, private routing, hidden prompts, medical information, or highly sensitive learner data.

## Authority boundary

- Noema / HTURT evidence review informs evidentiary confidence.
- Creative Spark audits assessment structure.
- Archaemenes mentors and explains evidence/reasoning problems.
- The course assessment engine calculates formal mastery under Academy rules.
- Formal placement remains outside the evidence verifier.

## Current implementation

Shared assets:

- `assets/khaemenes-evidence-contract.js`
- `assets/khaemenes-evidence-generator.js`
- `assets/khaemenes-evidence-grading.js`
- `assets/khaemenes-evidence-review-queue.js`

Initial Grade 09 consumers:

- Global Studies Honors 9
- Integrated Science 9

## Validation status

This is a source-level hardening implementation. Browser execution, learner-switch isolation, review-queue lifecycle, keyboard/mobile behavior, and end-to-end protected evidence-service integration remain separate runtime validation requirements.
