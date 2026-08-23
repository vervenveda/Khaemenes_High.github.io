"use strict";
(() => {
  const STORAGE_KEY = "khaemenes_science9_success_challenges_v1";
  const ARCADE = "https://vervenveda.github.io/arcade.github.io/";
  const GAMES = [
    {id:"hangman",title:"Science Word Challenge",subtitle:"A quick vocabulary break",url:`${ARCADE}Hangman_index.html`},
    {id:"iq-mini",title:"Logic Spark",subtitle:"A short reasoning challenge",url:`${ARCADE}IQ-mini_index.html`},
    {id:"affixsix",title:"Pattern Break",subtitle:"A strategy-and-pattern reward",url:`${ARCADE}AffixSix%E2%84%A2_index.html`},
    {id:"connect4",title:"Strategy Break",subtitle:"A quick connect-four challenge",url:`${ARCADE}Orions_connect_four_index.html`},
    {id:"sudoku",title:"Puzzle Reset",subtitle:"A short logic puzzle",url:`${ARCADE}Jenny%27s_Sudoku_index.html`}
  ];

  let state = {};
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { state = {}; }
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} };
  const esc = v => String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

  function chooseGame(key) {
    const prior = state.lastGame || "";
    const seed = [...key].reduce((a,c)=>a+c.charCodeAt(0),0);
    let pool = GAMES.filter(g=>g.id!==prior);
    if (!pool.length) pool = GAMES;
    return pool[seed % pool.length];
  }

  function closeModal(modal) {
    modal?.remove();
    if (modal?._escHandler) document.removeEventListener("keydown", modal._escHandler);
  }

  function showChallenge(detail={}) {
    const key = detail.key || `${location.pathname}:${new Date().toISOString().slice(0,10)}`;
    if (state.seen?.[key]) return;
    state.seen = {...(state.seen||{}),[key]:new Date().toISOString()};
    const game = chooseGame(key);
    state.lastGame = game.id;
    save();

    const overlay = document.createElement("div");
    overlay.setAttribute("role","presentation");
    overlay.style.cssText="position:fixed;inset:0;z-index:2147483000;background:rgba(2,8,14,.72);display:grid;place-items:center;padding:22px;backdrop-filter:blur(5px)";
    const card = document.createElement("section");
    card.setAttribute("role","dialog");
    card.setAttribute("aria-modal","true");
    card.setAttribute("aria-labelledby","scienceChallengeTitle");
    card.style.cssText="width:min(560px,94vw);border:1px solid rgba(214,181,91,.55);border-radius:16px;padding:24px;background:#0b1721;color:#f6f0df;box-shadow:0 24px 70px rgba(0,0,0,.45);text-align:center";
    card.innerHTML=`<p style="margin:0 0 8px;letter-spacing:.14em;text-transform:uppercase;font-size:.76rem;color:#d6b55b">Science Success Challenge</p><h2 id="scienceChallengeTitle" style="margin:.2rem 0 .6rem">Nice work — challenge unlocked.</h2><p style="margin:0 auto 18px;max-width:470px;line-height:1.6">You recorded real science progress. Take an optional 2–5 minute brain break, or continue directly to the next lesson.</p><div style="padding:14px;border-radius:12px;background:rgba(255,255,255,.055);margin-bottom:18px"><strong style="display:block;font-size:1.08rem">${esc(game.title)}</strong><span style="opacity:.8">${esc(game.subtitle)}</span></div><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a href="${game.url}" target="_blank" rel="noopener noreferrer" data-challenge-open style="display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:8px;background:#d6b55b;color:#111;text-decoration:none;font-weight:700">Play Optional Challenge</a><button type="button" data-challenge-close style="padding:10px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;cursor:pointer">Keep Learning</button></div><p style="font-size:.82rem;opacity:.68;margin:16px 0 0">Arcade play never changes science grades, mastery, or unlock status.</p>`;
    overlay.append(card);document.body.append(overlay);
    const close=()=>closeModal(overlay);
    overlay._escHandler=e=>{if(e.key==="Escape")close()};
    document.addEventListener("keydown",overlay._escHandler);
    card.querySelector("[data-challenge-close]")?.addEventListener("click",close);
    card.querySelector("[data-challenge-open]")?.addEventListener("click",()=>{state.opened={...(state.opened||{}),[key]:{game:game.id,at:new Date().toISOString()}};save();setTimeout(close,120)});
    overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
    card.querySelector("[data-challenge-close]")?.focus();
  }

  function bindLessonCompletionRewards() {
    document.querySelectorAll("[data-page-complete]").forEach(button => {
      if (button.dataset.successChallengeBound === "true") return;
      button.dataset.successChallengeBound = "true";
      button.addEventListener("click", () => {
        const wasComplete = button.getAttribute("aria-pressed") === "true";
        const id = button.dataset.pageComplete || "lesson";
        setTimeout(() => {
          const isComplete = button.getAttribute("aria-pressed") === "true";
          if (!wasComplete && isComplete) {
            showChallenge({key:`lesson:${id}:first-success`});
          }
        }, 180);
      });
    });
  }

  window.addEventListener("khaemenes:science-success", e => showChallenge(e.detail||{}));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindLessonCompletionRewards);
  else bindLessonCompletionRewards();
})();