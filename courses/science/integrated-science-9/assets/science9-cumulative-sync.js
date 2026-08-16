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
const MAP=[
  {id:"units01_04",label:"Units 01–04",key:"khaemenes_science_units01_04_benchmark_v1",after:12},
  {id:"units05_07",label:"Units 05–07",key:"khaemenes_science_units05_07_benchmark_v1",after:21},
  {id:"units08_09",label:"Units 08–09",key:"khaemenes_science_units08_09_benchmark_v1",after:27},
  {id:"final",label:"Comprehensive Final",key:"khaemenes_science9_final_exam_v1",after:36}
];
function readJSON(key,fallback=null){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
function evidence(){
  const out={};
  for(const m of MAP){
    const raw=readJSON(m.key,null),o=raw?.objective;
    if(!o?.submittedAt||!Number.isFinite(Number(o.score))||!Number.isFinite(Number(o.total))||Number(o.total)<=0)continue;
    const pct=Math.round(Number(o.score)/Number(o.total)*1000)/10;
    out[m.id]={label:m.label,score:Number(o.score),total:Number(o.total),percent:pct,passed:pct>=80,attempts:Number(o.attempts)||0,submittedAt:o.submittedAt,sourceKey:m.key};
  }
  return out;
}
function mergeFormal(cumulative){
  if(cfg.mode!=="formal"||!cfg.learnerId)return;
  const records=readJSON(RECORDS_KEY,{}),rec=records[cfg.learnerId];
  if(!rec)return;
  rec.cumulative={...(rec.cumulative||{}),...cumulative};
  rec.updatedAt=new Date().toISOString();
  records[cfg.learnerId]=rec;
  try{localStorage.setItem(RECORDS_KEY,JSON.stringify(records))}catch{}
}
function sync(){
  const cumulative=evidence();
  if(typeof active==="function"){
    const s=active();
    s.cumulative={...(s.cumulative||{}),...cumulative};
  }
  mergeFormal(cumulative);
  return cumulative;
}
const priorSave=typeof save==="function"?save:null;
if(priorSave){
  save=function(){
    priorSave();
    const cumulative=evidence();
    if(cfg.mode==="formal"&&cfg.learnerId){
      const records=readJSON(RECORDS_KEY,{}),rec=records[cfg.learnerId];
      if(rec){rec.cumulative={...(rec.cumulative||{}),...cumulative};records[cfg.learnerId]=rec;try{localStorage.setItem(RECORDS_KEY,JSON.stringify(records))}catch{}}
    }
  };
}
const priorAssess=typeof renderAssessments==="function"?renderAssessments:null;
if(priorAssess){
  renderAssessments=function(){
    sync();
    priorAssess();
    const s=active(),c=s.cumulative||{};
    const cards=Array.from(document.querySelectorAll("#content .card"));
    const mapping=[
      ["Units 01–04 Cumulative Test","units01_04"],
      ["Units 05–07 Cumulative Test","units05_07"],
      ["Units 08–09 Cumulative Test","units08_09"],
      ["Comprehensive Final Examination","final"]
    ];
    for(const [heading,id] of mapping){
      const card=cards.find(x=>x.querySelector("h3")?.textContent.trim()===heading);if(!card)continue;
      const e=c[id];
      const status=document.createElement("p");status.className="notice";
      status.textContent=e?`Recorded objective evidence: ${e.percent}% · ${e.passed?"80% mastery reached":"mastery not yet reached"} · ${e.attempts} attempt(s).`:`No submitted objective score has been synchronized for this learner yet.`;
      card.appendChild(status);
    }
    const mid=cards.find(x=>x.querySelector("h3")?.textContent.includes("Midterm Practical"));
    if(mid){const p=document.createElement("p");p.className="notice";p.textContent="Midterm evidence is not auto-scored here because the current repository does not expose a dedicated midterm record. Do not invent or infer a score; Academy/adult verification is still required.";mid.appendChild(p)}
  };
}
sync();
})();`;
      doc.body.appendChild(script);
    },180);
  });
})();