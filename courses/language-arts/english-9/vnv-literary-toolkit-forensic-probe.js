/* VNV/KA English 9 Literary Toolkit startup and interaction forensic v1.
 * Opt-in ?chrome_audit=1 only, no learner records, fields, cookies, storage or network reporting.
 * This tool never prevents default link or button behavior.
 */
(()=>{"use strict";
if(!new URLSearchParams(location.search).has("chrome_audit")||window.KhaemenesLiteraryToolkitAudit)return;
const start=performance.now(),errors=[],events=[],mutation={total:0,added:0,removed:0,windows:[]};
let panel=null,output=null,paused=false,pending=false;
const now=()=>Math.round(performance.now()-start)+"ms";
function record(msg){events.push(now()+" "+msg);if(events.length>60)events.shift();schedule()}
function dimension(node){if(!node)return null;const rect=node.getBoundingClientRect(),style=getComputedStyle(node);return {size:Math.round(rect.width)+"×"+Math.round(rect.height),x:Math.round(rect.x),y:Math.round(rect.y),visible:node.isConnected&&style.display!=="none"&&style.visibility!=="hidden"&&style.opacity!=="0"&&rect.width>0&&rect.height>0,parent:node.parentElement?.tagName||"?",pointerEvents:style.pointerEvents}}
const targets=[["333 ticker","#vnv333NetworkTicker"],["Auto ticker","#vnvTickerAutoPopulate"],["VNV header","#vnvHeaderAutoPopulate"],["Menu overlay","#vnvEnrichedMenuOverlay"],["Ecosystem toolbar","#vnvEcosystemUtilityDock"],["Literary hub","#literary-toolbox"],["Resource grid","#literary-toolbox .literary-tool-grid"],["Week disclosure","#literary-week-path"],["Save status","#literary-tools-save-status"]];
function snap(){
 const nodes=targets.map(([name,selector])=>{const list=document.querySelectorAll(selector);return {name,count:list.length,layout:dimension(list[0])}});
 const cards=[...document.querySelectorAll("#literary-toolbox .literary-tool-grid article")];
 const links=[...document.querySelectorAll("#literary-toolbox .literary-tool-grid a")];
 const linkTests=links.map(a=>{
  const r=a.getBoundingClientRect(),x=Math.max(1,Math.min(innerWidth-1,r.left+r.width/2)),y=Math.max(1,Math.min(innerHeight-1,r.top+r.height/2));
  const visible=r.width>0&&r.height>0;
  const inView=visible&&x>=0&&x<innerWidth&&y>=0&&y<innerHeight;
  const covering=inView?document.elementFromPoint(x,y):null;
  return {label:a.textContent.trim().slice(0,36),hrefKind:/^https?:/i.test(a.href)?"absolute":"relative",destinationPresent:Boolean(a.getAttribute("href")),target:a.target||"same tab",inView,blockedBy:inView&&covering&&!a.contains(covering)&&covering!==a?(covering.id||covering.tagName):null};
 });
 const ids=[...document.querySelectorAll("[id]")].map(e=>e.id),duplicates=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
 const scripts=[...document.scripts].filter(el=>el.src).map(el=>{let label;try{label=new URL(el.src).pathname.split("/").pop()}catch{label="unavailable"}return label});
 const resources=performance.getEntriesByType("resource").filter(e=>/\.js(?:$|\?)/i.test(e.name)).slice(-30).map(e=>({file:(()=>{try{return new URL(e.name).pathname.split("/").pop()}catch{return "unknown"}})(),duration:Math.round(e.duration),transfer:e.transferSize||0}));
 return {scope:"OPT_IN_READ_ONLY",readyState:document.readyState,elapsedMs:Math.round(performance.now()-start),viewport:innerWidth+"×"+innerHeight,layoutWidth:document.documentElement.clientWidth,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2,components:nodes,cards:cards.length,links:links.length,linksWithDestination:linkTests.filter(x=>x.destinationPresent).length,linkTests,allScripts:scripts,jsResources:resources,duplicates,mutation:{...mutation,windows:mutation.windows.slice(-8)},errors:errors.slice(-14),events:events.slice(-20)};
}
function report(){
 const s=snap();const rows=[
 "ENGLISH 9 · LITERARY TOOLKIT FORENSIC (opt-in)","READ ONLY · No student data",
 "Ready state: "+s.readyState+" · elapsed "+s.elapsedMs+" ms","Viewport: "+s.viewport+" · layout width: "+s.layoutWidth,
 "Horizontal overflow: "+(s.overflow?"YES":"NO"),"",
 ...s.components.map(c=>c.name+": "+(c.layout?(c.layout.visible?"VISIBLE":"HIDDEN")+" ×"+c.count+" · "+c.layout.size+" @ ("+c.layout.x+","+c.layout.y+") · "+c.layout.parent:"MISSING")),
 "","Literary cards: "+s.cards+" · destination links: "+s.links+" · link hrefs: "+s.linksWithDestination,
 "Duplicate IDs: "+(s.duplicates.join(", ")||"none"),
 "Mutations observed: "+s.mutation.total+" records · additions "+s.mutation.added+" · removals "+s.mutation.removed,
 "Mutation windows (approx. 1s): "+JSON.stringify(s.mutation.windows),
 "","Link hit tests (visible screen only):",
 ...s.linkTests.map(x=>x.label+": "+x.hrefKind+" / "+x.target+(x.inView?(x.blockedBy?" · BLOCKED by "+x.blockedBy:" · HIT TARGET OK"):" · outside viewport")),
 "","Loaded script filenames:",...s.allScripts,
 "","Recent JS resource timings:",...s.jsResources.map(x=>x.file+" "+x.duration+"ms transfer "+x.transfer),
 "","Runtime errors:",...(s.errors.length?s.errors:["none observed"]),"","Events:",...s.events
 ];
 return rows.join("\n");
}
function panelRender(){
 pending=false;if(paused||!document.body)return;
 if(!panel){
  panel=document.createElement("aside");panel.id="literaryForensicPanel";
  panel.setAttribute("aria-label","English 9 Literary Toolkit forensic diagnostic");
  panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(740px,calc(100vw - 16px));max-height:58vh;overflow:auto;box-sizing:border-box;padding:14px;border:2px solid #b48b45;border-radius:7px;background:#202724!important;color:#fff8e9!important;font:400 16px/1.5 ui-monospace,monospace!important;box-shadow:0 12px 40px #0009";
  const title=document.createElement("div");title.textContent="English 9 · Literary Toolkit · Forensic";title.style.cssText="font:400 20px/1.3 Georgia,serif;margin-bottom:10px";
  const actions=document.createElement("div");actions.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px";
  function btn(label,fn){const b=document.createElement("button");b.type="button";b.textContent=label;b.style.cssText="font:400 16px/1.3 Arial,sans-serif;min-height:40px;padding:8px 10px;border-radius:7px;border:0;background:#fff8e9;color:#202724;cursor:pointer";b.addEventListener("click",fn);actions.append(b)}
  btn("Copy report",()=>{const t=report();navigator.clipboard?.writeText(t).then(()=>record("Report copied")).catch(()=>{output?.focus();record("Clipboard unavailable; select text manually")})});
  btn("Refresh",()=>record("Manual refresh"));
  btn("Close",()=>{paused=true;observer.disconnect();panel.remove()});
  output=document.createElement("pre");output.tabIndex=0;output.style.cssText="font:inherit;white-space:pre-wrap;overflow-wrap:anywhere;background:transparent;color:#fff8e9;margin:0";
  panel.append(title,actions,output);document.body.append(panel);
 }
 output.textContent=report();
}
function schedule(){if(!pending&&!paused){pending=true;requestAnimationFrame(panelRender)}}
const observer=new MutationObserver(records=>{
 // Count DOM changes but deliberately ignore changes inside the diagnostic itself.
 for(const r of records){
  if(r.target?.closest?.("#literaryForensicPanel"))continue;
  mutation.total++;mutation.added+=r.addedNodes.length;mutation.removed+=r.removedNodes.length;
 }
});
function sampleMutations(){
 if(paused)return;
 mutation.windows.push({at:now(),records:mutation.total});
 if(mutation.windows.length>12)mutation.windows.shift();
 schedule();
}
window.addEventListener("error",e=>{
 const message=e.target?.tagName==="SCRIPT"?"SCRIPT LOAD ERROR: "+(()=>{try{return new URL(e.target.src).pathname.split("/").pop()}catch{return "unknown"}})():e.message?"JS ERROR: "+String(e.message).slice(0,160):null;
 if(message){errors.push(message);record(message)}
},true);
window.addEventListener("unhandledrejection",e=>{let msg="PROMISE REJECTION: "+String(e.reason?.message||"unknown").slice(0,160);errors.push(msg);record(msg)});
window.addEventListener("DOMContentLoaded",()=>record("DOMContentLoaded"),{once:true});
window.addEventListener("load",()=>record("window load"),{once:true});
window.addEventListener("pageshow",()=>record("pageshow"));
document.addEventListener("click",e=>{const a=e.target?.closest?.("#literary-toolbox a");if(a)record("User clicked literary link: "+a.textContent.trim().slice(0,32)+" · defaultPrevented="+e.defaultPrevented)},true);
function begin(){observer.observe(document.body,{subtree:true,childList:true});record("Probe started");sampleMutations();const timer=setInterval(()=>{if(paused){clearInterval(timer);return}sampleMutations()},1000);setTimeout(()=>clearInterval(timer),13000)}
if(document.body)begin();else document.addEventListener("DOMContentLoaded",begin,{once:true});
window.KhaemenesLiteraryToolkitAudit=Object.freeze({version:"1.0.0",snapshot:snap,report,events:()=>events.slice()});
})();