# English 9 · Creative Spark Integrity Pilot

**Date:** 2026-08-16  
**Branch:** `hardening/archaemenes-highschool`  
**Status:** SOURCE-STAGED PILOT — not browser/runtime certified

## Purpose

This pilot prepares English 9 to emit a privacy-safe structural integrity evidence packet that can later be consumed by the shared Creative Spark education-integrity layer.

The pilot does **not** make the private Creative Spark repository a browser dependency and does not replace the existing local English 9 forensic audit.

## Existing local evidence source

`assets/english9-forensic-audit.js` produces:

- weekly/midterm/final item counts;
- choice-count issues;
- duplicate visible-choice findings;
- answer-index validity findings;
- answer-position distribution;
- exact duplicate prompt groups;
- weekly-to-midterm/final exact overlap counts.

The local audit remains the first-line course-specific harness during the pilot.

## New adapter

`assets/english9-integrity-evidence.js` reads the local audit result after the iframe course runtime is available and publishes a sanitized packet at:

`window.__KHAEMENES_ENGLISH9_INTEGRITY_PACKET__`

It also dispatches:

`khaemenes:integrity-evidence`

## Contract

The packet identifies:

- contract: `khaemenes.learning-integrity-evidence`
- contract version: 1
- producer: Khaemenes High School
- course: `english-09`
- grade: 09
- mastery target: 80%
- assessment counts
- structural issue types and locations
- exact duplicate-group locations without prompt text
- answer-position counts
- weekly/midterm/final overlap counts

## Privacy boundary

The packet intentionally excludes:

- learner names;
- learner IDs;
- family IDs;
- raw learner answers;
- assessment prompt text;
- credentials or tokens;
- private routing information;
- sensitive learner profiles.

`networkTransport` is declared false in this pilot. The adapter publishes only within the current page runtime.

## Authority boundary

The adapter cannot:

- award mastery;
- change formal placement;
- change learner identity;
- route mentors;
- alter Family Registry records.

English 9 course rules retain formal 80% mastery authority. Archaemenes remains a mentor, not grader or placement authority.

## Creative Spark status

Creative Spark is private. Its education-integrity package was previously staged with assessment-integrity, evidence-contract, learner-state-audit, and course-audit-engine modules, but the current private API signatures have not been re-read from this connection after privatization.

Therefore this pilot does not claim direct Creative Spark runtime compatibility yet. It establishes a minimal, sanitized handoff contract without coupling the public High School browser runtime to a private repository.

## Validation still required

Before this pilot is considered integrated:

1. inspect the current private Creative Spark education and integrity APIs when authorized access is available;
2. compare this packet contract against those exact signatures;
3. run the English 9 forensic audit in a browser and record actual output;
4. feed the sanitized packet through the shared integrity engine in a controlled environment;
5. compare local and shared structural findings;
6. verify that no learner-specific information crosses the boundary;
7. retain the local audit until the shared service proves equivalent or stronger.

## Current verdict

**English 9 now has the same privacy-safe integrity evidence boundary as the Global Studies 9 pilot. This is a source-staged interoperability layer only; it is not evidence of live Creative Spark execution or browser validation.**
