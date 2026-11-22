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


## 2026-11-22 · Two-week hardening block 1 — Weeks 01–02

### Audit findings
- Week 01 lessons began around ~419–444 visible words.
- Week 02 lessons began around ~344–439 visible words.
- All ten pages lacked the canonical upper-science engine.
- Week 01 had strong safety/inquiry intent but needed worked quantitative reasoning and explicit source/evidence-quality boundaries.
- Week 02 had sound atomic-model content but needed stronger model-evidence distinction, retrieval, uncertainty, and quantitative interpretation.

### Repairs
- Mounted `upper-science-v1` on all ten Week 01–02 lessons with one canonical loader per page.
- Week 01 strengthened measurement disagreement, SDS/hazard literacy, density/dimensional analysis/significant figures, safe investigation design, and chemistry CER/source transparency.
- Week 02 strengthened historical model revision, Rutherford scattering distributions, atomic notation/particle accounting, model-evidence comparison, and evidence-based defense of atomic-model revision.
- Added explicit retrieval, evidence revision, source-quality reasoning, uncertainty/model limits, and safety boundaries.
- Follow-up depth extensions brought the thin Week 02 lessons above the ordinary teaching-page target.

### Verification
All ten pages now verify:
- canonical upper-science engine marker present,
- exactly one canonical loader,
- substantive evidence/source-quality reasoning,
- retrieval/evidence revision where appropriate,
- ordinary teaching-page depth target met.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains HOLD.
- Next block: Weeks 03–04 — isotopes/mass/nuclear composition, then electrons/spectra/quantized energy.


## 2026-11-22 · Two-week hardening block 2 — Weeks 03–04

### Audit findings
- Week 03 already contained strong isotope notation, mass-spectrum, weighted-average, and safe data-investigation content, including an anchored synthetic mass-spectrum investigation.
- Week 04 contained sound line-spectrum, transition-energy, wavelength/frequency, and virtual spectroscopy content, but the daily pages were compressed and lacked the canonical upper-science engine.
- All ten Week 03–04 daily lesson pages initially lacked the `upper-science-v1` marker/loader.
- The main gaps were explicit delayed retrieval, evidence/source-quality reasoning, evidence revision, quantitative transfer, uncertainty/model limits, and cross-week model transfer.

### Repairs
- Mounted `upper-science-v1` on all ten Week 03–04 lessons with exactly one canonical loader per page.
- Week 03 strengthened isotope-vs-ion bookkeeping, mass-spectrum assumptions, abundance normalization, weighted-average reasoning, raw-to-processed data lineage, uncertainty, inverse-abundance reasoning, and population-model interpretation.
- Week 04 strengthened observation-vs-inference boundaries for line spectra, energy-level consistency tests, wavelength/frequency/photon-energy dimensional analysis, significant-figure and order-of-magnitude checks, tolerance/residual analysis, systematic-vs-random calibration error, and comparison of Rutherford, Bohr-style, and modern quantum model scope.
- Preserved the existing Week 03 isotope investigation and Week 04 virtual spectroscopy investigation rather than replacing them.
- Added retrieval, source/evidence quality, evidence revision, transfer, misconception repair, and model-limit language to every daily lesson.

### Verification
- Week 03 Days 01–05 now measure approximately 531–572 visible words.
- Week 04 Days 01–05 now measure approximately 555–570 visible words after closing the four remaining depth exceptions.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD**.
- Next block: Weeks 05–06 — periodic trends, then ionic bonding and lattice reasoning.
