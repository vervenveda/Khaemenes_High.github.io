(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;
  const RECORDS_KEY="khaemenes_pre_algebra_records_by_learner_v1";
  const PREVIEW_KEY="khaemenes_pre_algebra_preview_v1";
  const LEGACY_KEY="KHAE_OPEN_PREALGEBRA_FORGE_V2";
  function read(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
  function context(){return window.KhaemenesHighContinuity?.getSummary?.()||{eligible:false,learner:null}}
  function boot(){
    const ctx=context(),formal=Boolean(ctx.eligible&&ctx.learner?.grade==="grade-09"),learner=formal?ctx.learner:null;
    document.getElementById("bridgeBadge").textContent=formal?"Formal Grade 09":"Preview / Practice";
    document.getElementById("bridgeStatus").textContent=formal?`Connected to ${learner.nickname||"Grade 09 Scholar"}. Pre-Algebra evidence is learner-scoped. Family Registry remains placement authority.`:"Preview mode. Practice here does not create formal Grade 09 mastery or placement.";
    frame.src="legacy.html";
    frame.addEventListener("load",()=>{
      const doc=frame.contentDocument;if(!doc)return;
      setTimeout(()=>{
        const script=doc.createElement("script");
        const lid=formal?JSON.stringify(learner.learnerId):"null";
        const nick=formal?JSON.stringify(learner.nickname||"Grade 09 Scholar"):JSON.stringify("Preview Scholar");
        script.textContent=`(()=>{
"use strict";
const FORMAL=${formal?"true":"false"}, LEARNER_ID=${lid}, NICKNAME=${nick};
const RECORDS_KEY="${RECORDS_KEY}",PREVIEW_KEY="${PREVIEW_KEY}",LEGACY_KEY="${LEGACY_KEY}";
const readJSON=(k,f)=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}},writeJSON=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const fresh=()=>({version:3,activeId:"academy",students:[{id:"academy",name:NICKNAME,created:new Date().toISOString(),progress:{weeks:{},exams:{},capstone:{},reviewLog:[]}}]});
let scoped;
if(FORMAL){const all=readJSON(RECORDS_KEY,{});scoped=all[LEARNER_ID]||fresh();all[LEARNER_ID]=scoped;writeJSON(RECORDS_KEY,all);}else scoped=readJSON(PREVIEW_KEY,fresh());
state=scoped;
state.activeId="academy";
if(!Array.isArray(state.students)||!state.students.length)state.students=fresh().students;
state.students=[state.students.find(s=>s.id==="academy")||state.students[0]];
state.students[0].id="academy";state.students[0].name=NICKNAME;state.activeId="academy";ensure(state.students[0]);
function persistScoped(){
  if(FORMAL){const all=readJSON(RECORDS_KEY,{});all[LEARNER_ID]=state;writeJSON(RECORDS_KEY,all)}else writeJSON(PREVIEW_KEY,state);
}
const originalSave=save;
save=function(){persistScoped();try{renderStudentSelect()}catch{}};
try{localStorage.removeItem(LEGACY_KEY)}catch{}
const hideLegacyAuthority=()=>{
  const sel=document.getElementById("studentSelect");if(sel){sel.innerHTML='<option value="academy">'+NICKNAME.replace(/[&<>"']/g,"")+"</option>";sel.disabled=true}
  ["addStudent","deleteStudent","demoStudent"].forEach(id=>{const el=document.getElementById(id);if(el)el.hidden=true});
};
const originalRender=render;
render=function(){originalRender();hideLegacyAuthority();};
render();persistScoped();
window.__KHAEMENES_PREALGEBRA__={mode:FORMAL?"formal":"preview",learnerId:LEARNER_ID,persistScoped};
})();`;
        doc.body.appendChild(script);
      },40);
    },{once:true});
  }
  boot();
})();