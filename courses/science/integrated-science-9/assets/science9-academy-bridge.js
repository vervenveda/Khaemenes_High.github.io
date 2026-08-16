(() => {
  "use strict";
  const RECORDS_KEY="khaemenes_science9_records_by_learner_v1";
  const CLAIM_KEY="khaemenes_science9_legacy_migration_claim_v1";
  const LEGACY_KEY="khae-grade09-integrated-science-portal-v1";
  const frame=document.getElementById("courseFrame");
  const status=document.getElementById("bridgeStatus");
  const identity=document.getElementById("bridgeIdentity");
  const badge=document.getElementById("bridgeBadge");
  const params=new URLSearchParams(location.search);
  const entry=String(params.get("entry")||"").trim();
  const readJSON=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
  const writeJSON=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  const rawLegacy=localStorage.getItem(LEGACY_KEY);
  const ctx=window.KhaemenesHighContinuity?.getSummary?.()||{eligible:false,learner:null,mentor:null};
  const formal=Boolean(ctx.eligible&&ctx.learner?.grade==="grade-09");
  const advancedPreview=entry==="grade08-advanced-preview"||entry==="middle-advanced-preview";

  function candidateFromLegacy(){
    const legacy=rawLegacy?(()=>{try{return JSON.parse(rawLegacy)}catch{return null}})():null;
    if(!legacy||!Array.isArray(legacy.students))return null;
    const candidates=legacy.students.filter(s=>s&& !["student 1","demo scientist"].includes(String(s.name||"").trim().toLowerCase()));
    return candidates.length===1?candidates[0]:null;
  }
  function normalizeRecord(src={}){
    return {
      name:String(src.name||ctx.learner?.nickname||"Science Scholar").slice(0,80),
      pathway:["Foundation","Core","Extended"].includes(src.pathway)?src.pathway:"Core",
      days:src.days&&typeof src.days==="object"?src.days:{},
      scores:src.scores&&typeof src.scores==="object"?src.scores:{},
      attempts:src.attempts&&typeof src.attempts==="object"?src.attempts:{},
      notes:src.notes&&typeof src.notes==="object"?src.notes:{},
      exit:src.exit&&typeof src.exit==="object"?src.exit:{},
      data:src.data&&typeof src.data==="object"?src.data:{},
      safety:src.safety&&typeof src.safety==="object"?src.safety:{},
      created:src.created||new Date().toISOString()
    };
  }
  function formalRecord(){
    if(!formal)return null;
    const id=ctx.learner.learnerId;
    const records=readJSON(RECORDS_KEY,{});
    if(records[id])return normalizeRecord(records[id]);
    const claim=readJSON(CLAIM_KEY,null);
    const candidate=candidateFromLegacy();
    if(candidate&&(!claim||claim.learnerId===id)){
      const migrated={...normalizeRecord(candidate),name:ctx.learner.nickname,migratedAt:new Date().toISOString(),migration:{source:LEGACY_KEY,mode:"single-candidate-one-time-claim"}};
      records[id]=migrated;writeJSON(RECORDS_KEY,records);writeJSON(CLAIM_KEY,{learnerId:id,migratedAt:new Date().toISOString()});return migrated;
    }
    return normalizeRecord({name:ctx.learner.nickname});
  }
  const record=formalRecord();
  if(formal){
    identity.innerHTML=`<strong>${ctx.learner.nickname} · Integrated Science 9</strong><span>Archaemenes · Academy Scholar · formal Grade 09 course context</span>`;
    badge.textContent="Formal Grade 09";
    status.innerHTML="<strong>Academy-connected science record.</strong> Course progress, pathway preference, notebook work, mastery checks, and safety evidence are stored under the active Grade 09 learner. Formal advancement requires 80% mastery at each required gate.";
  }else{
    const name=ctx.learner?.nickname||"Scholar";
    identity.innerHTML=`<strong>${name} · Integrated Science 9 Preview</strong><span>Archaemenes · Academy Scholar · exploration context</span>`;
    badge.textContent=advancedPreview?"Grade 08 Advanced Preview":"Preview Only";
    status.innerHTML="<strong>Preview mode.</strong> Lessons, simulations, and practice may be explored, but this page does not write a formal Science 9 record without formal High School · Grade 09 placement.";
  }
  function restoreLegacy(){try{if(rawLegacy===null)localStorage.removeItem(LEGACY_KEY);else localStorage.setItem(LEGACY_KEY,rawLegacy)}catch{}}
  frame.addEventListener("load",()=>{
    const win=frame.contentWindow,doc=frame.contentDocument;if(!win||!doc)return;
    win.__KHAEMENES_SCIENCE9_BRIDGE__=formal?{mode:"formal",learnerId:ctx.learner.learnerId,nickname:ctx.learner.nickname,record}:{mode:"preview",learnerId:null,nickname:ctx.learner?.nickname||"Preview Scholar",record:null};
    const script=doc.createElement("script");
    script.textContent=`(()=>{\n"use strict";\nconst cfg=window.__KHAEMENES_SCIENCE9_BRIDGE__||{mode:"preview",nickname:"Preview Scholar"};\nconst RECORDS_KEY="${RECORDS_KEY}";\nconst PASS=80;\nconst DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday"];\nconst FRIENDLY="You’re almost there. This activity opens when the earlier learning step is complete. Finish the current lesson or reach 80% mastery on the required check, then come back — your progress is saved.";\nconst r=cfg.record||{};\nconst student={id:cfg.mode==="formal"?cfg.learnerId:"preview",name:cfg.nickname||"Scholar",pathway:["Foundation","Core","Extended"].includes(r.pathway)?r.pathway:"Core",days:r.days||{},scores:r.scores||{},attempts:r.attempts||{},notes:r.notes||{},exit:r.exit||{},data:r.data||{},safety:r.safety||{},created:r.created||new Date().toISOString()};\nstate={students:[student],activeId:student.id,theme:state?.theme||"dark"};\nsave=function(){if(cfg.mode!=="formal")return;try{const raw=localStorage.getItem(RECORDS_KEY);const records=raw?JSON.parse(raw):{};records[cfg.learnerId]={name:cfg.nickname,pathway:student.pathway,days:student.days,scores:student.scores,attempts:student.attempts,notes:student.notes,exit:student.exit,data:student.data,safety:student.safety,created:student.created,updatedAt:new Date().toISOString()};localStorage.setItem(RECORDS_KEY,JSON.stringify(records));}catch{}};\nconst boxes=document.querySelectorAll(".sideBox");if(boxes[0]){const n=document.createElement("div");n.className="notice";n.textContent=cfg.mode==="formal"?"Academy Family Profile active · formal Grade 09 learner-scoped science record · 80% mastery progression":"Preview mode · practice is temporary and does not alter formal Grade 09 science records";boxes[0].replaceChildren(n);}\nfunction scoreFor(week){return Number(student.scores?.[week]||0);}\nfunction lessonsDone(week){const d=student.days?.[week]||{};return DAYS.every(day=>Boolean(d[day]));}\nfunction weekUnlocked(week){if(cfg.mode!=="formal")return true;if(week<=1)return true;return scoreFor(week-1)>=PASS;}\nfunction dayUnlocked(week,day){if(cfg.mode!=="formal")return true;if(!weekUnlocked(week))return false;const idx=DAYS.indexOf(day);if(idx<=0)return true;return DAYS.slice(0,idx).every(d=>Boolean(student.days?.[week]?.[d]));}\nfunction quizUnlocked(week){return cfg.mode!=="formal"||weekUnlocked(week)&&lessonsDone(week);}\nfunction remind(detail){alert(detail?`${FRIENDLY}\\n\\n${detail}`:FRIENDLY);}\nfunction labelLocked(el,detail){if(!el)return;el.setAttribute("aria-disabled","true");el.dataset.masteryLocked="true";el.title=detail||FRIENDLY;el.style.opacity=".58";}\nfunction applyGates(){\n  if(cfg.mode!=="formal")return;\n  document.querySelectorAll(".weekButton").forEach(btn=>{const week=Number(btn.dataset.week||btn.getAttribute("data-week")||0);if(week>1&&!weekUnlocked(week)){labelLocked(btn,`Week ${week} opens after Week ${week-1} reaches 80% mastery.`);}});\n  document.querySelectorAll("[data-day]").forEach(input=>{const day=input.dataset.day;const week=Number(window.selectedWeek||1);if(!dayUnlocked(week,day)){input.disabled=true;input.closest(".lesson")?.setAttribute("data-locked","true");input.closest(".lesson")?.setAttribute("title",`${day} opens after the earlier lesson is complete.`);}});\n  const week=Number(window.selectedWeek||1);const submit=document.querySelector("#submitPractice");if(submit&&!quizUnlocked(week)){labelLocked(submit,"The mastery check opens after all five lessons for this week are complete.");}\n  const next=document.querySelector('[data-open]');if(next){const w=Number(next.dataset.open||0);if(w>1&&!weekUnlocked(w))labelLocked(next,`Week ${w} opens after Week ${w-1} reaches 80% mastery.`);}\n  document.querySelectorAll('a[href*="assessments"],button[data-view="assessments"],.navBtn[data-view="assessments"],.tab[data-view="assessments"]').forEach(el=>{\n    const mastered=Array.from({length:18},(_,i)=>scoreFor(i+1)>=PASS).every(Boolean);\n    if(!mastered)labelLocked(el,"Cumulative assessments open when the required earlier mastery gates have been reached. The midyear checkpoint requires Weeks 1–18 at 80% or higher.");\n  });\n}\nconst priorRenderAll=renderAll;renderAll=function(){priorRenderAll();setTimeout(applyGates,0);};\nconst priorRenderWeek=renderWeek;renderWeek=function(){if(cfg.mode==="formal"&&!weekUnlocked(Number(window.selectedWeek||1))){remind(`Week ${window.selectedWeek||1} is still locked.`);window.selectedWeek=Math.max(1,Number(window.selectedWeek||1)-1);}priorRenderWeek();setTimeout(applyGates,0);};\nconst priorRenderWeeks=renderWeeks;renderWeeks=function(){priorRenderWeeks();setTimeout(applyGates,0);};\ndocument.addEventListener("click",event=>{const target=event.target.closest('[data-mastery-locked="true"]');if(!target)return;event.preventDefault();event.stopImmediatePropagation();remind(target.title||"");},true);\ndocument.addEventListener("click",event=>{const b=event.target.closest(".weekButton");if(!b||cfg.mode!=="formal")return;const week=Number(b.dataset.week||0);if(week&&!weekUnlocked(week)){event.preventDefault();event.stopImmediatePropagation();remind(`Week ${week} opens after Week ${week-1} reaches 80% mastery.`);}},true);\nconst priorSubmitSet=submitSet;submitSet=function(week){if(cfg.mode==="formal"&&!quizUnlocked(Number(week))){remind("Complete all five lessons before opening this week’s mastery check.");return;}const before=scoreFor(Number(week));priorSubmitSet(week);const after=scoreFor(Number(week));if(after>0&&after<PASS){setTimeout(()=>remind(`Your best mastery score for Week ${week} is ${after}%. Review the lesson evidence and reassess when ready. Week ${Number(week)+1} remains locked until you reach 80%.`),20);}else if(after>=PASS&&after>before){setTimeout(()=>alert(`Mastery reached: ${after}%. Week ${Number(week)+1} is now available.`),20);}};\nrenderAll();setTimeout(applyGates,0);\n})();`;
    doc.body.appendChild(script);restoreLegacy();
  },{once:true});
  try{localStorage.setItem(LEGACY_KEY,JSON.stringify({students:[{id:"bridge_boot",name:"Bridge Boot",pathway:"Core",days:{},scores:{},attempts:{},notes:{},exit:{},data:{},safety:{},created:new Date().toISOString()}],activeId:"bridge_boot",theme:"dark"}))}catch{}
  frame.src="legacy.html";
  try{window.KhaemenesHighContinuity?.subscribe?.(()=>location.reload())}catch{}
})();