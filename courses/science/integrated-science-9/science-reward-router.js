"use strict";
(() => {
  const path = window.location.pathname;
  if (!/\/courses\/science\/integrated-science-9\//.test(path)) return;
  if (/(mastery-quiz|unit-assessment|midterm|final|exam|assessment)/i.test(path)) return;

  const STORAGE_KEY = "khaemenes_science_rewards_v1";
  const ARCADE = "https://vervenveda.github.io/arcade.github.io/";

  const UNIT03 = {
    day01: { title:"Systems Spark", game:"IQ-mini_index.html", label:"Mini IQ Reasoning", note:"A short logic challenge after building your first homeostasis model." },
    day02: { title:"Transport Break", game:"Orions_connect_four_index.html", label:"Orion's Connect Four", note:"Switch from pathway tracing to a quick strategy challenge." },
    day03: { title:"Structure Strategy", game:"Checkers_Variant_Lab_index.html", label:"Checkers Variant Lab", note:"A strategy break after structure-function reasoning." },
    day04: { title:"Gradient Challenge", game:"IQ-mini_index.html", label:"Mini IQ Reasoning", note:"Keep the pattern-recognition muscles working after gas-exchange reasoning." },
    day05: { title:"Data Victory", game:"Jenny's_Sudoku_index.html", label:"Jenny's Sudoku", note:"A calm logic reward after quantitative exercise-response analysis." },
    day06: { title:"Word Pathway Bonus", game:"Hangman_index.html", label:"Progressive Hangman", note:"A vocabulary-friendly reward after tracing digestion and absorption." },
    day07: { title:"Metabolic Strategy", game:"Orions_connect_four_index.html", label:"Orion's Connect Four", note:"A short strategic reset after liver pathway reasoning." },
    day08: { title:"Regulation Reward", game:"IQ-mini_index.html", label:"Mini IQ Reasoning", note:"A quick logic challenge after nephron and osmoregulation work." },
    day09: { title:"Thermal Brain Break", game:"Jenny's_Sudoku_index.html", label:"Jenny's Sudoku", note:"A quiet pattern challenge after thermoregulation modeling." },
    day10: { title:"Feedback Bonus", game:"Checkers_Variant_Lab_index.html", label:"Checkers Variant Lab", note:"Opposing moves make a nice strategy echo of antagonistic regulation." },
    day11: { title:"Signal Challenge", game:"Hangman_index.html", label:"Progressive Hangman", note:"A quick word-and-pattern challenge after nervous-system signaling." },
    day12: { title:"Coordination Bonus", game:"IQ-mini_index.html", label:"Mini IQ Reasoning", note:"A reasoning reward after comparing nervous and endocrine communication." },
    day13: { title:"Evidence Victory", game:"Hangman_index.html", label:"Progressive Hangman", note:"Reinforce careful terminology after immunity and evidence literacy." },
    day14: { title:"Systems Strategist", game:"Orions_connect_four_index.html", label:"Orion's Connect Four", note:"A strategy reward after completing an integrated systems case." },
    day15: { title:"Synthesis Celebration", game:"Jenny's_Sudoku_index.html", label:"Jenny's Sudoku", note:"A calm optional celebration after the unit synthesis lesson." }
  };

  function readState(){
    try {
      return Object.assign({ sparks:0, awarded:{}, challengesOpened:0 }, JSON.parse(localStorage.getItem(STORAGE_KEY)) || {});
    } catch {
      return { sparks:0, awarded:{}, challengesOpened:0 };
    }
  }

  function writeState(state){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function ensureStyles(){
    if (document.getElementById("scienceRewardStyles")) return;
    const style = document.createElement("style");
    style.id = "scienceRewardStyles";
    style.textContent = `
      .science-reward-backdrop{position:fixed;inset:0;z-index:2147482500;background:rgba(2,10,18,.72);display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(5px)}
      .science-reward-card{width:min(520px,100%);border:1px solid rgba(213,180,100,.55);border-radius:16px;background:#0b1721;color:#f7f1df;box-shadow:0 28px 80px rgba(0,0,0,.45);padding:24px;text-align:center;font-family:inherit}
      .science-reward-eyebrow{margin:0 0 8px;font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;color:#d9bb74}
      .science-reward-card h2{margin:.15rem 0 .65rem;font-size:1.6rem}
      .science-reward-card p{line-height:1.55;color:#dce5e9}
      .science-reward-sparks{display:inline-flex;gap:7px;align-items:center;margin:8px auto 16px;padding:7px 11px;border-radius:999px;background:rgba(217,187,116,.1);border:1px solid rgba(217,187,116,.35);font-size:.88rem}
      .science-reward-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px}
      .science-reward-actions a,.science-reward-actions button{border-radius:8px;padding:10px 15px;font:inherit;font-weight:700;cursor:pointer;text-decoration:none}
      .science-reward-play{background:#d9bb74;color:#10202c;border:1px solid #d9bb74}
      .science-reward-skip{background:transparent;color:#f7f1df;border:1px solid rgba(247,241,223,.35)}
      .science-reward-note{font-size:.8rem!important;color:#9fb0ba!important;margin:14px 0 0!important}
    `;
    document.head.appendChild(style);
  }

  function closeModal(){ document.getElementById("scienceRewardBackdrop")?.remove(); }

  function showReward(detail){
    if (!detail || detail.type !== "lesson" || detail.unit !== "u03") return;
    const challenge = UNIT03[detail.id];
    if (!challenge) return;

    const state = readState();
    const awardKey = `u03:${detail.id}`;
    if (state.awarded?.[awardKey]) return;
    state.awarded = state.awarded || {};
    state.awarded[awardKey] = new Date().toISOString();
    state.sparks = Number(state.sparks || 0) + 1;
    writeState(state);

    ensureStyles();
    closeModal();
    const back = document.createElement("div");
    back.className = "science-reward-backdrop";
    back.id = "scienceRewardBackdrop";
    back.setAttribute("role", "dialog");
    back.setAttribute("aria-modal", "true");
    back.setAttribute("aria-labelledby", "scienceRewardTitle");
    back.innerHTML = `
      <section class="science-reward-card">
        <p class="science-reward-eyebrow">Lesson evidence recorded · Bonus unlocked</p>
        <h2 id="scienceRewardTitle">${challenge.title}</h2>
        <p>${challenge.note}</p>
        <div class="science-reward-sparks">✦ Science Sparks: <strong>${state.sparks}</strong></div>
        <div class="science-reward-actions">
          <a class="science-reward-play" data-reward-play href="${ARCADE}${encodeURI(challenge.game)}" target="_blank" rel="noopener noreferrer">Play ${challenge.label}</a>
          <button class="science-reward-skip" type="button" data-reward-skip>Continue Learning</button>
        </div>
        <p class="science-reward-note">Optional enrichment only. Arcade play never changes science grades, mastery, or lesson evidence.</p>
      </section>`;
    document.body.appendChild(back);
    back.querySelector("[data-reward-skip]")?.addEventListener("click", closeModal);
    back.querySelector("[data-reward-play]")?.addEventListener("click", () => {
      const latest = readState();
      latest.challengesOpened = Number(latest.challengesOpened || 0) + 1;
      writeState(latest);
      closeModal();
    });
    back.addEventListener("click", e => { if (e.target === back) closeModal(); });
    document.addEventListener("keydown", function esc(e){ if(e.key === "Escape"){ closeModal(); document.removeEventListener("keydown", esc); } });
    setTimeout(() => back.querySelector("[data-reward-play]")?.focus(), 0);
  }

  window.addEventListener("khaemenes:science-success", e => showReward(e.detail));
})();
