#!/usr/bin/env python3
"""Embed the shared title sizes without adding offline or CSP dependencies.
Run with --check to verify coverage; omit it to refresh public documents.
STOS documents, redirects without a head, and HTML snippets stay untouched.
"""
import argparse
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
css = (ROOT / 'assets/typography-standard.css').read_bytes()
pattern = rb'<style id="khaemenes-typography-standard">\r?\n[\s\S]*?</style>\r?\n'
errors = []
count = 0
for path in sorted(ROOT.rglob('*.html')):
    relative = path.relative_to(ROOT)
    if any(part.lower() in ('stos', '.git') for part in relative.parts):
        continue
    original = path.read_bytes()
    if not re.search(rb'</head\s*>', original, re.I):
        continue
    newline = b'\r\n' if b'\r\n' in original else b'\n'
    block = (b'<style id="khaemenes-typography-standard">\n' + css + b'</style>\n').replace(b'\n', newline)
    clean = re.sub(pattern, b'', original)
    expected = re.sub(rb'</head\s*>', lambda match: block + match.group(0), clean, count=1, flags=re.I)
    count += 1
    if original != expected:
        if args.check:
            errors.append(str(relative))
        else:
            path.write_bytes(expected)
if errors:
    print('Typography standard missing or stale:\n' + '\n'.join(errors))
    raise SystemExit(1)
print(f'PASS: typography standard {"verified" if args.check else "applied"} in {count} public documents; STOS excluded.')
