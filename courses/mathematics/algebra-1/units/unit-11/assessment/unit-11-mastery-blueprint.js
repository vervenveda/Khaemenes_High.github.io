/* Unit 11 blueprint mastery override.
   Add this script after ../../assets/unit-page.js on Unit 11 mastery-check.html.
   It replaces the random 20-item set with guaranteed lesson coverage.
*/
(()=>{
"use strict";
function ready(fn){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(fn,0));else setTimeout(fn,0)}
ready(()=>{
 const R=window.PAGE_REF||{}, Q=window.ALGEBRA1_QUESTIONS||[], bp=window.ALGEBRA1_UNIT11_BLUEPRINT;
 if(Number(R.unit)!==11||R.type!=="mastery"||!bp)return;
 const main=document.querySelector("#main"); if(!main)return;
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const chosen=[];
 bp.mastery.forEach(spec=>{
   const pool=Q.filter(q=>q.unit===11&&q.lesson===spec.lesson);
   // Favor Core/Extended while still sampling the full lesson.
   const ranked=shuffle(pool.filter(q=>q.difficulty>=2)).concat(shuffle(pool.filter(q=>q.difficulty===1)));
   chosen.push(...ranked.slice(0,spec.count));
 });
 const items=shuffle(chosen);
 const qhtml=items.map((q,i)=>`<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend><div class="options">${shuffle(q.options.map((o,j)=>({o,j}))).map(x=>`<label class="option"><input type="radio" name="u11m${i}" value="${x.j}"><span>${esc(x.o)}</span></label>`).join("")}</div><div class="feedback" id="u11mfb${i}" hidden></div></fieldset></article>`).join("");
 main.innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 11 · Formal record</p><h1>Mastery Check</h1><p class="lead">20 blueprint-balanced questions · every Unit 11 lesson represented · 80% target</p><div class="actions no-print"><a class="btn" href="../../">Course Home</a><a class="btn" href="../">Unit Home</a><button class="btn" onclick="print()">Print</button></div></div></section><section class="block"><div class="wrap practice-layout"><article class="card"><div id="questions">${qhtml}</div><div class="actions"><button class="btn primary" id="u11Score">Submit & Score</button><button class="btn" id="u11Reset">Reset</button></div><p id="u11ScoreMsg"></p></article><aside class="card practice-side"><h3>Coverage blueprint</h3><p>Lessons 1–3: 3 items each · Lessons 4–5: 4 items each · Lesson 6: 3 items.</p><p>Preserve result, corrections, and representative work.</p></aside></div></section>`;
 document.querySelector("#u11Score").onclick=()=>{
   let c=0,all=true;
   items.forEach((q,i)=>{
     const s=document.querySelector(`input[name=u11m${i}]:checked`),f=document.querySelector(`#u11mfb${i}`);
     f.hidden=false;
     if(!s){all=false;f.className="feedback bad";f.textContent="Choose an answer.";return}
     const ok=Number(s.value)===q.answer;if(ok)c++;
     f.className=`feedback ${ok?"good":"bad"}`;f.textContent=`${ok?"Correct.":"Review."} ${q.explanation}`;
   });
   if(!all){document.querySelector("#u11ScoreMsg").textContent="Answer every item.";return}
   const pct=Math.round(c/items.length*100);
   // Same authoritative Unit 11 record key used by the existing engine.
   const key="khaemenes-algebra1-unit11-progress-v1";
   let p={pathway:"Core",completed:[],scores:{},reflections:{}};
   try{p=JSON.parse(localStorage.getItem(key))||p}catch{}
   p.scores=p.scores||{};p.completed=p.completed||[];
   p.scores.mastery=Math.max(p.scores.mastery||0,pct);
   if(pct>=80&&!p.completed.includes("mastery"))p.completed.push("mastery");
   localStorage.setItem(key,JSON.stringify(p));
   document.querySelector("#u11ScoreMsg").innerHTML=`<span class="score">${pct}%</span> · ${c}/${items.length} correct · Best score saved.`;
 };
 document.querySelector("#u11Reset").onclick=()=>{
   main.querySelectorAll('input[type="radio"]').forEach(x=>x.checked=false);
   main.querySelectorAll(".feedback").forEach(x=>x.hidden=true);
   document.querySelector("#u11ScoreMsg").textContent="";
 };
});
})();