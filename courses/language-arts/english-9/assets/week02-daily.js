
(function(){
"use strict";
const $=id=>document.getElementById(id);
const contract=window.KhaemenesCourseEntryContract;
const day=Number(document.body.getAttribute("data-english9-week2-day")||0);
const profile=contract?.readAcademyProfile?.()||null;
const scoped=base=>profile&&contract?.scopedKey?contract.scopedKey(base,profile):null;
let identity=null;try{identity=localStorage.getItem("khaemenes_active_learner_v1");}catch{}
const readiness=profile&&contract?.readJSON?.("khaemenes-english9-readiness-v1",null,profile);
const ready=!!(profile&&contract?.isReady?.(readiness,["close_reading_evidence","language_conventions","source_argument"],"english-9"));
const status=$("week2-daily-status")||document.createElement("aside");
if(!status.id){
 status.id="week2-daily-status";status.className="daily-status";status.setAttribute("role","status");
 (document.querySelector("[data-english9-week2-daily-index]")||document.querySelector("main"))?.prepend(status);
}
let frozen=false;const snapshot=new Map();
function report(message,error=false){status.textContent=message;status.classList.toggle("daily-warning",error);}
function freeze(reason){frozen=true;report("Saving paused: "+reason+" Export your current writing before leaving this page.",true);}
function read(key){
 if(!key)return null;
 try{const value=localStorage.getItem(key);snapshot.set(key,value);return value;}
 catch{freeze("Browser storage cannot be read.");return null;}
}
function write(key,value){
 if(frozen||!ready||!profile||!key)return false;
 try{
  if(localStorage.getItem("khaemenes_active_learner_v1")!==identity){freeze("Selected learner changed.");return false;}
  if(localStorage.getItem(key)!==snapshot.get(key)){freeze("A saved record changed in another tab.");return false;}
  localStorage.setItem(key,value);snapshot.set(key,value);
  report("Saved on this device · "+new Date().toLocaleTimeString());return true;
 }catch{freeze("Browser storage is unavailable or full.");return false;}
}
function validProgress(obj){return !!obj&&typeof obj==="object"&&!Array.isArray(obj)&&Object.values(obj).every(x=>typeof x==="boolean");}
function readJson(key,fallback,validator){
 const raw=read(key);if(raw===null)return fallback;
 try{const obj=JSON.parse(raw);if(!validator(obj))throw Error("invalid");return obj;}
 catch{freeze("An existing record is damaged; it was not overwritten.");return fallback;}
}
const progressKey=scoped("khae-ela9-progress-v1");
let progress=progressKey?readJson(progressKey,{},validProgress):{};
const writing=Array.from(document.querySelectorAll('[data-save-field][data-managed-save="week2"]'));
writing.forEach(field=>{
 const key=scoped("khae-ela9-field:"+field.dataset.saveField);
 field.value=key?read(key)||"":"";
 field.readOnly=!ready||frozen;
 field.addEventListener("input",()=>{write(key,field.value);if(day)refreshFinish();});
});
function dailyKey(d){return "week-02-day-"+String(d).padStart(2,"0");}
function updateIndex(){
 document.querySelectorAll("[data-week2-daily-status]").forEach(el=>{
  const d=Number(el.getAttribute("data-week2-daily-status"));
  el.textContent=!profile?"Select learner":progress[dailyKey(d)]?"Evidence prepared ✓":"Not yet prepared";
 });
}
updateIndex();
window.addEventListener("storage",ev=>{
 if(ev.key==="khaemenes_active_learner_v1"||snapshot.has(ev.key)){
  freeze("Learner selection or a saved record changed in another tab.");
  if(day)refreshFinish();
 }
});
if(!ready)report(profile?"Read-only preview · Complete English 9 readiness to save.":"Read-only preview · Choose your Academy learner to save.",true);
else report("Workspace ready · Original Week 2 fields are synchronized by Academy learner on this device.");
if(!day)return;
const bank=(()=>{try{
 const parsed=JSON.parse($("daily-exercise-data").textContent);
 if(parsed.day!==day||!Array.isArray(parsed.questions)||parsed.questions.length!==5)throw Error("wrong day");
 return parsed.questions;
 }catch{freeze("Formative question bank is missing or damaged.");return [];}
})();
const practiceKey=scoped("khae-ela9-field:week-02-day"+day+"-exercise-v1");
let practice={version:1,best:0,latest:0,attemptCount:0,attempts:[]};
if(practiceKey)practice=readJson(practiceKey,practice,x=>x&&typeof x==="object"&&Array.isArray(x.attempts)&&
 Number.isFinite(x.best)&&Number.isFinite(x.latest)&&Number.isInteger(x.attemptCount));
const feedback=[];
bank.forEach((q,i)=>{
 const fieldset=document.createElement("fieldset");fieldset.className="practice-question";
 const legend=document.createElement("legend");legend.textContent=(i+1)+". "+q.question;fieldset.append(legend);
 q.options.forEach((option,j)=>{
  const label=document.createElement("label"),input=document.createElement("input");
  input.type="radio";input.name="w2q-"+i;input.value=String(j);
  label.append(input,document.createTextNode(" "+option));fieldset.append(label);
 });
 const out=document.createElement("p");out.className="practice-feedback";out.setAttribute("aria-live","polite");
 feedback.push(out);fieldset.append(out);$("week2-questions").append(fieldset);
});
function scoreLabel(){$("week2-score").textContent=practice.attemptCount?
 "Formative · latest "+practice.latest+"% · best "+practice.best+"% · "+practice.attemptCount+" attempt(s)":
 "Formative only · 5 questions · 4 correct answers earns 80% practice readiness.";}
scoreLabel();
$("week2-check").disabled=!ready;
$("week2-check").addEventListener("click",()=>{
 if(!ready||frozen||bank.length!==5)return;
 const answers=[],count=bank.reduce((total,q,i)=>{
  const checked=document.querySelector('input[name="w2q-'+i+'"]:checked');
  if(!checked){answers.push(null);return total;}
  const ans=Number(checked.value);answers.push(ans);return total+Number(ans===q.answer);
 },0);
 if(answers.includes(null)){$("week2-score").textContent="Choose an answer for every question before checking.";return;}
 const score=Math.round(100*count/bank.length),next={
  version:1,best:Math.max(practice.best,score),latest:score,attemptCount:practice.attemptCount+1,
  attempts:practice.attempts.concat([{at:new Date().toISOString(),score,answers}]).slice(-30)
 };
 if(!write(practiceKey,JSON.stringify(next)))return;
 practice=next;
 feedback.forEach((el,i)=>{
  const ok=answers[i]===bank[i].answer;
  el.className="practice-feedback "+(ok?"good":"bad");
  el.textContent=(ok?"Correct. ":"Review. ")+bank[i].explanation;
 });
 scoreLabel();refreshFinish();
});
const lab=$("week2-lab"),pieces=lab?Array.from(lab.querySelectorAll("[data-workshop-part]")):[];
function preview(){
 if(pieces.length!==4||pieces.some(f=>!f.value.trim())){
  $("week2-lab-preview").textContent="Write your own responses for all four parts first.";return null;
 }
 const content=pieces.map(f=>f.dataset.workshopPart+": "+f.value.trim()).join("\n");
 $("week2-lab-preview").textContent=content;return content;
}
$("week2-lab-make").disabled=!ready;
$("week2-lab-save").disabled=!ready;
$("week2-lab-make").addEventListener("click",preview);
$("week2-lab-save").addEventListener("click",()=>{
 if(!ready||frozen)return;
 const draft=preview();if(!draft)return;
 const destination=writing.find(f=>f.dataset.saveField===lab.dataset.targetField);
 if(!destination){freeze("The lesson writing field cannot be found.");return;}
 if(destination.value.includes(draft)){
  $("week2-lab-preview").textContent="This exact draft is already in your saved lesson response.";return;
 }
 destination.value=(destination.value.trim()?destination.value.trim()+"\n\n":"")+draft;
 destination.dispatchEvent(new Event("input",{bubbles:true}));
 if(!frozen)$("week2-lab-preview").textContent="Added to your existing saved lesson response:\n\n"+draft;
});
const paper=$("week2-paper"),finish=$("week2-finish"),key=dailyKey(day);
function complete(){return practice.best>=80&&(paper.checked||writing.every(f=>f.value.trim().length>0));}
function refreshFinish(){
 finish.disabled=!ready||frozen||!complete()||!!progress[key];
 $("week2-finish-hint").textContent=progress[key]?
  "Daily evidence prepared. This does not confer a course grade or replace the independent Day 10 8/10 rubric.":
  "Finish the 80% practice check and save the original writing response (or preserve all of it on paper). Teacher review remains separate.";
}
paper.addEventListener("change",refreshFinish);
finish.addEventListener("click",()=>{
 if(!complete()||!ready||frozen)return;
 const update=Object.assign({},progress,{[key]:true});
 if(write(progressKey,JSON.stringify(update))){progress=update;refreshFinish();updateIndex();}
});
$("week2-export").addEventListener("click",()=>{
 const responses={};writing.forEach(field=>responses[field.dataset.saveField]=field.value);
 const payload={schema:"english9-week02-daily-v1",day,exportedAt:new Date().toISOString(),
  learnerId:profile?.learnerId||null,responses,practice,evidencePrepared:!!progress[key],
  containsUnsavedDrafts:frozen,paperEvidence:paper.checked};
 const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
 const a=document.createElement("a");a.href=url;a.download="english9-week02-day"+day+"-backup.json";
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
});
refreshFinish();
})();
