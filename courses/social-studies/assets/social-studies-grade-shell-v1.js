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
    ["Assessments","Open senior mastery checks, simulations, defenses, and cumulative assessments.","?view=exams"],
    ["Progress & Evidence","Review senior research evidence, reports, completion, and mastery status.","?view=reports"],
    ["Graduation Gates","Review thesis, oral defense, cumulative assessment, and graduation requirements.","docs/GRADUATION_REQUIREMENTS.md"]
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

function style(){
 if(document.getElementById("socialStudiesGradeShellV1Style"))return;
 const s=document.createElement("style");
 s.id="socialStudiesGradeShellV1Style";
 s.textContent=`
 html:root:root body[data-social-studies-grade-shell="v1"]{
   background:#f4f0e7!important;color:#243038!important;font-size:16px!important;
   font-family:"Brandon Grotesque",Nunito,"Avenir Next","Segoe UI",Arial,sans-serif!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] :is(p,li,a,button,input,select,textarea,label,summary,td,th){font-size:max(16px,1em)}
 html:root:root body[data-social-studies-grade-shell="v1"] :is(h1,h2,h3,h4,h5,h6,strong,b,summary,button,.button){font-weight:400!important}
 html:root:root body[data-social-studies-grade-shell="v1"] :is(button,.button,a.button,.card,.panel,.ss9-tool,details,dialog,input,select,textarea){border-radius:7px!important}

 html:root:root body[data-social-studies-grade-shell="v1"] .high-subject-breadcrumbs{
   width:min(100%,1100px);margin:0 auto;padding:11px 18px;text-align:center;
   display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;
   color:#243038;background:#eee7d8;border-bottom:1px solid #d8cdb9
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .high-subject-breadcrumbs a{color:#243038;text-decoration:none}
 html:root:root body[data-social-studies-grade-shell="v1"] .high-subject-breadcrumbs a:hover{text-decoration:underline;text-underline-offset:3px}

 html:root:root body[data-social-studies-grade-shell="v1"] .hero{
  background:#243038!important;background-image:none!important;color:#fff8e9!important;
  border-radius:0!important;text-align:center!important;padding:55px 24px!important;box-shadow:none!important;
  max-width:none!important;width:100%!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .hero:before,
 html:root:root body[data-social-studies-grade-shell="v1"] .hero:after{display:none!important}
 html:root:root body[data-social-studies-grade-shell="v1"] .hero .eyebrow{
  margin:0!important;color:#fff8e9!important;font:400 33px/1.15 Cinzel,Georgia,serif!important;
  letter-spacing:.03em!important;text-transform:none!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .hero h1{
  margin:10px auto!important;color:#fff8e9!important;font:400 clamp(44px,7vw,66px)/1.05 Cinzel,Georgia,serif!important;
  letter-spacing:.02em!important;max-width:1120px!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .hero .subtitle{
  margin:0 auto!important;color:#fff8e9!important;font:400 24px/1.35 "Brandon Grotesque",Nunito,Arial,sans-serif!important;
  max-width:1000px!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .hero>p:not(.eyebrow):not(.subtitle){
  color:#e8dfcf!important;font-size:16px!important;line-height:1.65!important;margin:12px auto!important;max-width:900px!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .high-subject-access{
  width:min(100%,760px)!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:11px!important;margin:20px auto 0!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .high-subject-access a{
  box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;
  min-height:44px!important;padding:9px 14px!important;border:1px solid #fff8e9!important;border-radius:7px!important;
  background:#fff8e9!important;color:#243038!important;-webkit-text-fill-color:#243038!important;
  font:400 16px/1.3 "Brandon Grotesque",Nunito,Arial,sans-serif!important;text-decoration:none!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .high-subject-access a:first-child{
  background:#243038!important;color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important
 }

 html:root:root body[data-social-studies-grade-shell="v1"] .ss-shell-intro{
   width:min(1040px,calc(100% - 32px));margin:24px auto 18px;padding:22px;
   background:#fff8e9;border:1px solid #d4c7af;border-radius:7px;text-align:center;color:#243038
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-shell-intro h2,
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-shell-features>h2{
   margin:0 0 11px;font:400 33px/1.2 Cinzel,Georgia,serif;color:#243038;text-align:center
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-shell-intro p{margin:0 auto;max-width:850px;color:#35423e}

 html:root:root body[data-social-studies-grade-shell="v1"] .ss-shell-features{
   width:min(1040px,calc(100% - 32px));margin:18px auto 28px
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-grid{
   display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-card{
   min-height:170px;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
   background:#eee7d8;border:1px solid #cbbd9f;border-radius:7px;color:#243038
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-card h3{margin:0 0 8px;font:400 24px/1.25 Cinzel,Georgia,serif}
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-card p{margin:0 0 14px;max-width:420px}
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-card button{
   margin-top:auto;min-width:150px;min-height:44px;padding:9px 18px;border:1px solid #243038;border-radius:7px;
   background:#243038;color:#fff8e9;font:400 16px/1.2 Nunito,Arial,sans-serif;cursor:pointer
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-dialog{
   width:min(620px,calc(100vw - 28px));padding:0;border:1px solid #243038;border-radius:7px;background:#fff8e9;color:#243038
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-dialog::backdrop{background:rgba(20,28,28,.58)}
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-dialog-inner{padding:24px;text-align:center}
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-dialog h2{margin:0 0 10px;font:400 33px/1.2 Cinzel,Georgia,serif}
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-dialog-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:18px}
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-dialog :is(a,button){
   min-height:44px;padding:9px 18px;border:1px solid #243038;border-radius:7px;font:400 16px/1.2 Nunito,Arial,sans-serif;text-decoration:none
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-dialog a{background:#243038;color:#fff8e9}
 html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-dialog button{background:#fff8e9;color:#243038;cursor:pointer}

 html:root:root body[data-social-studies-grade-shell="v1"] footer,
 html:root:root body[data-social-studies-grade-shell="v1"] .footer{
   background:#243038!important;color:#fff8e9!important;text-align:center!important;border-radius:0!important;
   padding:24px 18px!important;font-size:14px!important
 }
 #vnvClassToolsToolbar{--vct-button-min-height:44px}
 #vnvEcosystemUtilityDock>a,#vnvEcosystemUtilityDock>button{min-height:44px!important}

 @media(max-width:720px){
  html:root:root body[data-social-studies-grade-shell="v1"] .high-subject-access,
  html:root:root body[data-social-studies-grade-shell="v1"] .ss-feature-grid{grid-template-columns:1fr!important}
 }
 @media print{
  #vnv333NetworkTicker,#vnvTickerAutoPopulate,#vnvHeaderAutoPopulate,#vnvEcosystemUtilityDock,#vnvClassToolsToolbar,
  .high-subject-breadcrumbs,.high-subject-access,.ss-shell-intro,.ss-shell-features{display:none!important}
 }`;
 document.head.append(s);
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
 style();
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