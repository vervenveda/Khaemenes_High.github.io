# Biology 10 — Forensic Curriculum Audit Log

## 2026-11-22 · Initial post-Grade-9 focus audit

### Verified inventory
- 36 weekly directories exist.
- Each sampled week contains five daily lesson pages.
- Week 18 exists as MID — Midterm Examination & Corrections.
- Week 36 exists as FINAL — Comprehensive Final & Portfolio Defense.
- The course declares 180 daily lesson blocks and a >=25% inquiry/lab target.

### Five bubbles identified

1. **Canonical mapping gap**
   - Week 18 and Week 36 existed in the week registry as MID and FINAL but were absent from the top-level units registry.
   - Repaired in course-map.json by adding explicit MID and FINAL blocks.

2. **Missing course-governance documents**
   - Grade 10 lacked dedicated CURRICULUM_MAP.md and ASSESSMENT_FRAMEWORK.md.
   - Added both so the 36-week sequence, mastery rules, lab expectations, reassessment, and summative-security boundary are explicit.

3. **Upper-science engine inconsistency**
   - Representative Week 01 pages visibly mount the upper-science engine.
   - Representative Weeks 04, 08, 12, 16–19, 22, 26, 30, 34–36 did not visibly expose the canonical upper-science-v1 marker/loader in sampled daily pages.
   - Requires a complete 180-page engine audit before claiming coverage.

4. **Second-half depth regression**
   - Sampled Week 01 lessons were approximately 725–758 visible words.
   - Week 18 samples were approximately 338–362 words.
   - Week 36 samples were approximately 282–308 words.
   - Later sampled weeks commonly fell near 350–450 words, below the 500-word upper-science depth target used by the certification audit.
   - Requires systematic hardening beginning at the transition into the second semester.

5. **Instructional-contract inconsistency**
   - Early lessons more consistently expose phenomenon, worked reasoning, retrieval, investigation, and evidence.
   - Later sampled lessons often retain concept/quantitative material but lose explicit phenomenon, retrieval, CER/evidence, or worked-example structure.
   - Requires week-by-week restoration of the canonical five-day biology rhythm without overwriting strong existing content.

### Repairs completed in this pass
- Added MID and FINAL blocks to course-map.json.
- Added CURRICULUM_MAP.md.
- Added ASSESSMENT_FRAMEWORK.md.

### Next hardening sequence
1. Complete the 180-page engine/depth inventory.
2. Identify the exact week where the upper-engine/depth regression becomes systemic.
3. Harden in two-week blocks, preserving strong content and adding only missing contract elements.
4. Re-audit inquiry/lab percentage, quantitative progression, vocabulary/retrieval, and assessment coherence.
5. Keep browser/device certification separate from source-level curriculum certification.
