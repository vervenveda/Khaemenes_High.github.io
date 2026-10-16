/* English 9 Week 11 daily learning · browser-local / learner-scoped */
(function(){
"use strict";
const $=id=>document.getElementById(id),day=Number(document.body.getAttribute("data-english9-week11-day")||0);
const C=window.KhaemenesCourseEntryContract,profile=C?.readAcademyProfile?.()||null;
const scoped=base=>profile&&C?.scopedKey?C.scopedKey(base,profile):null;
const readiness=profile&&C?.readJSON?.("khaemenes-english9-readiness-v1",null,profile);
const ready=!!(profile&&C?.isReady?.(readiness,["close_reading_evidence","language_conventions","source_argument"],"english-9"));
const status=$("week11-status")||document.createElement("p");
if(!status.id){status.id="week11-status";status.className="week11-status";(document.querySelector("[data-english9-week11-index]")||document.querySelector("main"))?.prepend(status);}
let frozen=false,identity=null;
try{identity=localStorage.getItem("khaemenes_active_learner_v1");}catch{frozen=true;}
const snapshots=new Map();
function say(t,bad=false){status.textContent=t;status.classList.toggle("week11-error",bad);}
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
const writing=[...document.querySelectorAll('[data-save-field][data-managed-save="week11"]')];
writing.forEach(field=>{
 const key=scoped("khae-ela9-field:"+field.dataset.saveField);
 field.value=key?read(key)||"":"";
 field.readOnly=!ready||frozen;
 field.addEventListener("input",()=>{
  write(key,field.value);
  if(day>=51&&day<=54)refreshEvidence();
 });
});
function flag(d){return "week-11-day-"+d;}
function refreshIndex(){document.querySelectorAll("[data-week11-daily-status]").forEach(e=>{
 const n=Number(e.getAttribute("data-week11-daily-status"));
 e.textContent=profile?(progress[flag(n)]?"Evidence prepared ✓":"Not yet prepared"):"Choose learner";
});}
refreshIndex();
window.addEventListener("storage",e=>{
 if(e.key==="khaemenes_active_learner_v1"||snapshots.has(e.key)){
  halt("record or learner changed in another tab");
  if(day>=51&&day<=54)refreshEvidence();
 }
});
if(!ready)say(profile?"Read-only preview · Complete English 9 readiness to save.":"Read-only preview · Select a learner first.",true);
else say("Ready · Week 11 student writing is saved in learner-specific records.");
function hash(s){
 let v=2166136261;for(let i=0;i<s.length;i++){v^=s.charCodeAt(i);v=Math.imul(v,16777619);}
 return (v>>>0).toString(16)+":"+s.length;
}
function validSubmission(x){
 return object(x)&&x.schema==="english9-week11-day55-submission-v1"&&x.day===55&&
 typeof x.learnerId==="string"&&x.learnerId.trim().length>0&&
 typeof x.submittedAt==="string"&&!Number.isNaN(Date.parse(x.submittedAt))&&
 Number.isInteger(x.analysisWords)&&x.analysisWords>=350&&x.analysisWords<=500&&
 Number.isInteger(x.craftWords)&&x.craftWords>=160&&x.craftWords<=220&&
 Number.isInteger(x.draftLines)&&x.draftLines>=1&&
 Number.isInteger(x.finalLines)&&x.finalLines>=1&&x.annotationsComplete===4&&
 ["quatrains","blankverse","volta","refrain"].includes(x.form)&&
 typeof x.fingerprint==="string"&&object(x.hashes)&&
 ["analysis","form","rule","draft","final","lengthNote","craft","revision","reflection",
  "annotation1","annotation2","annotation3","annotation4"].every(k=>typeof x.hashes[k]==="string");
}
function validReview(r,s){
 if(!validSubmission(s)||!object(r)||r.schema!=="english9-week11-day55-review-v1"||
 r.learnerId!==s.learnerId||r.submittedAt!==s.submittedAt||r.fingerprint!==s.fingerprint||
 !object(r.rows)||Object.keys(r.rows).length!==5)return false;
 const keys=["claim","evidence","poem","annotations","craft"];
 if(!keys.every(k=>Number.isInteger(r.rows[k])&&r.rows[k]>=0&&r.rows[k]<=2))return false;
 const total=keys.reduce((n,k)=>n+r.rows[k],0);
 return r.score===total&&r.passed===(total>=8)&&
 typeof r.evaluator==="string"&&r.evaluator.trim().length>=2&&
 typeof r.feedback==="string"&&r.feedback.trim().length>=10&&
 typeof r.evaluatedAt==="string"&&!Number.isNaN(Date.parse(r.evaluatedAt));
}
function eligible(){
 if(!ready||frozen||![51,52,53,54,55].every(d=>progress[flag(d)]===true))return false;
 try{
  const sub=JSON.parse(localStorage.getItem(scoped("khae-ela9-field:week-11-day55-submission-v1"))||"null");
  const r=JSON.parse(localStorage.getItem(scoped("khae-ela9-field:week-11-day55-review-v1"))||"null");
  if(!validReview(r,sub)||!r.passed||sub.learnerId!==profile.learnerId)return false;
  const names={analysis:"analysis",form:"form",rule:"rule",draft:"draft",final:"final",
    lengthNote:"length-note",craft:"craft",revision:"revision",reflection:"reflection",
    annotation1:"annotation-1",annotation2:"annotation-2",annotation3:"annotation-3",annotation4:"annotation-4"};
  return Object.keys(names).every(k=>hash(localStorage.getItem(scoped("khae-ela9-field:week-11-day55-"+names[k]))||"")===sub.hashes[k]);
 }catch{return false;}
}
if(!day){
 const mark=document.querySelector('[data-managed-progress="week11"][data-progress-key="week-11"]');
 if(mark){
  const sync=()=>{
   const pass=eligible();
   mark.disabled=!pass;
   mark.textContent=progress["week-11"]?"Week 11 Evidence Prepared ✓":pass?"Mark Week 11 Evidence Prepared":"Finish Days 51–55 and pass the 8/10 Week 11 poetry rubric";
   document.querySelectorAll("[data-week11-next-link]").forEach(a=>{a.hidden=!pass;});
  };
  mark.addEventListener("click",()=>{
   if(!eligible())return;
   const next=Object.assign({},progress,{"week-11":true});
   if(write(progressKey,JSON.stringify(next))){progress=next;sync();}
  });sync();
 }return;
}
if(day===55){
 window.KhaemenesEnglish9Week11=Object.freeze({profile,ready,scoped,read,write,load,progress,progressKey,writing,hash,validReview,validSubmission,flag,halt,say,get frozen(){return frozen;}});
 return;
}
if(day<51||day>54)return;
const answer=writing.find(f=>f.dataset.saveField==="week-11-day-"+day);
if(day===54){
 const poem=writing.find(x=>x.dataset.saveField==="week-11-day54-poem-draft"),
  counter=$("week11-poem-count"),
  form=writing.find(x=>x.dataset.saveField==="week-11-day54-form");
 if(form){
  if(!["quatrains","blankverse","volta","refrain"].includes(form.value))form.value="quatrains";
  form.addEventListener("change",()=>form.dispatchEvent(new Event("input",{bubbles:true})));
 }
 if(poem&&counter){
  const update=()=>{const lines=poem.value.split(/\r?\n/).filter(x=>x.trim()).length;
   counter.textContent=lines+" nonblank lines · check the length recommended for your selected form";};
  poem.addEventListener("input",update);update();
 }
}
const bank=(()=>{try{const v=JSON.parse($("week11-question-data").textContent);
 if(v.day!==day||v.questions.length!==5||!v.questions.every(q=>q.options.length===3&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3))throw Error("bad");
 return v.questions;
}catch{halt("practice questions are unavailable");return [];}})();
const quizKey=scoped("khae-ela9-field:week-11-day-"+day+"-practice-v1");
let quiz=quizKey?load(quizKey,{best:0,latest:0,attempts:[]},x=>object(x)&&Number.isFinite(x.best)&&Array.isArray(x.attempts)):{best:0,latest:0,attempts:[]};
const notes=[];
bank.forEach((q,i)=>{
 const group=document.createElement("fieldset"),legend=document.createElement("legend");
 legend.textContent=(i+1)+". "+q.question;group.append(legend);
 q.options.forEach((opt,j)=>{const label=document.createElement("label"),input=document.createElement("input");
 input.type="radio";input.name="w11q-"+i;input.value=String(j);
 label.append(input,document.createTextNode(" "+opt));group.append(label);});
 const p=document.createElement("p");p.setAttribute("aria-live","polite");group.append(p);notes.push(p);$("week11-questions").append(group);
});
function refreshNext(){
 const ok=ready&&!frozen&&quiz.best>=80;
 $("week11-next-wrap").hidden=!ok;
 if(ok)$("week11-next-score").textContent="Formative practice passed · Best score "+quiz.best+"%.";
}
function refreshScore(){$("week11-score").textContent=quiz.attempts.length?
 "Best "+quiz.best+"% · Latest "+quiz.latest+"% · "+quiz.attempts.length+" attempt(s)":"Five questions; four correct reaches 80%.";}
$("week11-check").disabled=!ready;
$("week11-check").addEventListener("click",()=>{
 if(!ready||frozen||bank.length!==5)return;
 const nodes=bank.map((q,i)=>document.querySelector('input[name="w11q-'+i+'"]:checked'));
 if(nodes.some(n=>!n)){$("week11-score").textContent="Answer all five questions first.";return;}
 const picks=nodes.map(n=>Number(n.value)),score=picks.filter((n,i)=>n===bank[i].answer).length*20;
 const next={best:Math.max(quiz.best,score),latest:score,attempts:quiz.attempts.concat([{date:new Date().toISOString(),score,answers:picks}]).slice(-30)};
 if(!write(quizKey,JSON.stringify(next)))return;
 quiz=next;
 notes.forEach((p,i)=>{p.textContent=(picks[i]===bank[i].answer?"Correct. ":"Review. ")+bank[i].explanation;});
 refreshScore();refreshNext();refreshEvidence();
});
const parts=[...document.querySelectorAll("[data-workshop-part]")];
function preview(){
 if(parts.length!==4||parts.some(p=>!p.value.trim())){$("week11-studio-output").textContent="Complete all four parts in your own words.";return null;}
 const s=parts.map(p=>p.dataset.workshopPart+": "+p.value.trim()).join("\n");
 $("week11-studio-output").textContent=s;return s;
}
$("week11-preview").disabled=!ready;$("week11-save-studio").disabled=!ready;
$("week11-preview").addEventListener("click",preview);
$("week11-save-studio").addEventListener("click",()=>{
 if(!ready||frozen)return;
 const text=preview();if(!text)return;
 if(answer.value.includes(text)){$("week11-studio-output").textContent="The exact draft is already in your saved response.";return;}
 answer.value+=(answer.value.trim()?"\n\n":"")+text;
 answer.dispatchEvent(new Event("input",{bubbles:true}));
 if(!frozen)$("week11-studio-output").textContent="Appended to your original response without replacing your work.";
});
const paper=$("week11-paper"),finish=$("week11-finish"),recordKey=flag(day);
function complete(){return quiz.best>=80&&(paper.checked||answer.value.trim().length>0);}
function refreshEvidence(){
 finish.disabled=!ready||frozen||!complete()||!!progress[recordKey];
 $("week11-finish-hint").textContent=progress[recordKey]?"Daily evidence prepared · not an essay grade.":
 "Pass the 80% formative check, then preserve the writing or completed paper work.";
}
paper.addEventListener("change",refreshEvidence);
finish.addEventListener("click",()=>{
 if(!complete()||!ready||frozen)return;
 const next=Object.assign({},progress,{[recordKey]:true});
 if(write(progressKey,JSON.stringify(next))){progress=next;refreshEvidence();refreshIndex();}
});
$("week11-export").addEventListener("click",()=>{
 const blob=new Blob([JSON.stringify({schema:"english9-week11-daily-v1",day,learnerId:profile?.learnerId||null,
 response:answer.value,quiz,evidencePrepared:!!progress[recordKey]},null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="english9-week11-day"+day+".json";document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
});
refreshScore();refreshNext();refreshEvidence();
})();