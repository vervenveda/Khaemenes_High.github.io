# 2026-11-17 · Geometry Forensic Topology and Curriculum Architecture Audit

- Repository: `vervenveda/Khaemenes_High.github.io`
- Timezone: America/New_York
- Type: forensic audit · topology · curriculum architecture
- State: source audit PASS; repair work pending; rendered browser/device acceptance HOLD

## Course structure confirmed

Geometry is a complete 36-week course with:
- 13 units;
- 90 visual printable lessons;
- 180 study sessions;
- 90 lesson mastery gates at >=80%;
- 36 weekly mastery gates;
- 13 unit mastery checks;
- 40-question non-gating readiness diagnostic;
- 60-question midterm plus 6 constructed-response tasks;
- 100-question final plus 10 constructed-response tasks;
- 13 applied investigations;
- capstone and defense;
- Foundation, Core and Extended pathways.

The published course map confirms coherent progression from foundations/constructions through transformations, congruence, coordinate proof, similarity, trigonometry, polygons, circles, analytic geometry, measurement, solids, CAD/spatial design and a final modelling capstone.

## Topology findings

### Header/chrome divergence
Landing, Diagnostic and Unit 01–13 entry pages embed their own branded header while also loading the canonical High School global chrome.

Representative lessons from Unit 01, Unit 06 and Unit 13 also embed their own branded header and load canonical global chrome.

This creates the same duplicate-header risk already repaired in Algebra I.

### Ticker/translator parity
Landing, Diagnostic, Unit 01–13 entry pages and representative lessons do not declare the canonical dual-ticker loader and do not declare the translator, while they do load global chrome and ecosystem toolbar.

### Readability
Landing, Diagnostic, Unit 01–13 entry pages and representative lessons still contain explicit 14px presentation declarations.

### Side rails
Geometry's shared presentation architecture contains:
- `.practice-layout{grid-template-columns:minmax(0,1fr) 330px}`
- sticky `.practice-side`;
- `.lesson-layout{grid-template-columns:minmax(0,1fr) 310px}`
- sticky `.lesson-side`.

These are direct conflicts with the current Mathematics centered/no-side-column blueprint.

### Hero / identity
Unit pages have legitimate unit heroes and should retain them.

The course landing contains both institutional branding in the custom header and a separate hero badge. Under the canonical header contract, the hero should retain Geometry personality but should not repeat institutional branding/logo treatment.

## Strengths to preserve

1. Strong 13-unit / 36-week curriculum progression.
2. Clear proof, construction, modelling and spatial-design identity.
3. Large visual/diagram-friendly content width.
4. Existing equal-grid systems for units, resources and lessons.
5. Deep CAD, measurement, trigonometry and capstone progression.
6. Strict 80% mastery architecture and reviewed cumulative assessment logic.
7. Local-first and printable evidence model.

## Ranked repair priorities

1. **P0 chrome unification** — one canonical branded header; demote local Geometry controls to an unbranded course navigation strip.
2. **P0 centered architecture** — remove shared 330px practice and 310px lesson rails while preserving full-width diagram space.
3. **P1 canonical utilities** — add canonical dual ticker + translator parity across ordinary student/public surfaces.
4. **P1 readability** — establish shared 16px minimum without reducing Geometry's large diagram and title hierarchy.
5. **P1 hero cleanup** — retain one Geometry hero per page and remove repeated institutional logo/badge treatments where they compete with canonical chrome.

## Important distinction

The course itself is not structurally weak. The curriculum map is coherent and substantial. The main divergence is presentation architecture inherited from an earlier Geometry shell.

## Next action

Normalize shared Geometry chrome/readability/rail architecture first, then propagate the proven pattern to entry pages and lessons. Do not rewrite lesson content individually unless a page-specific exception remains after shared repair.
