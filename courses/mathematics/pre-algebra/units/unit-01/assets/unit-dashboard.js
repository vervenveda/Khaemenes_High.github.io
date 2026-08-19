"use strict";

/* =========================================================
   KHAEMENES HIGH · PRE-ALGEBRA
   UNIT 1 CONTROLLER
   Number Systems, Factors & Estimation
   ========================================================= */

(() => {
  /* ---------------------------------------------------------
     CONFIGURATION
     --------------------------------------------------------- */

  const CONFIG = Object.freeze({
    mapUrl: "./unit-map.json",
    vocabUrl: "./vocabulary.json",

    progressKey: "khaemenes-prealgebra-unit01-progress-v1",
    masteryKey: "khaemenes-prealgebra-u01-mastery-v1",
    themeKey: "khaemenes-theme",

    masteryThreshold: 80,
    defaultPathway: "Core"
  });

  const DEFAULT_PROGRESS = Object.freeze({
    pathway: CONFIG.defaultPathway,
    completedLessons: [],
    lessonScores: {},
    reflections: {}
  });

  let unitMap = window.UNIT_MAP_FALLBACK || null;
  let vocabulary = window.VOCAB_FALLBACK || null;
  let progress = loadJSON(CONFIG.progressKey, clone(DEFAULT_PROGRESS));

  /* ---------------------------------------------------------
     DOM HELPERS
     --------------------------------------------------------- */

  const $ = (selector, root = document) => root.querySelector(selector);

  const byId = id => document.getElementById(id);

  const escapeHTML = value =>
    String(value ?? "").replace(
      /[&<>"']/g,
      char =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[char]
    );

  const clone = value => JSON.parse(JSON.stringify(value));

  const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, Number(value) || 0));

  const isFiniteNumber = value =>
    Number.isFinite(Number(value));

  /* ---------------------------------------------------------
     STORAGE
     --------------------------------------------------------- */

  function loadJSON(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch (error) {
      console.warn(`[Unit 1] Could not read ${key}.`, error);
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[Unit 1] Could not save ${key}.`, error);
      return false;
    }
  }

  function saveProgress() {
    normalizeProgress();
    saveJSON(CONFIG.progressKey, progress);
  }

  function normalizeProgress() {
    if (!progress || typeof progress !== "object") {
      progress = clone(DEFAULT_PROGRESS);
    }

    if (!Array.isArray(progress.completedLessons)) {
      progress.completedLessons = [];
    }

    if (!progress.lessonScores || typeof progress.lessonScores !== "object") {
      progress.lessonScores = {};
    }

    if (!progress.reflections || typeof progress.reflections !== "object") {
      progress.reflections = {};
    }

    if (!progress.pathway) {
      progress.pathway = CONFIG.defaultPathway;
    }
  }

  /* ---------------------------------------------------------
     THEME
     --------------------------------------------------------- */

  function preferredTheme() {
    const saved = localStorage.getItem(CONFIG.themeKey);
    if (saved === "light" || saved === "dark") return saved;

    return window.matchMedia?.("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function setTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = next;

    try {
      localStorage.setItem(CONFIG.themeKey, next);
    } catch {
      /* Theme persistence is optional. */
    }

    const button = byId("themeToggle");
    if (button) {
      button.setAttribute(
        "aria-label",
        next === "light" ? "Switch to dark theme" : "Switch to light theme"
      );
      button.setAttribute(
        "title",
        next === "light" ? "Dark theme" : "Light theme"
      );
    }
  }

  function bindTheme() {
    setTheme(preferredTheme());

    const button = byId("themeToggle");
    if (!button) return;

    button.addEventListener("click", () => {
      setTheme(
        document.documentElement.dataset.theme === "light"
          ? "dark"
          : "light"
      );
    });
  }

  /* ---------------------------------------------------------
     DATA LOADING
     --------------------------------------------------------- */

  async function fetchJSON(url) {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async function loadData() {
    const results = await Promise.allSettled([
      fetchJSON(CONFIG.mapUrl),
      fetchJSON(CONFIG.vocabUrl)
    ]);

    if (results[0].status === "fulfilled") {
      unitMap = results[0].value;
    } else {
      console.warn(
        "[Unit 1] Using embedded unit-map fallback.",
        results[0].reason
      );
    }

    if (results[1].status === "fulfilled") {
      vocabulary = results[1].value;
    } else {
      console.warn(
        "[Unit 1] Using embedded vocabulary fallback.",
        results[1].reason
      );
    }

    if (!unitMap?.unit || !Array.isArray(unitMap?.lessons)) {
      renderFatalState(
        "Unit information could not be loaded. Please return to Pre-Algebra and try again."
      );
      return;
    }

    normalizeProgress();
    render();
  }

  /* ---------------------------------------------------------
     UNIT STATE
     --------------------------------------------------------- */

  function getThreshold() {
    const threshold =
      Number(unitMap?.assessment?.threshold) ||
      Number(unitMap?.unit?.mastery_threshold) ||
      CONFIG.masteryThreshold;

    return clamp(threshold, 1, 100);
  }

  function getMasteryResult() {
    const result = loadJSON(CONFIG.masteryKey, null);

    if (!result || typeof result !== "object") return null;

    const total = Number(result.total);
    const score = Number(result.score);
    const percent =
      isFiniteNumber(result.percent)
        ? clamp(result.percent, 0, 100)
        : total > 0
          ? clamp(Math.round((score / total) * 100), 0, 100)
          : 0;

    return {
      ...result,
      score: Number.isFinite(score) ? score : 0,
      total: Number.isFinite(total) ? total : 0,
      percent,
      passed: percent >= getThreshold()
    };
  }

  function completedCount() {
    const lessonIds = new Set(unitMap.lessons.map(lesson => lesson.id));

    return progress.completedLessons.filter(id => lessonIds.has(id)).length;
  }

  function lessonCompletionPercent() {
    const total = unitMap.lessons.length;
    if (!total) return 0;

    return clamp(
      Math.round((completedCount() / total) * 100),
      0,
      100
    );
  }

  function unitIsMastered() {
    const result = getMasteryResult();
    return Boolean(result && result.passed);
  }

  /* ---------------------------------------------------------
     RENDER
     --------------------------------------------------------- */

  function render() {
    renderUnitOverview();
    renderPathway();
    renderLessons();
    renderProgress();
    renderMastery();
    renderLanguages();
    renderGlossary();
    renderMasteryGate();
  }

  function renderUnitOverview() {
    const essential = byId("essentialQuestion");
    const ideas = byId("bigIdeas");

    if (essential) {
      essential.textContent =
        unitMap.unit.essential_question ||
        "Build fluency, structure, and mathematical reasoning.";
    }

    if (ideas) {
      const items = Array.isArray(unitMap.unit.big_ideas)
        ? unitMap.unit.big_ideas
        : [];

      ideas.innerHTML = items
        .map(item => `<li>${escapeHTML(item)}</li>`)
        .join("");
    }

    const thresholdElements = document.querySelectorAll(
      "[data-mastery-threshold]"
    );

    thresholdElements.forEach(element => {
      element.textContent = `${getThreshold()}%`;
    });
  }

  function renderPathway() {
    const select = byId("pathwaySelect");
    if (!select) return;

    const desired = progress.pathway || CONFIG.defaultPathway;

    if ([...select.options].some(option => option.value === desired)) {
      select.value = desired;
    } else {
      progress.pathway = CONFIG.defaultPathway;
      select.value = CONFIG.defaultPathway;
      saveProgress();
    }
  }

  function renderLessons() {
    const grid = byId("lessonGrid");
    if (!grid) return;

    grid.innerHTML = unitMap.lessons
      .map(lesson => {
        const completed = progress.completedLessons.includes(lesson.id);
        const score = progress.lessonScores[lesson.id];
        const scoreMarkup = isFiniteNumber(score)
          ? `
            <div class="notice">
              Latest practice score:
              <strong>${clamp(score, 0, 100)}%</strong>
            </div>
          `
          : "";

        const objectives = Array.isArray(lesson.objectives)
          ? lesson.objectives.slice(0, 3)
          : [];

        return `
          <article
            class="card lesson-card"
            data-lesson-card="${escapeHTML(lesson.id)}"
          >
            <div class="lesson-top">
              <span class="lesson-number">
                ${String(lesson.number ?? "").padStart(2, "0")}
              </span>

              <span class="pill ${completed ? "open" : ""}">
                ${completed ? "Completed" : escapeHTML(lesson.duration || "Lesson")}
              </span>
            </div>

            <h3>${escapeHTML(lesson.title)}</h3>

            <ul class="lesson-objectives">
              ${objectives
                .map(objective => `<li>${escapeHTML(objective)}</li>`)
                .join("")}
            </ul>

            ${scoreMarkup}

            <div class="lesson-actions">
              <a
                class="btn primary"
                href="${escapeHTML(lesson.file)}"
                data-open-lesson="${escapeHTML(lesson.id)}"
              >
                Open Lesson
              </a>

              <button
                class="btn"
                type="button"
                data-complete="${escapeHTML(lesson.id)}"
                aria-pressed="${completed}"
              >
                ${completed ? "Reviewed ✓" : "Mark Reviewed"}
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderProgress() {
    const percent = lessonCompletionPercent();

    const label = byId("progressLabel");
    const bar = byId("progressBar");

    if (label) {
      label.textContent = `${percent}%`;
    }

    if (bar) {
      bar.style.setProperty("--value", `${percent}%`);

      const inner =
        bar.querySelector("[data-progress-fill]") ||
        bar.querySelector("span") ||
        bar.querySelector("i");

      if (inner) {
        inner.style.width = `${percent}%`;
      }

      bar.setAttribute("aria-valuenow", String(percent));
      bar.setAttribute("aria-valuemin", "0");
      bar.setAttribute("aria-valuemax", "100");
    }

    const count = byId("lessonCompletionCount");
    if (count) {
      count.textContent =
        `${completedCount()} of ${unitMap.lessons.length} lessons reviewed`;
    }
  }

  function renderMastery() {
    const status = byId("masteryStatus");
    if (!status) return;

    const result = getMasteryResult();
    const threshold = getThreshold();

    if (!result) {
      status.innerHTML = `
        <strong>No mastery result yet.</strong><br>
        Complete the Unit 1 Mastery Check.
        A score of <strong>${threshold}%</strong> is required to advance.
      `;
      status.dataset.state = "not-started";
      return;
    }

    if (result.passed) {
      status.innerHTML = `
        <strong>Unit 1 Mastered ✓</strong><br>
        ${result.score}/${result.total}
        (${result.percent}%).
        You met the ${threshold}% mastery standard.
      `;
      status.dataset.state = "mastered";
    } else {
      status.innerHTML = `
        <strong>Review Required</strong><br>
        ${result.score}/${result.total}
        (${result.percent}%).
        Reach ${threshold}% before advancing.
      `;
      status.dataset.state = "review";
    }
  }

  function renderMasteryGate() {
    const result = getMasteryResult();
    const threshold = getThreshold();

    document.querySelectorAll("[data-mastery-gate]").forEach(element => {
      const mastered = Boolean(result?.passed);

      element.dataset.locked = mastered ? "false" : "true";
      element.setAttribute("aria-disabled", mastered ? "false" : "true");

      const label = element.querySelector("[data-gate-label]");

      if (label) {
        label.textContent = mastered
          ? "Unlocked"
          : `Locked · ${threshold}% mastery required`;
      }
    });

    const banner = byId("masteryGateMessage");
    if (!banner) return;

    if (!result) {
      banner.innerHTML =
        `Complete the mastery check and earn <strong>${threshold}%</strong> to unlock the next unit.`;
      banner.dataset.state = "locked";
    } else if (result.passed) {
      banner.innerHTML =
        `Mastery achieved at <strong>${result.percent}%</strong>. The next unit is ready.`;
      banner.dataset.state = "unlocked";
    } else {
      banner.innerHTML =
        `Current mastery: <strong>${result.percent}%</strong>. Review and retake until you reach <strong>${threshold}%</strong>.`;
      banner.dataset.state = "locked";
    }
  }

  /* ---------------------------------------------------------
     GLOSSARY
     --------------------------------------------------------- */

  function renderLanguages() {
    const select = byId("glossaryLanguage");
    if (!select || !vocabulary?.languages) return;

    const current = select.value || "es";

    select.innerHTML = Object.entries(vocabulary.languages)
      .filter(([id]) => id !== "en")
      .map(
        ([id, label]) =>
          `<option value="${escapeHTML(id)}">${escapeHTML(label)}</option>`
      )
      .join("");

    if ([...select.options].some(option => option.value === current)) {
      select.value = current;
    }
  }

  function renderGlossary() {
    const grid = byId("glossaryGrid");
    if (!grid || !Array.isArray(vocabulary?.terms)) return;

    const search = (byId("glossarySearch")?.value || "")
      .trim()
      .toLowerCase();

    const language =
      byId("glossaryLanguage")?.value ||
      "es";

    const terms = vocabulary.terms.filter(term => {
      const haystack = [
        term.en,
        term.definition,
        term[language]
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });

    if (!terms.length) {
      grid.innerHTML = `
        <div class="notice">
          No vocabulary terms match that search.
        </div>
      `;
      return;
    }

    grid.innerHTML = terms
      .map(
        term => `
          <article class="term">
            <strong>${escapeHTML(term.en)}</strong>
            <span>${escapeHTML(term[language] || term.en)}</span>
            <p>${escapeHTML(term.definition)}</p>
          </article>
        `
      )
      .join("");
  }

  /* ---------------------------------------------------------
     LESSON INTERACTIONS
     --------------------------------------------------------- */

  function toggleLessonComplete(id) {
    if (!id) return;

    const current = new Set(progress.completedLessons);

    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }

    progress.completedLessons = [...current];
    saveProgress();
    renderLessons();
    renderProgress();
  }

  function handleLessonGridClick(event) {
    const completeButton = event.target.closest("[data-complete]");

    if (completeButton) {
      toggleLessonComplete(completeButton.dataset.complete);
      return;
    }

    const lessonLink = event.target.closest("[data-open-lesson]");
    if (!lessonLink) return;

    try {
      localStorage.setItem(
        "khaemenes-grade09-last-open-v1",
        JSON.stringify({
          course: "prealgebra",
          unit: "unit-01",
          lesson: lessonLink.dataset.openLesson,
          title:
            unitMap.lessons.find(
              lesson => lesson.id === lessonLink.dataset.openLesson
            )?.title || "Pre-Algebra",
          url: lessonLink.getAttribute("href"),
          at: new Date().toISOString()
        })
      );
    } catch {
      /* Continue-learning support is optional. */
    }
  }

  /* ---------------------------------------------------------
     PATHWAY
     --------------------------------------------------------- */

  function handlePathwayChange(event) {
    progress.pathway =
      event.target.value || CONFIG.defaultPathway;

    saveProgress();
  }

  /* ---------------------------------------------------------
     EXPORT
     --------------------------------------------------------- */

  function downloadJSON(filename, data) {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => URL.revokeObjectURL(url), 700);
  }

  function exportProgress() {
    downloadJSON(
      "khaemenes-prealgebra-unit01-record.json",
      {
        schema_version: "2.0",
        exported_at: new Date().toISOString(),
        course: {
          id: "KH-MATH-PA",
          title: "Pre-Algebra"
        },
        unit: unitMap.unit,
        pathway: progress.pathway,
        progress,
        mastery: getMasteryResult(),
        mastery_threshold: getThreshold()
      }
    );
  }

  /* ---------------------------------------------------------
     RESET
     --------------------------------------------------------- */

  function resetProgress() {
    const confirmed = window.confirm(
      "Clear Unit 1 lesson progress, reflections, practice scores, and mastery results from this browser?"
    );

    if (!confirmed) return;

    localStorage.removeItem(CONFIG.progressKey);
    localStorage.removeItem(CONFIG.masteryKey);

    progress = clone(DEFAULT_PROGRESS);

    render();
  }

  /* ---------------------------------------------------------
     FATAL STATE
     --------------------------------------------------------- */

  function renderFatalState(message) {
    const target =
      byId("lessonGrid") ||
      byId("main") ||
      document.body;

    target.innerHTML = `
      <section class="wrap">
        <article class="panel major-panel">
          <p class="eyebrow">Unit 1</p>
          <h2>Unit data unavailable</h2>
          <p>${escapeHTML(message)}</p>
          <p>
            <a class="btn primary" href="../../../">
              Return to Pre-Algebra
            </a>
          </p>
        </article>
      </section>
    `;
  }

  /* ---------------------------------------------------------
     EVENT BINDING
     --------------------------------------------------------- */

  function bindEvents() {
    byId("lessonGrid")?.addEventListener(
      "click",
      handleLessonGridClick
    );

    byId("pathwaySelect")?.addEventListener(
      "change",
      handlePathwayChange
    );

    byId("glossarySearch")?.addEventListener(
      "input",
      renderGlossary
    );

    byId("glossaryLanguage")?.addEventListener(
      "change",
      renderGlossary
    );

    byId("exportProgress")?.addEventListener(
      "click",
      exportProgress
    );

    byId("resetProgress")?.addEventListener(
      "click",
      resetProgress
    );

    document.addEventListener("click", event => {
      const gated = event.target.closest("[data-mastery-gate]");

      if (!gated) return;

      if (!unitIsMastered()) {
        event.preventDefault();

        const threshold = getThreshold();

        window.alert(
          `Mastery Required\n\nReach ${threshold}% on the Unit 1 Mastery Check before moving ahead.\n\nReview the current unit, practice weak areas, and retake the assessment when ready.`
        );
      }
    });
  }

  /* ---------------------------------------------------------
     INITIALIZE
     --------------------------------------------------------- */

  function init() {
    normalizeProgress();
    bindTheme();
    bindEvents();
    loadData();
  }

  init();
})();
