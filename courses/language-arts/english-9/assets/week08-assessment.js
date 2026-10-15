/* English 9 Week 08 · local, human-reviewed narrative information-design assessment.
   Local fingerprints are consistency checks, NOT secure teacher signatures. */
(function(){
"use strict";
if(document.body.getAttribute("data-english9-week8-day")!=="40")return;
const W=window.KhaemenesEnglish9Week08,$=id=>document.getElementById(id);
if(!W)return;
const {profile,ready,scoped,write,load,writing,hash,validReview,validSubmission,halt,say}=W;
const by=Object.fromEntries(writing.map(f=>[f.dataset.saveField,f]));
const ids={analysisDraft:"analysis-draft",analysisFinal:"analysis-final",
 perspectiveDraft:"perspective-draft",perspectiveFinal:"perspective-final",
 craftNote:"craft-note",revision:"revision",character:"perspective-character"};
const f=Object.fromEntries(Object.entries(ids).map(([k,v])=>[k,by["week-08-day40-"+v]]));
if(Object.values(f).some(x=>!x)){halt("Independent assessment elements are incomplete.");return;}
const object=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const wc=s=>String(s||"").trim().split(/\s+/).filter(Boolean).length,
 inRange=(v,a,b)=>wc(v)>=a&&wc(v)<=b;
const locks={analysis:scoped("khae-ela9-field:week-08-day40-analysis-lock-v1"),
 perspective:scoped("khae-ela9-field:week-08-day40-perspective-lock-v1")};
const subKey=scoped("khae-ela9-field:week-08-day40-submission-v1"),
 reviewKey=scoped("khae-ela9-field:week-08-day40-review-v1");
const validLock=(x,low,high)=>object(x)&&x.version===1&&
 typeof x.text==="string"&&inRange(x.text,low,high)&&hash(x.text)===x.fingerprint&&
 typeof x.at==="string"&&!Number.isNaN(Date.parse(x.at));
let locked={
 analysis:locks.analysis?load(locks.analysis,null,x=>validLock(x,350,500)):null,
 perspective:locks.perspective?load(locks.perspective,null,x=>validLock(x,180,260)):null
};
let submission=subKey?load(subKey,null,validSubmission):null;
let review=reviewKey?load(reviewKey,null,object):null;
const rubricIDs=["pov","structure","irony","evidence","language"];
function materials(){return Object.fromEntries(Object.entries(f).map(([k,v])=>[k,v.value]));}
function matches(){
 if(!validSubmission(submission)||submission.learnerId!==profile?.learnerId||
 !locked.analysis||!locked.perspective)return false;
 if(hash(locked.analysis.text)!==submission.hashes.analysisDraft||
 hash(locked.perspective.text)!==submission.hashes.perspectiveDraft)return false;
 const m=materials();
 return Object.entries(submission.hashes).every(([k,v])=>hash(m[k]||"")===v);
}
const approved=()=>matches()&&validReview(review,submission);
function score(){
 const rows={};for(const k of rubricIDs){const v=$("week8-rubric-"+k).value;rows[k]=v===""?null:Number(v);}
 const all=rubricIDs.every(k=>Number.isInteger(rows[k])&&rows[k]>=0&&rows[k]<=2);
 return {rows,total:all?rubricIDs.reduce((n,k)=>n+rows[k],0):null};
}
function showScore(){
 const n=score().total;
 $("week8-review-total").textContent=n===null?"Select five rubric scores (0–2).":
 n+"/10 · "+(n>=8?"Mastery threshold met":"Targeted corrective revision required");
}
function prepared(){
 return ready&&!W.frozen&&!!locked.analysis&&!!locked.perspective&&
 inRange(f.analysisFinal.value,350,500)&&inRange(f.perspectiveFinal.value,180,260)&&
 inRange(f.craftNote.value,100,140)&&wc(f.revision.value)>=12&&
 ["coach","leila"].includes(f.character.value)&&
 $("week8-independent-check").checked&&$("week8-revision-check").checked;
}
function sync(){
 for(const [k,id] of Object.entries(ids)){
  if(k==="revision"||k==="character")continue;
  const counter=$("week8-"+id+"-count");
  if(counter)counter.textContent=wc(f[k].value)+" words · "+(
   k.startsWith("analysis")?"350–500 required":k.startsWith("perspective")?"180–260 required":"100–140 required");
 }
 const pass=approved()&&review.passed;
 $("week8-next-wrap").hidden=!pass;
 if(pass)$("week8-next-score").textContent="Human-entered mastery · "+review.score+"/10 for this submission.";
 $("week8-submit").disabled=!prepared()||pass;
 $("week8-record-review").disabled=!ready||W.frozen||!matches();
 $("week8-submission-status").textContent=!submission?"Not yet submitted.":
 matches()?"Evidence submitted "+new Date(submission.submittedAt).toLocaleString()+"; evaluator review remains separate.":
 "The current writing differs from the submitted version. Submit a revised assessment before being reevaluated.";
 $("week8-review-status").textContent=approved()?
 "Locally recorded educator review · "+review.score+"/10 · "+review.evaluator+"\nFeedback: "+review.feedback:
 "No current matching review for this writing. Student submission alone never awards mastery.";
}
function lockView(which){
 const input=f[which==="analysis"?"analysisDraft":"perspectiveDraft"],record=locked[which];
 const button=$("week8-lock-"+which),label=$("week8-"+which+"-lock-note");
 const finalField=f[which==="analysis"?"analysisFinal":"perspectiveFinal"];
 if(record){
  if(input.value!==record.text)halt("Saved original "+which+" conflicts with its lock record.");
  input.value=record.text;input.readOnly=true;button.disabled=true;
  label.textContent="Original preserved "+new Date(record.at).toLocaleString()+".";
 }else{
  button.disabled=!ready||W.frozen;
  label.textContent="Original "+which+" draft not locked yet.";
 }
 finalField.readOnly=!ready||W.frozen||!record;
}
function attemptLock(which,min,max){
 if(!ready||W.frozen||locked[which])return;
 const input=f[which==="analysis"?"analysisDraft":"perspectiveDraft"];
 if(!inRange(input.value,min,max)){
  $("week8-"+which+"-lock-note").textContent="Complete "+min+"–"+max+" words before preserving Draft 1.";return;
 }
 const next={version:1,text:input.value,fingerprint:hash(input.value),at:new Date().toISOString()};
 if(write(locks[which],JSON.stringify(next))){locked[which]=next;lockView(which);sync();}
}
$("week8-lock-analysis").addEventListener("click",()=>attemptLock("analysis",350,500));
$("week8-lock-perspective").addEventListener("click",()=>attemptLock("perspective",180,260));
Object.values(f).forEach(field=>field.addEventListener("input",sync));
["week8-independent-check","week8-revision-check"].forEach(id=>$(id).addEventListener("change",sync));
rubricIDs.forEach(k=>$("week8-rubric-"+k).addEventListener("change",()=>{showScore();sync();}));
$("week8-submit").addEventListener("click",()=>{
 if(!prepared())return;
 const all=materials();
 const next={schema:"english9-week08-day40-submission-v1",day:40,learnerId:profile.learnerId,
  submittedAt:new Date().toISOString(),analysisDraftWords:wc(f.analysisDraft.value),
  analysisFinalWords:wc(f.analysisFinal.value),perspectiveDraftWords:wc(f.perspectiveDraft.value),
  perspectiveFinalWords:wc(f.perspectiveFinal.value),craftWords:wc(f.craftNote.value),
  hashes:Object.fromEntries(Object.entries(all).map(([k,v])=>[k,hash(v)])),
  fingerprint:hash(Object.values(all).join("|"))};
 if(!write(subKey,JSON.stringify(next)))return;
 submission=next;
 const progress={...W.progress,[W.flag(40)]:true};
 if(write(W.progressKey,JSON.stringify(progress)))W.progress[W.flag(40)]=true;
 sync();
});
$("week8-record-review").addEventListener("click",()=>{
 if(!ready||W.frozen||!matches())return;
 const {rows,total}=score(),evaluator=$("week8-evaluator").value.trim(),feedback=$("week8-feedback").value.trim();
 if(total===null||evaluator.length<2||feedback.length<10){
  $("week8-review-status").textContent="Complete all five rubric scores, reviewer name and evidence-specific feedback.";return;
 }
 if(approved()&&!confirm("Replace the existing local educator review for this submission?"))return;
 const next={schema:"english9-week08-day40-review-v1",learnerId:profile.learnerId,
  submittedAt:submission.submittedAt,fingerprint:submission.fingerprint,rows,
  score:total,passed:total>=8,evaluator,feedback,evaluatedAt:new Date().toISOString()};
 if(!validReview(next,submission)){halt("Rubric review failed validation.");return;}
 if(write(reviewKey,JSON.stringify(next))){review=next;sync();}
});
function download(filename,payload){
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const uri=URL.createObjectURL(blob),anchor=document.createElement("a");
 anchor.href=uri;anchor.download=filename;document.body.appendChild(anchor);anchor.click();anchor.remove();
 setTimeout(()=>URL.revokeObjectURL(uri),1100);
}
$("week8-export").addEventListener("click",()=>{
 download("english9-week08-day40-backup.json",{
  schema:"english9-week08-day40-backup-v1",exportedAt:new Date().toISOString(),
  learnerId:profile?.learnerId||null,responses:Object.fromEntries(writing.map(x=>[x.dataset.saveField,x.value])),
  locks:locked,submission,review,containsUnsavedDrafts:W.frozen
 });
});
$("week8-export-review").addEventListener("click",()=>{
 if(!approved()){$("week8-review-status").textContent="Record a complete matching rubric review before exporting.";return;}
 download("english9-week08-day40-evaluation.json",{
  schema:"english9-week08-evaluation-v1",learnerId:profile.learnerId,
  exportedAt:new Date().toISOString(),review
 });
});
$("week8-import-review").addEventListener("change",async event=>{
 const file=event.target.files?.[0];event.target.value="";if(!file)return;
 try{
  if(!ready||W.frozen||!matches())throw Error("A matching submitted assessment is required first.");
  if(file.size>150000)throw Error("Evaluation file is too large.");
  const payload=JSON.parse(await file.text());
  if(payload.schema!=="english9-week08-evaluation-v1"||payload.learnerId!==profile.learnerId||
    !validReview(payload.review,submission))throw Error("Review is invalid or does not match this learner and submission.");
  if(approved()&&!confirm("Replace the existing local review?"))return;
  if(!write(reviewKey,JSON.stringify(payload.review)))throw Error("Unable to save evaluation; another tab may have changed it.");
  review=payload.review;sync();
  $("week8-review-status").textContent="Matching evaluation imported: "+review.score+"/10. "+
   (review.passed?"Continue to Week 09 is unlocked.":"Targeted revision required.");
 }catch(e){$("week8-review-status").textContent="Review not imported: "+e.message;}
});
window.addEventListener("storage",event=>{
 if(event.key===reviewKey||event.key===subKey){
  $("week8-next-wrap").hidden=true;
  say("Assessment records changed in another tab. Reload before continuing.",true);
 }
});
lockView("analysis");lockView("perspective");showScore();sync();
})();