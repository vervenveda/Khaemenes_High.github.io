(() => {
  "use strict";

  const config = window.ASSESSMENT_CONFIG || {};
  const scriptEl = document.currentScript;
  const coreSrc = new URL("assessment-engine-core.js", scriptEl?.src || location.href).href;
  const CLASSIFICATION = "public-self-check-nonconfidential";
  const RESULT_SCHEMA = "khaemenes-unit-mastery-result-v4";
  const RECORD_SCHEMA = "1.0";
  const HISTORY_LIMIT = 24;
  const COURSE = Object.freeze({ id: "KH-MATH-PA", title: "Khaemenes Global Pre-Algebra" });
  const UNIT = Object.freeze({ id: "KH-MATH-PA-U01", number: 1, title: "Number Systems, Factors & Estimation" });
  let beforeSubmit = null;
  let beforeReset = null;

  function readJSON(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) ?? fallback : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  }

  function slug(value) {
    return String(value || "general")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "general";
  }

  function enrichDiagnostics(result) {
    if (!result || typeof result !== "object") return result;
    const domains = {};
    const skills = {};
    const items = [];
    (config.questions || []).forEach((question, index) => {
      const domain = question.domain || "General";
      const skill = question.skill || slug(domain);
      const correct = Number(result.answers?.[index]) === Number(question.answer);
      domains[domain] ??= { correct: 0, total: 0 };
      domains[domain].total += 1;
      if (correct) domains[domain].correct += 1;
      skills[skill] ??= { correct: 0, total: 0 };
      skills[skill].total += 1;
      if (correct) skills[skill].correct += 1;
      items.push({
        id: question.id || `KH-MATH-PA-U01-M${String(index + 1).padStart(2, "0")}`,
        domain,
        skill,
        lesson: question.lesson || null,
        correct
      });
    });
    result.domains = Object.keys(domains).length ? domains : (result.domains || {});
    result.skills = skills;
    result.item_evidence = items;
    result.assessment_version = config.assessment_version || result.assessment_version || "1.0";
    result.resource_id = config.resource_id || result.resource_id || "KH-MATH-PA-U01-MASTERY";
    result.unit_id = "KH-MATH-PA-U01";
    result.program_signal = {
      schema: "khaemenes-curriculum-signal-v1",
      resource_id: result.resource_id,
      assessment_version: result.assessment_version,
      unit: result.unit_id,
      score_summary: {
        correct: Number(result.score) || 0,
        total: Number(result.total) || (config.questions || []).length,
        percent: Number(result.percent) || 0,
        threshold: Number(result.threshold ?? config.threshold) || 80,
        passed: Number(result.percent) >= (Number(result.threshold ?? config.threshold) || 80)
      },
      domains: result.domains,
      skills,
      item_outcomes: items.map(item => ({ ...item })),
      privacy: "No learner name, family identifier, free-response text, browser identifier, credentials, or answer keys are included in this curriculum-quality signal."
    };
    return result;
  }

  function compactAttempt(result) {
    return {
      score: Number(result?.score) || 0,
      total: Number(result?.total) || 0,
      percent: Number(result?.percent) || 0,
      passed: Number(result?.percent) >= (Number(result?.threshold ?? config.threshold) || 80),
      completed_at: result?.completed_at || null,
      domains: result?.domains || {},
      skills: result?.skills || {},
      item_evidence: Array.isArray(result?.item_evidence) ? result.item_evidence : []
    };
  }

  function normalizePrior(raw) {
    if (!raw || typeof raw !== "object" || !Number.isFinite(Number(raw.percent))) return null;
    const threshold = Number(raw.threshold ?? config.threshold) || 80;
    const percent = Math.max(0, Math.min(100, Number(raw.percent)));
    if (raw.result_schema === RESULT_SCHEMA && raw.attempt_history) return enrichDiagnostics(raw);
    const at = raw.completed_at || new Date().toISOString();
    const mastered = percent >= threshold;
    const enriched = enrichDiagnostics({ ...raw, percent, threshold, completed_at: at });
    return {
      ...enriched,
      result_schema: RESULT_SCHEMA,
      threshold,
      latest_passed: percent >= threshold,
      passed: mastered,
      mastery: { threshold, mastered, mastered_at: mastered ? at : null },
      attempt_history: {
        firstScore: percent,
        latestScore: percent,
        bestScore: percent,
        attemptCount: 1,
        masteredAt: mastered ? at : null,
        bestCompletedAt: at,
        attempts: [compactAttempt(enriched)]
      }
    };
  }

  function mergeCurrentWithPrior(currentRaw, priorRaw) {
    const current = normalizePrior(currentRaw);
    if (!current) return normalizePrior(priorRaw);
    const prior = normalizePrior(priorRaw);
    if (!prior) return current;
    const threshold = Number(current.threshold ?? config.threshold) || 80;
    const latest = Number(current.percent);
    const priorHistory = prior.attempt_history || {};
    const previousBest = Number(priorHistory.bestScore);
    const bestScore = Number.isFinite(previousBest) ? Math.max(previousBest, latest) : latest;
    const masteredAt = priorHistory.masteredAt || prior.mastery?.mastered_at || (latest >= threshold ? current.completed_at : null);
    const attempts = [...(priorHistory.attempts || []), compactAttempt(current)].slice(-HISTORY_LIMIT);
    return {
      ...current,
      result_schema: RESULT_SCHEMA,
      latest_passed: latest >= threshold,
      passed: bestScore >= threshold,
      mastery: { threshold, mastered: bestScore >= threshold, mastered_at: masteredAt },
      attempt_history: {
        firstScore: Number.isFinite(Number(priorHistory.firstScore)) ? Number(priorHistory.firstScore) : Number(prior.percent),
        latestScore: latest,
        bestScore,
        attemptCount: Number(priorHistory.attemptCount || 1) + 1,
        masteredAt,
        bestCompletedAt: latest > previousBest ? current.completed_at : (priorHistory.bestCompletedAt || prior.completed_at || null),
        attempts
      }
    };
  }

  function hardenStoredResult(prior = null) {
    if (!config.storage_key) return null;
    const current = readJSON(config.storage_key, null);
    const hardened = prior ? mergeCurrentWithPrior(current, prior) : normalizePrior(current);
    if (!hardened) return null;
    enrichDiagnostics(hardened);
    hardened.assessment_classification = CLASSIFICATION;
    hardened.trust = {
      classification: "browser-local-self-scored",
      authoritative: false,
      confidential: false,
      cryptographically_verified: false,
      digitally_signed: false,
      editable_storage: true,
      review_required: true
    };
    writeJSON(config.storage_key, hardened);
    return hardened;
  }

  function currentDraft() {
    const key = config.storage_key ? `${config.storage_key}-draft` : null;
    const stored = key ? readJSON(key, {}) || {} : {};
    const answers = {};
    const reasoning = {};
    (config.questions || []).forEach((_, index) => {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (selected) answers[index] = Number(selected.value);
    });
    (config.reasoning_prompts || []).forEach((_, index) => {
      const field = document.getElementById(`reasoning-${index}`);
      reasoning[index] = field ? field.value.trim() : String(stored.reasoning?.[index] || "");
    });
    return { answers: Object.keys(answers).length ? answers : (stored.answers || {}), reasoning, saved_at: stored.saved_at || null };
  }

  function trust(note, origin = "canonical_course_engine_evidence") {
    return {
      class: "unscoped_browser_unit_evidence",
      evidence_origin: origin,
      storage: "browser_local_course_evidence",
      learner_scoped: false,
      independently_authenticated: false,
      official_record_without_validation: false,
      assessment_classification: CLASSIFICATION,
      note
    };
  }

  function assessmentResultRecord(result) {
    const threshold = Number(result?.mastery?.threshold ?? result?.threshold ?? config.threshold) || 80;
    const h = result?.attempt_history || {};
    const latest = Number.isFinite(Number(h.latestScore)) ? Number(h.latestScore) : Number(result?.percent);
    const best = Number.isFinite(Number(h.bestScore)) ? Number(h.bestScore) : latest;
    const mastered = Number.isFinite(best) ? best >= threshold : false;
    return {
      schema_version: RECORD_SCHEMA,
      record_type: "khaemenes.assessment.result-record",
      exported_at: new Date().toISOString(),
      trust: trust("This public browser assessment is self-scored local evidence. It is not bound to a learner identity and must not be silently attributed to a learner profile or treated as a validated institutional record."),
      course: COURSE,
      unit: UNIT,
      assessment: { id: config.storage_key || "khaemenes-prealgebra-u01-mastery-v1", resource_id: result?.resource_id || "KH-MATH-PA-U01-MASTERY", title: config.title || "Unit 1 Mastery Check", pathway: config.pathway || "Cumulative Assessment", assessment_version: result?.assessment_version || "1.0", classification: CLASSIFICATION },
      mastery: {
        threshold,
        state: mastered ? "mastered" : (Number.isFinite(latest) ? "developing" : "not_assessed"),
        mastered,
        mastered_at: h.masteredAt || result?.mastery?.mastered_at || null,
        first_score: Number.isFinite(Number(h.firstScore)) ? Number(h.firstScore) : latest,
        latest_score: Number.isFinite(latest) ? latest : null,
        best_score: Number.isFinite(best) ? best : null,
        attempt_count: Number(h.attemptCount) || (Number.isFinite(latest) ? 1 : 0),
        latest_passed: Number.isFinite(latest) ? latest >= threshold : false,
        score: Number.isFinite(Number(result?.score)) ? Number(result.score) : null,
        total: Number.isFinite(Number(result?.total)) ? Number(result.total) : null,
        completed_at: result?.completed_at || null
      },
      diagnostic_evidence: {
        domains: result?.domains || {},
        skills: result?.skills || {},
        items: Array.isArray(result?.item_evidence) ? result.item_evidence : [],
        program_signal: result?.program_signal || null,
        answers: result?.answers || {}
      },
      learner_created_evidence: { reasoning: result?.reasoning || {} },
      attempt_history: Array.isArray(h.attempts) ? h.attempts : [],
      source: { storage_key: config.storage_key || null, environment: "public_browser_localStorage", result_schema: RESULT_SCHEMA }
    };
  }

  function assessmentDraftRecord() {
    const draft = currentDraft();
    return {
      schema_version: RECORD_SCHEMA,
      record_type: "khaemenes.assessment.draft-record",
      exported_at: new Date().toISOString(),
      trust: trust("This is an unfinished assessment draft. It is not scored mastery evidence and must never grant progression or mastery.", "learner_created_evidence"),
      course: COURSE,
      unit: UNIT,
      assessment: { id: config.storage_key || "khaemenes-prealgebra-u01-mastery-v1", title: config.title || "Unit 1 Mastery Check", pathway: config.pathway || "Cumulative Assessment" },
      draft,
      mastery: { threshold: Number(config.threshold) || 80, state: "not_assessed", may_grant_mastery: false },
      source: { storage_key: config.storage_key ? `${config.storage_key}-draft` : null, environment: "public_browser_localStorage" }
    };
  }

  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 666);
  }

  function exportNormalized(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const result = hardenStoredResult();
    if (result) downloadJSON("khaemenes-prealgebra-u01-mastery-result.json", assessmentResultRecord(result));
    else downloadJSON("khaemenes-prealgebra-u01-mastery-draft.json", assessmentDraftRecord());
  }

  function updateEligibility() {
    const box = document.getElementById("masteryEligibility");
    if (!box) return;
    const progress = readJSON("khaemenes-prealgebra-unit01-progress-v1", {}) || {};
    const scores = progress.lessonScores || {};
    const attempts = progress.lessonAttempts || {};
    const completed = new Set(Array.isArray(progress.completedLessons) ? progress.completedLessons : []);
    const ids = ["l01", "l02", "l03", "l04", "l05", "l06"];
    const ready = ids.every(id => {
      const best = Number(attempts?.[id]?.bestScore);
      return (Number.isFinite(best) && best >= 80) || completed.has(id) || Number(scores[id]) >= 80;
    });
    box.textContent = ready
      ? "Lesson gate complete: all six lesson practices have demonstrated at least 80% mastery. You are ready for the Unit 1 Mastery Check."
      : "Recommended before submitting: demonstrate at least 80% mastery in all six lesson practices. You may still open and review this assessment.";
    box.style.borderLeftColor = ready ? "var(--green)" : "var(--gold)";
  }

  function decorate() {
    const submit = document.getElementById("submitButton");
    const exportButton = document.getElementById("exportButton");
    const resultMessage = document.getElementById("resultMessage");
    if (submit && /submit/i.test(submit.textContent)) submit.textContent = "Submit & Self-Check";
    if (exportButton) exportButton.textContent = "Export Learning Record";
    const hero = document.querySelector("main .hero .wrap");
    if (hero && !document.getElementById("masteryTrustNotice")) {
      const notice = document.createElement("p");
      notice.id = "masteryTrustNotice";
      notice.className = "notice";
      notice.innerHTML = "<strong>Learning mastery check:</strong> this public self-check supports the 80% learning gate, corrections, and progress review. Browser-local results are editable and are not confidential, digitally signed, or independently authenticated academic records.";
      hero.appendChild(notice);
    }
    const stored = hardenStoredResult();
    if (resultMessage && stored?.attempt_history) {
      const h = stored.attempt_history;
      resultMessage.textContent = `Saved locally · latest ${h.latestScore ?? "—"}% · best ${h.bestScore ?? "—"}% · ${h.attemptCount || 0} attempt(s).`;
    }
    updateEligibility();
  }

  function installGuards() {
    hardenStoredResult();
    updateEligibility();
    const submit = document.getElementById("submitButton");
    const reset = document.getElementById("resetButton");
    const exportButton = document.getElementById("exportButton");

    submit?.addEventListener("click", () => { beforeSubmit = hardenStoredResult(); }, true);
    submit?.addEventListener("click", () => {
      setTimeout(() => {
        const merged = hardenStoredResult(beforeSubmit);
        beforeSubmit = null;
        decorate();
        if (merged?.attempt_history && document.getElementById("resultSummary")) {
          const h = merged.attempt_history;
          const latest = Number(h.latestScore);
          const best = Number(h.bestScore);
          const threshold = Number(merged.threshold ?? config.threshold) || 80;
          document.getElementById("resultSummary").textContent = `${latest}% latest · ${best}% best · threshold ${threshold}% · attempt ${h.attemptCount}. ${latest >= threshold ? "You met the mastery standard on this attempt." : best >= threshold ? "Earlier mastery is preserved; use this retake to target weak areas." : "Review the lowest domains, practice again, and retake when ready."}`;
          const title = document.getElementById("resultTitle");
          if (title && latest < threshold && best >= threshold) title.textContent = "Mastery Preserved";
        }
      }, 0);
    });

    reset?.addEventListener("click", () => { beforeReset = hardenStoredResult(); }, true);
    reset?.addEventListener("click", () => {
      setTimeout(() => {
        if (beforeReset && config.storage_key && !localStorage.getItem(config.storage_key)) writeJSON(config.storage_key, beforeReset);
        beforeReset = null;
        decorate();
        const message = document.getElementById("resultMessage");
        if (message) message.textContent = "Form reset. Saved cumulative mastery evidence was preserved.";
      }, 0);
    });

    exportButton?.addEventListener("click", exportNormalized, true);
    decorate();
  }

  const core = document.createElement("script");
  core.src = coreSrc;
  core.async = false;
  core.onload = installGuards;
  core.onerror = () => {
    const message = document.getElementById("resultMessage");
    if (message) message.textContent = "Assessment engine could not load. Do not submit until the page is refreshed successfully.";
  };
  document.head.appendChild(core);
})();
