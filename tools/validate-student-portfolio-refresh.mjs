/* Native, synthetic refresh interaction regression. No actual student records. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const check=(condition,msg)=>{if(!condition)throw Error("ACADEMIC REFRESH FAIL: "+msg)};
const page=read("portfolio/index.html"),report=read("portfolio/portfolio-academic-report.js"),css=read("portfolio/portfolio-studio.css");
check(page.includes('id="refreshEvidenceStatus"'),"refresh result status area exists");
check(page.includes("portfolio-academic-report.js?v=20261120-readiness-publisher-v5"),"current academic refresh script cache version");
check(css.includes(".portfolio-report-refresh-status"),"refresh feedback uses existing stylesheet");
class Node {
 constructor(tag="div"){this.tag=tag;this.children=[];this.textContent="";this.disabled=false;this.listeners={}}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 addEventListener(name,handler){this.listeners[name]=handler}
 click(){this.listeners.click?.()}
}
const sample=[{learnerId:"test-learner",grade:"09",courseId:"english-9",courseTitle:"English 9",progress:{percent:25},assessments:[
 {id:"quiz-1",kind:"quiz",earned:9,possible:10,title:"Quiz 1"},
 {id:"midterm-1",kind:"test",earned:45,possible:50,title:"Midterm Assessment"},
 {id:"final-1",kind:"test",earned:20,possible:25,title:"Final Exam"}]}];
function scenario(records,verified=true,service=true){
 const ids=Object.fromEntries(["homeschoolReportBody","reportIdentity","reportCourseCount","reportAssessmentCount","printReport","exportReport","refreshReport","refreshEvidenceStatus"].map(k=>[k,new Node()]));
 const window={KhaemenesCourseEntryContract:{readAcademyProfile:()=>({learnerId:"test-learner",name:"Fixture"})},
 KhaemenesHighProfileGradeContext:{active:()=>({learnerId:"test-learner",grade:"09"})},
 KhaemenesHighCoursePins:{activeLearner:()=>verified?"test-learner":null,readPins:()=>[],readLanguageChoices:()=>({})},
 KhaemenesHighEightClass:{slots:()=>[{id:"english-9",label:"English",title:"English 9"}]},
 KhaemenesLearningContinuation:service?{readLearner:()=>records}:undefined,addEventListener(){}};
 const document={getElementById:k=>ids[k]||null,createElement:tag=>new Node(tag),body:new Node()};
 let writes=0;
 const localStorage={getItem:()=>null,setItem:()=>{writes++;throw Error("forbidden storage write")}};
 vm.runInNewContext(report,{window,document,localStorage,Blob:class Blob{},URL:class URL{},setTimeout:()=>{}});
 const first=ids.refreshEvidenceStatus.textContent;
 ids.refreshReport.click();
 const second=ids.refreshEvidenceStatus.textContent;
 return {first,second,count:ids.reportAssessmentCount.textContent,disabled:ids.exportReport.disabled,writes};
}
const scored=scenario(sample);
check(scored.second.startsWith("Refresh #2")&&scored.second.includes("3 scored assessments"),"click visibly refreshes real saved scores");
check(scored.count==="3"&&!scored.disabled,"scored report available for export");
const noScores=scenario([]);
check(noScores.second.includes("No current course evidence has been published"),"no records explicitly attributed to publication gap");
const wrongLearner=scenario(sample,false);
check(wrongLearner.second.includes("learner verification is required")&&wrongLearner.disabled,"wrong learner cannot view or export");
const noLedger=scenario([],true,false);
check(noLedger.second.includes("Course-continuation records are unavailable")&&!noLedger.disabled,"unavailable ledger is reported but independent readiness remains available");
for(const item of [scored,noScores,wrongLearner,noLedger])check(item.writes===0,"refresh has no student record writes");
console.log("STUDENT PORTFOLIO ACADEMIC REFRESH: PASS (click, score evidence, empty ledger, wrong learner, unavailable ledger, zero writes).");
