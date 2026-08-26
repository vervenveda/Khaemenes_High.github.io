# Pre-Algebra Video Library Compatibility Migration

The Pre-Algebra video records have been copied into the shared Mathematics video library without deleting or modifying the legacy records.

## Shared library

`../assets/video-library/`

## Compatibility map

`video-map.json`

The map preserves each legacy `lesson_id`, unit, lesson, original alignment status, and legacy source path while pointing to the new shared `asset_id`.

`enabled: false` is used for legacy placements that were already marked `not_aligned`; those assets remain available to Mathematics for a more appropriate future placement.

## Safety rule

The legacy directory remains intact during this migration:

`assets/video-manifest.json/transcripts/`

Do not delete it until Pre-Algebra lesson rendering and any video-loading logic have been verified against the shared library and compatibility map.
