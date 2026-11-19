/* Khaemenes Academy Exam Engine · Public cumulative self-check + constructed-response depth evidence */
"use strict";
(function(){
  const C=window.EXAM_CONFIG;
  if(!C)return;

  const engineScript=document.currentScript;
  const depthSrc=new URL("exam-depth-v2.js",engineScript?.src||location.href).href;

  function boot(){
    const D=(window.KhaemenesPreAlgebraExamDepth||{})[C.id]||null;
    const $=id=>document.getElementById(id);
    const stateKey=C.storage_key;
    const resultKey=C.result_key;
    const DISPLAY_VERSION="balanced-option-order-v2";
    const RESULT_SCHEMA="khaemenes-assessment-result-v3-depth";
    const PUBLIC_CLASSIFICATION="public-self-check-nonconfidential";
    const state={answers:{},responses:{},submitted:false};

    function load(){
      try{
        const d=JSON.parse(localStorage.getItem(stateKey)||"{}");
        if(d&&typeof d==="object")Object.assign(state,d);
        state.answers=state.answers&&typeof state.answers==="object"?state.answers:{};
        state.responses=state.responses&&typeof state.responses==="object"?state.responses:{};
      }catch{}
    }
    function save(){localStorage.setItem(stateKey,JSON.stringify(state));updateProgress()}
    function theme(v){document.documentElement.dataset.theme=v;localStorage.setItem("khaemenes-theme",v)}
    theme(localStorage.getItem("khaemenes-theme")||(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"));
    $("themeToggle").onclick=()=>theme(document.documentElement.dataset.theme==="light"?"dark":"light");

    function hashSeed(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
    function nextSeed(x){x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0}
    function shuffled(values,seed){const a=values.slice();let x=seed>>>0;for(let i=a.length-1;i>0;i--){x=nextSeed(x);const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
    function balancedTargets(total){const pool=Array.from({length:total},(_,i)=>i%4);return shuffled(pool,hashSeed(`${C.id}:${total}:balanced-targets-v283`))}
    const targetPositions=balancedTargets(C.questions.length);
    function optionOrder(q,i){
      const answer=Number(q.answer),rest=q.options.map((_,j)=>j).filter(j=>j!==answer);
      const mixed=shuffled(rest,hashSeed(`${C.id}:${i}:distractors-v21`));
      const target=(targetPositions[i]??0)%q.options.length;
      mixed.splice(target,0,answer);
      return mixed;
    }
    function escapeHtml(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}

    function installDepthStyles(){
      if(document.getElementById("prealgebraExamDepthStyles"))return;
      const style=document.createElement("style");
      style.id="prealgebraExamDepthStyles";
      style.textContent=`
        .constructed-block{margin-top:1.25rem}
        .constructed-intro{padding:1rem;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
        .constructed-list{display:grid;gap:1rem;margin-top:1rem}
        .constructed-item{padding:1rem;border:1px solid var(--line);border-radius:12px;background:var(--bg2)}
        .constructed-item textarea{width:100%;min-height:150px;margin-top:.75rem;padding:.8rem;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:inherit;font:inherit;line-height:1.5}
        .constructed-meta{display:block;margin-bottom:.35rem;color:var(--gold2);font-size:.78rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em}
        .constructed-count{margin:.4rem 0 0;color:var(--muted);font-size:.8rem}
        .evaluator-review{margin-top:1.25rem;padding:1rem;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
        .evaluator-grid{display:grid;gap:.75rem;margin-top:.8rem}
        .evaluator-row{display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:.8rem;align-items:center;padding:.65rem;border:1px solid var(--line);border-radius:10px}
        .evaluator-row input{width:100%;padding:.55rem;border:1px solid var(--line);border-radius:8px;background:var(--bg2);color:inherit}
        .rubric-list{margin:.7rem 0;padding-left:1.2rem;color:var(--muted)}
        @media(max-width:700px){.evaluator-row{grid-template-columns:1fr}}
        @media print{.constructed-item textarea{min-height:120px;background:#fff;color:#111}.evaluator-review button{display:none}}
      `;
      document.head.appendChild(style);
    }

    function installClassificationNotice(){
      const submit=$("submitButton"),exp=$("exportButton");
      if(submit)submit.textContent=D?"Submit Auto-Scored Work & Reasoning":"Submit & Self-Check";
      if(exp)exp.textContent="Export Unverified Result";
      const hero=document.querySelector("main .hero .wrap");
      if(hero&&!document.getElementById("publicAssessmentClassification")){
        const p=document.createElement("p");
        p.id="publicAssessmentClassification";
        p.className="notice";
        p.innerHTML=D
          ?"<strong>Mixed-evidence public assessment:</strong> the selected-response portion is auto-scored. Required constructed responses must be reviewed with the included rubric before full mastery is recorded. All browser-local results remain editable, unverified learning evidence."
          :"<strong>Public self-check form:</strong> this browser-delivered assessment is not confidential. Its score is editable local data and is not a digitally signed course record. Use an administrator-issued supervised form when confidential summative testing is required.";
        hero.appendChild(p);
      }
      const resultSection=$("results");
      const existing=resultSection?.querySelector(".notice");
      if(existing)existing.textContent=D
        ?"The auto-score and written reasoning should be retained together. Full mastery requires evaluator review of the constructed responses; browser-local records remain editable and unverified."
        :"This public self-check result may be retained as learning evidence after parent/administrator review. It is not confidential, digitally signed, or independently authenticated.";
      document.querySelectorAll(".footer-inner span").forEach(span=>{
        if(/Local-only scoring|Printable|Exportable/i.test(span.textContent))span.textContent=D?"Mixed evidence · Local-only · Evaluator review":"Public self-check · Local-only · Unverified";
      });
    }

    function group(){
      const m=new Map();
      C.questions.forEach((q,i)=>{const k=`Unit ${q.unit}`;if(!m.has(k))m.set(k,[]);m.get(k).push([q,i])});
      return m;
    }

    function renderConstructed(host){
      if(!D?.constructed?.length)return;
      const sec=document.createElement("section");
      sec.className="section-block constructed-block";
      sec.innerHTML=`<div class="section-title"><strong>${escapeHtml(D.title||"Constructed-Response Depth Evidence")}</strong><span>${D.constructed.length} required responses</span></div>
        <div class="constructed-intro"><strong>Show the mathematics.</strong> These responses are required evidence of reasoning, representation, verification, units, interpretation, and transfer. They are not machine-graded. A parent, teacher, or program administrator reviews them after the auto-scored portion is submitted.</div>`;
      const list=document.createElement("div");
      list.className="constructed-list";
      D.constructed.forEach((task,i)=>{
        const art=document.createElement("article");
        art.className="constructed-item";
        const value=state.responses[i]||"";
        art.innerHTML=`<span class="constructed-meta">Response ${i+1} · ${escapeHtml(task.domain)}</span><strong>${escapeHtml(task.prompt)}</strong><textarea id="cr${i}" aria-label="Constructed response ${i+1}" ${state.submitted?"disabled":""}>${escapeHtml(value)}</textarea><p class="constructed-count" id="crCount${i}">${value.trim().length} characters · minimum ${D.response_min_chars||40}</p>`;
        const ta=art.querySelector("textarea");
        ta?.addEventListener("input",()=>{
          state.responses[i]=ta.value;
          const count=art.querySelector(`#crCount${i}`);
          if(count)count.textContent=`${ta.value.trim().length} characters · minimum ${D.response_min_chars||40}`;
          save();
        });
        list.appendChild(art);
      });
      sec.appendChild(list);
      host.appendChild(sec);
    }

    function render(){
      const host=$("questionHost");
      host.innerHTML="";
      for(const [label,items] of group()){
        const sec=document.createElement("section");
        sec.className="section-block";
        const head=document.createElement("div");
        head.className="section-title";
        head.innerHTML=`<strong>${label}</strong><span>${items.length} questions</span>`;
        sec.append(head);
        const list=document.createElement("div");
        list.className="question-list";
        items.forEach(([q,i])=>{
          const art=document.createElement("article");
          art.className="question";
          const fs=document.createElement("fieldset");
          const legend=document.createElement("legend");
          legend.innerHTML=`<span class="qmeta">Question ${i+1} · ${escapeHtml(q.domain)}</span>${escapeHtml(q.prompt)}`;
          fs.append(legend);
          const opts=document.createElement("div");
          opts.className="options";
          optionOrder(q,i).forEach(j=>{
            const o=q.options[j];
            const lab=document.createElement("label");
            lab.className="option";
            lab.innerHTML=`<input type="radio" name="q${i}" value="${j}"> <span>${escapeHtml(o)}</span>`;
            const inp=lab.querySelector("input");
            if(Number(state.answers[i])===j)inp.checked=true;
            inp.disabled=state.submitted;
            inp.onchange=()=>{state.answers[i]=j;save()};
            opts.append(lab);
          });
          fs.append(opts);
          if(state.submitted){
            const ok=Number(state.answers[i])===q.answer;
            const fb=document.createElement("div");
            fb.className=`feedback ${ok?"correct":"incorrect"}`;
            fb.textContent=(ok?"Correct. ":`Correct answer: ${q.options[q.answer]}. `)+q.explanation;
            fs.append(fb);
          }
          art.append(fs);
          list.append(art);
        });
        sec.append(list);
        host.append(sec);
      }
      renderConstructed(host);
      updateProgress();
    }

    function completedConstructed(){
      if(!D?.constructed?.length)return 0;
      const min=D.response_min_chars||40;
      return D.constructed.filter((_,i)=>String(state.responses[i]||"").trim().length>=min).length;
    }
    function updateProgress(){
      const n=Object.keys(state.answers).length,total=C.questions.length,p=Math.round(n/total*100);
      $("progressLabel").textContent=`${n}/${total}`;
      $("progressBar").style.width=p+"%";
      if(state.submitted){
        $("status").textContent=D?"Auto-scored work submitted. Constructed responses now require evaluator review.":"Self-check submitted. Browser-local result is not digitally verified.";
      }else if(D){
        $("status").textContent=`${total-n} auto-scored questions remaining · ${D.constructed.length-completedConstructed()} constructed responses incomplete.`;
      }else{
        $("status").textContent=`${total-n} questions remaining.`;
      }
    }
    function grade(p){return p>=90?"A":p>=80?"B":p>=70?"C":p>=60?"D":"F"}

    function buildSelectedResult(){
      let correct=0;
      const by={};
      C.questions.forEach((q,i)=>{
        const k=`Unit ${q.unit}`;
        by[k]??={correct:0,total:0};
        by[k].total++;
        if(Number(state.answers[i])===q.answer){correct++;by[k].correct++}
      });
      const percent=Math.round(correct/C.questions.length*1000)/10;
      const threshold=Number.isFinite(Number(C.mastery_threshold))?Number(C.mastery_threshold):null;
      const result={
        result_schema:RESULT_SCHEMA,
        assessment_id:C.id,
        title:C.title,
        assessment_classification:PUBLIC_CLASSIFICATION,
        correct,
        total:C.questions.length,
        percent,
        selected_response_percent:percent,
        selected_response_grade:grade(percent),
        letter_grade:grade(percent),
        submitted_at:new Date().toISOString(),
        section_scores:by,
        option_order_version:DISPLAY_VERSION,
        trust:{classification:"browser-local-self-scored-plus-local-evaluator-review",authoritative:false,confidential:false,cryptographically_verified:false,digitally_signed:false,editable_storage:true,review_required:true}
      };
      if(threshold!==null){
        result.mastery_threshold=threshold;
        result.selected_response_mastery_met=percent>=threshold;
      }
      if(D){
        result.constructed_response={
          version:D.version||"2.0",
          count:D.constructed.length,
          responses:{...state.responses},
          response_min_chars:D.response_min_chars||40,
          rubric_max:D.rubric_max||4,
          selected_weight:D.selected_weight||70,
          constructed_weight:D.constructed_weight||30,
          evaluator_scores:null,
          percent:null,
          review_complete:false
        };
        result.overall_percent=null;
        result.mastery_met=false;
        result.mastery_status=percent>=threshold?"pending-evaluator-review":"selected-response-review-required";
      }else if(threshold!==null){
        result.mastery_met=percent>=threshold;
        result.mastery_status=result.mastery_met?"mastery-met":"review-required";
      }
      return result;
    }

    function submit(){
      if(Object.keys(state.answers).length!==C.questions.length){
        $("status").textContent="Answer every auto-scored question before submitting.";
        return;
      }
      if(D&&completedConstructed()!==D.constructed.length){
        $("status").textContent=`Complete every constructed response with at least ${D.response_min_chars||40} meaningful characters before submitting.`;
        return;
      }
      state.submitted=true;
      const result=buildSelectedResult();
      localStorage.setItem(resultKey,JSON.stringify(result));
      save();
      render();
      showResult(result,true);
    }

    function renderEvaluatorReview(r){
      if(!D)return;
      let panel=document.getElementById("evaluatorReview");
      if(!panel){
        panel=document.createElement("div");
        panel.id="evaluatorReview";
        panel.className="evaluator-review";
        $("results").querySelector(".exam-main")?.appendChild(panel);
      }
      const existing=r.constructed_response?.evaluator_scores||{};
      panel.innerHTML=`<h2>Evaluator Review · Constructed Responses</h2>
        <p>Use the 0–${D.rubric_max||4} rubric for each written response. Full mastery requires at least 80% on the auto-scored portion, at least 80% on constructed-response review, and at least 80% overall.</p>
        <ul class="rubric-list">${(D.rubric||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>
        <div class="evaluator-grid">${D.constructed.map((task,i)=>`<label class="evaluator-row"><span><strong>Response ${i+1}</strong> · ${escapeHtml(task.domain)}</span><input type="number" min="0" max="${D.rubric_max||4}" step="1" data-evaluator-score="${i}" value="${existing[i]??""}" aria-label="Score constructed response ${i+1}"></label>`).join("")}</div>
        <div class="side-actions"><button class="btn primary" id="saveEvaluatorReview" type="button">Save Evaluator Review</button></div>
        <p class="notice" id="evaluatorStatus">${r.constructed_response?.review_complete?`Constructed-response score: ${r.constructed_response.percent}% · Overall: ${r.overall_percent}% · ${r.mastery_met?"Mastery met":"Review required"}`:"Evaluator review pending."}</p>`;
      document.getElementById("saveEvaluatorReview").onclick=()=>saveEvaluatorReview(r);
    }

    function saveEvaluatorReview(r){
      const inputs=[...document.querySelectorAll("[data-evaluator-score]")];
      const max=D.rubric_max||4;
      const scores={};
      for(const input of inputs){
        const value=Number(input.value);
        if(!Number.isInteger(value)||value<0||value>max){
          document.getElementById("evaluatorStatus").textContent=`Enter a whole-number rubric score from 0 to ${max} for every response.`;
          return;
        }
        scores[input.dataset.evaluatorScore]=value;
      }
      const total=Object.values(scores).reduce((sum,n)=>sum+n,0);
      const constructedPercent=Math.round(total/(D.constructed.length*max)*1000)/10;
      const selected=Number(r.selected_response_percent??r.percent??0);
      const selectedWeight=Number(D.selected_weight||70);
      const constructedWeight=Number(D.constructed_weight||30);
      const overall=Math.round((selected*selectedWeight+constructedPercent*constructedWeight)/(selectedWeight+constructedWeight)*10)/10;
      const threshold=Number.isFinite(Number(C.mastery_threshold))?Number(C.mastery_threshold):80;
      r.constructed_response.evaluator_scores=scores;
      r.constructed_response.percent=constructedPercent;
      r.constructed_response.review_complete=true;
      r.constructed_response.reviewed_at=new Date().toISOString();
      r.overall_percent=overall;
      r.letter_grade=grade(overall);
      r.mastery_met=selected>=threshold&&constructedPercent>=threshold&&overall>=threshold;
      r.mastery_status=r.mastery_met?"mastery-met":"review-required";
      r.evaluator_review={completed:true,completed_at:new Date().toISOString(),local_unverified:true};
      localStorage.setItem(resultKey,JSON.stringify(r));
      showResult(r,false);
    }

    function showResult(r,scroll=false){
      $("results").hidden=false;
      const selected=Number(r.selected_response_percent??r.percent??0);
      const reviewed=Boolean(r.constructed_response?.review_complete);
      const displayPercent=D&&reviewed?Number(r.overall_percent):selected;
      $("resultScore").textContent=displayPercent+"%";
      if(D){
        $("resultTitle").textContent=reviewed
          ?`Selected response ${selected}% · Constructed response ${r.constructed_response.percent}% · Overall ${r.overall_percent}% · ${r.mastery_met?"Mastery met":"Review required"}`
          :`Auto-scored portion ${selected}% · Constructed-response evaluator review pending`;
      }else{
        const mastery=(typeof r.mastery_met==="boolean")?` · ${r.mastery_met?"Mastery met":"Review recommended"}`:"";
        $("resultTitle").textContent=`${r.correct} of ${r.total} correct · Grade ${r.letter_grade}${mastery}`;
      }
      const grid=$("breakdown");
      grid.innerHTML="";
      Object.entries(r.section_scores||{}).forEach(([k,v])=>{
        const a=document.createElement("article");
        a.innerHTML=`<strong>${v.correct}/${v.total}</strong><span>${k}</span>`;
        grid.append(a);
      });
      $("status").textContent=D
        ?(reviewed?"Mixed-evidence result saved locally. Parent/teacher review remains unverified browser data.":"Auto-score saved. Full mastery is pending constructed-response evaluator review.")
        :"Result saved locally as an unverified public self-check. It is editable browser data and is not an authoritative or digitally signed record.";
      renderEvaluatorReview(r);
      if(scroll)$("results").scrollIntoView({behavior:"smooth"});
    }

    function reset(){
      if(!confirm("Clear all answers, constructed responses, and the saved result for this assessment?"))return;
      localStorage.removeItem(stateKey);
      localStorage.removeItem(resultKey);
      state.answers={};
      state.responses={};
      state.submitted=false;
      $("results").hidden=true;
      render();
      $("status").textContent="Reset complete.";
    }

    function exportResult(){
      const raw=localStorage.getItem(resultKey);
      if(!raw){$("status").textContent="Submit the assessment before exporting a result.";return}
      const blob=new Blob([raw],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
      a.href=url;
      a.download=C.export_name;
      a.click();
      setTimeout(()=>URL.revokeObjectURL(url),500);
      $("status").textContent=D?"Mixed-evidence result exported with constructed responses and evaluator-review status.":"Unverified public self-check result exported for parent/administrator review.";
    }

    installDepthStyles();
    load();
    installClassificationNotice();
    render();
    const saved=localStorage.getItem(resultKey);
    if(saved){try{showResult(JSON.parse(saved),false)}catch{}}
    $("submitButton").onclick=submit;
    $("saveButton").onclick=()=>{save();$("status").textContent=D?`Draft saved · ${completedConstructed()}/${D.constructed.length} constructed responses complete.`:"Draft saved in this browser."};
    $("resetButton").onclick=reset;
    $("exportButton").onclick=exportResult;
    $("printButton").onclick=()=>window.print();
  }

  if(window.KhaemenesPreAlgebraExamDepth){
    boot();
    return;
  }
  const depth=document.createElement("script");
  depth.src=depthSrc;
  depth.async=false;
  depth.onload=boot;
  depth.onerror=()=>{
    const status=document.getElementById("status");
    if(status)status.textContent="Assessment depth module could not load. Refresh before administering this cumulative assessment.";
    const submit=document.getElementById("submitButton");
    if(submit)submit.disabled=true;
  };
  document.head.appendChild(depth);
})();