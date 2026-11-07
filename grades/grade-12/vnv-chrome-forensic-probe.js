/* Grade 12 landing-page forensic diagnostic. Opt in with ?chrome_audit=1.
 * Read-only DOM/computed-style inspection. No student storage, network requests,
 * cookies, analytics, form reads, or application state changes.
 * Based on the Academy's Grade 09 chrome probe; extended for landing parity.
 */
(()=>{"use strict";
if(new URLSearchParams(location.search).get("chrome_audit")!=="1" ||
   window.KhaemenesGrade12ChromeAudit)return;

const targets=[
 ["333 ticker", "#vnv333NetworkTicker"],
 ["Auto ticker", "#vnvTickerAutoPopulate"],
 ["VNV generated header", "#vnvHeaderAutoPopulate"],
 ["Academy header", "header[data-khae-header]"],
 ["Branched menu", "#vnvEnrichedMenuOverlay"],
 ["Ecosystem menu slot", "header[data-khae-header] [data-vnv-ecosystem-slot]"],
 ["Official utility dock", "#vnvEcosystemUtilityDock"],
 ["Language tools", "[data-vnv-language-mount]"],
 ["Senior hero", "body > section.hero"],
 ["Front Desk", "main .front-grid"],
 ["Core course grid", "main #courses .grade12-eight-subject-grid"],
 ["Legacy duplicate header", "header.site-header"],
 ["Legacy breadcrumb", ".breadcrumbs, #highNavigationBreadcrumbs, [data-khae-breadcrumb-row]"],
 ["Legacy ribbon", ".ribbon"]
];
const traces=[];
let panel=null,output=null,queued=false,observer=null,closed=false;
const elapsed=()=>Math.round(performance.now())+"ms";
const safe=(value)=>String(value||"").slice(0,170);
function describe(name,selector){
 const found=[...document.querySelectorAll(selector)];
 if(!found.length)return name+": MISSING";
 const details=found.map(el=>{
  try{
   const css=getComputedStyle(el),rect=el.getBoundingClientRect();
   const visible=el.isConnected&&css.display!=="none"&&css.visibility!=="hidden"&&
    Number(css.opacity)>0&&rect.width>0&&rect.height>0;
   const parent=el.parentElement?.tagName?.toLowerCase()||"?";
   return (visible?"PRESENT":"HIDDEN")+" "+Math.round(rect.width)+"×"+
    Math.round(rect.height)+" at ("+Math.round(rect.x)+","+Math.round(rect.y)+
    ") · parent "+parent+" · display "+css.display+" · opacity "+css.opacity;
  }catch{return "STYLE READ FAILED"}
 });
 return name+": "+details.join("; ")+(found.length>1?" · DUPLICATES "+found.length:"");
}
function summarize(){
 const course=document.querySelector("#courses .grade12-eight-subject-grid");
 const cards=course?.querySelectorAll(":scope > .course-card").length||0;
 const core=course?.querySelectorAll(":scope > .course-card .status").length||0;
 const front=document.querySelectorAll("main .front-grid > .front-card").length;
 return "Front Desk cards: "+front+"; Course cards: "+cards+
  "; Course status labels: "+core+"; Header instances: "+
  document.querySelectorAll("header[data-khae-header]").length;
}
function draw(){
 if(closed||!document.body)return;
 if(!panel){
  panel=document.createElement("aside");panel.id="grade12ChromeAuditPanel";
  panel.setAttribute("aria-label","Grade 12 opt-in forensic diagnostic");
  panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(680px,calc(100vw - 16px));max-height:48vh;overflow:auto;padding:14px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;box-shadow:0 12px 40px #0009;font:400 14px/1.5 ui-monospace,monospace!important";
  const heading=document.createElement("strong");
  heading.textContent="Grade 12 · Header / Ticker / Landing Audit";
  heading.style.cssText="display:block;color:#fff8e9!important;font-size:16px!important;margin:0 0 10px";
  const close=document.createElement("button");close.type="button";close.textContent="Close diagnostics";
  close.style.cssText="font:400 16px/1.3 Arial,sans-serif!important;background:#fff8e9!important;color:#243038!important;border:0;border-radius:7px;padding:8px 12px;margin:0 0 10px;cursor:pointer";
  close.addEventListener("click",()=>{closed=true;observer?.disconnect();panel?.remove();panel=null;output=null});
  output=document.createElement("pre");
  output.style.cssText="font:inherit!important;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:#fff8e9!important;background:transparent!important";
  panel.append(heading,close,output);
  document.body.append(panel);
 }
 output.textContent="Current DOM (no student data):\n"+summarize()+"\n"+
  targets.map(([name,selector])=>describe(name,selector)).join("\n")+
  "\n\nEvent timeline:\n"+traces.slice(-20).join("\n");
}
function note(message){
 traces.push(elapsed()+" "+safe(message));
 if(traces.length>60)traces.shift();
 if(!queued&&!closed){queued=true;requestAnimationFrame(()=>{queued=false;draw()})}
}
function relates(node){
 if(node?.nodeType!==1)return false;
 if(node.id==="grade12ChromeAuditPanel"||node.closest?.("#grade12ChromeAuditPanel"))return false;
 return targets.some(([,sel])=>{try{return node.matches?.(sel)||!!node.querySelector?.(sel)}catch{return false}});
}
function start(){
 if(!document.body||closed)return;
 observer=new MutationObserver(records=>{
  const events=[];
  for(const record of records){
   if(record.type==="attributes"){if(relates(record.target))events.push("STYLE/VISIBILITY "+record.target.tagName.toLowerCase());continue}
   for(const node of record.addedNodes)if(relates(node))events.push("ADDED "+node.nodeName.toLowerCase());
   for(const node of record.removedNodes)if(relates(node))events.push("REMOVED "+node.nodeName.toLowerCase());
  }
  if(events.length)note([...new Set(events)].join("; "));
 });
 observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["style","class","hidden","aria-hidden"]});
 note("Probe started (opt-in)");
}
if(document.body)start();else document.addEventListener("DOMContentLoaded",start,{once:true});
document.addEventListener("DOMContentLoaded",()=>note("DOMContentLoaded"),{once:true});
window.addEventListener("load",()=>note("window load"),{once:true});
window.addEventListener("pageshow",()=>note("pageshow"));
window.addEventListener("error",e=>{
 if(e.target&&e.target!==window&&e.target.tagName==="SCRIPT")
  note("SCRIPT LOAD ERROR: "+(e.target.src||"").split("/").pop());
 else if(e.message)note("JS ERROR: "+e.message);
},true);
window.addEventListener("unhandledrejection",e=>note("PROMISE REJECTION: "+safe(e.reason?.message||e.reason||"unknown")));
window.KhaemenesGrade12ChromeAudit=Object.freeze({
 version:"1.0.0",
 snapshot:()=>({summary:summarize(),components:targets.map(([name,sel])=>describe(name,sel))}),
 events:()=>traces.slice()
});
})();
