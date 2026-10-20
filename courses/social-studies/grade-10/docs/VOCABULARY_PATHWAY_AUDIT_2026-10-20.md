# High School Vocabulary Pathway — forensic source audit
Date: 2026-10-20
Repository: vervenveda/Khaemenes_High.github.io (main)
Scope: complete Grade 10 U.S. History vocabulary route, Grade 9 glossary structure, representative English/Math/Science lessons.

## Grade 10 — verified full 36-week pathway
- All 36 canonical `week-XX/student-packet.html` pages contain visible Vocabulary Studio buttons and weekly vocabulary sections; all retain quiz sections.
- Buttons target `courses/mathematics/tools/vocabulary-studio.html?course=social-studies-10&unit=NN&week=W` using correct relative paths. Unit sequence: weeks 1–4 Unit 01; 5–8 Unit 02; 9–13 Unit 03; 14–18 Unit 04; 19–23 Unit 05; 24–28 Unit 06; 29–33 Unit 07; 34–36 Unit 08.
- All eight unit vocabulary JSON files exist; entries by unit: 20, 20, 25, 25, 25, 25, 25, 15 (180 entries total). All 36 weeks represented. No empty definitions or duplicate term labels within individual unit banks found in the source scan.
- Shared Studio includes a five-question vocabulary matching exercise when a `week` query parameter is supplied. Questions randomize term and choice order; 80% is an explicitly **formative practice target**. The exercise does not update the official weekly course quiz, teacher grade, or mastery gate.
- Caveat: five definition-matching items are **not sufficient to prove contextual vocabulary mastery**. A larger, peer-reviewed question bank with source-based application, contextual sentences, and plausible distractors is recommended. No live browser form/persistence/print test performed.

## Grade 9 Global Studies — existing infrastructure and repair
- Existing `courses/social-studies/grade-09/data/vocabulary-studio.json` contains 218 entries, with `weeks: [n]` metadata (rather than `week: n`).
- Each week 1–36 has at least six assigned terms, enough for the current five-term formative quiz.
- On this audit pass the shared Vocabulary Studio was repaired to handle either singular `week` or array-valued `weeks`; Grade 9 formative weekly quizzes can now appear through existing `course=social-studies-09&week=W` links.
- This shared change does not affect official progression records.

## Cross-subject preliminary lesson sample
- Mathematics: `courses/mathematics/algebra-1/units/unit-01/lessons/lesson-01-algebraic-habits-notation-mathematical-argument.html` does not directly load `courses/shared/math-lesson-vocabulary-link.js`; the shared helper exists elsewhere. Verify whether a parent/bridge dynamically injects it before declaring the lesson button absent.
- Science: `courses/science/integrated-science-9/units/unit-01/lessons/day-01.html` does not directly load `science-vocabulary-integration.js`; a science vocabulary tool exists separately. Verify any runtime injection, then repair missing visible links as needed.
- English: `courses/language-arts/english-10/weeks/week-01/monday/index.html` teaches vocabulary in its content, but the sample did not show a direct link to the shared cross-subject Studio. Grade 9's large course portal also has its own vocabulary presentation. English needs a dedicated integration survey before assuming standardized buttons or quizzes exist.
- These cross-subject observations are **samples only**, not a complete lesson-by-lesson certification.

## Next prioritized repair sequence
1. Use browser checks for Grade 10 Week 1/13/19/36 and Grade 9 Week 1/18/36: resolve shared Studio assets, show term cards, randomize practice safely, and print without clipping.
2. Audit the actual English, Math, and Science course entry points and dynamic script loaders before injecting buttons; preserve existing working integrations and page layouts.
3. For each subject and grade, compare highlighted lesson terms against the appropriate bank; validate minimum coverage, repeated terms, answer-key correctness, and factual explanations.
4. Keep formative vocabulary scores **separate** from official course mastery. Any future policy to gate on vocabulary must be separately specified, tested, and teacher-approved.
5. Expand contextual question quality and source-specific examples, especially for primary/secondary sources and historically contested terms.

Do not treat this source-level audit as proof of browser rendering or full instructional coverage across all high-school subjects.
