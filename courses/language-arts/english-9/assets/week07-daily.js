/* English 9 Week 07 daily learning · browser-local / learner-scoped */
(function(){
"use strict";
const $=id=>document.getElementById(id),day=Number(document.body.getAttribute("data-english9-week7-day")||0);
const C=window.KhaemenesCourseEntryContract,profile=C?.readAcademyProfile?.()||null;
const scoped=base=>profile&&C?.scopedKey?C.scopedKey(base,profile):null;
const readiness=profile&&C?.readJSON?.("khaemenes-english9-readiness-v1",null,profile);
const ready=!!(profile&&C?.isReady?.(readiness,["close_reading_evidence","language_conventions","source_argument"],"english-9"));
const status=$("week7-status")||document.createElement("p");
if(!status.id){status.id="week7-status";status.className="week7-status";(document.querySelector("[data-english9-week7-index]")||document.querySelector("main"))?.prepend(status);}
let frozen=false,identity=null;
try{identity=localStorage.getItem("khaemenes_active_learner_v1");}catch{frozen=true;}
const snapshots=new Map();
function say(t,bad=false){status.textContent=t;status.classList.toggle("week7-error",bad);}
function halt(reason){frozen=true;say("Saving paused: "+reason+" Export a backup before leaving.",true);}
function read(key){if(!key)return null;try{const v=localStorage.getItem(key);snapshots.set(key,v);return v;}catch{halt("record cannot be read");return null;}}
function write(key,v){
 if(!key||!ready||frozen)return false;
 try{
  if(localStorage.getItem("khaemenes_active_learner_v1")!==identity){halt("learner changed");return false;}
  if(localStorage.getItem(key)!==snapshots.get(key)){halt("a newer record exists in another tab");return false;}
  localStorage.setItem(key,v);snapshots.set(key,v);say("Saved for this learner on this device · "+new Date().toLocaleTimeString());return true;
 }catch{halt("storage is unavailable");return false;}
}
function load(key,fallback,valid){
 const raw=read(key);if(raw===null)return fallback;
 try{const x=JSON.parse(raw);if(!valid(x))throw Error("invalid");return x;}catch{halt("a saved record is damaged; the original was preserved");return fallback;}
}
const object=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const progressKey=scoped("khae-ela9-progress-v1");
let progress=progressKey?load(progressKey,{},x=>object(x)&&Object.values(x).every(v=>typeof v==="boolean")):{};
const writing=[...document.querySelectorAll('[data-save-field][data-managed-save="week7"]')];
writing.forEach(field=>{
 const key=scoped("khae-ela9-field:"+field.dataset.saveField);
 field.value=key?read(key)||"":"";
 field.readOnly=!ready||frozen;
 field.addEventListener("input",()=>{
  write(key,field.value);
  if(day>=31&&day<=34)refreshEvidence();
 });
});
function flag(d){return "week-07-day-"+d;}
function refreshIndex(){document.querySelectorAll("[data-week7-daily-status]").forEach(e=>{
 const n=Number(e.getAttribute("data-week7-daily-status"));
 e.textContent=profile?(progress[flag(n)]?"Evidence prepared ✓":"Not yet prepared"):"Choose learner";
});}
refreshIndex();
window.addEventListener("storage",e=>{
 if(e.key==="khaemenes_active_learner_v1"||snapshots.has(e.key)){
  halt("record or learner changed in another tab");
  if(day>=31&&day<=34)refreshEvidence();
 }
});
if(!ready)say(profile?"Read-only preview · Complete English 9 readiness to save.":"Read-only preview · Select a learner first.",true);
else say("Ready · Writing uses the original Week 07 learner-specific keys.");
function hash(s){
 let v=2166136261;for(let i=0;i<s.length;i++){v^=s.charCodeAt(i);v=Math.imul(v,16777619);}
 return (v>>>0).toString(16)+":"+s.length;
}
function validSubmission(x){
 return object(x)&&x.schema==="english9-week07-day35-submission-v1"&&x.day===35&&
 typeof x.learnerId==="string"&&x.learnerId.trim().length>0&&
 typeof x.submittedAt==="string"&&!Number.isNaN(Date.parse(x.submittedAt))&&
 Number.isInteger(x.analysisWords)&&x.analysisWords>=300&&x.analysisWords<=450&&
 Number.isInteger(x.sceneDraftWords)&&x.sceneDraftWords>=350&&x.sceneDraftWords<=550&&
 Number.isInteger(x.sceneFinalWords)&&x.sceneFinalWords>=350&&x.sceneFinalWords<=550&&
 Number.isInteger(x.commentaryWords)&&x.commentaryWords>=100&&x.commentaryWords<=150&&
 typeof x.fingerprint==="string"&&object(x.hashes)&&
 ["analysis","sceneDraft","sceneFinal","commentary","growth"].every(k=>typeof x.hashes[k]==="string");
}
function validReview(review,submission){
 if(!validSubmission(submission)||!object(review)||review.schema!=="english9-week07-day35-review-v1"||
 review.learnerId!==submission.learnerId||review.submittedAt!==submission.submittedAt||
 review.fingerprint!==submission.fingerprint||!object(review.rows)||Object.keys(review.rows).length!==5)return false;
 const keys=["character","conflict","setting","craft","language"];
 if(!keys.every(k=>Number.isInteger(review.rows[k])&&review.rows[k]>=0&&review.rows[k]<=2))return false;
 const sum=keys.reduce((a,k)=>a+review.rows[k],0);
 return review.score===sum&&review.passed===(sum>=8)&&
 typeof review.evaluator==="string"&&review.evaluator.trim().length>=2&&
 typeof review.feedback==="string"&&review.feedback.trim().length>=10&&
 typeof review.evaluatedAt==="string"&&!Number.isNaN(Date.parse(review.evaluatedAt));
}
function eligible(){
 if(!ready||frozen||![31,32,33,34,35].every(d=>progress[flag(d)]===true))return false;
 try{
  const submission=JSON.parse(localStorage.getItem(scoped("khae-ela9-field:week-07-day35-submission-v1"))||"null");
  const review=JSON.parse(localStorage.getItem(scoped("khae-ela9-field:week-07-day35-review-v1"))||"null");
  if(!validReview(review,submission)||!review.passed||submission.learnerId!==profile.learnerId)return false;
  const fieldKeys={analysis:"week-07-day35-analysis",sceneDraft:"week-07-day35-scene-draft",
   sceneFinal:"week-07-day35-scene-final",commentary:"week-07-day35-commentary",growth:"week-07-day35-growth"};
  return Object.keys(fieldKeys).every(k=>
    hash(localStorage.getItem(scoped("khae-ela9-field:"+fieldKeys[k]))||"")===submission.hashes[k]);
 }catch{return false;}
}
if(!day){
 const mark=document.querySelector('[data-managed-progress="week7"][data-progress-key="week-07"]');
 if(mark){
  const sync=()=>{
   const pass=eligible();
   mark.disabled=!pass;
   mark.textContent=progress["week-07"]?"Week 07 Evidence Prepared ✓":pass?"Mark Week 07 Evidence Prepared":"Finish Days 31–35 and pass the 8/10 Week 7 rubric";
   document.querySelectorAll("[data-week07-next-link]").forEach(a=>{a.hidden=!pass;});
  };
  mark.addEventListener("click",()=>{
   if(!eligible())return;
   const next=Object.assign({},progress,{"week-07":true});
   if(write(progressKey,JSON.stringify(next))){progress=next;sync();}
  });sync();
 }return;
}
if(day===35){
 window.KhaemenesEnglish9Week07=Object.freeze({profile,ready,scoped,read,write,load,progress,progressKey,writing,hash,validReview,validSubmission,flag,halt,say,get frozen(){return frozen;}});
 return;
}
if(day<31||day>34)return;
const answer=writing.find(f=>f.dataset.saveField==="week-07-day"+day);
if(day===34){
 const scene=writing.find(f=>f.dataset.saveField==="week-07-day34-scene-draft");
 const label=$("week7-day34-words");
 if(scene&&label){
  function refreshSceneCount(){const words=scene.value.trim().split(/\s+/).filter(Boolean).length;
   label.textContent=words+" words · 350–550 required for the independent scene"; }
  scene.addEventListener("input",refreshSceneCount);refreshSceneCount();
 }
}

const bank=(()=>{try{const v=JSON.parse($("week7-question-data").textContent);
 if(v.day!==day||v.questions.length!==5||!v.questions.every(q=>q.options.length===3&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3))throw Error("bad");
 return v.questions;
}catch{halt("practice questions are unavailable");return [];}})();
const quizKey=scoped("khae-ela9-field:week-07-day-"+day+"-practice-v1");
let quiz=quizKey?load(quizKey,{best:0,latest:0,attempts:[]},x=>object(x)&&Number.isFinite(x.best)&&Array.isArray(x.attempts)):{best:0,latest:0,attempts:[]};
const notes=[];
bank.forEach((q,i)=>{
 const group=document.createElement("fieldset"),legend=document.createElement("legend");
 legend.textContent=(i+1)+". "+q.question;group.append(legend);
 q.options.forEach((opt,j)=>{const label=document.createElement("label"),input=document.createElement("input");
 input.type="radio";input.name="w7q-"+i;input.value=String(j);
 label.append(input,document.createTextNode(" "+opt));group.append(label);});
 const p=document.createElement("p");p.setAttribute("aria-live","polite");group.append(p);notes.push(p);$("week7-questions").append(group);
});
function refreshNext(){
 const ok=ready&&!frozen&&quiz.best>=80;
 $("week7-next-wrap").hidden=!ok;
 if(ok)$("week7-next-score").textContent="Formative practice passed · Best score "+quiz.best+"%.";
}
function refreshScore(){$("week7-score").textContent=quiz.attempts.length?
 "Best "+quiz.best+"% · Latest "+quiz.latest+"% · "+quiz.attempts.length+" attempt(s)":"Five questions; four correct reaches 80%.";}
$("week7-check").disabled=!ready;
$("week7-check").addEventListener("click",()=>{
 if(!ready||frozen||bank.length!==5)return;
 const nodes=bank.map((q,i)=>document.querySelector('input[name="w7q-'+i+'"]:checked'));
 if(nodes.some(n=>!n)){$("week7-score").textContent="Answer all five questions first.";return;}
 const picks=nodes.map(n=>Number(n.value)),score=picks.filter((n,i)=>n===bank[i].answer).length*20;
 const next={best:Math.max(quiz.best,score),latest:score,attempts:quiz.attempts.concat([{date:new Date().toISOString(),score,answers:picks}]).slice(-30)};
 if(!write(quizKey,JSON.stringify(next)))return;
 quiz=next;
 notes.forEach((p,i)=>{p.textContent=(picks[i]===bank[i].answer?"Correct. ":"Review. ")+bank[i].explanation;});
 refreshScore();refreshNext();refreshEvidence();
});
const parts=[...document.querySelectorAll("[data-workshop-part]")];
function preview(){
 if(parts.length!==4||parts.some(p=>!p.value.trim())){$("week7-studio-output").textContent="Complete all four parts in your own words.";return null;}
 const s=parts.map(p=>p.dataset.workshopPart+": "+p.value.trim()).join("\n");
 $("week7-studio-output").textContent=s;return s;
}
$("week7-preview").disabled=!ready;$("week7-save-studio").disabled=!ready;
$("week7-preview").addEventListener("click",preview);
$("week7-save-studio").addEventListener("click",()=>{
 if(!ready||frozen)return;
 const text=preview();if(!text)return;
 if(answer.value.includes(text)){$("week7-studio-output").textContent="The exact draft is already in your saved response.";return;}
 answer.value+=(answer.value.trim()?"\n\n":"")+text;
 answer.dispatchEvent(new Event("input",{bubbles:true}));
 if(!frozen)$("week7-studio-output").textContent="Appended to your original response without replacing your work.";
});
const paper=$("week7-paper"),finish=$("week7-finish"),recordKey=flag(day);
function complete(){return quiz.best>=80&&(paper.checked||answer.value.trim().length>0);}
function refreshEvidence(){
 finish.disabled=!ready||frozen||!complete()||!!progress[recordKey];
 $("week7-finish-hint").textContent=progress[recordKey]?"Daily evidence prepared · not an essay grade.":
 "Pass the 80% formative check, then preserve the writing or completed paper work.";
}
paper.addEventListener("change",refreshEvidence);
finish.addEventListener("click",()=>{
 if(!complete()||!ready||frozen)return;
 const next=Object.assign({},progress,{[recordKey]:true});
 if(write(progressKey,JSON.stringify(next))){progress=next;refreshEvidence();refreshIndex();}
});
$("week7-export").addEventListener("click",()=>{
 const blob=new Blob([JSON.stringify({schema:"english9-week07-daily-v1",day,learnerId:profile?.learnerId||null,
 response:answer.value,quiz,evidencePrepared:!!progress[recordKey]},null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="english9-week07-day"+day+".json";document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
});
refreshScore();refreshNext();refreshEvidence();
})();