# Khaemenes Academy · Pre-Algebra Video Forensic Audit
Audit date: 2026-10-19

## Verified inventory
- Pre-Algebra course `video-map.json`: **99 placements**, across **92 unique lesson IDs** when inspected.
- **21** placements were marked enabled before repair; after Bubble 1, **20 enabled** remain in the map (not proof of working embedded playback).
- The seven duplicated lesson IDs include U02-L01, U02-L05, U03-L06, U11-L03, U11-L04, U12-L04 and U12-L07. Some are legitimate *multiple resource* placements, while the others are legacy mismatches.
- Unit 01 `lesson-engine.js` contains its own video COMPANIONS plus `youtube-nocookie.com` iframe rendering.
- Unit 02 `lesson-engine.js` contains a separate embedded COMPANIONS list with signed-integer-focused videos.
- Unit 11 `lesson-engine.js` has **no video renderer** even though its mapped lessons contain ten placements. A map entry alone does not publish a video to students.
- Unit 12 and Unit 13 mappings are present in the repository, but playback and render status were **not** verified in this audit.

## Bubble 1 — Wrong lesson alignment (REPAIRED)
**Finding:** U02-L01 (Integers in Context) had an enabled `MATH-FRACTIONS-NUMBER-LINE-001` video *as well as* signed integers content. The fractions video belongs to another topic and could mislead a teacher interpreting the course map.

**Repair:** Set only that fractions placement `enabled:false`, marked `misaligned_legacy_preserved_disabled`, and added a plain-language alignment note. The original asset and legacy provenance were preserved. The signed-integers placement was not altered. **No learner records changed.**

## Bubble 2 — Metadata vs. actual student rendering (OPEN, requires regression-tested integration)
**Finding:** The 99 mapping records are not in themselves rendered videos. Units have separate lesson engines; Unit 01 and Unit 02 render their own companions, but Unit 11 engine does not expose the mapping-based video player.

**Recommended repair:** Extract/extend the existing Pre-Algebra optional video-companion presentation, then attach it to the unit engines for Units 04–13 using the existing map and canonical library. Do not replace working Unit 01–03 companions. Provide a human-visible optional play control and a text fallback; never alter progress/mastery. Test direct-navigation, lesson activation, narrow viewport, offline text and caption fallback *before* release.

**Important:** Without that code integration, previously staged Units 04–13 videos should **not** be described as embedded or student-visible.

## Bubble 3 — Scope and approval labels (OPEN, release-blocking)
**Finding:** Several placements teach only portions of lesson objectives (Unit 10 functions/graph interpretations, Unit 11 circle/composite-shape/volume and design), while many records contain `captions_verified:false`, `playback_verified:false`, and `transcript:null`. The `enabled` flag has sometimes been treated as evidence of video readiness, even though live browser tests were not performed.

**Recommended repair:** Keep three separate statuses for every placement: `topic_match` (full / partial / prerequisite), `review_status` (unreviewed / pass / fail), and `student_display` (inactive / enabled). Only enable after actual playback, full-content/grade suitability, captions, text alternative, keyboard access and privacy-enhanced embed testing. YouTube privacy-enhanced embeds may still show advertisements.

## Release requirements
1. Validate paths, duplicate lesson IDs and alignment notes for each unit against lesson objectives.
2. Confirm a mapped video actually appears in the student lesson, not merely in the JSON catalog.
3. Test the video player in a real browser, including captions and reduced-width display.
4. Confirm a learner can finish the written lesson, game, and 80% mastery assessment without a video connection.
5. Preserve all active legacy embeds until their replacement behavior is independently verified.

**Boundary of this audit:** Repository paths and source files were inspected. No live browser playback, caption or ad-free certification is claimed.
