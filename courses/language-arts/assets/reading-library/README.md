# Language Arts Reading Library

Reusable reading-source metadata for Khaemenes Academy Language Arts.

## Architecture

**Registry owns source identity and rights; curriculum owns placement.**

A reading asset may support multiple grades, units, weeks, or lessons. Do not encode course placement into the permanent asset metadata unless the source itself is course-specific.

## Schema 1.0

Required fields:

- `schema_version`
- `asset_id`
- `title`
- `author`
- `provider`
- `resource_type`
- `source_url`
- `access`
- `rights_status`
- `rights_note`
- `grade_band`
- `topics`
- `skills`
- `estimated_reading_time`
- `alignment_status`
- `alignment_note`

Optional fields may include `edition`, `translator`, `text_location`, or other source-specific notes when needed.

## Rights rules

- `academy_original`: Khaemenes/Verve N Veda original instructional material.
- `public_domain`: source text is in the public domain; record edition/translation status when relevant.
- `open_license`: source is openly licensed; record the license.
- `linked_external_copyrighted`: link to the lawful external source; do not copy the full work into the repository.
- `rights_review`: do not use as a required reading until rights/access are resolved.

## Instructional rule

If a reading is essential, the student should never have to hunt for it. Curriculum pages should provide a direct lawful path to the text or embed an Academy-original/open text when appropriate.

For diagnostic tasks, preserve test integrity: support readings and annotation tools should appear only after the cold response when advance access would change the baseline.
