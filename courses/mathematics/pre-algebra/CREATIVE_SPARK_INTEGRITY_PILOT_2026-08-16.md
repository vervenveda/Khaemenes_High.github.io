# Pre-Algebra Bridge — Shared Integrity Pilot

**Date:** 2026-08-16  
**Branch:** `hardening/archaemenes-highschool`  
**Status:** SOURCE-STAGED / PRIVATE SHARED-INTEGRITY CANDIDATE

## Purpose

This pilot prepares Pre-Algebra Bridge to hand sanitized assessment-integrity evidence to the private Creative Spark educational integrity layer without making that private repository a public browser dependency.

## Local audit remains authoritative for the pilot

`assets/prealgebra-forensic-audit.js` inspects the generated course banks after the repair, content-integrity, and duplicate-choice sanity layers have run.

It records:

- weekly / midterm / final assessment counts;
- four-choice structure;
- visible-choice collisions;
- answer-index validity;
- answer-position distribution;
- empty prompts or explanations;
- exact prompt duplicates;
- weekly-to-midterm/final exact overlap;
- non-finite/placeholder tokens such as `NaN`, `Infinity`, or `undefined`;
- zero denominators in visible mathematical text;
- the known generated rational-product invariant `2/3 × 3/n`, including reduced-form verification;
- upstream repair counts from duplicate-choice sanity and fraction simplification.

The result is exposed inside the course frame as:

`window.__KHAEMENES_PREALGEBRA_FORENSIC_AUDIT__`

## Sanitized evidence packet

`assets/prealgebra-integrity-evidence.js` converts the local audit into a privacy-safe evidence packet and exposes it in the wrapper as:

`window.__KHAEMENES_PREALGEBRA_INTEGRITY_PACKET__`

It also emits the event:

`khaemenes:integrity-evidence`

The packet includes only structural counts, issue types/locations, answer-position distribution, overlap counts, upstream repair counts, and the Academy's 80% mastery target.

It intentionally excludes:

- learner names or IDs;
- raw learner answers;
- assessment prompt text;
- passwords, tokens, private routing, or credentials;
- placement authority;
- mastery-award authority;
- mentor-routing authority.

## Why Creative Spark is not imported here

Creative Spark is private. The high-school browser page therefore does not import code from a private GitHub repository or depend on a private GitHub Pages deployment.

The intended next integration is controlled: server/internal service, build-time package/vendor step, or another authenticated mechanism after the exact current Creative Spark education and integrity APIs are verified.

## Important limit

This source-level audit does not establish that every generated mathematical item is semantically correct. The new invariant checks materially improve generated-space inspection, but a broader numeric/property-based verification pass and browser execution are still required before A+++ certification.

## Authority boundary

Creative Spark may inspect structural trustworthiness. It does not grade the learner, alter formal placement, mutate Family Registry identity, award mastery, or replace Archaemenes/NAIB responsibilities.
