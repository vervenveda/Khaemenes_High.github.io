(() => {
  "use strict";
  const root=document.documentElement;
  const themeKey="khae-ela9-theme-v1";
  const themeButton=document.querySelector("[data-theme-toggle]");
  try{root.dataset.theme=localStorage.getItem(themeKey)||"light";}catch{root.dataset.theme="light";}
  function syncTheme(){if(themeButton){themeButton.textContent=root.dataset.theme==="dark"?"Light":"Dark";themeButton.setAttribute("aria-label",`Switch to ${root.dataset.theme==="dark"?"light":"dark"} theme`);}}
  syncTheme();
  themeButton?.addEventListener("click",()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";try{localStorage.setItem(themeKey,root.dataset.theme)}catch{}syncTheme();});

  const courseKey="khae-ela9-progress-v1";
  const masteryKey="khae-ela9-mastery-v1";
  const MASTERY_THRESHOLD=80;
  const load=()=>{try{return JSON.parse(localStorage.getItem(courseKey)||"{}")}catch{return {}}};
  const loadMastery=()=>{try{return JSON.parse(localStorage.getItem(masteryKey)||"{}")}catch{return {}}};
  const save=data=>{try{localStorage.setItem(courseKey,JSON.stringify(data))}catch{}};
  const saveMastery=data=>{try{localStorage.setItem(masteryKey,JSON.stringify(data))}catch{}};
  const progress=load();
  const mastery=loadMastery();

  document.querySelectorAll("[data-progress-key]").forEach(button=>{
    const key=button.dataset.progressKey;
    const on=Boolean(progress[key]);
    button.setAttribute("aria-pressed",String(on));
    button.textContent=on?"Weekly Evidence Recorded ✓":"Record Weekly Evidence Complete";
    button.title="This records evidence completion only. It does not satisfy or bypass any 80% mastery gate.";
    button.addEventListener("click",()=>{
      progress[key]=!progress[key];save(progress);
      button.setAttribute("aria-pressed",String(progress[key]));
      button.textContent=progress[key]?"Weekly Evidence Recorded ✓":"Record Weekly Evidence Complete";
      updateProgress();
    });
  });
  function updateProgress(){const bar=document.querySelector("[data-course-progress]");const label=document.querySelector("[data-course-progress-label]");if(!bar&&!label)return;const total=36,done=Array.from({length:36},(_,i)=>progress[`week-${String(i+1).padStart(2,"0")}`]).filter(Boolean).length;const pct=Math.round(done/total*100);if(bar)bar.style.width=`${pct}%`;if(label)label.textContent=`${done} of ${total} weekly evidence records complete · ${pct}%`;}
  updateProgress();

  document.querySelectorAll("[data-mastery-score]").forEach(field=>{const id=field.dataset.masteryScore;if(mastery[id]?.score!==undefined)field.value=mastery[id].score;});
  document.querySelectorAll("[data-mastery-check]").forEach(button=>{
    const id=button.dataset.masteryCheck,field=document.querySelector(`[data-mastery-score="${id}"]`),panel=document.querySelector(`[data-mastery-panel="${id}"]`);
    const render=()=>{if(!field||!panel)return;const raw=String(field.value).trim();if(raw===""){panel.innerHTML="<strong>Not verified</strong><p>Enter a verified assessment score from 0–100.</p>";return;}const score=Number(raw);if(!Number.isFinite(score)||score<0||score>100){panel.innerHTML="<strong>Check the score</strong><p>Enter a valid percentage from 0–100.</p>";return;}const passed=score>=MASTERY_THRESHOLD;mastery[id]={score,passed,threshold:MASTERY_THRESHOLD,recordedAt:new Date().toISOString()};saveMastery(mastery);panel.innerHTML=passed?`<strong>${score}% · Mastery demonstrated ✓</strong><p>The ${MASTERY_THRESHOLD}% gate is satisfied. Progression may continue.</p>`:`<strong>${score}% · Not yet mastered</strong><p>${MASTERY_THRESHOLD}% is required. Complete corrective learning, review missed skills, and retry before progression.</p>`;renderPrerequisites();};
    button.addEventListener("click",render);if(mastery[id]?.score!==undefined)render();
  });

  function renderPrerequisites(){
    document.querySelectorAll("[data-prerequisite-panel]").forEach(panel=>{
      const id=panel.dataset.prerequisitePanel,record=mastery[id],passed=Boolean(record&&record.passed&&Number(record.score)>=MASTERY_THRESHOLD);
      panel.innerHTML=passed?`<strong>${record.score}% · Prerequisite mastered ✓</strong><p>${id.replace("unit-","Unit ")} meets the ${MASTERY_THRESHOLD}% gate. This lesson is available.</p>`:`<strong>Prerequisite not yet verified</strong><p>${id.replace("unit-","Unit ")} must reach ${MASTERY_THRESHOLD}% before this lesson begins.</p>`;
      document.querySelectorAll(`[data-prerequisite-content="${id}"]`).forEach(control=>{control.setAttribute("aria-disabled",String(!passed));if(!passed){control.dataset.lockedHref=control.getAttribute("href")||control.dataset.lockedHref||"";control.removeAttribute("href");control.title=`${id.replace("unit-","Unit ")} mastery of ${MASTERY_THRESHOLD}% is required`;}else if(!control.getAttribute("href")&&control.dataset.lockedHref){control.setAttribute("href",control.dataset.lockedHref);control.removeAttribute("aria-disabled");}});
    });
  }
  renderPrerequisites();

  document.querySelectorAll("[data-save-field]").forEach(field=>{const key=`khae-ela9-field:${field.dataset.saveField}`;try{field.value=localStorage.getItem(key)||""}catch{}field.addEventListener("input",()=>{try{localStorage.setItem(key,field.value)}catch{}});});
  document.querySelectorAll("[data-print]").forEach(button=>button.addEventListener("click",()=>window.print()));
  document.querySelectorAll("[data-clear-field]").forEach(button=>button.addEventListener("click",()=>{const field=document.getElementById(button.dataset.clearField);if(!field)return;field.value="";field.dispatchEvent(new Event("input"));field.focus();}));
  const search=document.querySelector("[data-card-search]");if(search){search.addEventListener("input",()=>{const q=search.value.trim().toLowerCase();document.querySelectorAll("[data-search-card]").forEach(card=>{card.hidden=q&&!card.textContent.toLowerCase().includes(q);});});}
})();
