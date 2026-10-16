/* English 9 Week 13 · independent drama reading and director's notebook.
   Local educator review is not cryptographically authenticated. */
(function(){
"use strict";
if(document.body.getAttribute("data-english9-week13-day")!=="65")return;
const W=window.KhaemenesEnglish9Week13,$=id=>document.getElementById(id);
if(!W)return;
const {profile,ready,scoped,read,write,load,writing,hash,validSubmission,validReview,halt,say}=W;
const by=Object.fromEntries(writing.map(f=>[f.dataset.saveField,f]));
const keys={daily:"",planA:"plan-a",planB:"plan-b",directorNote:"director-note",
 rehearsal:"rehearsal",analysis:"analysis",reflection:"reflection"};
const f=Object.fromEntries(Object.entries(keys).map(([k,v])=>
 [k,by[v?"week-13-day65-"+v:"week-13-day-65"]]));
if(Object.values(f).some(x=>!x)){halt("Assessment fields unavailable");return;}
const count=s=>String(s||"").trim().split(/\s+/).filter(Boolean).length,
 object=x=>!!x&&typeof x==="object"&&!Array.isArray(x),
 range=(s,a,b)=>count(s)>=a&&count(s)<=b;
const subKey=scoped("khae-ela9-field:week-13-day65-submission-v1"),
 reviewKey=scoped("khae-ela9-field:week-13-day65-review-v1");
let submission=subKey?load(subKey,null,validSubmission):null,
 review=reviewKey?load(reviewKey,null,object):null;
const criterion=["interpretation","evidence","directing","alternative","conventions"];
function materials(){return Object.fromEntries(Object.entries(f).map(([k,v])=>[k,v.value]));}
function match(){
 if(!validSubmission(submission)||submission.learnerId!==profile?.learnerId)return false;
 const m=materials();
 return Object.entries(submission.hashes).every(([k,v])=>hash(m[k]||"")===v);
}
const approved=()=>match()&&validReview(review,submission);
function eligibleToSubmit(){
 return ready&&!W.frozen&&range(f.analysis.value,400,550)&&range(f.reflection.value,150,250)&&
 count(f.planA.value)>=25&&count(f.planB.value)>=25&&f.planA.value.trim()!==f.planB.value.trim()&&
 count(f.directorNote.value)>=35&&count(f.rehearsal.value)>=20&&
 $("week13-independent").checked&&$("week13-evidence-confirm").checked;
}
function scoring(){
 const rows={};
 criterion.forEach(k=>{const v=$("week13-rubric-"+k).value;rows[k]=v===""?null:Number(v);});
 const total=criterion.every(k=>Number.isInteger(rows[k])&&rows[k]>=0&&rows[k]<=2)?
  criterion.reduce((n,k)=>n+rows[k],0):null;
 return {rows,total};
}
function refreshScore(){
 const n=scoring().total;
 $("week13-review-total").textContent=n===null?"Choose all five rubric criteria (0–2).":
  n+"/10 · "+(n>=8?"Mastery threshold reached":"Corrective revision required");
}
function sync(){
 $("week13-analysis-count").textContent=count(f.analysis.value)+" words · 400–550 required";
 $("week13-reflection-count").textContent=count(f.reflection.value)+" words · 150–250 required";
 const passed=approved()&&review.passed;
 $("week13-next-wrap").hidden=!passed;
 if(passed)$("week13-next-score").textContent="Human-entered Week 13 mastery: "+review.score+"/10.";
 $("week13-submit").disabled=!eligibleToSubmit()||passed;
 $("week13-record-review").disabled=!ready||W.frozen||!match();
 $("week13-submission-status").textContent=!submission?"No submitted assessment yet.":
 match()?"Submitted "+new Date(submission.submittedAt).toLocaleString()+" · Awaiting or carrying local human review.":
 "Current portfolio changed after submission. Resubmit to obtain a review of this version.";
 $("week13-review-status").textContent=approved()?
 "Local educator review · "+review.score+"/10 · "+review.evaluator+"\nFeedback: "+review.feedback:
 "No completed educator review for this exact submitted portfolio. Submitting alone does not unlock Week 14.";
}
Object.values(f).forEach(field=>field.addEventListener("input",sync));
["week13-independent","week13-evidence-confirm"].forEach(id=>$(id).addEventListener("change",sync));
criterion.forEach(k=>$("week13-rubric-"+k).addEventListener("change",()=>{refreshScore();sync();}));
$("week13-submit").addEventListener("click",()=>{
 if(!eligibleToSubmit())return;
 const m=materials(),next={
  schema:"english9-week13-day65-submission-v1",learnerId:profile.learnerId,day:65,
  submittedAt:new Date().toISOString(),analysisWords:count(f.analysis.value),
  reflectionWords:count(f.reflection.value),
  hashes:Object.fromEntries(Object.entries(m).map(([k,v])=>[k,hash(v)])),
  fingerprint:hash(Object.values(m).join("|"))};
 if(!write(subKey,JSON.stringify(next)))return;
 submission=next;
 const nextProgress={...W.progress,[W.flag(65)]:true};
 if(write(W.progressKey,JSON.stringify(nextProgress)))W.progress[W.flag(65)]=true;
 sync();
});
$("week13-record-review").addEventListener("click",()=>{
 if(!ready||W.frozen||!match())return;
 const {rows,total}=scoring(),evaluator=$("week13-evaluator").value.trim(),
 feedback=$("week13-feedback").value.trim();
 if(total===null||evaluator.length<2||feedback.length<10){
  $("week13-review-status").textContent="Complete all five scores, a reviewer name and evidence-specific feedback.";return;
 }
 if(approved()&&!confirm("Replace this existing local evaluation?"))return;
 const next={schema:"english9-week13-day65-review-v1",learnerId:profile.learnerId,
  submittedAt:submission.submittedAt,fingerprint:submission.fingerprint,
  rows,score:total,passed:total>=8,evaluator,feedback,evaluatedAt:new Date().toISOString()};
 if(!validReview(next,submission)){halt("Rubric validation failed");return;}
 if(write(reviewKey,JSON.stringify(next))){review=next;sync();}
});
function download(file,payload){
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=file;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1100);
}
$("week13-export").addEventListener("click",()=>download("english9-week13-day65-portfolio.json",{
 schema:"english9-week13-day65-backup-v1",learnerId:profile?.learnerId||null,
 exportedAt:new Date().toISOString(),responses:Object.fromEntries(writing.map(x=>[x.dataset.saveField,x.value])),
 submission,review,containsUnsavedDrafts:W.frozen
}));
$("week13-export-review").addEventListener("click",()=>{
 if(!approved()){$("week13-review-status").textContent="A matching review must be recorded before export.";return;}
 download("english9-week13-evaluation.json",{
  schema:"english9-week13-evaluation-v1",learnerId:profile.learnerId,
  exportedAt:new Date().toISOString(),review
 });
});
$("week13-import-review").addEventListener("change",async event=>{
 const file=event.target.files?.[0];event.target.value="";if(!file)return;
 try{
  if(!ready||W.frozen||!match())throw Error("A matching student submission is required before importing.");
  if(file.size>150000)throw Error("Evaluation file too large.");
  const data=JSON.parse(await file.text());
  if(data.schema!=="english9-week13-evaluation-v1"||data.learnerId!==profile.learnerId||
    !validReview(data.review,submission))throw Error("Review does not match the learner and current submission.");
  if(approved()&&!confirm("Replace the current locally saved review?"))return;
  if(!write(reviewKey,JSON.stringify(data.review)))throw Error("Review record changed or storage is unavailable.");
  review=data.review;sync();
  $("week13-review-status").textContent="Matching local review imported: "+review.score+"/10. "+
    (review.passed?"Week 14 continuation is ready.":"Targeted correction required.");
 }catch(error){$("week13-review-status").textContent="Evaluation not imported: "+error.message;}
});
window.addEventListener("storage",event=>{
 if(event.key===subKey||event.key===reviewKey){
  $("week13-next-wrap").hidden=true;
  say("Assessment changed in another browser tab. Reload to verify.",true);
 }
});
refreshScore();sync();
})();