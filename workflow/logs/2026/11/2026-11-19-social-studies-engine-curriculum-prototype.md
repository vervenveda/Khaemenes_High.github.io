# Social Studies Engine v0.1 · Curriculum-specific prototype and Grade 9 pilot

Date: 2026-11-19 ET  
Repo: vervenveda/Khaemenes_High.github.io

## Initial request
Create a fourth teaching engine for Social Studies, customized to the actual Academy curriculum and consistent in accessibility/navigation with the existing Mathematics, English and Science engines, without replacing working packets or assessments.

## Forensic source inspection
Examined actual Grade 09–12 first-week student packets and main course page titles. Found four distinct models:
- **Grade 09:** Global Studies Honors, *How We Know the Past*. Original interactive five-day task player: Read, Practice, Write, Check for each day, with learner-scoped native records, simulated fictional meeting dossiers A–F, evidence ledgers, spatial map, corroboration, revision and native portfolio/weekly checks.
- **Grade 10:** United States History Honors, *History, Memory, and the American Story*. Source comparison between Indigenous oral tradition, archaeology and a European map, timeline/geography, data uncertainty, evidence-based seminar and weekly quiz.
- **Grade 11:** Government, Law & Economics Honors, *Civic Inquiry and Constitutional Citizenship*. Civic Claim Audit, public records, source authority, a five-column evidence table, civic seminar, rights and responsibilities, native policy and economic work.
- **Grade 12:** Global Politics, International Relations & Senior Research Honors, *Senior Inquiry and the Social Sciences*. Comparative social-scientific method, UN development data, constitutions, election records, public-opinion evidence, research notebook, assessed senior assignments and capstone.

The Grade 09 legacy Week 1 redirect `grade-09/week-01/student-packet.html` is **not** the authoritative teaching workspace; the canonical packet is `grade-09/weeks/week-01/student-packet.html`.

## Changes committed
- `eefcdb4`: `courses/shared/social-studies-lesson-engine-v0.1.js` contains four separate curriculum configurations, the five-stage inquiry guide, an optional Source Analysis & Corroboration Studio, and CSS scoped only inside the new engine.
- `4fd3d56`: safely supports an isolated workflow preview for all four grades, without pretending that Grade 10–12 share Grade 09's native day/phase controls.
- `7b6c57e`: `workflow/engines/social-studies/social-studies-engine-prototype-v0.1.html` demonstrates the four different paths and links to their authoritative original Week 1 packet.
- `65bc406`: `courses/social-studies/grade-09/weeks/week-01/student-packet.html` has one opt-in body dataset marker and one versioned script reference. All original sections, source dossiers, existing Grade 09 state engine and assessment controls are preserved.
- `dc4064c`: `workflow/blueprints/khaemenes-social-studies-lesson-engine-blueprint-v0.1.md` records research-informed sequencing, explicit four-course curriculum and safeguards.
- `4b7b5ac`: `tools/test-social-studies-lesson-engine-v0.1.mjs` tests original 20 day/phase sections and their authority, historical source provenance boundaries, four course config entries and no storage/grade capability.
- `e2484e1`: `.github/workflows/social-studies-lesson-engine-pilot.yml` runs syntax and source contract checks on future changes.

## Explicit ownership limits
**Instruction:** New guide may advise on how to source, corroborate, argue and revise. In Grade 09, its stage buttons simply click the original native day and phase controls, so the existing application retains all state/progress authority.  
**Evidence:** Scratchpad is temporary and ungraded. Existing source analysis, writing, export, portfolio and correction forms remain authoritative.  
**Assessment:** No grade, course mastery, 80% gate, history, midterm/final, or official assessment bank was changed.  
**Provenance:** The Grade 09 fictional meeting is clearly simulated; never misrepresent it as an actual historical record.  
**Chrome:** No global regulator, duplicate tickers, header, hamburger, footer or ecosystem toolbar was created. No edit to Vervenveda index.

## Source verification and acceptance holds
- Verified the pilot's opt-in and shared script exist through GitHub contents API.
- Re-fetched the script and confirmed JavaScript parse succeeds.
- Found native Grade 09 Day 1–5 and all 20 `data-day`/`data-phase` sections in the canonical source.
- Automated source test and CI workflow are committed; successful GitHub Actions conclusion **not observed** in this conversation.
- Browser/device acceptance (learner gate, original saved work, focus, print, keyboard navigation, tablet portrait/landscape, offline, view consistency) is **HOLD**, not claimed passed.
- Grade 10–12 prototypes are **not mounted** on production instructional packets; their custom adapters need separate curriculum/source mapping and browser acceptance.

## Next step
Proof the live Grade 09 Week 1 engine in browser using a synthetic authorized student; validate original day/phase state and learner evidence retention, then adapt the upper-grade course packet structures separately.


## Grade 10–12 source integration follow-up

After the Grade 09 proof-of-concept, the Social Studies inquiry engine was attached to Week 01 instructional packets in all four high-school grades:

- `4c588c3`: shared engine resolves verified Grade 10–12 native Monday–Friday lesson sections via exact heading matches and fail-open behavior; Grade 09 day/phase click authority retained.
- `ec4b265`: Grade 10 original Week 01 U.S. History packet opt-in.
- `f51b12f`: Grade 11 original Week 01 Government, Law & Economics packet opt-in.
- `dcf5f65`: Grade 12 original Week 01 Global Politics, International Relations & Senior Research packet opt-in.
- `fe97870`: Grade 09 packet refreshed to the updated shared engine version.
- `e786319`: workflow four-grade demo refreshed to the same shared version.
- `bc05f64`: source regression test now verifies all four Grade 09–12 packet registrations, original native Monday–Friday headings, and failed-match safety.
- `892bbd5`: CI path filters cover all four updated instructional packets.

Re-fetched live sources and confirmed opt-in/script tags in each, confirmed exact five weekday heading matches for all three upper-grade packets, and parsed shared engine successfully. Existing HTML learning tasks, saved work owners, formative evidence adapters, question banks, and mastery authority were not rewritten. This is **Week 01 only**; broad auto-injection across 36 weeks is not authorized. CI job success, browser/device acceptance, and learner record regression remain outstanding.
