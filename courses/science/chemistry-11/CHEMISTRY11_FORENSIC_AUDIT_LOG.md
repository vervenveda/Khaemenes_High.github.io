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


## 2026-11-22 · Two-week hardening block 3 — Weeks 05–06

### Audit findings
- Week 05 periodic-trend lessons began at approximately 323–397 visible words.
- Week 06 ionic-bonding lessons began at approximately 325–380 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- Existing content sequence was scientifically sound but too compressed for the fortified upper-science standard.

### Repairs
- Mounted `upper-science-v1` on all ten Week 05–06 lessons with exactly one canonical loader per page.
- Week 05 strengthened periodicity as a predictive model, radius mechanism, shielding/effective attraction, ionization-energy/electronegativity distinctions, quantitative trend analysis, residuals/exceptions, data provenance, and bounded prediction.
- Week 06 strengthened ion/electron bookkeeping, charge-balanced formula derivation, polyatomic-ion audits, lattice reasoning, qualitative Coulombic comparison, structure–property evidence, ambiguity handling, and discriminating-test design.
- Added delayed retrieval, source/evidence-quality reasoning, quantitative transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week transfer to every lesson.
- Preserved existing data-investigation and synthesis structures rather than replacing them.

### Verification
- Week 05 Days 01–05 now measure approximately 521–547 visible words.
- Week 06 Days 01–05 now measure approximately 512–542 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD**.
- Next block: Weeks 07–08 — covalent bonding, Lewis structures, molecular geometry, and polarity.


## 2026-11-22 · Two-week hardening block 4 — Weeks 07–08

### Audit findings
- Week 07 covalent-bonding/Lewis lessons began at approximately 322–370 visible words.
- Week 08 geometry/polarity lessons began at approximately 323–369 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- Existing sequence and core chemistry were sound, but model limits, evidence quality, quantitative/model transfer, and delayed retrieval were too compressed.

### Repairs
- Mounted `upper-science-v1` on all ten Week 07–08 lessons with exactly one canonical loader per page.
- Week 07 strengthened shared-electron-density reasoning, valence-electron accounting, formal-charge calculations, resonance/delocalization, bond-order interpretation, model comparison, and Lewis-model limitations.
- Week 08 strengthened electron-domain counting, VSEPR geometry, lone-pair effects, bond-dipole vector reasoning, symmetry/cancellation, structure-property transfer, geometry validation, and polarity-model limitations.
- Added retrieval, evidence/source-quality reasoning, quantitative/model transfer, evidence revision, uncertainty/model limits, and misconception repair across all ten lessons.
- Preserved existing Lewis-model and VSEPR investigations while adding explicit audit criteria rather than replacing them.

### Verification
- Week 07 Days 01–05 now measure approximately 519–538 visible words.
- Week 08 Days 01–05 now measure approximately 505–541 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD**.
- Next block: Weeks 09–10 — metallic bonding/solids, then intermolecular forces and physical-property reasoning.


## 2026-11-22 · Two-week hardening block 5 — Weeks 09–10

### Audit findings
- Week 09 materials/solids lessons began at approximately 289–329 visible words.
- Week 10 intermolecular-forces lessons began at approximately 279–337 visible words.
- This was the thinnest audited block so far.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- Existing scope was sound but structure-property reasoning, quantitative comparison, evidence-quality controls, confounders, and model limits were underdeveloped.

### Repairs
- Mounted `upper-science-v1` on all ten Week 09–10 lessons with exactly one canonical loader per page.
- Week 09 strengthened metallic bonding, charge-carrier mobility, metallic/ionic/molecular/network solid comparison, density and conductivity calculations, engineering tradeoff matrices, property-data quality, material-classification uncertainty, and cross-scale structure-property reasoning.
- Week 10 strengthened dispersion/polarizability, dipole-dipole and hydrogen-bonding distinctions, molecular-size/shape confounders, boiling/vapor-pressure/evaporation reasoning, quantitative rate comparisons, controlled-variable design, repeated-trial logic, and integrated IMF prediction.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative/model transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week transfer throughout the block.
- Preserved the existing materials-property and evaporation investigations while strengthening their audit controls and causal reasoning.

### Verification
- Week 09 Days 01–05 now measure approximately 506–551 visible words.
- Week 10 Days 01–05 now measure approximately 510–530 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD**.
- Next block: Weeks 11–12 — gas behavior and quantitative gas laws, then solutions/concentration/dissolution reasoning.


## 2026-11-22 · Two-week hardening block 6 — Weeks 11–12

### Audit findings
- Week 11 gas-law lessons began at approximately 301–349 visible words.
- Week 12 solution/concentration lessons began at approximately 272–345 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- Quantitative work was present but too compressed, especially around proportional reasoning, unit discipline, molarity, dilution, experimental controls, and uncertainty.

### Repairs
- Mounted `upper-science-v1` on all ten Week 11–12 lessons with exactly one canonical loader per page.
- Week 11 strengthened kinetic-molecular pressure reasoning, Boyle/Charles/Avogadro proportionality, kelvin conversion, ideal-gas dimensional analysis, transformed-variable graphing, control-variable design, unit-compatible gas constants, and real-gas model limits.
- Week 12 strengthened particle models of dissolving, ionic dissociation versus molecular dispersion, molarity from mass/moles/volume, reverse concentration planning, dilution derived from mole conservation, serial dilution, volumetric-equipment/error reasoning, and solution-preparation uncertainty.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week integration throughout the block.
- Preserved the existing virtual gas-law and solution-concentration investigations while strengthening their experimental and audit logic.

### Verification
- Week 11 Days 01–05 now measure approximately 505–534 visible words.
- Week 12 Days 01–05 now measure approximately 506–549 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD**.
- Next block: Weeks 13–14 — mixtures/separation/spectroscopy, then reaction evidence and chemical equations.


## 2026-11-22 · Two-week hardening block 7 — Weeks 13–14

### Audit findings
- Week 13 mixtures/separation/spectroscopy lessons began at approximately 289–335 visible words and required substantive curricular recovery.
- Week 14 reaction-evidence/equation lessons were already unusually strong at approximately 590–613 visible words per lesson.
- All ten pages lacked the canonical `upper-science-v1` engine marker at the start of this block.
- Week 14 required engine/contract normalization rather than content expansion; Week 13 required deeper analytical reasoning, quantitative controls, and evidence-quality architecture.

### Repairs
- Mounted `upper-science-v1` across all ten Week 13–14 daily lessons with exactly one canonical loader per page.
- Week 13 strengthened property-based separation logic, recovery versus purity, chromatography/Rf measurement, stationary/mobile-phase reasoning, spectroscopy calibration, interpolation versus extrapolation, residuals, blanks/standards/duplicates/spikes, detection limits, converging analytical methods, and full evidence-chain auditing.
- Week 14 preserved its existing high-depth conservation/reaction content while adding explicit retrieval, evidence-quality, coefficient-only balancing revision, conservation boundaries, and the canonical science-contract layer.
- Corrected a body-attribute edge case in Week 14 so the canonical engine marker is present without disturbing existing page attributes.

### Verification
- Week 13 Days 01–05 now measure approximately 506–534 visible words.
- Week 14 Days 01–05 remain high-depth at approximately 660–683 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD**.
- Next block: Weeks 15–16 — mole relationships/stoichiometry, then limiting reactants and percent yield.


## 2026-11-22 · Two-week hardening block 8 — Weeks 15–16

### Audit findings
- Week 15 mole/stoichiometry lessons began at approximately 251–294 visible words.
- Week 16 limiting-reactant/yield lessons began at approximately 253–306 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- This was a major quantitative-depth gap: core topics were present, but mole bridges, coefficient-ratio logic, dimensional analysis, limiting-reactant comparison, theoretical/actual yield distinction, and diagnostic error reasoning were too compressed.

### Repairs
- Mounted `upper-science-v1` on all ten Week 15–16 lessons with exactly one canonical loader per page.
- Week 15 strengthened mole/entity labeling, Avogadro conversion, molar-mass construction, grams↔moles reasoning, coefficient-derived mole ratios, mass-to-mass stoichiometry, dimensional-analysis pathways, conservation checks, and reasonableness tests.
- Week 16 strengthened limiting-reactant identification by common-product comparison, excess-reactant validation, theoretical-yield calculation, actual-versus-theoretical distinctions, percent-yield diagnostics, above-100% anomaly interpretation, near-stoichiometric boundary sensitivity, and end-to-end reaction-data auditing.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week integration throughout the block.

### Verification
- Week 15 Days 01–05 now measure approximately 513–525 visible words.
- Week 16 Days 01–05 now measure approximately 514–533 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD**.
- Next block: Week 17 semester synthesis/reaction reasoning and Week 18 MID assessment/corrections/portfolio audit.


## 2026-11-22 · Two-week hardening block 9 — Weeks 17–18

### Audit findings
- Week 17 redox/solution-stoichiometry lessons began at approximately 253–303 visible words.
- Week 18 midterm-readiness/portfolio/correction lessons began at approximately 277–307 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- Week 17 required deeper oxidation-state bookkeeping, charge conservation, solution-stoichiometry calculations, trial analysis, and uncertainty reasoning.
- Week 18 required a stronger public readiness/correction/portfolio architecture while preserving protected summative authority.

### Repairs
- Mounted `upper-science-v1` on all ten Week 17–18 lessons with exactly one canonical loader per page.
- Week 17 strengthened oxidation-number assignment, oxidizing/reducing-agent identification, electron accounting, atom/charge/electron balance, solution stoichiometry with n=MV, non-1:1 equivalence reasoning, replicate analysis, accuracy-versus-precision distinctions, and integrated redox/solution audit chains.
- Week 18 strengthened evidence-based readiness mapping, mixed-model quantitative practice, error-family diagnosis, transfer checks, portfolio traceability, artifact authenticity, correction/reassessment protocols, semester defense, and measurable second-semester planning.
- Preserved the public/protected assessment boundary: confidential midterm items, answer keys, signing custody, authoritative grading, and official reassessment remain outside the public lesson layer.

### Verification
- Week 17 Days 01–05 now measure approximately 503–518 visible words.
- Week 18 Days 01–05 now measure approximately 507–522 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met, and the assessment-week public layer remains substantive without exposing protected summative content.

### Certification status
- First-semester Week 01–18 hardening is now complete at the daily-lesson source level.
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD** pending second-semester Weeks 19–36 hardening and final 180/180 sweep.
- Next block: Weeks 19–20 — kinetics foundations, rate laws, collision theory, factors affecting rate, and experimental rate data.


## 2026-11-22 · Two-week hardening block 10 — Weeks 19–20

### Audit findings
- Week 19 kinetics lessons began at approximately 258–271 visible words.
- Week 20 collision-theory/rate-factor lessons began at approximately 254–281 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- The sequence was sound but rate definition, slope reasoning, initial-rate comparison, collision-model mechanisms, controlled variables, experimental design, and uncertainty were substantially underdeveloped.

### Repairs
- Mounted `upper-science-v1` on all ten Week 19–20 daily lessons with exactly one canonical loader per page.
- Week 19 strengthened average-rate calculations, instantaneous/tangent slope estimation, initial-rate comparisons, reaction-order inference, raw-versus-fitted data distinctions, timing/mixing controls, replicate analysis, empirical-rate-law boundaries, and mechanism-inference limits.
- Week 20 strengthened effective-collision reasoning, activation-energy distributions, temperature-rate interpretation, concentration and surface-area mechanisms, controlled paired trials, catalyst/pathway distinctions, simulation validation, and collision-theory transfer.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week integration throughout the block.

### Verification
- Week 19 Days 01–05 now measure approximately 500–519 visible words.
- Week 20 Days 01–05 now measure approximately 500–513 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD** pending Weeks 21–36 hardening and the final 180/180 sweep.
- Next block: Weeks 21–22 — rate laws/mechanisms and catalysis, then kinetic modeling and experimental design/application.


## 2026-11-22 · Two-week hardening block 11 — Weeks 21–22

### Audit findings
- Week 21 mechanisms/catalysis lessons began at approximately 250–284 visible words.
- Week 22 kinetics inquiry/modeling lessons began at approximately 239–295 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- The core sequence was sound but mechanism constraints, catalyst energy reasoning, competing-model tests, residual analysis, experimental controls, and inquiry-defense evidence were substantially underdeveloped.

### Repairs
- Mounted `upper-science-v1` on all ten Week 21–22 lessons with exactly one canonical loader per page.
- Week 21 strengthened elementary-step summation, intermediate/catalyst cancellation, rate-determining-step compatibility, rate-law constraints, multistep energy profiles, catalyst pathway effects, mechanism-evidence matrices, discriminating tests, and explicit support/inconsistency/unresolved language.
- Week 22 strengthened falsifiable competing-model predictions, full controlled experimental design, replicate planning, variable levels, randomization, blanks/known-condition checks, residual analysis, model complexity limits, inquiry traceability, contrary-evidence handling, and evidence-based defense.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative/model transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week integration throughout the block.

### Verification
- Week 21 Days 01–05 now measure approximately 508–514 visible words.
- Week 22 Days 01–05 now measure approximately 506–514 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD** pending Weeks 23–36 hardening and the final 180/180 sweep.
- Next block: Weeks 23–24 — thermochemistry, calorimetry, enthalpy, and Hess-law energy accounting.


## 2026-11-22 · Two-week hardening block 12 — Weeks 23–24

### Audit findings
- Week 23 thermochemistry/calorimetry lessons began at approximately 225–287 visible words.
- Week 24 bond-energy/Hess-law lessons began at approximately 220–264 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- This was one of the thinnest blocks in the course, with sign conventions, energy conservation, calorimetry assumptions, enthalpy normalization, Hess-law algebra, state labels, and uncertainty substantially underdeveloped.

### Repairs
- Mounted `upper-science-v1` on all ten Week 23–24 lessons with exactly one canonical loader per page.
- Week 23 strengthened system/surroundings boundaries, q sign conventions, q=mcΔT dimensional analysis, calorimeter heat-capacity distinctions, reaction/solution sign reversal, molar-enthalpy normalization, heat-loss diagnostics, replicate comparison, and calorimetry uncertainty.
- Week 24 strengthened bond-energy accounting, explicit bond counting, Hess-law reversal/scaling/cancellation, state-function/path-independence reasoning, activation-energy versus ΔH distinctions, physical-state labels, uncertainty accumulation, alternate-cycle validation, and evidence hierarchy among calorimetry/Hess/bond-energy methods.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week integration throughout the block.

### Verification
- Week 23 Days 01–05 now measure approximately 500–520 visible words.
- Week 24 Days 01–05 now measure approximately 507–529 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD** pending Weeks 25–36 hardening and the final 180/180 sweep.
- Next block: Weeks 25–26 — entropy/direction/spontaneity, then chemical equilibrium and equilibrium constants.


## 2026-11-22 · Two-week hardening block 13 — Weeks 25–26

### Audit findings
- Week 25 entropy/direction lessons began at approximately 209–241 visible words.
- Week 26 equilibrium lessons began at approximately 206–248 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- Core scope was present but entropy was vulnerable to “disorder” shortcuts, spontaneity was weakly separated from kinetics, and equilibrium lacked sufficient K/Q quantitative depth and dynamic-rate reasoning.

### Repairs
- Mounted `upper-science-v1` on all ten Week 25–26 lessons with exactly one canonical loader per page.
- Week 25 strengthened entropy as dispersal/multiplicity, phase-change entropy, microstate/macrostates, ΔG=ΔH−TΔS with unit discipline, temperature-dependent direction, phase coexistence, and explicit separation of thermodynamic favorability from kinetic speed.
- Week 26 strengthened dynamic equilibrium, rate-versus-concentration graphs, K expressions and transformations, heterogeneous-equilibrium exclusions, Q-versus-K direction, instantaneous disturbance versus later adjustment, pressure/volume disturbances, catalyst non-shift behavior, and traceable equilibrium reasoning.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative/model transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week integration throughout the block.

### Verification
- Week 25 Days 01–05 now measure approximately 503–520 visible words.
- Week 26 Days 01–05 now measure approximately 500–535 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD** pending Weeks 27–36 hardening and the final 180/180 sweep.
- Next block: Weeks 27–28 — equilibrium applications/solubility, then acids-bases and pH foundations.


## 2026-11-22 · Two-week hardening block 14 — Weeks 27–28

### Audit findings
- Week 27 equilibrium-perturbation lessons began at approximately 209–246 visible words.
- Week 28 solubility/Ksp lessons began at approximately 225–278 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- Week 27 leaned too heavily on verbal Le Châtelier shortcuts; Week 28 lacked sufficient Ksp/Qsp, common-ion, precipitation-threshold, and post-mixing concentration depth.

### Repairs
- Mounted `upper-science-v1` on all ten Week 27–28 lessons with exactly one canonical loader per page.
- Week 27 strengthened concentration disturbances, partial-pressure/volume reasoning, inert-gas distinctions, temperature effects on K, three-state perturbation analysis, simulation controls, and Q-versus-K-first Le Châtelier reasoning.
- Week 28 strengthened saturation/dynamic dissolution, molar-solubility conversion, Ksp expressions, stoichiometric s relationships, Qsp precipitation tests, common-ion reasoning, coupled-equilibrium boundaries, post-mixing ion concentrations, solubility-data quality, detection limits, and uncertainty near precipitation thresholds.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative/model transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week integration throughout the block.

### Verification
- Week 27 Days 01–05 now measure approximately 503–518 visible words.
- Week 28 Days 01–05 now measure approximately 505–517 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD** pending Weeks 29–36 hardening and the final 180/180 sweep.
- Next block: Weeks 29–30 — acids/bases, pH/pOH, strong/weak acid-base reasoning, and titration foundations.


## 2026-11-22 · Two-week hardening block 15 — Weeks 29–30

### Audit findings
- Week 29 acid-base-model lessons began at approximately 209–358 visible words.
- Week 30 pH/titration lessons began at approximately 222–337 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- The sequence was scientifically sound but too compressed around conjugate-pair reasoning, strength-versus-concentration distinctions, logarithmic pH/pOH behavior, Kw, titration stoichiometry, curve regions, and endpoint/equivalence uncertainty.

### Repairs
- Mounted `upper-science-v1` on all ten Week 29–30 daily lessons with exactly one canonical loader per page.
- Week 29 strengthened Arrhenius versus Brønsted–Lowry scope, conjugate-pair tracking, conjugate-strength relationships, amphiprotic water, autoionization bridge reasoning, indicator calibration/ranges, and strong-versus-weak versus concentration distinctions.
- Week 30 strengthened logarithmic pH interpretation, inverse-log calculations, pOH/Kw cross-checks, strong-base stoichiometric factors, titration n=MV reasoning, non-1:1 stoichiometry, equivalence versus endpoint, titration-curve regions, sampling resolution, and end-to-end acid-base model selection.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative/model transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week integration throughout the block.

### Verification
- Week 29 Days 01–05 now measure approximately 505–522 visible words.
- Week 30 Days 01–05 now measure approximately 500–520 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD** pending Weeks 31–36 hardening and the final 180/180 sweep.
- Next block: Weeks 31–32 — buffers/acid-base equilibrium, then free energy/electrochemistry foundations.


## 2026-11-22 · Two-week hardening block 16 — Weeks 31–32

### Audit findings
- Week 31 buffer lessons began at approximately 239–354 visible words.
- Week 32 free-energy lessons began at approximately 221–367 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- Week 31 required stronger conjugate-pair stoichiometry, Henderson–Hasselbalch boundaries, half-equivalence reasoning, capacity distinctions, and buffer-design validation.
- Week 32 was confirmed as a Gibbs free-energy block rather than electrochemistry and required deeper actual-state versus standard-state ΔG, crossover-temperature, equilibrium linkage, coupling, and data-consistency reasoning.

### Repairs
- Mounted `upper-science-v1` on all ten Week 31–32 lessons with exactly one canonical loader per page.
- Week 31 strengthened buffer identity, acid/base challenge stoichiometry, pH versus capacity, Henderson–Hasselbalch use/limits, half-equivalence and pKa estimation, simulation controls, capacity normalization, and target-pH buffer design with finite-capacity checks.
- Week 32 strengthened ΔG versus ΔG°, ΔG=ΔH−TΔS, crossover-temperature calculations, ΔG°=−RT ln K, conceptual ΔG=ΔG°+RT ln Q linkage, coupled-process free-energy accounting, independent-route consistency checks, and thermodynamics-versus-kinetics boundaries.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative/model transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week integration throughout the block.

### Verification
- Week 31 Days 01–05 now measure approximately 514–568 visible words.
- Week 32 Days 01–05 now measure approximately 508–564 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD** pending Weeks 33–36 hardening and the final 180/180 sweep.
- Next block: Weeks 33–34 — electrochemistry, nuclear/materials/environmental chemistry, with exact topics to be verified from the source before hardening.


## 2026-11-22 · Two-week hardening block 17 — Weeks 33–34

### Audit findings
- Week 33 electrochemistry lessons began at approximately 259–335 visible words.
- Week 34 nuclear/materials/environmental lessons began at approximately 224–354 visible words.
- All ten pages lacked the canonical `upper-science-v1` marker/loader.
- Week 33 required deeper redox/electron-flow, galvanic-cell architecture, cell-potential/free-energy, measurement-quality, and real-device performance reasoning.
- Week 34 required deeper nuclear-versus-chemical distinctions, isotope-equation conservation, exponential half-life, fission/fusion systems evidence, lifecycle analysis, and environmental decision-quality reasoning.

### Repairs
- Mounted `upper-science-v1` on all ten Week 33–34 lessons with exactly one canonical loader per page.
- Week 33 strengthened half-reaction balancing, oxidizing/reducing-agent roles, anode/cathode/electron/salt-bridge logic, electrode-mass evidence, E°cell calculations, ΔG°=−nFE° linkage, nonstandard-condition boundaries, voltage measurement diagnostics, and voltage/current/energy/power distinctions.
- Week 34 strengthened alpha/beta/gamma symbolic conservation, half-life exponential calculations, fission-versus-fusion evidence, energy-system engineering constraints, decay timelines, hazard-versus-risk distinctions, lifecycle monitoring, and transparent scientific-evidence versus value-weighting matrices.
- Added delayed retrieval, evidence/source-quality reasoning, quantitative/model transfer, evidence revision, uncertainty/model limits, misconception repair, and cross-week integration throughout the block.

### Verification
- Week 33 Days 01–05 now measure approximately 513–538 visible words.
- Week 34 Days 01–05 now measure approximately 502–530 visible words.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.
- Ordinary teaching-page depth target is met across both weeks.

### Certification status
- Whole-course Chemistry 11 source-level curriculum certification remains **HOLD** pending Weeks 35–36 hardening and the final 180/180 sweep.
- Next block: Weeks 35–36 — materials/sustainable-chemistry capstone and final assessment/synthesis, with exact source topics to be verified before hardening.


## 2026-11-22 · Two-week hardening block 18 — Weeks 35–36 + final course sweep

### Audit findings
- Week 35 sustainable-chemistry capstone lessons began at approximately 238–298 visible words.
- Week 36 final-readiness/portfolio/correction lessons began at approximately 260–329 visible words.
- All ten pages initially lacked the canonical `upper-science-v1` marker/loader.
- Week 35 required stronger problem bounding, model-to-evidence selection, multi-criteria weighting, sensitivity analysis, source traceability, and design-defense quality.
- Week 36 required stronger cross-unit retrieval, mixed-model diagnosis, portfolio authenticity, correction transfer, and protected-final boundaries.

### Repairs
- Mounted `upper-science-v1` on all ten Week 35–36 lessons with exactly one canonical loader per page.
- Week 35 strengthened system boundaries, measurable functional units, chemistry-model selection, cross-model consistency, weighted decision matrices, sensitivity analysis, source ranges, uncertainty, and conditional design-defense logic.
- Week 36 strengthened course-wide readiness mapping, prerequisite-chain repair, mixed-model contrast tasks, portfolio traceability, correction/reassessment separation, course-defense evidence mapping, and transfer beyond Chemistry 11.
- Preserved the protected final-exam boundary: confidential prompts, answer keys, authoritative grading, custody, and official reassessment remain outside the public lesson layer.

### Verification
- Week 35 Days 01–05 now measure approximately 503–524 visible words.
- Week 36 Days 01–05 now meet the fortified depth threshold, including the public assessment-support pages.
- All ten pages verify the canonical upper-science marker.
- All ten pages verify exactly one canonical upper-science loader.
- All ten pages expose the science-contract depth layer.

## 2026-11-22 · Final Chemistry 11 source certification sweep

### Inventory
- Repository Git tree confirms **180/180 expected daily lesson files** across Weeks 01–36 (5 lessons per week).
- First expected lesson: `week-01/lessons/day-01.html`.
- Final expected lesson: `week-36/lessons/day-05.html`.

### Cumulative verification basis
- Each two-week block was re-fetched from `main` after hardening and verified for canonical `upper-science-v1` marker, exactly one loader, science-contract depth layer, and substantive lesson depth.
- Later work modified subsequent weeks and governance logs only; previously verified daily lesson blocks were not rewritten afterward.
- GitHub code-search indexing lagged the newest marker commits during the final sweep, so certification does not rely on that stale index; it relies on the current Git tree plus the cumulative direct-source block verifications recorded above.

### Source-level result
- 36 weeks / 180 daily lessons: **PASS**
- Week 18 MID topology and protected boundary: **PASS**
- Week 36 FINAL topology and protected boundary: **PASS**
- Canonical upper-science engine program across hardened blocks: **PASS**
- Single-loader integrity across directly verified blocks: **PASS**
- Substantive ordinary teaching-page depth: **PASS**
- Quantitative chemistry with units/assumptions: **PASS**
- Evidence/source-quality reasoning: **PASS**
- Retrieval, revision, uncertainty, and model limits: **PASS**
- Safe inquiry/laboratory alternatives and boundaries: **PASS**
- Capstone/portfolio/correction architecture: **PASS**

### Certification status
**CHEMISTRY 11 SOURCE-LEVEL CURRICULUM CERTIFICATION: PASS**

This PASS is intentionally limited to curriculum/source architecture. Browser/device behavior, accessibility, offline/runtime behavior, protected assessment operations, credential authority, accreditation, AP authorization, and jurisdictional credit approval remain separate gates and are not implied by this certification.
