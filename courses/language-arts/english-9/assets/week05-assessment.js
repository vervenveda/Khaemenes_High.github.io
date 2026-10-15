/* English 9 · Week 05 Day 25 · student-owned independent assessment and local human rubric */
(function(){
"use strict";
if(document.body.getAttribute("data-english9-week5-day")!=="25")return;
const W=window.KhaemenesEnglish9Week05,$=id=>document.getElementById(id);
if(!W)return;
const {profile,ready,scoped,write,load,writing,hash,validReview,halt,say}=W;
const original=Object.fromEntries(writing.map(f=>[f.dataset.saveField,f]));
const notes=original["week-05-day25"],annotations=original["week-05-day25-annotations"],
 matrix=original["week-05-day25-matrix"],draft=original["week-05-day25-draft1"],
 final=original["week-05-day25-final"],reflection=original["week-05-day25-revision"];
if(!notes||!annotations||!matrix||!draft||!final||!reflection){halt("assessment writing fields are incomplete");return;}
const lockKey=scoped("khae-ela9-field:week-05-day25-original-lock-v1"),
 submissionKey=scoped("khae-ela9-field:week-05-day25-submission-v1"),
 reviewKey=scoped("khae-ela9-field:week-05-day25-review-v1");
const ids=["claim","evidence","reasoning","comparison","language"];
const obj=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const count=t=>String(t||"").trim().split(/\s+/).filter(Boolean).length;
const wordRange=n=>n>=400&&n<=550;
const validLock=x=>obj(x)&&x.version===1&&typeof x.text==="string"&&wordRange(count(x.text))
  &&x.fingerprint===hash(x.text)&&typeof x.at==="string"&&!Number.isNaN(Date.parse(x.at));
const validSubmission=x=>obj(x)&&x.schema==="english9-week05-day25-submission-v1"&&
  x.day===25&&x.learnerId===profile?.learnerId&&typeof x.submittedAt==="string"&&
  !Number.isNaN(Date.parse(x.submittedAt))&&wordRange(x.draftWords)&&wordRange(x.finalWords)&&
  typeof x.fingerprint==="string"&&obj(x.hashes)&&
  ["annotations","matrix","draft","final","reflection"].every(k=>typeof x.hashes[k]==="string");
let locked=lockKey?load(lockKey,null,validLock):null;
let submission=submissionKey?load(submissionKey,null,validSubmission):null;
let review=reviewKey?load(reviewKey,null,obj):null;
const fields=()=>({annotations:annotations.value,matrix:matrix.value,draft:draft.value,final:final.value,reflection:reflection.value});
const matches=()=>validSubmission(submission)&&Object.entries(submission.hashes).every(([k,v])=>hash(fields()[k]||"")===v);
const reviewed=()=>matches()&&validReview(review,submission);
function scores(){
 const rows={};
 for(const k of ids){const v=$("week5-rubric-"+k).value;rows[k]=v===""?null:Number(v);}
 const all=ids.every(k=>Number.isInteger(rows[k])&&rows[k]>=0&&rows[k]<=2);
 return {rows,total:all?ids.reduce((a,k)=>a+rows[k],0):null};
}
function updateScore(){
 const x=scores().total;
 $("week5-review-total").textContent=x===null?"Complete all five 0–2 rubric scores.":x+"/10 · "+(x>=8?"Mastery threshold reached":"Corrective revision required");
}
function evidenceReady(){
 return ready&&!W.frozen&&!!locked&&wordRange(count(final.value))&&
 count(annotations.value)>=10&&count(matrix.value)>=20&&count(reflection.value)>=10&&
 $("week5-independent").checked&&$("week5-evidence-confirm").checked;
}
function sync(){
 const pass=reviewed()&&review.passed;
 $("week5-draft-word-count").textContent="Original Draft 1: "+count(draft.value)+" words (400–550 required).";
 $("week5-final-word-count").textContent="Final analysis: "+count(final.value)+" words (400–550 required).";
 $("week5-next-wrap").hidden=!pass;
 if(pass)$("week5-next-score").textContent="Educator-entered mastery · "+review.score+"/10.";
 $("week5-submit").disabled=!evidenceReady()||reviewed()&&review.passed;
 $("week5-record-review").disabled=!ready||W.frozen||!matches();
 $("week5-submission-status").textContent=!submission?"No assessment submitted yet.":matches()?
 "Assessment evidence submitted "+new Date(submission.submittedAt).toLocaleString()+". Human review is separate.":
 "The current work differs from the submitted evidence. Submit your revision for a new review.";
 $("week5-review-status").textContent=reviewed()?
 "Local educator review: "+review.score+"/10 · "+review.evaluator+" · "+review.feedback:
 "No matching completed educator review for this version. Submission or self-scoring does not unlock Week 06.";
}
function lockView(){
 if(locked){
  if(draft.value!==locked.text)halt("Original Draft 1 conflicts with its preserved record.");
  draft.value=locked.text;draft.readOnly=true;
  $("week5-lock-draft").disabled=true;
  $("week5-lock-status").textContent="Original Draft 1 locked "+new Date(locked.at).toLocaleString()+".";
 }else{
  $("week5-lock-draft").disabled=!ready||W.frozen;
  $("week5-lock-status").textContent="Draft 1 has not yet been preserved.";
 }
 final.readOnly=!ready||W.frozen||!locked;
}
$("week5-lock-draft").addEventListener("click",()=>{
 if(!ready||W.frozen||locked)return;
 const total=count(draft.value);
 if(!wordRange(total)){$("week5-lock-status").textContent="Complete 400–550 original words before locking.";return;}
 const x={version:1,text:draft.value,fingerprint:hash(draft.value),at:new Date().toISOString()};
 if(write(lockKey,JSON.stringify(x))){locked=x;lockView();sync();}
});
[notes,annotations,matrix,draft,final,reflection].forEach(f=>f.addEventListener("input",sync));
$("week5-independent").addEventListener("change",sync);
$("week5-evidence-confirm").addEventListener("change",sync);
ids.forEach(k=>$("week5-rubric-"+k).addEventListener("change",()=>{updateScore();sync();}));
$("week5-submit").addEventListener("click",()=>{
 if(!evidenceReady()||(reviewed()&&review.passed))return;
 const material=fields();
 const x={schema:"english9-week05-day25-submission-v1",day:25,learnerId:profile.learnerId,
  submittedAt:new Date().toISOString(),draftWords:count(draft.value),finalWords:count(final.value),
  hashes:Object.fromEntries(Object.entries(material).map(([k,v])=>[k,hash(v)])),
  fingerprint:hash(Object.values(material).join("|"))};
 if(!write(submissionKey,JSON.stringify(x)))return;
 submission=x;
 const next={...W.progress,[W.flag(25)]:true};
 if(write(W.progressKey,JSON.stringify(next)))W.progress[W.flag(25)]=true;
 sync();
});
$("week5-record-review").addEventListener("click",()=>{
 if(!ready||W.frozen||!matches())return;
 const {total,rows}=scores(),evaluator=$("week5-evaluator").value.trim(),feedback=$("week5-feedback").value.trim();
 if(total===null||evaluator.length<2||feedback.length<10){
  $("week5-review-status").textContent="Complete all rubric rows, evaluator name and meaningful feedback.";return;
 }
 if(reviewed()&&!confirm("Replace the previous local review for this submission?"))return;
 const next={schema:"english9-week05-day25-review-v1",learnerId:profile.learnerId,
  submittedAt:submission.submittedAt,fingerprint:submission.fingerprint,
  rows,score:total,passed:total>=8,evaluator,feedback,evaluatedAt:new Date().toISOString()};
 if(!validReview(next,submission)){halt("Rubric review could not be validated.");return;}
 if(write(reviewKey,JSON.stringify(next))){review=next;sync();}
});
function download(name,data){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$("week5-export").addEventListener("click",()=>{
 download("english9-week05-day25-backup.json",{schema:"english9-week05-day25-backup-v1",
  learnerId:profile?.learnerId||null,exportedAt:new Date().toISOString(),
  responses:Object.fromEntries(writing.map(f=>[f.dataset.saveField,f.value])),
  lockedDraft:locked,submission,review,containsUnsavedDrafts:W.frozen});
});
$("week5-export-review").addEventListener("click",()=>{
 if(!reviewed()){$("week5-review-status").textContent="Complete and record the local evaluator review before exporting.";return;}
 download("english9-week05-day25-evaluation.json",{schema:"english9-week05-evaluation-v1",
  learnerId:profile.learnerId,exportedAt:new Date().toISOString(),review});
});
$("week5-import-review").addEventListener("change",async event=>{
 const f=event.target.files?.[0];event.target.value="";
 if(!f)return;
 try{
  if(!ready||W.frozen||!matches())throw Error("Submit the exact learner evidence before importing its evaluation.");
  if(f.size>150000)throw Error("Review file is too large.");
  const payload=JSON.parse(await f.text());
  if(payload.schema!=="english9-week05-evaluation-v1"||payload.learnerId!==profile.learnerId||
    !validReview(payload.review,submission))throw Error("The review does not match the selected learner and saved submission.");
  if(reviewed()&&!confirm("Replace this local rubric evaluation?"))return;
  if(!write(reviewKey,JSON.stringify(payload.review)))throw Error("The review changed in another tab or could not be saved.");
  review=payload.review;sync();
  $("week5-review-status").textContent="Matching review imported: "+review.score+"/10. "+
   (review.passed?"Week 06 continuation is now available.":"Revise and resubmit for corrective review.");
 }catch(error){$("week5-review-status").textContent="Import rejected: "+error.message;}
});
window.addEventListener("storage",event=>{
 if(event.key===reviewKey||event.key===submissionKey){
  $("week5-next-wrap").hidden=true;say("Assessment records changed in another tab; reload to verify them.",true);
 }
});
/* User-facing 45-minute timer: indicative pacing only; never drives pass/fail. */
let timerLeft=45*60,timerRun=false,timerTarget=0,timerId=null;
function clock(){
 const mm=Math.floor(timerLeft/60),ss=timerLeft%60;
 $("week5-clock").textContent=String(mm).padStart(2,"0")+":"+String(ss).padStart(2,"0")+" remaining";
}
function tick(){
 if(!timerRun)return;
 timerLeft=Math.max(0,Math.ceil((timerTarget-Date.now())/1000));
 clock();
 if(timerLeft===0){timerRun=false;clearInterval(timerId);timerId=null;
  $("week5-timer-hint").textContent="Suggested 45-minute period complete. Work is not automatically submitted; approved accommodations remain available.";}
}
$("week5-start-timer").addEventListener("click",()=>{
 if(timerRun||timerLeft===0)return;
 timerTarget=Date.now()+timerLeft*1000;timerRun=true;
 timerId=setInterval(tick,500);$("week5-timer-hint").textContent="Timer running. Work is saved independently of the timer.";
});
$("week5-pause-timer").addEventListener("click",()=>{
 if(!timerRun)return;tick();timerRun=false;clearInterval(timerId);timerId=null;
 $("week5-timer-hint").textContent="Timer paused. Resume when ready.";
});
lockView();updateScore();sync();clock();
})();