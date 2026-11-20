#!/usr/bin/env node
import fs from "node:fs";

const fail=[];
const read=p=>fs.readFileSync(p,"utf8");
const need=(text,token,label)=>{if(!text.includes(token))fail.push(label+" missing: "+token)};

const spec=read("workflow/specs/grade09-retention-curriculum-standard-v1.md");
need(spec,"8 questions from current learning","retention standard");
need(spec,"15 current","retention standard");
need(spec,"No repository audit may claim an actual learner retention percentage","retention standard");

const pa=read("courses/mathematics/pre-algebra/assets/prealgebra-weekly-mastery-v2.js");
need(pa,'weekly_blueprint:"8-current+2-delayed"',"Pre-Algebra");
need(pa,"retrieval_from_week","Pre-Algebra");

const a1=read("courses/mathematics/algebra-1/assessments/assets/weekly-mastery-retrieval-v3.js");
need(a1,'blueprint:"8-current+2-delayed"',"Algebra I");
need(a1,"row.current_count=8","Algebra I");
need(a1,"row.delayed_count=2","Algebra I");

const sci=read("courses/science/integrated-science-9/science9-dashboard-app-v1.js");
for(const token of [
 "function scienceRetentionPool(w)",
 "sourceQuotas:{current:8,retrieval:2}",
 'blueprint:"8-current+2-delayed"',
 "retrieval_from_week",
 "delayed retention",
 "retention={current:"
]) need(sci,token,"Science 9");
need(sci,"score>=APP.passingTarget","Science 9 80-percent authority");

const eng=read("courses/language-arts/english-9/assets/course.js");
for(const token of [
 "function attachDelayedRetrieval()",
 'data-english9-delayed-retrieval',
 'data-retention-only',
 'if(field.hasAttribute("data-retention-only"))return false',
 "Retrieve before you review",
 "do not change the weekly mastery rubric"
]) need(eng,token,"English 9");

const pe=read("courses/physical-education/index.html");
for(const token of [
 "function peRetentionBank(w,x)",
 "take(current,15)",
 "take(delayed,currentCount+5)",
 'retentionSource:"retrieval"',
 "15 current + 5 delayed-retrieval",
 "Delayed retention:"
]) need(pe,token,"PE 9");
const peEngine=read("courses/physical-education/assessment-engine.js");
for(const token of [
 'retentionSource:q.retentionSource||"current"',
 "retrievalFromWeek",
 "retention={current:scoreGroup(current),delayed:scoreGroup(delayed)"
]) need(peEngine,token,"PE assessment engine");
need(peEngine,"passed:correct/attempt.items.length>=0.8","PE 80-percent authority");

const gs=read("courses/social-studies/grade-09/course-data.js");
for(const token of [
 '"weeks":36',
 '"dailyLessons":180',
 '"assignments":108',
 '"weeklyQuizzes":36',
 "Retrieve six key terms and three major ideas without notes"
]) need(gs,token,"Global Studies");

const psych=read("electives/grades/grade-09/psych-101/lessons/index.html");
for(const token of ["13 weeks","65 lessons","13 weekly mastery assessments","3 Cumulative Checkpoints"]) need(psych,token,"Psychology 101");
for(const p of [
 "electives/grades/grade-09/psych-101/assessments/cumulative-01.html",
 "electives/grades/grade-09/psych-101/assessments/cumulative-02.html",
 "electives/grades/grade-09/psych-101/assessments/cumulative-03.html"
]){
 const t=read(p);need(t,"80%","Psychology cumulative "+p);need(t,"Cumulative","Psychology cumulative "+p);
}

if(fail.length){
 console.error(JSON.stringify({status:"FAIL",fail},null,2));
 process.exit(1);
}
console.log(JSON.stringify({
 status:"PASS",
 scope:"Grade 09 curriculum depth and retention architecture",
 protected:{
  mathematics:"8-current + 2-delayed reference models",
  science:"8-current + 2-delayed with retained provenance",
  english:"non-grading near/longer-lag retrieval",
  pe:"15-current + 5-delayed with retained provenance",
  globalStudies:"retrieval-before-review and 36-week evidence load",
  psychology:"parallel/cumulative mastery architecture"
 }
},null,2));
