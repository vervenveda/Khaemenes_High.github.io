/* English 9 Literary Toolkit diagnostic v2: explicit/manual, read-only and lightweight.
 * Opt-in only; no DOM mutation observer, timers, storage, cookies or learner field inspection.
 */
(()=>{"use strict";
if(!new URLSearchParams(location.search).has("chrome_audit")||window.KhaemenesLiteraryToolkitAudit)return;
let panel=null,output=null,lastReport="",errors=[],events=[];
function stage(){
 const ids=["vnv333NetworkTicker","vnvTickerAutoPopulate","vnvHeaderAutoPopulate","vnvEnrichedMenuOverlay","vnvEcosystemUtilityDock","literary-toolbox","literary-week-path","literary-tools-save-status"];
 const parts=ids.map(id=>{const e=document.getElementById(id);if(!e)return id+": MISSING";const b=e.getBoundingClientRect();return id+": "+Math.round(b.width)+"×"+Math.round(b.height)+" / "+(b.width&&b.height?"VISIBLE":"HIDDEN")});
 const cards=document.querySelectorAll("#literary-toolbox .literary-tool-grid article").length;
 const links=[...document.querySelectorAll("#literary-toolbox .literary-tool-grid a")];
 const bad=links.filter(a=>!a.getAttribute("href"));
 const idsAll=[...document.querySelectorAll("[id]")].map(e=>e.id);
 const duplicate=[...new Set(idsAll.filter((id,i)=>idsAll.indexOf(id)!==i))];
 const scripts=[...document.scripts].filter(s=>s.src).map(s=>{try{return new URL(s.src).pathname.split("/").pop()}catch{return "unknown"}});
 return ["ENGLISH 9 · LITERARY TOOLKIT · SAFE FORENSIC V2","OPT-IN / READ-ONLY / MANUAL SNAPSHOT",
 "document.readyState: "+document.readyState,
 "Viewport: "+innerWidth+"×"+innerHeight+" · document client width: "+document.documentElement.clientWidth,
 "Horizontal overflow: "+(document.documentElement.scrollWidth>document.documentElement.clientWidth+2?"YES":"NO"),
 "Literary cards: "+cards+" · Tool links: "+links.length+" · Missing link targets: "+bad.length,
 "Duplicate IDs: "+(duplicate.join(", ")||"none"),...parts,
 "Header: "+(document.querySelector(".e9-toolkit-header")?"lightweight recovery header":"MISSING"),
 "Shared orchestrator bypassed: "+(!scripts.includes("high-school-global-chrome-v2.js")?"YES":"NO"),
 "Direct canonical component files: "+["vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","vnv-ecosystem-toolbar.js"].filter(x=>scripts.includes(x)).length+"/4",
 "Scripts: "+scripts.join(", "),
 "Captured script errors: "+(errors.join(" | ")||"none"),
 "Clicks captured: "+(events.join(" | ")||"none"),
 "Manual check: click any Literary Toolkit link; note whether navigation starts.",
 "No live polling or DOM observers active."].join("\n");
}
function refresh(){lastReport=stage();if(output)output.textContent=lastReport}
function mount(){
 if(panel||!document.body)return;
 panel=document.createElement("aside");panel.id="literaryForensicPanel";
 panel.setAttribute("aria-label","Lightweight literary tools diagnostics");
 panel.style.cssText="position:fixed;z-index:2147483647;left:8px;bottom:8px;width:min(580px,calc(100vw - 16px));max-height:48vh;overflow:auto;box-sizing:border-box;padding:12px;border:2px solid #b48b45;border-radius:7px;background:#202724;color:#fff8e9;font:400 16px/1.4 ui-monospace,monospace";
 const heading=document.createElement("strong");heading.textContent="English 9 · Safe diagnostic";heading.style.cssText="display:block;font-size:18px;margin-bottom:8px";
 const controls=document.createElement("div");controls.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px";
 const button=(label,fn)=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.style.cssText="min-height:40px;padding:8px 12px;border:0;border-radius:7px;background:#fff8e9;color:#202724;font:400 16px Arial,sans-serif;cursor:pointer";b.addEventListener("click",fn);controls.append(b)};
 button("Refresh",refresh);
 button("Copy report",()=>{refresh();navigator.clipboard?.writeText(lastReport).catch(()=>{})});
 button("Close",()=>{panel.remove();panel=null;output=null});
 output=document.createElement("pre");output.style.cssText="font:inherit;white-space:pre-wrap;overflow-wrap:anywhere;background:transparent;color:#fff8e9;margin:0";
 panel.append(heading,controls,output);document.body.append(panel);refresh();
}
window.addEventListener("error",e=>{if(e.message)errors.push(String(e.message).slice(0,120))},true);
window.addEventListener("unhandledrejection",e=>{errors.push("rejection: "+String(e.reason?.message||"unknown").slice(0,120))});
document.addEventListener("click",e=>{const a=e.target?.closest?.("#literary-toolbox a");if(a)events.push(a.textContent.trim().slice(0,30))},true);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
window.KhaemenesLiteraryToolkitAudit=Object.freeze({version:"2.0.0",snapshot:stage,report:()=>{refresh();return lastReport}});
})();