/* English 9 · Week 04 Day 20 independent writing & local educator scoring */
(function(){
"use strict";
if(document.body.getAttribute("data-english9-week4-day")!=="20")return;
const W=window.KhaemenesEnglish9Week04,$=id=>document.getElementById(id);
if(!W)return;
const {profile,ready,scoped,read,write,load,writing,hash,validReview,halt,say}=W;
const by=Object.fromEntries(writing.map(f=>[f.dataset.saveField,f]));
const draft=by["week-04-day-20"],final=by["week-04-day-20-final"],pattern=by["week-04-day-20-pattern"],reflection=by["week-04-day-20-reflection"];
const lockKey=scoped("khae-ela9-field:week-04-day20-original-lock-v1"),
 subKey=scoped("khae-ela9-field:week-04-day20-submission-v1"),
 reviewKey=scoped("khae-ela9-field:week-04-day20-review-v1");
const obj=x=>!!x&&typeof x==="object"&&!Array.isArray(x),count=s=>String(s||"").trim().split(/\s+/).filter(Boolean).length;
const IDs=["claim","evidence","reasoning","pattern","clarity"];
const validLock=x=>obj(x)&&x.version===1&&typeof x.text==="string"&&count(x.text)>=300&&count(x.text)<=450&&x.fingerprint===hash(x.text)&&typeof x.at==="string";
function validSubmission(x){
 return obj(x)&&x.schema==="english9-week04-day20-submission-v1"&&x.day===20&&x.learnerId===profile?.learnerId&&
 typeof x.submittedAt==="string"&&Number.isFinite(Date.parse(x.submittedAt))&&
 Number.isInteger(x.draftWords)&&x.draftWords>=300&&x.draftWords<=450&&
 Number.isInteger(x.finalWords)&&x.finalWords>=300&&x.finalWords<=450&&
 typeof x.fingerprint==="string"&&obj(x.hashes)&&["draft","final","pattern","reflection"].every(k=>typeof x.hashes[k]==="string");
}
let locked=lockKey?load(lockKey,null,validLock):null;
let submission=subKey?load(subKey,null,validSubmission):null;
let review=reviewKey?load(reviewKey,null,obj):null;
const fields=()=>({draft:draft.value,final:final.value,pattern:pattern.value,reflection:reflection.value});
function consistent(){
 return validSubmission(submission)&&Object.entries(submission.hashes).every(([k,h])=>hash(fields()[k]||"")===h);
}
function approved(){return consistent()&&validReview(review,submission);}
function score(){
 const rows={};
 for(const k of IDs){const v=$("week4-score-"+k).value;rows[k]=v===""?null:Number(v);}
 if(IDs.some(k=>!Number.isInteger(rows[k])||rows[k]<0||rows[k]>2))return {total:null,rows};
 return {total:IDs.reduce((s,k)=>s+rows[k],0),rows};
}
function rubricLabel(){
 const total=score().total;
 $("week4-review-total").textContent=total===null?"Choose five scores (0, 1, or 2).":
 total+"/10 · "+(total>=8?"Mastery threshold met":"Corrective revision required");
}
function wordLabel(){$("week4-word-count").textContent="Draft 1: "+count(draft.value)+" words · Final: "+count(final.value)+" words · 300–450 words each";}
function readyMap(){
 const t=pattern.value.toLowerCase();
 return ["recurring situation","repeated motif","central symbol","cultural function"].every(k=>t.includes(k))&&count(pattern.value)>=24;
}
function prepared(){
 return ready&&!W.frozen&&!!locked&&count(final.value)>=300&&count(final.value)<=450&&
 readyMap()&&count(reflection.value)>=12&&$("week4-independent").checked;
}
function sync(){
 wordLabel();
 const pass=approved()&&review.passed;
 $("week4-next-wrap").hidden=!pass;
 document.querySelectorAll("[data-week04-advance]").forEach(el=>{el.hidden=!pass;});
 if(pass)$("week4-next-score").textContent="Educator-entered mastery: "+review.score+"/10.";
 $("week4-submit").disabled=!prepared();
 $("week4-record-review").disabled=!ready||W.frozen||!consistent();
 $("week4-submission-status").textContent=!submission?"Evidence not submitted.":
 consistent()?"Evidence submitted on "+new Date(submission.submittedAt).toLocaleString()+" · Awaiting or carrying educator review.":
 "Your writing changed after submission. Submit this revised work for a new review.";
 $("week4-review-status").textContent=approved()?
 "Local educator rubric · "+review.score+"/10 · "+review.evaluator+" · "+review.feedback:
 "No current valid educator review for this exact version of the assessment. A quiz score does not unlock Week 5.";
}
function lockView(){
 if(locked){
  if(draft.value!==locked.text)halt("the original saved draft conflicts with its locked record");
  draft.value=locked.text;draft.readOnly=true;
  $("week4-lock-draft").disabled=true;
  $("week4-lock-note").textContent="Draft 1 preserved "+new Date(locked.at).toLocaleString();
 }else{
  $("week4-lock-draft").disabled=!ready||W.frozen;
  $("week4-lock-note").textContent="Draft 1 not preserved yet.";
 }
 final.readOnly=!ready||W.frozen||!locked;
}
$("week4-lock-draft").addEventListener("click",()=>{
 if(!ready||W.frozen||locked)return;
 if(count(draft.value)<300||count(draft.value)>450){$("week4-lock-note").textContent="Draft 1 must contain 300–450 words before locking.";return;}
 const next={version:1,text:draft.value,at:new Date().toISOString(),fingerprint:hash(draft.value)};
 if(write(lockKey,JSON.stringify(next))){locked=next;lockView();sync();}
});
[draft,final,pattern,reflection].forEach(field=>field.addEventListener("input",sync));
$("week4-independent").addEventListener("change",sync);
IDs.forEach(k=>$("week4-score-"+k).addEventListener("change",()=>{rubricLabel();sync();}));
$("week4-submit").addEventListener("click",()=>{
 if(!prepared())return;
 const f=fields(),next={schema:"english9-week04-day20-submission-v1",day:20,
  learnerId:profile.learnerId,submittedAt:new Date().toISOString(),
  draftWords:count(draft.value),finalWords:count(final.value),
  hashes:Object.fromEntries(Object.entries(f).map(([k,v])=>[k,hash(v)])),
  fingerprint:hash(Object.values(f).join("|"))};
 if(!write(subKey,JSON.stringify(next)))return;
 submission=next;
 const progress={...W.progress,[W.flag(20)]:true};
 if(!write(W.progressKey,JSON.stringify(progress)))return;
 W.progress[W.flag(20)]=true;sync();
});
$("week4-record-review").addEventListener("click",()=>{
 if(!consistent()||W.frozen||!ready)return;
 const {total,rows}=score(),evaluator=$("week4-reviewer").value.trim(),feedback=$("week4-feedback").value.trim();
 if(total===null||evaluator.length<2||feedback.length<10){
  $("week4-review-status").textContent="Complete all rubric rows, evaluator name, and detailed feedback.";return;
 }
 if(approved()&&!confirm("Replace the existing local educator review for this submission?"))return;
 const next={schema:"english9-week04-day20-review-v1",learnerId:profile.learnerId,
  submittedAt:submission.submittedAt,fingerprint:submission.fingerprint,rows,
  score:total,passed:total>=8,evaluator,feedback,evaluatedAt:new Date().toISOString()};
 if(!validReview(next,submission)){halt("rubric record failed validation");return;}
 if(write(reviewKey,JSON.stringify(next))){review=next;sync();}
});
function exportJSON(name,value){
 const blob=new Blob([JSON.stringify(value,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1200);
}
$("week4-export").addEventListener("click",()=>{
 const responses=Object.fromEntries(writing.map(field=>[field.dataset.saveField,field.value]));
 exportJSON("english9-week04-day20-backup.json",{schema:"english9-week04-day20-backup-v1",
  learnerId:profile?.learnerId||null,exportedAt:new Date().toISOString(),
  responses,lockedDraft:locked,submission,review,containsUnsavedDrafts:W.frozen});
});
$("week4-import-review").addEventListener("change",async event=>{
 const file=event.target.files&&event.target.files[0];
 event.target.value="";
 if(!file)return;
 const info=$("week4-review-status");
 try{
  if(!ready||W.frozen||!consistent())throw Error("A saved, matching submission is required before importing a review.");
  if(file.size>150000)throw Error("Review file exceeds the accepted size.");
  const payload=JSON.parse(await file.text());
  if(!payload||payload.schema!=="english9-week04-evaluation-v1"||
   payload.learnerId!==profile.learnerId||!validReview(payload.review,submission))
   throw Error("Evaluation is invalid or belongs to another learner or submission.");
  if(approved()&&!confirm("Replace the recorded local review for this submission?"))return;
  if(!write(reviewKey,JSON.stringify(payload.review)))throw Error("Review cannot be saved; check other tabs and storage.");
  review=payload.review;sync();
  info.textContent="Matching evaluator review imported: "+review.score+"/10. "+
    (review.passed?"Week 05 navigation is available.":"Revise the lowest-scoring criterion and resubmit.");
 }catch(error){info.textContent="Evaluation not imported: "+error.message;}
});
$("week4-export-review").addEventListener("click",()=>{
 if(!approved()){$("week4-review-status").textContent="Record a valid educator review before exporting.";return;}
 exportJSON("english9-week04-day20-evaluation.json",{schema:"english9-week04-evaluation-v1",
  exportedAt:new Date().toISOString(),learnerId:profile.learnerId,review});
});
window.addEventListener("storage",e=>{
 if(e.key===reviewKey||e.key===subKey){$("week4-next-wrap").hidden=true;say("Review or submission changed in another tab. Reload before continuing.",true);}
});
lockView();rubricLabel();sync();
})();