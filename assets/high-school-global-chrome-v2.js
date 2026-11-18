/* Khaemenes High · global canonical header/menu/toolbar guard v2.0.0
   Presentation/navigation only. No learner records, grades, assessments, or storage are modified.
*/
(()=>{"use strict";
if(window.__KHAEMENES_HIGH_GLOBAL_CHROME_V2__)return;
window.__KHAEMENES_HIGH_GLOBAL_CHROME_V2__=true;

const VNV="https://vervenveda.com/assets/";
const HIGH="https://vervenveda.com/Khaemenes_High.github.io/";
const HEADER="vnv-header-autopopulate.js";
const TOOLBAR="vnv-ecosystem-toolbar.js";
const OFFICIAL_DOCK="vnvEcosystemUtilityDock";
const TYPO_STYLE="khaemenesHighTypographyStandardV1";
const PRIMARY_TITLE_ATTR="data-khaemenes-primary-title";

function installTypographyStandard(){
  if(!document.head)return;
  let style=document.getElementById(TYPO_STYLE);
  if(!style){
    style=document.createElement("style");
    style.id=TYPO_STYLE;
    style.textContent=`
/* Khaemenes Academy High School · canonical typography standard
   16px readable-text floor · 33px titles · one 66px primary page title. */
html:root body{
  font-size:16px!important;
}
html:root body :is(
  p,li,dt,dd,blockquote,figcaption,caption,legend,label,
  a,button,input,select,textarea,option,output,
  td,th,summary,small,strong,em,b,i,u,s,mark,time,
  .eyebrow,.kicker,.subtitle,.subheading,.lead,.description,
  .breadcrumbs,.breadcrumb,.badge,.chip,.pill,.status,.meta,
  .caption,.note,.helper,.hint,.message,.toast,
  .brand-name,.brand-sub,.menu-group,.menu-link,.menu-link small,.menu-link strong
){
  font-size:max(16px,1em)!important;
}
html:root body :is(h1,h2,h3,h4,h5,h6,[role="heading"],
  .page-title,.hero-title,.main-title,.section-title,.card-title,
  .display-title,.site-title,.brand-title,.modal-title,.dialog-title
){
  font-size:33px!important;
  line-height:1.2!important;
  font-weight:400!important;
  overflow-wrap:anywhere;
  text-wrap:balance;
}
html:root body [${PRIMARY_TITLE_ATTR}="true"]{
  font-size:66px!important;
  line-height:1.05!important;
  font-weight:400!important;
  overflow-wrap:anywhere;
  text-wrap:balance;
}
@media(max-width:560px){
  html:root body [${PRIMARY_TITLE_ATTR}="true"]{
    font-size:66px!important;
  }
}
@media print{
  html:root body{
    font-size:16px!important;
  }
}
`;
    document.head.append(style);
  }
  markPrimaryTitle();
  enforceReadableTextFloor();
}
function visibleElement(el){
  if(!el||!el.isConnected)return false;
  if(el.hidden||el.getAttribute("aria-hidden")==="true")return false;
  const cs=getComputedStyle(el);
  return cs.display!=="none"&&cs.visibility!=="hidden";
}
function primaryTitleCandidates(){
  return [
    ...document.querySelectorAll(
      'main .hero h1,main h1,.hero h1,[data-hero] h1,[data-page-hero] h1,h1,.hero-title,.main-title,.page-title'
    )
  ];
}
function markPrimaryTitle(){
  const current=document.querySelector('['+PRIMARY_TITLE_ATTR+'="true"]');
  if(current&&visibleElement(current))return current;
  document.querySelectorAll('['+PRIMARY_TITLE_ATTR+']').forEach(el=>el.removeAttribute(PRIMARY_TITLE_ATTR));
  const chosen=primaryTitleCandidates().find(el=>visibleElement(el))||null;
  if(chosen)chosen.setAttribute(PRIMARY_TITLE_ATTR,"true");
  return chosen;
}
function hasReadableText(el){
  if(!el||el.nodeType!==1)return false;
  if(el.matches("script,style,noscript,template,svg,svg *,canvas,iframe,br,hr,source,track,meta,link"))return false;
  const text=[...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&String(n.nodeValue||"").trim());
  const form=el.matches("input,select,textarea,button,option");
  return text||form;
}
function enforceReadableTextFloor(root=document.body){
  if(!root)return;
  const nodes=[];
  if(root.nodeType===1)nodes.push(root);
  if(root.querySelectorAll)nodes.push(...root.querySelectorAll("*"));
  for(const el of nodes){
    if(!hasReadableText(el))continue;
    if(el.matches("h1,h2,h3,h4,h5,h6,[role=heading],["+PRIMARY_TITLE_ATTR+"]"))continue;
    const size=parseFloat(getComputedStyle(el).fontSize||"0");
    if(size>0&&size<16){
      el.style.setProperty("font-size","16px","important");
      el.dataset.khaemenesMinText="16";
    }
  }
}
let typographyPending=false;
function scheduleTypography(){
  if(typographyPending)return;
  typographyPending=true;
  requestAnimationFrame(()=>{
    typographyPending=false;
    installTypographyStandard();
  });
}


function hasScript(pathname){
  return [...document.scripts].some(s=>{try{return new URL(s.src,location.href).pathname===pathname}catch{return false}});
}
function load(src,key){
  const url=new URL(src,location.href);
  if(hasScript(url.pathname))return Promise.resolve();
  return new Promise(resolve=>{
    const s=document.createElement("script");
    s.src=url.href;s.defer=true;s.dataset[key]="true";
    s.addEventListener("load",resolve,{once:true});
    s.addEventListener("error",resolve,{once:true});
    (document.head||document.documentElement).append(s);
  });
}
function waitFor(check,timeout=2600,step=40){
  return new Promise(resolve=>{
    const started=performance.now();
    const poll=()=>{
      let value=null;try{value=check()}catch{}
      if(value)return resolve(value);
      if(performance.now()-started>=timeout)return resolve(null);
      setTimeout(poll,step);
    };
    poll();
  });
}
function pathGrade(){
  const m=location.pathname.match(/\/grade-(09|10|11|12)(?:\/|$)/i);
  if(m)return m[1];
  const english=location.pathname.match(/\/english-(9|10|11|12)(?:\/|$)/i);
  if(english)return english[1].padStart(2,"0");
  if(/integrated-science-9|social-studies\/grade-09|grades\/grade-09/i.test(location.pathname))return "09";
  return "";
}
function profileHref(){
  const grade=pathGrade();
  return grade?HIGH+"grades/grade-"+grade+"/student-profile/":HIGH+"#student-portal";
}
function mountHeader(replaceLegacy=false){
  if(!window.VNV_HEADER?.mount)return;
  const root=window.VNV_HEADER.mount({
    replaceLegacy,
    title:"Khaemenes Academy",
    subtitle:"High School · Grades 9–12",
    icon:"K",
    home:"https://vervenveda.com/KhaemenesAcademy_Home.github.io/",
    actions:[
      {label:"My Profile",href:profileHref()},
      {label:"Grades 9–12",href:HIGH+"#grades"},
      {label:"All Courses",href:HIGH+"courses/"},
      {label:"Ecosystem",href:"https://vervenveda.com/#directory"},
      {label:"Family",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"}
    ]
  });
  if(root){
    root.dataset.khaemenesHighCanonicalHeader="v2";
    const menu=root.querySelector(".vnv-header-menu-button");
    if(menu){
      menu.dataset.khaemenesHighHamburger="true";
      menu.setAttribute("title","Open Ecosystem menu");
    }
  }
}
function mountToolbar(){
  try{window.VNVEcosystemToolbar?.mount?.()}catch{}
  const dock=document.getElementById(OFFICIAL_DOCK);
  if(dock){
    dock.dataset.khaemenesHighCanonicalToolbar="v2";
    dock.style.setProperty("left","auto","important");
    dock.style.setProperty("right","max(12px, env(safe-area-inset-right))","important");
  }
}
const LEGACY_FLOATERS=[
  "vnvBetaProgramLink","vnvBetaProgramFallback","khaemenesLearnerUtilityToolbar",
  "khaeLandingUtilityDock","khaemenesHomeUtilityDock","highQuickUtilityDock",
  "studentQuickUtilityDock","academyQuickUtilityDock"
];
function cleanupKnownFloaters(){
  if(!document.getElementById(OFFICIAL_DOCK))return;
  for(const id of LEGACY_FLOATERS)document.getElementById(id)?.remove();
}
function preserveExportMarker(){
  document.querySelectorAll('button,a,[role="button"]').forEach(el=>{
    const label=((el.textContent||"")+" "+(el.getAttribute("aria-label")||"")+" "+(el.id||"")+" "+(el.className||"")).toLowerCase();
    if(/export/.test(label)&&/(student|learner|profile|progress|grade|record)/.test(label)){
      el.dataset.khaemenesStudentExportCandidate="true";
    }
  });
}
/* Week 01 independent English 10–12 reading view. No academic records, storage keys,
   assessment logic, or mastery flags are read or written. */
function installUpperEnglishReadingView(){
  if(document.getElementById("khae-upper-english-reading-view"))return;
  const main=document.querySelector("main");
  if(!main)return;
  const tools=document.createElement("nav");
  tools.id="khae-upper-english-reading-view";
  tools.setAttribute("aria-label","Lesson reading size");
  tools.style.cssText="display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap;margin:18px auto;padding:12px;border:1px solid #c7bba3;border-radius:7px;background:#fff8e9;color:#202724;width:min(940px,calc(100% - 28px));box-sizing:border-box";
  let scale=1;
  const status=document.createElement("output");
  status.setAttribute("aria-live","polite");
  status.textContent="Reading view 100%";
  const setScale=n=>{
    scale=Math.min(1.4,Math.max(1,Math.round(n*10)/10));
    main.style.zoom=String(scale);
    status.textContent="Reading view "+Math.round(scale*100)+"%";
  };
  const button=(label,description,handler)=>{
    const el=document.createElement("button");
    el.type="button";el.textContent=label;el.setAttribute("aria-label",description);
    el.style.cssText="font:400 16px/1.3 Nunito,Arial,sans-serif;min-height:44px;padding:9px 15px;border:1px solid #202724;border-radius:7px;background:#202724;color:#fff8e9;cursor:pointer";
    el.addEventListener("click",handler);return el;
  };
  tools.append(button("A−","Reduce lesson text size",()=>setScale(scale-.1)),status,
    button("A+","Enlarge lesson text size",()=>setScale(scale+.1)),
    button("Reset","Reset lesson text size",()=>setScale(1)));
  main.insertAdjacentElement("beforebegin",tools);
}

// Keep exactly one real site header on Week 01 English 9–12 daily lessons.
// Preserve English 10's theme and navigation controls and English 11/12's
// instructional hero, including its next-day links, before legacy removal.
function prepareEnglishDailyLegacyChrome(isUpper){
  if(!isUpper)return;
  const path=location.pathname;
  if(/\/english-10\/weeks\/week-01\/(?:monday|tuesday|wednesday|thursday|friday)\/(?:index\.html)?$/i.test(path)){
    const old=document.querySelector("header.site-header");
    const controls=old?.querySelector(".header-actions");
    const destination=document.querySelector(".breadcrumb .wrap")||document.querySelector("main");
    if(controls&&destination){
      controls.dataset.khaemenesLessonNavigation="preserved";
      controls.setAttribute("aria-label","English 10 lesson controls");
      destination.append(controls);
    }
  }else if(/\/english-(?:11|12)\/weeks\/week-01\/lessons\/day-0[1-5]\.html$/i.test(path)){
    const old=document.querySelector("body > header.wrap");
    if(old){
      const hero=document.createElement("section");
      for(const attr of Array.from(old.attributes))hero.setAttribute(attr.name,attr.value);
      hero.classList.add("english-daily-lesson-hero");
      hero.style.textAlign="center";
      hero.style.paddingTop="30px";
      hero.setAttribute("aria-label","Lesson introduction and navigation");
      while(old.firstChild)hero.append(old.firstChild);
      old.replaceWith(hero);
    }
  }
}
async function start(){
  if(!document.body)return;
  const stableDailyEnglish9=/\/english-9\/weeks\/week-01\/day-0[1-5]\/(?:index\.html)?$/i.test(location.pathname);
  const stableDailyUpperEnglish=/\/english-(?:10\/weeks\/week-01\/(?:monday|tuesday|wednesday|thursday|friday)\/(?:index\.html)?|(?:11|12)\/weeks\/week-01\/lessons\/day-0[1-5]\.html)$/i.test(location.pathname);
  const mathematicsLanding=/\/courses\/mathematics\/(?:pre-algebra|algebra-1|geometry|algebra-2)\/(?:index\.html)?$/i.test(location.pathname);
  const canonicalLessonHeader=stableDailyEnglish9||stableDailyUpperEnglish;
  prepareEnglishDailyLegacyChrome(stableDailyUpperEnglish);
  installTypographyStandard();
  // Shared idempotent English 9–12 left tool component; protected assessments excluded.
  if(/\/courses\/language-arts\/english-(?:9|10|11|12)\//i.test(location.pathname)
      && !/\/(?:assessment|assessments|diagnostic)\//i.test(location.pathname)){
    await load(HIGH+"courses/shared/high-school-class-tools-left-v1.js","khaemenesEnglishLeftTools");
  }
  if(/\/courses\/mathematics\/geometry\//i.test(location.pathname)){
    await load(HIGH+"courses/mathematics/geometry/assets/geometry-presentation-unifier-v1.js","khaemenesGeometryPresentation");
  }
  if(/\/courses\/mathematics\/pre-algebra\/units\/unit-\d+\/lessons\//i.test(location.pathname)){
    await load(HIGH+"courses/mathematics/pre-algebra/assets/prealgebra-game-registry-bridge-v1.js","khaemenesPreAlgebraGameRegistry");
  }
  if(/\/grades\/grade-(?:09|10|11|12)\/student-profile\/(?:index\.html)?$/i.test(location.pathname)){
    await load(VNV+"vnv-class-tools-toolbar.js","vnvClassToolsToolbar");
  }
  await load(VNV+HEADER,"khaemenesHighHeader");
  mountHeader(canonicalLessonHeader);
  await load(VNV+TOOLBAR,"khaemenesHighToolbar");
  mountToolbar();
  cleanupKnownFloaters();
  preserveExportMarker();
  if(stableDailyUpperEnglish)installUpperEnglishReadingView();
  // Canonical VNV ticker pair for the twenty English 9–12 Week 01 daily pages.
  // The protected VNV gateway keeps its own native 333 ticker.
  // Both scripts are fetched from their authoritative first-party sources.
  if(stableDailyEnglish9 || stableDailyUpperEnglish){
    await load(VNV+"vnv-333-ticker.js","khaemenesHigh333Ticker");
    await load(VNV+"vnv-ticker-autopopulate.js","khaemenesHighAutoTicker");
    if(window.VNV333Ticker?.mount && !document.getElementById("vnv333NetworkTicker")){
      window.VNV333Ticker.mount();
    }
    if(window.VNV_TICKER?.autoPopulate && !document.getElementById("vnvTickerAutoPopulate")){
      window.VNV_TICKER.autoPopulate({
        before:"#vnvHeaderAutoPopulate, .site-header, header",
        label:"English "+(stableDailyEnglish9?"9":location.pathname.match(/english-(10|11|12)/)?.[1]||"")+" · Lesson Quick Links",
        ariaLabel:"Current English lesson navigation",
        max:12,
        cleanLegacy:false,
        exclude:[
          "#vnv333NetworkTicker a","#vnvTickerAutoPopulate a",
          "[data-vnv-ticker-ignore]","a[download]",".skip",".skip-link",
          ".ticker-control",".vnv-ticker-control",
          "[aria-label*='logout' i]","[aria-label*='sign out' i]"
        ]
      });
    }
    document.documentElement.dataset.khaemenesEnglishTickerPair=
      document.getElementById("vnv333NetworkTicker")&&document.getElementById("vnvTickerAutoPopulate")?"mounted":"partial";
    // The ticker engines mount after the header: recalculate its sticky offset.
    mountHeader(false);
    // VNV_HEADER owns the enriched menu mount; do not repeat its data load.
    document.documentElement.dataset.khaemenesEnglishCanonicalMenu=
      document.getElementById("vnvEnrichedMenuOverlay")?"mounted":"missing";
    // Unified instruction presentation: the shared module adapts to each
    // grade's original lesson DOM. The grade course scripts own all evidence.
    await load("/Khaemenes_High.github.io/courses/shared/english-unified-lesson-engine-v1.js?v=20261116","khaemenesEnglishUnifiedLessonEngine");
    window.KhaemenesEnglishUnifiedLessonEngine?.mount?.();
  }
  if(mathematicsLanding){
    await load(VNV+"vnv-333-ticker.js","khaemenesHighMath333Ticker");
    await waitFor(()=>window.VNV333Ticker?.mount);
    await load(VNV+"vnv-ticker-autopopulate.js","khaemenesHighMathAutoTicker");
    await waitFor(()=>window.VNV_TICKER?.autoPopulate);
    if(window.VNV333Ticker?.mount && !document.getElementById("vnv333NetworkTicker")){
      window.VNV333Ticker.mount();
    }
    if(window.VNV_TICKER?.autoPopulate && !document.getElementById("vnvTickerAutoPopulate")){
      const courseName=location.pathname.match(/\/mathematics\/(pre-algebra|algebra-1|geometry|algebra-2)\//i)?.[1]
        ?.replace("pre-algebra","Pre-Algebra").replace("algebra-1","Algebra I").replace("algebra-2","Algebra II").replace("geometry","Geometry")||"Mathematics";
      window.VNV_TICKER.autoPopulate({
        before:"#vnvHeaderAutoPopulate, .site-header, header",
        label:courseName+" · Course Quick Links",
        ariaLabel:courseName+" course navigation",
        max:12,
        cleanLegacy:false,
        exclude:[
          "#vnv333NetworkTicker a","#vnvTickerAutoPopulate a",
          "[data-vnv-ticker-ignore]","a[download]",".skip",".skip-link",
          ".ticker-control",".vnv-ticker-control",
          "[aria-label*='logout' i]","[aria-label*='sign out' i]"
        ]
      });
    }
    document.documentElement.dataset.khaemenesMathTickerPair=
      document.getElementById("vnv333NetworkTicker")&&document.getElementById("vnvTickerAutoPopulate")?"mounted":"partial";
    mountHeader(false);
  }
  // The High School front hall and student profiles have their own explicit chrome mounts.\n  // A document-wide remount observer on these dynamic pages can create repeated\n  // DOM mutation/cleanup cycles and starve click handlers and diagnostics.\n  const stableFrontHall=/\/Khaemenes_High\.github\.io\/(?:index\.html)?$/i.test(location.pathname);\n  const stableStudentProfile=/\/grades\/grade-(?:09|10|11|12)\/student-profile\//i.test(location.pathname);\n  if(!stableDailyEnglish9 && !stableDailyUpperEnglish && !stableFrontHall && !stableStudentProfile && typeof MutationObserver==="function"){
    new MutationObserver(()=>{mountHeader();mountToolbar();cleanupKnownFloaters();preserveExportMarker();scheduleTypography();})
      .observe(document.documentElement,{childList:true,subtree:true});
  }
  // Daily English 9 pages mount once. Their lesson content and learner-state
  // changes do not require repeated header/dock mounting.
  window.addEventListener("resize",scheduleTypography,{passive:true});
  document.documentElement.dataset.khaemenesHighTypography="16-33-66";
  document.documentElement.dataset.khaemenesHighChrome="v2";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();
/* Khaemenes semantic hierarchy authority v1
   Eyebrow = category/brand. Title = heading. Description = paragraph.
   Conservative inversion repair: only clear sentence-like heading reversals are changed. */
(()=>{"use strict";
if(window.__KHAEMENES_SEMANTIC_HIERARCHY_V1__)return;
window.__KHAEMENES_SEMANTIC_HIERARCHY_V1__=true;

const BRAND="Khaemenes Academy";
const LABELS=".eyebrow,.kicker,[data-eyebrow],[data-kicker]";
const clean=s=>String(s||"").replace(/\s+/g," ").trim();
const words=s=>clean(s).split(/\s+/).filter(Boolean);
const brandLike=s=>/^(?:verve\s*n\s*veda|khaemenes academy)(?:\b|\s*[·|—-])/i.test(clean(s));
const titleLike=s=>{
  const t=clean(s),w=words(t);
  return !!t&&t.length<=100&&w.length>=1&&w.length<=10&&!/[.!?…]$/.test(t);
};
const sentenceLike=s=>{
  const t=clean(s),w=words(t);
  return /[.!?…]$/.test(t)||w.length>=9||(w.length>=6&&/[,;:]/.test(t));
};
function normalizeLabel(label){
  if(!label||label.dataset.khaemenesHierarchyChecked==="true")return;
  label.dataset.khaemenesHierarchyChecked="true";
  if(label.closest("nav,footer,[data-khaemenes-no-semantic-normalize]"))return;
  const heading=label.nextElementSibling;
  if(!heading||!/^H[1-6]$/.test(heading.tagName))return;
  if(label.children.length||heading.children.length)return;

  const eyebrowText=clean(label.textContent);
  const headingText=clean(heading.textContent);
  if(!sentenceLike(headingText)||!titleLike(eyebrowText))return;

  if(brandLike(eyebrowText)){
    heading.dataset.khaemenesHierarchyReview="brand-eyebrow-sentence-heading";
    return;
  }

  const desc=document.createElement("p");
  desc.className="khaemenes-section-description";
  desc.textContent=headingText;
  desc.dataset.khaemenesDemotedFromHeading="true";

  heading.dataset.khaemenesOriginalHeading=headingText;
  heading.dataset.khaemenesPromotedFromEyebrow=eyebrowText;
  heading.textContent=eyebrowText;

  label.dataset.khaemenesOriginalEyebrow=eyebrowText;
  label.textContent=BRAND;

  heading.insertAdjacentElement("afterend",desc);
  heading.closest("section,article,header,main,div")?.setAttribute("data-khaemenes-hierarchy-normalized","true");
}
function normalizeHierarchy(root=document){
  root.querySelectorAll?.(LABELS).forEach(normalizeLabel);
  document.documentElement.dataset.khaemenesHierarchy="title-description-v1";
}
let pending=false;
function scheduleHierarchy(){
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{pending=false;normalizeHierarchy(document)});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>normalizeHierarchy(document),{once:true});
else normalizeHierarchy(document);
if(typeof MutationObserver==="function"){
  new MutationObserver(scheduleHierarchy).observe(document.documentElement,{childList:true,subtree:true});
}
})();
