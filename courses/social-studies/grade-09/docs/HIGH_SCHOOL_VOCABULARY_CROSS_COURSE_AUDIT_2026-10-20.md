# Khaemenes Academy — High School Vocabulary Cross-Course Audit
Date: 20 October 2026 · Scope: source-level inspection, not browser certification

## Grade 9 Social Studies: Weeks 12–18
- Verified each canonical weekly packet at `weeks/week-XX/student-packet.html` includes a highlighted vocabulary panel, practice link, and assigned terms.
- Six recorded glossary words per week:
  - 12: feudalism; manorialism; serf; guild; Magna Carta; representative institution
  - 13: civil-service examination; meritocracy; Neo-Confucianism; shogunate; tributary relations; commercialization
  - 14: tribute state; chinampa; quipu; ayllu; wayfinding; oral history
  - 15: Silk Roads; caravanserai; merchant diaspora; diffusion; interregional trade; commodity
  - 16: steppe; pastoral nomadism; Pax Mongolica; pandemic; demography; contingency
  - 17: comparison; causation; continuity; periodization; state capacity; historical argument
  - 18: retrieval practice; metacognition; stimulus-based question; constructed response; thesis; revision
- `resources/weekly-vocabulary.html` presents independent randomized six-term practice, printable review and export. It does not write to official course mastery.
- This pass made practice distinct and explicit in all seven packets: vocabulary practice cannot replace the official weekly quiz or unlock 80% gates.
- Week 18 is a cumulative laboratory with a different content structure, so its notification uses a separate insertion anchor.
- **Further work:** Verify that highlighted terms also occur and are explained in the reading itself, not only the glossary panel; check accessibility and real browser printing/export.

## Department inventory and gaps
| Department | Confirmed assets | Open verification |
| --- | --- | --- |
| Mathematics | `courses/mathematics/tools/vocabulary-studio.html`; unit-specific JSON banks; `courses/shared/math-lesson-vocabulary-link.js`; math vocabulary validators | Confirm every lesson displays the link, unit entries match lessons, and weekly practice works for every grade and course |
| English/Language Arts | `courses/language-arts/english-9/index.html` has vocabulary lesson data and vocabulary UI classes; supporting video library entry | Confirm consistently labeled weekly vocabulary practice across English 9–12; evaluate whether one practice system is reusable |
| Science | `courses/science/integrated-science-9/science-vocabulary-integration.js` implements a local practice result store and vocabulary support | Audit lesson-by-lesson mounting across all science grades; separate practice record from official evidence and grades |
| Social Studies 9 | `data/glossary.json`, `data/vocabulary-studio.json`, `resources/weekly-vocabulary.html` and weekly links | Verify all 36 weekly interactions in browser; make weekly highlighted words in narrative consistent |
| Social Studies 10 | Eight unit vocabulary JSON banks and links to shared vocabulary studio; larger official course quiz bank | Confirm weekly vocabulary practice is reliably presented for every week, independent of main 80% gate |

## Academy-wide implementation contract
1. Every lesson should surface a clearly labeled **Vocabulary & Practice** link, with at least the unit's key terms defined in context.
2. Each instructional week should offer a short practice quiz from that week's terms; shuffle questions and options where feasible, retaining correct keys.
3. Formative practice may show an 80% **practice target**, but cannot write verified course mastery, unlock the next lesson, or set the official academic grade.
4. Official 80% mastery is evaluated only through the course's established graded gates; never infer official mastery from vocabulary practice.
5. Keep one shared vocabulary data model and UI design where possible; adapt subject banks instead of duplicating rival dictionary apps.
6. Translation fields must be reviewed; do not imply English terms were translated when no translation exists.
7. Print/export should include learner name, grade, unit, week, date, and source term evidence, while respecting offline and small-screen accessibility.

## Follow-up priority
1. Grade 9 Weeks 12–18: confirm highlighted terms inside instructional paragraphs and inspect practice browser interaction.
2. Grade 10: validate weekly term banks and practice buttons across all 36 weeks.
3. Math, English, and Science: programmatic lesson coverage inventory, then surgical repair of missing weekly links and practice widgets.
4. Create cross-course automated tests for links, bank presence, formative/mastery separation, option-key validity, and 255px layout.

This audit describes observed source evidence only. It does not certify live browser behavior or every lesson in English, Math, and Science.
