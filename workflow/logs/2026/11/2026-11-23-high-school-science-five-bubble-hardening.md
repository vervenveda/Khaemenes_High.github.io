# High School Science Five-Bubble Hardening · 2026-11-23

## Scope
Fresh post-audit hardening across the full Grades 9–12 science program.

## Bubble 1 — strict 720-lesson department certification
- Hardened the existing certification script so strict mode fails on any course with:
  - incomplete lesson inventory,
  - less than 100% designated science-engine coverage,
  - less than 100% visible core-contract coverage,
  - less than 100% depth certification.
- Updated the department workflow to execute the strict gate rather than report-only mode.
- Status: **IMPLEMENTED · CI CONCLUSION PENDING**. A failing strict run is to be treated as a real finding, not bypassed.

## Bubble 2 — canonical 9–12 coherence graph
- Added `courses/science/HIGH_SCHOOL_SCIENCE_COHERENCE_MAP.md`.
- Defines explicit handoffs across investigation, matter, energy, systems, information, quantitative reasoning, modeling, and engineering.
- Defines required Science 9→10/11/12, Biology→Chemistry, and Chemistry→Physics transfers.
- Status: **CLOSED AT SOURCE-AUTHORITY LEVEL**.

## Bubble 3 — planned inquiry vs completed learner inquiry
- Added `HIGH_SCHOOL_SCIENCE_INQUIRY_COMPLETION_STANDARD.md`.
- Canonical evidence states: planned → started → submitted → reviewed → mastered → archived.
- Browser-local page visits and practice scores cannot create reviewed/mastered states.
- Defined minimum submitted investigation record and protected authority boundary.
- Status: **CLOSED AT PROGRAM-CONTRACT LEVEL**. Real authenticated educator review/credit custody remains a separate authority gate.

## Bubble 4 — browser/device/accessibility certification coverage
- Added canonical `science-browser-device-matrix-v1.json`.
- Matrix covers representative Grades 9–12 lessons at:
  - 1440×1000 desktop,
  - 1024×768 tablet landscape,
  - 768×1024 tablet portrait,
  - 255×900 narrow stress width.
- Added `run-science-chrome-smoke-matrix.sh` for live headless Chrome load smoke plus print-to-PDF smoke.
- Added the smoke matrix to the high-school science certification workflow before strict curriculum certification.
- Direct source verification confirmed all four matrix routes exist, include viewport metadata, and mount the expected science engine.
- Status: **SOURCE MATRIX PASS · LIVE CI CHROME CONCLUSION PENDING**.
- Keyboard-only, screen-reader, visual clipping, offline reload, and real learner persistence remain explicit manual/operational release gates rather than being falsely inferred from headless load smoke.

## Bubble 5 — longitudinal 9–12 science portfolio
- Added `science-longitudinal-portfolio-v1.json`.
- Defines four required artifact families per grade and six graduation-level evidence outcomes.
- Reuses the same inquiry completion states so portfolio evidence cannot silently promote local work to reviewed/mastered authority.
- Status: **CLOSED AT CANONICAL PORTFOLIO-SPINE LEVEL**. Course-specific UI presentation and authoritative cloud custody remain separate integration layers.

## Program authority guard
- Added `validate-high-school-science-program-authority-v1.mjs`.
- CI now verifies:
  - five required cross-grade handoffs,
  - all six inquiry evidence states,
  - four-grade portfolio coverage,
  - required graduation evidence,
  - all four browser matrix routes,
  - expected viewport metadata,
  - expected Grade 9 / Upper Science engine markers.

## Key commits
- strict audit hardening: `8dd5f0bf55c3f77b5e7203fea3511ae70b15f2b9`
- strict CI enablement: `c01a55f56cbe7b9683ebbd6750a936aea8d3bb62`
- coherence map: `fa217e8613cf9db50a91bc6fc4e8f6b693ad5fdc`
- inquiry completion standard: `4cc91d7d389be0d7617d59b0cb3c895460a70775`
- longitudinal portfolio spine: `af512b4fae97d6cbbe0e9c4723a1fb7d24196909`
- browser matrix: `f16f65c412c5e25f08b956976035aade4df44d70`
- authority validator: `f8936d450aa7fe25a16c8707a7d27a20d1dc62ff`
- Chrome smoke matrix: `b35a95fc8a962dd1a0ef960585bd512e68b16048`
- integrated workflow: `4ba36f50d1b9cc7d581f9c247d38819843e8f6de`

## Boundary before fresh audit
The five recommended bubbles have been implemented as enforceable department structures. Do not declare final A+++ department release until the strict 720-lesson job and live Chrome smoke job have an observed successful workflow conclusion. A new fresh audit should use those conclusions as evidence and should separately reassess runtime accessibility, offline behavior, learner export/import, protected assessment custody, and authoritative review/grade integration.
