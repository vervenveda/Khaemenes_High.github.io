# Science Lesson Engine v0.1 · Grade 09 Unit 01 Day 01 Pilot
Date: 2026-11-19 ET
Repository: vervenveda/Khaemenes_High.github.io

## Goal
Implement the new research-informed Science lesson organizational engine in **Grade 9 first** and store a reusable standalone prototype and blueprint alongside the existing Mathematics and English workflow engine resources.

## Changes committed
- f9a11ca — `courses/shared/science-lesson-engine-v0.1.js`: 7-step progressive instructional navigator; optional fictional dataset and immediate evidence-reasoning feedback; draft CER workspace; reflection prompt; in-memory visit tracking explicitly *not mastery*; safe no-rewrite DOM section visibility; no persistence and no duplicate chrome.
- faf7828 — Existing `courses/science/integrated-science-9/units/unit-01/lessons/day-01.html`: added a single `data-science-engine="science9-u01-d01"` explicit mount selector and one versioned script reference only. Existing 17.8k lesson source content retained.
- 3f38466 — `workflow/engines/science/science-lesson-engine-prototype-v0.1.html`: standalone seven-stage demo using the same reusable engine, with fictional data and no live grade action.
- 691ade4 — `workflow/blueprints/khaemenes-science-lesson-engine-blueprint-v0.1.md`: pedagogical principles and 9–12 ownership boundaries, evidence references and rollout holds.
- 2f19cb6 — `tools/test-science9-lesson-engine-prototype.mjs`: static consistency, curriculum heading, original safety/completion, and no-persistence checks.
- e90edc9 — `.github/workflows/science9-lesson-engine-pilot.yml`: syntax and regression job on relevant edits/manual dispatch.

## Verified in source this session
- Re-fetched new engine, existing live lesson, standalone workflow HTML; the engine was successfully parsed as JavaScript; live Grade 9 Day 01 contains the explicit mount attribute and script reference.
- Original Science 9 Day 01 sections and `data-page-complete="day01"` remain in the page.
- Engine attaches only when the exact Grade 9 pilot dataset marker is present; no other courses or lesson files modified.
- Original safety panel is not hidden by stage controls.
- The prototype uses no grade, student record, or assessment writes; fictitious data are labelled as simulations.

## Acceptance hold
- GitHub Actions successful job conclusion not observed; no claim that tests passed in Actions.
- Deployed student browser controls, accessibility, print, offline cache, actual tablet layouts and complete science activity interactions not verified.
- No claims of actual science mastery, 80% unlock or portfolio submission by using the prototype.
- Do not auto-roll out to further lessons before direct QA; different science lessons have distinct instructional headings and lab/safety requirements.

## Next recommended acceptance
1. Open the workflow demonstration and Grade 9 live Day 01 with a synthetic authorized learner profile.
2. Verify seven-stage navigation, original lesson content, persistent safety, original completion button ownership, keyboard navigation, print and portrait/landscape.
3. Confirm actual CI check conclusions.
4. Apply verified, narrowly adapted science lesson controller to the remaining Unit 01 lessons, never by blind global injection.
