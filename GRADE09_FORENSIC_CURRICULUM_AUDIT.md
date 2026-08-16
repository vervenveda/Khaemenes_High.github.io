# Grade 09 Forensic Curriculum Audit

**Branch:** `hardening/archaemenes-highschool`  
**Status:** ACTIVE — do not merge or publish until the full Grade 09 forensic gate is complete.

## Purpose

This audit verifies Grade 09 as an academically rigorous, coherent, interactive, readable, learner-safe program before work advances to Grade 10. It covers curriculum quality, answer integrity, repetition, progression, mastery gating, resources, accessibility, learner-state authority, readiness placement, support pathways, and cross-course coherence.

## Grade 09 readiness before course placement

`courses/readiness/grade-09/` is a forensic-candidate gateway with separate evidence in Mathematics, Language Arts, Science, Social Studies, and Research & Academic Readiness.

The gateway produces **subject-by-subject recommendations rather than one total learner score**. Candidate logic includes 50 common core items plus 10 targeted verification items, with follow-up evidence near the 80% boundary or when acceleration may be warranted.

Readiness evidence does not automatically rewrite Family Registry, promote/demote a learner, or award course mastery. NAIB may interpret/delegate next-step context. Family/Academy review remains the formal placement boundary. Current cut bands remain policy candidates rather than validated psychometric cut scores.

## Grade 09 Foundations Studio — all five tracks built as forensic candidates

`courses/foundations/grade-09/` contains:

1. **Mathematics Foundations** — number sense through Pre-Algebra readiness.
2. **Literacy Foundations** — reading, evidence, writing, revision, source use, and English 9 readiness.
3. **Science Foundations & Lab Reasoning** — investigation design, measurement, data, safety, systems, CER, sources, and Integrated Science readiness.
4. **Global Inquiry Foundations** — chronology, geography, sourcing, corroboration, civics/economics, comparative reasoning, and Global Studies readiness.
5. **Academic Research & Study Studio** — planning, organization, source integrity, citation, data literacy, revision, portfolio habits, and independent-project readiness.

Each support track is 36 weeks × 5 learning days, uses 80% day/week mastery progression, separates formal Grade 09 learner records from preview/practice state, includes checkpoints at Weeks 9, 18, 27, and 36, and uses friendly prerequisite messaging.

A learner may need Foundations in one domain while remaining standard or advanced in another. Support does not change Grade 09 membership and must not become a permanent remedial label.

### Foundations forensic limitations

All five tracks remain **built but not production-certified**. Required before release: generated-item enumeration, independent key verification, exact/near-duplicate analysis, answer-position audits, distractor-collision checks, independent cumulative checkpoint pools, adult/Academy rubrics for constructed-response evidence, and browser/mobile/keyboard/print/learner-isolation testing.

## Canonical Grade 09 learning rule

Formal Grade 09 courses use a **minimum 80% mastery threshold**.

- lessons unlock in instructional sequence;
- mastery checks open only after required evidence is complete;
- the next week/unit opens at 80% or higher;
- scheduled midterm/final gates honor prior mastery requirements;
- Semester II may require the first-semester midterm itself at 80% before Week 19;
- reassessment remains available;
- locked attempts receive a friendly explanation;
- preview access never silently creates formal Grade 09 mastery, placement, or certification.

Recommended reminder tone:

> You’re almost there. This activity opens when the earlier learning step is complete. Finish the current lesson or reach 80% mastery on the required check, then come back — your progress is saved.

Archaemenes may encourage, explain, and guide. Archaemenes does not award mastery or bypass progression gates.

## Six forensic passes

### 1. Content integrity

For every objective item: confirm one defensible answer; verify calculations, units, dates, chronology, terminology, scientific statements, and source claims; verify distractors/explanations; flag ambiguity; define constructed-response rubrics.

### 2. Duplication and template audit

Search all 36 weeks and cumulative assessments for exact/near duplicate questions, answer choices, lesson bodies, prompts, model answers, cumulative-item reuse, and predictable answer patterns. Stable rhythm is acceptable; repeated substantive content is not.

### 3. Standards and rigor

Verify actual learner evidence supports high-school readiness through transfer, synthesis, analysis, application, communication, and independent work—not merely standards labels.

### 4. Learning design and interactivity

Target sequence: `overview → lesson → interactive workspace → tools/resources → assignment → mastery check → portfolio/evidence → print/review`.

### 5. Resource federation

Resources must support a specific learning purpose rather than serve as decorative links.

### 6. UX, accessibility, and print

Verify readable layout, no overflow, keyboard operation, visible focus, friendly locks, mobile layout, clean print, usable inputs, and no student-facing answer-key exposure.

## Current formal-course findings

### English 9

- 36 weeks / 180 daily lesson blocks remain preserved in `legacy.html`.
- Academy learner-scoped continuity, sequential weekly progression, and the 80% Semester II midterm gate are staged.
- `english9-forensic-quality.js` now assigns **36 dedicated weekly five-item assessment pools (180 weekly objective positions)** rather than relying on the old small shared quiz-key pools.
- The same layer transforms the generic five-day shell into week-specific Inquiry/Vocabulary, Close Reading/Evidence, Writing/Reasoning, Seminar/Counterreading/Revision, and Mastery/Portfolio work tied to each week's reading, essential question, vocabulary, and writing task.
- Historical cumulative reuse is replaced by an **independent 18-item midterm** and **independent 24-item final**.
- Four-choice positions are deterministically rotated.
- **Remaining:** independently verify generated weekly + 42 cumulative items, semantic duplicate scan, final answer-position audit, constructed-response rubric review, resource mapping, injected-layer syntax/load-order testing, browser/mobile/print/learner-switch validation.

### Integrated Science 9

- 36-week integrated scope/investigation architecture is preserved.
- Academy continuity and sequential 80% weekly progression are staged.
- The forensic quality layer diversifies repetitive conceptual generators with domain-specific, applied, CER, and source-evaluation items.
- The repository's submitted objective records for Units 01–04, Units 05–07, Units 08–09, and the Comprehensive Final are now recognized by `science9-cumulative-sync.js` and staged for synchronization into the active learner's Science 9 cumulative evidence.
- The synchronizer deliberately does not invent missing scores.
- A standalone midterm record remains absent and is now explicitly documented as a gap rather than silently inferred.
- **Remaining:** full generated-bank verification, numeric range/unit checks, semantic duplicates, dedicated midterm record/workflow, cumulative-to-cumulative gate policy, resource mapping, injected-layer syntax/load-order testing, browser/mobile/print/learner-switch validation.

### Global Studies Honors 9

- 36 weeks / 180 lesson slots / 108 principal assignments structurally remain.
- The 36-week forensic quality layer differentiates historical-method, source-analysis, map/data, argument, and synthesis work by topic.
- Original shared objective banks are replaced by **36 week-specific five-item banks (180 weekly objective items)**.
- Midterm is an **independent 18-item cumulative transfer assessment**.
- Final is an **independent 24-item cumulative transfer assessment**.
- A deterministic balancing layer rotates answer positions to remove the original index-0 pattern.
- Original 70% mastery/local-student authority are superseded by hardened 80% Academy learner-scoped progression.
- **Remaining:** independently verify all 222 new objective items, semantic duplicate analysis, final runtime answer distribution, constructed-response rubrics, injected-layer syntax/load-order, browser/mobile/print/learner-switch testing.

### Grade 09 Mathematics

- Mathematics Foundations is built below Pre-Algebra and now links to a dedicated readiness verification.
- The original Pre-Algebra monolith is preserved byte-for-byte as `courses/mathematics/pre-algebra/legacy.html`.
- The Academy-facing Pre-Algebra `index.html` now wraps that legacy portal with learner-scoped Academy continuity, preview separation, a forensic assessment layer, and a formal mastery-gate layer.
- The repeated shared unit banks are replaced on the hardened runtime by **36 dedicated five-item weekly banks (180 weekly objective positions)** with deterministic answer rotation.
- The midterm now samples one transfer item across Weeks 1–18; the final samples one transfer item across all 36 weeks instead of selecting multiple questions from a small number of shared domain pools.
- Formal gating now stages Monday→Friday progression, required weekly evidence, 80% weekly mastery, Week 19 requiring an 80% midterm, and final gating after all 36 weeks plus the midterm.
- A separate **32-item Foundation → Pre-Algebra Readiness Verification** now covers eight prerequisite strands; candidate readiness requires at least 26/32, with Academy/Family review still required for pathway change.
- Recommended continuum remains **Mathematics Foundations → Pre-Algebra Bridge → Algebra I / Integrated Math I → advanced verification**.
- **Remaining:** enumerate/solve generated weekly banks, collision/duplicate checks, verify all 32 readiness items, answer distribution, tool mapping, runtime/load-order, browser/mobile/print/learner-switch validation.

## Cross-course static checkpoint

`GRADE09_STATIC_VALIDATION_2026-08-16.md` now records a source/file-architecture checkpoint across Readiness, all five Foundations tracks, English 9, Science 9, Global Studies 9, and Pre-Algebra.

The checkpoint confirms intended wrapper/layer attachment and explicitly distinguishes source-level attachment from runtime/browser certification. It also records the compatibility iframe caveat and the Science midterm gap.

## Readiness-gateway acceptance tests

Before readiness may influence formal placement:

1. every item/key independently verified;
2. exact/near duplicates removed or deliberately identified as verification variants;
3. answer positions show no exploitable pattern;
4. borderline results trigger more evidence, not automatic placement;
5. advanced recommendations require second-stage verification;
6. one domain's support need does not lower unrelated placement;
7. no automatic Family Registry placement mutation;
8. NAIB remains interpretive/delegative rather than silent placement authority;
9. learner-local records do not leak between learners;
10. writing/reasoning evidence is added before high-stakes use.

## Mastery-gate acceptance tests

1. Week/Unit 1 is available to the eligible learner.
2. Future lessons cannot open before prerequisites.
3. Friendly reminders replace dead/punitive locks.
4. Mastery checks cannot be submitted before required learning.
5. Below 80% keeps the next required step locked and offers reassessment.
6. 80%+ unlocks exactly the intended next step, subject to semester/exam gates.
7. Midterm remains locked until scheduled prerequisites are mastered.
8. Semester II/final honor required prior exam gates.
9. Preview users cannot create formal mastery records.
10. Switching Academy learners does not transfer unlock state.

## Immediate checklist from this point

1. **Global Studies 9 objective-bank rebuild / independent exams — structurally completed; content/runtime verification remains.**
2. **English 9 assessment diversity / lesson differentiation — structurally completed; content/runtime verification remains.**
3. **Integrated Science 9 cumulative-score integration — staged for existing submitted benchmarks/final; midterm and runtime verification remain.**
4. **Pre-Algebra duplicate-bank rewrite / Academy gating / readiness verification — structurally completed; generated-bank and runtime verification remain.**
5. **Cross-course Grade 09 static validation — checkpoint completed.**
6. **Next: independent content-integrity sweeps and browser/mobile/keyboard/print/learner-switch testing.**
7. Only after those passes may Grade 09 be considered for A+++ forensic validation or merge/publish review.

## Completion standard

Grade 09 is not labeled **A+++ forensic validated** until readiness/placement integrity, all five support pathways, formal-course content integrity, uniqueness, assessment diversity, meaningful lesson differentiation, 80% progression, resource purpose, interface quality, learner-scoped records, Grade 08 preview separation, and browser/deployment checks all pass.

---

Khaemenes Academy · Grade 09 Forensic Curriculum Gate · August 2026
