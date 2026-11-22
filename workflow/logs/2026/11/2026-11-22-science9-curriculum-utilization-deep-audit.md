# Science 9 Curriculum Utilization Deep Audit · 2026-11-22

## Purpose

Verify whether the International Integrated Science 9 curriculum is merely present in repository source or is actually represented and utilized through the Science 9 lesson engine.

## Course topology verified

- 36-week course.
- Unit 00 Readiness: 5 daily lessons.
- Unit 01 Scientific Inquiry: 10 daily lessons.
- Units 02–12: 15 daily lessons each.
- Total daily learning destinations: **180/180 present**.
- Missing daily lesson pages: **0**.

## Curriculum spine

The course remains genuinely integrated across:
- scientific inquiry and measurement;
- cells and life systems;
- body systems and homeostasis;
- cell division, reproduction and inheritance;
- ecosystems, evolution and biodiversity;
- atomic structure and periodic patterns;
- bonding, reactions and matter;
- motion, forces and energy;
- electricity, waves and information;
- Earth systems and biogeochemical cycles;
- dynamic Earth, climate and space;
- sustainable engineering capstone.

The sequence is coherent and consistent with the Course Charter's stated interdisciplinary purpose.

## Whole-course source utilization metrics

The repository-wide scanner inspected all 180 daily destinations.

| Curriculum element | Lessons containing it |
|---|---:|
| Daily objectives | 180 / 180 |
| Quantitative/data work | 180 / 180 |
| Formative check | 180 / 180 |
| Safety boundary | 180 / 180 |
| Standards/alignment | 180 / 180 |
| Mentor support | 180 / 180 |
| Differentiation | 180 / 180 |
| Investigation/lab/data/simulation | 172 / 180 |
| Evidence/portfolio handoff | 178 / 180 |
| Retrieval | 157 / 180 |
| Misconception work | 148 / 180 |
| Vocabulary explicitly surfaced | 138 / 180 |
| Essential question explicitly surfaced | 136 / 180 |
| Phenomenon/observation hook explicitly surfaced | 110 / 180 |
| Worked example explicitly surfaced | 110 / 180 |
| Source/citation visibility | 83 / 180 |
| Explicit CER / constructed scientific explanation marker | 9 / 180 |
| Teacher/parent guidance explicitly surfaced | 3 / 180 |

**Important interpretation:** these are source-visible markers, not proof that an idea is entirely absent where the marker is missing. They identify where the curriculum is not explicit enough for deterministic lesson-engine representation.

## Engine utilization finding

Before this audit:

- Shared Science 9 engine mounted lessons: **1 / 180**
- Engine coverage: **0.6%**
- Only mounted destination:
  `units/unit-01/lessons/day-01.html`
- Curriculum-rich lessons not mounted to the engine: **169**

This is the central finding.

### Conclusion

**The Science 9 curriculum is substantially built, but it is not yet truly utilized by the shared Science 9 lesson engine across the course.**

The current engine remains a Unit 01 Day 01 pilot. It cannot be treated as the course-wide Science 9 instructional engine yet.

## Five major bubbles

### Bubble 1 · Engine coverage is effectively pilot-only

Only 1/180 daily destinations uses the shared engine.

Recommendation:
- do not bulk-mount the current Day-01-specific engine;
- first separate generic curriculum representation from Day-01-specific supplements;
- then migrate unit-by-unit against an explicit semantic contract.

### Bubble 2 · Canonical map underrepresented Readiness and Unit 01

The top-level course map had empty `objectives` and `framework_tags` arrays for Unit 00 and Unit 01 despite rich authoritative pacing/standards documents.

Repair completed:
- populated Unit 00 objectives/framework tags from existing readiness curriculum;
- populated Unit 01 objectives/framework tags from `STANDARDS_MAPPING.md` and the Unit 01 pacing/evidence contract.

No new subject matter was invented.

### Bubble 3 · Essential questions and phenomena are unevenly explicit

Whole-course source scan:
- essential question: 136/180;
- phenomenon/observation hook: 110/180.

Examples:
- Unit 02 and Unit 03 have strong lesson bodies but few/no explicit “Essential question” markers.
- Later units generally improve consistency.

Recommendation:
- move weekly/unit essential questions into authoritative daily lesson metadata/DOM;
- preserve lesson-specific hooks rather than generating generic phenomena in the engine.

### Bubble 4 · Explanation/CER and teacher guidance are underrepresented

The scanner found:
- explicit CER/scientific-explanation markers on 9/180 lessons;
- explicit teacher/parent guidance on 3/180.

This does **not** mean only nine lessons contain reasoning. Many lessons contain explanation/retrieval/evidence work under other names. It means the engine cannot reliably identify explanation/revision or educator guidance from the current markup.

Recommendation:
- add explicit semantic representation for explanation/CER/limitations/revision;
- map existing teacher scoring guides and pacing notes into daily educator guidance where appropriate;
- keep educator guidance non-student-authoritative.

### Bubble 5 · Vocabulary, worked examples and source visibility are inconsistent

Whole-course:
- vocabulary explicitly visible: 138/180;
- worked examples explicitly visible: 110/180;
- source/citation visibility: 83/180.

Recommendation:
- every lesson should expose its vocabulary and worked reasoning intentionally;
- source-dependent claims/data/images should expose source/citation metadata;
- lesson engine should present these existing elements, never fabricate missing sources.

## Depth pattern

The audit confirms strong depth in early units:
- Unit 01 average source-visible lesson depth ~1439 words;
- Unit 02 ~1335 words;
- Unit 03 ~1498 words.

Later units are more compact, generally around ~590–700 source-visible words per lesson while carrying more standardized headings and repeated structures.

This is not automatically a defect. It is a signal that later units need deeper qualitative review for whether concise pages contain enough actual teaching, modeling and application rather than merely the expected section names.

## Architecture requirement before rollout

The current Science 9 engine contains Day-01-specific instructional supplements:
- Observe → Predict → Test;
- fictional paper-helicopter dataset;
- fixed reasoning checks;
- a Day-01-specific CER studio.

Those cannot safely be reused across all 180 lessons.

The next engine revision should therefore:
1. preserve the Day 01 pilot;
2. add a generic curriculum-inspection/representation contract;
3. allow lesson-specific source content to declare objective, essential question, phenomenon, vocabulary, model, quantitative task, investigation, misconception, retrieval, explanation/CER, evidence, differentiation, teacher guidance and standards;
4. make those semantic markers authoritative over heading guesses;
5. keep grading, mastery, storage, learner records, page chrome and course routing outside the engine;
6. migrate one complete unit at a time.

## New permanent audit

Added:
`courses/science/tools/audit-science9-curriculum-utilization.mjs`

CI:
`.github/workflows/science9-curriculum-utilization.yml`

The audit measures all 180 daily destinations and reports engine coverage and curriculum representation by unit.

## Validation

PASS:
- Science 9 Curriculum Utilization Audit;
- Science 9 Lesson Engine Pilot Integrity;
- Science 9 learner journey regression;
- Science Student Experience Regression;
- Grade 09 Science and English Readiness UI;
- No Page Regulator Regression;
- Public Entry Route Validation.

Some unrelated repository-wide workflows remain failing from pre-existing English/Social Studies/general architecture conditions; they are not caused by this Science 9 audit.

## Status

**AUDITED · CURRICULUM SUBSTANTIALLY PRESENT · ENGINE UTILIZATION INCOMPLETE (0.6%) · UNIT-BY-UNIT ENGINE MIGRATION REQUIRED**
