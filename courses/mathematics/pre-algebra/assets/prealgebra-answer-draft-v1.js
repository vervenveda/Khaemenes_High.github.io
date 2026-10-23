// Khaemenes Pre-Algebra: local, ungraded draft recovery for Units 02–13.
// Answer IDs are the original keyed option indices; their display order may shuffle.
(()=>{"use strict";
const lesson=window.LESSON_DATA,map=window.UNIT_MAP_FALLBACK,host=document.getElementById("questionList");
const unit=Number(map?.unit?.number);
if(!lesson?.id||!Array.isArray(lesson.questions)||!host||!(unit>=2&&unit<=13))return;
const key="khaemenes-prealgebra-lesson-draft-v1:u"+String(unit).padStart(2,"0")+":"+lesson.id;
const count=lesson.questions.length;
const choices=()=>Array.from({length:count},(_,i)=>{
 const input=host.querySelector('input[name="q'+i+'"]:checked');
 const value=input?Number(input.value):null;
 return Number.isInteger(value)&&value>=0&&value<lesson.questions[i].options.length?value:null;
});
function read(){
 try{
  const record=JSON.parse(localStorage.getItem(key)||"null");
  if(record?.schema!==1||record.lesson!==lesson.id||record.unit!==unit||
    !Array.isArray(record.answers)||record.answers.length!==count)return null;
  return record.answers.every((v,i)=>v===null||(Number.isInteger(v)&&v>=0&&v<lesson.questions[i].options.length))
    ?record.answers:null;
 }catch{return null;}
}
function save(){
 const answers=choices();
 try{
  if(answers.every(v=>v===null)){localStorage.removeItem(key);return;}
  localStorage.setItem(key,JSON.stringify({schema:1,unit,lesson:lesson.id,answers,savedAt:Date.now()}));
 }catch{
  const notice=document.getElementById("preAlgebraDraftStatus");
  if(notice)notice.textContent="Local draft storage unavailable. Keep this page open or print your work.";
 }
}
function restore(){
 const answers=read();if(!answers)return;
 answers.forEach((value,i)=>{
  if(value===null)return;
  const input=host.querySelector('input[name="q'+i+'"][value="'+value+'"]');
  if(input)input.checked=true;
 });
 const notice=document.getElementById("preAlgebraDraftStatus");
 if(notice)notice.textContent="Your unfinished choices were restored on this device. Scoring is unchanged.";
}
const status=document.createElement("p");status.id="preAlgebraDraftStatus";status.setAttribute("role","status");
status.setAttribute("aria-live","polite");
status.style.cssText="font-size:14px;line-height:1.5;opacity:.86;margin:10px 0;";
status.textContent="Unscored selections are saved locally while you work. Scores remain in the original assessment engine.";
host.parentNode?.insertBefore(status,host);
restore();
host.addEventListener("change",event=>{
 if(event.target?.matches?.('input[type="radio"]'))save();
});
const reset=document.getElementById("resetPractice");
reset?.addEventListener("click",()=>{
 // The core handles visual reset first; do not touch official mastery records.
 try{localStorage.removeItem(key);}catch{}
 status.textContent="Visible answers cleared. Prior scores and mastery remain unchanged.";
});
window.addEventListener("pagehide",save);
})();