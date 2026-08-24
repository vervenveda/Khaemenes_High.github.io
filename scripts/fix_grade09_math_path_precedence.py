from pathlib import Path

path = Path('grades/grade-09/student-profile/student-course-registry.js')
text = path.read_text(encoding='utf-8')
old = '''function mathPathway(pinSource=rawPins()){
  if(hasAlgebraCourseEvidence())return "algebra-1";
  const explicit=explicitMathPathway();
  if(explicit==="algebra-1")return explicit;
  if(hasDiagnosticEvidence())return "algebra-1";
  if(explicit==="pre-algebra")return explicit;
  if(hasPreAlgebraCourseEvidence())return "pre-algebra";
  const mathPins=pinSource.filter(id=>MATH_ID_SET.has(id));
  return mathPins.length===1?mathPins[0]:null;
}'''
new = '''function mathPathway(pinSource=rawPins()){
  const explicit=explicitMathPathway();
  if(explicit)return explicit;
  if(hasAlgebraCourseEvidence())return "algebra-1";
  if(hasPreAlgebraCourseEvidence())return "pre-algebra";
  if(hasDiagnosticEvidence())return "algebra-1";
  const mathPins=pinSource.filter(id=>MATH_ID_SET.has(id));
  return mathPins.length===1?mathPins[0]:null;
}'''
if old not in text:
    if new in text:
        print('Mathematics pathway precedence already refined.')
        raise SystemExit(0)
    raise SystemExit('Expected mathPathway function not found; refusing to guess.')
path.write_text(text.replace(old, new, 1), encoding='utf-8')
print('Refined mathematics pathway precedence.')
