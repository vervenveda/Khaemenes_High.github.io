/* English 9 Day 1 VNV/KA canonical forensic probe v1.
 * Opt-in ?chrome_audit=1 only; observes layout, chrome and accessibility.
 * Does not inspect form values, learner records, cookies, storage or network data.
 */
(()=>{"use strict";
if(!new URLSearchParams(location.search).has("chrome_audit")||window.KhaemenesEnglish9Day1Audit)return;
const tracked=[
 ["333 ticker","#vnv333NetworkTicker"],
 ["Auto ticker","#vnvTickerAutoPopulate"],
 ["Official header","#vnvHeaderAutoPopulate"],
 ["Branched menu","#vnvEnrichedMenuOverlay"],
 ["Ecosystem toolbar","#vnvEcosystemUtilityDock"],
 ["Class tools","#khae-class-tools-left"],
 ["Lesson hero","#daily-main .daily-hero"],
 ["Source custody","[data-week-source-custody-v1]"],
 ["Lesson map","#khae-english-unified-lesson-map"],
 ["Resources & Settings","#e9-resources-settings"],
 ["Daily resources","#e9-unit-vocabulary"],
 ["Lesson footer",".daily-footer"]
];
const events=[],errors=[];let box,out,queued=false,closed=false;
function when(){return Math.round(performance.now())+"ms"}
function record(message){events.push(when()+" "+message);if(events.length>50)events.shift();schedule()}
function fmt(n){return Math.round(n)}
function inspect(label,selector){
 const elements=[...document.querySelectorAll(selector)];
 const node=elements[0];
 if(!node)return {label,count:0,status:"MISSING"};
 const cs=getComputedStyle(node),r=node.getBoundingClientRect();
 const visible=node.isConnected&&cs.display!=="none"&&cs.visibility!=="hidden"&&Number(cs.opacity)>0&&r.width>0&&r.height>0;
 return {label,count:elements.length,status:visible?"VISIBLE":"HIDDEN",width:fmt(r.width),height:fmt(r.height),x:fmt(r.x),y:fmt(r.y),parent:node.parentElement?.tagName||"?",position:cs.position};
}
function snapshot(){
 const parts=tracked.map(([label,selector])=>inspect(label,selector));
 const main=document.getElementById("daily-main"),hero=main?.querySelector(".daily-hero"),source=main?.querySelector("[data-week-source-custody-v1]");
 const ids=[...document.querySelectorAll("[id]")].map(x=>x.id);
 const duplicates=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))].filter(x=>!x.startsWith("english9Audit"));
 const small=[...document.querySelectorAll("#daily-main p,#daily-main a,#daily-main button,#daily-main label,#daily-main summary,#daily-main input,#daily-main textarea")].filter(el=>getComputedStyle(el).display!=="none"&&Number.parseFloat(getComputedStyle(el).fontSize)<16);
 const horizontalOverflow=document.documentElement.scrollWidth>document.documentElement.clientWidth+2;
 const stepIds=["reasoning-lab-1","heading-1-read","heading-1-practice","daily-practice-title","heading-1-write","heading-1-check"];
 const steps=stepIds.map(id=>document.getElementById(id)?.closest("section")).filter(Boolean);
 const stepOrder=steps.length===6&&steps.every((n,i)=>i===0||Boolean(steps[i-1].compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING));
 const drawer=document.getElementById("e9-resources-settings");
 const ordered=["vnv333NetworkTicker","vnvTickerAutoPopulate","vnvHeaderAutoPopulate"].map(id=>document.getElementById(id)).filter(Boolean);
 const orderedCorrect=ordered.length===3&&ordered.every((el,i)=>i===0||Boolean(ordered[i-1].compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING));
 return {
  scope:"READ_ONLY_NO_LEARNER_DATA",viewport:{width:window.innerWidth,height:window.innerHeight},
  components:parts,
  checks:{
   tickerHeaderOrder:orderedCorrect?"PASS":"CHECK",
   heroBeforeSource:hero&&source&&Boolean(hero.compareDocumentPosition(source)&Node.DOCUMENT_POSITION_FOLLOWING)?"PASS":"CHECK",
   mainCentered:main&&Math.abs(main.getBoundingClientRect().left-(document.documentElement.clientWidth-main.getBoundingClientRect().right))<8?"PASS":"CHECK",
   layoutWidth:document.documentElement.clientWidth,
   scrollbarOrGutterPx:window.innerWidth-document.documentElement.clientWidth,
   horizontalOverflow:horizontalOverflow?"FAIL":"PASS",
   duplicateIds:duplicates,
   below16pxElements:small.length,
   sourceCardCount:document.querySelectorAll("[data-week-source-custody-v1]").length,
   heroCount:document.querySelectorAll("#daily-main .daily-hero").length,
   resourcesDrawerCount:document.querySelectorAll("#e9-resources-settings").length,
   resourcesCollapsed:drawer&&!drawer.open?"PASS":"CHECK",
   instructionalStepOrder:stepOrder?"PASS":"CHECK",
   visibleReadinessNotice:document.getElementById("daily-gate")?.hidden?"not applicable":"verify visually",
   expectedHiddenSource:drawer&&!drawer.open?"source inside collapsed Resources & Settings":"check drawer state"
  },
  errors:errors.slice(-12),events:events.slice(-18)
 };
}
function format(s){
 const lines=["ENGLISH 9 · DAY 1 · VNV/KA FORENSIC (opt-in)","READ ONLY · No student data",
  "Viewport: "+s.viewport.width+" × "+s.viewport.height,"",
  ...s.components.map(c=>c.label+": "+c.status+" ×"+c.count+(c.width!=null?" · "+c.width+"×"+c.height+" @ ("+c.x+","+c.y+") · "+c.parent:"")),
  "","Checks:",...Object.entries(s.checks).map(([k,v])=>k+": "+(Array.isArray(v)?v.join(", ")||"none":v)),
  "","Runtime errors:",...(s.errors.length?s.errors:["none observed"]),"","Recent events:",...s.events];
 return lines.join("\n");
}
function render(){
 queued=false;if(closed||!document.body)return;
 if(!box){
  box=document.createElement("aside");box.id="english9AuditPanel";
  box.setAttribute("aria-label","English 9 opt-in forensic diagnostics");
  box.style.cssText="position:fixed;z-index:2147483647;left:8px;bottom:8px;width:min(680px,calc(100vw - 16px));max-height:55vh;overflow:auto;box-sizing:border-box;padding:14px;border:2px solid #b48b45;border-radius:7px;background:#202724;color:#fff8e9;font:400 16px/1.5 ui-monospace,monospace;box-shadow:0 12px 40px #0009";
  const h=document.createElement("h2");h.textContent="English 9 · Opt-in forensic audit";h.style.cssText="font:400 20px/1.3 Georgia,serif;margin:0 0 10px;color:#fff8e9";
  const controls=document.createElement("div");controls.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px";
  const btn=(name,fn)=>{const b=document.createElement("button");b.type="button";b.textContent=name;b.style.cssText="font:400 16px/1.4 Arial,sans-serif;padding:8px 11px;border-radius:7px;background:#fff8e9;color:#202724;border:0;cursor:pointer";b.addEventListener("click",fn);controls.append(b)};
  btn("Copy report",()=>navigator.clipboard?.writeText(format(snapshot())).catch(()=>{}));
  btn("Refresh",()=>{record("Manual refresh");render()});
  btn("Close",()=>{closed=true;box.remove();observer.disconnect()});
  out=document.createElement("pre");out.style.cssText="white-space:pre-wrap;overflow-wrap:anywhere;color:#fff8e9;background:transparent;margin:0;font:inherit";
  box.append(h,controls,out);document.body.append(box);
 }
 out.textContent=format(snapshot());
}
function schedule(){if(!queued&&!closed){queued=true;requestAnimationFrame(render)}}
const observer=new MutationObserver(records=>{
 const changes=[];
 for(const r of records){
  for(const n of [...r.addedNodes,...r.removedNodes]){
   if(n.nodeType!==1||n.id==="english9AuditPanel")continue;
   for(const [label,selector] of tracked){if(n.matches?.(selector)||n.querySelector?.(selector)){changes.push(label);break}}
  }
 }
 if(changes.length)record("Component DOM changed: "+[...new Set(changes)].join(", "));
});
function start(){
 observer.observe(document.body,{subtree:true,childList:true});
 record("Probe started");
}
window.addEventListener("error",e=>{const msg=e.target?.tagName==="SCRIPT"?"SCRIPT LOAD ERROR":e.message?"JS ERROR: "+String(e.message).slice(0,150):null;if(msg){errors.push(msg);record(msg)}},true);
window.addEventListener("unhandledrejection",e=>{const msg="PROMISE REJECTION: "+String(e.reason?.message||"unknown").slice(0,150);errors.push(msg);record(msg)});
window.addEventListener("load",()=>record("window load"),{once:true});
if(document.body)start();else document.addEventListener("DOMContentLoaded",start,{once:true});
window.KhaemenesEnglish9Day1Audit=Object.freeze({version:"1.0.0",snapshot,events:()=>events.slice(),report:()=>format(snapshot())});
})();