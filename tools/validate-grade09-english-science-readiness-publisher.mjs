import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const src=fs.readFileSync(path.join(root,"courses/shared/grade09-english-science-readiness-publisher.js"),"utf8");
const page=fs.readFileSync(path.join(root,"portfolio/index.html"),"utf8");
const report=fs.readFileSync(path.join(root,"portfolio/portfolio-academic-report.js"),"utf8");
assert.match(page,/grade09-english-science-readiness-publisher\.js/);
assert.match(report,/english-9-readiness/);
assert.match(report,/integrated-science-9-readiness/);
function exercise({foreign=false,grade="09",english=true,science=true,badEnglish=false,badScience=false,conflict=false}={}){
 let writes=0;
 const store=new Map();
 const data={
  khaemenes_english9_readiness_records_v1:english?[{record_type:"readiness",course_id:"english-9",assessment_id:"english9-readiness-gateway",learner_id:badEnglish?"not-this-learner":"learner-A",raw_score:{earned:9,possible:10},overall_percent:90,timestamp:"2026-11-19T11:00:00Z",attempt_number:1,strand_scores:{private:"never-export"}}]:null,
  khaemenes_science_u00_v1:science?{diagnostic:{completed:true,score:badScience?25:23,total:24,completedAt:"2026-11-19T12:00:00Z",answers:[0,1,2]}}:null
 };
 const window={document:{readyState:"complete"},addEventListener(){},
  KhaemenesCourseEntryContract:{readAcademyProfile:()=>({learnerId:"learner-A"}),readJSON:key=>data[key]},
  KhaemenesHighProfileGradeContext:{active:()=>({learnerId:foreign?"learner-B":"learner-A",grade})},
  KhaemenesLearningContinuation:{
   readCourse:(_,course)=>store.get(course)||(conflict?{source:"unknown-owner"}:null),
   publish:item=>{writes++;store.set(item.courseId,JSON.parse(JSON.stringify(item)))}
  }};
 vm.runInNewContext(src,{window,document:window.document});
 const first=writes;const next=window.KhaemenesGrade09ReadinessPublisher.publish();
 return {first,writes,store:[...store.values()],next};
}
const good=exercise();
const checks=[
 ["both linked sources published",()=>assert.equal(good.first,2)],
 ["English scored points",()=>assert.equal(good.store[0].assessments[0].earned,9)],
 ["Science scored points",()=>assert.equal(good.store[1].assessments[0].possible,24)],
 ["dedicated source identifiers",()=>assert.deepEqual(good.store.map(x=>x.courseId),["english-9-readiness","integrated-science-9-readiness"])],
 ["no answer payloads",()=>assert(!JSON.stringify(good.store).includes("never-export")&&!JSON.stringify(good.store).includes("answers"))],
 ["no duplicate publication",()=>assert.equal(good.writes,2)],
 ["foreign learner rejected",()=>assert.equal(exercise({foreign:true}).first,0)],
 ["upper grade rejected",()=>assert.equal(exercise({grade:"10"}).first,0)],
 ["foreign English identity rejected",()=>assert.equal(exercise({badEnglish:true}).first,1)],
 ["Science 25/24 rejected",()=>assert.equal(exercise({badScience:true}).first,1)],
 ["unknown ledger owner not overwritten",()=>assert.equal(exercise({conflict:true}).first,0)],
 ["missing English does not invent it",()=>assert.equal(exercise({english:false}).first,1)],
 ["missing Science does not invent it",()=>assert.equal(exercise({science:false}).first,1)]
];
for(const [name,fn] of checks){fn();console.log("PASS",name)}
console.log("GRADE09_ENGLISH_SCIENCE_READINESS_PUBLISHER_PASS="+checks.length);
