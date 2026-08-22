(() => {
"use strict";
const cfg=window.GEO_ASSESSMENT_CONFIG||{};
const all=window.GEOMETRY_UNIT08_QUESTIONS;
const host=document.getElementById("assessmentRoot");
if(!host||!Array.isArray(all))return;
const KEY="khaemenes-geometry-assessment-records-v1";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}}
function save(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch{}}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function balancedSet(){
 const lessons=[...new Set(all.map(q=>q.lesson))].sort();
 const guaranteed=[];
 const remaining=[];
 lessons.forEach(id=>{
   const group=shuffle(all.filter(q=>q.lesson===id));
   if(group.length)guaranteed.push(group[0]);
   remaining.push(...group.slice(1));
 });
 const target=Math.min(Number(cfg.count)||12,all.length);
 return shuffle([...guaranteed,...shuffle(remaining).slice(0,Math.max(0,target-guaranteed.length))]);
}
let set=[];
function records(){return load()}
function best(){const arr=records()[cfg.recordKey]?.attempts||[];return arr.length?Math.max(...arr.map(x=>x.score)):null}
function start(){
 set=balancedSet();
 const token=`geo-u08-${Date.now()}`;
 host.innerHTML=`<article class="card"><div class="form-grid"><label>Learner name or initials<input id="assessmentLearner" maxlength="60" placeholder="Optional local label"></label><label>Pathway<select id="assessmentPathway"><option>Foundation</option><option selected>Core</option><option>Extended</option></select></label></div><p class="notice">${esc(cfg.instructions||"Answer every question. Submit once complete, review explanations, and correct missed work.")}</p><p><strong>Coverage:</strong> Every attempt includes at least one question from each of the eight Unit 08 lessons, plus additional mixed questions.</p></article>`+
 set.map((q,i)=>`<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend><div class="options">${q.options.map((o,j)=>`<label class="option"><input type="radio" name="${token}-q${i}" value="${j}"><span>${esc(o)}</span></label>`).join("")}</div><div class="feedback" id="${token}-fb${i}" hidden></div></fieldset></article>`).join("")+
 `<div class="assessment-result"><button class="btn primary" id="submitAssessment" type="button">Submit &amp; Score</button><button class="btn" id="printAssessment" type="button">Print</button><p id="assessmentMessage">Best saved score: ${best()==null?"—":best()+"%"}</p></div>`;
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
 const score=Math.round(right/set.length*100),data=records(),key=cfg.recordKey||"unit-08";
 data[key]=data[key]||{title:cfg.title||key,attempts:[]};
 data[key].attempts.push({date:new Date().toISOString(),score,right,total:set.length,missed,coverage:[...new Set(set.map(q=>q.lesson))],learner:document.getElementById("assessmentLearner").value.trim(),pathway:document.getElementById("assessmentPathway").value});
 save(data);
 document.getElementById("assessmentMessage").innerHTML=`<span class="score">${score}%</span> · ${right}/${set.length} · Best ${Math.max(...data[key].attempts.map(x=>x.score))}%`;
 document.getElementById("submitAssessment").disabled=true;
}
document.getElementById("startAssessment")?.addEventListener("click",start);
document.getElementById("resetAssessment")?.addEventListener("click",()=>{if(confirm("Start a new attempt?"))start()});
start();
})();