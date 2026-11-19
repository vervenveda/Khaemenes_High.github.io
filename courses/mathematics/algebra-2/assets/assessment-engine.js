(() => {
  "use strict";

  const cfg = window.A2_ASSESSMENT_CONFIG || {};
  const engine = document.currentScript;

  function unavailable() {
    const host = document.getElementById("assessmentRoot");
    if (host) host.innerHTML = '<article class="card"><p class="eyebrow">Progression check unavailable</p><h2>Assessment paused</h2><p>The local progression check could not be loaded. Refresh this page before continuing; no assessment result was opened or saved.</p></article>';
    document.getElementById("startAssessment")?.setAttribute("disabled", "true");
    document.getElementById("resetAssessment")?.setAttribute("disabled", "true");
  }

  function withDepthBanks(done) {
    const units = new Set((Array.isArray(cfg.units) ? cfg.units : []).map(Number));
    const loaded = () => Array.isArray(window.ALGEBRA2_DEPTH_QUESTIONS) ? window.ALGEBRA2_DEPTH_QUESTIONS : [];
    const files = [];
    if (units.has(1) && !loaded().some(q => Number(q?.unit) === 1 && String(q?.id || "").includes("-d"))) files.push("./algebra2-depth-bank-v1.js");
    if ((units.has(2) || units.has(3)) && !loaded().some(q => [2,3].includes(Number(q?.unit)) && String(q?.id || "").includes("-d"))) files.push("./algebra2-depth-bank-units02-03-v1.js");
    if ((units.has(4) || units.has(5)) && !loaded().some(q => [4,5].includes(Number(q?.unit)) && String(q?.id || "").includes("-d"))) files.push("./algebra2-depth-bank-units04-05-v1.js");
    if ((units.has(6) || units.has(7)) && !loaded().some(q => [6,7].includes(Number(q?.unit)) && String(q?.id || "").includes("-d"))) files.push("./algebra2-depth-bank-units06-07-v1.js");
    if ((units.has(8) || units.has(9)) && !loaded().some(q => [8,9].includes(Number(q?.unit)) && String(q?.id || "").includes("-d"))) files.push("./algebra2-depth-bank-units08-09-v1.js");
    if ((units.has(10) || units.has(11)) && !loaded().some(q => [10,11].includes(Number(q?.unit)) && String(q?.id || "").includes("-d"))) files.push("./algebra2-depth-bank-units10-11-v1.js");
    if ((units.has(12) || units.has(13)) && !loaded().some(q => [12,13].includes(Number(q?.unit)) && String(q?.id || "").includes("-d"))) files.push("./algebra2-depth-bank-units12-13-v1.js");
    if (!files.length || !engine?.src) { done(); return; }
    const next = () => {
      const file = files.shift();
      if (!file) { done(); return; }
      const script = document.createElement("script");
      script.src = new URL(file, engine.src).href;
      script.async = false;
      script.onload = next;
      script.onerror = () => { console.warn("Algebra II depth bank unavailable:", file); next(); };
      document.head.appendChild(script);
    };
    next();
  }

  function withProgression(done) {
    if (window.KhaemenesAlgebra2Progression || !engine) {
      if (window.KhaemenesAlgebra2Progression) done(); else unavailable();
      return;
    }
    const script = document.createElement("script");
    script.src = new URL("./algebra2-progression.js", engine.src).href;
    script.onload = done;
    script.onerror = unavailable;
    document.head.appendChild(script);
  }

  function boot() {
    const base = cfg.source === "diagnostic" ? window.ALGEBRA2_DIAGNOSTIC : window.ALGEBRA2_QUESTIONS;
    const depth = cfg.source === "diagnostic" ? [] : (Array.isArray(window.ALGEBRA2_DEPTH_QUESTIONS) ? window.ALGEBRA2_DEPTH_QUESTIONS : []);
    const all = [...(Array.isArray(base)?base:[]), ...depth].filter((question,index,array)=>question&&question.id&&array.findIndex(item=>item?.id===question.id)===index);
    const host = document.getElementById("assessmentRoot");
    if (!host || !Array.isArray(all)) return;

    const KEY = "khaemenes-algebra2-assessment-records-v1";
    const formalGate = /^(u\d{2}-mastery|midterm|final)$/.test(String(cfg.recordKey || ""));
    const MASTERY_TARGET = cfg.source === "diagnostic" || !formalGate ? null : Number(cfg.masteryTarget ?? 80);
    const esc = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
    const load = () => window.KhaemenesAlgebra2Progression?.readJSON?.(KEY, {}) || {};
    const save = value => window.KhaemenesAlgebra2Progression?.writeJSON?.(KEY, value) === true;
    const shuffle = values => { const result = [...values]; for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };

    function pool() {
      let result = [...all];
      if (Array.isArray(cfg.units) && cfg.units.length) result = result.filter(question => cfg.units.includes(question.unit));
      if (Array.isArray(cfg.weeks) && cfg.weeks.length) result = result.filter(question => cfg.weeks.includes(Number(question.week)));
      if (cfg.pathway) {
        const level = {Foundation:1,Core:2,Extended:3}[cfg.pathway] || 2;
        const beforePathway = [...result];
        result = result.filter(question => Number(question.pathway_min ?? question.difficulty ?? 2) <= level);
        if (level === 1 && result.length < Number(cfg.count || 0)) {
          const used = new Set(result.map(question => String(question.id)));
          const legacyFoundation = beforePathway.filter(question =>
            question?.pathway_min == null &&
            question?.difficulty == null &&
            !used.has(String(question?.id || ""))
          );
          result = [...result, ...legacyFoundation];
        }
      }
      if (cfg.depthBlueprint) result = result.filter(question => typeof question.dimension === "string" && Number.isFinite(Number(question.lesson)));
      return result;
    }

    function priorQuestionIds() {
      const attempts = load()[cfg.recordKey]?.attempts || [];
      const last = attempts.length ? attempts[attempts.length - 1] : null;
      return new Set(Array.isArray(last?.question_ids) ? last.question_ids.map(String) : []);
    }

    function preferNovel(candidates, count, prior) {
      const unseen = shuffle(candidates.filter(question => !prior.has(String(question.id))));
      const seen = shuffle(candidates.filter(question => prior.has(String(question.id))));
      return [...unseen, ...seen].slice(0, count);
    }

    function balancedByUnit(candidates, requested, prior) {
      const units = Array.isArray(cfg.units) ? cfg.units.map(Number) : [];
      if (units.length < 2) return preferNovel(candidates, requested, prior);
      const baseCount = Math.floor(requested / units.length), extra = requested % units.length, out = [];
      units.forEach((unit,index)=>{
        const need = baseCount + (index < extra ? 1 : 0);
        out.push(...preferNovel(candidates.filter(question=>Number(question.unit)===unit),need,prior));
      });
      if (out.length < requested) {
        const used = new Set(out.map(question=>String(question.id)));
        out.push(...preferNovel(candidates.filter(question=>!used.has(String(question.id))),requested-out.length,prior));
      }
      return shuffle(out).slice(0,requested);
    }

    function depthBlueprint(candidates, requested, prior) {
      const dimensions=["procedural-fluency","multi-step-application","representation-interpretation","error-analysis","transfer-reasoning"];
      const targetBase=Math.floor(requested/dimensions.length),extra=requested%dimensions.length,out=[],used=new Set(),lessonCounts={};
      const choose=(list)=>{
        const available=list.filter(q=>!used.has(String(q.id)));
        if(!available.length)return null;
        const min=Math.min(...available.map(q=>lessonCounts[q.lesson]||0));
        const least=available.filter(q=>(lessonCounts[q.lesson]||0)===min);
        const unseen=least.filter(q=>!prior.has(String(q.id)));
        return shuffle(unseen.length?unseen:least)[0]||null;
      };
      dimensions.forEach((dimension,index)=>{
        const need=targetBase+(index<extra?1:0);
        for(let i=0;i<need;i++){
          const q=choose(candidates.filter(item=>item.dimension===dimension));
          if(!q)break;
          out.push(q);used.add(String(q.id));lessonCounts[q.lesson]=(lessonCounts[q.lesson]||0)+1;
        }
      });
      if(out.length<requested){
        while(out.length<requested){
          const q=choose(candidates);if(!q)break;
          out.push(q);used.add(String(q.id));lessonCounts[q.lesson]=(lessonCounts[q.lesson]||0)+1;
        }
      }
      return shuffle(out).slice(0,requested);
    }

    function balancedDepthByUnit(candidates, requested, prior) {
      const units = Array.isArray(cfg.units) ? cfg.units.map(Number) : [];
      if (units.length < 2) return depthBlueprint(candidates, requested, prior);
      const baseCount = Math.floor(requested / units.length), extra = requested % units.length, out = [], used = new Set();
      units.forEach((unit,index)=>{
        const need = baseCount + (index < extra ? 1 : 0);
        const picked = depthBlueprint(candidates.filter(question=>Number(question.unit)===unit), need, prior);
        picked.forEach(question=>{ const id=String(question.id); if(!used.has(id)){ used.add(id); out.push(question); } });
      });
      if (out.length < requested) {
        const remaining = candidates.filter(question=>!used.has(String(question.id)));
        const fill = depthBlueprint(remaining, requested-out.length, prior);
        fill.forEach(question=>{ const id=String(question.id); if(!used.has(id)){ used.add(id); out.push(question); } });
      }
      return shuffle(out).slice(0, requested);
    }

    function weekMix(candidates, requested, prior) {
      if (!cfg.weekMix || typeof cfg.weekMix !== "object") return null;
      const out=[],used=new Set();
      for (const [weekRaw,countRaw] of Object.entries(cfg.weekMix)) {
        const week=Number(weekRaw),need=Math.max(0,Number(countRaw)||0);
        const picked=preferNovel(candidates.filter(q=>Number(q.week)===week),need,prior);
        picked.forEach(q=>{if(!used.has(String(q.id))){used.add(String(q.id));out.push(q)}});
      }
      if(out.length<requested){
        out.push(...preferNovel(candidates.filter(q=>!used.has(String(q.id))),requested-out.length,prior));
      }
      return shuffle(out).slice(0,requested);
    }

    function selectSet(candidates, requested) {
      const prior=priorQuestionIds();
      const mixed=weekMix(candidates,requested,prior);
      if(mixed)return mixed;
      if(cfg.depthBlueprint && cfg.balancedByUnit)return balancedDepthByUnit(candidates,requested,prior);
      if(cfg.depthBlueprint)return depthBlueprint(candidates,requested,prior);
      return balancedByUnit(candidates,requested,prior);
    }

    function best() {
      const attempts = load()[cfg.recordKey]?.attempts || [];
      return attempts.length ? Math.max(...attempts.map(attempt => Number(attempt.score) || 0)) : null;
    }

    function missingPrerequisites() {
      return window.KhaemenesAlgebra2Progression?.missingFor?.(cfg) || [];
    }

    function lock(missing) {
      host.innerHTML = `<article class="card"><p class="eyebrow">Strict progression</p><h2>${esc(cfg.title || "Assessment")} is locked</h2><p>Complete the required evidence before opening this assessment.</p><ul>${missing.map(item => `<li>${esc(item)}</li>`).join("")}</ul><p class="notice">A score below ${MASTERY_TARGET ?? 80}% remains learning evidence and does not unlock the next stage.</p></article>`;
      document.getElementById("startAssessment")?.setAttribute("disabled", "true");
      document.getElementById("resetAssessment")?.setAttribute("disabled", "true");
    }

    let set = [], submitted = false;
    function start() {
      submitted = false;
      const missing = missingPrerequisites();
      if (missing.length) {
        lock(missing);
        return;
      }
      const available = pool();
      const requested = Math.min(Number(cfg.count) || 10, available.length);
      set = selectSet(available, requested);
      const token = `a2-${Date.now()}`;
      const fixedPathway = cfg.pathway ? `<p><strong>Pathway:</strong> ${esc(cfg.pathway)}</p>` : "";
      const blueprintNote = cfg.depthBlueprint ? `<p class="notice"><strong>Balanced evidence:</strong> this form samples procedural fluency, multi-step application, representation/interpretation, error analysis, and transfer reasoning. Retakes prioritize questions not used on the immediately prior form.</p>` : "";
      const retrievalNote = cfg.purpose === "retrieval" ? `<p class="notice"><strong>Retention check:</strong> this is low-stakes retrieval evidence and does not unlock or block progression.</p>` : "";
      host.innerHTML = `<article class="card"><div class="form-grid"><label>Learner name or initials<input id="assessmentLearner" maxlength="60" placeholder="Optional local label"></label>${fixedPathway}</div><p class="notice">${esc(cfg.instructions || "Answer every question. Submit once complete, review explanations, and correct missed work.")}</p>${blueprintNote}${retrievalNote}${MASTERY_TARGET == null ? "" : `<p class="notice">Mastery gate: ${MASTERY_TARGET}% is required to unlock the next stage.</p>`}</article>` +
        set.map((question, index) => `<article class="question"><fieldset><legend>${index + 1}. ${esc(question.prompt)}</legend><div class="options">${question.options.map((option, optionIndex) => `<label class="option"><input type="radio" name="${token}-q${index}" value="${optionIndex}"><span>${esc(option)}</span></label>`).join("")}</div><div class="feedback" id="${token}-fb${index}" hidden></div></fieldset></article>`).join("") +
        `<div class="assessment-result"><button class="btn primary" id="submitAssessment" type="button">Submit &amp; Score</button><button class="btn" id="printAssessment" type="button">Print</button><p id="assessmentMessage">Best saved score: ${best() == null ? "—" : `${best()}%`}</p></div>`;
      document.getElementById("submitAssessment")?.addEventListener("click", () => score(token));
      document.getElementById("printAssessment")?.addEventListener("click", () => print());
    }

    function score(token) {
      if (submitted || !set.length) return;
      // No answers, correctness indicators or explanations are revealed until every
      // response has been provided. Partial submissions do not consume an attempt.
      const answers = set.map((question, index) => document.querySelector(`input[name="${token}-q${index}"]:checked`));
      if (answers.some(answer => !answer)) {
        document.getElementById("assessmentMessage").textContent = "Answer every question before scoring. Your answers are still editable.";
        return;
      }
      let right = 0;
      const missed = [];
      set.forEach((question, index) => {
        const selected = answers[index];
        const feedback = document.getElementById(`${token}-fb${index}`);
        const correct = Number(selected.value) === question.answer;
        if (correct) right += 1;
        else missed.push(question.id);
        feedback.hidden = false;
        feedback.className = `feedback ${correct ? "good" : "bad"}`;
        feedback.textContent = `${correct ? "Correct." : "Review."} ${question.explanation}`;
      });
      const scoreValue = Math.round(right / set.length * 100);
      const data = load();
      const key = cfg.recordKey || "assessment";
      data[key] = data[key] || { title: cfg.title || key, attempts: [], masteryTarget: MASTERY_TARGET, mastery: MASTERY_TARGET == null ? null : false, bestScore: null };
      data[key].attempts = Array.isArray(data[key].attempts) ? data[key].attempts : [];
      const mastery = MASTERY_TARGET == null ? null : scoreValue >= MASTERY_TARGET;
      const attempt = {
        result_schema: "khaemenes-algebra2-assessment-v2",
        attempt_id: `a2-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        question_ids: set.map(question => String(question.id)),
        answer_locked: true,
        assessment_id: key,
        title: cfg.title || key,
        submitted_at: new Date().toISOString(),
        score: scoreValue,
        right,
        total: set.length,
        missed,
        learner: document.getElementById("assessmentLearner")?.value.trim() || "",
        pathway: cfg.pathway || document.getElementById("assessmentPathway")?.value || "Core",
        purpose: cfg.purpose || (formalGate ? "mastery" : "practice"),
        dimension_counts: Object.fromEntries(["procedural-fluency","multi-step-application","representation-interpretation","error-analysis","transfer-reasoning"].map(d=>[d,set.filter(q=>q.dimension===d).length])),
        lesson_coverage: [...new Set(set.map(q=>q.lesson).filter(Number.isFinite))].sort((a,b)=>a-b),
        difficulty_counts: Object.fromEntries([1,2,3].map(d=>[d,set.filter(q=>Number(q.difficulty)===d).length])),
        previous_form_overlap: set.filter(q=>priorQuestionIds().has(String(q.id))).length,
        mastery_threshold: MASTERY_TARGET,
        mastery,
        mastery_met: mastery
      };
      data[key].attempts.push(attempt);
      data[key].bestScore = Math.max(Number(data[key].bestScore) || 0, scoreValue);
      data[key].masteryTarget = MASTERY_TARGET;
      data[key].mastery = MASTERY_TARGET == null ? null : data[key].attempts.some(item =>
        item && typeof item.score === "number" && Number.isFinite(item.score) && item.score >= MASTERY_TARGET && item.score <= 100);
      if (!save(data)) {
        // A graded-but-unsaved attempt must not become editable for a second score.
        // Retrying requires starting a new randomized attempt; nothing was credited.
        submitted = true;
        for (const radio of host.querySelectorAll?.('input[type="radio"]') || []) radio.disabled = true;
        document.getElementById("submitAssessment")?.setAttribute("disabled", "true");
        document.getElementById("assessmentMessage").textContent = "Assessment could not be saved. No mastery credit was granted. Preserve your work, restore storage, and start a new attempt.";
        return;
      }
      submitted = true;
      for (const radio of host.querySelectorAll?.('input[type="radio"]') || []) radio.disabled = true;
      document.getElementById("assessmentMessage").innerHTML = `<span class="score">${scoreValue}%</span> · ${right}/${set.length} · Best ${data[key].bestScore}%${mastery === true ? " · Mastery demonstrated" : mastery === false ? " · Review, correct, and retake" : " · Diagnostic evidence recorded"}`;
      const priorNav=document.getElementById("academyNextStep");priorNav?.remove();
      const panel=document.createElement("div");panel.id="academyNextStep";panel.className="card";panel.style.marginTop="14px";panel.setAttribute("aria-label","Next learning step");
      const heading=document.createElement("p");heading.textContent="Next learning step";panel.append(heading);
      const add=(label,href)=>{const a=document.createElement("a");a.className="btn";a.href=href;a.textContent=label;a.style.margin="5px 10px 5px 0";panel.append(a);};
      const unitMatch=location.pathname.match(/unit-(\d{2})/),unit=unitMatch?Number(unitMatch[1]):0;
      if(MASTERY_TARGET==null){add("Continue to Algebra II units","../index.html#units");}
      else if(mastery===true){
        add("Return to course pathway",unit?"../../../index.html#units":"../index.html#units");
        if(unit===6)add("Continue to Midterm","../../../assessments/midterm.html");
        else if(unit===13)add("Continue to Final","../../../assessments/final.html");
        else if(unit&&unit<13)add("Begin next unit","../../unit-"+String(unit+1).padStart(2,"0")+"/");
      }
      else {add("Review unit lessons",unit?"../index.html":"../index.html#units");}
      document.getElementById("assessmentMessage")?.after(panel);
      window.KhaemenesMathAssessmentDirective?.show({kind:key==="midterm"?"midterm":key==="final"?"final":unit?"unit":MASTERY_TARGET==null?"readiness":"assessment",score:scoreValue,mastered:MASTERY_TARGET==null?scoreValue>=80:mastery===true,unit:unit||undefined});
      document.getElementById("submitAssessment")?.setAttribute("disabled", "true");
    }

    const missing = missingPrerequisites();
    if (missing.length) {
      lock(missing);
      return;
    }
    document.getElementById("startAssessment")?.addEventListener("click", start);
    document.getElementById("resetAssessment")?.addEventListener("click", () => { if (confirm("Start a new attempt? Saved history remains intact.")) start(); });
    start();
  }

  withDepthBanks(() => withProgression(boot));
})();

/* Academy-first assessment identity; no grading or gate changes. */
;(()=>{const apply=()=>{const brand=document.querySelector(".site-header .brand-copy");if(!brand)return;const title=brand.querySelector("strong"),subtitle=brand.querySelector("small");if(title)title.textContent="Khaemenes Academy";if(subtitle)subtitle.textContent="Algebra II · Assessment";};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",apply,{once:true});else apply()})();


/* Shared mathematics storage/evidence hardening for assessment surfaces. */
;(()=>{
 if(window.KhaemenesMathHardeningLoader||document.getElementById("khaeMathHardeningAssessmentLoader"))return;
 const current=document.currentScript;
 const loader=document.createElement("script");
 loader.id="khaeMathHardeningAssessmentLoader";
 loader.src=new URL("../../assets/math-hardening-loader-v1.js",current?.src||location.href).href;
 loader.async=false;
 loader.onerror=()=>console.warn("Mathematics assessment hardening layer unavailable; assessment remains usable under existing safeguards.");
 (document.head||document.documentElement).appendChild(loader);
})();


/* Algebra II Academy screen readability floor. Print rules remain independent. */
;(()=>{
 if(document.getElementById("algebra2MinScreenTypeV1"))return;
 const style=document.createElement("style");
 style.id="algebra2MinScreenTypeV1";
 style.textContent='@media screen{html:root:root body{font-size:16px!important}html:root:root body :is(button,input,select,textarea,a,p,li,label,summary){font-size:max(16px,1em)}html:root:root body :is(button,input,select,textarea){min-height:44px}}';
 (document.head||document.documentElement).appendChild(style);
})();
