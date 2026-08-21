"use strict";

const config = window.ASSESSMENT_CONFIG || {};
const THEME_KEY = "khaemenes-theme";
const RESULT_SCHEMA = "khaemenes-unit-mastery-result-v4";
const HISTORY_LIMIT = 24;
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

const themeToggle = $("#themeToggle");
if (themeToggle) themeToggle.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));
setTheme(localStorage.getItem(THEME_KEY) || (matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark"));

function unitId() {
  if (config.unit_id) return String(config.unit_id);
  const resourceMatch = String(config.resource_id || "").match(/KH-MATH-PA-U(\d{1,2})/i);
  const storageMatch = String(config.storage_key || "").match(/-u(\d{1,2})-/i);
  const n = Number(resourceMatch?.[1] || storageMatch?.[1]);
  return Number.isFinite(n) && n > 0 ? `KH-MATH-PA-U${String(n).padStart(2, "0")}` : "KH-MATH-PA-UXX";
}

function slug(value) {
  return String(value || "general")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "general";
}

function currentAnswers() {
  const answers = {};
  (config.questions || []).forEach((_, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected) answers[index] = Number(selected.value);
  });
  return answers;
}

function currentReasoning() {
  const reasoning = {};
  (config.reasoning_prompts || []).forEach((_, index) => {
    const field = $(`#reasoning-${index}`);
    reasoning[index] = field ? field.value.trim() : "";
  });
  return reasoning;
}

function draftRecord() {
  return {
    answers: currentAnswers(),
    reasoning: currentReasoning(),
    saved_at: new Date().toISOString()
  };
}

function autosaveDraft() {
  if (!config.storage_key) return;
  saveJSON(`${config.storage_key}-draft`, draftRecord());
}

function render() {
  const draft = loadJSON(`${config.storage_key}-draft`, { answers: {}, reasoning: {} }) || { answers: {}, reasoning: {} };
  const questionList = $("#questionList");
  if (questionList) {
    questionList.innerHTML = (config.questions || []).map((q, i) => `
      <article class="question"><fieldset>
        <legend>${i + 1}. ${escapeHTML(q.prompt)}</legend>
        <div class="options">${(q.options || []).map((option, j) => `
          <label class="option"><input type="radio" name="q${i}" value="${j}" ${Number(draft.answers?.[i]) === j ? "checked" : ""}><span>${escapeHTML(option)}</span></label>
        `).join("")}</div>
        ${config.show_hints && q.hint ? `<button class="hint-button" type="button" data-hint="${i}">Show hint</button><p class="hint" id="hint-${i}" hidden>${escapeHTML(q.hint)}</p>` : ""}
        <div class="feedback" id="feedback-${i}" hidden></div>
      </fieldset></article>`).join("");
  }

  const reasoningSection = $("#reasoningSection");
  if (reasoningSection) {
    const prompts = config.reasoning_prompts || [];
    if (prompts.length) {
      reasoningSection.hidden = false;
      reasoningSection.innerHTML = `<h2>Reasoning reflection</h2><div class="reasoning-grid">${prompts.map((prompt, i) => `<div class="field"><label for="reasoning-${i}">${escapeHTML(prompt)}</label><textarea id="reasoning-${i}">${escapeHTML(draft.reasoning?.[i] || "")}</textarea></div>`).join("")}</div>`;
    } else {
      reasoningSection.hidden = true;
      reasoningSection.innerHTML = "";
    }
  }

  updateDots();
  const existing = normalizeStored(loadJSON(config.storage_key, null));
  if (existing) {
    saveJSON(config.storage_key, existing);
    showResult(existing, false);
    revealFeedback(existing);
  }
}

function updateDots() {
  const grid = $("#dotGrid");
  if (!grid) return;
  const answers = currentAnswers();
  grid.innerHTML = (config.questions || []).map((_, i) => `<span class="dot ${Object.prototype.hasOwnProperty.call(answers, i) ? "answered" : ""}">${i + 1}</span>`).join("");
}

function calculateAttempt() {
  const questions = config.questions || [];
  const answers = currentAnswers();
  if (Object.keys(answers).length !== questions.length) return null;

  let correct = 0;
  const domains = {};
  const skills = {};
  const items = [];
  const uid = unitId();

  questions.forEach((q, i) => {
    const ok = answers[i] === Number(q.answer);
    if (ok) correct += 1;
    const domain = q.domain || "General";
    const skill = q.skill || slug(domain);
    domains[domain] ??= { correct: 0, total: 0 };
    domains[domain].total += 1;
    if (ok) domains[domain].correct += 1;
    skills[skill] ??= { correct: 0, total: 0 };
    skills[skill].total += 1;
    if (ok) skills[skill].correct += 1;
    items.push({
      id: q.id || `${uid}-M${String(i + 1).padStart(2, "0")}`,
      domain,
      skill,
      lesson: q.lesson || null,
      correct: ok
    });
  });

  const total = questions.length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const threshold = Number(config.threshold) || 80;
  const latestPassed = percent >= threshold;
  const completedAt = new Date().toISOString();

  return {
    title: config.title || "Assessment",
    pathway: config.pathway || "Cumulative Assessment",
    score: correct,
    total,
    percent,
    threshold,
    latest_passed: latestPassed,
    answers,
    reasoning: currentReasoning(),
    domains,
    skills,
    item_evidence: items,
    completed_at: completedAt,
    assessment_version: config.assessment_version || "1.0",
    resource_id: config.resource_id || `${uid}-MASTERY`,
    unit_id: uid,
    program_signal: {
      schema: "khaemenes-curriculum-signal-v1",
      resource_id: config.resource_id || `${uid}-MASTERY`,
      assessment_version: config.assessment_version || "1.0",
      unit: uid,
      score_summary: { correct, total, percent, threshold, passed: latestPassed },
      domains,
      skills,
      item_outcomes: items.map(item => ({ ...item })),
      privacy: "No learner name, family identifier, free-response text, browser identifier, credentials, or answer keys are included in this curriculum-quality signal."
    }
  };
}

function compactAttempt(attempt) {
  return {
    score: Number(attempt.score) || 0,
    total: Number(attempt.total) || 0,
    percent: Number(attempt.percent) || 0,
    passed: Boolean(attempt.latest_passed ?? attempt.passed),
    completed_at: attempt.completed_at || null,
    domains: attempt.domains || {},
    skills: attempt.skills || {},
    item_evidence: Array.isArray(attempt.item_evidence) ? attempt.item_evidence : []
  };
}

function normalizeStored(raw) {
  if (!raw || typeof raw !== "object") return null;
  const threshold = Number(raw.threshold ?? config.threshold) || 80;

  if (raw.result_schema === RESULT_SCHEMA && raw.mastery && raw.attempt_history) {
    const best = Number(raw.attempt_history.bestScore);
    raw.mastery.threshold = threshold;
    raw.mastery.mastered = Number.isFinite(best) ? best >= threshold : Boolean(raw.mastery.mastered);
    raw.passed = Boolean(raw.mastery.mastered);
    return raw;
  }

  if (!Number.isFinite(Number(raw.percent))) return null;
  const percent = Math.max(0, Math.min(100, Number(raw.percent)));
  const completedAt = raw.completed_at || new Date().toISOString();
  const migratedAttempt = compactAttempt({ ...raw, percent, latest_passed: percent >= threshold, completed_at: completedAt });
  const mastered = percent >= threshold;

  return {
    ...raw,
    result_schema: RESULT_SCHEMA,
    unit_id: raw.unit_id || unitId(),
    threshold,
    latest_passed: percent >= threshold,
    passed: mastered,
    mastery: {
      threshold,
      mastered,
      mastered_at: mastered ? completedAt : null
    },
    attempt_history: {
      firstScore: percent,
      latestScore: percent,
      bestScore: percent,
      attemptCount: 1,
      masteredAt: mastered ? completedAt : null,
      bestCompletedAt: completedAt,
      attempts: [migratedAttempt]
    }
  };
}

function mergeAttempt(attempt) {
  const prior = normalizeStored(loadJSON(config.storage_key, null));
  const threshold = Number(config.threshold) || 80;
  const previousHistory = prior?.attempt_history || null;
  const firstScore = previousHistory ? Number(previousHistory.firstScore) : attempt.percent;
  const previousBest = previousHistory ? Number(previousHistory.bestScore) : null;
  const bestScore = Number.isFinite(previousBest) ? Math.max(previousBest, attempt.percent) : attempt.percent;
  const mastered = bestScore >= threshold;
  const priorMasteredAt = previousHistory?.masteredAt || prior?.mastery?.mastered_at || null;
  const masteredAt = priorMasteredAt || (attempt.percent >= threshold ? attempt.completed_at : null);
  const bestCompletedAt = !Number.isFinite(previousBest) || attempt.percent > previousBest
    ? attempt.completed_at
    : (previousHistory?.bestCompletedAt || prior?.completed_at || null);
  const attempts = [...(previousHistory?.attempts || []), compactAttempt(attempt)].slice(-HISTORY_LIMIT);

  return {
    ...attempt,
    result_schema: RESULT_SCHEMA,
    latest_passed: attempt.percent >= threshold,
    passed: mastered,
    mastery: { threshold, mastered, mastered_at: masteredAt },
    attempt_history: {
      firstScore,
      latestScore: attempt.percent,
      bestScore,
      attemptCount: Number(previousHistory?.attemptCount || 0) + 1,
      masteredAt,
      bestCompletedAt,
      attempts
    }
  };
}

function revealFeedback(result) {
  (config.questions || []).forEach((q, i) => {
    const feedback = $(`#feedback-${i}`);
    if (!feedback) return;
    const ok = Number(result.answers?.[i]) === Number(q.answer);
    feedback.hidden = false;
    feedback.className = `feedback ${ok ? "correct" : "incorrect"}`;
    feedback.textContent = `${ok ? "Correct." : "Review."} ${q.explanation || ""}`;
  });
}

function submit() {
  const attempt = calculateAttempt();
  if (!attempt) {
    if ($("#resultMessage")) $("#resultMessage").textContent = "Answer every scored question before submitting.";
    return;
  }
  revealFeedback(attempt);
  const stored = mergeAttempt(attempt);
  saveJSON(config.storage_key, stored);
  localStorage.removeItem(`${config.storage_key}-draft`);
  showResult(stored, true);
}

function showResult(result, shouldScroll) {
  const results = $("#results");
  if (!results) return;
  results.hidden = false;
  if ($("#resultScore")) $("#resultScore").textContent = `${result.score} / ${result.total}`;

  const latestPassed = Boolean(result.latest_passed ?? (Number(result.percent) >= Number(result.threshold || config.threshold || 80)));
  const mastered = Boolean(result.mastery?.mastered ?? result.passed);
  if ($("#resultTitle")) $("#resultTitle").textContent = latestPassed ? "Threshold reached" : mastered ? "Mastery preserved" : "Review recommended";

  const history = result.attempt_history || {};
  const best = Number.isFinite(Number(history.bestScore)) ? Number(history.bestScore) : Number(result.percent) || 0;
  const count = Number(history.attemptCount) || 1;
  let message = `${result.percent}% latest · ${best}% best · threshold ${result.threshold || config.threshold || 80}% · attempt ${count}. `;
  if (latestPassed) message += "You met the mastery standard on this attempt.";
  else if (mastered) message += "This lower retake does not erase earlier mastery. Review weak domains and continue practicing.";
  else message += "Review the lowest domains, practice again, and retake when ready.";
  if ($("#resultSummary")) $("#resultSummary").textContent = message;

  const domainGrid = $("#domainGrid");
  if (domainGrid) {
    domainGrid.innerHTML = Object.entries(result.domains || {}).map(([domain, values]) => `<article class="card domain-card"><strong>${values.correct}/${values.total}</strong><h3>${escapeHTML(domain)}</h3><p>${values.correct === values.total ? "Secure on this check" : values.correct === 0 ? "Priority review" : Math.round(values.correct / values.total * 100) >= Number(result.threshold || config.threshold || 80) ? "Mastery range" : "Developing"}</p></article>`).join("");
  }

  if ($("#resultMessage")) $("#resultMessage").textContent = `Saved locally: ${new Date(result.completed_at).toLocaleString()} · best mastery preserved.`;
  if (shouldScroll) results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetForm() {
  if (!confirm("Clear the current form and draft? Saved assessment mastery evidence will be preserved.")) return;
  localStorage.removeItem(`${config.storage_key}-draft`);
  document.querySelectorAll('#questionList input[type="radio"]').forEach(input => { input.checked = false; });
  document.querySelectorAll("#reasoningSection textarea").forEach(field => { field.value = ""; });
  document.querySelectorAll(".feedback").forEach(node => { node.hidden = true; });
  updateDots();
  if ($("#results")) $("#results").hidden = true;
  if ($("#resultMessage")) $("#resultMessage").textContent = "Form reset. Saved mastery evidence was preserved.";
}

function downloadJSON(name, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

$("#questionList")?.addEventListener("change", () => { updateDots(); autosaveDraft(); });
$("#reasoningSection")?.addEventListener("input", () => { clearTimeout(window.__khDraftTimer); window.__khDraftTimer = setTimeout(autosaveDraft, 333); });
$("#questionList")?.addEventListener("click", event => {
  const button = event.target.closest("[data-hint]");
  if (!button) return;
  const hint = $(`#hint-${button.dataset.hint}`);
  if (!hint) return;
  hint.hidden = !hint.hidden;
  button.textContent = hint.hidden ? "Show hint" : "Hide hint";
});
$("#submitButton")?.addEventListener("click", () => { if (confirm("Submit the scored questions and reveal explanations?")) submit(); });
$("#saveDraft")?.addEventListener("click", () => { autosaveDraft(); if ($("#resultMessage")) $("#resultMessage").textContent = "Draft saved in this browser."; });
$("#resetButton")?.addEventListener("click", resetForm);
$("#exportButton")?.addEventListener("click", () => {
  const stored = normalizeStored(loadJSON(config.storage_key, null));
  const data = stored || {
    schema_version: "1.0",
    record_type: "khaemenes.assessment.draft-record",
    title: config.title || "Assessment",
    draft: draftRecord(),
    mastery: { threshold: Number(config.threshold) || 80, state: "not_assessed", may_grant_mastery: false }
  };
  downloadJSON(`${config.storage_key || "khaemenes-assessment"}.json`, data);
});
$("#printPage")?.addEventListener("click", () => window.print());

render();
