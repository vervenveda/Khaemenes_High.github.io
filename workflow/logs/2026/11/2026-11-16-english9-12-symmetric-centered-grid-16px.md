# English 9–12 · Centered Symmetry, Equal Grids and 16px Readability
**Date:** 2026-11-16
**Repository:** `vervenveda/Khaemenes_High.github.io`
**Scope:** Unified lesson engine pilot, Week 01 Days 01–05 for Grades 9, 10, 11, 12 (20 routes)
**Status:** COMMITTED · STATIC PARSE AND ROUTING PASS · LIVE VISUAL ACCEPTANCE HOLD

## Founder direction
"Make everything on the page symmetrical, centered, no text font under 16px, equal grids."

## Source implementation
**Changed:** `courses/shared/english-unified-lesson-engine-v1.js`, v1.1.0.
**Commit:** `c0cc30eb1414d3b2f509251af21afe74a51af34a`.
**Documented:** `courses/shared/ENGLISH_UNIFIED_LESSON_ENGINE_V1.md`, commit `0938870d12842190165161ebc1150a6001b2a085`.

- Scope styling with `body.khae-english-symmetric-lesson`, applied only after the unified engine matches the English lesson route. The official VNV public gateway and unrelated school pages are not modified.
- Center main reading column within a maximum of 1000px; align the external card edges, learning-stage headings and navigation visually.
- Even two-column grids for `.grid` and `.ela10-w01-grid` on desktop, equal row-item stretch, and single-column mobile reflow under 720px.
- Ensure the learner-facing main content, controls, breadcrumb, descriptions and both ticker labels/actions have a 16px font floor.
- Keep long passages and student-authored writing **left-aligned within symmetrical centered containers** for readability; never center extended paragraphs or disrupt the reading order.
- Retain VNV/KA design preferences: charcoal, parchment and cream controls, 7px radii, existing academic titles and original grade-specific differences.
- No page-wide CSS zoom or changes to course saves, answer banks, grade calculations, 80% mastery or protected navigation.

## Confirmed source checks
- GitHub re-fetch engine SHA: `d149c7b54bf922a8ab5d10e538bfd3b32a22248f`.
- JavaScript parse with `new Function`: PASS.
- Module API version: `1.1.0`.
- Route adapter recognition: English 9/10/11/12 first-day examples PASS.
- Reading Log route not matched: PASS.
- Equal-grid selector, responsive fallback and 16px typography selectors exist: PASS.
- Single shared engine used; no individual lesson pages were rewritten.

## Outstanding real-browser checks
- Verify at actual Chrome 100%, 125%, 150%, 200% browser zoom; screenshot previously showed an abnormally tiny full-page scale, cause **not proven**.
- Verify the **computed** font size is >=16px for *all visible* content, not just elements targeted by stylesheet; style inheritance and third-party toolbar contents need inspection.
- Verify tickers' 16px labels can scroll/fit without overlap, and official header offset remains correct with both tickers.
- Check Grade 10 weekday studio form grid, English 9 writing fields, Grade 11/12 reading cards and interactive practice, mobile portrait and landscape.
- Check equal-height grids visually, no horizontal overflow, no clipped card/input and no overlapping dock.
- Verify the 80% mastery threshold, record preservation, keyboard, print, focus view and screen-reader behavior with a sanctioned test learner.

**Release state:** source integration complete for existing 20-page pilot, browser/user acceptance unverified. No mass expansion to other weeks until validated.
