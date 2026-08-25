# Language Arts Video Library

This directory is the shared registry for reusable Language Arts instructional-video metadata.

## Architectural rule

**The library describes what a resource is and teaches. Curriculum pages decide where and when it is used.**

A video record must not permanently belong to a grade, unit, week, or lesson. Courses should reference the stable `asset_id` and may reuse the same asset wherever it is instructionally appropriate.

## Canonical record schema

Current schema: `1.1`

```json
{
  "schema_version": "1.1",
  "asset_id": "ELA-TOPIC-001",
  "title": "Human-readable resource title",
  "provider": "youtube",
  "video_id": "VIDEO_ID",
  "embed_url": "https://www.youtube-nocookie.com/embed/VIDEO_ID",
  "aspect_ratio": "16:9",
  "topics": ["topic one", "topic two"],
  "skills": ["skill one", "skill two"],
  "grade_band": "9-12",
  "optional": true,
  "autoplay": false,
  "transcript": null,
  "captions_verified": false,
  "alignment_status": "aligned",
  "alignment_note": "Brief curriculum-neutral explanation of the instructional value of this resource."
}
```

## Required conventions

- `asset_id` is the permanent unique identifier. Do not change it when a resource is reused in a different course.
- Filenames use a short topic-based slug and `.json`, for example `close-reading.json`.
- Do not add `lesson_id`, `unit`, `week`, `day`, or other temporary curriculum-location fields to a library record.
- `topics` describe subject matter. `skills` describe what a learner can practice or demonstrate.
- `grade_band` describes suitability, not ownership by a specific course.
- `optional` should remain `true` when the written lesson must stand on its own without the video.
- `autoplay` remains `false`.
- `transcript` is `null` until a transcript resource actually exists.
- `captions_verified` remains `false` until captions have been checked.
- Until transcript/caption accessibility is verified, videos must not be required to access essential instruction.

## Alignment status

- `aligned` — appropriate as a normal instructional support.
- `enrichment_only` — useful but advanced, specialized, or not appropriate as core instruction.
- `not_aligned` — does not support the active Language Arts curriculum. Preserve such records in `_quarantine/` for audit until they are intentionally relocated or removed.

## Adding a new resource

1. Check that the video is instructionally appropriate and reusable.
2. Assign a new permanent `asset_id`.
3. Create a topic-based `.json` file using schema 1.1.
4. Write curriculum-neutral topics, skills, and alignment notes.
5. Record transcript/caption status accurately; never assume accessibility verification.
6. Reference the `asset_id` from curriculum rather than duplicating the manifest.

This keeps the media registry reusable across English 9, later English courses, research instruction, rhetoric, writing, and other Language Arts programs without duplicating assets or tying them to temporary curriculum positions.
