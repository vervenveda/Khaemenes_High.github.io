(() => {
  "use strict";

  const root = document.documentElement;
  const themeKey = "khae-language-arts-theme-v1";
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

  /* Department landing pages do not write course-completion or mastery records.
     English I–IV keep their own course namespaces and authoritative progression logic. */

  document.querySelectorAll("[data-save-field]").forEach(field => {
    const key = `khae-language-arts-field:${field.dataset.saveField}`;
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
  search?.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    document.querySelectorAll("[data-search-card]").forEach(card => {
      card.hidden = Boolean(q && !card.textContent.toLowerCase().includes(q));
    });
  });
})();
