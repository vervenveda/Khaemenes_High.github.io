#!/usr/bin/env python3
"""Read-only inventory of High School Mathematics educational video assets.

Run from repository root:
    python3 tools/audit_math_video_archive.py
    python3 tools/audit_math_video_archive.py --output math-video-inventory.json

No dependencies, network requests, or student data access.
This tool does not certify embedding rights or advertisement-free playback.
"""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATH = ROOT / "courses" / "mathematics"
EXT = {".json", ".js", ".html", ".md", ".txt", ".vtt", ".srt", ".csv"}
PATTERN = re.compile(r"video|transcript|captions|student_release_approved|youtube|vimeo|khan.?academy|chemistry.?tutor|embed", re.I)
URL = re.compile(r"https?://[^\\s\\\"'<>]+", re.I)

def safe_relative(path):
    return path.relative_to(ROOT).as_posix()

def inventory():
    records = []
    if not MATH.is_dir():
        raise SystemExit("Mathematics root missing: " + str(MATH))
    for file in sorted(MATH.rglob("*")):
        if not file.is_file() or file.suffix.lower() not in EXT:
            continue
        try:
            if file.stat().st_size > 3_000_000:
                continue
            body = file.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        lines = body.splitlines()
        matches = [i for i, line in enumerate(lines) if PATTERN.search(line)]
        if not matches and "video" not in file.name.lower():
            continue
        urls = sorted({u.rstrip(").,;") for u in URL.findall(body) if re.search(r"youtube|youtu\\.be|vimeo|khanacademy", u, re.I)})[:30]
        records.append({
            "path": safe_relative(file),
            "matched_lines": len(matches),
            "sample_lines": [{"line": i + 1, "text": lines[i][:220]} for i in matches[:12]],
            "provider_urls_sample": urls,
            "mentions_student_release_approved": "student_release_approved" in body,
            "mentions_transcript": bool(re.search(r"transcript|\\.vtt|\\.srt", body, re.I)),
            "mentions_video": bool(re.search(r"video|youtube|vimeo", body, re.I)),
        })
    return records

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--output")
    args = p.parse_args()
    items = inventory()
    report = {
        "schema": "khaemenes-math-video-asset-discovery-v1",
        "source_root": "courses/mathematics",
        "status": "discovery_only_not_release_approval",
        "matched_file_count": len(items),
        "files": items,
    }
    encoded = json.dumps(report, indent=2, ensure_ascii=False) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded)
