/* Khaemenes High · Social Studies Grade Shell v1
   Canonical VNV presentation/navigation adapter only.
   Curriculum, assessment, learner records, mastery, grading, evidence and storage remain course-owned. */
(()=>{"use strict";
if(window.KhaemenesSocialStudiesGradeShellV1)return;

const match=location.pathname.match(/\/courses\/social-studies\/grade-(09|10|11|12)\/?(?:index\.html)?$/i);
if(!match)return;
const grade=String(Number(match[1]));
const CONFIG={
 "9":{
   title:"Global Studies Honors",
   descriptor:"Grade 9 · History · Geography · Civics · Economics · Evidence & Inquiry",
   about:"A 36-week honors course in global history and human systems. Learners practice historical inquiry, geographic reasoning, source verification, comparison, causation, and evidence-based argument before advancing through mastery.",
   features:[
    ["Official Weeks","Enter the 36-week instructional pathway and continue from the current course week.","?view=week"],
    ["Assessments","Open readiness, weekly mastery, midterm, final, corrections, and recovery pathways.","?view=exams"],
    ["Progress & Evidence","Review learner reports, saved course evidence, completion, and mastery progress.","?view=reports"],
    ["Curriculum Map","Review the complete Grade 9 sequence, units, chronology, and course expectations.","docs/CURRICULUM_MAP.md"]
   ]
 },
 "10":{
   title:"United States History Honors",
   descriptor:"Grade 10 · United States History · Constitutional Development · Civic Literacy · Geography",
   about:"A 36-week honors study of United States history built around primary-source analysis, chronology, geography, constitutional development, civic reasoning, comparison, and evidence-based historical argument.",
   features:[
    ["Official Weeks","Open the complete 36-week United States History instructional pathway.","?view=week"],
    ["Assessments","Open course mastery checks, midterm and final assessment pathways.","?view=exams"],
    ["Progress & Evidence","Review reports, learner evidence, course completion, and mastery status.","?view=reports"],
    ["Curriculum Map","Review the full chronology, units, standards, and historical reasoning sequence.","docs/CURRICULUM_MAP.md"]
   ]
 },
 "11":{
   title:"Government, Law & Economics Honors",
   descriptor:"Grade 11 · Government · Constitutional Law · Economics · Public Policy · Civic Literacy",
   about:"A 36-week honors civic-systems course combining constitutional government, law, economics, public policy, civic reasoning, source verification, and applied financial literacy.",
   features:[
    ["Official Weeks","Open the Government, Law & Economics 36-week instructional sequence.","?view=week"],
    ["Assessments","Open course mastery checks and cumulative assessment pathways.","?view=exams"],
    ["Progress & Evidence","Review civic evidence, reports, course completion, and mastery status.","?view=reports"],
    ["Personal Finance","Enter the companion Personal Financial Literacy & Money Management Honors pathway.","personal-finance/index.html"]
   ]
 },
 "12":{
   title:"Global Politics, International Relations & Senior Research Honors",
   descriptor:"Grade 12 · Comparative Politics · International Relations · Research · Senior Capstone",
   about:"A senior honors course in comparative politics, international relations, international law, global challenges, ethical research, public communication, thesis development, and oral defense.",
   features:[
    ["Official Weeks","Open the senior 36-week comparative politics and research pathway.","?view=week"],
    ["Assessments","Open senior mastery checks, simulations, defenses, and cumulative assessments.","?view=assessments"],
    ["Progress & Evidence","Review senior research evidence, reports, completion, and mastery status.","?view=reports"],
    ["Graduation Gates","Review thesis, oral defense, cumulative assessment, and graduation requirements.","?view=graduation"]
   ]
 }
}[grade];

const HIGH="https://vervenveda.com/Khaemenes_High.github.io/";
const FAMILY="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
const ENROLL=FAMILY+"enroll/";

function load(src,key){
 return new Promise(resolve=>{
  const existing=[...document.scripts].find(s=>s.src&&s.src.includes(key));
  if(existing){
   if(existing.dataset.loaded==="1"||existing.readyState==="complete")resolve();
   else{existing.addEventListener("load",resolve,{once:true});existing.addEventListener("error",resolve,{once:true});}
   return;
  }
  const s=document.createElement("script");
  s.src=src;s.dataset.socialStudiesGradeShell="v1";
  s.onload=()=>{s.dataset.loaded="1";resolve()};s.onerror=resolve;
  document.head.append(s);
 });
}

function normalizeHero(){
 let hero=document.querySelector(".hero,.ss9-hero");
 if(!hero)return null;
 hero.classList.add("hero");
 let eyebrow=hero.querySelector(".eyebrow,.ss9-kicker,.kicker");
 if(!eyebrow){eyebrow=document.createElement("p");hero.prepend(eyebrow)}
 eyebrow.classList.add("eyebrow");eyebrow.textContent="Khaemenes Academy";
 let h1=hero.querySelector("h1");
 if(!h1){h1=document.createElement("h1");eyebrow.after(h1)}
 h1.textContent=CONFIG.title;
 let subtitle=hero.querySelector(".subtitle");
 if(!subtitle){subtitle=document.createElement("p");subtitle.className="subtitle";h1.after(subtitle)}
 subtitle.textContent=CONFIG.descriptor;
 let access=hero.querySelector(".high-subject-access");
 if(!access){
  access=document.createElement("nav");access.className="high-subject-access";access.setAttribute("aria-label","Academy access");
  access.innerHTML='<a href="'+HIGH+'#student-portal">Learner Profile</a><a href="'+FAMILY+'">Parent Profile</a><a href="'+ENROLL+'">Enrollment</a>';
  subtitle.after(access);
 }
 return hero;
}

function mountBreadcrumbs(hero){
 if(document.querySelector(".high-subject-breadcrumbs"))return;
 const nav=document.createElement("nav");
 nav.className="high-subject-breadcrumbs";
 nav.setAttribute("aria-label","Breadcrumb");
 nav.innerHTML='<a href="'+HIGH+'">High School</a><span aria-hidden="true">›</span><a href="../">Social Studies</a><span aria-hidden="true">›</span><span>Grade '+grade+'</span>';
 const root=hero?.parentElement||document.querySelector("main,.main")||document.body;
 root.insertBefore(nav,hero||root.firstChild);
}

function mountIntro(hero){
 const root=hero?.parentElement||document.querySelector("main.main,main,.main");
 if(!root||document.querySelector(".ss-shell-intro"))return;
 const intro=document.createElement("section");
 intro.className="ss-shell-intro";
 intro.innerHTML='<h2>About</h2><p>'+CONFIG.about+'</p>';
 const features=document.createElement("section");
 features.className="ss-shell-features";
 features.innerHTML='<h2>Course Features</h2>';
 const grid=document.createElement("div");grid.className="ss-feature-grid";
 CONFIG.features.forEach(([title,description,href],i)=>{
   const card=document.createElement("article");card.className="ss-feature-card";
   const h=document.createElement("h3");h.textContent=title;
   const p=document.createElement("p");p.textContent=description;
   const b=document.createElement("button");b.type="button";b.textContent="Explore";b.setAttribute("aria-haspopup","dialog");
   const dialog=document.createElement("dialog");dialog.className="ss-feature-dialog";dialog.id="ssFeatureDialog"+grade+"_"+i;
   dialog.innerHTML='<div class="ss-feature-dialog-inner"><h2>'+title+'</h2><p>'+description+'</p><div class="ss-feature-dialog-actions"><a href="'+href+'">Open</a><button type="button" data-close>Close</button></div></div>';
   b.setAttribute("aria-controls",dialog.id);
   b.addEventListener("click",()=>dialog.showModal());
   dialog.querySelector("[data-close]").addEventListener("click",()=>dialog.close());
   dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
   card.append(h,p,b);grid.append(card);document.body.append(dialog);
 });
 features.append(grid);
 hero.after(intro,features);
}

function configureClassTools(){
 if(window.KhaemenesClassToolsConfigV1?.id==="social-studies-grade-landing")return;
 function ensureTranslatorPanel(root){
  let panel=root?.querySelector("[data-vct-translator-panel]");
  if(panel)return panel;
  panel=document.createElement("div");panel.className="vct-pop";panel.setAttribute("data-vct-translator-panel","");panel.hidden=true;
  panel.innerHTML='<h2>Translate</h2><p>Choose the interface language for this Social Studies course page.</p><div data-vnv-language-mount></div>';
  root?.querySelector("#vnvClassToolsPanel")?.append(panel);return panel;
 }
 function moveTranslator(panel){
  const mount=panel?.querySelector("[data-vnv-language-mount]");
  const switcher=document.getElementById("vnv-language-switch");
  if(mount&&switcher&&switcher.parentElement!==mount)mount.append(switcher);
  document.getElementById("vnv-language-rail")?.remove();
 }
 window.KhaemenesClassToolsConfigV1=Object.freeze({
  id:"social-studies-grade-landing",
  match:()=>true,
  toggleLabel:"Tools",ariaLabel:"Social Studies Grade "+grade+" tools",
  tools:[
   {type:"link",label:"Student",sub:"Learner profile",href:HIGH+"#student-portal"},
   {type:"link",label:"Course",sub:"Social Studies home",href:"../"},
   {type:"link",label:"Search",sub:"Search ecosystem",href:"https://vervenveda.com/PLERASearch.github.io/"},
   {type:"action",label:"Translate",sub:"Change language",action:"translate"},
   {type:"link",label:"Parent",sub:"Family profile",href:FAMILY},
   {type:"link",label:"Enroll",sub:"Enrollment",href:ENROLL}
  ],
  actions:{translate:({root})=>{
    root.querySelectorAll(".vct-pop").forEach(p=>p.hidden=true);
    const panel=ensureTranslatorPanel(root);if(!panel)return;
    moveTranslator(panel);panel.hidden=false;window.VNVLanguage?.refresh?.();
  }}
 });
 document.addEventListener("vnv-class-tools-mounted",e=>moveTranslator(ensureTranslatorPanel(e.detail?.root||document.getElementById("vnvClassToolsToolbar"))));
 setTimeout(()=>moveTranslator(ensureTranslatorPanel(document.getElementById("vnvClassToolsToolbar"))),180);
}

async function mount(){
 if(!document.body)return;
 document.body.dataset.socialStudiesGradeShell="v1";
 document.body.dataset.highSubjectShell="true";
 const hero=normalizeHero();
 mountBreadcrumbs(hero);
 mountIntro(hero);

 await load("https://vervenveda.com/assets/vnv-333-ticker.js","vnv-333-ticker.js");
 await load("https://vervenveda.com/assets/vnv-ticker-autopopulate.js","vnv-ticker-autopopulate.js");
 try{window.VNV_TICKER?.autoPopulate?.({label:"Social Studies · Grade "+grade,max:14})}catch{}

 if(!document.querySelector("[data-vnv-header-legacy]")){
  const anchor=document.createElement("header");
  anchor.hidden=true;anchor.setAttribute("aria-hidden","true");anchor.setAttribute("data-vnv-header-legacy","");
  document.body.prepend(anchor);
 }
 await load("https://vervenveda.com/assets/vnv-header-autopopulate.js","vnv-header-autopopulate.js");
 try{window.VNV_HEADER?.mount?.({
  replaceLegacy:true,title:"Khaemenes Academy",subtitle:"High School · Social Studies · Grade "+grade,
  icon:"K",home:HIGH,actions:[]
 })}catch{}

 let rail=document.getElementById("vnv-language-rail");
 if(!rail){
  rail=document.createElement("div");rail.id="vnv-language-rail";rail.hidden=true;
  rail.setAttribute("role","group");rail.setAttribute("aria-label","Page translation tools");document.body.append(rail);
 }
 await load("https://vervenveda.com/assets/khaemenes-campus-phrases.js","khaemenes-campus-phrases.js");
 await load("https://vervenveda.com/assets/khaemenes-interlingual-core.js","khaemenes-interlingual-core.js");
 await load("https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1","khaemenes-translator-loader.js");
 await load("https://vervenveda.com/assets/vnv-language.js?v=20261121-half-height","vnv-language.js");

 configureClassTools();
 await load("https://vervenveda.com/assets/vnv-class-tools-toolbar.js?v=1.6.1","vnv-class-tools-toolbar.js");
 await load("https://vervenveda.com/assets/vnv-ecosystem-toolbar.js","vnv-ecosystem-toolbar.js");

 document.dispatchEvent(new CustomEvent("khaemenes-social-studies-grade-shell-ready",{detail:{grade,title:CONFIG.title}}));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
window.KhaemenesSocialStudiesGradeShellV1=Object.freeze({version:"1.0.1",mount});
})();