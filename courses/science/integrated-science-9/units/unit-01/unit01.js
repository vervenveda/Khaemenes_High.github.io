"use strict";
(() => {
  const KEY = "khaemenes_science_u01_v1";
  const ROOT_KEY = "khaemenes_science_integrated9_v1";
  const THEME_KEY = "khaemenes_theme";
  const REQUIREMENTS = [
    "day01","day02","day03","day04","day05",
    "day06","day07","day08","day09","day10",
    "helicopter","dataset","quiz","design","assessment","reflection"
  ];
  const DEFAULT = {
    completedPages: [],
    helicopter: { complete:false, completedAt:null },
    dataset: { complete:false, completedAt:null },
    quiz: { passed:false, score:0, total:15, attempts:0, completedAt:null },
    design: { submitted:false, title:"", completedAt:null },
    assessment: { passed:false, score:0, total:24, attempts:0, completedAt:null },
    reflection: { complete:false, text:"", completedAt:null },
    updatedAt:null
  };

  const PROTOOLS_BASE = "https://vervenveda.com/proresource_hub.github.io/Protools/";
  const RESOURCE_CATALOG = {
    calculator: {
      label:"Scientific Calculator",
      url:`${PROTOOLS_BASE}Khaemenes_Scientific_Calculator/`,
      note:"Use for unit conversions, scientific notation, averages, percent change, and quantitative checks."
    },
    evidence: {
      label:"Evidence Citation Studio",
      url:`${PROTOOLS_BASE}Evidence_Citation_Studio/`,
      note:"Capture sources, distinguish evidence from interpretation, and build transparent citation records."
    },
    atlas: {
      label:"Atlas Evidence Analysis",
      url:`${PROTOOLS_BASE}Atlas_Evidence_Analysis.html`,
      note:"Classify claims, observations, assumptions, evidence, and limitations before drawing conclusions."
    },
    prose: {
      label:"PROSE Editorial Suite",
      url:`${PROTOOLS_BASE}PROSE/editorial-gateway.html`,
      note:"Revise CER explanations, lab summaries, methods, and scientific writing without replacing your reasoning."
    },
    dataset: {
      label:"Unit 01 Dataset Laboratory",
      url:"../dataset-laboratory.html",
      lessonUrl:"../dataset-laboratory.html",
      note:"Analyze a supplied dataset, graph evidence, identify variation, and evaluate conclusions."
    },
    design: {
      label:"Investigation Design Task",
      url:"../investigation-design-task.html",
      lessonUrl:"../investigation-design-task.html",
      note:"Turn a question into variables, controls, measurements, safety boundaries, and a defensible procedure."
    }
  };

  const $ = (s,p=document) => p.querySelector(s);
  const $$ = (s,p=document) => [...p.querySelectorAll(s)];
  function parse(raw,fallback){try{return JSON.parse(raw)??fallback}catch{return fallback}}
  function load(){
    const saved=parse(localStorage.getItem(KEY),{});
    return {
      ...DEFAULT,...saved,
      completedPages:Array.isArray(saved.completedPages)?saved.completedPages:[],
      helicopter:{...DEFAULT.helicopter,...(saved.helicopter||{})},
      dataset:{...DEFAULT.dataset,...(saved.dataset||{})},
      quiz:{...DEFAULT.quiz,...(saved.quiz||{})},
      design:{...DEFAULT.design,...(saved.design||{})},
      assessment:{...DEFAULT.assessment,...(saved.assessment||{})},
      reflection:{...DEFAULT.reflection,...(saved.reflection||{})}
    };
  }
  let state=load();

  function save(){
    state.updatedAt=new Date().toISOString();
    localStorage.setItem(KEY,JSON.stringify(state));
    syncRoot();
    updatePage();
  }

  function requirementComplete(id){
    if(/^day\d\d$/.test(id)) return state.completedPages.includes(id);
    if(id==="helicopter") return Boolean(state.helicopter.complete);
    if(id==="dataset") return Boolean(state.dataset.complete);
    if(id==="quiz") return Boolean(state.quiz.passed);
    if(id==="design") return Boolean(state.design.submitted);
    if(id==="assessment") return Boolean(state.assessment.passed);
    if(id==="reflection") return Boolean(state.reflection.complete);
    return false;
  }
  function unitComplete(){return REQUIREMENTS.every(requirementComplete)}

  function syncRoot(){
    const isComplete=unitComplete();
    const root=parse(localStorage.getItem(ROOT_KEY),{});
    const completed=new Set(Array.isArray(root.completedUnits)?root.completedUnits:[]);
    if(isComplete) completed.add("u01");
    else completed.delete("u01");
    const courseSequenceComplete=["u00","u01","u02","u03","u04","u05","u06","u07","u08","u09","u10","u11","u12"].every(id=>completed.has(id));
    localStorage.setItem(ROOT_KEY,JSON.stringify({
      ...root,
      pathway:root.pathway||"Core",
      completedUnits:[...completed],
      notes:root.notes&&typeof root.notes==="object"?root.notes:{},
      lastVisitedUnit:"u01",
      courseSequenceComplete,
      updatedAt:new Date().toISOString()
    }));
  }

  function applyTheme(theme){
    const resolved=["dark","light"].includes(theme)?theme:"dark";
    document.documentElement.dataset.theme=resolved;
    localStorage.setItem(THEME_KEY,resolved);
    const button=$("#themeToggle");
    if(button){
      button.textContent=resolved==="dark"?"☼":"◐";
      button.setAttribute("aria-label",`Switch to ${resolved==="dark"?"light":"dark"} theme`);
    }
  }
  function initializeTheme(){
    const saved=localStorage.getItem(THEME_KEY);
    const preferred=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";
    applyTheme(saved||preferred);
    $("#themeToggle")?.addEventListener("click",()=>applyTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
  }

  function repairPortalLinks(){
    const repositoryRoot=location.pathname.includes("/lessons/")
      ?"../../../../../../"
      :"../../../../../";

    $$("a").forEach(link=>{
      const label=link.textContent.replace(/\s+/g," ").trim();
      if(label==="High School"){
        link.setAttribute("href",`${repositoryRoot}index.html`);
      }else if(label==="Grade 9"){
        link.setAttribute("href",`${repositoryRoot}grades/grade-09/`);
      }
    });
  }

  function resourceHref(resource){
    if(location.pathname.includes("/lessons/") && resource.lessonUrl) return resource.lessonUrl;
    if(resource.url.startsWith("../") && !location.pathname.includes("/lessons/")) return resource.url.replace(/^\.\.\//,"");
    return resource.url;
  }

  function chooseResources(){
    const text=`${document.title} ${$("h1")?.textContent||""} ${document.body?.textContent?.slice(0,6000)||""}`.toLowerCase();
    const chosen=[];
    const add=id=>{if(!chosen.includes(id))chosen.push(id)};

    if(/measure|unit|precision|accuracy|uncertainty|average|mean|graph|data|quant|significant|scientific notation/.test(text)) add("calculator");
    if(/source|evidence|claim|citation|research|reliable|bias|correlation|causation|cer/.test(text)) add("evidence");
    if(/question|variable|control|hypothesis|investigat|method|design|fair test|observation|inference/.test(text)) add("atlas");
    if(/cer|claim|reasoning|explanation|reflection|report|communicat|conclusion|method/.test(text)) add("prose");
    if(/data|graph|variation|anomal|uncertainty|mean|trend|correlation/.test(text)) add("dataset");
    if(/question|variable|control|investigat|procedure|method|design/.test(text)) add("design");

    if(!chosen.length){add("evidence");add("prose")}
    return chosen.slice(0,4);
  }

  function mountIntegrationDock(){
    if($("#scienceIntegrationDock"))return;
    const host=$("article.lesson-page") || $("main article") || $("main .card") || $("main");
    if(!host)return;

    const selected=chooseResources();
    const section=document.createElement("section");
    section.id="scienceIntegrationDock";
    section.className="lesson-section science-integration-dock no-print";
    section.setAttribute("aria-labelledby","scienceIntegrationTitle");
    section.innerHTML=`
      <h2 id="scienceIntegrationTitle">Interactive Science Studio</h2>
      <p>Use the recommended tools as part of the investigation. Record what the tool reveals, what assumptions it makes, and what evidence still must come from your own observations or reasoning.</p>
      <div class="science-tool-grid">
        ${selected.map(id=>{
          const r=RESOURCE_CATALOG[id];
          const external=/^https?:/i.test(resourceHref(r));
          return `<a class="science-tool-card" href="${resourceHref(r)}"${external?' target="_blank" rel="noopener noreferrer"':''}><strong>${r.label}</strong><span>${r.note}</span></a>`;
        }).join("")}
      </div>
      <p class="science-tool-rule"><strong>Evidence rule:</strong> tools support exploration and verification; they do not replace measurements, written reasoning, source evaluation, safety review, or the ≥80% mastery requirement.</p>`;

    const actions=$(".lesson-actions",host);
    if(actions) host.insertBefore(section,actions); else host.append(section);

    if(!$("#scienceIntegrationDockStyles")){
      const style=document.createElement("style");
      style.id="scienceIntegrationDockStyles";
      style.textContent=`.science-integration-dock{border-top:1px solid var(--line,rgba(255,255,255,.15));margin-top:24px;padding-top:22px}.science-tool-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:14px 0}.science-tool-card{display:flex;min-width:0;min-height:104px;flex-direction:column;gap:7px;justify-content:center;padding:15px;border:1px solid color-mix(in srgb,var(--teal,#62c8c0) 45%,var(--line,transparent));border-radius:14px;background:color-mix(in srgb,var(--panel2,#173148) 88%,transparent);color:var(--ink,#f4f2e9);text-decoration:none}.science-tool-card:hover{border-color:var(--teal,#62c8c0);transform:translateY(-1px)}.science-tool-card strong{color:var(--teal,#62c8c0)}.science-tool-card span{color:var(--muted,#b8c5cc);font-size:.9rem;line-height:1.5}.science-tool-rule{font-size:.9rem;color:var(--muted,#b8c5cc)}@media(max-width:720px){.science-tool-grid{grid-template-columns:1fr}}@media print{.science-integration-dock{display:none!important}}`;
      document.head.append(style);
    }
  }

  function toast(message){
    const box=$("#toast"); if(!box)return;
    box.textContent=message;box.hidden=false;
    clearTimeout(toast.timer);toast.timer=setTimeout(()=>box.hidden=true,3400);
  }

  function togglePage(id){
    const set=new Set(state.completedPages);
    if(set.has(id))set.delete(id);else set.add(id);
    state.completedPages=[...set];save();
    toast(set.has(id)?"Lesson marked complete.":"Lesson completion removed.");
  }

  function markEvidence(type){
    if(type==="helicopter")state.helicopter={complete:true,completedAt:new Date().toISOString()};
    if(type==="dataset")state.dataset={complete:true,completedAt:new Date().toISOString()};
    save();toast("Investigation evidence recorded.");
  }

  function submitDesign(event){
    event.preventDefault();
    const checks=$$(".design-check");
    if(!checks.every(box=>box.checked)){toast("Complete every design component before recording submission.");return}
    state.design={submitted:true,title:$("#designTitle")?.value.trim()||"Investigation design task",completedAt:new Date().toISOString()};
    save();toast("Investigation design task recorded.");
  }

  function submitReflection(event){
    event.preventDefault();
    const text=$("#reflectionText")?.value.trim()||"";
    if(text.length<40){toast("Add a fuller reflection of at least 40 characters.");return}
    state.reflection={complete:true,text,completedAt:new Date().toISOString()};
    save();toast("Unit reflection recorded.");
  }

  function updatePage(){
    $$("[data-requirement]").forEach(card=>{
      const done=requirementComplete(card.dataset.requirement);
      card.dataset.complete=String(done);
      const status=$("[data-requirement-status]",card);
      if(status)status.textContent=done?"Complete":"Not complete";
    });
    const count=REQUIREMENTS.filter(requirementComplete).length;
    const percent=Math.round(count/REQUIREMENTS.length*100);
    $("#unitProgressFill")&&($("#unitProgressFill").style.width=`${percent}%`);
    $("#unitProgressCount")&&($("#unitProgressCount").textContent=`${count} of ${REQUIREMENTS.length} requirements`);
    $("#unitProgressPercent")&&($("#unitProgressPercent").textContent=`${percent}%`);
    $("#unitCompletionStatus")&&($("#unitCompletionStatus").textContent=unitComplete()?"Unit 01 complete":"Unit 01 in progress");

    $$("[data-page-complete]").forEach(button=>{
      const id=button.dataset.pageComplete;
      const done=state.completedPages.includes(id);
      button.setAttribute("aria-pressed",String(done));
      button.textContent=done?"Lesson Complete ✓":"Mark Lesson Complete";
    });
    $$("[data-evidence]").forEach(button=>{
      const type=button.dataset.evidence;
      const done=Boolean(state[type]?.complete);
      button.disabled=done;
      button.textContent=done?"Evidence Recorded ✓":"Record Evidence Complete";
    });

    if($("#designTitle"))$("#designTitle").value=state.design.title||"";
    if($("#reflectionText"))$("#reflectionText").value=state.reflection.text||"";
    updateRecord();
  }

  function updateRecord(){
    if(!$("#recordStatus"))return;
    $("#recordStatus").textContent=unitComplete()?"Complete":"In progress";
    $("#recordLessons").textContent=`${state.completedPages.filter(id=>/^day\d\d$/.test(id)).length} of 10`;
    $("#recordInvestigations").textContent=`${Number(state.helicopter.complete)+Number(state.dataset.complete)} of 2`;
    $("#recordQuiz").textContent=state.quiz.passed?`${state.quiz.score} of ${state.quiz.total} · Passed`:`${state.quiz.score||0} of ${state.quiz.total}`;
    $("#recordDesign").textContent=state.design.submitted?"Submitted":"Not submitted";
    $("#recordAssessment").textContent=state.assessment.passed?`${state.assessment.score} of ${state.assessment.total} · Passed`:`${state.assessment.score||0} of ${state.assessment.total}`;
    $("#recordReflection").textContent=state.reflection.complete?"Recorded":"Not recorded";
    $("#recordDate").textContent=new Date().toLocaleDateString();
    $("#recordReflectionText").textContent=state.reflection.text||"No reflection recorded.";
  }

  function exportRecord(){
    const payload={schema:"khaemenes-science-u01-v1",course:"KH-SCI-IIS9",unit:"u01",exportedAt:new Date().toISOString(),state};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;
    a.download=`KH-SCI-IIS9-unit01-record-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
    toast("Unit 01 record exported.");
  }

  function initialize(){
    repairPortalLinks();
    initializeTheme();
    mountIntegrationDock();
    $$("[data-page-complete]").forEach(button=>button.addEventListener("click",()=>togglePage(button.dataset.pageComplete)));
    $$("[data-evidence]").forEach(button=>button.addEventListener("click",()=>markEvidence(button.dataset.evidence)));
    $("#designForm")?.addEventListener("submit",submitDesign);
    $("#reflectionForm")?.addEventListener("submit",submitReflection);
    $("#printPage")?.addEventListener("click",()=>window.print());
    $("#exportUnitRecord")?.addEventListener("click",exportRecord);
    syncRoot();
    updatePage();
  }

  window.KhaemenesUnit01={
    loadState:()=>state,
    saveState(next){state={...state,...next};save()},
    toast
  };
  document.addEventListener("DOMContentLoaded",initialize);
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
