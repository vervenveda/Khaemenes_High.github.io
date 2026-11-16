# Khaemenes Academy · Unified English Lesson Engine v1.0.0

**Canonical implementation:** `courses/shared/english-unified-lesson-engine-v1.js`
**Loader:** `assets/high-school-global-chrome-v2.js`
**Initial release scope:** Week 01 daily lessons, English 9–12 (20 existing pages)
**Status:** connected in source; browser acceptance required

## Problem solved

A page should not need an individual HTML edit each time we improve **presentation**, **navigation**, reading focus, or section discovery. This shared engine is loaded by the already-canonical high-school chrome and detects these different grade architectures:

| Grade | Existing daily page structure | Adapter |
| --- | --- | --- |
| 9 | `weeks/week-NN/day-NN/index.html` | `english9-daily` |
| 10 | `weeks/week-NN/monday…friday/index.html` | `english10-studio` |
| 11, 12 | `weeks/week-NN/lessons/day-NN.html` | `senior-companion` |

The initial bootstrap is enabled only for **Week 01**, although route detection is prepared for later weeks. This avoids making an unverified global change to hundreds of lessons.

## Features centrally maintained now

1. Idempotent shared Lesson Path panel, with grade/week/day metadata.
2. Automatic section map from genuine `h2` lesson headings (up to 24), default collapsed.
3. Focused-reading toggle: improves content measure and line spacing; no hidden academic content or font floor reduction.
4. Responsive centered charcoal/parchment controls, semantic labels, keyboard links and print exclusion.
5. Optional safe structured-content renderer for new or migrated pages.
6. No duplicated course grade, score, answer bank, learner storage, portfolio, or mastery authority.

**Existing Week 01 tools remain in place:** grade 9's daily evidence engine, Grade 10 weekday studio and learner-scope scripts, Grades 11–12 weekly workspaces, the official VNV header/hamburger, both tickers, floating ecosystem toolbar, and existing lesson text zoom controls.

## Future data-driven lesson format (opt in only)

The module does **not** automatically overwrite legacy lesson bodies. To author a new course lesson without a large handcrafted HTML page, give its lesson shell a target and a static JSON payload:

```html
<main>
  <div data-khae-lesson-content></div>
</main>
<script type="application/json" data-khae-lesson-payload>
{
  "version": 1,
  "title": "Precise Evidence",
  "sections": [
    {
      "title": "Read and notice",
      "paragraphs": ["Original authorized reading passage..."],
      "bullets": ["Locate two details.", "Explain what each does and does not establish."]
    },
    {
      "title": "Independent transfer",
      "paragraphs": ["Write a qualified interpretation in the existing authorized workspace."]
    }
  ]
}
</script>
```

This renderer uses `textContent` and element creation only. It does not evaluate arbitrary HTML, activate scripts, create saving keys, or submit grades. **It is a presentation-only starting schema**, not yet a complete migration specification for embeds, accessible source citations, media, rubrics, questions or graded submissions. The existing grade-specific assessment engines must remain separate.

## What is NOT unified yet

- Hundreds of individual lesson passages, source/reading metadata, exercises and rubrics are still stored in their existing grade files.
- Curriculum and assessment JSON structures remain grade-specific and authoritative.
- The 80% mastery and learner identity gates are not rewritten.
- A full data-only lesson workflow requires versioned content schemas, authorized source custody, accessible media types, assessment reference IDs, content validation, migration utilities and tests.

Do **not** mass-convert all lessons until original texts and saved `data-save-field` IDs have been inventoried. Distinct grade complexity is intentional: common interface must not flatten Grade 11 rhetorical analysis or Grade 12 synthesis into Grade 9 instruction.

## How to update one feature for all connected lessons

Edit and review `courses/shared/english-unified-lesson-engine-v1.js`, then publish. The 20 connected pages pick up the shared source on load; no per-page commits are required for engine changes. The loader's versioned URL should change when a controlled release needs cache invalidation.

## Release checks

- Inspect one representative page in each grade at desktop and tablet widths.
- Ensure the shared panel mounts once and retains section links.
- Verify there are exactly two tickers, one canonical header, one hamburger and one official dock.
- Test 80% gating, daily save/export, learner identity changes and recovery with authorized synthetic beta profiles.
- Confirm keyboard, print, browser zoom and independent A+/A− controls.
- Verify no false completed/mastered states, no downloaded student data in logs, and no unexpected third-party dependencies.
- Record the actual browser outcome in `workflow/` before widening coverage.

## Rollback

Disconnect only the one unified-engine loader line in the shared chrome script if needed. The original grade lesson HTML, assessments and learner records remain intact.

## Presentation contract update · v1.1.0 (2026-11-16)

The centrally maintained engine now applies `khae-english-symmetric-lesson` **only to lesson routes identified by its grade 9–12 adapters**, not to high-school records, exams, family pages, or the VNV gateway.

- Content max width 1000px and centered within the actual viewport.
- Lesson card edges and section titles aligned symmetrically; prose, quotations and evidence remain left-aligned inside cards.
- Existing two-column `.grid` and `.ela10-w01-grid` presentations use `repeat(2,minmax(0,1fr))`; grid items stretch equally in each row, with a one-column breakpoint at 720px.
- Default minimum 16px for learner-facing text, form controls, descriptions, navigation, breadcrumb and presentational chrome, including both ticker strips. Existing maximum heading/title hierarchy is preserved.
- All text-entry controls retain their original `data-save-field`, identity, and data-owner behavior. No graded-state or 80% lock changes.
- There is **no page-wide zoom override**: very small screenshot scale may be Chrome browser zoom and requires an independent inspection.
- This is a source-validated 20-page pilot, not a measured guarantee of equal visual heights or accessibility across all responsive sizes. Test at 100/125/150/200% native browser zoom, tablet portrait/landscape, keyboard, and print.

**Implementation commit:** `c0cc30eb1414d3b2f509251af21afe74a51af34a`. **Browser acceptance:** HOLD.
