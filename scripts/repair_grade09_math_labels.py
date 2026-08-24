from pathlib import Path

path = Path('grades/grade-09/index.html')
text = path.read_text(encoding='utf-8')

old = '<article class="course math"><h3>Mathematics</h3><p>Pre-Algebra / Grade 09 mathematics pathway.</p><div class="actions"><a class="btn" href="/Khaemenes_High.github.io/courses/mathematics/pre-algebra/">Course Home</a></div></article>'
new = '<article class="course math"><h3>Mathematics Pathway</h3><p>Mathematics is placement-based. Pre-Algebra, Algebra I, Geometry, Algebra II, and later courses are assigned by readiness and mastery evidence rather than grade level.</p><div class="actions"><a class="btn" href="/Khaemenes_High.github.io/courses/mathematics/">Mathematics Hall</a><a class="btn secondary" href="/Khaemenes_High.github.io/courses/mathematics/pre-algebra/">Pre-Algebra</a><a class="btn secondary" href="/Khaemenes_High.github.io/courses/mathematics/algebra-1/diagnostic/">Algebra I Readiness</a></div></article>'

if old not in text:
    if new in text:
        print('Grade 09 mathematics labels already repaired.')
        raise SystemExit(0)
    raise SystemExit('Expected Grade 09 mathematics card was not found; refusing to guess.')

text = text.replace(old, new, 1)

if 'Pre-Algebra / Grade 09 mathematics pathway.' in text:
    raise SystemExit('Legacy grade-owned mathematics label remains.')
if 'Mathematics is placement-based.' not in text:
    raise SystemExit('Placement-based mathematics statement missing after repair.')
if '/courses/mathematics/algebra-1/diagnostic/' not in text:
    raise SystemExit('Algebra I readiness doorway missing after repair.')

path.write_text(text, encoding='utf-8')
print('Repaired Grade 09 mathematics labeling.')
