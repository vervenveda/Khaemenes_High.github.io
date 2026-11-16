# English 9–12 · Evidence-informed Lesson Organization · Research and Implementation Decision
**Date:** 2026-11-16
**Repository:** `vervenveda/Khaemenes_High.github.io`
**Status:** RESEARCH DOCUMENTED · DESIGN PLAN COMMITTED · NO NEW LESSON PAGE MODIFICATIONS
**Authoritative proposal:** [Research-Based English Lesson Design Standard v1](../../../../courses/shared/ENGLISH_RESEARCH_BASED_INSTRUCTIONAL_DESIGN_STANDARD_V1.md)

## Request
Founder asked to record the preceding review of scientific studies on learning-oriented page organization, acknowledge the English 9 Day 1 screenshot, and plan implementation across English 9, 10, 11, and 12.

## Verified public source themes
- Mayer & Moreno (2003) cognitive-load theory: reduce competing mental demands, clarify adjacent source and question relationships: https://doi.org/10.1207/S15326985EP3801_6
- Dunlosky et al. (2013), learning techniques review: prioritize retrieval/practice testing and spaced review over rereading alone: https://doi.org/10.1177/1529100612453266
- CAST UDL Guidelines 3.0 (2024): adjustable displays, access modes, graduated support and reflective learner agency: https://udlguidelines.cast.org/
- Further study targets: 2023 e-learning menu-depth experiment; signaling principle; WCAG 2.2 accessibility and native zoom.

These findings support design choices, but are not direct experimental verification of the proposed Academy seven-stage page architecture. No numerical learning-gain guarantee is asserted.

## Screenshot observations
Image supplied 2026-11-16 shows an English 9 Week 01 Day 01 browser page with the dual ticker/header stack, provenance card, lesson title, Unified Lesson Path, instructional sections and lower-right toolbar, but the entire webpage content appears extremely small within the Chrome window. **Cause is unverified**; do not mislabel the screenshot as a proven CSS bug. First diagnose browser zoom, in-page zoom, and computed font sizes. Avoid automatic zoom reset.

## Approved plan to test
Seven-part instructional flow: Recall → Learn → Read → Worked Example → Guided Practice → Independent Application → Review/Reflect. Keep required material visible, optional supports collapsed, reading and its question adjacent; route scores and saved work through existing course-specific authorities.

- **Grade 9:** observations, inferential discipline and guided evidence-based writing
- **Grade 10:** claims, context, counterinterpretation and revision
- **Grade 11:** rhetorical purpose, audiences, source comparison and reliability
- **Grade 12:** source provenance, nuanced synthesis, research ethics, independence and defense

Presentation: compact centered hero, one instructional title, charcoal/cream/parchment contrast, 16px minimum text and controls, 7px radius, one official 333 ticker, one AutoPopulate ticker, one VNV/KA header and enriched hamburger, official dock and single footer. Focus mode should suppress distracting motion without damaging the two ticker mounts or progress.

## Release sequence
0. Read-only instrumented layout and saved-evidence baseline.
1. Unified engine shell improvements on the existing 20 Week 01 pilot pages, no individual lesson HTML rewrites.
2. Content-specific stage mapping and clarity improvements grade-by-grade without copying grade 9 instruction across all levels.
3. Founder visual check and real browser/device/accessibility/learning validations.
4. Versioned data schema, pilot Unit 02 migration, parallel comparison and surgical rollback before any large-scale conversion.

## Guardrails
- Retain all existing lesson content, student saved-field IDs and reading source custody.
- Maintain readiness / 80% mastery locks, human review, quizzes, exams, privacy and exports.
- No analytics/learner data in workflow logs; no new unapproved libraries.
- No automatic mass migration before browser and student regression tests.
- Distinguish current shared engine implementation from **future planned research-informed redesign**.

## Change record
- Added `courses/shared/ENGLISH_RESEARCH_BASED_INSTRUCTIONAL_DESIGN_STANDARD_V1.md`, commit `d25df00e9d0ea0b452012ae4c78fa47ab72d7d03`
- This dated workflow entry and central workflow index will provide navigation.
- **No academic or UI code changes** were made under this specific research-planning task.

## Next action
Perform Phase 0 audit using one representative lesson per grade, including user browser zoom diagnosis, before coding Phase 1. Compare to screenshots, log source SHAs and obtain approval before scaling.
