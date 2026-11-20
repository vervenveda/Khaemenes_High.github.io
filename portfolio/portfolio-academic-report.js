/* Khaemenes High · read-only homeschool academic progress / transcript-preparation.
 * Sources: registered Academy learner + course-owned continuation ledger.
 * Never writes course results, calculates credit, certifies transcripts, or guesses grades.
 */
(()=>{"use strict";
const host=document.getElementById("homeschoolReportBody");if(!host)return;
const $=id=>document.getElementById(id);
const number=n=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=100?n:null;
const display=n=>n===null?"Not reported":(Number.isInteger(n)?n:n.toFixed(1))+"%";
const mk=(tag,cls,content)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(content!==undefined)node.textContent=String(content);return node};
const profileApi=window.KhaemenesCourseEntryContract;
const gradeContext=window.KhaemenesHighProfileGradeContext;
const getLedger=()=>window.KhaemenesLearningContinuation;
const pinApi=window.KhaemenesHighCoursePins;
const receiptApi=()=>window.KhaemenesPortfolioEvidenceReceipts;
const catalog=window.KhaemenesHighEightClass;
const normalizeGrade=g=>{const s=String(g??"").replace(/^grade[\s-]*/i,"").padStart(2,"0");return ["09","10","11","12"].includes(s)?s:null};
const aliases=id=>/^english-(10|11|12)$/.test(id||"")?[id,"ela"+id.slice(-2)]:id?[id]:[];
function learner(){
 const current=profileApi?.readAcademyProfile?.(),ctx=gradeContext?.active?.(),pin=pinApi?.activeLearner?.();
 if(!current?.learnerId||!ctx?.learnerId||ctx.learnerId!==current.learnerId||pin!==current.learnerId)return null;
 const grade=normalizeGrade(ctx.grade);
 if(!grade)return null;
 return {id:String(ctx.learnerId),grade,name:String(current.nickname||current.name||ctx.nickname||"Registered learner").slice(0,100)};
}
function scoreBucket(a){
 const key=String(a?.title||"")+" "+String(a?.id||"");
 if(/\bmid[ -]?term\b/i.test(key))return "Midterm";
 if(/\bfinal(?:\s+exam|\s+assessment)?\b/i.test(key))return "Final";
 return a.kind==="quiz"?"Quiz":"Other test";
}
function assessments(record){
 const seen=new Set(),rows=[];
 for(const a of Array.isArray(record?.assessments)?record.assessments:[]){
  if(!a||!["quiz","test"].includes(a.kind)||typeof a.id!=="string"||seen.has(a.id))continue;
  if(!Number.isFinite(a.earned)||!Number.isFinite(a.possible)||a.earned<0||a.possible<=0||a.earned>a.possible)continue;
  seen.add(a.id);
  rows.push({id:a.id,title:String(a.title||a.id).slice(0,120),type:scoreBucket(a),earned:a.earned,possible:a.possible,percent:Math.round(1000*a.earned/a.possible)/10,gradedAt:String(a.gradedAt||"").slice(0,40)});
 }
 return rows;
}
function summary(rows){
 let totalEarned=0,totalPossible=0;
 for(const a of rows){totalEarned+=a.earned;totalPossible+=a.possible}
 return totalPossible?Math.round(1000*totalEarned/totalPossible)/10:null;
}
function progress(record){return number(record?.progress?.percent)}
function slotsFor(grade){
 const mathSelected=grade==="09"?(pinApi?.readPins?.()||[]).filter(id=>id==="algebra-1"||id==="pre-algebra"):null;
 const mathId=mathSelected?.length===1?mathSelected[0]:null;
 const language=pinApi?.readLanguageChoices?.()?.[String(Number(grade))]||null;
 try{return catalog?.slots?.(Number(grade),{mathId,language})||[]}catch{return []}
}
function currentRecords(user){
 const list=getLedger()?.readLearner?.(user.id)||[];
 return list.filter(record=>{
  // This separate readiness index is not an official Algebra I course grade.
  if(!record||record.learnerId!==user.id||["algebra-1-readiness","english-9-readiness","integrated-science-9-readiness","english-9-objective-evidence"].includes(record.courseId)||typeof record.courseId!=="string")return false;
  const tagged=record.grade?normalizeGrade(record.grade):null;
  return !record.grade||tagged===user.grade;
 });
}
// Read only learner-linked original Algebra I readiness results; no implicit
// attribution of unscoped results and no mutation of assessment evidence.
function algebraReadiness(user){
 if(!user||user.grade!=="09")return null;
 const base="khaemenes-algebra1-diagnostic-result-v1";
 const profile=profileApi?.readAcademyProfile?.();
 if(!profile||profile.learnerId!==user.id)return null;
 const record=profileApi?.readJSON?.(base,null,profile);
 const valid=a=>a&&a.id==="KH-MATH-A1-DIAGNOSTIC"&&a.total===36&&
  Number.isInteger(a.score)&&a.score>=0&&a.score<=36&&
  typeof a.percent==="number"&&Number.isFinite(a.percent)&&
  Math.abs(a.percent-a.score/36*100)<0.2&&
  typeof a.submitted==="string"&&!Number.isNaN(Date.parse(a.submitted));
 const attempts=Array.isArray(record?.attempt_history)?record.attempt_history.filter(valid):[];
 if(!attempts.length&&valid(record?.lastResult))attempts.push(record.lastResult);
 if(attempts.length){
  const last=attempts.slice().sort((a,b)=>Date.parse(b.submitted)-Date.parse(a.submitted))[0];
  return {state:"LEARNER_LINKED_LOCAL",title:"Algebra I Readiness Diagnostic",
   score:last.score,total:36,percent:last.percent,submitted:last.submitted,
   attempts:attempts.length,officialCourseGrade:false,cloudVerified:false};
 }
 try{
  const raw=localStorage.getItem(base);
  if(raw!==null){
   const legacy=JSON.parse(raw);
   const qualified=Array.isArray(legacy?.attempt_history)?legacy.attempt_history.filter(valid):[];
   if(!qualified.length&&valid(legacy?.lastResult))qualified.push(legacy.lastResult);
   return {state:qualified.length?"UNATTRIBUTED_LOCAL":"LEGACY_UNVERIFIED",
    title:"Algebra I Readiness Diagnostic",officialCourseGrade:false,cloudVerified:false};
  }
 }catch{return {state:"LEGACY_UNVERIFIED",title:"Algebra I Readiness Diagnostic",officialCourseGrade:false,cloudVerified:false};}
 return null;
}

// Explicit learner-confirmed local copy; no browser record is deleted, no cloud call.
function linkLegacyAlgebraReadiness(){
 const selected=learner(),profile=profileApi?.readAcademyProfile?.();
 if(!selected||selected.grade!=="09"||profile?.learnerId!==selected.id){
  refreshStatus("Verify the selected Grade 9 learner first. Nothing changed.");return;
 }
 const key="khaemenes-algebra1-diagnostic-result-v1";
 const legacy=(()=>{try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}})();
 const valid=a=>a?.id==="KH-MATH-A1-DIAGNOSTIC"&&a.total===36&&
  Number.isInteger(a.score)&&a.score>=0&&a.score<=36&&
  Number.isFinite(a.percent)&&Math.abs(a.percent-100*a.score/36)<.2&&
  typeof a.submitted==="string"&&Number.isFinite(Date.parse(a.submitted));
 const attempts=(Array.isArray(legacy?.attempt_history)?legacy.attempt_history:[]).filter(valid);
 if(!attempts.length&&valid(legacy?.lastResult))attempts.push(legacy.lastResult);
 if(!attempts.length){refreshStatus("No valid original Algebra I readiness result found. Nothing changed.");return;}
 if(!confirm("Link this saved Algebra I readiness result to the selected Grade 9 learner? Confirm only if this student completed the assessment on this browser. The original is preserved. This does not upload to Account Cloud or award course credit."))return;
 const recheck=learner(),current=profileApi?.readAcademyProfile?.();
 if(recheck?.id!==selected.id||current?.learnerId!==selected.id){
  refreshStatus("Learner selection changed. No result was linked.");return;
 }
 try{
  const old=profileApi.readJSON(key,null,current);
  if(old!==null&&(!old||typeof old!=="object"||Array.isArray(old)||
   (old.assessment_id&&old.assessment_id!=="KH-MATH-A1-DIAGNOSTIC"))){
   refreshStatus("An existing learner-scoped record needs review; it was not overwritten.");return;
  }
  const previous=Array.isArray(old?.attempt_history)?old.attempt_history:[];
  if(previous.some(a=>!valid(a))){refreshStatus("A previous diagnostic record needs review; no changes made.");return;}
  const known=new Set(previous.map(a=>[a.id,a.submitted,a.score,a.total].join("|")));
  const additions=attempts.filter(a=>!known.has([a.id,a.submitted,a.score,a.total].join("|")));
  const combined=[...previous,...additions];
  const latest=combined.slice().sort((a,b)=>Date.parse(b.submitted)-Date.parse(a.submitted))[0];
  const best=Math.max(...combined.map(a=>a.percent));
  const next={...(old||{}),result_schema:"khaemenes-algebra1-cumulative-evidence-v2",
   assessment_id:"KH-MATH-A1-DIAGNOSTIC",attempt_history:combined,lastResult:latest,
   bestScore:best,bestSelectedScore:best,bestOverallScore:best,mastery:best>=80,
   attribution:{source:"browser-local-readiness",action:"learner-confirmed-portfolio-link",
    learnerId:selected.id,at:new Date().toISOString(),officialCredit:false}};
  profileApi.writeJSON(key,next,current);
  const check=profileApi.readJSON(key,null,current);
  if(!check||!Array.isArray(check.attempt_history)||check.attempt_history.length!==combined.length||
   check.lastResult?.submitted!==latest.submitted)throw Error("READBACK_FAILED");
  window.dispatchEvent(new Event("khaemenes-algebra1-readiness-linked"));
  refresh("learner-confirmed-link");
 }catch{refreshStatus("The learner-linked result could not be verified. Original diagnostic evidence was not altered. Export the original before retrying.");}
}
function evidenceCount(user){
 try{
  const key="khae-learning-portfolio-v1:learner:"+encodeURIComponent(user.id);
  const list=JSON.parse(localStorage.getItem(key)||"[]");
  return Array.isArray(list)?list.filter(e=>e&&typeof e.id==="string"&&typeof e.title==="string"&&typeof e.detail==="string").length:0;
 }catch{return null}
}
function rowsFor(user){
 const list=currentRecords(user),slots=slotsFor(user.grade),matched=new Set();
 const rows=slots.map(slot=>{
  const candidates=list.filter(record=>aliases(slot.id).includes(record.courseId));
  for(const record of candidates)matched.add(record.courseId);
  const fresh=candidates.find(r=>!r.stale)||null;
  const old=candidates[0]||null;
  return {courseId:slot.id||"",title:String(fresh?.courseTitle||old?.courseTitle||slot.title||slot.label),
   subject:slot.label,status:!slot.id?"Selection required":fresh?"Evidence received":old?"Stale evidence":"No evidence reported",
   stale:!fresh&&!!old,record:fresh||null};
 });
 // Add evidence from extra courses only when it explicitly matches the registered grade.
 for(const record of list){
  if(matched.has(record.courseId)||!record.grade||normalizeGrade(record.grade)!==user.grade)continue;
  matched.add(record.courseId);
  rows.push({courseId:record.courseId,title:record.courseTitle||record.courseId,subject:record.subject||"Additional course",
   status:record.stale?"Stale evidence":"Evidence received",stale:!!record.stale,record:record.stale?null:record});
 }
 return rows;
}
function definition(label,value){const line=mk("div","portfolio-report-pair");line.append(mk("dt","",label),mk("dd","",value));return line}
function renderCard(row){
 const card=mk("article","portfolio-report-course"),title=mk("h3","",row.title);
 card.append(title,mk("p","portfolio-report-note",row.subject+" · "+row.status));
 const items=assessments(row.record);
 const defs=mk("dl","portfolio-report-definitions");
 defs.append(definition("Course completion",display(progress(row.record))));
 defs.append(definition("Recorded quiz/test points",display(summary(items))));
 const receipts=row.record?.courseId?(receiptApi()?.forCourse?.(row.record.learnerId,row.record.courseId)||[]):[];
 defs.append(definition("Evidence receipts",String(receipts.length)));
 defs.append(definition("Final transcript grade","Pending evaluator review"));
 defs.append(definition("Credit awarded","Not determined"));
 card.append(defs);
 const groups=["Quiz","Other test","Midterm","Final"];
 for(const category of groups){
  const group=items.filter(a=>a.type===category);
  const label=category==="Quiz"?"Quizzes":category==="Other test"?"Other tests":category+" scores";
  const section=mk("section","portfolio-report-assessments");
  section.append(mk("h4","",label));
  if(!group.length)section.append(mk("p","portfolio-report-note","Not reported"));
  else{
   const list=mk("ul","portfolio-report-scores");
   for(const a of group)list.append(mk("li","",a.title+" — "+a.earned+" / "+a.possible+" ("+display(a.percent)+")"+(a.gradedAt?" · "+a.gradedAt:"")));
   section.append(list);
  }
  card.append(section);
 }
 return card;
}
function english9ObjectiveEvidence(user){
 if(!user||user.grade!=="09")return [];
 const ledger=getLedger();
 if(typeof ledger?.readCourse!=="function")return [];
 const record=ledger.readCourse(user.id,"english-9-objective-evidence");
 if(record?.learnerId!==user.id||record.source!=="english9-fixed-objective-assessment-v1"||record.grade!=="09"||record.stale)return [];
 return assessments(record).filter(a=>a.possible===30||a.possible===50);
}
function reportData(){
 const user=learner();if(!user)return null;
 const rows=rowsFor(user);
 return {schema:"khaemenes-homeschool-progress-report-v1",reportType:"evidence-summary-not-certified-transcript",
  generatedAt:new Date().toISOString(),learner:{name:user.name,grade:user.grade},
  portfolioEvidenceCount:evidenceCount(user),
   english9ObjectiveEvidence:english9ObjectiveEvidence(user),
   algebraReadiness:algebraReadiness(user),
  courses:rows.map(row=>({courseId:row.courseId,title:row.title,subject:row.subject,status:row.status,
   completionPercent:progress(row.record),recordedAssessmentAveragePercent:summary(assessments(row.record)),
   assessments:assessments(row.record),
   evidenceReceipts:row.record?.courseId?(receiptApi()?.forCourse?.(user.id,row.record.courseId)||[]):[],
   officialFinalGrade:null,creditAwarded:null,
   source:row.record?"Academy learner-scoped continuation ledger":"No current published ledger record"})),
  evaluatorReview:{attendanceHours:"Not supplied",daysOfInstruction:"Not supplied",curriculumVerification:"Pending",
   finalGrades:"Pending",awardedCredits:"Pending",reviewSignature:"Pending"},
  notice:"Learner-scoped, locally available academic evidence. This report is not a certified transcript, proof of legal compliance, or a final credit decision."};
}
let refreshNumber=0;
const refreshStatus=message=>{const node=$("refreshEvidenceStatus");if(node)node.textContent=message};
function refresh(reason="automatic"){
 const iteration=++refreshNumber;
 let report=null;
 try{report=reportData()}catch(err){
  host.replaceChildren();
  $("reportCourseCount").textContent="—";$("reportAssessmentCount").textContent="—";
  $("printReport").disabled=true;$("exportReport").disabled=true;
  refreshStatus("Refresh #"+iteration+" could not read course evidence on this device. Your saved grades and portfolio entries were not changed. Reopen the learner profile, then return here.");
  host.append(mk("p","portfolio-report-note","Unable to read academic evidence. The report did not change or erase any course records."));
  return;
 }
 host.replaceChildren();
 // Independent learner-scoped readiness evidence can render even if the
 // course-continuation ledger is not loaded. Never invent missing grades.
 if(!report){
  $("reportIdentity").textContent="Select a registered High School learner to view this private academic report.";
  $("reportCourseCount").textContent="—";$("reportAssessmentCount").textContent="—";
  $("printReport").disabled=true;$("exportReport").disabled=true;
  refreshStatus("Refresh #"+iteration+": learner verification is required. Open your Student Profile, select the registered High School learner, then return to this report. No records were changed.");
  host.append(mk("p","portfolio-report-note","No private academic report can be displayed without a verified active learner."));
  return;
 }
 $("printReport").disabled=false;$("exportReport").disabled=false;
 $("reportIdentity").textContent="Learner: "+report.learner.name+" · Grade "+Number(report.learner.grade)+" · Updated "+new Date(report.generatedAt).toLocaleDateString();
 $("reportCourseCount").textContent=String(report.courses.filter(c=>c.status==="Evidence received").length);
 $("reportAssessmentCount").textContent=String(report.courses.reduce((n,c)=>n+c.assessments.length,0)+(report.algebraReadiness?.state==="LEARNER_LINKED_LOCAL"?1:0)+report.english9ObjectiveEvidence.length);
 const reported=report.courses.filter(c=>c.status==="Evidence received").length;
 const readinessLinked=report.algebraReadiness?.state==="LEARNER_LINKED_LOCAL";
 const assessmentsFound=report.courses.reduce((n,c)=>n+c.assessments.length,0);
 const now=new Date().toLocaleTimeString([], {hour:"numeric",minute:"2-digit",second:"2-digit"});
 const sourceReady=typeof getLedger()?.readLearner==="function";
 if(!sourceReady)refreshStatus("Refresh #"+iteration+" · "+now+": Course-continuation records are unavailable. "+(readinessLinked?"Linked Algebra I readiness evidence is shown separately.":report.algebraReadiness?.state==="UNATTRIBUTED_LOCAL"?"An existing local Algebra I result needs learner confirmation.":"No published course results were confirmed.")+" No grades changed.");
 else if(reported===0&&readinessLinked)refreshStatus("Refresh #"+iteration+" · "+now+": Algebra I readiness evidence found for this learner. This is not an official course grade or a cloud backup.");
 else if(reported===0&&report.algebraReadiness?.state==="UNATTRIBUTED_LOCAL")refreshStatus("Refresh #"+iteration+" · "+now+": A local Algebra I readiness result was found without confirmed learner attribution. Open the diagnostic to link existing evidence. No student records were changed.");
 else if(reported===0&&report.algebraReadiness?.state==="LEGACY_UNVERIFIED")refreshStatus("Refresh #"+iteration+" · "+now+": An older Algebra I record exists, but its score cannot be verified. No records changed.");
 else if(reported===0)refreshStatus("Refresh #"+iteration+" · "+now+": No current course evidence has been published for this learner on this device. Your original course scores were not modified. Open a course's gradebook or progress report to check its separate records.");
 else if(assessmentsFound===0)refreshStatus("Refresh #"+iteration+" · "+now+": Found "+reported+" course record"+(reported===1?"":"s")+", but none includes published quiz/test scores in the Academy continuation ledger. Midterm and final results may still be held by individual course gradebooks.");
 else refreshStatus("Refresh #"+iteration+" · "+now+": Checked "+reported+" course record"+(reported===1?"":"s")+" and "+assessmentsFound+" scored assessment"+(assessmentsFound===1?"":"s")+" in the Academy continuation ledger. Report updated from saved evidence; no grades were changed.");

 const head=mk("div","portfolio-report-print-heading");
 head.append(mk("h3","","Homeschool Academic Progress Report"),mk("p","",report.learner.name+" · Grade "+Number(report.learner.grade)+" · "+new Date(report.generatedAt).toLocaleDateString()),
  mk("p","portfolio-report-note","Draft evidence report · Final transcript grades and credit require evaluator review."));
 host.append(head);
 const grid=mk("div","portfolio-report-grid");
 for(const row of rowsFor(learner()))grid.append(renderCard(row));
 host.append(grid);
 if(report.english9ObjectiveEvidence.length){
  const panel=mk("section","portfolio-report-evaluator");
  panel.append(mk("h3","","English 9 · Objective Midterm and Final Evidence"));
  const list=mk("ul","portfolio-report-scores");
  for(const a of report.english9ObjectiveEvidence)
   list.append(mk("li","",a.title+" — "+a.earned+"/"+a.possible+" ("+display(a.percent)+") · "+a.gradedAt));
  panel.append(list,mk("p","portfolio-report-note","Learner-scoped objective scores only. Teacher-reviewed writing, official course grades and awarded credit remain separate. Not cloud backed up."));
  host.append(panel);
 }
 if(report.algebraReadiness){
  const panel=mk("section","portfolio-report-evaluator");
  panel.append(mk("h3","","Algebra I Readiness — Separate Diagnostic Evidence"));
  if(report.algebraReadiness.state==="LEARNER_LINKED_LOCAL"){
   const a=report.algebraReadiness;
   panel.append(mk("p","","Recorded readiness score: "+a.score+"/"+a.total+" ("+a.percent+"%) · Submitted "+new Date(a.submitted).toLocaleString()+" · "+a.attempts+" retained attempt(s)."));
   panel.append(mk("p","portfolio-report-note","Learner-linked evidence in this browser only. Not an official Algebra I course grade; Account Cloud backup is unverified."));
  }else{
   const eligible=report.algebraReadiness.state==="UNATTRIBUTED_LOCAL";
   panel.append(mk("p","",eligible?"A valid Algebra I readiness attempt is saved on this browser but is not yet linked to the selected learner. Confirm ownership to link it.":"Older diagnostic data was found, but its score could not be verified."));
   if(eligible){
    const linkButton=mk("button","","Review & Link My Saved Algebra I Result");
    linkButton.type="button";
    linkButton.addEventListener("click",linkLegacyAlgebraReadiness);
    panel.append(linkButton);
   }
   const diagnostic=mk("a","","Open Algebra I Readiness Diagnostic");
   diagnostic.href="../courses/mathematics/algebra-1/diagnostic/";
   panel.append(diagnostic,mk("p","portfolio-report-note","Do not retake the assessment merely to fix this link. No cloud upload is performed."));
  }
  host.append(panel);
 }
 const review=mk("section","portfolio-report-evaluator");
 review.append(mk("h3","","Parent / Evaluator Review"),
  mk("p","","Student portfolio entries available on this device: "+(report.portfolioEvidenceCount===null?"Not available":report.portfolioEvidenceCount)),
  mk("p","","Instruction days: ____________________    Hours: ____________________"),
  mk("p","","Curriculum / assessment verification: __________________________________________"),
  mk("p","","Final grade and credit determination: ________________________________________"),
  mk("p","","Parent or evaluator: _____________________    Date: _____________________"));
 host.append(review);
}
function downloadReport(){
 const report=reportData();if(!report)return;
 const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download="khaemenes-homeschool-progress-grade-"+report.learner.grade+".json";
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$("refreshReport")?.addEventListener("click",()=>refresh("manual"));
$("exportReport")?.addEventListener("click",downloadReport);
$("printReport")?.addEventListener("click",()=>{
 if(!reportData())return;
 refresh();document.body.classList.add("portfolio-report-print");
 window.print();
});
window.addEventListener("afterprint",()=>document.body.classList.remove("portfolio-report-print"));
for(const event of ["pageshow","khaemenes-learning-continuation-ready","khaemenes-learning-continuation-changed","khaemenes-student-profile-changed"])window.addEventListener(event,()=>refresh("event"));
refresh();
window.KhaemenesPortfolioAcademicReport=Object.freeze({refresh,version:"1.0.0"});
})();