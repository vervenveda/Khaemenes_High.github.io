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
    const candidates=legacy.students.filter(s=>s&&!["student 1","demo scientist"].includes(String(s.name||"").trim().toLowerCase()));
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
      cumulative:src.cumulative&&typeof src.cumulative==="object"?src.cumulative:{},
      created:src.created||new Date().toISOString()
    };
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
    identity.innerHTML="<strong>"+(ctx.learner.nickname||"Grade 09 Scholar")+" · Integrated Science 9</strong><span>Archaemenes · Academy Scholar · formal Grade 09 course context</span>";
    badge.textContent="Formal Grade 09";
    status.innerHTML="<strong>Academy-connected science record.</strong> Course progress, pathway preference, notebook work, mastery checks, safety evidence, and learner-attributed cumulative evidence are stored under the active Grade 09 learner. Formal advancement requires 80% mastery at each required gate.";
  }else{
    const name=ctx.learner?.nickname||"Scholar";
    identity.innerHTML="<strong>"+name+" · Integrated Science 9 Preview</strong><span>Archaemenes · Academy Scholar · exploration context</span>";
    badge.textContent=advancedPreview?"Grade 08 Advanced Preview":"Preview Only";
    status.innerHTML="<strong>Preview mode.</strong> Lessons, simulations, and practice may be explored, but this page does not write a formal Science 9 record without formal High School · Grade 09 placement.";
  }

  function restoreLegacy(){try{if(rawLegacy===null)localStorage.removeItem(LEGACY_KEY);else localStorage.setItem(LEGACY_KEY,rawLegacy)}catch{}}
  frame.addEventListener("load",()=>{
    const win=frame.contentWindow,doc=frame.contentDocument;if(!win||!doc)return;
    win.__KHAEMENES_SCIENCE9_BRIDGE__=formal?{mode:"formal",learnerId:ctx.learner.learnerId,nickname:ctx.learner.nickname,record}:{mode:"preview",learnerId:null,nickname:ctx.learner?.nickname||"Preview Scholar",record:null};
    const script=doc.createElement("script");
    script.src="assets/science9-bridge-runtime.js";
    script.defer=false;
    doc.body.appendChild(script);
    restoreLegacy();
  },{once:true});

  try{localStorage.setItem(LEGACY_KEY,JSON.stringify({students:[{id:"bridge_boot",name:"Bridge Boot",pathway:"Core",days:{},scores:{},attempts:{},notes:{},exit:{},data:{},safety:{},cumulative:{},created:new Date().toISOString()}],activeId:"bridge_boot",theme:"dark"}))}catch{}
  frame.src="legacy.html";
  try{window.KhaemenesHighContinuity?.subscribe?.(()=>location.reload())}catch{}
})();