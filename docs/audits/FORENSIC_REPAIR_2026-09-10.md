# Khaemenes High — Forensic Repair Log

Source: `Khaemenes-High-Hardening-Emergency-Checkpoint-2026-09-10.zip`

Repairs applied conservatively to verified structural/integrity defects. Intended STOS absolute routes were preserved. Curriculum content was not rewritten.

## Repairs

- Renamed malformed JSON asset: courses/language-arts/assets/video-library/mood,json -> courses/language-arts/assets/video-library/mood.json
- Renamed directory masquerading as JSON file: courses/mathematics/pre-algebra/assets/video-manifest.json -> courses/mathematics/pre-algebra/assets/legacy-video-manifest
- Removed duplicate live id="content" container from courses/language-arts/english-9/index.html
- Refreshed checksum manifest courses/mathematics/algebra-1/units/unit-09/SHA256SUMS.txt: 7 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/algebra-1/units/unit-02/SHA256SUMS.txt: 7 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/algebra-1/units/unit-05/SHA256SUMS.txt: 7 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/algebra-1/units/unit-07/SHA256SUMS.txt: 7 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/algebra-1/units/unit-04/SHA256SUMS.txt: 6 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/algebra-1/units/unit-08/SHA256SUMS.txt: 6 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/algebra-1/units/unit-01/SHA256SUMS.txt: 6 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/algebra-1/units/unit-06/SHA256SUMS.txt: 8 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/algebra-1/units/unit-03/SHA256SUMS.txt: 7 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/algebra-2/SHA256SUMS.txt: 2 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/precalculus-trigonometry/SHA256SUMS.txt: 93 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/geometry/SHA256SUMS.txt: 127 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/mathematics/calculus-1/SHA256SUMS.txt: 1 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest courses/SHA256SUMS.txt: 87 hashes updated, 0 missing entries annotated
- Refreshed checksum manifest SHA256SUMS.txt: 1 hashes updated, 0 missing entries annotated
- Regenerated FILE_INVENTORY.json with 5602 non-circular file records (previous inventory had 189)
- Refreshed Grade-09 instructional checksum seal: 598 hashes updated, 0 missing entries annotated
- Renamed malformed JSON asset `rhyme-scheme,json` to `rhyme-scheme-1.json` because `rhyme-scheme.json` already legitimately existed with a different asset ID; no file was overwritten.
