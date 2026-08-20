# Grade 9 and Pre-Algebra Phase

This package advances Khaemenes High from a landing page into a functional campus.

## New files

```text
grades/
└── grade-09/
    ├── index.html
    ├── course-catalog.json
    └── planner.json

courses/
└── mathematics/
    └── pre-algebra/
        ├── index.html
        ├── course-map.json
        └── diagnostic/
            └── index.html
```

## Updated root files

- `index.html`
  - Grade 9 now opens a real portal.
  - Grade 10–12 remain development notices.
  - The foundation message reflects the new release.

- `manifest.webmanifest`
  - Adds shortcuts for Grade 9, Pre-Algebra, the diagnostic, and connected resources.

- `service-worker.js`
  - Cache version: `khaemenes-high-grade9-v3`
  - Precaches the Grade 9 portal, structured JSON, Pre-Algebra map, and diagnostic.
  - Uses route-aware offline fallbacks instead of always returning the campus homepage.

## Grade 9 portal features

- Local-only student profile
- Foundation, Core, and Extended mathematics pathway selector
- Searchable structured course catalog
- Personal course-plan selection
- Connected Verve N Veda resources
- 36-week term planner
- Printable plan
- Exportable JSON plan
- No account or backend required

## Pre-Algebra shell features

- Complete 36-week, 14-unit curriculum map
- Foundation, Core, and Extended pathway descriptions
- Draft international and national framework tags
- Searchable unit map
- Local orientation progress
- Exportable progress record
- Connected educational practice resources

## Diagnostic features

- 18 untimed questions
- Number, fraction, ratio, percent, algebra, coordinate, geometry, and statistics domains
- Automatic scoring
- Foundation/Core readiness guidance
- Domain summaries
- Answer explanations
- Printable results
- Browser-local storage only

## Upload order

Upload the directories first, then replace these root files:

1. `grades/`
2. `courses/`
3. `index.html`
4. `manifest.webmanifest`
5. `service-worker.js`

A hard refresh may be needed once after the service-worker upgrade.
