# Khaemenes Academy — High School Vocabulary Forensic Reaudit
Date: 2026-10-25
Branch: main
Scope: source-level audit of current high-school vocabulary architecture. This is not live-browser certification.

## Baseline strengths
- English 9–12 each have 12 unit vocabulary banks and a four-grade regression that verifies 36 weeks per grade, assigned-term mapping, usable definitions, six-card candidates, and distinct distractor pools.
- Core Mathematics has extensive unit dictionaries and dedicated validators; the lesson vocabulary bridge is present across at least 372 lesson pages and routes learners into the shared Vocabulary Studio.
- Social Studies 9 has a canonical glossary/vocabulary-studio dataset and weekly practice; Social Studies 10 has eight unit vocabulary banks spanning the 36-week course.
- Vocabulary Studio explicitly keeps its practice formative and separate from official mastery records.

## Five current bubbles

### Bubble 1 — Upper Science has no canonical vocabulary-bank pathway
The repository tree contains a dedicated Grade 9 science vocabulary integration, but no canonical vocabulary JSON or shared Vocabulary Studio course route for Biology 10, Chemistry 11, or Physics & Engineering 12. These courses contain substantial discipline-specific language in lessons and course maps, yet that terminology is not represented in the same searchable, reusable bank architecture used by English, Mathematics, and Social Studies.

Evidence:
- Science 9: `courses/science/integrated-science-9/science-vocabulary-integration.js`
- Biology 10 canonical vocabulary files found: 0
- Chemistry 11 canonical vocabulary files found: 0
- Physics 12 canonical vocabulary files found: 0
- Shared Vocabulary Studio course selector has no Biology, Chemistry, or Physics entries.

Risk: students lose a consistent vocabulary study/search/practice path precisely where technical terminology becomes more specialized.

### Bubble 2 — Social Studies 11–12 are outside the canonical vocabulary system
Grade 9 has glossary + vocabulary-studio data and Grade 10 has eight unit vocabulary banks. The recursive tree shows no corresponding canonical vocabulary files for Grade 11 or Grade 12.

Evidence:
- Grade 9: `data/glossary.json`, `data/vocabulary-studio.json`
- Grade 10: `units/unit-01` through `unit-08/vocabulary.json`
- Grade 11 canonical vocabulary files found: 0
- Grade 12 canonical vocabulary files found: 0
- Vocabulary Studio selector currently exposes only Social Studies 9 and 10.

Risk: the high-school history/civics pathway loses continuity in the upper grades and cannot provide one searchable longitudinal terminology record.

### Bubble 3 — Mathematics vocabulary is lesson-accessible but not week-specific
The mathematics lesson bridge sends only `course` and `unit` to Vocabulary Studio:
`?course=<course>&unit=<unit>`
It does not send a week or lesson identifier. Vocabulary Studio also hides its Week control for Mathematics.

The current validators correctly prove lesson-to-unit dictionary access, but they do not prove weekly lesson-specific vocabulary practice.

Evidence:
- `courses/shared/math-lesson-vocabulary-link.js` extracts course + unit only.
- `tools/validate-math-lesson-vocabulary.mjs` verifies unit dictionary existence and route correctness.
- Vocabulary Studio exposes weekly practice only for English and Social Studies.

Risk: a learner entering from a specific Math lesson receives the whole unit dictionary instead of the six or so terms most relevant to that lesson/week. This weakens retrieval practice and increases unnecessary vocabulary load.

### Bubble 4 — English vocabulary can pass regression while still carrying draft review status
English has strong structural coverage, but the representative canonical bank inspected is explicitly:
- `status: "draft-for-educator-review"`
- term-level `reviewStatus: "editorial-draft"`
- `enrichmentStatus: "editorial-draft"`

The four-grade regression verifies mapping, definitions, weekly counts, and distractor availability, but does not require an educator-reviewed status or a review provenance field.

Evidence:
- `courses/language-arts/english-9/units/unit-01/vocabulary.json`
- `tests/vocabulary-studio-four-grade-regression.cjs`

Risk: technically complete vocabulary can be treated as release-ready even when editorial/educator review is still outstanding. This is a governance gap, not a missing-data gap.

### Bubble 5 — Vocabulary regression is fragmented by subject rather than academy-wide
Current automated protection is strong where it exists:
- Math has `validate-math-vocabulary.mjs` and `validate-math-lesson-vocabulary.mjs`.
- English has `vocabulary-studio-four-grade-regression.cjs` and a dedicated workflow.

But there is no single high-school vocabulary regression that inventories all active departments and fails when a grade has no canonical bank, no lesson link, no week mapping, or unresolved draft/review metadata.

The older cross-course audit explicitly called for cross-course automated tests, but the current test surface still remains split by department.

Risk: whole-grade omissions such as Science 10–12 and Social Studies 11–12 can survive even while existing subject-specific CI is green.

## Recommended surgical order
1. Create one academy-wide vocabulary inventory/validator first so new repairs become regression-protected.
2. Bring Biology 10, Chemistry 11, and Physics 12 into a canonical vocabulary-bank schema and shared Studio route.
3. Add Social Studies 11–12 canonical banks and weekly mappings.
4. Add week/lesson metadata to Mathematics vocabulary routing so lesson links open focused terms and weekly formative practice.
5. Add review-status/provenance requirements to English vocabulary validation, then review/promote banks systematically.

## Certification boundary
This audit is source-level only. It does not certify keyboard behavior, browser persistence, print/export, mobile layout, audio, or live randomized practice behavior.


## Bubble 5 repair — Academy-wide vocabulary regression
Status: **Closed at source/CI level on 2026-10-25**

Implemented:
- `tools/audit-high-school-vocabulary.mjs`
- `.github/workflows/high-school-vocabulary-forensic-audit.yml`

The validator now treats confirmed English 9–12, Mathematics, Social Studies 9–10, Science 9, shared Studio presence, and formative/mastery separation as required coverage. Known gaps remain explicit tracked warnings rather than silently passing:
- Biology 10 canonical vocabulary pathway
- Chemistry 11 canonical vocabulary pathway
- Physics 12 canonical vocabulary pathway
- Social Studies 11 canonical vocabulary pathway
- Social Studies 12 canonical vocabulary pathway
- Mathematics week/lesson-specific vocabulary routing
- missing shared Studio routes for those open courses

The workflow reruns the existing English and Mathematics vocabulary regressions after the academy-wide audit.

GitHub Actions result:
- **High School Vocabulary Forensic Audit · run 1: SUCCESS**
- Commit under test: `ff383a131a19cd3d09335aebc3280ed18636b826`

This closes the fragmented-regression bubble while preserving the remaining known gaps as visible technical debt. Live-browser vocabulary certification remains separate.
