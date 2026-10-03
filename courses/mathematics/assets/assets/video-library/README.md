# Mathematics Video Library

This directory is the shared registry for reusable high-school mathematics instructional-video metadata.

## Architectural rule

**The Mathematics library describes what a resource teaches. Individual courses decide where and when it is used.**

A shared video asset must not permanently belong to Pre-Algebra, Algebra 1, Geometry, or another course. Course-specific placement belongs in that course's `video-map.json`.

## Canonical shared record schema

Current schema: `1.1`

Shared records use a permanent `MATH-*` asset ID, provider/video metadata, aspect ratio, mathematics domain, topics, skills, grade band, accessibility state, and a curriculum-neutral alignment note.

Do not add `lesson_id`, `unit`, `week`, or other course-placement fields to shared records.

## Placement

Pre-Algebra placement is preserved in `courses/mathematics/pre-algebra/video-map.json`.

The legacy Pre-Algebra records remain in place during migration so existing course behavior is not broken.

## Accessibility

Videos remain optional until transcript and caption accessibility are actually verified. `captions_verified` must remain `false` until checked.

## Migration rule

Copy first, map second, verify, and only then consider retiring legacy copies. Never delete a legacy record simply because a shared copy exists.
