# Khaemenes High · Social Studies Visual Learning Audit
Date: 2026-10-20
Status: Repository tree and selected file inspection; not full 1,422-file semantic or browser audit.

## Confirmed inventory
Repository subtree courses/social-studies/ contains 1,422 tracked files at inspection. Approximate grade subtree counts: Grade 09: 459, Grade 10: 347, Grade 11: 391, Grade 12: 223. Existing educational labs found:
- Grade 09: resources/atlas-and-data-lab.html; global-timeline.html; source-analysis-lab.html; historical-systems-lab.html; media-verification-lab.html; assets/atlas-grid.svg; timeline-grid.svg.
- Grade 10: resources/map-data-analysis.html and unit-01/evidence-lab.html.
- Grade 11: resources/data-model-lab.html; separate personal-finance data model laboratory.
- Grade 12: resources/data-laboratory.html.
Earlier general claim of absent original tools was too broad; the main gap is *prominence, depth, cross-grade access, and consistent interactive visuals*. Several inspected legacy resources offered limited static controls and no inline vector graphics.

## Initial new integration
- tools/visual-studio.html: original single-file Atlas & Routes conceptual schematic, visual date-spaced timeline, original SVG bar/line graph, primary-source analysis form, print and JSON export/import, local save, 255px CSS; no third-party dependencies.
- Department index now promotes the original shared studio and existing local Historical Systems, Media Verification and Economics Data tools.
- No assessment/mastery or individual grade lesson files modified.

## Design and evidence policy
Every new map must identify projection, boundaries, date and source before being represented as historical fact. The Visual Studio starter atlas is deliberately labeled schematic and NOT geographic to scale. Student-entered graph values are clearly labeled illustrative unless a dataset and units are cited. Original tool UI and drawings do not mean original historical evidence: primary-source documents must retain genuine author, archive and date attribution. Avoid political advocacy and do not reproduce copyrighted classroom platforms.

## Next forensic passes
1. Crosswalk every week 01–36 in Grades 9–12 against five asset types: map, dated timeline, primary document, data visualization, causal/interactive activity. Record genuine omissions before injecting tools.
2. Audit existing map accuracy, date/boundary provenance, data units and source citations. Prefer grounded original overlays rather than decorative pseudomaps.
3. Embed contextual links to the local studio and specialist labs in selected weekly lessons; don't assume each week needs all four formats.
4. Expand the atlas with historically sourced, dated local SVG map packs, accessible table equivalents, zoom and printable labels.
5. Run Playwright student-path tests at 255px, keyboard-only, import/export, beforeprint and disconnected internet. Validate against course-owned assessment integrity.
6. Make any shared tool enhancement opt-in and avoid overwriting the existing 36-week grade assessments or student records.
