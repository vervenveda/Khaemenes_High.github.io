/* Science 9 readiness chrome competition probe v2; opt-in ?chrome_audit=1.
 * No learner storage access, no mutation of academic state, no external telemetry.
 * Diagnoses duplicate/missing headers, menu, tickers, toolbar and legacy floating launchers.
 */
(()=>{"use strict";
if(new URLSearchParams(location.search).get("chrome_audit")!=="1"||window.KhaemenesScience9ChromeAudit)return;
const start=performance.now(),log=[],MAX=150,IDS=[
 ["Native header",".site-header"],["Canonical VNV header","#vnvHeaderAutoPopulate"],
 ["333 ticker","#vnv333NetworkTicker"],["Auto ticker","#vnvTickerAutoPopulate"],
 ["Canonical menu button","#vnvEcosystemMenuButton"],["Canonical menu overlay","#vnvEcosystemMenuOverlay"],
 ["Canonical dock","#vnvEcosystemUtilityDock"],["Legacy learner dock","#khaemenesLearnerUtilityToolbar"],
 ["Legacy home dock","#khaemenesHomeUtilityDock"],["Legacy landing dock","#khaeLandingUtilityDock"],
 ["Legacy menu","#vnvEnrichedMenuOverlay"],["Local mentor links",'[class*="mentor" i],[id*="mentor" i]']
];
const now=()=>Math.round(performance.now()-start)+"ms";
const clean=s=>String(s||"").slice(0,170);
function info(el){
 if(!el)return null;
 const cs=getComputedStyle(el),r=el.getBoundingClientRect();
 const parents=[];let p=el.parentElement;for(let i=0;p&&i<5;i++,p=p.parentElement){
  const style=getComputedStyle(p);
  parents.push({name:p.tagName.toLowerCase(),id:p.id||"",className:typeof p.className==="string"?p.className.slice(0,100):"",display:style.display,visibility:style.visibility,opacity:style.opacity});
 }
 return {tag:el.tagName.toLowerCase(),id:el.id||"",parent:el.parentElement?.tagName.toLowerCase()||"",
  width:Math.round(r.width),height:Math.round(r.height),x:Math.round(r.x),y:Math.round(r.y),
  visible:cs.display!=="none"&&cs.visibility!=="hidden"&&Number(cs.opacity)>0&&r.width>0&&r.height>0,
  display:cs.display,visibility:cs.visibility,opacity:cs.opacity,position:cs.position,zIndex:cs.zIndex,
  color:cs.color,background:cs.backgroundColor,fontSize:cs.fontSize,pointerEvents:cs.pointerEvents,
  ancestors:parents};
}
function snapshot(){
 const targets={};for(const [name,sel] of IDS){const nodes=[...document.querySelectorAll(sel)].slice(0,10);targets[name]={count:document.querySelectorAll(sel).length,elements:nodes.map(info)}}
 const floaters=[...document.querySelectorAll("body *")].filter(el=>{
  if(el.closest("#science9ChromeProbePanel")||el.closest("#vnvEcosystemUtilityDock"))return false;
  const cs=getComputedStyle(el),r=el.getBoundingClientRect();
  if(cs.position!=="fixed"||r.width<20||r.height<15||r.width>window.innerWidth*.7)return false;
  const x=(el.textContent||"").trim().slice(0,80);
  return /mentor|beta|search|help|profile|support/i.test(x)||/mentor|dock|toolbar|utility/i.test(el.id+" "+el.className);
 }).slice(0,16).map(el=>({text:clean(el.textContent?.trim()),info:info(el)}));
 return {at:now(),urlPath:location.pathname,viewport:{w:innerWidth,h:innerHeight},targets,floaters,
  scripts:[...document.scripts].map(x=>x.src).filter(x=>/vnv|mentor|header|navigation|ticker|ecosystem|probe/i.test(x)),
  styles:[...document.querySelectorAll('link[rel="stylesheet"],style[id]')].map(x=>x.href||x.id).filter(x=>/vnv|academy|course|unit|readiness|parchment|menu|style/i.test(x)).slice(0,45)};
}
function record(message){log.push(now()+" "+clean(message));if(log.length>MAX)log.shift();update();}
let panel,pre,queued=false;
function render(){
 if(!document.body)return;
 if(!panel){panel=document.createElement("aside");panel.id="science9ChromeProbePanel";
  panel.style.cssText="all:initial!important;position:fixed!important;left:8px!important;bottom:8px!important;z-index:2147483647!important;width:min(680px,calc(100vw - 16px))!important;max-height:50vh!important;overflow:auto!important;padding:14px!important;border:2px solid #b8995c!important;border-radius:7px!important;background:#202724!important;color:#fff8e9!important;font:400 14px/1.5 ui-monospace,monospace!important;box-shadow:0 12px 40px #0008!important";
  const title=document.createElement("div");title.textContent="Science 9 · Chrome Competition Probe v2";title.style.cssText="color:#fff8e9!important;font-size:16px!important;margin-bottom:8px!important";
  const controls=document.createElement("div");controls.style.cssText="display:flex;gap:9px;margin-bottom:8px";
  const exportBtn=document.createElement("button");exportBtn.type="button";exportBtn.textContent="Export findings";const close=document.createElement("button");close.type="button";close.textContent="Close";
  for(const b of [exportBtn,close])b.style.cssText="background:#fff8e9!important;color:#202724!important;border:1px solid #b8995c!important;border-radius:7px!important;padding:7px 11px!important;font:400 14px Arial!important";
  close.onclick=()=>panel?.remove();exportBtn.onclick=()=>{const data=JSON.stringify({snapshot:snapshot(),timeline:log},null,2);const url=URL.createObjectURL(new Blob([data],{type:"application/json"}));const a=document.createElement("a");a.download="science9-readiness-chrome-audit.json";a.href=url;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  controls.append(exportBtn,close);pre=document.createElement("pre");pre.style.cssText="color:#fff8e9!important;background:transparent!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important;font:400 13px/1.5 ui-monospace,monospace!important";
  panel.append(title,controls,pre);document.body.append(panel);
 }
 const s=snapshot();const names=["Native header","Canonical VNV header","333 ticker","Auto ticker","Canonical menu button","Canonical dock","Legacy learner dock","Legacy home dock","Legacy landing dock"];
 pre.textContent=names.map(n=>{const t=s.targets[n],e=t.elements[0];return n+": "+(t.count?t.count+" found, "+(e.visible?"VISIBLE":"HIDDEN")+" "+e.width+"x"+e.height+" "+e.background:"MISSING")}).join("\n")+"\nFloating competitors: "+s.floaters.map(f=>f.text).join(" | ")+"\n\nLatest events:\n"+log.slice(-16).join("\n");
}
function update(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}
function nodeLabels(n){if(n.nodeType!==1)return[];const a=[];for(const [name,sel] of IDS.slice(0,11))if(n.matches?.(sel)||n.querySelector?.(sel))a.push(name);if(n.matches?.("style,link[rel=stylesheet],script"))a.push(n.tagName.toLowerCase()+" "+(n.id||n.getAttribute("src")||n.getAttribute("href")||""));return a}
const observer=new MutationObserver(records=>{const changes=[];for(const r of records){if(r.type==="attributes"){const e=r.target;if(e.id==="science9ChromeProbePanel"||e.closest?.("#science9ChromeProbePanel"))continue;const match=IDS.slice(0,11).find(([,sel])=>e.matches?.(sel));if(match)changes.push("STYLE/STATE "+match[0]+" "+r.attributeName)}else for(const [kind,nodes] of [["ADDED",r.addedNodes],["REMOVED",r.removedNodes]])for(const n of nodes){for(const label of nodeLabels(n))changes.push(kind+" "+label)}}if(changes.length)record([...new Set(changes)].slice(0,12).join("; "))});
observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["style","class","hidden","aria-hidden"]});
window.addEventListener("error",e=>{if(e.target?.tagName==="SCRIPT")record("SCRIPT FAILED "+(e.target.src||"").slice(-115));else if(e.message)record("JS ERROR "+e.message)},true);
window.addEventListener("unhandledrejection",e=>record("PROMISE REJECTION "+String(e.reason?.message||e.reason||"unknown")));
document.addEventListener("DOMContentLoaded",()=>record("DOMContentLoaded"),{once:true});
window.addEventListener("load",()=>record("window load"),{once:true});
window.addEventListener("pageshow",()=>record("pageshow"));
for(const delay of [250,850,1800,3500])setTimeout(()=>record("checkpoint "+delay+"ms"),delay);
window.KhaemenesScience9ChromeAudit=Object.freeze({snapshot,events:()=>log.slice(),version:"2.0.0"});
record("Probe started in document head");
})();