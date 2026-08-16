# Global Studies 9 — Creative Spark Integrity Pilot

**Date:** 2026-08-16  
**Branch:** `hardening/archaemenes-highschool`  
**Status:** SOURCE-STAGED PILOT — no private cross-repository runtime dependency

## Purpose

Global Studies 9 is the first Grade 09 course staged for the shared Creative Spark educational-integrity architecture.

The pilot does **not** make Creative Spark the grader, placement authority, learner-identity authority, mentor router, or source of formal mastery. The course portal remains responsible for its own 80% mastery rules and learning evidence.

## Current source-staged bridge

The existing browser forensic harness produces:

`window.__KHAEMENES_GLOBAL9_FORENSIC_AUDIT__`

A new privacy-safe adapter now derives:

`window.__KHAEMENES_GLOBAL9_INTEGRITY_PACKET__`

and emits the local browser event:

`khaemenes:integrity-evidence`

The adapter is:

`assets/global9-integrity-evidence.js`

## Evidence contract

The packet includes only structural integrity evidence needed for a shared audit:

- course/grade identifier;
- mastery target metadata (80%);
- weekly/midterm/final assessment counts;
- structural issue types and locations;
- answer-position distribution;
- exact-prompt duplicate-group locations without prompt text;
- weekly-to-midterm/final exact-overlap counts;
- explicit authority and privacy declarations.

The packet intentionally excludes:

- learner name or learner ID;
- Family Registry identity data;
- raw learner answers;
- assessment prompt text;
- passwords, tokens, credentials, or private routing data.

## Authority boundary

The packet explicitly declares that the integrity consumer does not:

- award mastery;
- change placement;
- change learner identity;
- route mentors.

This preserves the Academy boundary: course portals produce academic evidence; shared integrity tooling examines structural trustworthiness; NAIB interprets learner needs and coordinates resources; Archaemenes/specialists mentor; Family/Academy systems retain formal placement authority.

## Private Creative Spark boundary

Creative Spark is private and is **not** loaded by this public browser page. There is no dynamic import, iframe, fetch, or anonymous browser dependency on the private repository.

The current connector could not read the private Creative Spark repository during this pass, so the exact current `education/` and `integrity/` API signatures were not re-verified. Therefore this adapter is deliberately neutral: it stages a stable sanitized evidence packet that a future controlled/internal Creative Spark integration can consume after API compatibility is verified.

## What is validated now

Source inspection confirms that the adapter:

- reads only the existing Global 9 forensic audit object;
- strips prompt text from duplicate-group evidence;
- carries no learner identity or raw answers;
- performs no network transport;
- has no formal academic authority;
- leaves the existing local forensic harness in place.

## What is not yet validated

This is not browser/runtime certification. Still required:

1. execute the course and confirm the evidence packet appears after the iframe forensic audit;
2. record the packet counts and answer-position distribution;
3. compare the local harness output with the eventual Creative Spark shared audit output;
4. re-verify current Creative Spark `course-audit-engine`, evidence contract, learner-state audit, bootstrap, and review-intake signatures from an authorized private connection;
5. only after agreement between both systems consider retiring duplicated local structural checks.

## Pilot rule

**Parallel first, replacement later.** The existing Global Studies forensic harness remains authoritative for the hardening branch until the shared integrity service is independently verified.
