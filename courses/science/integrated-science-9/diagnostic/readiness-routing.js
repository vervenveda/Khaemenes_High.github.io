"use strict";
(() => {
  const U00_KEY = "khaemenes_science_u00_v1";
  const NAIB_KEY = "khaemenes_naib_readiness_science9_v1";
  const ASSESSMENT_ID = "science9-readiness-gateway";
  const ASSESSMENT_VERSION = "2.0";
  const MASTERY = 80;
  const ESSENTIAL_STRANDS = ["Scientific practices", "Measurement", "Data and evidence"];
  const ESSENTIAL_MIN = 75;

  const $ = (selector) => document.querySelector(selector);
  const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const percent = (correct, total) => total ? Math.round((correct / total) * 1000) / 10 : 0;

  function analyze(result) {
    const strandScores = {};
    Object.entries(result.domainScores || {}).forEach(([name, data]) => {
      strandScores[name] = {
        correct: data.correct,
        total: data.total,
        percent: percent(data.correct, data.total)
      };
    });

    const overallPercent = percent(result.score, result.total);
    const essentialGaps = ESSENTIAL_STRANDS.filter(name => !strandScores[name] || strandScores[name].percent < ESSENTIAL_MIN);
    const refreshPriorities = Object.entries(strandScores)
      .filter(([, data]) => data.percent < MASTERY)
      .sort((a, b) => a[1].percent - b[1].percent)
      .map(([name]) => name);
    const strengths = Object.entries(strandScores)
      .filter(([, data]) => data.percent >= MASTERY)
      .map(([name]) => name);

    let route = "unit_0_refresher";
    if (overallPercent >= MASTERY && essentialGaps.length === 0) {
      route = refreshPriorities.length ? "advance_with_targeted_refresh" : "advance";
    }

    return { overallPercent, strandScores, essentialGaps, refreshPriorities, strengths, route };
  }

  function buildRecord(result, analysis) {
    const history = readJSON(NAIB_KEY, []);
    return {
      profile_type: "readiness",
      course_id: "integrated-science-9",
      assessment_id: ASSESSMENT_ID,
      assessment_version: ASSESSMENT_VERSION,
      attempt: history.length + 1,
      timestamp: new Date().toISOString(),
      raw_score: result.score,
      total: result.total,
      overall_percent: analysis.overallPercent,
      strand_scores: analysis.strandScores,
      strengths: analysis.strengths,
      refresh_priorities: analysis.refreshPriorities,
      essential_gaps: analysis.essentialGaps,
      route: analysis.route,
      correction_status: analysis.route === "unit_0_refresher" ? "required_before_unit_0_exit" : "not_required_for_entry",
      note: "Readiness is stored separately from course mastery, retention, and refresh records. It never erases prior course completion."
    };
  }

  function renderRouting(record) {
    const recommendation = $("#recommendation");
    const message = $("#resultMessage");
    const note = $("#routeNote");
    const button = $("#routeButton");
    if (!recommendation || !message || !note || !button) return;

    const needsBridge = record.route === "unit_0_refresher";
    if (needsBridge) {
      recommendation.textContent = "Science Foundations recommended";
      message.textContent = `Readiness: ${record.overall_percent}%. NAIB recommends the six-week Science Foundations Bridge before Official Unit 1. This is support, not a permanent label.`;
      note.innerHTML = `<strong>Supported 42-week pathway</strong><p>Refresh priorities: ${record.refresh_priorities.join(", ") || "general foundation review"}. Complete Unit 0 at ≥80% with required reasoning corrections, then proceed directly to Official Unit 1.</p>`;
      button.textContent = "Open Science Foundations";
      button.href = "../foundations/";
    } else {
      recommendation.textContent = record.route === "advance" ? "Ready for Official Unit 1" : "Ready for Unit 1 with targeted refresh";
      message.textContent = `Readiness: ${record.overall_percent}%. Essential prerequisite strands meet the readiness rule. The learner may enter the 36-week core course.`;
      note.innerHTML = `<strong>Core 36-week pathway</strong><p>${record.refresh_priorities.length ? `Optional refresh priorities: ${record.refresh_priorities.join(", ")}.` : "No prerequisite strand requires the six-week bridge."} Readiness does not alter any earlier course-completion record.</p>`;
      button.textContent = "Enter Official Unit 1";
      button.href = "../units/unit-01/";
    }
  }

  function captureAfterSubmit() {
    setTimeout(() => {
      const state = readJSON(U00_KEY, {});
      const result = state.diagnostic;
      if (!result || !result.completed) return;
      const analysis = analyze(result);
      const record = buildRecord(result, analysis);
      const history = readJSON(NAIB_KEY, []);
      history.push(record);
      writeJSON(NAIB_KEY, history);

      state.readinessRoute = record.route;
      state.readinessPercent = record.overall_percent;
      state.readinessProfileUpdatedAt = record.timestamp;
      state.supportedPathway = record.route === "unit_0_refresher";
      writeJSON(U00_KEY, state);
      renderRouting(record);
    }, 0);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const submit = $("#submitButton");
    if (submit) submit.addEventListener("click", captureAfterSubmit);

    const history = readJSON(NAIB_KEY, []);
    const latest = history[history.length - 1];
    if (latest && $("#results") && !$("#results").hidden) renderRouting(latest);
  });
})();