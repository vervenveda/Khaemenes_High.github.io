
(() => {
  "use strict";
  const scriptUrl=new URL(document.currentScript?.src||"assets/course.js",location.href);
  const courseRoot=new URL("../",scriptUrl);
  const courseHref=path=>new URL(path,courseRoot).href;
  const root=document.documentElement;
  const themeKey="khae-ela9-theme-v1";
  const themeButton=document.querySelector("[data-theme-toggle]");
  try{root.dataset.theme=localStorage.getItem(themeKey)||"light";}catch{root.dataset.theme="light";}
  function syncTheme(){if(themeButton){themeButton.textContent=root.dataset.theme==="dark"?"Light":"Dark";themeButton.setAttribute("aria-label",`Switch to ${root.dataset.theme==="dark"?"light":"dark"} theme`);}}
  syncTheme();
  themeButton?.addEventListener("click",()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";try{localStorage.setItem(themeKey,root.dataset.theme)}catch{}syncTheme();});

  const courseKey="khae-ela9-progress-v1";
  const load=()=>{try{return JSON.parse(localStorage.getItem(courseKey)||"{}")}catch{return {}}};
  const save=data=>{try{localStorage.setItem(courseKey,JSON.stringify(data))}catch{}};
  const progress=load();
  const masteryReadyUnits=new Set(["unit-01","unit-02"]);
  document.querySelectorAll("[data-progress-key]").forEach(button=>{
    const key=button.dataset.progressKey;
    if(/^unit-\d{2}$/.test(key)){
      if(!masteryReadyUnits.has(key)){
        button.setAttribute("aria-disabled","true");
        button.disabled=true;
        button.textContent="Instructional Build Pending";
        return;
      }
      let mastered=false;
      try{
        const record=JSON.parse(localStorage.getItem("khae-ela9-mastery-v2")||"{}").units?.[key];
        mastered=Boolean(record?.lessonIds?.length&&record.lessonIds.every(id=>Number(record.lessonAttempts?.[id]?.bestScore??record.lessonScores?.[id])>=Number(record.threshold||80)));
      }catch{}
      button.setAttribute("aria-pressed",String(mastered));
      button.setAttribute("aria-disabled",String(!mastered));
      button.textContent=mastered?"Mastery Verified ✓":"Open Coursebook to Verify Mastery";
      button.addEventListener("click",()=>{if(!mastered)location.href=courseHref(`units/${key}/coursebook.html#reflection`);});
      return;
    }
    const on=Boolean(progress[key]);
    button.setAttribute("aria-pressed",String(on));
    button.textContent=on?"Reviewed ✓":"Mark Reviewed";
    button.addEventListener("click",()=>{
      progress[key]=!progress[key];save(progress);
      button.setAttribute("aria-pressed",String(progress[key]));
      button.textContent=progress[key]?"Reviewed ✓":"Mark Reviewed";
      updateProgress();
    });
  });
  function updateProgress(){
    const bar=document.querySelector("[data-course-progress]");
    const label=document.querySelector("[data-course-progress-label]");
    if(!bar&&!label)return;
    const total=36,done=Array.from({length:36},(_,i)=>progress[`week-${String(i+1).padStart(2,"0")}`]).filter(Boolean).length;
    const pct=Math.round(done/total*100);
    if(bar)bar.style.width=`${pct}%`;
    if(label)label.textContent=`${done} of ${total} weekly plans reviewed · ${pct}% · review is not mastery`;
  }
  updateProgress();

  // Public course-shell contract: every formal course page receives the same
  // learner-safe routes. These links expose no private topology or backend state.
  const headerActions=document.querySelector(".header-actions");
  if(headerActions){
    const shellLinks=[
      ["Learning Lab","learning-lab.html"],
      ["Translator","tools/multilingual-translator/index.html"],
      ["Eiren","mentor.html"],
      ["Beta","beta.html"]
    ];
    shellLinks.reverse().forEach(([label,path])=>{
      if(headerActions.querySelector(`[data-course-shell="${path}"]`))return;
      const link=document.createElement("a");
      link.className="nav-button shell-link";
      link.href=courseHref(path);
      link.dataset.courseShell=path;
      link.textContent=label;
      headerActions.prepend(link);
    });
  }

  document.querySelectorAll("[data-save-field]").forEach(field=>{
    const key=`khae-ela9-field:${field.dataset.saveField}`;
    try{field.value=localStorage.getItem(key)||""}catch{}
    field.addEventListener("input",()=>{try{localStorage.setItem(key,field.value)}catch{}});
  });
  document.querySelectorAll("[data-check-key]").forEach(field=>{
    const key=`khae-ela9-check:${field.dataset.checkKey}`;
    try{field.checked=localStorage.getItem(key)==="true"}catch{}
    field.addEventListener("change",()=>{try{localStorage.setItem(key,String(field.checked))}catch{}});
  });
  document.querySelectorAll("[data-print]").forEach(button=>button.addEventListener("click",()=>window.print()));
  document.querySelectorAll("[data-clear-field]").forEach(button=>button.addEventListener("click",()=>{
    const field=document.getElementById(button.dataset.clearField);if(!field)return;field.value="";field.dispatchEvent(new Event("input"));field.focus();
  }));

  const search=document.querySelector("[data-card-search]");
  if(search){search.addEventListener("input",()=>{const q=search.value.trim().toLowerCase();document.querySelectorAll("[data-search-card]").forEach(card=>{card.hidden=q&&!card.textContent.toLowerCase().includes(q);});});}
})();
