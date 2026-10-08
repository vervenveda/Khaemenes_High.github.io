# Algebra I video bridge integration — verified design

Status: READ-ONLY analysis of active bridge; integration not yet deployed.

## Current behavior
- `assets/lesson-resource-map.js` populates `window.KhaemenesAlgebra1LessonResources.entries`.
- `assets/lesson-resource-bridge-v1.js` resolves `uNN-lNN` from URL and body attributes.
- It renders projects, labs, and Foundation/Core/Extended pathways in `#main`.
- It does **not** read `video-map.json` or render a video.
- Existing video maps are intentionally `enabled:false`.

## Safe integration requirements
1. Retain existing bridge and lesson IDs; avoid a second competing resource panel.
2. Map `KH-MATH-A1-U01-L02` to `u01-l02` and `KH-MATH-A1-U01-L03` to `u01-l03` with a single deterministic normalization rule.
3. Resolve the shared asset from `../assets/video-library/` relative to the Algebra I course root; validate the URL, provider, ID and lesson match.
4. Do not render disabled placements. Never automatically autoplay or alter completion/mastery flags.
5. Provide a descriptive link and accessible transcript/text alternative; embed only after playback, captions, and age-appropriateness checks.
6. Verify static hosting and browser behavior (including slow networks, disabled JavaScript, blocked video provider and mobile layouts).
7. Confirm legacy duplicate video registry has no active consumers before any removal.

## Verified scope
- Bridge source and the JS/JSON resource maps inspected.
- Existing lesson-resource bridge does not currently support video assets.
- No student-facing bridge code modified in this pass.

## Outstanding
- Full-course lesson coverage inventory, including dynamically injected media.
- Browser playback/captions and mathematical accuracy verification.
- Activation of video-map entries and course-specific UI integration.
