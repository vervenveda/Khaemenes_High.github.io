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


## 2026-11-22 · Two-week hardening block 1 — Weeks 18–19

### Breakpoint confirmed
- Week 18 is the first clear systemic regression in the sampled course sequence.
- Before hardening, all five Week 18 lessons were approximately 338–362 visible words, none mounted the canonical upper-science engine, and explicit phenomenon/worked-example/retrieval/evidence structure was sparse.
- Week 19 began recovering content depth (approximately 447–578 visible words), but all five sampled pages still lacked the canonical upper-science engine and most lacked explicit phenomenon/retrieval/evidence structure.

### Repairs
- Mounted `upper-science-v1` on all 10 lessons across Weeks 18–19 with one canonical loader per page.
- Week 18: added cumulative-case reasoning, worked synthesis/quantitative examples, retrieval, evidence revision, and transfer without turning the assessment week into a new content unit.
- Week 19: strengthened meiosis with explicit phenomena, chromosome/ploidy reasoning, probability, recombination, retrieval, evidence revision, and transfer.
- Preserved existing course content, mastery boundaries, routes, and public/practice assessment status.

### Verification
Representative Days 01, 03, and 05:
- Week 18 now verifies engine=true, loader=1, checkpoint=true, phenomenon/cumulative case=true, retrieval=true, evidence revision=true.
- Week 19 now verifies engine=true, loader=1, checkpoint=true, phenomenon=true, retrieval=true, evidence revision=true.
- Representative Week 18 pages recovered to ~482–491 visible words; assessment-week brevity remains intentional and slightly below the 500-word ordinary upper-science target.
- Representative Week 19 pages now measure ~579–687 visible words.

### Next block
- Weeks 20–21 — Mendelian inheritance, probability/pedigrees, and statistical reasoning.


## 2026-11-22 · Two-week hardening block 2 — Weeks 20–21

### Audit findings
- Week 20 daily lessons ranged approximately 390–504 visible words before hardening; Week 21 ranged approximately 369–503.
- All ten pages lacked the canonical upper-science engine.
- Existing genetics content and worked examples were generally sound, but explicit retrieval, evidence revision, cumulative transfer, and regular CER/evidence framing were sparse.
- The repair focus was therefore reasoning continuity rather than replacing the inheritance curriculum.

### Repairs
- Mounted `upper-science-v1` on all ten Week 20–21 lessons with one canonical loader per page.
- Week 20 strengthened segregation, Punnett-square probability, expected vs observed ratios, incomplete dominance/codominance, and limits of simple Mendelian models.
- Week 21 strengthened product/sum rules, pedigree logic, X-linked probability, chi-square reasoning, assumptions, privacy/ethics boundaries, and probabilistic synthesis.
- Every lesson now includes explicit retrieval from earlier meiosis/Mendelian learning, evidence revision, and transfer to a changed context or model.
- Reinforced that inheritance probabilities do not guarantee small-family outcomes and that pedigree patterns are not diagnoses.

### Verification
Representative Days 01, 03, and 05 in both weeks verify:
- upper-science engine marker present,
- exactly one canonical loader,
- phenomenon,
- retrieval,
- evidence revision,
- transfer.

### Next block
- Weeks 22–23 — complex traits/gene–environment interaction, then DNA structure and replication.


## 2026-11-22 · Two-week hardening block 3 — Weeks 22–23

### Audit findings
- Week 22 daily lessons ranged approximately 356–439 visible words before hardening.
- Week 23 ranged approximately 336–461 visible words before hardening.
- All ten pages lacked the canonical upper-science engine.
- Existing worked examples and uncertainty language were generally sound, but explicit phenomenon framing, retrieval, evidence revision, and transfer were sparse.
- Week 23 showed the sharper depth regression and required more explicit molecular-mechanism reasoning.

### Repairs
- Mounted `upper-science-v1` on all ten Week 22–23 lessons with one canonical loader per page.
- Week 22 strengthened polygenic traits, pleiotropy, penetrance, expressivity, reaction norms, gene–environment interaction, correlation-vs-causation, and limits of complex-trait inference.
- Week 23 strengthened nucleotide architecture, antiparallel strands, Chargaff reasoning, semiconservative replication, enzyme directionality, leading/lagging synthesis, proofreading, repair, and replication fidelity.
- Every lesson now includes explicit retrieval from previous inheritance/chromosome learning, evidence revision, and transfer to changed contexts.
- Reinforced that complex-trait associations are not automatically causal and that replication fidelity is probabilistic rather than perfect.

### Verification
Representative Days 01, 03, and 05 in both weeks verify:
- upper-science engine marker present,
- exactly one canonical loader,
- phenomenon,
- retrieval,
- evidence revision,
- transfer.

### Next block
- Weeks 24–25 — transcription/translation/genetic code, then gene regulation and epigenetic mechanisms.


## 2026-11-22 · Two-week hardening block 4 — Weeks 24–25

### Audit findings
- Week 24 daily lessons ranged approximately 322–417 visible words before hardening.
- Week 25 ranged approximately 330–430 visible words before hardening.
- All ten pages lacked the canonical upper-science engine.
- Existing worked examples and uncertainty language were present, but these were the thinnest ordinary teaching weeks audited so far.
- Mechanism-level explanation needed strengthening, especially strand orientation, RNA processing, reading frame, sequence consequences, regulatory architecture, chromatin context, and expression-data interpretation.

### Repairs
- Mounted `upper-science-v1` on all ten Week 24–25 lessons with one canonical loader per page.
- Week 24 strengthened transcription directionality, coding vs template strands, RNA processing, alternative splicing, translation, codon/frame logic, mutation consequences, and information-flow synthesis.
- Week 25 strengthened promoters/enhancers, transcription factors, operon vs eukaryotic regulation, chromatin and epigenetic mechanisms, heatmaps/fold change, and causal limits in expression interpretation.
- Every lesson now includes explicit retrieval, evidence revision, and transfer.
- Reinforced that expression differences do not by themselves prove a specific regulatory mechanism and that epigenetic marks are context-dependent rather than universal on/off switches.

### Verification
Representative Days 01, 03, and 05 in both weeks verify:
- upper-science engine marker present,
- exactly one canonical loader,
- phenomenon,
- retrieval,
- evidence revision,
- transfer.

### Next block
- Weeks 26–27 — biotechnology/genomics/bioethics, then evidence for evolutionary change.


## 2026-11-22 · Fortification pass — Weeks 24–25 brought to upper-science depth

### Reason for second pass
- Structural hardening restored the engine and reasoning contract, but several lessons remained below the ordinary ~500-word upper-science depth target.
- Explicit vocabulary scaffolding and source/evidence-quality work were still inconsistent.

### Fortification
- Added an advanced depth section to every Week 24–25 lesson.
- Week 24 additions: strand-direction precision, transcript processing/isoforms, open-reading-frame reasoning, mutation consequence analysis, evidence ladders from DNA to phenotype, source hierarchy, and quantitative sequence/expression tasks.
- Week 25 additions: promoter/enhancer architecture, operon vs eukaryotic networks, chromatin/epigenetic evidence, expression-data normalization, fold-change interpretation, causal-evidence matrices, and source-quality controls.
- Every lesson now contains explicit vocabulary-in-context, evidence-quality/source evaluation, and quantitative transfer.
- Preserved one canonical upper-science engine loader per page.

### Standard
- The target is substantive depth, not padding: mechanism, evidence, quantitative reasoning, model limits, and source quality must all be visible.


## 2026-11-22 · Two-week hardening block 5 — Weeks 26–27

### Audit findings
- Week 26 lessons ranged approximately 342–461 visible words before hardening.
- Week 27 ranged approximately 336–461 visible words before hardening.
- All ten pages lacked the canonical upper-science engine.
- Biotechnology lessons had useful worked examples and investigation language but lacked strong source/evidence-quality scaffolds.
- Evolution-evidence lessons were especially thin in explicit source quality, historical-inference boundaries, and quantitative treatment.

### Repairs
- Mounted `upper-science-v1` on all ten Week 26–27 lessons with one canonical loader per page.
- Week 26 strengthened PCR amplification models and controls, gel electrophoresis calibration, sequencing coverage/quality, CRISPR targeting and repair limits, genomics privacy/consent, and quantitative risk interpretation.
- Week 27 strengthened fossils/stratigraphy/dating, homology vs analogy, biogeography, molecular sequence comparison, model-based historical inference, and convergence of independent evidence.
- Every lesson now includes explicit vocabulary-in-context, evidence-quality/source evaluation, quantitative or model transfer, retrieval, and uncertainty/model limits.
- Reinforced that biotechnology signals require controls; sequence similarity is evidence interpreted through models; and historical claims must distinguish observation from inference.

### Verification
All ten pages verify:
- upper-science engine marker present,
- exactly one canonical loader,
- vocabulary-in-context,
- evidence-quality task,
- quantitative/model reasoning,
- retrieval.

### Next block
- Weeks 28–29 — population genetics/changing allele frequencies, then natural selection and adaptation.


### Follow-up fortification — Weeks 26–27
- Rechecked the first fortification pass against the >=500-word ordinary upper-science depth target.
- Added targeted safeguards to remaining thin lessons: gel interpretation/data quality, sequencing coverage/mapping uncertainty, stratigraphy/dating limits, homology-vs-convergence evidence, biogeography alternatives, and a quantitative convergence-of-evidence check.
- Reverified engine mounting remains one canonical loader per page.


## 2026-11-22 · Two-week hardening block 6 — Weeks 28–29

### Audit findings
- Week 28 lessons ranged approximately 326–436 visible words before hardening.
- Week 29 ranged approximately 315–432 visible words before hardening.
- All ten pages lacked the canonical upper-science engine.
- Source/evidence-quality scaffolding was nearly absent despite otherwise useful worked examples.
- Core scientific risks were Hardy–Weinberg misuse, conflating drift/gene flow/selection, treating fitness as strength, and interpreting adaptation teleologically or without causal evidence.

### Repairs
- Mounted `upper-science-v1` on all ten Week 28–29 lessons with one canonical loader per page.
- Week 28 strengthened allele/genotype frequency, Hardy–Weinberg null-model reasoning, drift/bottlenecks/founder effects, gene flow/mutation/selection mechanism separation, and replicate population simulations.
- Week 29 strengthened conditions for selection, relative fitness, directional/stabilizing/disruptive selection, adaptation trade-offs, and causal evidence chains.
- Added vocabulary-in-context, evidence-quality tasks, quantitative transfer, retrieval, and model/uncertainty limits across all lessons.
- Follow-up fortification added sampling safeguards, explicit Hardy–Weinberg calculations, stochastic-drift interpretation, mechanism-separation calculations, fitness normalization, and distribution-based selection reasoning.

### Verification
All ten pages verify:
- upper-science engine marker present,
- exactly one canonical loader,
- vocabulary-in-context,
- source/evidence-quality reasoning,
- retrieval.
- All ordinary teaching pages meet or exceed the substantive upper-science depth target after follow-up fortification.

### Next block
- Weeks 30–31 — speciation/phylogeny/origins literacy, then ecosystem energy flow.


## 2026-11-22 · Two-week hardening block 7 — Weeks 30–31

### Audit findings
- Week 30 lessons ranged approximately 346–513 visible words before hardening.
- Week 31 ranged approximately 319–416 visible words before hardening.
- All ten pages lacked the canonical upper-science engine.
- Source/evidence-quality work was sparse, and several lessons needed stronger observation-vs-inference boundaries and quantitative ecology reasoning.

### Repairs
- Mounted `upper-science-v1` on all ten Week 30–31 lessons with one canonical loader per page.
- Week 30 strengthened species concepts, reproductive isolation, phylogenetic-tree reading, character matrices/parsimony, molecular/gene-tree conflict, and respectful origins literacy with explicit empirical/historical/philosophical/theological boundaries.
- Week 31 strengthened GPP/respiration/NPP, trophic transfer efficiency, food-web indirect effects, biomass-vs-production, energy-pyramid interpretation, and the distinction between energy flow and matter cycling.
- Added vocabulary-in-context, evidence/source-quality tasks, quantitative/model transfer, retrieval, uncertainty, and misconception repair.
- Follow-up fortification targeted tree-reading/parsimony misconceptions, origins-literacy retrieval, production estimates, non-universal ecological efficiency, food-web causality, and biomass/productivity distinctions.

### Verification
All ten pages verify:
- upper-science engine marker present,
- exactly one canonical loader,
- vocabulary-in-context,
- evidence/source-quality reasoning,
- retrieval.
- Ordinary teaching pages meet the fortified upper-science depth target after follow-up fortification.

### Next block
- Weeks 32–33 — biogeochemical cycles, then population and community dynamics.


## 2026-11-22 · Two-week hardening block 8 — Weeks 32–33

### Audit findings
- Week 32 lessons ranged approximately 331–439 visible words before hardening.
- Week 33 ranged approximately 305–407 visible words before hardening.
- All ten pages lacked the canonical upper-science engine.
- Major gaps were systems-model depth, source/evidence-quality scaffolding, explicit retrieval, and mathematical interpretation of population dynamics.

### Repairs
- Mounted `upper-science-v1` on all ten Week 32–33 lessons with one canonical loader per page.
- Week 32 strengthened reservoirs, fluxes, residence time, carbon budgets, nitrogen/phosphorus limitation, human perturbation/feedback, and mass-balance reasoning.
- Week 33 strengthened exponential and logistic growth, carrying capacity, predator-prey/competition dynamics, disturbance/succession, long-term data interpretation, and model selection.
- Added vocabulary-in-context, evidence-quality tasks, quantitative transfer, retrieval, uncertainty/model limits, and misconception safeguards across all lessons.
- Follow-up fortification targeted residence-time assumptions, carbon sign/boundary logic, nutrient co-limitation testing, proportional-vs-absolute exponential growth, dynamic carrying capacity, interaction-cycle causality, and residual-based model evaluation.

### Verification
All ten pages verify:
- upper-science engine marker present,
- exactly one canonical loader.
- Initial verification still found Week 33 Days 01–03 below the fortified depth target (480, 466, 475 words).
- A final targeted extension strengthened proportional-vs-absolute growth, dynamic carrying-capacity inference, and consumer-resource causal evidence.
- Reverification confirms those pages now meet the fortified depth target while retaining one canonical loader per page.

### Next block
- Weeks 34–35 — biodiversity/resilience/human impacts, then Biology & Biotechnology Capstone.


## 2026-11-22 · Two-week hardening block 9 — Weeks 34–35

### Audit findings
- Week 34 lessons ranged approximately 333–463 visible words before hardening.
- Week 35 capstone lessons ranged approximately 332–459 visible words before hardening.
- All ten pages lacked the canonical upper-science engine.
- Major gaps were biodiversity measurement nuance, conservation decision evidence, capstone source provenance, model validation, and explicit prototype-test logic.

### Repairs
- Mounted `upper-science-v1` on all ten Week 34–35 lessons with one canonical loader per page.
- Week 34 strengthened richness/evenness/index interpretation, fragmentation/connectivity, resilience/thresholds/restoration, ecosystem services/equity, and conservation decision matrices with sensitivity analysis.
- Week 35 strengthened solution-neutral problem framing, stakeholder analysis, source provenance/independence, quantitative uncertainty and model validation, prototype/test design, zero-baseline-safe percent-change reasoning, and final evidence/ethics recommendation defense.
- Added vocabulary-in-context, evidence/source-quality tasks, quantitative transfer, retrieval, uncertainty/model limits, and misconception safeguards across all lessons.
- Follow-up fortification targeted biodiversity metrics, corridor trade-offs, restoration evidence, stakeholder framing, source independence, validation vs sensitivity, and controlled prototype testing.

### Verification
All ten pages now verify:
- upper-science engine marker present,
- exactly one canonical loader,
- vocabulary-in-context,
- evidence/source-quality reasoning,
- retrieval,
- at or above the fortified upper-science depth target.

### Next block
- Week 36 — Comprehensive Final & Portfolio Defense, followed by a full Grade 10 source-level certification audit.


## 2026-11-22 · Week 36 hardening + Grade 10 source-level certification audit

### Week 36
- All five Comprehensive Final & Portfolio Defense lessons now mount `upper-science-v1` with exactly one canonical loader.
- Added cumulative integration maps, quantitative synthesis, protected final-exam reasoning strategy, correction/reassessment evidence, and portfolio-defense evidence ranking.
- Week 36 remains intentionally shorter than ordinary teaching weeks because it is an assessment/defense week rather than a new instructional unit.
- Confidential answer keys remain outside the public lesson layer.

### Inventory
- Repository tree verifies exactly **180 Biology 10 daily lesson pages**.
- All 36 week directories contain exactly five daily lessons.
- MID (Week 18) and FINAL (Week 36) are now explicitly represented in the canonical course-map unit registry.

### Certification finding
**SOURCE-LEVEL CERTIFICATION: HOLD — first-semester engine/contract coverage remains incomplete.**

Evidence:
- Representative Week 01 Day 02 verifies upper-science engine=true and strong phenomenon/worked/retrieval/evidence structure.
- Representative Day 02 checks for Weeks 02–17 show engine=false on every sampled page.
- Weeks 02–17 generally retain useful worked examples and mostly adequate content depth, but explicit phenomenon framing, retrieval, CER/evidence revision, source-quality work, and the canonical upper-science engine are inconsistent.
- Therefore the course inventory and second-semester hardening are not sufficient to claim 180/180 engine coverage.

### Verified boundary
- Inventory completeness: PASS (180/180 daily lesson files).
- Unit/week topology: PASS (36 weeks; MID and FINAL explicit).
- Weeks 18–36 hardening program: PASS at source level for canonical engine coverage on the pages directly hardened and verified in this program.
- Whole-course 180/180 upper-science engine coverage: HOLD.
- Whole-course source-level curriculum certification: HOLD.
- Browser/device certification, protected assessment security, transcript authority, accreditation, AP authorization, and jurisdictional credit approval remain separate and are not claimed.

### Required next action
- Harden Weeks 02–17 in two-week blocks using the fortified standard established for Weeks 24–35:
  - canonical upper-science engine,
  - substantive depth,
  - vocabulary-in-context,
  - source/evidence quality,
  - quantitative/model reasoning,
  - retrieval,
  - uncertainty/model limits,
  - misconception repair,
  - evidence revision and transfer.


## 2026-11-22 · First-semester certification recovery block 1 — Weeks 02–03

### Audit findings
- Weeks 02–03 already had strong substantive depth (~573–757 visible words) and sound worked biology content.
- All ten pages lacked the canonical upper-science engine.
- Explicit source/evidence-quality reasoning, retrieval, and evidence revision were inconsistent or absent.

### Repairs
- Mounted `upper-science-v1` on all ten Week 02–03 lessons with one canonical loader per page.
- Week 02 preserved and strengthened water polarity/hydrogen bonding, carbon bonding/diversity, formula/ratio reasoning, capillary-action investigation, and water/carbon synthesis.
- Week 03 preserved and strengthened macromolecule architecture, major macromolecule classes, quantitative data limits, molecular assembly/hydrolysis models, and structure–function synthesis.
- Added targeted evidence-quality/source boundaries, retrieval, and evidence revision without rewriting already-strong lesson depth.

### Verification
All ten pages verify:
- upper-science engine marker present,
- exactly one canonical loader,
- evidence-quality task present,
- intended retrieval/evidence-revision layer present where appropriate.

### Certification status
- Whole-course source-level certification remains HOLD until Weeks 04–17 are hardened and verified.
