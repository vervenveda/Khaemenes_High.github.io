# Khaemenes Evidence Integrity v1

**Branch:** `hardening/archaemenes-highschool`  
**Status:** Grade 09 pilot / pre-release  
**Date:** 2026-08-16

## Purpose

Khaemenes Evidence Integrity v1 defines the Academy-side contract for generating and receiving evidence-review requests under HTURT evidence principles without exposing protected Noema, HTURT, OHMIC, NAIB, authentication, routing, model, weighting, threshold, or backend implementation details.

The browser-side Academy layer is intentionally a contract and orchestration surface only. It does not claim to perform protected factual adjudication by itself.

## Public Academy components

- `assets/khaemenes-evidence-contract.js`
  - defines evidence-review requests and normalized review results;
  - defines the public evidence-state vocabulary;
  - strips the contract down to educational context, claim context, requested checks, privacy declarations, and authority boundaries.

- `assets/khaemenes-evidence-generator.js`
  - emits `khaemenes:evidence-review-request` events;
  - accepts sanitized review results through a normalized contract;
  - exposes an advisory grading interpretation;
  - never silently changes a grade.

## Authority boundary

Evidence review may:

- support instructional feedback;
- challenge an assessment key;
- trigger teacher or Academy review;
- identify uncertainty, contradiction, anachronism, or interpretation presented as fact.

Evidence review may not:

- silently alter a learner grade;
- award formal mastery by itself;
- change formal placement;
- change learner identity;
- expose protected backend implementation or private routing.

Formal mastery remains with course assessment rules. Formal placement remains with the Academy / Family Registry authority.

## HTURT-aligned public evidence states

The Academy contract supports:

- verified
- strongly-supported
- supported
- partially-supported
- contested
- disputed
- unverified
- unsupported
- misleading
- false
- opinion-or-interpretation
- historically-anachronistic
- insufficient-evidence
- unresolved

These labels describe evidentiary status and must not be treated as ideological approval or disapproval.

## Grade 09 pilot integrations

### Global Studies Honors 9

The existing structural-integrity packet is converted into a Khaemenes evidence-review request after the local forensic audit completes. The request contains structural counts and audit claims only. It contains no learner identity or raw learner answers.

### Integrated Science 9

The Academy-side science adapter creates a review request from the hardened science forensic runtime. The request explicitly preserves the current standalone midterm-score verification gap instead of inventing missing evidence.

## Protected-service boundary

This repository does not implement or document private Noema/HTURT/OHMIC service routes, credentials, prompts, source-weighting formulas, model internals, trust thresholds, or backend topology.

A future protected service may consume `khaemenes:evidence-review-request` and return a sanitized `khaemenes.evidence-review-result` object. Until that protected bridge is independently implemented and validated, the current Grade 09 work remains a source-staged contract pilot.

## Grading rule

A favorable evidence result may support awarded rubric points when the course rubric permits it. Contradictory, unsupported, unresolved, or contested evidence may trigger review. **No evidence result may silently change a recorded grade.**

This protects both directions of assessment integrity: the learner must support factual claims, and the Academy must be willing to re-examine its own answer key when credible evidence challenges it.
