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
