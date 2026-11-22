# Chemistry 11 — Forensic Curriculum Audit Log

## 2026-11-22 · Initial Grade 11 forensic audit

### Verified course intent
- International Chemistry & Materials Science 11
- 36 weeks / 180 daily lesson blocks
- ≥80% mastery with correction/reassessment
- target ≥25% inquiry/laboratory time
- NGSS HS-PS1, HS-PS3, HS-ETS1 benchmark basis
- AP Chemistry depth-informed benchmark only; not AP-authorized

### Five bubbles identified

1. **Canonical mapping gap**
   - Week 18 MID and Week 36 FINAL existed in the weekly sequence but were omitted from the top-level unit registry.
   - Repaired by explicitly adding MID and FINAL units to `course-map.json`.

2. **Missing course-governance layer**
   - No dedicated `CURRICULUM_MAP.md`, `ASSESSMENT_FRAMEWORK.md`, `RELEASE_CERTIFICATION.md`, or Chemistry forensic audit log existed.
   - Added all four.

3. **Upper-science engine inconsistency**
   - Representative samples across Weeks 01, 05, 10, 14, 18, 20, 25, 30, 32, 35, and 36 did not expose the canonical `upper-science-v1` marker/loader.
   - Requires systematic page-by-page recovery before whole-course certification.

4. **Systemic depth regression**
   - Strong anchor Week 14 sampled around ~590–605 visible words.
   - Week 01 sampled around ~421–444.
   - Week 05 sampled around ~325–397.
   - Week 10 sampled around ~279–337.
   - Week 20 sampled around ~254–281.
   - Week 25 sampled around ~209–241.
   - Week 30 sampled around ~222–337.
   - Week 32 sampled around ~236–367.
   - Week 35 sampled around ~245–298.
   - Week 36 sampled around ~260–329.
   - Ordinary teaching weeks therefore need substantive hardening, not cosmetic expansion.

5. **Instructional/evidence contract inconsistency**
   - Worked examples and vocabulary appear in many pages, but explicit retrieval, source/evidence quality, CER/evidence revision, uncertainty/model boundaries, and transfer are inconsistent.
   - Chemistry-specific safeguards are needed around units, dimensional analysis, model-vs-observation, equilibrium/thermodynamic interpretation, graph/data quality, and safe laboratory evidence.

### Existing strengths
- Complete 36-week mapped scope.
- Strong quantitative and laboratory intent.
- Dedicated inquiry/lab audit documentation.
- Eight anchored deep investigations already identified in prior source audit.
- Week 14 demonstrates that the repository can support appropriately deep chemistry instruction.

### Certification status
**SOURCE-LEVEL CURRICULUM CERTIFICATION: HOLD**

### Next hardening sequence
Harden in two-week blocks, beginning with Weeks 01–02, preserving strong content while adding:
- canonical upper-science engine,
- mechanism/model depth,
- quantitative reasoning with units,
- evidence/source quality,
- retrieval,
- evidence revision,
- uncertainty/model limits,
- misconception repair,
- safe inquiry boundaries.
