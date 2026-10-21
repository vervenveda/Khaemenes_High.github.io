# Grade 9 Science — Vervenveda ecosystem integration audit
**Audit:** 2026-10-21 · **Scope:** repository source, cross-campus paths, navigation, portability and learner isolation.
**Student/browser verification:** intentionally deferred. This is a source-level architecture audit, not a device certification.

## Verified architecture
- High School hub (`index.html`) references Academy, Linguistics, ARSHIF, Arcade, PROSE and PLERASearch.
- Science 9 landing (`courses/science/integrated-science-9/index.html`) has its Science portal, student evidence portfolio and course-entry contract, but has no direct references to Linguistics, ARSHIF, Arcade, PROSE or PLERASearch.
- The standalone Science evidence portfolio (`science-evidence-portfolio.html`) does not itself link to the wider academic network. Its local `science-evidence-portfolio.js` reads per-learner evidence from browser localStorage.
- Academy hub (`Khaemenes_Academy.github.io/index.html`) already references its grade campuses, Linguistics, ARSHIF and PROSE.
- Vervenveda hub already maintains `assets/vnv-ecosystem-menu.js` and a machine-readable `assessment-engine/mentor/registry/ecosystem-repositories.json`.
- Linguistics contains a dictionary studio (`apps/dictionarybox_index.html`) and local language tooling; ARSHIF and PROSE exist as separate repositories. Availability is evidenced by repository trees and entry files, not verified browser uptime.

## Five integration bubbles — recommended sequence

### B01. Connected campus navigation (high value, low coupling)
Surface a compact **Explore Vervenveda** region on the Science 9 landing. Organize by function: Academy/Home, Linguistics/Dictionary, ARSHIF/Reading, Arcade/Practice, PROSE/Research & Writing, PLERASearch/Discovery. Reuse established navigation styling rather than copying giant menus into each lesson. Verify public URL paths and mobile layout before release.

### B02. Shared academic vocabulary (high value, controlled scope)
Link initially to the existing Linguistics dictionary without loading its full engine into Science lessons. Design a versioned cross-subject `term_id / subject / grade / definition / examples / translations / source` schema; map unit vocabulary and print sheets. Do not introduce duplicate dictionaries or make a network call necessary to complete a lesson. Document provenance of each term.

### B03. ARSHIF research and reading bridge (high value)
Offer **Further reading / primary sources / evidence literacy** from explicit teacher-approved resources, with citation field and age suitability. Keep required reading packaged locally for students with limited internet access. Treat external readings as enrichment unless an offline alternative exists.

### B04. Arcade and PROSE tool bridge (medium value)
Map specific scientific learning objectives to eligible Arcade experiments/games and PROSE writing/science tools in an opt-in recommendation table. Require destination availability, age fit, accurate domain coverage and stable return-to-lesson path. Do not claim completed work in another repository confers Science 9 mastery.

### B05. Portable academic evidence contracts (highest technical risk)
Document export/import compatibility between Science 9 local evidence and Academy family/teacher portfolios using a **versioned, explicit transfer file**. Preserve source identifiers, course, grade, lesson, timestamps, student confirmation and reviewer fields. **Never** silently merge localStorage across repositories or send learner notes to a public endpoint; learners must intentionally export and import, with conflict preview and local-only defaults.

## Safety and governance rules
1. Student evidence remains local to its browser origin by default; hyperlinks do not synchronize localStorage across independent origins.
2. Public HTML must contain no passwords, API tokens, private learner records or enrollment identifiers.
3. The course assessment engine is the sole authority for Science 9 completion and mastery; linked activities are enrichment or separately assessed.
4. Keep a minimal offline-capable local lesson path; any external dependency must degrade gracefully.
5. All canonical navigation URLs should come from one maintained registry or checked manifest, not hand-maintained URL copies.
6. Style: parchment, readable moderate-weight type, 7px radii, and 255 CSS px stress testing before user-facing certification.
7. Use progressive enhancement: start with ordinary accessible links, then optionally mount the Vervenveda ecosystem menu when its hosting path and lifecycle are verified.

## Delivery gates
- **Gate A:** Public target URL, ownership, accessibility and return route verified for every proposed connection.
- **Gate B:** Navigation inventory/manifest committed and checked by CI; no broken link or duplicated menu.
- **Gate C:** Cross-subject resource mapping approved by course staff; no unsupported credit transfer.
- **Gate D:** Explicit opt-in data export reviewed for privacy, schema versioning, learner mismatch and conflict cases.
- **Gate E:** Human browser and device checks scheduled separately; do not mark them passed from static source tests.

## Progress/status
**Source audit completed. Integration recommendations documented. No student-facing cross-campus links or record synchronization were deployed by this report.**
