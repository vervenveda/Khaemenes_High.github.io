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
  const vocabKey = "khae-ela9-vocabulary-v1";
  const MASTERY_THRESHOLD = 80;

  const load = () => {
    try { return JSON.parse(localStorage.getItem(courseKey) || "{}"); }
    catch { return {}; }
  };

  const loadMastery = () => {
    try { return JSON.parse(localStorage.getItem(masteryKey) || "{}"); }
    catch { return {}; }
  };

  const loadVocabulary = () => {
    try { return JSON.parse(localStorage.getItem(vocabKey) || "{}"); }
    catch { return {}; }
  };

  const save = data => {
    try { localStorage.setItem(courseKey, JSON.stringify(data)); } catch {}
  };

  const saveMastery = data => {
    try { localStorage.setItem(masteryKey, JSON.stringify(data)); } catch {}
  };

  const saveVocabulary = data => {
    try { localStorage.setItem(vocabKey, JSON.stringify(data)); } catch {}
  };

  const progress = load();
  const mastery = loadMastery();
  const vocabulary = loadVocabulary();

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

  /* ==========================================================
     LearnA · One New Word Every Instructional Day
     Auto-injected into all 36 English 9 weekly lesson pages.
     5 days/week × 36 weeks = 180 vocabulary launches.
     Formative enrichment only; never substitutes for mastery.
     ========================================================== */
  const LEARNA_URL = "https://vervenveda.github.io/arcade.github.io/Learn_a_New_Word_index.html";
  const VOCAB_PATH_URL = "../../vocabulary/index.html";
  const vocabMatch = window.location.pathname.match(/\/weeks\/week-(\d{2})\/?(?:index\.html)?$/i);

  const unitApplicationFocus = [
    "Use the word to sharpen observation, inference, evidence, or sentence-level precision.",
    "Test whether the word helps compare mythic patterns without flattening cultural difference.",
    "Use the word purposefully in narrative craft, voice, characterization, conflict, or revision.",
    "Explore sound, connotation, imagery, figurative meaning, form, or performance through the word.",
    "Apply the word to dramatic interpretation, conflict, motivation, stagecraft, or seminar reasoning.",
    "Use the word to improve rhetorical precision, audience awareness, reasoning, evidence, or public voice.",
    "Interrogate the word's meaning as you research: scope, provenance, connotation, uncertainty, and claim fit matter.",
    "Use the word only if it improves explanatory or technical precision; test whether a reader would understand it.",
    "Apply the word to a sustained interpretation, then test whether later textual evidence changes the usage or claim.",
    "Use the word in argument only when it clarifies scope, evidence, warrants, tradeoffs, or qualification rather than decorating the prose.",
    "Examine how the word changes audience interpretation across text, caption, layout, sequence, or another medium.",
    "Use the word in capstone reflection or defense only when artifact evidence supports the distinction it makes."
  ];

  const dailyMoves = [
    { title: "Hear & Define", prompt: "Hear the pronunciation, read both definitions, then restate the meaning accurately in your own words." },
    { title: "Inspect & Distinguish", prompt: "Inspect part of speech, origin, synonyms, register, and connotation. Name one near-synonym that would change the meaning." },
    { title: "Apply to Today's Thinking", prompt: "Use the word in a sentence connected directly to today's Language Arts work. The sentence must demonstrate the meaning rather than merely contain the word." },
    { title: "Challenge the Choice", prompt: "Ask whether the word actually improves precision. Compare it with a simpler alternative and keep the stronger choice for the audience and purpose." },
    { title: "Retrieve & Retain", prompt: "Complete LearnA's quick quiz, mark the word learned when appropriate, and reuse one earlier word naturally if it improves today's reflection." }
  ];

  function vocabCompletedCount() {
    return Array.from({ length: 180 }, (_, i) => Boolean(vocabulary[`day-${String(i + 1).padStart(3, "0")}`])).filter(Boolean).length;
  }

  function injectDailyVocabulary() {
    if (!vocabMatch || document.getElementById("daily-vocabulary-launch")) return;
    const week = Number(vocabMatch[1]);
    if (!Number.isInteger(week) || week < 1 || week > 36) return;

    const unit = Math.ceil(week / 3);
    const startDay = (week - 1) * 5 + 1;
    const section = document.createElement("section");
    section.id = "daily-vocabulary-launch";
    section.className = "section-alt";

    const cards = dailyMoves.map((move, index) => {
      const courseDay = startDay + index;
      const key = `day-${String(courseDay).padStart(3, "0")}`;
      const done = Boolean(vocabulary[key]);
      return `<article class="card day-card" data-vocab-card="${key}">
        <span class="day-label">Day ${index + 1} · Course Day ${courseDay}</span>
        <h3>${move.title}</h3>
        <p>${move.prompt}</p>
        <p><strong>Unit ${unit} application:</strong> ${unitApplicationFocus[unit - 1]}</p>
        <div class="actions">
          <a class="btn primary" href="${LEARNA_URL}" target="_blank" rel="noopener noreferrer">Open Today's LearnA Word</a>
          <button class="btn" type="button" data-vocab-complete="${key}" aria-pressed="${done}">${done ? "Daily Word Recorded ✓" : "Record Daily Word"}</button>
        </div>
      </article>`;
    }).join("");

    section.innerHTML = `<div class="wrap">
      <div class="section-head">
        <p class="eyebrow">LearnA · Daily Vocabulary Launch</p>
        <h2>One new word every instructional day.</h2>
        <p>Open LearnA on the day you complete each lesson. Use that day's word as a five-minute language-and-critical-thinking launch: hear → define → inspect → apply → challenge → retain.</p>
      </div>
      <div class="notice" data-vocab-summary>${vocabCompletedCount()} of 180 daily vocabulary launches recorded locally. Vocabulary practice is formative enrichment and does not satisfy or bypass the 80% mastery gate.</div>
      <div class="grid day-grid" style="margin-top:16px">${cards}</div>
      <div class="actions" style="margin-top:16px">
        <a class="btn" href="${VOCAB_PATH_URL}">Open 180-Day Vocabulary Path</a>
        <a class="btn" href="https://artist1970.github.io/Eiren.github.io/" target="_blank" rel="noopener noreferrer">Ask Eiren to Test Precision</a>
      </div>
    </div>`;

    const quickNav = document.querySelector(".quick-nav");
    if (quickNav) quickNav.insertAdjacentElement("afterend", section);
    else document.querySelector("main")?.prepend(section);

    section.querySelectorAll("[data-vocab-complete]").forEach(button => {
      button.addEventListener("click", () => {
        const key = button.dataset.vocabComplete;
        vocabulary[key] = !vocabulary[key];
        saveVocabulary(vocabulary);
        const done = Boolean(vocabulary[key]);
        button.setAttribute("aria-pressed", String(done));
        button.textContent = done ? "Daily Word Recorded ✓" : "Record Daily Word";
        const summary = section.querySelector("[data-vocab-summary]");
        if (summary) summary.textContent = `${vocabCompletedCount()} of 180 daily vocabulary launches recorded locally. Vocabulary practice is formative enrichment and does not satisfy or bypass the 80% mastery gate.`;
      });
    });
  }

  injectDailyVocabulary();
})();
