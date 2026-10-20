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

## Preferred instructor expansion (October 2026)

- `instructor-index.json` records candidate channels and the video IDs requiring publisher verification before attribution.
- `../../MATH_VIDEO_SOURCE_QUEUE_2026-10-19.md` is the cross-course acquisition backlog, starting with Algebra I.
- Follow the established Pre-Algebra privacy-enhanced lesson player pattern; use course-level placement maps and leave unverified new placements disabled.
- Privacy-enhanced embeds cannot guarantee advertisements never appear; verify each actual playback environment.

## Bubble 2 · JSON and filename unification

Retain the Academy's established layout: shared video records in this directory use lowercase kebab-case `*.json` filenames, persistent `MATH-*` asset IDs, and schema `1.1`; course placements stay in each course's `video-map.json` with the existing lesson IDs and relative `shared_file` references. Do not rename existing records or replace the video map structure to satisfy a naming preference; existing references must continue to resolve.

A read-only check is available from the repository root:

```sh
node courses/mathematics/assets/video-library/validate-library.js
```

The check flags broken references, inconsistent names, invalid JSON, duplicate asset IDs, and unexpected embed URLs. It does not change any video, student record, or mastery gate. Legacy enabled videos may trigger warnings if they predate the newer playback-verification metadata; warnings are not proof of failure.
