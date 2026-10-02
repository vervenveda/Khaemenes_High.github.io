# Khaemenes Academy High School · Grade 09 Instructional Hardening

Date: 2026-09-10
Authority snapshot: STOS Repository Storage export `Khaemenes-High-1789014663854.zip`
Source ZIP SHA-256: `db5c74abca00245539d287355a5c031b9aff2c16908b8d551650ddff56859577`

## Scope boundary

This pass hardens the priority issues discovered by the Grade-09 daily-lesson/tool/video/game deep dive. The Pre-Algebra game/video expansion work is intentionally deferred because that content is still being authored. The complete `courses/mathematics/pre-algebra/` tree was preserved byte-for-byte from the STOS source snapshot.

The STOS Directory and Repository Storage remain separate authorities within the same system. This package changes Khaemenes High repository content only; it does not prescribe or relocate STOS Directory placement.

## Completed hardening

### English 9
- Preserved the existing authored Weeks 1–27 architecture.
- Added daily guided-transfer and exit-evidence layers to all 75 lesson days in Weeks 13–27.
- Rebuilt Days 136–180 (Weeks 28–36) from short pacing summaries into full daily lessons with learning target, mini-lesson, guided practice, independent evidence, and exit evidence.
- Hardened all 62 optional video placements: 57 unique videos, privacy-enhanced embeds, lazy loading, no autoplay permission, explicit written equivalent, and conservative transcript/caption status.
- Added `data/video-accessibility-manifest.json`, `tools/validate-daily-instruction.mjs`, and `tools/validate-media-accessibility.mjs`.
- Public ARSHIF lesson routing was replaced with the sovereign `/stos/arshif/` route where applicable.

### Global Studies Honors
- Corrected Week 27 packet routing to `student-packet-v2.html` in runtime and canonical week index.
- Replaced Weeks 26–27 public-host simulator reliance with self-contained local vanilla-JS economic/history models.
- Added a local Historical Systems Laboratory and activated its week-aware integration in the official app.
- Added a sovereign resource gateway for ARSHIF, ProResource, Verifier, and optional civic-transfer seams; the course never silently falls back to a public executable dependency.
- Removed automatic public beta-widget acquisition.
- Declared 25 runtime integrations active and 32 legacy/source-generation integrations retained but not runtime; retained scripts remain in Repository Storage for provenance but are no longer silently cached as required runtime.
- Corrected hidden midterm/final `passingTarget` values from 70 to the canonical 80 percent mastery threshold.
- The assessment forensic gate remains 360 objective prompts, 36 constructed responses, balanced answer positions 90/90/90/90, zero warnings, zero failures.

### Psychology 101
- Replaced 44 generic scaffold placeholders across 23 lessons with lesson/section-specific evidence and inquiry tasks.
- Individualized the repeated independent-application check across 45 lessons while preserving answer logic.
- Existing production gate still certifies 65 lessons, 325 daily-review items, 13 weekly assessments, 3 cumulative assessments, and 2,495 checks with zero failures.

### Algebra I / Integrated Mathematics I
- Made student-facing course identity placement-aware for Grades 9–10 instead of presenting every learner as Grade 10.
- Individualized objectives and Foundation/Core/Extended pathway language across all 87 lessons.
- Added an 87/87 lesson resource map connecting each lesson to its unit project, applicable local lab, application prompt, and differentiated pathways.
- Added a lesson resource bridge without fabricating unfinished games/videos.
- Removed exact duplicate prompt text in Units 1–10: 345 base checks across 69 lessons now have 345 distinct prompt framings while preserving options, keyed answers, explanations, and existing mastery architecture.
- Added placement/connectivity and question-diversity validators.

### Integrated Science 9
- Preserved the 180-day course architecture.
- Added a machine-readable lesson-tool registry covering all 180 official days.
- Registry identifies 20 direct local investigation connections across 20 lesson days, including the SA:V model, labs, simulators, data tools, and performance tasks.
- Added a human-readable Local Investigation Registry and a validator.

## Explicitly deferred

### Pre-Algebra companion expansion
No new games or videos were added to Units 4–13. No existing Pre-Algebra game/video mapping was changed. The entire 688-file Pre-Algebra tree remains byte-for-byte identical to the STOS source snapshot. Existing Pre-Algebra validators were still run as regression gates and all passed.

Caption/transcript verification for the existing Mathematics video assets is also deferred with this authoring seam so the Math media registry is not changed while game/video work is in progress.

## Final validation status

- 36 release/forensic validation commands: **36 PASS / 0 FAIL**.
- Entire repository JSON parse gate: **PASS**.
- Entire repository JS/MJS syntax gate: **PASS**.
- Grade-09 local href/src resolution gate: **PASS**.
- Grade-09 case-fold namespace gate: **PASS**.
- Automatic remote script/stylesheet dependency gate: **PASS**.
- Pre-Algebra preservation gate: **PASS — zero changed files**.

The external package seal supplied with the downloadable ZIP records the final archive SHA-256, canonical content hash, file count, and archive-integrity result.
