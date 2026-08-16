(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;
  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument;if(!doc)return;
    window.setTimeout(()=>{
      const script=doc.createElement("script");
      script.textContent=`(()=>{
"use strict";
const cfg=window.__KHAEMENES_SCIENCE9_BRIDGE__||{};
const RECORDS_KEY="khaemenes_science9_records_by_learner_v1";
const CLAIMS_KEY="khaemenes_science9_cumulative_claims_v1";
const MAP=[
  {id:"units01_04",label:"Units 01–04",key:"khaemenes_science_units01_04_benchmark_v1",after:12},
  {id:"units05_07",label:"Units 05–07",key:"khaemenes_science_units05_07_benchmark_v1",after:21},
  {id:"units08_09",label:"Units 08–09",key:"khaemenes_science_units08_09_benchmark_v1",after:27},
  {id:"final",label:"Comprehensive Final",key:"khaemenes_science9_final_exam_v1",after:36}
];
function readJSON(key,fallback=null){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
function rawEvidence(m){
  const raw=readJSON(m.key,null),o=raw?.objective;
  if(!o?.submittedAt||!Number.isFinite(Number(o.score))||!Number.isFinite(Number(o.total))||Number(o.total)<=0)return null;
  const pct=Math.round(Number(o.score)/Number(o.total)*1000)/10;
  return {label:m.label,score:Number(o.score),total:Number(o.total),percent:pct,passed:pct>=80,attempts:Number(o.attempts)||0,submittedAt:o.submittedAt,sourceKey:m.key};
}
function learnerClaims(){
  if(cfg.mode!=="formal"||!cfg.learnerId)return {};
  const all=readJSON(CLAIMS_KEY,{});return all[cfg.learnerId]||{};
}
function claimMatches(id,e){
  const c=learnerClaims()[id];
  return Boolean(c&&e&&c.submittedAt===e.submittedAt&&Number(c.score)===Number(e.score)&&Number(c.total)===Number(e.total));
}
function claimedEvidence(){
  const out={};
  if(cfg.mode!=="formal"||!cfg.learnerId)return out;
  for(const m of MAP){const e=rawEvidence(m);if(e&&claimMatches(m.id,e))out[m.id]=e;}
  return out;
}
function claimLatest(id){
  if(cfg.mode!=="formal"||!cfg.learnerId)return false;
  const m=MAP.find(x=>x.id===id),e=m&&rawEvidence(m);if(!m||!e)return false;
  const learnerName=cfg.nickname||"the active Grade 09 learner";
  if(!confirm(`Attribute the latest ${m.label} result (${e.percent}%) to ${learnerName}?\n\nOnly continue if this learner completed that assessment. This prevents one learner's browser-local score from being silently attached to another learner.`))return false;
  const all=readJSON(CLAIMS_KEY,{});all[cfg.learnerId]={...(all[cfg.learnerId]||{}),[id]:{submittedAt:e.submittedAt,score:e.score,total:e.total,claimedAt:new Date().toISOString(),sourceKey:e.sourceKey}};
  writeJSON(CLAIMS_KEY,all);mergeFormal(claimedEvidence());
  if(typeof renderAssessments==="function")renderAssessments();
  return true;
}
function mergeFormal(cumulative){
  if(cfg.mode!=="formal"||!cfg.learnerId)return;
  const records=readJSON(RECORDS_KEY,{}),rec=records[cfg.learnerId];if(!rec)return;
  rec.cumulative={...(rec.cumulative||{}),...cumulative};rec.updatedAt=new Date().toISOString();records[cfg.learnerId]=rec;writeJSON(RECORDS_KEY,records);
}
function sync(){
  const cumulative=claimedEvidence();
  if(typeof active==="function"){const s=active();s.cumulative={...(s.cumulative||{}),...cumulative};}
  mergeFormal(cumulative);return cumulative;
}
const priorSave=typeof save==="function"?save:null;
if(priorSave){save=function(){priorSave();mergeFormal(claimedEvidence());};}
const priorAssess=typeof renderAssessments==="function"?renderAssessments:null;
if(priorAssess){
  renderAssessments=function(){
    sync();priorAssess();
    const s=active(),c=s.cumulative||{},cards=Array.from(document.querySelectorAll("#content .card"));
    const mapping=[
      ["Units 01–04 Cumulative Test","units01_04"],
      ["Units 05–07 Cumulative Test","units05_07"],
      ["Units 08–09 Cumulative Test","units08_09"],
      ["Comprehensive Final Examination","final"]
    ];
    for(const [heading,id] of mapping){
      const card=cards.find(x=>x.querySelector("h3")?.textContent.trim()===heading);if(!card)continue;
      const e=c[id],latest=rawEvidence(MAP.find(x=>x.id===id));
      const status=document.createElement("div");status.className="notice";
      if(e){
        status.textContent=`Learner-attributed objective evidence: ${e.percent}% · ${e.passed?"80% mastery reached":"mastery not yet reached"} · ${e.attempts} attempt(s).`;
      }else if(latest&&cfg.mode==="formal"){
        const p=document.createElement("p");p.textContent=`An unattributed browser-local result is present (${latest.percent}%). It is not part of this learner's formal record until you explicitly confirm who completed it.`;status.appendChild(p);
        const b=document.createElement("button");b.type="button";b.className="secondary";b.textContent=`Attribute latest result to ${cfg.nickname||"active learner"}`;b.onclick=()=>claimLatest(id);status.appendChild(b);
      }else if(latest){
        status.textContent="A browser-local assessment result exists, but preview mode cannot attach it to a formal learner record.";
      }else{
        status.textContent="No learner-attributed submitted objective score is available yet.";
      }
      card.appendChild(status);
    }
    const mid=cards.find(x=>x.querySelector("h3")?.textContent.includes("Midterm Practical"));
    if(mid){const p=document.createElement("p");p.className="notice";p.textContent="Midterm evidence is not auto-scored here because the current repository does not expose a dedicated midterm record. Do not invent or infer a score; Academy/adult verification is still required.";mid.appendChild(p)}
  };
}
window.__KHAEMENES_SCIENCE9_CUMULATIVE__={sync,claimLatest,claimedEvidence};
sync();
})();`;
      doc.body.appendChild(script);
    },180);
  });
})();