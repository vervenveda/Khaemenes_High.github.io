(() => {
  "use strict";
  const RECORDS_KEY="khaemenes_globalstudies9_records_by_learner_v1";
  const CLAIM_KEY="khaemenes_globalstudies9_legacy_migration_claim_v1";
  const LEGACY_KEY="KHAE_SS9_ATLAS_ARCHIVE_PORTAL_V1";
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
    const candidates=legacy.students.filter(s=>s&&s.progress&&!["first student","demo student"].includes(String(s.name||"").trim().toLowerCase()));
    return candidates.length===1?candidates[0]:null;
  }
  function normalizeRecord(src={}){
    return {name:String(src.name||ctx.learner?.nickname||"Global Studies Scholar").slice(0,80),created:src.created||new Date().toISOString(),progress:src.progress&&typeof src.progress==="object"?src.progress:{weeks:{},exams:{},capstone:{logs:[]}}};
  }
  function formalRecord(){
    if(!formal)return null;
    const id=ctx.learner.learnerId,records=readJSON(RECORDS_KEY,{});
    if(records[id])return normalizeRecord(records[id]);
    const claim=readJSON(CLAIM_KEY,null),candidate=candidateFromLegacy();
    if(candidate&&(!claim||claim.learnerId===id)){
      const migrated={...normalizeRecord(candidate),name:ctx.learner.nickname,migratedAt:new Date().toISOString(),migration:{source:LEGACY_KEY,mode:"single-candidate-one-time-claim"}};
      records[id]=migrated;writeJSON(RECORDS_KEY,records);writeJSON(CLAIM_KEY,{learnerId:id,migratedAt:new Date().toISOString()});return migrated;
    }
    return normalizeRecord({name:ctx.learner.nickname});
  }

  const record=formalRecord();
  if(formal){
    identity.innerHTML="<strong>"+(ctx.learner.nickname||"Grade 09 Scholar")+" · Global Studies Honors 9</strong><span>Archaemenes · Academy Scholar · formal Grade 09 course context</span>";
    badge.textContent="Formal Grade 09";
    status.innerHTML="<strong>Academy-connected honors record.</strong> Formal progression uses 80% mastery. Complete each week's learning and three evidence assignments, reach 80% on the mastery check, and the next week opens. Semester II also requires an 80% midterm.";
  }else{
    const name=ctx.learner?.nickname||"Scholar";
    identity.innerHTML="<strong>"+name+" · Global Studies Honors 9 Preview</strong><span>Archaemenes · Academy Scholar · exploration context</span>";
    badge.textContent=advancedPreview?"Grade 08 Advanced Preview":"Preview Only";
    status.innerHTML="<strong>Preview mode.</strong> You may explore the atlas, lessons, sources, and practice without creating formal Grade 09 mastery or unlock state.";
  }

  function restoreLegacy(){try{if(rawLegacy===null)localStorage.removeItem(LEGACY_KEY);else localStorage.setItem(LEGACY_KEY,rawLegacy)}catch{}}
  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument,win=frame.contentWindow;if(!doc||!win)return;
    win.__KHAEMENES_GLOBAL9_BRIDGE__=formal?{mode:"formal",learnerId:ctx.learner.learnerId,nickname:ctx.learner.nickname,record}:{mode:"preview",learnerId:null,nickname:ctx.learner?.nickname||"Preview Scholar",record:null};
    const script=doc.createElement("script");
    script.src="assets/global9-bridge-runtime.js";
    script.async=false;
    doc.body.appendChild(script);
    restoreLegacy();
  },{once:true});
  try{localStorage.setItem(LEGACY_KEY,JSON.stringify({students:[{id:"bridge_boot",name:"Bridge Boot",created:new Date().toISOString(),progress:{weeks:{},exams:{},capstone:{logs:[]}}}],activeId:"bridge_boot"}))}catch{}
  frame.src="legacy.html";
  try{window.KhaemenesHighContinuity?.subscribe?.(()=>location.reload())}catch{}
})();