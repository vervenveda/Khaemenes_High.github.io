#!/usr/bin/env python3
"""Check actual href/src/action/poster attributes across all served HTML documents."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import posixpath
import sys
ROOT = Path(__file__).resolve().parents[1]
class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []
    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ('href', 'src', 'action', 'poster') and value:
                self.references.append((value, self.getpos()[0]))
errors = []
pages = references = 0
for source in ROOT.rglob('*.html'):
    if '.git' in source.parts:
        continue
    pages += 1
    parser = Links()
    parser.feed(source.read_text(encoding='utf-8'))
    for value, line in parser.references:
        if '${' in value or '{{' in value:
            continue
        parsed = urlsplit(value)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        references += 1
        relative = unquote(parsed.path)
        if relative.startswith('/Khaemenes_High.github.io/'):
            relative = relative[len('/Khaemenes_High.github.io/'):]
        elif relative.startswith('/'):
            relative = relative.lstrip('/')
        else:
            relative = posixpath.normpath(posixpath.join(source.parent.relative_to(ROOT).as_posix(), relative))
        target = ROOT / relative
        if target.is_dir():
            target /= 'index.html'
        if not target.is_file():
            errors.append(f'{source.relative_to(ROOT)}:{line}: {value} -> {relative}')
if errors:
    print('\n'.join(errors))
    print(f'FAIL: {len(errors)} missing local references')
    sys.exit(1)
print(f'PASS: {pages} pages, {references} local references, zero missing files')
