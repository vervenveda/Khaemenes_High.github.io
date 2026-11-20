# Social Studies Lesson Engine — Week 03 Integration
Date: 2026-11-19 ET
Repository: vervenveda/Khaemenes_High.github.io

## User-authorized scope
Continue **one week at a time** after Week 02. This change integrates Week 03 only in Grades 9–12. Weeks 4 onward remain untouched.

## Original Week 03 curriculum verified by opening each source packet
- **Grade 09 — Early Humanity and the Agricultural Revolution.** The essential question asks whether farming improved human life or traded freedoms for security and inequality. Five native daily lessons study mobility/adaptation, early village material evidence, independent domestication, surplus/specialization/unequal access, and a mastery audit.
- **Grade 10 — Revolution, Independence, and Competing Liberties.** The original source study compares the Declaration of Independence, a Loyalist response, an enslaved petition for freedom, and a Haudenosaunee diplomatic position. The essential question considers who natural-rights claims included and excluded. Two distinct Week 03 packet paths exist and were both updated.
- **Grade 11 — Declaration, Revolution, and the Articles.** The original Grievance to Principle evidence lab classifies Declaration grievances and compares them with the Articles of Confederation; the curriculum studies principles, central capacity, state autonomy and unfinished equality.
- **Grade 12 — Power, Authority, Legitimacy, and Sovereignty.** The source laboratory compares Weber's types of authority, constitutional preambles and recognition of states. The original third assignment is the 40-point power and legitimacy concept application essay.

## Engineering changes
- Shared `courses/shared/social-studies-lesson-engine-v0.1.js` now has a `WEEK03` configuration specific to the four courses and maps to the *exact existing headings* in each Week 03 packet. Distinct Grade 09 Week 1 original phase-player, Week 02 geography, and Week 03 archaeology adapters remain isolated.
- Five Week 03 packet files received only an explicit `data-social-studies-engine` body marker and the shared engine's versioned import (`20261119-social-studies-week03-v4`). Grade 10's two original paths `week-03/` and `weeks/week-03/` were both covered.
- The four Week 01 and five Week 02 packet files plus workflow demonstration had their existing engine import version refreshed for consistency; no original lesson content/assessment changed.
- Existing regression tests for Weeks 01–02 were aligned to the new script version.
- `tools/test-social-studies-week03-engine.mjs` added checks for all five Week 03 files, 25 native weekday headings, the four original curriculum topics, fail-open missing-heading behavior, and no independent persistence.
- `.github/workflows/social-studies-lesson-engine-pilot.yml` expanded to run the Week 03 test and watch five Week 03 packet files.

## Source verification completed
The post-commit GitHub contents API re-read confirmed all five Week 03 grade opt-ins, shared script versions, five native headings per packet, and unchanged formative evidence imports. Shared JavaScript parsed successfully; Grade 09 Week 01's original entry gate and phase controls remain. No assessment scoring, 80% mastery gates, learner evidence storage, packet writing controls, source assignments, or Vervenveda index altered.

## Holds
- CI workflow jobs **committed; no successful job conclusion observed**.
- Authenticated browser, question navigation, individual learner evidence, keyboard accessibility, print layout, tablet portrait/landscape, offline cache, and actual grade-portal routes are **not browser-verified**.
- Week 04 is **not** authorized for automatic injection. Audit its real packet structure before proceeding.

## Key commits
Shared engine `1b3906b`. Week 03 packets `83b8d57`, `db22e14`, `6c0f7c9`, `f52f0b6`, `a5ac16a`. Tests `1619222`, CI `67c4bc0`. Cache refreshes and prior regression updates committed separately.
