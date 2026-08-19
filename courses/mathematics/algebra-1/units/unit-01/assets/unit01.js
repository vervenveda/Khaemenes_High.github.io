(()=>{"use strict";
const D=window.KHAE_UNIT01,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY="khaemenes-algebra1-unit01-a3-v1";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{"attempts":[],"best":{}}')}catch{return{attempts:[],best:{}}}}
function save(r){try{localStorage.setItem(KEY,JSON.stringify(r))}catch{}}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function archHref(extra={}){
 const q=new URLSearchParams({course:"Algebra I",unit:"Unit 01 — The Language of Mathematical Truth",...extra});
 return "https://artist1970.github.io/Archaemenes.github.io/high/?"+q.toString()
}
function qhtml(items){return items.map((q,i)=>`<div class="question"><strong>${i+1}. ${esc(q.prompt)}</strong>${q.options.map((o,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}"> ${esc(o)}</label>`).join("")}<div id="f${i}" class="feedback" hidden></div></div>`).join("")}
function bind(items,key){
 $("#score")?.addEventListener("click",()=>{
   let c=0,done=true;
   items.forEach((q,i)=>{
     let a=document.querySelector(`input[name=q${i}]:checked`),f=$(`#f${i}`);
     f.hidden=false;
     if(!a){done=false;f.className="feedback bad";f.textContent="Choose an answer.";return}
     let ok=+a.value===q.answer;c+=ok;
     f.className="feedback "+(ok?"good":"bad");
     f.textContent=(ok?"Correct. ":"Review. ")+q.explanation
   });
   if(!done){$("#result").textContent="Answer every item before scoring.";return}
   let pct=Math.round(100*c/items.length),r=load();
   r.attempts.push({key,score:pct,correct:c,total:items.length,at:new Date().toISOString(),items:items.map(q=>q.id)});
   r.best[key]=Math.max(r.best[key]||0,pct);save(r);
   $("#result").innerHTML=`<strong>${pct}%</strong> · ${c}/${items.length} correct · Best: ${r.best[key]}%${key==="mastery"?(pct>=80?" · Mastery demonstrated":" · Target: 80%"):""}`
 })
}
function lesson(n){
 let l=D.lessons[n-1],items=D.questions.filter(q=>q.lesson===n);
 $("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 01 · Lesson ${String(n).padStart(2,"0")}</p><h1>${esc(l.title)}</h1><p class="lead">${esc(D.unit.essential)}</p><div class="nav"><a class="btn" href="../index.html">Unit Home</a><a class="btn" href="../../../index.html">Course Home</a><a class="btn" href="${archHref({lesson:l.title})}">Ask Arch</a><button class="btn" onclick="print()">Print</button></div></div></section>
 <section class="block"><div class="wrap grid">
 <article class="card movement"><p class="eyebrow">1 · Mystery</p><h2>Notice before naming</h2><p>${esc(l.mystery)}</p><details><summary>Reveal after you reason</summary><p>${esc(l.mystery_answer)}</p></details></article>
 <article class="card"><p class="eyebrow">2 · Discover</p><h2>What structure do you notice?</h2><p>Write a prediction, identify the quantities or statements involved, and name one feature that must stay true.</p><textarea aria-label="Discovery notes"></textarea></article>
 <article class="card full"><p class="eyebrow">3 · Learn</p><h2>Objectives</h2><ul>${l.objectives.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="grid">${l.concepts.map((x,i)=>`<div class="card"><h3>Idea ${i+1}</h3><p>${esc(x)}</p></div>`).join("")}</div></article>
 <article class="card lab"><p class="eyebrow">4 · Experiment</p><h2>Algebra Lab</h2><p>Change an example, test a boundary case, and verify whether the original reasoning still works. Record what changes and what remains invariant.</p><textarea aria-label="Lab notes"></textarea></article>
 <article class="card boss"><p class="eyebrow">5 · Challenge</p><h2>Wrong Answer Museum</h2><p>${esc(l.wrong)}</p><details><summary>Repair exhibit</summary><p>${esc(l.wrong_answer)}</p></details></article>
 <article class="card"><p class="eyebrow">6 · Defend</p><h2>Arch's Scratchpad</h2><p>Explain one result without using “move it,” “just because,” or “the calculator says.” Name the property, definition, unit relationship, or verification that supports your conclusion.</p><textarea aria-label="Mathematical defense"></textarea></article>
 <article class="card full"><p class="eyebrow">7 · Reflect & Retrieve</p><h2>Lesson Check</h2>${qhtml(items)}<div class="actions"><button class="btn primary" id="score">Submit & Score</button></div><p id="result"></p></article>
 </div></section>`;bind(items,`lesson-${n}`)
}
function unit(){
 let u=D.unit;
 $("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Khaemenes Algebra I · Unit 01 · Open-Age</p><h1>${esc(u.title)}</h1><p class="lead">${esc(u.subtitle)}<br>${esc(u.essential)}</p><div class="nav"><a class="btn primary" href="lessons/${D.lessons[0].file}">Begin Lesson 01</a><a class="btn" href="../../index.html">Course Home</a><a class="btn" href="boss-battle.html">Boss Battle</a><a class="btn" href="assessment/mastery-check.html">Mastery Check</a><a class="btn" href="${archHref()}">Ask Arch</a></div><div class="snapshot"><div class="metric"><strong>6</strong>Lessons</div><div class="metric"><strong>60</strong>Unique Items</div><div class="metric"><strong>3</strong>Pathways</div><div class="metric"><strong>80%</strong>Mastery</div></div></div></section><section class="block"><div class="wrap"><div class="lesson-grid">${D.lessons.map(l=>`<article class="card"><p class="eyebrow">Lesson ${String(l.number).padStart(2,"0")}</p><h3>${esc(l.title)}</h3><p>${esc(l.objectives[0])}</p><a class="btn primary" href="lessons/${l.file}">Open Lesson</a></article>`).join("")}</div><div class="lesson-grid" style="margin-top:14px"><a class="card" href="practice/foundation.html"><h3>Foundation Practice</h3><p>15 balanced concept-focused items across all six lessons.</p></a><a class="card" href="practice/core.html"><h3>Core Practice</h3><p>20 balanced mixed-application items across all six lessons.</p></a><a class="card" href="practice/extended.html"><h3>Extended Practice</h3><p>25 balanced items including reasoning and transfer.</p></a><a class="card" href="projects/precision-measurement-audit.html"><h3>Mission Board</h3><p>Precision & Measurement Audit.</p></a><a class="card" href="teacher-guide.html"><h3>Teacher Guide</h3></a><a class="card" href="family-guide.html"><h3>Family Guide</h3></a></div></div></section>`
}
function balancedPractice(level){
 const cap={Foundation:1,Core:2,Extended:3}[level],count={Foundation:15,Core:20,Extended:25}[level];
 const quotas={Foundation:[3,3,3,2,2,2],Core:[4,4,3,3,3,3],Extended:[5,4,4,4,4,4]}[level];
 let items=[];
 for(let l=1;l<=6;l++){
   let pool=D.questions.filter(q=>q.lesson===l&&q.level<=cap);
   if(level==="Extended"){
     let hard=shuffle(pool.filter(q=>q.level===3)).slice(0,1);
     let rest=shuffle(pool.filter(q=>!hard.includes(q))).slice(0,quotas[l-1]-hard.length);
     items.push(...hard,...rest)
   }else items.push(...shuffle(pool).slice(0,quotas[l-1]))
 }
 return shuffle(items).slice(0,count)
}
function practice(level){
 let items=balancedPractice(level);
 $("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 01 · ${level}</p><h1>${level} Practice</h1><p class="lead">${items.length} unique, balanced questions spanning all six lessons.</p><div class="nav"><a class="btn" href="../index.html">Unit Home</a><a class="btn" href="${archHref({pathway:level})}">Ask Arch</a></div></div></section><section class="block"><div class="wrap">${qhtml(items)}<div class="actions"><button class="btn primary" id="score">Submit & Score</button></div><p id="result"></p></div></section>`;bind(items,`practice-${level.toLowerCase()}`)
}
const MASTERY_IDS=[
 "u01-l01-q03","u01-l01-q07","u01-l01-q09",
 "u01-l02-q03","u01-l02-q05","u01-l02-q07","u01-l02-q09",
 "u01-l03-q01","u01-l03-q06","u01-l03-q10",
 "u01-l04-q02","u01-l04-q05","u01-l04-q10",
 "u01-l05-q03","u01-l05-q05","u01-l05-q10",
 "u01-l06-q05","u01-l06-q07","u01-l06-q09","u01-l06-q10"
];
function mastery(){
 let items=MASTERY_IDS.map(id=>D.questions.find(q=>q.id===id)).filter(Boolean);
 $("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 01 · Formal Mastery Evidence</p><h1>Blueprint Mastery Check</h1><p class="lead">20 fixed-blueprint questions · all six lessons · Level 1/2/3 reasoning · 80% target.</p><div class="nav"><a class="btn" href="../index.html">Unit Home</a></div></div></section><section class="block"><div class="wrap">${qhtml(items)}<div class="actions"><button class="btn primary" id="score">Submit & Score</button></div><p id="result"></p></div></section>`;bind(items,"mastery")
}
function boss(){
 const ids=["u01-l01-q09","u01-l02-q09","u01-l03-q10","u01-l04-q10","u01-l05-q10","u01-l06-q10"];
 const items=ids.map(id=>D.questions.find(q=>q.id===id));
 $("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 01 · Integrated Challenge</p><h1>The Trustworthy Mathematics Boss Battle</h1><p class="lead">Six higher-reasoning checkpoints—one from each lesson. Diagnose, reason, and defend before the formal mastery check.</p><div class="nav"><a class="btn" href="index.html">Unit Home</a><a class="btn" href="${archHref({challenge:"Boss Battle"})}">Ask Arch for a Hint</a></div></div></section><section class="block"><div class="wrap">${qhtml(items)}<div class="actions"><button class="btn primary" id="score">Complete Battle</button></div><p id="result"></p></div></section>`;bind(items,"boss-battle")
}
let mode=document.body.dataset.mode;
if(mode==="unit")unit();else if(mode==="lesson")lesson(+document.body.dataset.lesson);else if(mode==="practice")practice(document.body.dataset.pathway);else if(mode==="mastery")mastery();else if(mode==="boss")boss();
})();