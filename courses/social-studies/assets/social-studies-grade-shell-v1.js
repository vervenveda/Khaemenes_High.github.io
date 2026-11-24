/* Khaemenes High · Social Studies Grade Shell v1
   Presentation/navigation adapter only.
   It does not mutate curriculum data, assessment banks, learner records,
   mastery gates, grading, evidence, or localStorage. */
(()=>{"use strict";
if(window.KhaemenesSocialStudiesGradeShellV1)return;

const match=location.pathname.match(/\/courses\/social-studies\/grade-(09|10|11|12)\/?(?:index\.html)?$/i);
if(!match)return;
const grade=String(Number(match[1]));
const CONFIG={
 "9":{title:"Global Studies Honors",descriptor:"Grade 9 · History · Geography · Civics · Economics · Evidence & Inquiry"},
 "10":{title:"United States History Honors",descriptor:"Grade 10 · United States History · Constitutional Development · Civic Literacy · Geography"},
 "11":{title:"Government, Law & Economics Honors",descriptor:"Grade 11 · Government · Constitutional Law · Economics · Public Policy · Civic Literacy"},
 "12":{title:"Global Politics, International Relations & Senior Research Honors",descriptor:"Grade 12 · Comparative Politics · International Relations · Research · Senior Capstone"}
}[grade];

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
 html:root:root body[data-social-studies-grade-shell="v1"]{font-size:16px!important}
 html:root:root body[data-social-studies-grade-shell="v1"] .hero{
  background:#243038!important;background-image:none!important;color:#fff8e9!important;
  border-radius:0!important;text-align:center!important;padding:55px 24px!important;box-shadow:none!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .hero .eyebrow{
  margin:0!important;color:#fff8e9!important;font:400 33px/1.15 Cinzel,Georgia,serif!important;
  letter-spacing:.03em!important;text-transform:none!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .hero h1{
  margin:10px auto!important;color:#fff8e9!important;font:400 clamp(48px,7vw,66px)/1.05 Cinzel,Georgia,serif!important;
  letter-spacing:.02em!important;max-width:1100px!important
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
  min-height:48px!important;padding:11px 14px!important;border:1px solid #fff8e9!important;border-radius:7px!important;
  background:#fff8e9!important;color:#243038!important;-webkit-text-fill-color:#243038!important;
  font:400 16px/1.3 "Brandon Grotesque",Nunito,Arial,sans-serif!important;text-decoration:none!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] .high-subject-access a:first-child{
  background:#243038!important;color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important
 }
 html:root:root body[data-social-studies-grade-shell="v1"] :is(button,.button,input,select,textarea,a.button){font-size:max(16px,1em)}
 @media(max-width:720px){
  html:root:root body[data-social-studies-grade-shell="v1"] .high-subject-access{grid-template-columns:1fr!important}
 }
 @media print{
  #vnv333NetworkTicker,#vnvTickerAutoPopulate,#vnvHeaderAutoPopulate,#vnvEcosystemUtilityDock,#vnvClassToolsToolbar{display:none!important}
 }`;
 document.head.append(s);
}
function normalizeHero(){
 let hero=document.querySelector(".hero,.ss9-hero");
 if(!hero)return;
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
  access.innerHTML='<a href="../../../#student-portal">Learner Profile</a><a href="https://vervenveda.com/Khaemenes_Academy.github.io/family/">Parent Profile</a><a href="https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/">Enrollment</a>';
  subtitle.after(access);
 }
}
async function mount(){
 if(!document.body)return;
 document.body.dataset.socialStudiesGradeShell="v1";
 document.body.dataset.highSubjectShell="true";
 style();normalizeHero();

 if(!document.querySelector("[data-vnv-header-legacy]")){
  const anchor=document.createElement("header");
  anchor.hidden=true;anchor.setAttribute("aria-hidden","true");anchor.setAttribute("data-vnv-header-legacy","");
  document.body.prepend(anchor);
 }

 await load("https://vervenveda.com/assets/vnv-333-ticker.js","vnv-333-ticker.js");
 await load("https://vervenveda.com/assets/vnv-ticker-autopopulate.js","vnv-ticker-autopopulate.js");
 try{window.VNV_TICKER?.autoPopulate?.({label:"Social Studies · Grade "+grade,max:14})}catch{}

 await load("https://vervenveda.com/assets/vnv-header-autopopulate.js","vnv-header-autopopulate.js");
 try{window.VNV_HEADER?.mount?.({
  replaceLegacy:true,title:"Khaemenes Academy",subtitle:"High School · Social Studies · Grade "+grade,
  icon:"K",home:"https://vervenveda.com/Khaemenes_High.github.io/",actions:[]
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
 await load("https://vervenveda.com/assets/vnv-ecosystem-toolbar.js","vnv-ecosystem-toolbar.js");

 document.dispatchEvent(new CustomEvent("khaemenes-social-studies-grade-shell-ready",{detail:{grade,title:CONFIG.title}}));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
window.KhaemenesSocialStudiesGradeShellV1=Object.freeze({version:"1.0.0",mount});
})();