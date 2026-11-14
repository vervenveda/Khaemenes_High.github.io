/* Khaemenes High · shared assessment landing navigation · v1.0.0
   Opt-in via body[data-ka-assessment-landing]; no learner storage or mastery writes.
   Owns only shared page chrome; protected assessment toolbar policy remains unchanged. */
(()=>{"use strict";
if(window.KhaemenesAssessmentLandingChrome)return;
function mount(){
 const page=document.body;
 if(!page?.hasAttribute("data-ka-assessment-landing"))return;
 const course=page.dataset.kaCourse||"Mathematics";
 const courseUrl=page.dataset.kaCourseUrl||"../";
 const title=page.dataset.kaAssessmentTitle||course+" Assessment Center";
 const grade=page.dataset.kaGrade||"High School";
 const nav=[
  {label:"COURSE",href:courseUrl},
  {label:"ASSESSMENTS",href:"./"},
  {label:"HIGH SCHOOL",href:"https://vervenveda.com/Khaemenes_High.github.io/"},
  {label:"GRADE "+grade,href:"https://vervenveda.com/Khaemenes_High.github.io/grades/grade-"+grade+"/"}
 ];
 const toggle=document.getElementById("themeToggle");
 if(toggle){
  let home=document.querySelector(".breadcrumb .wrap,main .actions");
  if(!home){
   home=document.createElement("nav");
   home.className="ka-assessment-course-actions";
   home.setAttribute("aria-label","Assessment page options");
   home.style.cssText="display:flex;justify-content:center;padding:10px 16px;background:#f7f1e5";
   document.querySelector("main")?.before(home);
  }
  home?.append(toggle);
 }
 if(!document.getElementById("vnv-language-rail")){
  const rail=document.createElement("div");
  rail.id="vnv-language-rail";
  rail.setAttribute("role","group");
  rail.setAttribute("aria-label","Page translation tools");
  const anchor=document.querySelector("main");
  if(anchor)anchor.before(rail);else page.append(rail);
 }
 if(!document.getElementById("vnvTickerAutoPopulate")){
  window.VNV_TICKER?.autoPopulate({
   label:course+" · Assessment Links",max:12,cleanLegacy:false,
   exclude:["#vnv333NetworkTicker a","#vnvTickerAutoPopulate a","[data-vnv-ticker-ignore]","a[download]",".skip",".ticker-control",".vnv-ticker-control"]
  });
 }
 window.VNV_HEADER?.mount({
  replaceLegacy:true,title,subtitle:"Khaemenes Academy · "+course,icon:"K",
  home:"https://vervenveda.com/Khaemenes_Academy.github.io/",
  actions:nav
 });
}
window.KhaemenesAssessmentLandingChrome=Object.freeze({version:"1.0.0",mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();