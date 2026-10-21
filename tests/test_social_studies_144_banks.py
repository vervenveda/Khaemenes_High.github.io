"""Audit exactly 144 canonical Grades 9–12 Social Studies weekly quiz banks.
Safe: never changes scored assessments. Run: python tests/test_social_studies_144_banks.py
"""
import json, pathlib, collections, re, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]/"courses/social-studies"
def bank_path(grade,week):
 prefix=f"grade-{grade:02d}"
 folder=f"week-{week:02d}" if grade in (9,10) else f"weeks/week-{week:02d}"
 return ROOT/prefix/folder/"quiz.json"
def inspect():
 errors=[]; summary={}; warnings=[]
 for grade in range(9,13):
  totals=[]; positions=collections.Counter(); duplicate_ids=0
  for week in range(1,37):
   path=bank_path(grade,week)
   if not path.is_file(): errors.append(f"G{grade} W{week:02d}: missing {path}");continue
   try: bank=json.loads(path.read_text(encoding="utf-8"))
   except (OSError,ValueError) as e: errors.append(f"G{grade} W{week:02d}: invalid JSON: {e}");continue
   items=bank.get("questions")
   if not isinstance(items,list) or not items:
    errors.append(f"G{grade} W{week:02d}: no nonempty questions");continue
   totals.append(len(items)); seen=set()
   for n,q in enumerate(items,1):
    if not isinstance(q,dict):errors.append(f"G{grade} W{week:02d} Q{n}: not object");continue
    label=q.get("prompt") or q.get("question")
    choices=q.get("choices") or q.get("options")
    ans=q.get("answer")
    if not isinstance(label,str) or not label.strip():errors.append(f"G{grade} W{week:02d} Q{n}: prompt empty")
    if not isinstance(choices,list) or len(choices)<2 or any(not isinstance(c,str) or not c.strip() for c in choices):
     errors.append(f"G{grade} W{week:02d} Q{n}: invalid choices");continue
    if type(ans) is not int or not 0<=ans<len(choices):
     errors.append(f"G{grade} W{week:02d} Q{n}: invalid answer index");continue
    positions[ans]+=1
    key=re.sub(r"\s+"," ",label.strip().casefold()) if isinstance(label,str) else ""
    if key in seen:duplicate_ids+=1
    seen.add(key)
  counts=sum(positions.values())
  summary[str(grade)]={"weeks_loaded":len(totals),"questions_total":sum(totals),"min_questions":min(totals,default=0),"max_questions":max(totals,default=0),"correct_answer_positions":dict(sorted(positions.items())),"repeated_prompts_within_week":duplicate_ids}
  if len(totals)!=36:errors.append(f"G{grade}: only {len(totals)} / 36 banks loaded")
  if duplicate_ids:warnings.append(f"G{grade}: {duplicate_ids} repeated prompts within their weekly bank")
  if counts and max(positions.values())/counts>.40:warnings.append(f"G{grade}: answer-key position imbalance >40%; shuffle answer options only in ungraded practice, do not alter canonical scoring")
 return errors,warnings,summary
class TestBanks(unittest.TestCase):
 def test_all_144_load_and_validate(self):
  errors,warnings,summary=inspect()
  print("\\nSOCIAL_STUDIES_BANK_AUDIT="+json.dumps({"summary":summary,"warnings":warnings,"errors":errors},indent=2))
  self.assertEqual(errors,[], "\\n".join(errors[:35]))
if __name__=="__main__":unittest.main(verbosity=2)
