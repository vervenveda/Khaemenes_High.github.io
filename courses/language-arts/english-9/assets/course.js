(() => {
  "use strict";

  const root = document.documentElement;
  const themeKey = "khae-ela9-theme-v1";
  const courseKey = "khae-ela9-progress-v1";
  const masteryKey = "khae-ela9-mastery-v1";
  const vocabKey = "khae-ela9-vocabulary-v1";
  const rewardKey = "khae-ela9-rewards-v1";
  const MASTERY_THRESHOLD = 80;

  const readJSON = (key, fallback = {}) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  };
  const writeJSON = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };

  const progress = readJSON(courseKey);
  const mastery = readJSON(masteryKey);
  const vocabulary = readJSON(vocabKey);
  const rewards = readJSON(rewardKey, { shown: {}, played: {}, dismissed: {} });
  rewards.shown ||= {};
  rewards.played ||= {};
  rewards.dismissed ||= {};

  /* Theme */
  const themeButton = document.querySelector("[data-theme-toggle]");
  try { root.dataset.theme = localStorage.getItem(themeKey) || "light"; }
  catch { root.dataset.theme = "light"; }
  const syncTheme = () => {
    if (!themeButton) return;
    const dark = root.dataset.theme === "dark";
    themeButton.textContent = dark ? "Light" : "Dark";
    themeButton.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
  };
  syncTheme();
  themeButton?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem(themeKey, root.dataset.theme); } catch {}
    syncTheme();
  });

  /* Mastery normalization */
  function normalizeMasteryRecord(record) {
    if (!record || typeof record !== "object") return null;
    const legacyScore = Number(record.score);
    const latest = Number(record.latestScore);
    const best = Number(record.bestScore);
    const first = Number(record.firstScore);
    const latestScore = Number.isFinite(latest) ? latest : (Number.isFinite(legacyScore) ? legacyScore : null);
    const bestScore = Number.isFinite(best) ? best : (Number.isFinite(legacyScore) ? legacyScore : latestScore);
    const firstScore = Number.isFinite(first) ? first : (Number.isFinite(legacyScore) ? legacyScore : latestScore);
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
  writeJSON(masteryKey, mastery);

  /* Context */
  const weekMatch = window.location.pathname.match(/\/weeks\/week-(\d{2})\/?(?:index\.html)?$/i);
  const currentWeek = weekMatch ? Number(weekMatch[1]) : null;
  const currentUnit = currentWeek ? Math.ceil(currentWeek / 3) : null;

  /* ==========================================================
     Arcade Reward Challenge Engine
     Optional positive reinforcement after successful milestones.
     Never auto-opens a game and never affects mastery/progression.
     ========================================================== */
  const ARCADE = "https://vervenveda.github.io/arcade.github.io/";
  const GAMES = {
    affixsix: { title: "AffixSix™", url: `${ARCADE}AffixSix%E2%84%A2_index.html`, category: "Language", why: "word structure and language play" },
    hangman: { title: "Progressive Hangman", url: `${ARCADE}Hangman_index.html`, category: "Language", why: "spelling and vocabulary retrieval" },
    miniIQ: { title: "Mini IQ Reasoning Lab", url: `${ARCADE}IQ-mini_index.html`, category: "Reasoning", why: "logic, verbal analogy, and problem solving" },
    quantumIQ: { title: "Quantum IQ", url: `${ARCADE}IQ-Quantum_index.html`, category: "Reasoning", why: "extended adaptive reasoning" },
    chess: { title: "Chess Studio", url: `${ARCADE}Chess_Studio_index.html`, category: "Strategy", why: "planning, consequence, and counterfactual thinking" },
    checkers: { title: "Checkers Variant Lab", url: `${ARCADE}Checkers_Variant_Lab_index.html`, category: "Strategy", why: "rules, alternatives, and strategic planning" },
    sudoku: { title: "Sovereign Sudoku", url: `${ARCADE}Jenny's_Sudoku_index.html`, category: "Reasoning", why: "constraint reasoning and pattern detection" },
    connect4: { title: "Orion's Connect Four", url: `${ARCADE}Orions_connect_four_index.html`, category: "Strategy", why: "prediction and planning ahead" },
    backgammon: { title: "Backgammon", url: `${ARCADE}Backgammon_index.html`, category: "Strategy", why: "probability-aware decision making" }
  };

  const earlyPool = ["affixsix", "hangman", "miniIQ", "sudoku", "chess"];
  const researchPool = ["miniIQ", "sudoku", "chess", "hangman", "affixsix"];
  const advancedPool = ["miniIQ", "chess", "checkers", "sudoku", "quantumIQ", "backgammon"];
  const masteryPool = ["miniIQ", "quantumIQ", "chess", "sudoku"];

  function hashString(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rewardPool(kind, unit) {
    if (kind === "mastery") return masteryPool;
    if (!unit || unit <= 6) return earlyPool;
    if (unit <= 9) return researchPool;
    return advancedPool;
  }

  function chooseReward(kind, eventId, unit, offset = 0) {
    const pool = rewardPool(kind, unit);
    const index = (hashString(`${kind}:${eventId}:${unit || 0}`) + offset) % pool.length;
    return GAMES[pool[index]];
  }

  function ensureRewardStyles() {
    if (document.getElementById("khae-reward-style")) return;
    const style = document.createElement("style");
    style.id = "khae-reward-style";
    style.textContent = `
      .khae-reward-overlay{position:fixed;inset:0;background:rgba(13,16,22,.66);display:flex;align-items:center;justify-content:center;padding:22px;z-index:9999;backdrop-filter:blur(4px)}
      .khae-reward-dialog{width:min(540px,94vw);background:var(--surface,#fff);color:var(--text,#1e2430);border:1px solid rgba(128,128,128,.28);border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.35);padding:24px;text-align:center}
      .khae-reward-mark{font-size:2rem;line-height:1;margin-bottom:8px}
      .khae-reward-dialog h2{margin:4px 0 8px}.khae-reward-dialog p{line-height:1.55}
      .khae-reward-meta{font-size:.88rem;opacity:.75;margin:10px 0 16px}
      .khae-reward-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px}
      .khae-reward-actions button,.khae-reward-actions a{min-width:130px}
      @media(prefers-reduced-motion:reduce){.khae-reward-overlay{backdrop-filter:none}}
    `;
    document.head.appendChild(style);
  }

  function closeReward() {
    document.querySelector(".khae-reward-overlay")?.remove();
  }

  function showReward({ kind = "daily", eventId, unit = currentUnit, force = false } = {}) {
    if (!eventId) return;
    const stamp = `${kind}:${eventId}`;
    if (!force && rewards.shown[stamp]) return;
    rewards.shown[stamp] = new Date().toISOString();
    writeJSON(rewardKey, rewards);
    ensureRewardStyles();

    let offset = 0;
    const overlay = document.createElement("div");
    overlay.className = "khae-reward-overlay";
    overlay.setAttribute("role", "presentation");

    const render = () => {
      const game = chooseReward(kind, eventId, unit, offset);
      const headline = kind === "mastery" ? "Mastery Challenge Unlocked ✦" : kind === "weekly" ? "Weekly Challenge Unlocked ✦" : "Bonus Challenge Unlocked ✦";
      const message = kind === "mastery"
        ? "You demonstrated a mastery milestone. Take an optional reasoning break before moving forward."
        : kind === "weekly"
          ? "Your weekly Language Arts evidence is recorded. A short optional challenge is ready."
          : "Nice work completing today's learning step. Here is a short optional positive-reinforcement challenge.";
      overlay.innerHTML = `<div class="khae-reward-dialog" role="dialog" aria-modal="true" aria-labelledby="khaeRewardTitle">
        <div class="khae-reward-mark" aria-hidden="true">✦</div>
        <p class="eyebrow">Khaemenes Arcade · Positive Reinforcement</p>
        <h2 id="khaeRewardTitle">${headline}</h2>
        <p>${message}</p>
        <h3>${game.title}</h3>
        <p>${game.category} challenge · ${game.why}.</p>
        <div class="khae-reward-meta">Optional enrichment only. Arcade play never changes grades, scores, prerequisites, or the 80% mastery gate.</div>
        <div class="khae-reward-actions actions">
          <a class="btn primary" data-reward-play href="${game.url}" target="_blank" rel="noopener noreferrer">Play Challenge</a>
          <button class="btn" type="button" data-reward-another>Another Challenge</button>
          <button class="btn" type="button" data-reward-close>Maybe Later</button>
        </div>
      </div>`;
      overlay.querySelector("[data-reward-play]")?.addEventListener("click", () => {
        rewards.played[stamp] = { at: new Date().toISOString(), game: game.title };
        writeJSON(rewardKey, rewards);
        closeReward();
      });
      overlay.querySelector("[data-reward-another]")?.addEventListener("click", () => { offset += 1; render(); });
      overlay.querySelector("[data-reward-close]")?.addEventListener("click", () => {
        rewards.dismissed[stamp] = new Date().toISOString();
        writeJSON(rewardKey, rewards);
        closeReward();
      });
      overlay.querySelector("[data-reward-close]")?.focus();
    };

    overlay.addEventListener("click", event => { if (event.target === overlay) closeReward(); });
    document.addEventListener("keydown", function esc(event) {
      if (event.key === "Escape") { closeReward(); document.removeEventListener("keydown", esc); }
    });
    document.body.appendChild(overlay);
    render();
  }

  /* Weekly evidence */
  function updateProgress() {
    const bar = document.querySelector("[data-course-progress]");
    const label = document.querySelector("[data-course-progress-label]");
    const total = 36;
    const done = Array.from({ length: total }, (_, i) => progress[`week-${String(i + 1).padStart(2, "0")}`]).filter(Boolean).length;
    const pct = Math.round(done / total * 100);
    if (bar) bar.style.width = `${pct}%`;
    if (label) label.textContent = `${done} of ${total} weekly evidence records complete · ${pct}%`;
  }

  document.querySelectorAll("[data-progress-key]").forEach(button => {
    const key = button.dataset.progressKey;
    const sync = () => {
      const on = Boolean(progress[key]);
      button.setAttribute("aria-pressed", String(on));
      button.textContent = on ? "Weekly Evidence Recorded ✓" : "Record Weekly Evidence Complete";
      button.title = "This records evidence completion only. It does not satisfy or bypass any 80% mastery gate.";
    };
    sync();
    button.addEventListener("click", () => {
      const wasOn = Boolean(progress[key]);
      progress[key] = !wasOn;
      writeJSON(courseKey, progress);
      sync();
      updateProgress();
      if (!wasOn && progress[key]) showReward({ kind: "weekly", eventId: key, unit: currentUnit });
    });
  });
  updateProgress();

  /* Mastery fields and gates */
  document.querySelectorAll("[data-mastery-score]").forEach(field => {
    const id = field.dataset.masteryScore;
    const record = normalizeMasteryRecord(mastery[id]);
    if (record?.latestScore !== null && record?.latestScore !== undefined) field.value = record.latestScore;
    field.title = "Local mastery record. Enter only a score that has actually been evaluated through the course assessment process.";
  });

  function renderMasteryPanel(id, field, panel) {
    if (!field || !panel) return;
    const record = normalizeMasteryRecord(mastery[id]);
    if (!record || record.latestScore === null) {
      panel.innerHTML = "<strong>Not verified</strong><p>Enter a score from 0–100 only after the required evidence has actually been evaluated.</p>";
      return;
    }
    if (record.passed) {
      panel.innerHTML = `<strong>Best ${record.bestScore}% · Mastery demonstrated ✓</strong><p>Latest attempt: ${record.latestScore}% · Attempts recorded: ${record.attemptCount}. Prior mastery is preserved even if a later practice/reassessment score is lower.</p>`;
    } else {
      panel.innerHTML = `<strong>Latest ${record.latestScore}% · Best ${record.bestScore}% · Not yet mastered</strong><p>${MASTERY_THRESHOLD}% is required. Complete targeted corrective learning and reassess with fresh or meaningfully changed evidence.</p>`;
    }
  }

  function renderPrerequisites() {
    document.querySelectorAll("[data-prerequisite-panel]").forEach(panel => {
      const id = panel.dataset.prerequisitePanel;
      const record = normalizeMasteryRecord(mastery[id]);
      const passed = Boolean(record?.passed && Number(record.bestScore) >= MASTERY_THRESHOLD);
      panel.innerHTML = passed
        ? `<strong>${record.bestScore}% · Prerequisite mastered ✓</strong><p>${id.replace("unit-", "Unit ")} meets the ${MASTERY_THRESHOLD}% gate. This lesson is available.</p>`
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

  document.querySelectorAll("[data-mastery-check]").forEach(button => {
    const id = button.dataset.masteryCheck;
    const field = document.querySelector(`[data-mastery-score="${id}"]`);
    const panel = document.querySelector(`[data-mastery-panel="${id}"]`);
    button.addEventListener("click", () => {
      if (!field || !panel) return;
      const raw = String(field.value).trim();
      if (!raw) { panel.innerHTML = "<strong>Not recorded</strong><p>Enter an evaluated score from 0–100.</p>"; return; }
      const score = Number(raw);
      if (!Number.isFinite(score) || score < 0 || score > 100) { panel.innerHTML = "<strong>Check the score</strong><p>Enter a valid percentage from 0–100.</p>"; return; }
      const now = new Date().toISOString();
      const previous = normalizeMasteryRecord(mastery[id]);
      const previouslyPassed = Boolean(previous?.passed);
      const firstScore = previous?.firstScore ?? score;
      const bestScore = previous?.bestScore == null ? score : Math.max(previous.bestScore, score);
      const attemptCount = (previous?.attemptCount || 0) + 1;
      const passed = bestScore >= MASTERY_THRESHOLD;
      mastery[id] = {
        score: bestScore,
        firstScore,
        latestScore: score,
        bestScore,
        attemptCount,
        passed,
        threshold: MASTERY_THRESHOLD,
        masteredAt: previous?.masteredAt || (score >= MASTERY_THRESHOLD ? now : null),
        recordedAt: now,
        authority: "local-evaluated-score-record"
      };
      writeJSON(masteryKey, mastery);
      renderMasteryPanel(id, field, panel);
      renderPrerequisites();
      if (!previouslyPassed && passed) showReward({ kind: "mastery", eventId: id, unit: Number(id.match(/unit-(\d+)/)?.[1]) || currentUnit });
    });
    renderMasteryPanel(id, field, panel);
  });
  renderPrerequisites();

  /* Local notebook / print / search */
  document.querySelectorAll("[data-save-field]").forEach(field => {
    const key = `khae-ela9-field:${field.dataset.saveField}`;
    try { field.value = localStorage.getItem(key) || ""; } catch {}
    field.addEventListener("input", () => { try { localStorage.setItem(key, field.value); } catch {} });
  });
  document.querySelectorAll("[data-print]").forEach(button => button.addEventListener("click", () => window.print()));
  document.querySelectorAll("[data-clear-field]").forEach(button => button.addEventListener("click", () => {
    const field = document.getElementById(button.dataset.clearField);
    if (!field) return;
    field.value = "";
    field.dispatchEvent(new Event("input"));
    field.focus();
  }));
  const search = document.querySelector("[data-card-search]");
  search?.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    document.querySelectorAll("[data-search-card]").forEach(card => { card.hidden = Boolean(q && !card.textContent.toLowerCase().includes(q)); });
  });

  /* ==========================================================
     LearnA · 180-Day Vocabulary Strand
     ========================================================== */
  const LEARNA_URL = `${ARCADE}Learn_a_New_Word_index.html`;
  const VOCAB_PATH_URL = "../../vocabulary/index.html";
  const unitApplicationFocus = [
    "Use the word to sharpen observation, inference, evidence, or sentence-level precision.",
    "Test whether the word helps compare mythic patterns without flattening cultural difference.",
    "Use the word purposefully in narrative craft, voice, characterization, conflict, or revision.",
    "Explore sound, connotation, imagery, figurative meaning, form, or performance through the word.",
    "Apply the word to dramatic interpretation, conflict, motivation, stagecraft, or seminar reasoning.",
    "Use the word to improve rhetorical precision, audience awareness, reasoning, evidence, or public voice.",
    "Interrogate meaning through scope, provenance, connotation, uncertainty, and claim fit.",
    "Use the word only if it improves explanatory or technical precision; test whether a reader understands it.",
    "Apply the word to sustained interpretation and test whether later textual evidence changes the usage or claim.",
    "Use the word in argument only when it clarifies scope, evidence, warrants, tradeoffs, or qualification.",
    "Examine how the word changes audience interpretation across text, caption, layout, sequence, or another medium.",
    "Use the word in capstone reflection or defense only when artifact evidence supports the distinction it makes."
  ];
  const dailyMoves = [
    ["Hear & Define", "Hear the pronunciation, read both definitions, then restate the meaning accurately in your own words."],
    ["Inspect & Distinguish", "Inspect part of speech, origin, synonyms, register, and connotation. Name one near-synonym that would change the meaning."],
    ["Apply to Today's Thinking", "Use the word in a sentence connected directly to today's Language Arts work. The sentence must demonstrate the meaning rather than merely contain the word."],
    ["Challenge the Choice", "Ask whether the word actually improves precision. Compare it with a simpler alternative and keep the stronger choice for the audience and purpose."],
    ["Retrieve & Retain", "Complete LearnA's quick quiz, mark the word learned when appropriate, and reuse one earlier word naturally if it improves today's reflection."]
  ];
  const vocabCompletedCount = () => Array.from({ length: 180 }, (_, i) => Boolean(vocabulary[`day-${String(i + 1).padStart(3, "0")}`])).filter(Boolean).length;

  function injectDailyVocabulary() {
    if (!weekMatch || document.getElementById("daily-vocabulary-launch")) return;
    if (!currentWeek || currentWeek < 1 || currentWeek > 36) return;
    const startDay = (currentWeek - 1) * 5 + 1;
    const section = document.createElement("section");
    section.id = "daily-vocabulary-launch";
    section.className = "section-alt";
    const cards = dailyMoves.map(([title, prompt], index) => {
      const courseDay = startDay + index;
      const key = `day-${String(courseDay).padStart(3, "0")}`;
      const done = Boolean(vocabulary[key]);
      return `<article class="card day-card" data-vocab-card="${key}">
        <span class="day-label">Day ${index + 1} · Course Day ${courseDay}</span>
        <h3>${title}</h3><p>${prompt}</p>
        <p><strong>Unit ${currentUnit} application:</strong> ${unitApplicationFocus[currentUnit - 1]}</p>
        <div class="actions"><a class="btn primary" href="${LEARNA_URL}" target="_blank" rel="noopener noreferrer">Open Today's LearnA Word</a><button class="btn" type="button" data-vocab-complete="${key}" aria-pressed="${done}">${done ? "Daily Word Recorded ✓" : "Record Daily Word"}</button></div>
      </article>`;
    }).join("");
    section.innerHTML = `<div class="wrap"><div class="section-head"><p class="eyebrow">LearnA · Daily Vocabulary Launch</p><h2>One new word every instructional day.</h2><p>Use that day's word as a five-minute language-and-critical-thinking launch: hear → define → inspect → apply → challenge → retain.</p></div><div class="notice" data-vocab-summary>${vocabCompletedCount()} of 180 daily vocabulary launches recorded locally. Vocabulary practice is formative enrichment and does not satisfy or bypass the 80% mastery gate.</div><div class="grid day-grid" style="margin-top:16px">${cards}</div><div class="actions" style="margin-top:16px"><a class="btn" href="${VOCAB_PATH_URL}">Open 180-Day Vocabulary Path</a><a class="btn" href="https://artist1970.github.io/Eiren.github.io/" target="_blank" rel="noopener noreferrer">Ask Eiren to Test Precision</a></div></div>`;
    const quickNav = document.querySelector(".quick-nav");
    if (quickNav) quickNav.insertAdjacentElement("afterend", section);
    else document.querySelector("main")?.prepend(section);

    section.querySelectorAll("[data-vocab-complete]").forEach(button => button.addEventListener("click", () => {
      const key = button.dataset.vocabComplete;
      const wasDone = Boolean(vocabulary[key]);
      vocabulary[key] = !wasDone;
      writeJSON(vocabKey, vocabulary);
      const done = Boolean(vocabulary[key]);
      button.setAttribute("aria-pressed", String(done));
      button.textContent = done ? "Daily Word Recorded ✓" : "Record Daily Word";
      const summary = section.querySelector("[data-vocab-summary]");
      if (summary) summary.textContent = `${vocabCompletedCount()} of 180 daily vocabulary launches recorded locally. Vocabulary practice is formative enrichment and does not satisfy or bypass the 80% mastery gate.`;
      if (!wasDone && done) showReward({ kind: "daily", eventId: key, unit: currentUnit });
    }));
  }

  injectDailyVocabulary();
})();
