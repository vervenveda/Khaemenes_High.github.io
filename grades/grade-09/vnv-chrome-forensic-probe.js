/* Grade 09 landing-page refresh and UI-competition forensic diagnostic. Opt in with ?chrome_audit=1.
 * Read-only DOM/computed-style inspection. No student storage, network requests,
 * cookies, analytics, form reads, or application state changes.
 * Based on the Academy's Grade 09 chrome probe; extended for landing parity.
 */
(()=>{"use strict";
if(new URLSearchParams(location.search).get("chrome_audit")!=="1" ||
   window.KhaemenesGrade09ChromeAudit)return;

const targets=[
 ["333 ticker", "#vnv333NetworkTicker"],
 ["Auto ticker", "#vnvTickerAutoPopulate"],
 ["VNV generated header", "#vnvHeaderAutoPopulate"],
 ["Academy header", "header[data-khae-header]"],
 ["Branched menu", "#vnvEnrichedMenuOverlay"],
 ["Ecosystem menu slot", "header[data-khae-header] [data-vnv-ecosystem-slot]"],
 ["Official utility dock", "#vnvEcosystemUtilityDock"],
 ["Legacy learner dock", "#khaemenesLearnerUtilityToolbar"],
 ["Legacy beta control", "#vnvBetaProgramLink"],
 ["Legacy second dock", "#vnvEcosystemUtilityDock ~ #vnvEcosystemUtilityDock"],
 ["Language tools", "[data-vnv-language-mount]"],
 ["Freshman hero", "body > section.hero"],
 ["Front Desk", "main .front-grid"],
 ["Core course grid", "main #courses .grade09-eight-subject-grid"],
 ["Legacy duplicate header", "header.site-header"],
 ["Legacy breadcrumb", ".breadcrumbs, #highNavigationBreadcrumbs, [data-khae-breadcrumb-row]"],
 ["Legacy ribbon", ".ribbon"]
];
const traces=[];
let panel=null,output=null,queued=false,observer=null,closed=false;
let lastVisualSignature="",frameCount=0,frameChanges=0,visualTraceStart=0;
const earlyEvents=[],layoutShifts=[],paintEvents=[];
const bootStartedAt=Math.round(performance.now());
let headObserver=null,paintObserver=null,shiftObserver=null;

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
 const course=document.querySelector("#courses .grade09-eight-subject-grid");
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
  panel=document.createElement("aside");panel.id="grade09ChromeAuditPanel";
  panel.setAttribute("aria-label","Grade 09 opt-in forensic diagnostic");
  panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(680px,calc(100vw - 16px));max-height:48vh;overflow:auto;padding:14px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;box-shadow:0 12px 40px #0009;font:400 14px/1.5 ui-monospace,monospace!important";
  const heading=document.createElement("strong");
  heading.textContent="Grade 09 · Header / Ticker / Landing Audit";
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
  "\n\nEarly-start events:\n"+earlyEvents.slice(-12).join("\n")+
  "\n\nPaint / layout shifts:\n"+paintEvents.slice(-5).join("\n")+
  layoutShifts.slice(-8).map(x=>"Layout shift "+x).join("\n")+
  "\n\nEvent timeline:\n"+traces.slice(-20).join("\n");
}
function note(message){
 traces.push(elapsed()+" "+safe(message));
 if(traces.length>60)traces.shift();
 if(!queued&&!closed){queued=true;requestAnimationFrame(()=>{queued=false;draw()})}
}
/* Earliest possible read-only observer starts here, in the document head.
 * It watches only public header/hero/ticker/toolbar subtree mutations.
 * Monitoring broad DOM insertions is limited to the early boot interval.
 * Browser performance observers cannot see pixels painted before script execution. */
function earlyNote(message){
 if(earlyEvents.length<60)earlyEvents.push(Math.round(performance.now())+"ms "+safe(message));
}
const earlySelectors="header, .site-header, .ribbon, .breadcrumbs, .hero, #vnv333NetworkTicker, #vnvTickerAutoPopulate, #vnvEcosystemUtilityDock, [data-vnv-language-mount]";
function publicChrome(node){
 if(node.nodeType!==1)return false;
 try{return node.matches(earlySelectors)||!!node.querySelector(earlySelectors)}catch{return false}
}
function monitorFirstPaint(){
 if(typeof PerformanceObserver!=="function")return;
 try{
  paintObserver=new PerformanceObserver(list=>{
   for(const e of list.getEntries())if(paintEvents.length<15)
    paintEvents.push(Math.round(e.startTime)+"ms "+e.name);
   note("Paint milestone");
  });
  paintObserver.observe({type:"paint",buffered:true});
 }catch(e){earlyNote("Paint observer unsupported")}
 try{
  shiftObserver=new PerformanceObserver(list=>{
   for(const e of list.getEntries())if(!e.hadRecentInput&&layoutShifts.length<25){
    layoutShifts.push(Math.round(e.startTime)+"ms value "+e.value.toFixed(4));
    note("Layout shift recorded");
   }
  });
  shiftObserver.observe({type:"layout-shift",buffered:true});
 }catch(e){earlyNote("Layout-shift observer unsupported")}
}
function startEarlyDOM(){
 headObserver=new MutationObserver(records=>{
  for(const record of records){
   if(record.type==="attributes"){
    if(publicChrome(record.target))earlyNote("EARLY STYLE "+record.target.tagName);
   }else{
    for(const node of record.addedNodes)if(publicChrome(node))earlyNote("EARLY ADDED "+node.nodeName);
    for(const node of record.removedNodes)if(publicChrome(node))earlyNote("EARLY REMOVED "+node.nodeName);
   }
  }
 });
 headObserver.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["style","class","hidden"]});
 earlyNote("Head-stage monitor started");
 monitorFirstPaint();
}
startEarlyDOM();
function resources(){
 return performance.getEntriesByType("resource").filter(e=>/\.css(?:\?|$)|\.js(?:\?|$)|\.woff2?(?:\?|$)/i.test(e.name))
 .slice(0,80).map(e=>({
  type:e.initiatorType,
  file:(()=>{try{return new URL(e.name).pathname.split("/").slice(-3).join("/")}catch{return "unknown"}})(),
  startMs:Math.round(e.startTime),
  durationMs:Math.round(e.duration)
 }));
}
function relates(node){
 if(node?.nodeType!==1)return false;
 if(node.id==="grade09ChromeAuditPanel"||node.closest?.("#grade09ChromeAuditPanel"))return false;
 return targets.some(([,sel])=>{try{return node.matches?.(sel)||!!node.querySelector?.(sel)}catch{return false}});
}
/* For refresh flashing: sample only public chrome geometry and visibility for the
 * first 5 seconds after the DOM becomes available. Do not inspect student data. */
function visualSignature(){
 const watch=["#vnv333NetworkTicker","#vnvTickerAutoPopulate","header[data-khae-header]",
  "[data-vnv-language-mount]","body > section.hero","#vnvEcosystemUtilityDock"];
 return watch.map(sel=>{
  const el=document.querySelector(sel);
  if(!el)return sel+":missing";
  const css=getComputedStyle(el),rect=el.getBoundingClientRect();
  return sel+":"+Math.round(rect.y)+":"+Math.round(rect.height)+":"+
   css.display+":"+css.visibility+":"+css.opacity+":"+css.backgroundColor;
 }).join("|");
}
function traceRefreshFrames(){
 if(closed||!document.body)return;
 if(!visualTraceStart)visualTraceStart=performance.now();
 const signature=visualSignature();
 if(lastVisualSignature&&signature!==lastVisualSignature){
  frameChanges++;
  if(frameChanges<=18)note("VISUAL CHANGE #"+frameChanges+" (chrome position / visibility / background)");
 }
 lastVisualSignature=signature;frameCount++;
 if(performance.now()-visualTraceStart<5000)requestAnimationFrame(traceRefreshFrames);
 else{
  headObserver?.disconnect();
  note("Visual observation complete: "+frameChanges+" changes in "+frameCount+" frames");
 }
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
 requestAnimationFrame(traceRefreshFrames);
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
window.KhaemenesGrade09ChromeAudit=Object.freeze({
 version:"1.2.0",
 snapshot:()=>({summary:summarize(),components:targets.map(([name,sel])=>describe(name,sel))}),
 events:()=>traces.slice(),
 visualChanges:()=>({changes:frameChanges,framesSampled:frameCount,startedAtMs:bootStartedAt,earlyEvents:earlyEvents.slice(),paints:paintEvents.slice(),layoutShifts:layoutShifts.slice()}),
 resources:()=>resources()
});
})();
