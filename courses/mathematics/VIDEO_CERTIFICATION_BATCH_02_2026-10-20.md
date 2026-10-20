# Khaemenes Academy Mathematics — Video Certification Batch 02
Date: 2026-10-20

## Purpose

Certification Batch 02 promotes two Khan Academy Geometry resources from generic staged candidates to **documented release candidates**.

This batch does **not** authorize student-facing release.

Both assets remain:
- `enabled:false`
- placement `release_approved:false`
- canonical `certification.student_release_approved:false`

The shared video renderer therefore cannot display either resource to students.

## Batch assets

### 1. Geometry U08-L08 — Writing standard equation of a circle

- Asset: `MATH-CIRCLE-STANDARD-EQUATION-KHAN-001`
- Canonical record: `assets/video-library/circle-standard-equation-khan.json`
- Khan Academy provider page:
  `https://www.khanacademy.org/math/algebra-home/alg-conic-sections/v/writing-standard-equation-of-circle`
- Official provider page verified: yes
- Official provider transcript exposed: yes
- Exact lesson alignment verified: yes
- Certification state: `release_candidate_runtime_pending`
- Student release approved: **no**

Evidence:
The official Khan Academy page identifies the resource as “Writing standard equation of a circle,” supplies an About tab and Video transcript, and works from center/radius information to the standard circle form. This directly supports Geometry U08-L08 Equation of a Circle & Coordinate Applications.

### 2. Geometry U01-L04 — Geometric constructions: angle bisector

- Asset: `MATH-ANGLE-BISECTOR-CONSTRUCTION-KHAN-001`
- Canonical record: `assets/video-library/angle-bisector-construction-khan.json`
- Khan Academy provider page:
  `https://www.khanacademy.org/math/geometry/geometric-constructions/geo-bisectors/v/constructing-an-angle-bisector-using-a-compass-and-straightedge`
- Official provider page verified: yes
- Official provider transcript exposed: yes
- Exact lesson alignment verified: yes
- Certification state: `release_candidate_runtime_pending`
- Student release approved: **no**

Evidence:
The official Khan Academy page identifies the resource as “Geometric constructions: angle bisector,” exposes an About tab and Video transcript, demonstrates the compass-and-straightedge construction, and gives a congruent-triangle justification. This directly supports Geometry U01-L04 Compass-and-Straightedge Constructions.

## Runtime gates still open

Neither asset may be enabled until all of the following are completed:

1. Watch the complete video from start to finish and confirm mathematical accuracy and appropriate pacing.
2. Verify the privacy-enhanced `youtube-nocookie.com` embed from the published Academy lesson.
3. Verify captions in the actual embedded playback environment.
4. Verify phone, tablet and desktop rendering.
5. Confirm the transcript/provider-page fallback remains reachable when video playback fails.
6. Confirm the resource remains optional and cannot award mastery or change the 80% progression authority.

## Relationship to Batch 01

Certification Batch 01 contains:
- Sigma Notation — Algebra II U09-L06
- Comparing with z-scores — Algebra II U12-L05

Those records are also `release_candidate_runtime_pending` with official Khan transcript evidence and remain unreleased.

Batch 01 and Batch 02 should proceed through runtime/embed QA before any placement is promoted to student release.
