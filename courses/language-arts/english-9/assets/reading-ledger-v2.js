/* Khaemenes Academy | English 9 Reading Ledger v2
 * Additive extension of the 30-row legacy ledger.
 * Preserves every legacy data-save-field key; no migration, deletion, grading,
 * mastery, or non-learner-scoped persistence.
 */
(() => {
  "use strict";
  if (window.__KHAE_E9_READING_LEDGER_V2__) return;
  if (!/\/english-9\/records\/reading-log\.html$/i.test(location.pathname)) return;
  window.__KHAE_E9_READING_LEDGER_V2__ = true;

  const table = document.querySelector("table.standards-table");
  const tbody = table && table.tBodies && table.tBodies[0];
  const holder = table && table.closest(".table-wrap");
  if (!tbody || !holder) return;
  const MAX_ROWS = 500;
  const COUNT_KEY = "khae-ela9-reading-rows-v2";
  const context = window.KhaemenesEnglish9Records;
  const enabled = !!(context && context.profile && context.profile.learnerId &&
    typeof context.storageKey === "function");
  const keyFor = name => context.storageKey(name);
  const savedField = name => keyFor("khae-ela9-field:" + name);

  const controls = document.createElement("div");
  controls.className = "actions no-print";
  controls.style.cssText = "justify-content:center;align-items:center;flex-wrap:wrap;margin:20px auto 12px";
  const add = document.createElement("button");
  add.type = "button";
  add.className = "btn primary";
  add.textContent = "Add Reading Entry";
  const exportButton = document.createElement("button");
  exportButton.type = "button";
  exportButton.className = "btn";
  exportButton.textContent = "Export Reading Log JSON";
  const status = document.createElement("p");
  status.setAttribute("role","status");
  status.setAttribute("aria-live","polite");
  status.style.cssText = "flex-basis:100%;text-align:center;font-size:16px;margin:4px auto";
  controls.append(add,exportButton,status);
  holder.parentNode.insertBefore(controls,holder);
  const note = document.createElement("p");
  note.style.cssText = "text-align:center;font-size:16px;margin:0 auto 12px;max-width:950px";
  note.textContent = "Your first 30 rows remain unchanged. Add as many reading records as needed, then export a backup. Reading documentation is not an automatic grade.";
  holder.parentNode.insertBefore(note,holder);

  const caption = document.createElement("caption");
  caption.textContent = "English 9 reading records: assigned texts, independent reading, source context, and written evidence";
  caption.style.cssText = "font-size:16px;text-align:left;padding:8px 0";
  table.insertBefore(caption,table.firstChild);

  if (!enabled) {
    add.disabled = true;
    exportButton.disabled = true;
    status.textContent = "Select a valid Academy learner profile to add or export reading records. Existing entries have not been changed.";
    return;
  }

  function get(name) {
    try { return localStorage.getItem(savedField(name)) || ""; }
    catch { return ""; }
  }
  function put(name,value) {
    localStorage.setItem(savedField(name),String(value));
  }
  function countRows() {
    let raw = null;
    try { raw = localStorage.getItem(keyFor(COUNT_KEY)); } catch {}
    const count = Number.parseInt(raw || "30",10);
    return Number.isFinite(count) ? Math.max(30,Math.min(MAX_ROWS,count)) : 30;
  }
  const selectOptions = {
    week: [["","—"]].concat(Array.from({length:36},(_,i)=>[String(i+1),"W"+String(i+1).padStart(2,"0")])),
    unit: [["","—"]].concat(Array.from({length:12},(_,i)=>[String(i+1),"U"+String(i+1).padStart(2,"0")])),
    "curriculum-type": [["","—"],["Assigned","Assigned"],["Independent","Independent"],["Research","Research"],["Extension","Extension"]],
    "source-status": [["","—"],["Teacher-approved / lawful source","Teacher-approved / lawful source"],["Academy original","Academy original"],["Public domain","Public domain"],["Library / licensed access","Library / licensed access"],["Student-selected source","Student-selected source"]]
  };
  const columnDefs = [
    ["week","Reading week","select"],
    ["unit","Reading unit","select"],
    ["curriculum-type","Reading type","select"],
    ["source-status","Reading source status","select"],
    ["title","Title","input"],
    ["author","Author","input"],
    ["type","Text type / tradition","input"],
    ["date","Date","input"],
    ["amount","Pages or minutes","input"],
    ["evidence","Response or conference","input"]
  ];
  function makeField(kind,label,type,n) {
    const name = "reading-" + kind + "-" + n;
    const element = document.createElement(type === "select" ? "select" : "input");
    element.setAttribute("data-save-field",name);
    element.setAttribute("aria-label",label+" "+n);
    if (type === "input") element.type = "text";
    if (type === "select") {
      for (const pair of selectOptions[kind] || []) {
        const option = document.createElement("option");
        option.value = pair[0];
        option.textContent = pair[1];
        element.append(option);
      }
    }
    element.value = get(name);
    const persist = () => {
      try {
        put(name,element.value);
        refreshStatus();
      } catch {
        status.textContent = "Saving failed: storage may be unavailable or full. Export a backup before changing devices.";
      }
    };
    element.addEventListener(type === "select" ? "change" : "input",persist);
    return element;
  }
  function appendRow(n) {
    if (tbody.querySelector('[data-save-field="reading-title-'+n+'"]')) return;
    const row = document.createElement("tr");
    row.setAttribute("data-reading-ledger-row",String(n));
    const number = document.createElement("td");
    number.textContent = String(n);
    row.append(number);
    for (const [kind,label,type] of columnDefs) {
      const cell = document.createElement("td");
      cell.append(makeField(kind,label,type,n));
      row.append(cell);
    }
    tbody.append(row);
    return row;
  }
  function refreshStatus() {
    const rows = tbody.querySelectorAll('input[data-save-field^="reading-title-"]');
    let filled = 0;
    for (const input of rows) if (input.value.trim()) filled++;
    status.textContent = filled+" reading entr"+(filled===1?"y":"ies")+" recorded · "+rows.length+" available rows. Keep a downloaded backup.";
    add.disabled = rows.length >= MAX_ROWS;
  }

  let rows = countRows();
  for (let n = 31; n <= rows; n++) appendRow(n);
  refreshStatus();

  add.addEventListener("click",() => {
    const next = rows + 1;
    if (next > MAX_ROWS) return;
    try {
      localStorage.setItem(keyFor(COUNT_KEY),String(next));
    } catch {
      status.textContent = "Unable to reserve a new row. Existing records remain unchanged. Export a backup.";
      return;
    }
    rows = next;
    const row = appendRow(next);
    const week = Number(new URLSearchParams(location.search).get("week")||0);
    const reading = (window.ENGLISH_9_CURRICULUM && window.ENGLISH_9_CURRICULUM.weekPlans || [])
      .find(plan=>Number(plan.n)===week)?.readingSuggestion;
    if (row && week>=1 && week<=36) {
      const defaults = {
        week:String(week),unit:String(Math.ceil(week/3)),
        "curriculum-type":"Assigned",title:reading?.title||"",author:reading?.author||""
      };
      for (const [kind,value] of Object.entries(defaults)) {
        const el = row.querySelector('[data-save-field="reading-'+kind+'-'+next+'"]');
        if (el && !el.value && value) {
          el.value = value;
          try { put("reading-"+kind+"-"+next,value); }
          catch { status.textContent="A field could not be saved. Export before leaving."; }
        }
      }
    }
    refreshStatus();
    const title = row && row.querySelector('[data-save-field="reading-title-'+next+'"]');
    if (title) title.focus();
  });

  exportButton.addEventListener("click",() => {
    const fields = [...document.querySelectorAll("[data-save-field]")];
    const saved = {};
    for (const field of fields) {
      if (field.value) saved[field.dataset.saveField] = field.value;
    }
    const payload = {
      schema:"khaemenes-english9-reading-ledger-v2",
      exportedAt:new Date().toISOString(),
      learnerId:context.profile.learnerId,
      totalRows:rows,
      fields:saved,
      note:"Learner-specific reading evidence, not an academic grade or mastery record."
    };
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href=url;
    anchor.download="english-9-reading-ledger-backup.json";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
    status.textContent="Backup download requested. Confirm the JSON file was saved before leaving this device.";
  });
})();
