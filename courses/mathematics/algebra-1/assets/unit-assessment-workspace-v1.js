/* Algebra I · Unit Mastery Worksheet Enhancer v1
   Presentation and scratch-work only.
   Does not score, grade, unlock, change question banks, or write mastery evidence. */
(()=>{"use strict";
if(window.__KHAE_A1_UNIT_ASSESSMENT_WORKSPACE_V1__)return;
window.__KHAE_A1_UNIT_ASSESSMENT_WORKSPACE_V1__=true;

const path=location.pathname.toLowerCase();
if(!/\/algebra-1\/units\/unit-\d+\/assessment\/mastery-check\.html$/.test(path))return;

document.body.classList.add("math-assessment-surface","algebra1-unit-mastery");
document.body.dataset.mathAssessmentMode="unit";
window.dispatchEvent(new CustomEvent("khaemenes-math-assessment-mode",{detail:{enabled:true,mode:"unit"}}));

const profile=()=>{try{return window.KhaemenesCourseEntryContract?.readAcademyProfile?.()||null}catch{return null}};
const learner=()=>profile()?.learnerId||"session";
const storageKey=()=>`khae-a1-unit-mastery-scratch-v1:${learner()}:${location.pathname}`;

function readScratch(){
  try{
    const raw=sessionStorage.getItem(storageKey());
    const value=raw?JSON.parse(raw):{};
    return value&&typeof value==="object"?value:{};
  }catch{return{}}
}
function writeScratch(value){
  try{
    const raw=JSON.stringify(value);
    sessionStorage.setItem(storageKey(),raw);
    return sessionStorage.getItem(storageKey())===raw;
  }catch{return false}
}
let scratch=readScratch();

function decorate(){
  const questions=[...document.querySelectorAll("#main .question")];
  if(!questions.length)return false;
  questions.forEach((question,index)=>{
    if(question.querySelector("[data-a1-unit-work]"))return;
    const label=document.createElement("label");
    label.className="math-work-label";
    label.htmlFor=`a1UnitWork${index}`;
    label.textContent="Show your work · ungraded session workspace";
    const area=document.createElement("textarea");
    area.id=`a1UnitWork${index}`;
    area.className="math-workspace";
    area.dataset.a1UnitWork=String(index);
    area.placeholder="Use this space for calculations, graphs, checks, or reasoning…";
    area.value=String(scratch[index]??"");
    area.addEventListener("input",()=>{scratch[index]=area.value});
    area.addEventListener("change",()=>{
      scratch[index]=area.value;
      const ok=writeScratch(scratch);
      area.dataset.storageVerified=String(ok);
    });
    question.append(label,area);
  });
  const main=document.getElementById("main");
  if(main&&!document.getElementById("a1UnitMasteryScratchNote")){
    const block=main.querySelector(".block .wrap");
    if(block){
      const note=document.createElement("p");
      note.id="a1UnitMasteryScratchNote";
      note.className="notice";
      note.innerHTML="<strong>Problem-solving workspace:</strong> the lined areas are ungraded scratch space for this browser session. They do not change the selected-response score or the 80% mastery gate.";
      block.prepend(note);
    }
  }
  return true;
}

function scheduleDecorate(){
  [0,80,240,650,1400].forEach(ms=>setTimeout(decorate,ms));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",scheduleDecorate,{once:true});
else scheduleDecorate();
window.addEventListener("load",decorate,{once:true});

document.addEventListener("click",event=>{
  const button=event.target.closest?.("#practiceRetry");
  if(!button)return;
  scratch={};
  try{sessionStorage.removeItem(storageKey())}catch{}
  setTimeout(()=>{scratch=readScratch();decorate()},0);
  setTimeout(decorate,120);
});

window.addEventListener("pagehide",()=>{
  document.querySelectorAll("[data-a1-unit-work]").forEach(area=>{scratch[area.dataset.a1UnitWork]=area.value});
  writeScratch(scratch);
});

window.KhaemenesAlgebra1UnitAssessmentWorkspace={
  version:"1.0.0",
  decorate,
  clearScratch(){
    scratch={};
    try{sessionStorage.removeItem(storageKey())}catch{}
    document.querySelectorAll("[data-a1-unit-work]").forEach(area=>{area.value=""});
  }
};
})();