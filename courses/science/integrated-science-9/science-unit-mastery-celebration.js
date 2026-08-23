"use strict";
(() => {
  const path = window.location.pathname;
  const match = path.match(/\/courses\/science\/integrated-science-9\/units\/(unit-\d{2})(?:\/|$)/);
  if (!match) return;
  const unit = match[1];
  const STORAGE_KEY = "khaemenes_science9_unit_mastery_celebrations_v1";
  let seen = {};
  try { seen = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { seen = {}; }
  const persist = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seen)); } catch {} };

  function mastered() {
    const status = document.querySelector("#unitCompletionStatus");
    if (!status) return false;
    return /complete\s*·\s*mastery verified/i.test(status.textContent || "");
  }

  function celebrate() {
    if (!mastered() || seen[unit]) return;
    seen[unit] = new Date().toISOString();
    persist();
    window.dispatchEvent(new CustomEvent("khaemenes:science-success", {
      detail: {
        key: `${unit}:full-mastery`,
        kind: "unit-mastery",
        title: `${unit.replace("unit-", "Unit ")} mastery verified`
      }
    }));
  }

  function attach() {
    const status = document.querySelector("#unitCompletionStatus");
    if (!status) return;
    celebrate();
    new MutationObserver(celebrate).observe(status, {childList:true, subtree:true, characterData:true});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attach, {once:true});
  else attach();
})();