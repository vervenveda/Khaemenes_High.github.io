from pathlib import Path

page = Path('grades/grade-09/index.html').read_text(encoding='utf-8')

required = [
    'Grade 09 Campus',
    'Mathematics Pathway',
    'Mathematics is placement-based.',
    '/Khaemenes_High.github.io/courses/mathematics/',
    '/Khaemenes_High.github.io/courses/mathematics/pre-algebra/',
    '/Khaemenes_High.github.io/courses/mathematics/algebra-1/diagnostic/',
    'readiness and mastery evidence rather than grade level',
]
for token in required:
    if token not in page:
        raise SystemExit(f'Missing required Grade 09 mathematics contract: {token}')

forbidden = [
    'Pre-Algebra / Grade 09 mathematics pathway.',
    'Grade 09 Mathematics',
    'Grade 9 Mathematics',
    'Pre-Algebra is the Grade 09',
]
for token in forbidden:
    if token in page:
        raise SystemExit(f'Forbidden grade-owned mathematics label found: {token}')

print('Grade 09 mathematics labeling contract: PASS')
