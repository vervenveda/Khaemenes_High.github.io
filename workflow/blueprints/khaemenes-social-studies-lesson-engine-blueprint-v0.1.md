# Khaemenes Social Studies Lesson Engine v0.1 · Curriculum-First Blueprint

**Academy:** Verve N Veda · Khaemenes Academy High School  
**Date:** 2026-11-19 (ET)  
**Prototype:** `workflow/engines/social-studies/social-studies-engine-prototype-v0.1.html`  
**Pilot:** `courses/social-studies/grade-09/weeks/week-01/student-packet.html`  
**Shared source:** `courses/shared/social-studies-lesson-engine-v0.1.js`  
**Status:** Grade 9 Week 1 opt-in mounted in source; CI/browser acceptance HOLD; Grade 10–12 preview only.

## Original curriculum audit and distinct pathways

| Grade | Existing course / first-week work | Engine specialization | Authoritative course elements |
|---|---|---|---|
| 09 | Global Studies Honors · *How We Know the Past* | Historical Inquiry & Source Laboratory | Fictional meeting records A–F, contextualization, corroboration, map/line-of-sight, initial and revised evidence ledgers, original 5 days × Read/Practice/Write/Check |
| 10 | United States History Honors · *History, Memory, and the American Story* | Historical Evidence, Timeline & Geography Studio | 1491 historical evidence comparison, Indigenous oral history, archaeological evidence and European maps, timeline/map/data interpretation, evidence-based argument, original weekly quiz |
| 11 | Government, Law & Economics Honors · *Civic Inquiry and Constitutional Citizenship* | Constitutional Case & Public Policy Studio | Civic Claim Audit, source authority, constitutional republic, public records, five-column evidence table, seminar and counterclaim, original economic and civic assessments |
| 12 | Global Politics, International Relations & Senior Research Honors · *Senior Inquiry and the Social Sciences* | Comparative Research & Diplomatic Analysis Studio | United Nations development indicators, constitutions, election records, public opinion, comparative method, senior research notebook, constructed response, corrections and capstone |

**The weekly packets are the source of truth.** Grade 09 has a genuinely interactive day/phase workspace and its learner-scoped save/export controls, not merely a static printable document. Grade 10–12 have different weekly schemas; a future adapter must map their real sections and policies explicitly.

## Five historical/social-scientific inquiry stages

The engine uses a consistent methodology but grade-specific instructions:

1. **Frame an investigable question** — chronology, actors, geography, concepts, initial interpretations.
2. **Source and contextualize** — authorship, provenance, time, purpose, audience, authority; distinguish primary/secondary and official/nonofficial records.
3. **Corroborate and compare** — independent source testing, historical systems, maps, quantitative evidence, causal alternatives, economics or geopolitical case comparisons.
4. **Argue and deliberate** — defensible claim, cited evidence, counterclaims, missing evidence, ethical distinction between descriptive and normative conclusions. Respectful, nonpartisan discussion does not prohibit evaluating a factual claim.
5. **Synthesize, revise, retrieve and correct** — return to an earlier interpretation and undertake the course's existing assessment, evidence correction, seminar or capstone checkpoint.

These are instructional organization stages, **not five new assessments** or substitute progression gates.

## Student-facing optional studio
The **Source Analysis & Corroboration Studio** opens in a native `<details>` accordion. Its three scratch fields ask for source/context, evidence/corroboration, and counterclaim/limits. They are ephemeral, explicitly ungraded and have no autosave. Students must use the existing official portfolio/evidence forms to preserve their work.

**Historical accuracy protection:** The Grade 9 Week 1 packet explicitly labels meeting-room documents as **fictional simulated sources**. Never display those documents as real historical evidence; never fabricate quotations, dates, eyewitness accounts, source provenance, or historical certainty. Grade 10–12 refer to *the kinds of evidence described in the existing packets*, not synthetic extracts falsely attributed to archives.

## Native adaptation and authority
- Grade 09 adapter activates only on `body[data-social-studies-engine="9"]` where verified `main.workspace`, day buttons, phase buttons and source pack exist. It adds one scoped guide **before** the original Choose Day bar. Selecting an engine stage invokes the **existing** day and phase buttons. It does not independently select, save, unlock or grade student tasks.
- Grades 10–12 are configured in the same reusable source for preview only. A later per-grade pilot should use each packet's actual headings and existing day structure, **not** blindly copy the Grade 09 adapter.
- The workflow HTML preview intentionally contains an inert stand-in packet with links to the real Week 1 files and no authorized student profile. The preview uses the same code with `data-social-studies-demo`.
- If expected DOM controls are missing the engine fails open to the unchanged original packet.
- No new ticker, header, hamburger, footer, class-toolbar, ecosystem toolbar, page regulator, or shared global CSS is injected. CSS is within the engine's single scoped source.
- Minimum interactive text 16px, Cinzel headings, charcoal/cream, 7px corners, keyboard-operable buttons, aria-current and clear ungraded status. Safety, source provenance and assessment notices remain visible inside the original packet.

## Mastery and persistence firewall
- No browser persistence, no storage read/write, no network requests, no form submissions and no learner-record mutation by the new engine.
- No change to original `week01-workspace.js`, `grade09-entry-gate.js`, `high-school-formative-evidence-v1.js`, assessment adapters, answer banks, graduation thresholds or course curricula.
- Guide stage count indicates **instructional location only**, never completion or 80% mastery.
- Existing day-level learner saves and assessment controls remain the sole authority.
- No change to the fragile Vervenveda index or Academy universal chrome.

## Acceptance criteria and HOLD
1. `node --check courses/shared/social-studies-lesson-engine-v0.1.js`
2. `node tools/test-social-studies-lesson-engine-v0.1.mjs`
3. In Grade 9 signed-in browser: readiness gate still works, original Day 1–5 and Read/Practice/Write/Check state remains correct, all 20 native phases exist, all original source records A–F are reachable, evidence ledgers and exports are untouched.
4. Test stage-to-native button activation, focus/scroll, document printing, no data writes from scratchpad, tablet portrait/landscape, page chrome parity and browser refresh.
5. Review pilot content with the existing Week 1 evaluator guide, and confirm the selected navigation stage corresponds to a genuine native instructional task.
6. Only then adapt Grade 10 historical sequence, Grade 11 civic casework and Grade 12 research practice individually. No automatic all-week rollout.

## Source-specific content boundaries
Course curriculum was inspected directly from repository originals on November 19, 2026. The engine **does not claim that the four courses have identical assignments or assessment authorities**; the explicit four-grade maps are based on existing Week 1 source headings and named source activities.


## Integration update · 2026-11-19 · Week 01 across all four grades

The shared engine now has explicitly verified, fail-open adapters for all four existing first-week student packets, rather than just a Grade 09 pilot. Grade 09 continues using the original day and phase button events. The additional grade configurations each map their five inquiry stages to the actual first-week Monday–Friday lesson headings in the existing HTML:
- Grade 10 `courses/social-studies/grade-10/week-01/student-packet.html` — original five `article.lesson` blocks.
- Grade 11 `courses/social-studies/grade-11/weeks/week-01/student-packet.html` — original five `section.card` day blocks.
- Grade 12 `courses/social-studies/grade-12/weeks/week-01/student-packet.html` — original five day `article` blocks in Five-Day Sequence.

The engine does **not** hide, replace or submit original forms. It scrolls to the corresponding native instructional block. Missing or renamed lesson headings prevent the engine from mounting, leaving the original packet fully available. Four grade scripts use the same versioned owner `social-studies-lesson-engine-v0.1.js`, with version token `20261119-social-studies-all-grades-v2`.

This implementation is **Week 01 in all four grades**. Week 02 onward has not been automatically altered; it needs individual packet-schema checks, particularly because course themes and evidence assignments change weekly.

The four-grade regression test and GitHub workflow were extended to cover exact native Monday–Friday headings and opt-in markers. Source checks and JS parse passed in the connector session. Browser rendering and GitHub Actions job conclusion remain unverified.


## Week 03 integration update · 2026-11-19

The reusable shared engine now contains three **explicitly separate week contexts**, not a blanket page regulator: Week 01 original paths, Week 02 curriculum-specific guidance, and Week 03 curriculum-specific guidance. Week 03 is installed on:
- Grade 09: `grade-09/weeks/week-03/student-packet.html` — early humanity, archaeology, domestication, agricultural change, inequality.
- Grade 10: `grade-10/week-03/student-packet.html` **and** `grade-10/weeks/week-03/student-packet.html` — revolution, competing liberty claims, Declaration/Loyalist/enslaved/Haudenosaunee sources.
- Grade 11: `grade-11/weeks/week-03/student-packet.html` — the Declaration, Articles, grievances, constitutional government and unfinished equality.
- Grade 12: `grade-12/weeks/week-03/student-packet.html` — power, authority, legitimacy, sovereignty, Weber and constitutional preambles.

Each packet retains the five original daily `h3` lesson targets and the existing `high-school-formative-evidence-v1.js`. Engine progression only scrolls to native content; its Source Analysis & Corroboration Studio remains ungraded and temporary. Incorrect or missing headings cause the enhanced guide to abstain and leave the original packet accessible.

`tools/test-social-studies-week03-engine.mjs` and the expanded Social Studies CI workflow provide regression coverage; source syntax and five packet/25 heading checks were verified after commit. Do not claim browser or CI success until those results are available. Week 04 onward is not integrated.

## End-of-course integration contract · 2026-11-19

**Current source coverage:** 143 of 144 grade/week entries (178 original HTML packet paths) for the four 36-week High School Social Studies courses. All existing first-week through final-week packet files except **Grade 09 Week 27** have the shared engine import and grade opt-in. The missing Week 27 is explicitly a **HOLD**, not a passing course.

**Weeks 04–36 behavior:** Rather than copying five generic headings or overwriting original curriculum, the engine detects the approved grade-specific student packet route, reads the current weekly title and essential question from the original DOM where available, resolves the original **five Monday–Friday H3 headings in order**, and derives a short instructional guide from the existing source objective. Each guide button scrolls to the actual native daily heading, including Grade 09 pages where all five headings share one card. On missing/ambiguous headings, the engine refuses to mount and the entire original packet remains accessible.

**Isolation:** Existing Grade 09 Week 01 Read/Practice/Write/Check player, Week 02 and Week 03 specialist guidance, native source investigations, rubric assignments, 80% mastery gates, source storage, assessment and midterm/final/capstone controls are not changed. The engine never saves learner data or awards mastery. Script version: `20261119-social-studies-complete-v5`.

**Regression:** `tools/test-social-studies-full-course-integration.mjs` checks all 144 grade/week entry combinations; currently expects 143 present entries, 178 original physical HTML packets, 885 native later-week day headings, 10 term-boundary packet files, and exactly one missing packet: `courses/social-studies/grade-09/weeks/week-27/student-packet.html`. The GitHub Actions workflow runs this check alongside the previously existing Weeks 01–03 checks. No successful CI or authenticated browser conclusion has yet been observed; source integration is not production acceptance.

**Next repair:** Recover Grade 09 Week 27 content from an approved historical version or curriculum source, then integrate that packet and revise the full-coverage regression expectations to 144/144. Never invent that week's source document or overwrite another week's packet.

## Final alternate-route reconciliation · 2026-11-19

A further forensic check discovered previously uncounted original packet variants:
- Grade 10 `courses/social-studies/grade-10/weeks/week-01/student-packet.html` is a genuine second Week 01 packet and now uses the engine.
- Grade 09 `courses/social-studies/grade-09/week-NN/student-packet.html` contains genuine alternate (older) lesson packets for **30 weeks**, now also integrated with the same grade-specific engine. These legacy packets do **not** have the newer `high-school-formative-evidence-v1.js` module, so no existing evidence owner was invented or added there.
- Grade 09 direct Week 01, 06, 07, 09, and 10 are canonical **redirect-only** compatibility pages; preserved untouched because their canonical destinations already include the engine.
- Grade 09 Week 27 remains absent in both direct and nested directory layouts.

**Revised and authoritative physical-file census:** 143 of 144 distinct grade/weeks covered; **209 genuine instructional HTML packets integrated** (replacing the earlier 178 estimate), **1040 original Monday–Friday headings** outside the Grade 09 Week 01 phase player, and five intact Grade 09 redirect pages. The Grade 10 alternate Week 01 and 30 older Grade 09 packets account for the 31 additional actual lesson files.

`tools/test-social-studies-full-course-integration.mjs` has been revised to make this distinction and fail on missing or duplicate lesson controls. This corrects the earlier source-census estimate; it does not certify the GitHub Actions or authenticated browser result.

**Release hold remains:** Grade 09 Week 27 course source missing; browser, learner storage, accessibility and workflow run PASS still unverified.


## RESOLVED — Grade 09 Week 27 recovered from authoritative existing source (2026-11-20)

**This section supersedes every earlier Week 27 missing/HOLD statement above.**

The canonical Grade 09 `courses/social-studies/grade-09/app.js` explicitly uses `weeks/week-27/student-packet-v2.html` for Week 27. The original **Student Packet v2** was located and inspected at that path. It is not missing or an invented replacement. Original course-data.js confirms its approved topic **Capitalism, Socialism, Labor, and Reform**, Unit 6; essential question: *What should markets, governments, employers, workers, and communities each control?* Its original five weekday activities, source laboratory, economic reasoning lab, assessment v2.0, and evidence authority remain intact.

Recovery changes:
- Shared lesson engine now accepts the exact historical filename `student-packet-v2.html` as well as standard `student-packet.html` within approved Social Studies grade/week routes.
- Real Grade 9 Week 27 `weeks/week-27/student-packet-v2.html` opted in using the existing shared engine, with no curriculum rewrite or record/grading ownership changes.
- Standard `weeks/week-27/student-packet.html` and alternate `week-27/student-packet.html` are **redirect-only compatibility doorways** to that original v2 packet. Their old URLs now lead to the authoritative file.
- `tools/test-social-studies-full-course-integration.mjs` now expects **144/144 unique grade-weeks**, **210 genuine instructional HTML packet files**, **1,045 native weekday headings** outside the original Grade 9 Week 1 20-phase player, and **7 intentional compatibility redirects**. The test verifies that course app.js and course-data.js still identify the v2 original and that Week 27's original content/evidence contracts exist.

Focused post-commit connector verification confirms: shared JS parses, exact v2 route recognized, five Week 27 day headings preserved, original assessment and economic lab intact, both redirect URLs correct, course app and data ownership unchanged, no new engine persistence. **Actual GitHub Actions successful conclusion and authenticated browser acceptance remain unverified.**

The old missing Week 27 finding was a filename-discovery false alarm, now resolved without recreating teaching material.
