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


## 2026-11-22 · Fresh post-certification forensic audit — five new bubbles

The 180-lesson curriculum source certification remains PASS. This fresh audit examined current governance, course-map authority, inquiry/lab evidence, learner evidence storage, dedicated CI coverage, vocabulary/assessment infrastructure, and current course surfaces after the full hardening program.

### Bubble 1 — No course-wide Chemistry 11 CI integrity workflow
- The repository contains a dedicated `.github/workflows/chemistry11-week14-validation.yml`, but no Chemistry 11 workflow that continuously validates the full 36-week / 180-lesson course.
- The source certification was established through cumulative direct block verification and a final repository-tree inventory, but a future edit could regress an earlier lesson without a Chemistry-specific whole-course CI guard catching it.
- **Recommended repair:** add a `chemistry11-course-integrity.yml` workflow plus validator that checks 180 expected lesson routes, canonical engine marker, exactly one loader, science-contract presence, map/lesson route consistency, assessment-week boundaries, and ordinary-page depth floor.

### Bubble 2 — 25% inquiry/laboratory target remains unproven by instructional-time evidence
- `LAB_INVESTIGATION_QUALITY_V1.md` defines eight strong anchor investigations, but explicitly states that the anchors do not prove the >=25% course-time target.
- `FORENSIC_LAB_AUDIT_2026-10-24.md` still lists the denominator/numerator time proof as an outstanding release blocker.
- **Recommended repair:** establish a canonical inquiry-minute evidence model across all 36 weeks, distinguishing qualifying inquiry minutes from routine instruction, with safe simulation/data alternatives counted by the same reasoning standard.

### Bubble 3 — Inquiry/evidence persistence and learner isolation are still browser-local and not authoritative
- `inquiry-ledger.js` stores provisional records under a single browser-local key and intentionally keeps official review/sharing/credit locked.
- Weekly index pages also retain direct browser-local evidence storage patterns.
- The authority-gate document correctly states that authenticated educator approval, evidence digest binding, revocation, and authoritative learner/course identity are not implemented.
- **Recommended repair:** harden learner-scoped evidence storage and fictional two-learner regression first; preserve fail-closed behavior and keep official signoff behind the Academy/STOS authority boundary.

### Bubble 4 — Governance/course-map descriptions lag the newly hardened lesson depth
- `course-map.json` still understates several quantitative strands. Examples: Week 28 describes ion-product work largely qualitatively even though the lessons now perform Ksp/Qsp and post-mixing calculations; Week 33 says to read cell diagrams/compare potential data while the lessons now calculate E°cell and connect it to ΔG°; Weeks 35–36 now contain deeper sensitivity, source-traceability, and cross-unit diagnostics than the map advertises.
- The markdown `CURRICULUM_MAP.md` is intentionally broad and therefore does not preserve the new per-week quantitative/evidence contracts.
- **Recommended repair:** synchronize `course-map.json`, weekly index summaries, and governance documentation to the hardened lesson contracts so the map becomes a reliable curriculum authority rather than a historical outline.

### Bubble 5 — Weekly landing/evidence surfaces are not yet unified with the canonical upper-science lesson contract
- Daily lessons now share the hardened upper-science contract, but weekly index pages remain a separate journal-shell implementation with generic Monday–Friday prompts and direct localStorage evidence fields.
- This creates a second instructional surface that can drift from the daily lesson engine and can underrepresent week-specific quantitative, retrieval, vocabulary, and evidence expectations.
- **Recommended repair:** create a Chemistry 11 weekly-shell contract/validator that derives week title, essential question, quantitative target, investigation target, vocabulary/retrieval prompts, and lesson links from canonical course data while preserving the current safe journal/portfolio functions.

### Strong systems retained
- 36 weeks / 180 lesson routes remain present.
- Source-level curriculum certification remains PASS.
- Vocabulary source is week-aligned and source-reviewed.
- Public question-bank audit includes misconception mapping, reasoning-family coverage, answer-position distribution, ordinary-week minimum item counts, unit-level evidence families, and spaced-retention checks.
- Secure assessment blueprint preserves protected summative boundaries.

### Priority order
1. Course-wide Chemistry 11 CI integrity workflow.
2. Canonical course-map / weekly-shell synchronization.
3. Inquiry-time denominator/numerator proof.
4. Learner-isolated inquiry/evidence persistence regression.
5. Weekly-shell derivation from the canonical upper-science contract.

These are post-certification hardening targets; they do not revoke the existing curriculum-source PASS.


## 2026-11-22 · Post-certification Bubble 1 closure — course-wide CI integrity guard

### Repair
- Added `courses/science/chemistry-11/tools/validate-course-integrity.mjs`.
- Added `.github/workflows/chemistry11-course-integrity.yml`.
- The validator now protects the complete Chemistry 11 source topology: 36 weekly indexes, 180 daily lessons, canonical `upper-science-v1` marker, exactly one loader per lesson, science-contract presence, lesson-depth floors, 36/180 course-map declarations, 80% mastery declaration, Week 18 MID / Week 36 FINAL topology, secure assessment boundaries, release-certification boundary, vocabulary week coverage, and required question-bank audit tooling.
- The workflow also runs the existing Chemistry 11 question-bank/misconception audit and the shared upper-science secure-assessment blueprint validator.
- Triggers cover Chemistry 11 source changes, shared upper-science assessment-blueprint validator changes, pull requests, and manual workflow dispatch.

### Verification
- Validator commit: `5a902f7263f7216ab5141aa09317c7014e55e30e`.
- Workflow commit: `9a7a111431975508a0658155327f41353d1e24ef`.
- GitHub Actions check `source-integrity` job `137418851926`: **PASS / success** on the workflow commit.

### Status
**Bubble 1 — no course-wide Chemistry 11 CI integrity workflow: CLOSED.**

The source-level curriculum certification remains PASS. Runtime/browser/accessibility/protected-assessment authority remain separate gates.


## 2026-11-22 · Post-certification Bubble 4 closure — canonical course-map / weekly authority synchronization

### Repair
- Upgraded `course-map.json` from schema 2.0 to **2.1**.
- Added course-level curriculum-authority and authority-version declarations.
- Added explicit hardened contracts to all **36 weeks**:
  - `quantitative`
  - `evidence_contract`
  - `inquiry_contract`
  - `retrieval_contract`
  - `authority_version`
- Synchronized `CURRICULUM_MAP.md` with a 36-row canonical weekly-contract table.
- Synchronized all **36 weekly landing pages** with a visible `data-canonical-week-contract="2026-11-22-hardened-v1"` summary covering quantitative, evidence, inquiry, and retrieval/transfer expectations.
- The refreshed authority now accurately reflects the hardened depth added during certification, including Ksp/Qsp and post-mixing calculations (Week 28), E°cell/ΔG° electrochemistry (Week 33), capstone sensitivity/source traceability (Week 35), and cross-unit readiness/portfolio correction architecture (Week 36).

### Regression protection
- Hardened `tools/validate-course-integrity.mjs` to require:
  - schema 2.1 and current authority version,
  - all four canonical week-contract fields for Weeks 01–36,
  - exactly one canonical weekly-contract marker on every weekly landing page,
  - exact weekly landing-page contract text synchronized to `course-map.json`.
- GitHub compare from canonical-map commit through validator hardening confirms **36/36 weekly index pages changed**, plus governance map and validator updates.
- GitHub Actions `source-integrity` job `137421386677`: **PASS / success** on commit `0b023922bb3d5c930b665274f5f6bf03286cbd3d`.

### Key commits
- Canonical map schema/contracts: `97264be3f9dd299069b0fbd8313f28b930eb75ba`
- Governance map synchronization: `4aebf3103d8d9e0a20d3c1ae5435d86ff0876f5b`
- Weekly landing synchronization: Weeks 01–36 completed across 36 commits.
- CI synchronization guard: `0b023922bb3d5c930b665274f5f6bf03286cbd3d`

### Status
**Bubble 4 — governance/course-map descriptions lag hardened lesson depth: CLOSED.**

The course-map, governance map, weekly landing summaries, and CI validator now share one hardened curriculum authority contract. Bubble 5 remains distinct: it concerns eliminating the separate generic weekly-shell implementation by deriving the shell itself from canonical data rather than merely keeping its summary synchronized.


## 2026-11-22 · Post-certification Bubble 2 closure — >=25% inquiry instructional-time proof

### Repair
- Added a canonical source-planning time model to `course-map.json` under `course.instructional_time_model`.
- Added per-week `inquiry_minutes_plan` records for all 36 weeks.
- Defined a conservative denominator of **180 daily blocks × 50 minutes = 9,000 planned instructional minutes**.
- Counted only explicit qualifying inquiry activity in the numerator:
  - Monday phenomenon/question/model framing: **15 minutes**
  - Thursday investigation/design/data-analysis: **50 minutes**
  - Friday evidence-based CER synthesis/revision: **15 minutes**
- Ordinary instructional weeks: **34** (Weeks 01–17 and 19–35).
- MID Week 18 and FINAL Week 36 contribute **0 new inquiry minutes** to the numerator but remain fully in the denominator.

### Calculation
- 34 ordinary weeks × 80 qualifying inquiry minutes = **2,720 qualifying inquiry minutes**.
- 2,720 / 9,000 = **30.22% planned qualifying inquiry time**.
- Target threshold: 25% of 9,000 = **2,250 minutes**.
- Margin above target: **470 minutes**.

### Evidence standard
- Added `docs/INQUIRY_TIME_EVIDENCE_V1.md` defining what qualifies and what does not.
- Qualifying work requires question/model framing, data/design analysis, competing-model evidence, or evidence-based explanation/revision.
- Passive reading, lecture, navigation, routine practice, protected summative testing, and answer review without transfer/revision do not count.
- Safe supplied-data/offline simulation alternatives count only when they preserve the same inquiry reasoning; unsafe improvisation never counts.

### Regression protection
- Hardened `tools/validate-course-integrity.mjs` to recompute:
  - denominator,
  - numerator,
  - inquiry percentage,
  - all 36 weekly minute plans,
  - assessment-week zero-new-inquiry rules,
  - evidence-document totals.
- CI fails if the recomputed inquiry share drops below 25% or stored totals drift from the week plans.
- GitHub Actions `source-integrity` job `137424133377`: **PASS / success** on commit `9e078e1e3570d15ce19ece15733c43905ec612fd`.

### Key commits
- Canonical inquiry-minute model: `d9f06698a40522a4b2bf1738e44fe25a8a09f9d9`
- Inquiry-time evidence document: `25b09280f349ad984e3e60576c425f544cf9e083`
- CI enforcement: `9e078e1e3570d15ce19ece15733c43905ec612fd`

### Status
**Bubble 2 — >=25% inquiry/laboratory instructional-time target unproven: CLOSED at the source-planning level.**

Boundary: this proves the published curriculum allocates >=25% of planned instructional time to qualifying inquiry. It does not claim any individual learner actually completed 2,720 inquiry minutes; actual learner time, teacher review, attendance, browser timing, and credit authority remain separate runtime/evidence gates.


## 2026-11-22 · Post-certification Bubble 3 closure — learner-isolated inquiry/evidence persistence

### Repair
- Hardened `inquiry-ledger.js` so the learner-scoped storage key is resolved explicitly through `KhaemenesLearnerScope.scopedKey(KEY)` before read/write operations.
- Preserved the existing stale-page identity lock: a page opened for Learner A cannot write after the active Academy learner changes without reload.
- Preserved invalid-record fail-closed behavior: malformed preserved ledger content blocks new saves rather than being overwritten.
- Added `tools/test-learner-isolation.mjs`, a dedicated Chemistry 11 fictional A/B regression covering:
  - inquiry-ledger isolation,
  - weekly evidence-key isolation,
  - foreign scoped-key read denial,
  - independent A/B writes,
  - stale-tab write denial after learner switch,
  - fresh reload recovery,
  - unclaimed legacy preservation and explicit claim,
  - malformed preserved-record byte preservation,
  - 36/36 weekly identity-contract + learner-scope script ordering,
  - Chemistry evidence-key prefix presence.
- Added the Chemistry isolation regression to `.github/workflows/chemistry11-course-integrity.yml`.
- Hardened `tools/validate-course-integrity.mjs` to require the isolation test and the inquiry-ledger learner-scope/stale-lock/invalid-record protections.
- Updated `docs/INQUIRY_REVIEW_AUTHORITY_GATE_V1.md` to reflect the newly established CI-backed source isolation proof while preserving the educator-authority boundary.

### Verification
- Explicit ledger-key commit: `aad3734015ba1b837063896f31c95550aab413a9`.
- Fictional two-learner regression commit: `3b3bd8ebd0748e23ca7a934391975f9e278de306`.
- CI workflow integration: `ebbe5e77976253449c1641c8886110223537b721`.
- Integrity validator hardening: `cd25c58b2dfc1c618a936920c82e580076349c26`.
- GitHub Actions `source-integrity` job `137456948194`: **PASS / success**.
- Authority-gate status update: `cfa9520270c00fe7e8b64ea915d8d83a9b95afad`.

### Status
**Bubble 3 — learner isolation unproven for Chemistry inquiry/evidence persistence: CLOSED at the source/CI regression level.**

Boundary: this does not establish authenticated educator approval, evidence-digest custody, revocation, authoritative credit issuance, or real-browser end-to-end learner-switch/reload/export behavior. Those remain separate fail-closed runtime/authority gates.
