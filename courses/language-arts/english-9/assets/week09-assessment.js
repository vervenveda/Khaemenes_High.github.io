/* Week 09 · Unit 03 narrative portfolio: private-to-browser consistency only, not secure grading authority. */
(function(){
"use strict";
if(document.body.getAttribute("data-english9-week9-day")!=="45")return;
const W=window.KhaemenesEnglish9Week09,$=id=>document.getElementById(id);
if(!W)return;
const {profile,ready,scoped,read,write,load,writing,hash,validSubmission,validReview,halt,say}=W;
const lookup=Object.fromEntries(writing.map(e=>[e.dataset.saveField,e]));
const names={draft:"story-draft",final:"story-final",commentary:"commentary",revision:"revision-note",
 reflection:"reflection",selfScore:"self-score"};
for(let i=1;i<=6;i++)names["craft"+i]="craft-"+i;
const f=Object.fromEntries(Object.entries(names).map(([k,v])=>[k,lookup["week-09-day45-"+v]]));
if(Object.values(f).some(x=>!x)){halt("One or more narrative portfolio fields are unavailable.");return;}
const lockKey=scoped("khae-ela9-field:week-09-day45-original-lock-v1"),
 subKey=scoped("khae-ela9-field:week-09-day45-submission-v1"),
 reviewKey=scoped("khae-ela9-field:week-09-day45-review-v1");
const wc=t=>String(t||"").trim().split(/\s+/).filter(Boolean).length;
const obj=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const inRange=(t,a,b)=>wc(t)>=a&&wc(t)<=b;
const validLock=x=>obj(x)&&x.version===1&&typeof x.text==="string"&&inRange(x.text,900,1400)&&
 x.fingerprint===hash(x.text)&&typeof x.at==="string"&&!Number.isNaN(Date.parse(x.at));
let locked=lockKey?load(lockKey,null,validLock):null,
 submission=subKey?load(subKey,null,validSubmission):null,
 review=reviewKey?load(reviewKey,null,obj):null;
const criterion=["purpose","character","structure","language","revision"];
function hasCraft(text){
 const s=text.toLowerCase();
 const markers=["location or quotation:","craft choice:","effect on the reader:"];
 if(!markers.every(k=>s.includes(k)))return false;
 return markers.every((key,i)=>{const next=markers[i+1];
  const part=s.split(key)[1].split(next||"\n")[0].trim();
  return part.length>=8;})&&wc(text)>=25;
}
const materials=()=>Object.fromEntries(Object.entries(f).map(([k,v])=>[k,v.value]));
function matches(){
 if(!validSubmission(submission)||submission.learnerId!==profile?.learnerId||
 !locked||hash(locked.text)!==submission.hashes.draft)return false;
 return Object.entries(submission.hashes).every(([k,h])=>hash(materials()[k]||"")===h);
}
const approved=()=>matches()&&validReview(review,submission);
function scores(){
 const rows={};criterion.forEach(k=>{const v=$("week9-rubric-"+k).value;rows[k]=v===""?null:Number(v);});
 const complete=criterion.every(k=>Number.isInteger(rows[k])&&rows[k]>=0&&rows[k]<=2);
 return {rows,total:complete?criterion.reduce((n,k)=>n+rows[k],0):null};
}
function showScore(){
 const total=scores().total;
 $("week9-review-total").textContent=total===null?"Select all five scores (0–2).":
 total+"/10 · "+(total>=8?"Mastery threshold reached":"Targeted corrective revision required");
}
function complete(){
 return ready&&!W.frozen&&!!locked&&inRange(f.final.value,900,1400)&&
 inRange(f.commentary.value,250,350)&&wc(f.revision.value)>=24&&
 wc(f.reflection.value)>=18&&wc(f.selfScore.value)>=10&&
 Array.from({length:6},(_,i)=>f["craft"+(i+1)]).every(e=>hasCraft(e.value))&&
 $("week9-independent").checked&&$("week9-revision-confirm").checked;
}
function sync(){
 $("week9-story-draft-count").textContent=wc(f.draft.value)+" words · 900–1,400 required";
 $("week9-story-final-count").textContent=wc(f.final.value)+" words · 900–1,400 required";
 $("week9-commentary-count").textContent=wc(f.commentary.value)+" words · 250–350 required";
 const count=Array.from({length:6},(_,i)=>f["craft"+(i+1)]).filter(e=>hasCraft(e.value)).length;
 $("week9-annotation-status").textContent=count+" of 6 craft decisions annotated with location, choice and reader effect.";
 const pass=approved()&&review.passed;
 $("week9-next-wrap").hidden=!pass;
 if(pass)$("week9-next-score").textContent="Human-entered Unit 03 mastery · "+review.score+"/10.";
 $("week9-submit").disabled=!complete()||pass;
 $("week9-record-review").disabled=!ready||W.frozen||!matches();
 $("week9-submission-status").textContent=!submission?"No independent story portfolio submitted.":
 matches()?"Portfolio submitted "+new Date(submission.submittedAt).toLocaleString()+". Educator review remains separate.":
 "Story or annotations changed after submission. Submit the revised portfolio for another review.";
 $("week9-review-status").textContent=approved()?
 "Local educator rubric · "+review.score+"/10 · "+review.evaluator+"\nFeedback: "+review.feedback:
 "No current matching evaluation for this exact story portfolio. Self-scoring and submission alone do not unlock Unit 04.";
}
function showLock(){
 if(locked){
  if(f.draft.value!==locked.text)halt("The stored original story differs from its preserved lock.");
  f.draft.value=locked.text;f.draft.readOnly=true;
  $("week9-lock-draft").disabled=true;
  $("week9-lock-status").textContent="Original draft preserved "+new Date(locked.at).toLocaleString();
 }else{
  $("week9-lock-draft").disabled=!ready||W.frozen;
  $("week9-lock-status").textContent="Original full story draft not locked yet.";
 }
 f.final.readOnly=!ready||W.frozen||!locked;
}
function importFrom(day,field,to){
 if(!ready||W.frozen||(to==="draft"&&locked))return;
 const key=scoped("khae-ela9-field:week-09-day"+day+"-"+field);
 const content=key?read(key)||"":"";
 if(!inRange(content,900,1400)){
  $("week9-lock-status").textContent="Day "+day+" saved story contains "+wc(content)+" words; 900–1,400 required for this transfer.";
  return;
 }
 if(f[to].value.trim()&&!confirm("Replace this unfinalized "+to+" with the saved Day "+day+" writing?"))return;
 f[to].value=content;f[to].dispatchEvent(new Event("input",{bubbles:true}));
 $("week9-lock-status").textContent="Copied the Day "+day+" text; the original source remains unchanged.";
}
$("week9-import-day43").addEventListener("click",()=>importFrom(43,"draft","draft"));
$("week9-import-day44").addEventListener("click",()=>importFrom(44,"revised","final"));
$("week9-lock-draft").addEventListener("click",()=>{
 if(!ready||W.frozen||locked)return;
 if(!inRange(f.draft.value,900,1400)){$("week9-lock-status").textContent="Complete the 900–1,400-word story before locking.";return;}
 const next={version:1,text:f.draft.value,fingerprint:hash(f.draft.value),at:new Date().toISOString()};
 if(write(lockKey,JSON.stringify(next))){locked=next;showLock();sync();}
});
Object.values(f).forEach(e=>e.addEventListener("input",sync));
["week9-independent","week9-revision-confirm"].forEach(id=>$(id).addEventListener("change",sync));
criterion.forEach(k=>$("week9-rubric-"+k).addEventListener("change",()=>{showScore();sync();}));
$("week9-submit").addEventListener("click",()=>{
 if(!complete())return;
 const all=materials(),next={schema:"english9-week09-day45-submission-v1",
  day:45,learnerId:profile.learnerId,submittedAt:new Date().toISOString(),
  draftWords:wc(f.draft.value),finalWords:wc(f.final.value),
  commentaryWords:wc(f.commentary.value),annotationsComplete:6,
  hashes:Object.fromEntries(Object.entries(all).map(([k,v])=>[k,hash(v)])),
  fingerprint:hash(Object.values(all).join("|"))};
 if(!write(subKey,JSON.stringify(next)))return;
 submission=next;
 const progress={...W.progress,[W.flag(45)]:true};
 if(write(W.progressKey,JSON.stringify(progress)))W.progress[W.flag(45)]=true;
 sync();
});
$("week9-record-review").addEventListener("click",()=>{
 if(!ready||W.frozen||!matches())return;
 const {rows,total}=scores(),name=$("week9-evaluator").value.trim(),feedback=$("week9-feedback").value.trim();
 if(total===null||name.length<2||feedback.length<10){
  $("week9-review-status").textContent="Complete the five scores, evaluator name, and evidence-specific guidance.";return;
 }
 if(approved()&&!confirm("Replace the previous local rubric record?"))return;
 const next={schema:"english9-week09-day45-review-v1",learnerId:profile.learnerId,
  submittedAt:submission.submittedAt,fingerprint:submission.fingerprint,rows,score:total,
  passed:total>=8,evaluator:name,feedback,evaluatedAt:new Date().toISOString()};
 if(!validReview(next,submission)){halt("Review validation failed.");return;}
 if(write(reviewKey,JSON.stringify(next))){review=next;sync();}
});
function download(name,payload){
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),
 uri=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=uri;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(uri),1200);
}
$("week9-export").addEventListener("click",()=>download("english9-week09-day45-portfolio.json",{
 schema:"english9-week09-day45-backup-v1",exportedAt:new Date().toISOString(),learnerId:profile?.learnerId||null,
 responses:Object.fromEntries(writing.map(e=>[e.dataset.saveField,e.value])),
 lockedDraft:locked,submission,review,containsUnsavedDrafts:W.frozen
}));
$("week9-export-review").addEventListener("click",()=>{
 if(!approved()){$("week9-review-status").textContent="A matching saved evaluation is required.";return;}
 download("english9-week09-day45-evaluation.json",{
  schema:"english9-week09-evaluation-v1",exportedAt:new Date().toISOString(),learnerId:profile.learnerId,review
 });
});
$("week9-import-review").addEventListener("change",async ev=>{
 const file=ev.target.files?.[0];ev.target.value="";if(!file)return;
 try{
  if(!ready||W.frozen||!matches())throw Error("Matching submitted evidence is required.");
  if(file.size>150000)throw Error("Evaluation file is too large.");
  const payload=JSON.parse(await file.text());
  if(payload.schema!=="english9-week09-evaluation-v1"||payload.learnerId!==profile.learnerId||
   !validReview(payload.review,submission))throw Error("Evaluation does not match this learner and submission.");
  if(approved()&&!confirm("Replace the existing review?"))return;
  if(!write(reviewKey,JSON.stringify(payload.review)))throw Error("Review record changed in another tab.");
  review=payload.review;sync();
  $("week9-review-status").textContent="Matching evaluation imported: "+review.score+"/10. "+
   (review.passed?"Unit 04 continuation unlocked.":"Corrective revision needed.");
 }catch(err){$("week9-review-status").textContent="Import rejected: "+err.message;}
});
window.addEventListener("storage",ev=>{
 if(ev.key===subKey||ev.key===reviewKey){$("week9-next-wrap").hidden=true;say("A record changed in another tab. Reload before continuing.",true);}
});
showLock();showScore();sync();
})();