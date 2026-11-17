/* Khaemenes Academy · canonical high-school mathematics course shell v1
   Presentation/navigation adapter only. Does not write learner records or alter mastery. */
(()=>{"use strict";
const path=location.pathname.toLowerCase();
const course=path.includes("/pre-algebra/")?"pre-algebra":path.includes("/algebra-1/")?"algebra-1":path.includes("/geometry/")?"geometry":path.includes("/algebra-2/")?"algebra-2":"";
if(!course||document.getElementById("khae-math-course-shell"))return;

const configs={
 "pre-algebra":{
  Continue:{click:'[data-go="week"]'},Lessons:{click:'[data-go="week"]'},Map:{click:'[data-view="scope"]'},
  Practice:{click:'[data-go="week"]'},Tools:{click:'[data-go="tools"]'},Assess:{click:'[data-view="exams"]'},
  Progress:{click:'[data-go="reports"]'},Portfolio:{click:'[data-view="capstone"]'}
 },
 "algebra-1":{
  Continue:{click:"#courseResumeMenu",fallback:"#lessons"},Lessons:{href:"#lessons"},Map:{href:"#units"},
  Practice:{href:"practice/core.html"},Tools:{click:"#khae-algebra1-tool-menu summary",fallback:"https://vervenveda.com/proresource_hub.github.io/"},
  Assess:{href:"assessments/"},Progress:{href:"records/"},Portfolio:{href:"units/unit-13/"}
 },
 "geometry":{
  Continue:{click:'[data-view="dashboard"]'},Lessons:{click:'[data-view="week"]'},Map:{click:'[data-view="units"]'},
  Practice:{click:'[data-view="practice"]'},Tools:{click:"#khae-algebra1-tool-menu summary",fallback:"https://vervenveda.com/proresource_hub.github.io/"},
  Assess:{click:'[data-view="assessments"]',fallback:"assessments/"},Progress:{click:'[data-view="gradebook"]'},
  Portfolio:{click:'[data-view="portfolio"]'}
 },
 "algebra-2":{
  Continue:{click:'[data-view="dashboard"]'},Lessons:{click:'[data-view="week"]'},Map:{click:'[data-view="units"]'},
  Practice:{click:'[data-view="practice"]'},Tools:{click:"#khae-algebra1-tool-menu summary",fallback:"https://vervenveda.com/proresource_hub.github.io/"},
  Assess:{click:'[data-view="assessments"]',fallback:"assessments/"},Progress:{click:'[data-view="gradebook"]'},
  Portfolio:{click:'[data-view="portfolio"]'}
 }
};
const labels=["Continue","Lessons","Map","Practice","Tools","Assess","Progress","Portfolio"];
function go(spec){
 if(spec.click){
  const el=document.querySelector(spec.click);
  if(el){el.click();el.scrollIntoView?.({block:"start",behavior:"smooth"});return;}
 }
 const dest=spec.href||spec.fallback;
 if(dest){
  if(dest.startsWith("#")){location.hash=dest.slice(1);document.querySelector(dest)?.scrollIntoView({block:"start",behavior:"smooth"});}
  else location.href=dest;
 }
}
function mount(){
 if(document.getElementById("khae-math-course-shell"))return;
 const main=document.querySelector("main#main, main")||document.getElementById("main");
 if(!main)return;
 const oldQuick=document.querySelector("nav.quick-nav");
 if(oldQuick){oldQuick.hidden=true;oldQuick.setAttribute("aria-hidden","true");}
 const nav=document.createElement("nav");
 nav.id="khae-math-course-shell";
 nav.className="khae-math-course-shell no-print";
 nav.setAttribute("aria-label","Mathematics course navigation");
 const inner=document.createElement("div");inner.className="khae-math-course-shell-grid";
 labels.forEach(label=>{
  const b=document.createElement("button");b.type="button";b.textContent=label;b.dataset.mathShell=label.toLowerCase();
  b.addEventListener("click",()=>go(configs[course][label]));
  inner.append(b);
 });
 nav.append(inner);
 main.parentNode.insertBefore(nav,main);
 const style=document.createElement("style");
 style.id="khae-math-course-shell-style";
 style.textContent=
  "#khae-math-course-shell{width:100%;box-sizing:border-box;padding:14px 24px;background:#f4ecd9;border-top:1px solid #b39a6b;border-bottom:1px solid #b39a6b;position:relative;z-index:20}"+
  "#khae-math-course-shell .khae-math-course-shell-grid{width:min(1100px,100%);margin:0 auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}"+
  "#khae-math-course-shell button{appearance:none;width:100%;min-width:0;min-height:44px;padding:9px 12px;border:1px solid #b39a6b;border-radius:7px;background:#20282d;color:#f8f1df;font:400 16px/1.2 \"Nunito\",\"Avenir Next\",Arial,sans-serif;text-align:center;cursor:pointer}"+
  "#khae-math-course-shell button:hover,#khae-math-course-shell button:focus-visible{transform:translateY(-1px);outline:2px solid #9c7b3f;outline-offset:2px}"+
  "@media(max-width:760px){#khae-math-course-shell{padding:11px 14px}#khae-math-course-shell .khae-math-course-shell-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}}"+
  "@media(max-width:330px){#khae-math-course-shell .khae-math-course-shell-grid{grid-template-columns:1fr}}"+
  "@media print{#khae-math-course-shell{display:none!important}}";
 document.head.append(style);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();