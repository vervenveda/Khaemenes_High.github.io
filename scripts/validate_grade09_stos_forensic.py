from pathlib import Path
import json,re,urllib.parse,os,sys
ROOT=Path(__file__).resolve().parents[1]
fail=[]
pass_=[]
def ok(cond,label):
    (pass_ if cond else fail).append(label)

# Repair 1: cache boundary
sw=(ROOT/'service-worker.js').read_text(errors='ignore')
ok('shouldNeverCache' in sw,'root service worker has sensitive-cache deny rule')
precache=sw.split('const SENSITIVE_CACHE_PATTERNS',1)[0]
ok(not re.search(r'answer[-_]?keys?|teacher-guide|/teacher/|final[-_]?key|midterm[-_]?key',precache,re.I),'root precache excludes answer keys and teacher-only resources')
ok('cache: "no-store"' in sw,'sensitive requests use no-store network path')

# Repair 2: Grade 09 portability/catalog
index=(ROOT/'grades/grade-09/index.html').read_text(errors='ignore')
ok('/Khaemenes_High.github.io/' not in index,'Grade 09 landing has no fixed GitHub project prefix')
reg=(ROOT/'grades/grade-09/student-profile/student-course-registry.js').read_text(errors='ignore')
ok('repositoryBasePath' in reg and 'normalizeLegacyRoute' in reg,'student registry derives host-neutral repository base and migrates legacy saved routes')
cat=json.loads((ROOT/'grades/grade-09/course-catalog.json').read_text())
core={c['id']:c for c in cat['courses']}
for cid,canonical in [('math-prealgebra','pre-algebra'),('math-algebra1','algebra-1'),('ela-english9','english-9'),('science-integrated9','integrated-science-9'),('social-world','global-studies-9')]:
    c=core.get(cid,{})
    ok(c.get('status')=='open' and c.get('canonical_id')==canonical and bool(c.get('path')),f'catalog {cid} is open with canonical id/path')

# Repair 3: scoped internal link integrity
scopes=[
 ROOT/'grades/grade-09',
 ROOT/'courses/language-arts/english-9',
 ROOT/'courses/social-studies/grade-09',
 ROOT/'courses/science/integrated-science-9',
 ROOT/'courses/mathematics/algebra-1',
]
broken=[]
for base in scopes:
    for f in base.rglob('*.html'):
        if f.name.endswith('_SNIPPET.html'): continue
        txt=f.read_text(errors='ignore')
        for val in re.findall(r'\b(?:href|src)\s*=\s*["\']([^"\']+)["\']',txt,re.I):
            val=val.strip()
            if not val or val.startswith(('#','http://','https://','mailto:','tel:','data:','javascript:','blob:','${')): continue
            p=urllib.parse.urlsplit(val).path
            if not p or p.startswith('/stos/'): continue
            target=(ROOT/p.lstrip('/')) if p.startswith('/') else (f.parent/p).resolve()
            try: target.relative_to(ROOT)
            except Exception:
                broken.append((str(f.relative_to(ROOT)),val,'outside-root')); continue
            if not (target.exists() or (target.suffix=='' and (target/'index.html').exists())):
                broken.append((str(f.relative_to(ROOT)),val,str(target.relative_to(ROOT))))
ok(not broken,f'scoped Grade 09 internal href/src links resolve (broken={len(broken)})')

# Science Unit 01 specific release contract
v=(ROOT/'courses/science/integrated-science-9/tools/validate-unit01.mjs').read_text(errors='ignore')
day1=(ROOT/'courses/science/integrated-science-9/units/unit-01/lessons/day-01.html').read_text(errors='ignore')
ok(bool(re.search(r'Mastery|80%|≥80%',day1,re.I)),'Science Unit 01 Day 1 states mastery boundary')
ok('computed ≥80%' in v and 'Mastery Requirements' in v,'Science Unit 01 validator accepts canonical computed threshold/dashboard markup')

# Repair 4: Social Studies canonical mastery
ssj=json.loads((ROOT/'courses/social-studies/grade-09/data/course-data.json').read_text())
ssjs=(ROOT/'courses/social-studies/grade-09/course-data.js').read_text(errors='ignore')
ok(ssj.get('metadata',{}).get('passingTarget')==80,'Social Studies canonical JSON passingTarget is 80')
ok('"passingTarget": 70' not in ssjs and '"passingTarget":70' not in ssjs,'Social Studies JS no longer carries legacy 70% threshold')

# Repair 5: Algebra I transition page
ok((ROOT/'courses/mathematics/algebra-1/transition-contract.html').exists(),'Algebra I transition-contract.html exists')
a1sw=(ROOT/'courses/mathematics/algebra-1/service-worker.js').read_text(errors='ignore')
ok('./transition-contract.html' in a1sw,'Algebra I offline release includes transition-contract.html')

for label in pass_: print('PASS',label)
for label in fail: print('FAIL',label)
print(f'RESULT: {len(pass_)} passed, {len(fail)} failed')
if broken:
    for item in broken[:20]: print('BROKEN',*item)
if fail: sys.exit(1)
