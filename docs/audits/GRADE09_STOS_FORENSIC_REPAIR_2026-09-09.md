# Khaemenes High — Grade 09 STOS Forensic Repair Checkpoint

**Date:** 2026-09-09  
**Input:** `Khaemenes_High_Grade9_STOS_checkpoint_2026-09-09_final(1).zip`  
**Scope:** Grade 09 campus, English 9, Integrated Science 9, Global Studies Honors, Algebra I continuity, root offline/cache behavior, STOS-host portability.  
**Method:** repository inventory, static route/link resolution, runtime/validator inspection, JavaScript syntax checks, course-policy comparison, and existing course validators.

## Executive result

This checkpoint is **substantially strong but was not fully green at intake**. Five high-impact repairs were completed without changing the verified Pre-Algebra curriculum or its formal assessment files.

The repaired package now has:

- zero unresolved repository-relative links in the audited Grade 09 surfaces (intentional `/stos/...` and external destinations excluded);
- a passing Integrated Science 9 Unit 01 release validator;
- canonical Grade 9 Social Studies mastery metadata aligned to 80%;
- host-neutral Grade 09 core routes suitable for STOS/custom-domain/project-path deployment;
- a working Algebra I transition-contract page;
- a root service worker that refuses to cache teacher-only and answer-key paths.

## Repair 01 — Service-worker answer-key / teacher-cache boundary

### Finding
The root service worker precached Pre-Algebra unit `answer-key.json` files, teacher guides, and the consolidated assessment answer-key file. The runtime fetch path could also cache any same-origin GET response, including teacher-only resources.

That contradicted the repository's own service-worker security policy: private or authenticated responses should not be cached.

### Repair
- advanced root cache version to `khaemenes-high-design-v21-stos-forensic-20260909`;
- removed answer-key and teacher-only resources from the root precache list;
- added an explicit `shouldNeverCache()` deny rule for teacher, teacher-guide, teacher-key, answer-key, final-key, and midterm-key paths;
- sensitive requests now use a network `no-store` path rather than Cache Storage;
- the cache-version change causes old `khaemenes-high-*` caches to be removed during activation.

### Status
**GREEN** — no teacher/answer-key content is present in the root precache contract.

---

## Repair 02 — Grade 09 STOS route and catalog coherence

### Finding
The Grade 09 shell and student course registry contained fixed `/Khaemenes_High.github.io/` routes. Those work only under one deployment shape and can disconnect when the same repository is mounted by STOS, a custom server path, or local static testing.

The Grade 09 catalog also labeled implemented core courses as `planned`, while their actual course surfaces already existed.

### Repair
- converted the Grade 09 HTML shell/profile routes to repository-relative paths;
- changed the student-course registry to derive its repository base from the active pathname;
- preserved migration support for previously saved localStorage routes that still contain the old GitHub project prefix;
- marked the existing Pre-Algebra, Algebra I, English 9, Integrated Science 9, and Global Studies surfaces as `open`;
- added canonical IDs and explicit paths without deleting legacy catalog IDs;
- added portal/catalog aliases to the placement contract so existing consumers are not broken;
- updated the Grade 09 math-label validator for the host-neutral route contract;
- normalized affected Grade 09-facing author footers to `Jennifer Kay Pearl`.

### Status
**GREEN** — Grade 09 is no longer dependent on a fixed GitHub project-path prefix.

---

## Repair 03 — Integrated Science 9 navigation + Unit 01 release contract

### Finding
A systematic relative-depth error existed across Integrated Science unit pages: High School / Grade 09 breadcrumb links were one directory level short. The scoped audit found 126 directly broken href/src references; the broader correction touched 978 stale High School / Grade 09 link occurrences across affected Science unit pages.

The Unit 01 release validator also blocked release on four checks. Three were validator/contract drift rather than broken instructional logic:

- the dashboard used valid `<strong>17</strong><span>Mastery Requirements</span>` markup that the validator did not recognize;
- the 24-question assessment correctly computed `ceil(24 × 0.80) = 20`, while the validator required a hard-coded `PASSING=20`;
- the shared Mentor/Beta loader lacked explicit privacy-boundary wording.

Day 1 also lacked a visible mastery-boundary statement.

### Repair
- recalculated root-relative Grade 09 and High School links for every affected Science unit HTML page;
- added the explicit ≥80% mastery-boundary statement to Unit 01 Day 1;
- updated the Unit 01 validator to accept the canonical computed 80% threshold and current dashboard markup;
- documented the Mentor/Beta sanitized-route privacy boundary in the Science theme loader.

### Validation
`node courses/science/integrated-science-9/tools/validate-unit01.mjs`

Result: **116 PASS / 1 documented warning / 0 FAIL**.

The remaining warning is the known static-client limitation that objective auto-grading exposes answer indexes to deliberate source inspection. Secret grading requires the protected backend.

### Status
**GREEN for structural release; protected grading remains a server-side responsibility.**

---

## Repair 04 — Global Studies canonical 80% mastery alignment

### Finding
The active mastery-policy overlay correctly enforced 80%, but the canonical Social Studies data still contained legacy `passingTarget: 70` metadata. This created a split-brain contract: runtime policy said 80 while source data said 70.

### Repair
- changed `courses/social-studies/grade-09/data/course-data.json` metadata to `passingTarget: 80`;
- changed all canonical `course-data.js` metadata occurrences from 70 to 80;
- retained the explicit mastery-policy overlay as the authoritative runtime safeguard.

### Validation
The assessment validator now has **0 failures** and no legacy-threshold warning.

It still reports content-quality warnings for generic/duplicated weekly objective stems in the canonical bank. Those are not silently rewritten in this five-repair checkpoint because they require content-level question authoring, not a mechanical patch.

### Status
**GREEN for mastery-policy coherence; YELLOW for canonical quiz-bank depth consolidation.**

---

## Repair 05 — Algebra I transition-contract continuity

### Finding
Algebra I linked twice to `transition-contract.html`, but that page did not exist. The canonical transition contract did exist as `readiness/transition-contract.json`, so the learner-facing continuity surface was simply missing.

### Repair
- added `courses/mathematics/algebra-1/transition-contract.html`;
- the page reads the canonical JSON contract rather than duplicating the mapping logic;
- it presents the Pre-Algebra → Algebra I → Geometry / Algebra II continuity model and preserves the 80% mastery distinction;
- added the page to the Algebra I service-worker release set.

### Status
**GREEN** — Algebra I transition navigation now resolves and existing Algebra I validators still pass.

---

# Validation summary

## Passed

- `scripts/validate_grade09_stos_forensic.py` — **17/17 PASS**
- `scripts/validate_grade09_math_labels.py` — **PASS**
- Integrated Science 9 Unit 01 validator — **PASS with 1 documented client-key warning**
- Grade 9 Social Studies assessment validator — **PASS_WITH_WARNINGS, 0 failures**
- Algebra I transition-contract validator — **PASS**
- Algebra I whole-course first-draft validator — **PASS**
- JavaScript syntax checks for modified runtime/service-worker files — **PASS**
- audited Grade 09 internal href/src resolution — **0 broken**

## Intentionally not altered in this checkpoint

1. **Pre-Algebra** — preserved as the previously validated control; no formal assessment or detailed-unit replacement was performed.
2. **Social Studies canonical quiz-bank depth warnings** — the validator reports repeated generic stems. This needs a dedicated content-authoring pass rather than automated synonym replacement.
3. **Teacher authentication** — the Grade 9 Social Studies teacher portal still documents and uses a local convenience passcode. It is **not server authentication**. Do not treat it as a secure boundary once student records are connected to the backend.
4. **Protected grading keys** — client-side auto-grading can never keep objective answer indexes truly secret. The secure server should own protected grading/answer-key responses when that backend is enabled.
5. **`/stos/...` resource routes** — ProResources, Arcade, and Arshif internal STOS routes are treated as external platform dependencies and were not rewritten as missing local files.

# Backend handoff boundary

When the secure server is connected, the recommended authority split is:

- public curriculum / static lessons: cacheable and local-first;
- learner drafts / local practice: local-first unless the user explicitly submits;
- official grades / transcripts / enrollment / family records: protected server authority;
- teacher sessions / answer keys / closed-book grading: protected server authority;
- service workers: never cache authenticated or teacher-only responses;
- STOS resource routes: resolve through the internal gateway without exposing internal topology on public pages.

# Release decision

**REPAIRED CHECKPOINT: APPROVED FOR STOS TESTING**

This is not a claim that every course in the 5,370-file repository has received a fresh content audit. It is a five-repair forensic checkpoint focused on the Grade 09 production path and the highest-impact defects found in that path.
