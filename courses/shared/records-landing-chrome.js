/* KA High · records and completion chrome v1.0.0.
   Presentation and navigation only. Does not read or write learner records. */
(()=>{"use strict";
if(window.KhaemenesRecordsLandingChrome)return;
function mount(){
 const body=document.body;if(!body?.hasAttribute("data-ka-records-page"))return;
 const course=body.dataset.kaCourse||"Mathematics";
 const courseUrl=body.dataset.kaCourseUrl||"../";
 const title=body.dataset.kaRecordsTitle||course+" Completion Record";
 const isIndex=body.dataset.kaRecordsKind==="records-office";
 const existingFooter=body.querySelector("footer.footer");
 const toggle=document.getElementById("themeToggle");
 if(toggle){
  let host=document.querySelector(".breadcrumb .wrap");
  if(!host){
   host=document.createElement("nav");host.className="no-print ka-records-appearance";
   host.setAttribute("aria-label","Page appearance");host.style.cssText="display:flex;justify-content:center;gap:8px;padding:10px 18px;background:#f7f1e5";
   document.querySelector("main")?.before(host);
  }
  host.append(toggle);
 }
 if(!document.getElementById("vnv-language-rail")){
  const rail=document.createElement("div");rail.id="vnv-language-rail";
  rail.setAttribute("role","group");rail.setAttribute("aria-label","Page translation tools");
  document.querySelector("main")?.before(rail);
 }
 if(!existingFooter){
  const footer=document.createElement("footer");footer.className="ka-records-footer no-print";
  const caption=document.createElement("div");caption.textContent="Khaemenes Academy · "+course+" · Parent/Evaluator Records";
  const nav=document.createElement("nav");nav.setAttribute("aria-label","Records navigation");
  for(const [label,url] of [["Course Home",courseUrl],["Assessment Suite","../assessments/"],["High School","https://vervenveda.com/Khaemenes_High.github.io/"]]){
   const a=document.createElement("a");a.textContent=label;a.href=url;nav.append(a);
  }
  footer.append(caption,nav);document.body.append(footer);
 }
 if(!document.getElementById("vnvTickerAutoPopulate")){
  window.VNV_TICKER?.autoPopulate({
   label:course+" · "+(isIndex?"Records":"Completion"),
   max:12,cleanLegacy:false,
   exclude:["#vnv333NetworkTicker a","#vnvTickerAutoPopulate a","a[download]",".skip",".ticker-control",".vnv-ticker-control"]
  });
 }
 window.VNV_HEADER?.mount({
  replaceLegacy:true,title,subtitle:"Khaemenes Academy · "+course,icon:"K",
  home:"https://vervenveda.com/Khaemenes_Academy.github.io/",
  actions:[
   {label:"COURSE",href:courseUrl},
   {label:"ASSESSMENTS",href:"../assessments/"},
   {label:"RECORDS",href:isIndex?"./":"./"},
   {label:"HIGH SCHOOL",href:"https://vervenveda.com/Khaemenes_High.github.io/"}
  ]
 });
}
window.KhaemenesRecordsLandingChrome=Object.freeze({version:"1.0.0",mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();