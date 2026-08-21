# English 9 Instructional App Logic Audit

**Audit pass:** 4A

**Scope:** Read-only review of Storybird Grove, PROSE, Affix Six, and Checkers Variant Lab for reusable instructional logic.

**Boundary:** Public educational patterns only; no private architecture, hidden routes, synchronization, credentials, or mentor internals.

## Executive finding

Together, the four applications support a strong learning loop: **plan → draft → inspect → revise → demonstrate → reflect → retain**. English 9 should adapt this logic without copying preschool presentation, game rules, Eiren wiring, or private connections.

## Ratings and decisions

| Source | Reusable feature | Value | Readiness | English 9 decision |
|---|---|---:|---:|---|
| Storybird Grove | Bounded character/setting/action choices | 5/5 | 5/5 | Adapt into scene, conflict, perspective, and structure planning. |
| Storybird Grove | Seeded variation by learning path | 5/5 | 4/5 | Use for repeatable practice sets without making student work disposable. |
| Storybird Grove | Sanitized local drafts, capped portfolio, backup import/export | 5/5 | 5/5 | Adopt as the minimum local-work safety model. |
| Storybird Grove | Read-aloud, reduced motion, large text, contrast, simple layout | 5/5 | 4/5 | Carry into learner tools after cross-browser and language testing. |
| PROSE | Autosave, protected switching, recovery snapshots | 5/5 | 5/5 | Preferred drafting workflow; retain plain-text and print fallbacks. |
| PROSE | Revision checklist, comments, versions, goals, readability lens | 5/5 | 4/5 | Align to each rubric; automated observations remain suggestions. |
| PROSE | Sanitized import and bounded file limits | 5/5 | 5/5 | Adopt for every course-local import feature. |
| PROSE | HTML, text, Markdown, print, and workspace export | 5/5 | 5/5 | Use for learner ownership and administrator-ready evidence. |
| Affix Six | Graduated challenge and bounded pattern history | 4/5 | 4/5 | Adapt to morphology retrieval and targeted review, not opaque ranking. |
| Affix Six | Safe storage helpers and schema migration | 5/5 | 5/5 | Adopt for durable browser-local records. |
| Checkers Lab | Optional hints tied to a current legal choice | 5/5 | 4/5 | Convert to “next best question” revision hints that explain why. |
| Checkers Lab | Outcome-based value update with attempt count | 4/5 | 3/5 | Low-stakes practice sequencing only; never an authoritative grade or label. |
| Checkers Lab | Undo, preview, progress, and local reset | 5/5 | 4/5 | Adapt into compare-revisions, consequence preview, progress, and learner-controlled reset. |

## Eiren boundary

Eiren is the Language Arts mentor. Public pages may link to the course mentor page, but the curriculum must remain complete when no mentor connection is available. Mentor-chain and beta semantics require a separate integration audit before live data exchange.

## ARSHIF dictionary and grammar JSON

The developing datasets should be treated as versioned reference data, not hidden authority. A future adapter should require:

- schema and dataset versions;
- stable entry identifiers;
- language, locale, dialect, register, and provenance metadata;
- examples and counterexamples;
- a distinction among error, variant, style choice, and rhetorical effect;
- a plain-language “why this was suggested” explanation;
- no automatic rewriting of assessed student work;
- a course-local fallback when the reference is unavailable.

Until those contracts exist, English 9 must not depend on an undocumented data shape.

## Approved course template pattern

Each major task should provide a centered, breathable assignment page; authentic purpose and audience; optional bounded planning scaffold; source records; local save and explicit export; revision evidence; an explainable hint ladder (**notice → question → example → direct support**); rubric-aligned self-check; growth reflection; and an offline printable version.

## Excluded from reuse

- Game-specific scoring, search, or opponent modeling.
- Private mentor, beta, cloud, or repository topology.
- Random generation as a substitute for authentic literature.
- Automated grammar judgments as final grades.
- Persistent profiling without learner-controlled reset and export.
- Preschool voice, rewards, or interface language in Grade 9.

Unit 3 will be the first full demonstration of this combined logic.
