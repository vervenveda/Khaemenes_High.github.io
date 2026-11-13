/* High School front-hall forensic chrome diagnostics v2.0.0
 * Opt-in only: ?chrome_audit=1; observational, same-page, no network reporting.
 * No cookies, student records, registry reads, local/session storage, or storage writes.
 */
(()=>{"use strict";
if(new URLSearchParams(location.search).get("chrome_audit")!=="1"||window.KhaemenesHighChromeAudit)return;
const targets=[
 ["333 ticker","vnv333NetworkTicker"],["Auto ticker","vnvTickerAutoPopulate"],
 ["VNV header","vnvHeaderAutoPopulate"],["Branched menu","vnvEnrichedMenuOverlay"],
 ["Ecosystem toolbar","vnvEcosystemUtilityDock"],["Language rail","vnv-language-rail"]
];
const trace=[];let panel,output,scheduled=false,closed=false,lastReport="";
const ms=()=>Math.round(performance.now())+"ms";
const safeRect=el=>{const r=el.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),bottom:Math.round(r.bottom),right:Math.round(r.right)}};
const cs=el=>getComputedStyle(el);
const one=id=>document.getElementById(id);
const count=s=>document.querySelectorAll(s).length;
const describe=(name,id)=>{
 const all=document.querySelectorAll('[id="'+id+'"]');
 if(!all.length)return name+": MISSING (count 0)";
 return [...all].map(el=>{
  const c=cs(el),r=safeRect(el),visible=el.isConnected&&c.display!=="none"&&c.visibility!=="hidden"&&Number(c.opacity)>0&&r.w>0&&r.h>0;
  return name+": "+(visible?"PRESENT":"HIDDEN")+" · "+r.w+"×"+r.h+" @ "+r.x+","+r.y+
   " · "+c.position+" · z="+c.zIndex+" · bg="+c.backgroundColor+
   " · parent="+(el.parentElement?.tagName.toLowerCase()||"?")+
   (all.length>1?" · DUPLICATE IDS="+all.length:"");
 }).join("\n");
};
function report(){
 const lines=["HIGH SCHOOL / VNV FORENSIC REPORT v2.2.0","Read-only DOM and layout metadata. No learner data."];
 const add=(head,parts)=>{lines.push("\n["+head+"]",...parts)};
 const root=document.documentElement,body=document.body;
 add("VIEWPORT & OVERFLOW",[
  "inner="+innerWidth+"×"+innerHeight+" · visual="+(visualViewport?Math.round(visualViewport.width)+"×"+Math.round(visualViewport.height)+" scale="+visualViewport.scale:"unavailable"),
  "document scrollWidth="+root.scrollWidth+" · clientWidth="+root.clientWidth+" · horizontal overflow="+Math.max(0,root.scrollWidth-root.clientWidth)+"px",
  "body scrollWidth="+body.scrollWidth+" · devicePixelRatio="+devicePixelRatio+" · scrollY="+Math.round(scrollY),
  "document fonts="+(document.fonts?.status||"unknown")
 ]);
 const title=document.querySelector("main#main .high-frontdesk-hero h1");
 add("HIGH SCHOOL HERO TITLE · OPT-IN TYPOGRAPHY",[
  "hero title="+(title?JSON.stringify(title.textContent.trim()):"MISSING"),
  "computed font-size="+(title?cs(title).fontSize:"n/a")+
   " · family="+(title?cs(title).fontFamily:"n/a")+
   " · line-height="+(title?cs(title).lineHeight:"n/a")+
   " · weight="+(title?cs(title).fontWeight:"n/a"),
  "title box="+(title?JSON.stringify(safeRect(title)):"n/a")+
   " · large size authority="+(document.getElementById("high-school-hero-title-authority-v1")?"PRESENT":"MISSING"),
  "font loading="+(document.fonts?.status||"unknown")+
   " · opt-in title snapshots read visual data only"
 ]);
 add("CANONICAL CHROME",targets.map(([n,id])=>describe(n,id)));
 const t=one("vnv333NetworkTicker"),a=one("vnvTickerAutoPopulate"),h=one("vnvHeaderAutoPopulate");
 const rr=el=>el?safeRect(el):null;
 const rt=rr(t),ra=rr(a),rh=rr(h);
 const delta=(p,q)=>p&&q?(q.y-p.bottom)+"px":"unavailable";
 add("STACK & OCCLUSION",[
  "333→auto gap/overlap="+delta(rt,ra)+" · auto→header gap/overlap="+delta(ra,rh),
  "header bottom="+(rh?.bottom??"missing")+" · expected viewport first content below header (sticky offsets may vary)",
 "header computed top="+(h?cs(h).top:"missing")+" · root --vnv-header-top="+cs(root).getPropertyValue("--vnv-header-top").trim()+
  " · intended ticker combined height="+((rt?.h||0)+(ra?.h||0))+"px",
 "ticker computed top="+[t,a].map(el=>el?el.id+":"+cs(el).top:"missing").join(" · "),
 "header ancestor chain="+(h?(()=>{const names=[];for(let n=h.parentElement;n&&names.length<5;n=n.parentElement)names.push(n.tagName.toLowerCase()+(n.id?"#"+n.id:""));return names.join(" > ")})():"missing"),
  ...[t,a,h].filter(Boolean).map(el=>{
   const r=safeRect(el),x=Math.min(Math.max(r.x+Math.min(20,r.w/2),0),innerWidth-1),y=Math.min(Math.max(r.y+Math.min(8,r.h/2),0),innerHeight-1);
   const top=document.elementFromPoint(x,y);
   return el.id+" hit-test top="+(top?.id||top?.tagName?.toLowerCase()||"none")+" · inside="+Boolean(top&&(top===el||el.contains(top)));
  })
 ]);
 const menu=one("vnvEnrichedMenuOverlay"),menuButton=document.querySelector("#vnvHeaderAutoPopulate .vnv-header-menu-button");
 add("MENU / INTERACTION STATE",[
  "canonical menu button="+(menuButton?"PRESENT":"MISSING")+" · aria-expanded="+(menuButton?.getAttribute("aria-expanded")??"n/a"),
  "overlay="+(menu?"PRESENT":"MISSING")+" · data-open="+(menu?.getAttribute("data-open")??"n/a")+
   " · aria-hidden="+(menu?.getAttribute("aria-hidden")??"n/a"),
  "branched menu controller="+(typeof window.VNV_ENRICHED_MENU?.open==="function"?"PRESENT":"MISSING"),
  "header controller="+(typeof window.VNV_HEADER?.mount==="function"?"PRESENT":"MISSING"),
  "menu closed is expected when not opened; probe does not trigger the menu"
 ]);
 const translationScripts=[...document.scripts].filter(s=>/vnv-language|translator|langgwij/i.test(s.getAttribute("src")||""));
 const translationEls=[...document.querySelectorAll("[id],[class]")].filter(el=>{
  if(el===panel||panel?.contains(el))return false;
  const meta=((el.id||"")+" "+(typeof el.className==="string"?el.className:"")).toLowerCase();
  return /vnv.language|translation.rail|translator|language.switch|langgwij/.test(meta);
 }).slice(0,20);
 add("TRANSLATOR & LANGUAGE WIRING",[
  "language script tags="+translationScripts.length+" · filenames="+(translationScripts.map(s=>(s.getAttribute("src")||"").split("/").pop().split("?")[0]).join(", ")||"none"),
  "language-related DOM elements="+translationEls.length+" · ids/classes="+(translationEls.map(el=>el.id||String(el.className).split(/\s+/).slice(0,2).join(".")).join(", ")||"none"),
  "language rail missing does not alone prove translation failure"
 ]);
 const scripts=[...document.scripts].filter(s=>s.src).map(s=>(s.getAttribute("src")||"").split("/").pop().split("?")[0]);
 const tally=Object.entries(scripts.reduce((o,s)=>(o[s]=(o[s]||0)+1,o),{})).filter(([,n])=>n>1).map(([s,n])=>s+" ×"+n);
 add("SCRIPT DEPENDENCY INVENTORY",[
  "external script elements="+scripts.length+" · duplicate filenames="+(tally.join("; ")||"none"),
  "chrome scripts="+(scripts.filter(s=>/vnv-header|vnv-333|vnv-ticker|vnv-ecosystem|vnv-language|high-vnv-chrome/.test(s)).join(", ")||"none"),
  "legacy header nodes="+count("header.site-header,header[data-khae-header]")+
  " · canonical header nodes="+count("#vnvHeaderAutoPopulate")+
  " · ecosystem menu buttons="+count("#vnvHeaderAutoPopulate .vnv-header-menu-button"),
  "stylesheet style elements="+count("style")+" · linked stylesheets="+count('link[rel="stylesheet"]')
 ]);
 const sections=["grades","portals","departments","whole-student","pathways","library","transition","network"];
 const grids=[["Grades","#gradeGrid"],["Portal center","#portals .portal-grid"],["Departments","#departmentGrid"],["Whole student","#whole-student .whole-grid"],["Pathways","#pathways .pathway-grid"],["Library","#toolGrid"],["Connected halls","#networkGrid"]];
 add("SECTION BANDS",sections.map(id=>{
  const el=one(id);if(!el)return id+": MISSING";
  const c=cs(el);return id+": bg="+c.backgroundColor+" · bg-image="+c.backgroundImage.slice(0,95)+
   " · padding-top="+c.paddingTop;
 }));
 add("GRID COUNTS & LAYOUT",grids.map(([name,selector])=>{
  const el=document.querySelector(selector);if(!el)return name+": MISSING";
  const children=[...el.children].filter(x=>cs(x).display!=="none"&&!x.hidden);
  const xs=[...new Set(children.map(x=>Math.round(x.getBoundingClientRect().top)))];
  return name+": visible cards="+children.length+" · visual rows="+xs.length+" · row distribution="+
   (xs.map(y=>children.filter(x=>Math.abs(x.getBoundingClientRect().top-y)<3).length).join("/")||"empty")+
   " · columns="+cs(el).gridTemplateColumns.slice(0,90);
 }));
 const broken=[...document.querySelectorAll('a[href^="#"]')].filter(el=>{
  const dest=el.getAttribute("href");const dialogId=el.getAttribute("aria-controls");return dest&&dest.length>1&&!document.getElementById(dest.slice(1))&&!(dialogId&&document.getElementById(dialogId));
 }).slice(0,16).map(el=>el.getAttribute("href"));
 add("LOCAL LINK TARGETS",[
  "unresolved same-page anchors="+broken.length+" (max 16 shown): "+(broken.map(x=>x==="#high-school-directory"?x+" [intercepted: opens directory drawer]":x).join(", ")||"none"),
  "choose-profile actions: "+[...document.querySelectorAll('a[href="#choose-profile"]')].slice(0,5).map(x=>x.getAttribute("aria-controls")&&document.getElementById(x.getAttribute("aria-controls"))?"dialog controller present ("+x.getAttribute("aria-controls")+")":"UNRESOLVED").join(" | "),
  "Does not fetch destination URLs or inspect page/account data"
 ]);
 add("EVENT TIMELINE",trace.slice(-24));
 return lines.join("\n");
}
function refresh(){lastReport=report();if(output)output.textContent=lastReport}
function paint(){
 if(closed||!document.body)return;
 if(!panel){
  panel=document.createElement("aside");panel.id="highSchoolChromeAuditPanel";
  panel.setAttribute("aria-label","High School forensic chrome diagnostics");
  panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(780px,calc(100vw - 16px));max-height:64vh;overflow:auto;padding:13px 15px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;font:400 14px/1.45 ui-monospace,monospace!important;box-shadow:0 12px 40px #0009";
  const title=document.createElement("strong");title.textContent="High School · Deep Forensic Chrome Audit";title.style.cssText="display:block;margin-bottom:10px;font-size:16px";
  const controls=document.createElement("div");controls.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px";
  for(const [label,action] of [
   ["Refresh snapshot",refresh],["Copy report",()=>navigator.clipboard?.writeText(lastReport).catch(()=>{})],
   ["Close diagnostics",()=>{closed=true;observer.disconnect();panel.remove();panel=null;output=null}]
  ]){
   const b=document.createElement("button");b.type="button";b.textContent=label;
   b.style.cssText="padding:7px 10px;border:0;border-radius:7px;background:#fff8e9;color:#243038;font:400 14px/1.3 ui-monospace,monospace;cursor:pointer";
   b.addEventListener("click",action);controls.appendChild(b);
  }
  output=document.createElement("pre");output.style.cssText="font:inherit!important;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:#fff8e9!important;background:transparent!important";
  panel.append(title,controls,output);document.body.appendChild(panel);
 }
 refresh();
}
function note(s){trace.push(ms()+" "+s);if(trace.length>50)trace.shift();if(!scheduled&&!closed){scheduled=true;requestAnimationFrame(()=>{scheduled=false;paint()})}}
const tracked=new Set(targets.map(t=>t[1]));
const observer=new MutationObserver(records=>{
 const changes=[];
 for(const r of records){
  if(r.type!=="childList")continue;
  for(const [node,type] of [...Array.from(r.addedNodes,n=>[n,"ADDED"]),...Array.from(r.removedNodes,n=>[n,"REMOVED"])]){
   if(node.nodeType!==1||node===panel||panel?.contains(node))continue;
   if(tracked.has(node.id))changes.push(type+" "+node.id);
   for(const [name,id] of targets)if(node.querySelector?.('[id="'+id+'"]'))changes.push(type+" "+name);
  }
 }
 if(changes.length)note([...new Set(changes)].join("; "));
});
function start(){observer.observe(document.body,{childList:true,subtree:true});note("Deep probe started (events since activation only)")}
if(document.body)start();else document.addEventListener("DOMContentLoaded",start,{once:true});
document.addEventListener("DOMContentLoaded",()=>note("DOMContentLoaded"),{once:true});
window.addEventListener("load",()=>note("window load"),{once:true});
window.addEventListener("pageshow",()=>note("pageshow"));
window.addEventListener("resize",()=>note("viewport resize"));
window.addEventListener("error",e=>{
 if(e.target!==window&&e.target?.tagName==="SCRIPT")note("SCRIPT LOAD ERROR: "+(e.target.getAttribute("src")||"").split("/").pop().split("?")[0]);
 else if(e.message)note("JS ERROR: "+String(e.message).slice(0,140));
},true);
window.addEventListener("unhandledrejection",e=>note("PROMISE REJECTION: "+String(e.reason?.message||"unknown").slice(0,130)));
/* Opt-in title-size monitoring: compare startup, font-ready and subsequent changes.
   No storage, mutation or remote reporting; only read computed style. */
let lastTitleSize="";
function observeTitleSize(origin){
 const el=document.querySelector("main#main .high-frontdesk-hero h1");
 if(!el)return;
 const value=getComputedStyle(el).fontSize;
 if(value!==lastTitleSize){lastTitleSize=value;note("HERO TITLE "+origin+": "+value)}
}
document.addEventListener("DOMContentLoaded",()=>observeTitleSize("DOMContentLoaded"),{once:true});
window.addEventListener("load",()=>observeTitleSize("window load"),{once:true});
document.fonts?.ready?.then(()=>observeTitleSize("fonts ready")).catch(()=>{});
window.addEventListener("resize",()=>observeTitleSize("viewport resize"));
const titleObserver=new MutationObserver(()=>observeTitleSize("DOM/style change"));
function watchTitle(){
 const target=document.querySelector("main#main .high-frontdesk-hero h1");
 if(target)titleObserver.observe(target,{attributes:true,attributeFilter:["class","style"]});
 for(const el of document.querySelectorAll('style,link[rel="stylesheet"]'))
  titleObserver.observe(el,{attributes:true,attributeFilter:["media","disabled","href"]});
 observeTitleSize("probe started");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",watchTitle,{once:true});else watchTitle();
window.KhaemenesHighChromeAudit=Object.freeze({version:"2.2.0",snapshot:()=>report(),events:()=>trace.slice(),refresh:()=>refresh()});
})();