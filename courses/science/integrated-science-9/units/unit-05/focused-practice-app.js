"use strict";
(()=>{
  const BANKS=window.KhaeUnit05FocusedPracticeBanks||{};
  const META={
    energy:{title:"Food-Web & Energy Practice",subtitle:"Randomized formative practice across trophic roles, energy transfer, matter cycling, indirect effects, and model limits."},
    populations:{title:"Population & Sampling Practice",subtitle:"Randomized formative practice across density, growth models, survey design, mark–recapture, and causal limits."},
    biodiversity:{title:"Biodiversity & Conservation Practice",subtitle:"Randomized formative practice across richness, evenness, resilience, monitoring, and adaptive conservation."},
    evolution:{title:"Evolution & Evidence Practice",subtitle:"Randomized formative practice across selection, variation, resistance, speciation, fossils, and evidence classification."}
  };
  const $=(s,p=document)=>p.querySelector(s), esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
  const practiceId=document.body.dataset.practice||"";
  const bank=BANKS[practiceId]||[], meta=META[practiceId]||{title:"Focused Practice",subtitle:"Randomized formative practice."};
  const baseKey=()=>window.KhaemenesScienceU05Scope?.key?.()||null;
  const key=()=>{const b=baseKey();return b?b+":focused-practice:"+practiceId+":v1":null};
  let record={attempts:0,bestScore:0,seenIds:[],session:null,lastResult:null}, snapshot=null, conflict=false, items=[];
  function read(){
    const k=key(); if(!k) return;
    snapshot=localStorage.getItem(k);
    try{record=snapshot?JSON.parse(snapshot):record}catch{record={attempts:0,bestScore:0,seenIds:[],session:null,lastResult:null}}
    record.seenIds=Array.isArray(record.seenIds)?record.seenIds:[];
  }
  function write(){
    const k=key(); if(!k) return false;
    if(conflict||localStorage.getItem(k)!==snapshot){conflict=true;window.alert("This focused-practice record changed in another tab. Reload before saving.");return false}
    const raw=JSON.stringify(record);localStorage.setItem(k,raw);snapshot=raw;return true;
  }
  function newSession(){
    const seen=new Set(record.seenIds||[]);
    const preferred=shuffle(bank.filter(q=>!seen.has(q.id))), repeat=shuffle(bank.filter(q=>seen.has(q.id)));
    const selected=[...preferred,...repeat].slice(0,Math.min(8,bank.length));
    const sessionItems=selected.map(q=>({id:q.id,order:shuffle(q.options.map((_,i)=>i))}));
    record.session={id:"u05-"+practiceId+"-"+Date.now().toString(36),items:sessionItems,responses:{},completed:false,createdAt:new Date().toISOString()};
    record.lastResult=null;write();materialize();
  }
  function materialize(){
    const byId=new Map(bank.map(q=>[q.id,q]));
    items=(record.session?.items||[]).map(si=>{const q=byId.get(si.id);if(!q)return null;const order=Array.isArray(si.order)&&si.order.length===q.options.length?si.order:q.options.map((_,i)=>i);return {...q,order,displayOptions:order.map(i=>q.options[i]),displayAnswer:order.indexOf(q.answer)}}).filter(Boolean);
  }
  function renderIntro(){
    $("#practiceTitle").textContent=meta.title;$("#practiceSubtitle").textContent=meta.subtitle;
    const status=$("#practiceStatus");
    if(record.lastResult){status.textContent=`Last attempt: ${record.lastResult.score}/${record.lastResult.total} · Best: ${record.bestScore}/8 · Attempts: ${record.attempts}`}
    else if(record.session&&!record.session.completed){status.textContent=`Saved attempt ready to resume · ${Object.keys(record.session.responses||{}).length}/${record.session.items.length} answered`}
    else status.textContent=`12-question source pool · 8 questions per attempt · 7/8 practice target`;
    $("#startButton").textContent=record.session&&!record.session.completed?"Resume saved attempt":"Begin randomized check";
  }
  function showAssessment(){
    if(!record.session||record.session.completed)newSession(); else materialize();
    $("#intro").hidden=true;$("#results").hidden=true;$("#assessment").hidden=false;
    const responses=record.session.responses||{};
    $("#questionList").innerHTML=items.map((q,i)=>`<article class="card question-panel focused-question"><div class="question-top"><span class="domain-label">${esc(q.domain)}</span><span class="pill">Question ${i+1} of ${items.length}</span></div><h2>${esc(q.prompt)}</h2><div class="options">${q.displayOptions.map((o,oi)=>`<label class="option"><input type="radio" name="q${i}" value="${oi}" data-qid="${esc(q.id)}" ${Number(responses[q.id])===oi?"checked":""}><span>${esc(o)}</span></label>`).join("")}</div></article>`).join("");
    $("#questionList").querySelectorAll("input[data-qid]").forEach(x=>x.onchange=()=>{record.session.responses[x.dataset.qid]=+x.value;write();updateSubmit()});
    updateSubmit();
  }
  function updateSubmit(){
    const answered=Object.keys(record.session?.responses||{}).length;
    $("#answeredCount").textContent=`${answered} of ${items.length} answered`;
    $("#submitButton").disabled=answered!==items.length;
  }
  function submit(){
    if(!record.session||record.session.completed)return;
    let score=0;const review=[];
    items.forEach(q=>{const chosen=Number(record.session.responses[q.id]);const correct=chosen===q.displayAnswer;if(correct)score++;review.push({q,chosen,correct})});
    record.attempts=(Number(record.attempts)||0)+1;record.bestScore=Math.max(Number(record.bestScore)||0,score);
    record.seenIds=[...new Set([...(record.seenIds||[]),...items.map(q=>q.id)])];
    record.session.completed=true;record.session.completedAt=new Date().toISOString();
    record.lastResult={score,total:items.length,passed:score>=7,sessionId:record.session.id,completedAt:record.session.completedAt};
    if(!write())return;
    $("#assessment").hidden=true;$("#results").hidden=false;
    $("#score").textContent=`${score} / ${items.length}`;
    $("#resultTitle").textContent=score>=7?"Practice target reached":"Practice target not yet reached";
    $("#resultMessage").textContent=score>=7?"Review the reasoning below, then return to the unit or generate a fresh form. This does not change the authoritative Unit 05 mastery record.":"Use the corrections below, revisit the linked lessons/labs, then generate a fresh form. This does not change the authoritative Unit 05 mastery record.";
    $("#reviewList").innerHTML=review.map((r,i)=>`<article class="review-item ${r.correct?"correct":"incorrect"}"><strong>${i+1}. ${esc(r.q.prompt)}</strong><p>Your answer: ${esc(r.q.displayOptions[r.chosen])}</p><p>Correct answer: ${esc(r.q.displayOptions[r.q.displayAnswer])}</p><p>${esc(r.q.explanation)}</p></article>`).join("");
  }
  function resetAttempt(){record.session=null;record.lastResult=null;write();newSession();showAssessment()}
  window.addEventListener("storage",e=>{if(e.key===key()&&e.newValue!==snapshot)conflict=true});
  document.addEventListener("DOMContentLoaded",()=>{
    read();renderIntro();
    $("#startButton").onclick=showAssessment;
    $("#submitButton").onclick=submit;
    $("#retakeButton").onclick=resetAttempt;
    $("#printResults").onclick=()=>print();
  });
})();