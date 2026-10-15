"use strict";

(() => {
  const LEGACY_STORAGE_KEY = "khaemenes_science_integrated9_v1";
  const ACTIVE_LEARNER_KEY = "kh_sci9_u04_active_learner_v1";
  function learnerId() {
    try { const id = sessionStorage.getItem(ACTIVE_LEARNER_KEY); return typeof id === "string" && /^[a-z0-9_-]{3,32}$/.test(id) ? id : null; }
    catch { return null; }
  }
  const STORAGE_KEY = learnerId() ? "kh_sci9_learner_v1:" + learnerId() + ":" + LEGACY_STORAGE_KEY : "kh_sci9_dashboard_unselected_v1";
  function learnerBanner() {
    const target = document.querySelector("main") || document.body;
    const banner = document.createElement("section");
    banner.setAttribute("aria-label","Science 9 learner record");
    banner.style.cssText = "max-width:980px;margin:16px auto;padding:16px;text-align:center;border:1px solid #b4aa95;border-radius:7px;background:#fffaf0;color:#18212a";
    const status = document.createElement("p");
    status.textContent = learnerId() ? "Active Science 9 learner: " + learnerId() + ". Progress is stored locally for this learner." : "No learner selected. Select a learner before editing or importing Science 9 progress. Older shared-browser records remain preserved.";
    const button = document.createElement("button");
    button.type="button";button.textContent="Select / switch learner";button.style.cssText="border-radius:7px;padding:10px 16px";
    button.addEventListener("click",()=>{
      const id = window.prompt("Science 9 learner ID (3–32 letters, numbers, underscores or hyphens):",learnerId()||"");
      if(id===null)return;
      const cleaned=id.trim().toLowerCase();
      if(!/^[a-z0-9_-]{3,32}$/.test(cleaned)){window.alert("Invalid learner ID; progress was not changed.");return;}
      try { sessionStorage.setItem(ACTIVE_LEARNER_KEY,cleaned); location.reload(); }
      catch { window.alert("Session storage unavailable; no record was changed."); }
    });
    banner.append(status,button);target.prepend(banner);
    if(!learnerId()){
      for(const id of ["pathwaySelect","importProgress","progressFile","resetProgress","confirmReset"]){
        const el=document.getElementById(id);
        if(el){el.disabled=true;el.setAttribute("aria-disabled","true");}
      }
    }
  }
  const THEME_KEY = "khaemenes_theme";
  const DEFAULT_STATE = {
    pathway: "Core",
    completedUnits: [],
    notes: {},
    lastVisitedUnit: null,
    updatedAt: null
  };

  const FALLBACK_UNITS = [
    ["u00",0,1,"Readiness, Laboratory Safety & Scientific Habits","diagnostic/"],
    ["u01",1,2,"Scientific Inquiry, Measurement & Evidence","units/unit-01/"],
    ["u02",2,3,"Cells & the Organization of Life","units/unit-02/"],
    ["u03",3,3,"Body Systems & Homeostasis","units/unit-03/"],
    ["u04",4,3,"Cell Division, Reproduction & Inheritance","units/unit-04/"],
    ["u05",5,3,"Ecosystems, Evolution & Biodiversity","units/unit-05/"],
    ["u06",6,3,"Atomic Structure & Periodic Patterns","units/unit-06/"],
    ["u07",7,3,"Bonding, Chemical Reactions & Matter","units/unit-07/"],
    ["u08",8,3,"Motion, Forces & Energy","units/unit-08/"],
    ["u09",9,3,"Electricity, Waves & Information","units/unit-09/"],
    ["u10",10,3,"Earth Systems & Biogeochemical Cycles","units/unit-10/"],
    ["u11",11,3,"Dynamic Earth, Climate & Space","units/unit-11/"],
    ["u12",12,3,"Sustainable Engineering Capstone","units/unit-12/"]
  ].map(([id, number, weeks, title, path]) => ({
    id, number, weeks, title, path, status: "planned",
    big_idea: "This instructional section is scheduled for systematic release.",
    objectives: []
  }));

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  function safeParse(raw, fallback) {
    try {
      const value = JSON.parse(raw);
      return value && typeof value === "object" ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function loadState() {
    const saved = safeParse(localStorage.getItem(STORAGE_KEY), {});
    return {
      ...DEFAULT_STATE,
      ...saved,
      completedUnits: Array.isArray(saved.completedUnits) ? saved.completedUnits : [],
      notes: saved.notes && typeof saved.notes === "object" ? saved.notes : {}
    };
  }

  let state = loadState();
  let lastSeenRecord = localStorage.getItem(STORAGE_KEY);
  let recordConflict = false;
  function checkRecordConflict() {
    const latest = localStorage.getItem(STORAGE_KEY);
    if (latest !== lastSeenRecord) {
      recordConflict = true;
      announce("Science 9 progress changed in another tab. Reload before saving to avoid overwriting newer work.");
      return true;
    }
    return false;
  }
  let units = FALLBACK_UNITS;
  let activeFilter = "all";

  function saveState() {
    if(!learnerId()){ announce("Select a learner before saving Science 9 progress."); return; }
    if (recordConflict || checkRecordConflict()) return;
    state.updatedAt = new Date().toISOString();
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    lastSeenRecord = serialized;
    updateProgress();
  }

  function announce(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(() => {
      toast.hidden = true;
    }, 3600);
  }

  function applyTheme(theme) {
    const resolved = ["dark", "light"].includes(theme) ? theme : "dark";
    document.documentElement.dataset.theme = resolved;
    localStorage.setItem(THEME_KEY, resolved);
    const toggle = $("#themeToggle");
    if (toggle) {
      toggle.textContent = resolved === "dark" ? "☼" : "◐";
      toggle.setAttribute("aria-label", `Switch to ${resolved === "dark" ? "light" : "dark"} theme`);
    }
  }

  function initializeTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const preferred = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    applyTheme(saved || preferred);
    $("#themeToggle")?.addEventListener("click", () => {
      applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  function updateOnlineStatus() {
    const dot = $("#onlineDot");
    const label = $("#onlineLabel");
    const online = navigator.onLine;
    if (dot) dot.classList.toggle("offline", !online);
    if (label) label.textContent = online ? "Online · local progress active" : "Offline · local progress remains available";
  }

  function normalizeCourseMap(data) {
    if (!data || !Array.isArray(data.units)) return FALLBACK_UNITS;
    return data.units.map(unit => ({
      id: String(unit.id || ""),
      number: Number(unit.number ?? 0),
      weeks: Number(unit.weeks || 0),
      title: String(unit.title || "Untitled unit"),
      path: String(unit.path || ""),
      status: ["open", "planned", "complete"].includes(unit.status) ? unit.status : "planned",
      big_idea: String(unit.big_idea || ""),
      objectives: Array.isArray(unit.objectives) ? unit.objectives.map(String) : []
    }));
  }

  async function loadCourseMap() {
    try {
      const response = await fetch("course-map.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Course map request failed: ${response.status}`);
      const data = await response.json();
      units = normalizeCourseMap(data);
    } catch (error) {
      console.warn("Using embedded course-map fallback.", error);
      units = FALLBACK_UNITS;
    }
    renderUnits();
    updateProgress();
  }

  function unitStatusText(status) {
    if (status === "open") return "Open";
    if (status === "complete") return "Released";
    return "Planned";
  }

  function renderUnits() {
    const list = $("#unitList");
    if (!list) return;

    const query = ($("#unitSearch")?.value || "").trim().toLowerCase();
    const filtered = units.filter(unit => {
      const matchesQuery = !query || [
        unit.title,
        unit.big_idea,
        ...unit.objectives
      ].join(" ").toLowerCase().includes(query);
      const matchesStatus = activeFilter === "all" || unit.status === activeFilter;
      return matchesQuery && matchesStatus;
    });

    if (!filtered.length) {
      list.innerHTML = '<div class="empty-state">No course sections match the current search and filter.</div>';
      return;
    }

    list.innerHTML = filtered.map(unit => {
      const isCompleted = state.completedUnits.includes(unit.id);
      const canOpen = unit.status === "open" || unit.status === "complete";
      const objectives = unit.objectives.slice(0, 3)
        .map(item => `<span>${escapeHtml(item)}</span>`).join("");
      const numberLabel = unit.number === 0 ? "START" : String(unit.number).padStart(2, "0");

      return `
        <article class="card unit-card" data-unit-id="${escapeHtml(unit.id)}" data-status="${escapeHtml(unit.status)}">
          <div class="unit-number" aria-hidden="true">${numberLabel}</div>
          <div>
            <div class="status-label status-${escapeHtml(unit.status)}">${unitStatusText(unit.status)} · ${unit.weeks} week${unit.weeks === 1 ? "" : "s"}</div>
            <h3>${escapeHtml(unit.title)}</h3>
            <p>${escapeHtml(unit.big_idea)}</p>
            ${objectives ? `<div class="unit-objectives">${objectives}</div>` : ""}
          </div>
          <div class="unit-actions">
            ${canOpen && unit.path
              ? `<a class="btn primary unit-open" href="${escapeAttr(unit.path)}" data-unit="${escapeAttr(unit.id)}">Open section</a>`
              : `<button class="btn" type="button" disabled>Release pending</button>`}
            <button class="btn completion-toggle" type="button"
              data-unit="${escapeAttr(unit.id)}"
              aria-pressed="${isCompleted}">
              ${isCompleted ? "Marked complete" : "Mark complete"}
            </button>
          </div>
        </article>`;
    }).join("");

    $$(".completion-toggle", list).forEach(button => {
      button.addEventListener("click", () => toggleComplete(button.dataset.unit));
    });
    $$(".unit-open", list).forEach(link => {
      link.addEventListener("click", () => {
        state.lastVisitedUnit = link.dataset.unit || null;
        saveState();
      });
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function toggleComplete(id) {
    if (!id) return;
    const completed = new Set(state.completedUnits);
    if (completed.has(id)) completed.delete(id);
    else completed.add(id);
    state.completedUnits = [...completed];
    saveState();
    renderUnits();
    announce(completed.has(id) ? "Course section marked complete." : "Completion mark removed.");
  }

  function updateProgress() {
    const total = units.length || 1;
    const validIds = new Set(units.map(unit => unit.id));
    const completedCount = state.completedUnits.filter(id => validIds.has(id)).length;
    const percentage = Math.round((completedCount / total) * 100);

    const bar = $("#progressFill");
    if (bar) bar.style.width = `${percentage}%`;
    $("#progressPercent") && ($("#progressPercent").textContent = `${percentage}%`);
    $("#progressCount") && ($("#progressCount").textContent = `${completedCount} of ${total} sections`);
    $("#pathwaySelect") && ($("#pathwaySelect").value = state.pathway);

    const continueButton = $("#continueButton");
    if (continueButton) {
      const preferred = units.find(unit => unit.id === state.lastVisitedUnit && unit.status !== "planned")
        || units.find(unit => !state.completedUnits.includes(unit.id) && unit.status !== "planned")
        || units.find(unit => unit.status !== "planned");

      if (preferred?.path) {
        continueButton.href = preferred.path;
        continueButton.removeAttribute("aria-disabled");
        continueButton.textContent = preferred.number === 0 ? "Open Readiness Section" : `Continue Unit ${String(preferred.number).padStart(2, "0")}`;
      } else {
        continueButton.href = "#course-map";
        continueButton.setAttribute("aria-disabled", "true");
        continueButton.textContent = "Units Releasing Systematically";
      }
    }
  }

  function exportProgress() {
    const payload = {
      schema: "khaemenes-science-progress-v1",
      course: "KH-SCI-IIS9",
      exportedAt: new Date().toISOString(),
      state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `KH-SCI-IIS9-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    announce("Progress file exported.");
  }

  function importProgress(file) {
    if(!learnerId()){announce("Select a learner before importing progress.");return;}
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result));
        if (payload.schema !== "khaemenes-science-progress-v1" || payload.course !== "KH-SCI-IIS9") {
          throw new Error("This is not a valid Science 9 progress file.");
        }
        const imported = payload.state || {};
        state = {
          ...DEFAULT_STATE,
          ...imported,
          pathway: ["Foundation", "Core", "Extended"].includes(imported.pathway) ? imported.pathway : "Core",
          completedUnits: Array.isArray(imported.completedUnits) ? imported.completedUnits.map(String) : [],
          notes: imported.notes && typeof imported.notes === "object" ? imported.notes : {}
        };
        saveState();
        renderUnits();
        announce("Progress restored successfully.");
      } catch (error) {
        announce(error.message || "The progress file could not be imported.");
      }
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if(!learnerId()){announce("Select a learner before resetting progress.");return;}
    state = { ...DEFAULT_STATE, completedUnits: [], notes: {} };
    if (recordConflict || checkRecordConflict()) return;
    localStorage.removeItem(STORAGE_KEY);
    lastSeenRecord = null;
    updateProgress();
    renderUnits();
    announce("Local Science 9 progress was reset.");
  }

  function initializeControls() {
    $("#pathwaySelect")?.addEventListener("change", event => {
      state.pathway = event.target.value;
      saveState();
      announce(`${state.pathway} pathway selected.`);
    });

    $("#unitSearch")?.addEventListener("input", renderUnits);
    $("#statusFilter")?.addEventListener("change", event => {
      activeFilter = event.target.value;
      renderUnits();
    });

    $("#exportProgress")?.addEventListener("click", exportProgress);
    $("#heroExportProgress")?.addEventListener("click", exportProgress);
    $("#importProgress")?.addEventListener("click", () => $("#progressFile")?.click());
    $("#progressFile")?.addEventListener("change", event => {
      importProgress(event.target.files?.[0]);
      event.target.value = "";
    });
    $("#resetProgress")?.addEventListener("click", () => $("#resetDialog")?.showModal());
    $("#confirmReset")?.addEventListener("click", () => {
      resetProgress();
      $("#resetDialog")?.close();
    });
    $("#cancelReset")?.addEventListener("click", () => $("#resetDialog")?.close());

    $("#continueButton")?.addEventListener("click", event => {
      if (event.currentTarget.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        document.querySelector("#course-map")?.scrollIntoView({ behavior: "smooth" });
        announce("Instructional units are planned and will be released one at a time.");
      }
    });

    window.addEventListener("storage", event => {
      if (event.key === STORAGE_KEY && event.newValue !== lastSeenRecord) {
        recordConflict = true;
        announce("Another Science 9 tab changed this learner's progress. Reload before editing.");
      }
    });
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
  }

  function initialize() {
    initializeTheme();
    learnerBanner();
    initializeControls();
    updateOnlineStatus();

    /*
     * The full course-map request belongs only on the Science 9 course page.
     * Other pages, including the Assessment Hall, reuse this controller for
     * theme and navigation support but do not contain a unit-list mount point.
     */
    if ($("#unitList")) {
      loadCourseMap();
    } else {
      updateProgress();
    }
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();
/* Shared redesigned-gateway theme layer. */
(() => {
  const marker="/courses/science/integrated-science-9/";
  const path=window.location.pathname;
  const at=path.indexOf(marker);
  const base=at>=0 ? path.slice(0,at+marker.length) : new URL("./",window.location.href).pathname;
  if(document.querySelector('script[data-science-theme-loader]')) return;
  const script=document.createElement("script");
  script.src=`${base}science-theme-loader.js`;
  script.defer=true;
  script.dataset.scienceThemeLoader="true";
  document.head.append(script);
})();
