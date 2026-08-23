(() => {
"use strict";
const cfg=window.GEO_ASSESSMENT_CONFIG||{};
const diagnostic=cfg.source==="diagnostic";
const all=diagnostic?window.GEOMETRY_DIAGNOSTIC:window.GEOMETRY_QUESTIONS;
const host=document.getElementById("assessmentRoot");
if(!host||!Array.isArray(all))return;
const KEY="khaemenes-geometry-assessment-records-v1";
const MASTERY_TARGET=diagnostic?null:Number(cfg.masteryTarget??80);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}}
function save(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch{}}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function pool(){
 let p=[...all];
 if(Array.isArray(cfg.units)&&cfg.units.length)p=p.filter(q=>cfg.units.includes(q.unit));
 return p;
}
function balancedSet(){
 const p=pool(),requested=Math.min(Number(cfg.count)||10,p.length);
 if(requested>=p.length)return shuffle(p);
 const units=Array.isArray(cfg.units)&&cfg.units.length?[...cfg.units]:[];
 if(diagnostic||units.length<2)return shuffle(p).slice(0,requested);
 const base=Math.floor(requested/units.length),extra=requested%units.length;
 let selected=[];
 units.forEach((unit,index)=>{
  const unitPool=shuffle(p.filter(q=>q.unit===unit));
  const quota=base+(index<extra?1:0);
  selected.push(...unitPool.slice(0,Math.min(quota,unitPool.length)));
 });
 if(selected.length<requested){
  const used=new Set(selected.map(q=>q.id));
  selected.push(...shuffle(p.filter(q=>!used.has(q.id))).slice(0,requested-selected.length));
 }
 return shuffle(selected).slice(0,requested);
}
let set=[];
function records(){return load()}
function attempts(){return records()[cfg.recordKey]?.attempts||[]}
function best(){const arr=attempts();return arr.length?Math.max(...arr.map(x=>Number(x.score)||0)):null}
function bestMastered(){return MASTERY_TARGET==null?null:attempts().some(x=>Number(x.score)>=MASTERY_TARGET)}
function statusText(score){
 if(MASTERY_TARGET==null)return "Diagnostic evidence recorded. Use the result to guide placement and review; it does not gate course credit.";
 return score>=MASTERY_TARGET?`Mastery demonstrated at or above ${MASTERY_TARGET}%.`:`Below ${MASTERY_TARGET}% mastery. Review explanations, complete corrections, and retake with a fresh set.`;
}
function start(){
 set=balancedSet();
 const token=`geo-${Date.now()}`;
 const priorBest=best(),priorMastered=bestMastered();
 const savedStatus=priorBest==null?"No saved attempt yet.":MASTERY_TARGET==null?`Best saved score: ${priorBest}%`:`Best saved score: ${priorBest}% · ${priorMastered?"Mastery demonstrated":"Mastery not yet demonstrated"}`;
 host.innerHTML=`<article class="card"><div class="form-grid"><label>Learner name or initials<input id="assessmentLearner" maxlength="60" placeholder="Optional local label"></label><label>Pathway<select id="assessmentPathway"><option>Foundation</option><option selected>Core</option><option>Extended</option></select></label></div><p class="notice">${esc(cfg.instructions||"Answer every question. Submit once complete, review explanations, and correct missed work.")}</p>${MASTERY_TARGET==null?"":`<p class="notice"><strong>Mastery target:</strong> ${MASTERY_TARGET}%. A lower score remains useful evidence but does not count as demonstrated mastery until a later attempt reaches the target.</p>`}</article>`+
 set.map((q,i)=>`<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend><div class="options">${q.options.map((o,j)=>`<label class="option"><input type="radio" name="${token}-q${i}" value="${j}"><span>${esc(o)}</span></label>`).join("")}</div><div class="feedback" id="${token}-fb${i}" hidden></div></fieldset></article>`).join("")+
 `<div class="assessment-result"><button class="btn primary" id="submitAssessment" type="button">Submit &amp; Score</button><button class="btn" id="printAssessment" type="button">Print</button><p id="assessmentMessage">${esc(savedStatus)}</p></div>`;
 document.getElementById("submitAssessment").addEventListener("click",()=>score(token));
 document.getElementById("printAssessment").addEventListener("click",()=>print());
}
function score(token){
 let right=0,complete=true,missed=[];
 set.forEach((q,i)=>{
  const selected=document.querySelector(`input[name="${token}-q${i}"]:checked`);
  const fb=document.getElementById(`${token}-fb${i}`);fb.hidden=false;
  if(!selected){complete=false;fb.className="feedback bad";fb.textContent="Choose an answer.";return}
  const ok=Number(selected.value)===q.answer;if(ok)right++;else missed.push(q.id);
  fb.className=`feedback ${ok?"good":"bad"}`;
  fb.textContent=`${ok?"Correct.":"Review."} ${q.explanation}`;
 });
 if(!complete){document.getElementById("assessmentMessage").textContent="Answer every question before scoring.";return}
 const score=Math.round(right/set.length*100),data=records(),key=cfg.recordKey||"assessment";
 data[key]=data[key]||{title:cfg.title||key,attempts:[]};
 data[key].title=cfg.title||data[key].title||key;
 data[key].masteryTarget=MASTERY_TARGET;
 data[key].attempts.push({date:new Date().toISOString(),score,right,total:set.length,missed,learner:document.getElementById("assessmentLearner").value.trim(),pathway:document.getElementById("assessmentPathway").value,mastered:MASTERY_TARGET==null?null:score>=MASTERY_TARGET,questionIds:set.map(q=>q.id),unitCoverage:[...new Set(set.map(q=>q.unit))].sort((a,b)=>a-b)});
 data[key].bestScore=Math.max(...data[key].attempts.map(x=>Number(x.score)||0));
 data[key].mastery=MASTERY_TARGET==null?null:data[key].bestScore>=MASTERY_TARGET;
 save(data);
 const message=document.getElementById("assessmentMessage");
 message.textContent="";
 const scoreSpan=document.createElement("span");scoreSpan.className="score";scoreSpan.textContent=`${score}%`;
 message.append(scoreSpan,document.createTextNode(` · ${right}/${set.length} · Best ${data[key].bestScore}% · ${statusText(score)}`));
 document.getElementById("submitAssessment").disabled=true;
}
document.getElementById("startAssessment")?.addEventListener("click",start);
document.getElementById("resetAssessment")?.addEventListener("click",()=>{if(confirm("Start a new attempt? Saved score history and best mastery evidence will be preserved."))start()});
start();
})();