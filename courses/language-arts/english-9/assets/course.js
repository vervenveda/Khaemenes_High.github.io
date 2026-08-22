(() => {
  "use strict";

  const root = document.documentElement;
  const themeKey = "khae-ela9-theme-v1";
  const themeButton = document.querySelector("[data-theme-toggle]");

  try {
    root.dataset.theme = localStorage.getItem(themeKey) || "light";
  } catch {
    root.dataset.theme = "light";
  }

  function syncTheme() {
    if (!themeButton) return;
    const dark = root.dataset.theme === "dark";
    themeButton.textContent = dark ? "Light" : "Dark";
    themeButton.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
  }

  syncTheme();
  themeButton?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem(themeKey, root.dataset.theme); } catch {}
    syncTheme();
  });

  const courseKey = "khae-ela9-progress-v1";
  const masteryKey = "khae-ela9-mastery-v1";
  const MASTERY_THRESHOLD = 80;

  const load = () => {
    try { return JSON.parse(localStorage.getItem(courseKey) || "{}"); }
    catch { return {}; }
  };

  const loadMastery = () => {
    try { return JSON.parse(localStorage.getItem(masteryKey) || "{}"); }
    catch { return {}; }
  };

  const save = data => {
    try { localStorage.setItem(courseKey, JSON.stringify(data)); } catch {}
  };

  const saveMastery = data => {
    try { localStorage.setItem(masteryKey, JSON.stringify(data)); } catch {}
  };

  const progress = load();
  const mastery = loadMastery();

  function normalizeMasteryRecord(record) {
    if (!record || typeof record !== "object") return null;

    const legacyScore = Number(record.score);
    const latest = Number(record.latestScore);
    const best = Number(record.bestScore);
    const first = Number(record.firstScore);

    const latestScore = Number.isFinite(latest)
      ? latest
      : (Number.isFinite(legacyScore) ? legacyScore : null);

    const bestScore = Number.isFinite(best)
      ? best
      : (Number.isFinite(legacyScore) ? legacyScore : latestScore);

    const firstScore = Number.isFinite(first)
      ? first
      : (Number.isFinite(legacyScore) ? legacyScore : latestScore);

    const passed = Number.isFinite(bestScore) && bestScore >= MASTERY_THRESHOLD;

    return {
      ...record,
      score: Number.isFinite(bestScore) ? bestScore : null,
      firstScore,
      latestScore,
      bestScore,
      attemptCount: Math.max(0, Number(record.attemptCount) || (latestScore !== null ? 1 : 0)),
      passed,
      threshold: MASTERY_THRESHOLD,
      masteredAt: record.masteredAt || (passed ? record.recordedAt || null : null)
    };
  }

  Object.keys(mastery).forEach(id => {
    const normalized = normalizeMasteryRecord(mastery[id]);
    if (normalized) mastery[id] = normalized;
  });
  saveMastery(mastery);

  document.querySelectorAll("[data-progress-key]").forEach(button => {
    const key = button.dataset.progressKey;
    const on = Boolean(progress[key]);
    button.setAttribute("aria-pressed", String(on));
    button.textContent = on ? "Weekly Evidence Recorded ✓" : "Record Weekly Evidence Complete";
    button.title = "This records evidence completion only. It does not satisfy or bypass any 80% mastery gate.";

    button.addEventListener("click", () => {
      progress[key] = !progress[key];
      save(progress);
      button.setAttribute("aria-pressed", String(progress[key]));
      button.textContent = progress[key] ? "Weekly Evidence Recorded ✓" : "Record Weekly Evidence Complete";
      updateProgress();
    });
  });

  function updateProgress() {
    const bar = document.querySelector("[data-course-progress]");
    const label = document.querySelector("[data-course-progress-label]");
    if (!bar && !label) return;

    const total = 36;
    const done = Array.from({ length: 36 }, (_, i) => progress[`week-${String(i + 1).padStart(2, "0")}`])
      .filter(Boolean).length;
    const pct = Math.round(done / total * 100);

    if (bar) bar.style.width = `${pct}%`;
    if (label) label.textContent = `${done} of ${total} weekly evidence records complete · ${pct}%`;
  }

  updateProgress();

  document.querySelectorAll("[data-mastery-score]").forEach(field => {
    const id = field.dataset.masteryScore;
    const record = normalizeMasteryRecord(mastery[id]);
    if (record?.latestScore !== null && record?.latestScore !== undefined) {
      field.value = record.latestScore;
    }
    field.title = "Local mastery record. Enter only a score that has actually been evaluated through the course assessment process.";
  });

  function renderMasteryPanel(id, field, panel) {
    if (!field || !panel) return;
    const record = normalizeMasteryRecord(mastery[id]);

    if (!record || record.latestScore === null) {
      panel.innerHTML = "<strong>Not verified</strong><p>Enter a score from 0–100 only after the required evidence has actually been evaluated.</p>";
      return;
    }

    const latest = record.latestScore;
    const best = record.bestScore;
    const attempts = record.attemptCount;

    if (record.passed) {
      panel.innerHTML = `<strong>Best ${best}% · Mastery demonstrated ✓</strong><p>Latest attempt: ${latest}% · Attempts recorded: ${attempts}. Prior mastery is preserved even if a later practice/reassessment score is lower.</p>`;
    } else {
      panel.innerHTML = `<strong>Latest ${latest}% · Best ${best}% · Not yet mastered</strong><p>${MASTERY_THRESHOLD}% is required. Complete targeted corrective learning and reassess with fresh or meaningfully changed evidence.</p>`;
    }
  }

  document.querySelectorAll("[data-mastery-check]").forEach(button => {
    const id = button.dataset.masteryCheck;
    const field = document.querySelector(`[data-mastery-score="${id}"]`);
    const panel = document.querySelector(`[data-mastery-panel="${id}"]`);

    button.addEventListener("click", () => {
      if (!field || !panel) return;

      const raw = String(field.value).trim();
      if (raw === "") {
        panel.innerHTML = "<strong>Not recorded</strong><p>Enter an evaluated score from 0–100.</p>";
        return;
      }

      const score = Number(raw);
      if (!Number.isFinite(score) || score < 0 || score > 100) {
        panel.innerHTML = "<strong>Check the score</strong><p>Enter a valid percentage from 0–100.</p>";
        return;
      }

      const now = new Date().toISOString();
      const previous = normalizeMasteryRecord(mastery[id]);
      const firstScore = previous?.firstScore ?? score;
      const bestScore = previous?.bestScore === null || previous?.bestScore === undefined
        ? score
        : Math.max(previous.bestScore, score);
      const attemptCount = (previous?.attemptCount || 0) + 1;
      const passed = bestScore >= MASTERY_THRESHOLD;
      const masteredAt = previous?.masteredAt || (score >= MASTERY_THRESHOLD ? now : null);

      mastery[id] = {
        score: bestScore,
        firstScore,
        latestScore: score,
        bestScore,
        attemptCount,
        passed,
        threshold: MASTERY_THRESHOLD,
        masteredAt,
        recordedAt: now,
        authority: "local-evaluated-score-record"
      };

      saveMastery(mastery);
      renderMasteryPanel(id, field, panel);
      renderPrerequisites();
    });

    renderMasteryPanel(id, field, panel);
  });

  function renderPrerequisites() {
    document.querySelectorAll("[data-prerequisite-panel]").forEach(panel => {
      const id = panel.dataset.prerequisitePanel;
      const record = normalizeMasteryRecord(mastery[id]);
      const bestScore = record?.bestScore;
      const passed = Boolean(record && record.passed && Number(bestScore) >= MASTERY_THRESHOLD);

      panel.innerHTML = passed
        ? `<strong>${bestScore}% · Prerequisite mastered ✓</strong><p>${id.replace("unit-", "Unit ")} meets the ${MASTERY_THRESHOLD}% gate. This lesson is available.</p>`
        : `<strong>Prerequisite not yet verified</strong><p>${id.replace("unit-", "Unit ")} must reach ${MASTERY_THRESHOLD}% before this lesson begins.</p>`;

      document.querySelectorAll(`[data-prerequisite-content="${id}"]`).forEach(control => {
        control.setAttribute("aria-disabled", String(!passed));

        if (!passed) {
          control.dataset.lockedHref = control.getAttribute("href") || control.dataset.lockedHref || "";
          control.removeAttribute("href");
          control.title = `${id.replace("unit-", "Unit ")} mastery of ${MASTERY_THRESHOLD}% is required`;
        } else if (!control.getAttribute("href") && control.dataset.lockedHref) {
          control.setAttribute("href", control.dataset.lockedHref);
          control.removeAttribute("aria-disabled");
          control.removeAttribute("title");
        }
      });
    });
  }

  renderPrerequisites();

  document.querySelectorAll("[data-save-field]").forEach(field => {
    const key = `khae-ela9-field:${field.dataset.saveField}`;
    try { field.value = localStorage.getItem(key) || ""; } catch {}
    field.addEventListener("input", () => {
      try { localStorage.setItem(key, field.value); } catch {}
    });
  });

  document.querySelectorAll("[data-print]").forEach(button => {
    button.addEventListener("click", () => window.print());
  });

  document.querySelectorAll("[data-clear-field]").forEach(button => {
    button.addEventListener("click", () => {
      const field = document.getElementById(button.dataset.clearField);
      if (!field) return;
      field.value = "";
      field.dispatchEvent(new Event("input"));
      field.focus();
    });
  });

  const search = document.querySelector("[data-card-search]");
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll("[data-search-card]").forEach(card => {
        card.hidden = Boolean(q && !card.textContent.toLowerCase().includes(q));
      });
    });
  }
})();
