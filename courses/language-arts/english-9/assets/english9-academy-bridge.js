(() => {
  "use strict";
  const RECORDS_KEY="khaemenes_english9_records_by_learner_v1";
  const CLAIM_KEY="khaemenes_english9_legacy_migration_claim_v1";
  const LEGACY_KEY="ELA9_36_WEEK_PORTAL_V2";
  const frame=document.getElementById("courseFrame");
  const status=document.getElementById("bridgeStatus");
  const identity=document.getElementById("bridgeIdentity");
  const badge=document.getElementById("bridgeBadge");
  const params=new URLSearchParams(location.search);
  const entry=String(params.get("entry")||"").trim();
  const readJSON=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
  const writeJSON=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  const rawLegacy=localStorage.getItem(LEGACY_KEY);
  const continuity=()=>window.KhaemenesHighContinuity?.getSummary?.()||{eligible:false,reason:"continuity-unavailable",learner:null,mentor:null};
  const ctx=continuity();
  const formal=Boolean(ctx.eligible&&ctx.learner?.grade==="grade-09");
  const advancedPreview=entry==="grade08-advanced-preview"||entry==="middle-advanced-preview";
  const anyPreview=!formal;

  function candidateFromLegacy(){
    const legacy=rawLegacy?(()=>{try{return JSON.parse(rawLegacy)}catch{return null}})():null;
    if(!legacy||!Array.isArray(legacy.students))return null;
    const candidates=legacy.students.filter(s=>s&&s.progress&& !["first student","demo student"].includes(String(s.name||"").trim().toLowerCase()));
    return candidates.length===1?candidates[0]:null;
  }

  function formalRecord(){
    if(!formal)return null;
    const id=ctx.learner.learnerId;
    const records=readJSON(RECORDS_KEY,{});
    if(records[id])return records[id];
    const claim=readJSON(CLAIM_KEY,null);
    const candidate=candidateFromLegacy();
    if(candidate&&(!claim||claim.learnerId===id)){
      const migrated={name:ctx.learner.nickname,progress:candidate.progress||{weeks:{},exams:{}},created:candidate.created||new Date().toISOString(),migratedAt:new Date().toISOString(),migration:{source:LEGACY_KEY,mode:"single-candidate-one-time-claim"}};
      records[id]=migrated;writeJSON(RECORDS_KEY,records);writeJSON(CLAIM_KEY,{learnerId:id,migratedAt:new Date().toISOString()});
      return migrated;
    }
    return {name:ctx.learner.nickname,progress:{weeks:{},exams:{}},created:new Date().toISOString()};
  }

  const record=formalRecord();
  if(formal){
    identity.innerHTML=`<strong>${ctx.learner.nickname} · English 9</strong><span>Archaemenes · Academy Scholar · formal Grade 09 course context</span>`;
    badge.textContent="Formal Grade 09";
    status.innerHTML="<strong>Academy-connected record.</strong> English 9 progress is stored by the active Grade 09 learner ID. The historical shared course key remains migration-only.";
  }else{
    const name=ctx.learner?.nickname||"Scholar";
    identity.innerHTML=`<strong>${name} · English 9 Preview</strong><span>Archaemenes · Academy Scholar · exploration context</span>`;
    badge.textContent=advancedPreview?"Grade 08 Advanced Preview":"Preview Only";
    status.innerHTML="<strong>Preview mode.</strong> You may explore lessons and practice, but this page does not write a formal English 9 record unless the Academy Family Registry reports High School · Grade 09.";
  }

  function restoreLegacy(){
    try{if(rawLegacy===null)localStorage.removeItem(LEGACY_KEY);else localStorage.setItem(LEGACY_KEY,rawLegacy)}catch{}
  }

  frame.addEventListener("load",()=>{
    const win=frame.contentWindow,doc=frame.contentDocument;
    if(!win||!doc)return;
    const config=formal?{
      mode:"formal",learnerId:ctx.learner.learnerId,nickname:ctx.learner.nickname,record
    }:{mode:"preview",learnerId:null,nickname:ctx.learner?.nickname||"Preview Scholar",record:null};
    win.__KHAEMENES_ENGLISH9_BRIDGE__=config;
    const script=doc.createElement("script");
    script.textContent=`(()=>{\n"use strict";\nconst cfg=window.__KHAEMENES_ENGLISH9_BRIDGE__||{mode:"preview",nickname:"Preview Scholar"};\nconst RECORDS_KEY="${RECORDS_KEY}";\nconst notice=document.createElement("div");notice.className="notice";notice.textContent=cfg.mode==="formal"?"Academy Family Profile active · formal Grade 09 learner-scoped record":"Preview mode · practice is temporary and does not alter formal Grade 09 records";\nconst box=document.querySelector(".studentBox");if(box){box.replaceChildren(notice);}\nconst student={id:cfg.mode==="formal"?cfg.learnerId:"preview",name:cfg.nickname||"Scholar",created:cfg.record?.created||new Date().toISOString(),progress:cfg.record?.progress||{weeks:{},exams:{}}};\nstate={students:[student],activeId:student.id};\nsaveState=function(){if(cfg.mode!=="formal")return;try{const raw=localStorage.getItem(RECORDS_KEY);const records=raw?JSON.parse(raw):{};records[cfg.learnerId]={name:cfg.nickname,created:student.created,progress:student.progress,updatedAt:new Date().toISOString()};localStorage.setItem(RECORDS_KEY,JSON.stringify(records));}catch{}};\naddStudent=function(){};addDemoStudent=function(){};deleteActiveStudent=function(){};\nrenderAll();\n})();`;
    doc.body.appendChild(script);
    restoreLegacy();
  },{once:true});

  // Protect the migration-only key from the legacy page's startup write.
  try{localStorage.setItem(LEGACY_KEY,JSON.stringify({students:[{id:"bridge_boot",name:"Bridge Boot",created:new Date().toISOString(),progress:{weeks:{},exams:{}}}],activeId:"bridge_boot"}))}catch{}
  frame.src="legacy.html";

  try{window.KhaemenesHighContinuity?.subscribe?.(()=>location.reload())}catch{}
})();