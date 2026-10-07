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
    const all = cfg.source === "diagnostic" ? window.ALGEBRA2_DIAGNOSTIC : window.ALGEBRA2_QUESTIONS;
    const host = document.getElementById("assessmentRoot");
    if (!host || !Array.isArray(all)) return;

    const KEY = "khaemenes-algebra2-assessment-records-v1";
    const formalGate = /^(u\d{2}-mastery|midterm|final)$/.test(String(cfg.recordKey || ""));
    const MASTERY_TARGET = cfg.source === "diagnostic" || !formalGate ? null : Number(cfg.masteryTarget ?? 80);
    const esc = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
    const load = () => window.KhaemenesAlgebra2Progression?.readJSON?.(KEY, {}) || {};
    const save = value => { window.KhaemenesAlgebra2Progression?.writeJSON?.(KEY, value); };
    const shuffle = values => { const result = [...values]; for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };

    function pool() {
      let result = [...all];
      if (Array.isArray(cfg.units) && cfg.units.length) result = result.filter(question => cfg.units.includes(question.unit));
      return result;
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

    let set = [];
    function start() {
      const missing = missingPrerequisites();
      if (missing.length) {
        lock(missing);
        return;
      }
      const available = pool();
      set = shuffle(available).slice(0, Math.min(Number(cfg.count) || 10, available.length));
      const token = `a2-${Date.now()}`;
      host.innerHTML = `<article class="card"><div class="form-grid"><label>Learner name or initials<input id="assessmentLearner" maxlength="60" placeholder="Optional local label"></label><label>Pathway<select id="assessmentPathway"><option>Foundation</option><option selected>Core</option><option>Extended</option></select></label></div><p class="notice">${esc(cfg.instructions || "Answer every question. Submit once complete, review explanations, and correct missed work.")}</p>${MASTERY_TARGET == null ? "" : `<p class="notice">Mastery gate: ${MASTERY_TARGET}% is required to unlock the next stage.</p>`}</article>` +
        set.map((question, index) => `<article class="question"><fieldset><legend>${index + 1}. ${esc(question.prompt)}</legend><div class="options">${question.options.map((option, optionIndex) => `<label class="option"><input type="radio" name="${token}-q${index}" value="${optionIndex}"><span>${esc(option)}</span></label>`).join("")}</div><div class="feedback" id="${token}-fb${index}" hidden></div></fieldset></article>`).join("") +
        `<div class="assessment-result"><button class="btn primary" id="submitAssessment" type="button">Submit &amp; Score</button><button class="btn" id="printAssessment" type="button">Print</button><p id="assessmentMessage">Best saved score: ${best() == null ? "—" : `${best()}%`}</p></div>`;
      document.getElementById("submitAssessment")?.addEventListener("click", () => score(token));
      document.getElementById("printAssessment")?.addEventListener("click", () => print());
    }

    function score(token) {
      let right = 0;
      let complete = true;
      const missed = [];
      set.forEach((question, index) => {
        const selected = document.querySelector(`input[name="${token}-q${index}"]:checked`);
        const feedback = document.getElementById(`${token}-fb${index}`);
        feedback.hidden = false;
        if (!selected) {
          complete = false;
          feedback.className = "feedback bad";
          feedback.textContent = "Choose an answer.";
          return;
        }
        const correct = Number(selected.value) === question.answer;
        if (correct) right += 1;
        else missed.push(question.id);
        feedback.className = `feedback ${correct ? "good" : "bad"}`;
        feedback.textContent = `${correct ? "Correct." : "Review."} ${question.explanation}`;
      });
      if (!complete) {
        document.getElementById("assessmentMessage").textContent = "Answer every question before scoring.";
        return;
      }
      const scoreValue = Math.round(right / set.length * 100);
      const data = load();
      const key = cfg.recordKey || "assessment";
      data[key] = data[key] || { title: cfg.title || key, attempts: [], masteryTarget: MASTERY_TARGET, mastery: MASTERY_TARGET == null ? null : false, bestScore: null };
      data[key].attempts = Array.isArray(data[key].attempts) ? data[key].attempts : [];
      const mastery = MASTERY_TARGET == null ? null : scoreValue >= MASTERY_TARGET;
      const attempt = {
        result_schema: "khaemenes-algebra2-assessment-v2",
        assessment_id: key,
        title: cfg.title || key,
        submitted_at: new Date().toISOString(),
        score: scoreValue,
        right,
        total: set.length,
        missed,
        learner: document.getElementById("assessmentLearner")?.value.trim() || "",
        pathway: document.getElementById("assessmentPathway")?.value || "Core",
        mastery_threshold: MASTERY_TARGET,
        mastery,
        mastery_met: mastery
      };
      data[key].attempts.push(attempt);
      data[key].bestScore = Math.max(Number(data[key].bestScore) || 0, scoreValue);
      data[key].masteryTarget = MASTERY_TARGET;
      data[key].mastery = MASTERY_TARGET == null ? null : data[key].attempts.some(item => item.mastery === true || item.mastery_met === true || Number(item.score) >= MASTERY_TARGET);
      save(data);
      document.getElementById("assessmentMessage").innerHTML = `<span class="score">${scoreValue}%</span> · ${right}/${set.length} · Best ${data[key].bestScore}%${mastery === true ? " · Mastery demonstrated" : mastery === false ? " · Review, correct, and retake" : " · Diagnostic evidence recorded"}`;
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

  withProgression(boot);
})();
