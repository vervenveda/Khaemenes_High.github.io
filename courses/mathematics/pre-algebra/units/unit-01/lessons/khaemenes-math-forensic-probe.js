/* Khaemenes Mathematics Engine · forensic probe v1.0.0
 * Opt-in only: append ?math_audit=1 to the lesson URL.
 * Read-only inspection. No learner/profile reads, cookies, storage writes, or reporting.
 */
(()=>{"use strict";
 const params=new URLSearchParams(location.search);
 if(!params.has("math_audit")||window.KhaemenesMathForensicAudit)return;

 const targets=[
  ["333 ticker","vnv333NetworkTicker"],
  ["Auto ticker","vnvTickerAutoPopulate"],
  ["VNV header","vnvHeaderAutoPopulate"],
  ["Branched menu","vnvEnrichedMenuOverlay"],
  ["Left class tools","vnvClassToolsToolbar"],
  ["Right ecosystem tools","vnvEcosystemUtilityDock"],
  ["Math workspace","main"],
  ["Breadcrumb bar",null,".kme-breadcrumb-bar"],
  ["Hero",null,".khaemenes-math-engine .hero"]
 ];

 const traces=[]; let panel=null,output=null,queued=false;
 const when=()=>Math.round(performance.now())+"ms";
 const nodeFor=(id,selector)=>id?document.getElementById(id):document.querySelector(selector);

 function visibleSummary(name,id,selector){
  const el=nodeFor(id,selector);
  if(!el)return name+": MISSING";
  let css,rect;
  try{css=getComputedStyle(el);rect=el.getBoundingClientRect()}catch{return name+": CSS read failed"}
  const visible=el.isConnected&&css.display!=="none"&&css.visibility!=="hidden"&&Number(css.opacity)>0&&rect.width>0&&rect.height>0;
  return name+": "+(visible?"PRESENT":"HIDDEN")+
    " · "+Math.round(rect.width)+"×"+Math.round(rect.height)+
    " at ("+Math.round(rect.x)+","+Math.round(rect.y)+")"+
    " · display "+css.display+
    " · visibility "+css.visibility+
    " · opacity "+css.opacity+
    " · parent "+(el.parentElement?.tagName?.toLowerCase()||"?");
 }

 function textAudit(){
  const scope=document.querySelector(".khaemenes-math-engine");
  if(!scope)return {below16:[],headingsNotCinzel:[],textCount:0};
  const below16=[],headingsNotCinzel=[]; let textCount=0;
  const nodes=[...scope.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,dt,dd,th,td,label,legend,a,button,input,select,textarea,span,small,summary")];
  for(const el of nodes){
   if(el.offsetParent===null&&getComputedStyle(el).position!=="fixed")continue;
   const txt=(el.textContent||el.getAttribute("aria-label")||"").trim();
   if(!txt)continue;
   textCount++;
   const css=getComputedStyle(el),size=parseFloat(css.fontSize)||0;
   if(size<16)below16.push({tag:el.tagName.toLowerCase(),size:Number(size.toFixed(2)),text:txt.slice(0,72)});
   if(/^(H[1-6])$/.test(el.tagName)||el.matches(".academy-eyebrow,.eyebrow,summary")){
    const fam=css.fontFamily||"";
    if(!/Cinzel/i.test(fam))headingsNotCinzel.push({tag:el.tagName.toLowerCase(),font:fam,text:txt.slice(0,72)});
   }
  }
  return {below16,headingsNotCinzel,textCount};
 }

 function layoutAudit(){
  const all=[...document.querySelectorAll("[id]")];
  const counts=new Map();
  for(const el of all)counts.set(el.id,(counts.get(el.id)||0)+1);
  const duplicateIds=[...counts].filter(([,n])=>n>1).map(([id,n])=>({id,count:n}));
  const vw=document.documentElement.clientWidth;
  const overflow=[...document.querySelectorAll("body *")].filter(el=>{
    const r=el.getBoundingClientRect();
    return r.width>0&&(r.right>vw+2||r.left<-2);
  }).slice(0,30).map(el=>({tag:el.tagName.toLowerCase(),id:el.id||"",class:(el.className||"").toString().slice(0,80),right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)}));
  return {duplicateIds,overflow,viewport:vw};
 }

 function snapshot(){
  const text=textAudit(),layout=layoutAudit();
  return {
   components:targets.map(([name,id,selector])=>visibleSummary(name,id,selector)),
   stylesheets:[...document.styleSheets].map(s=>s.href||"inline"),
   text,
   layout
  };
 }

 function render(){
  if(!document.body)return;
  if(!panel){
   panel=document.createElement("aside");
   panel.id="khaemenesMathAuditPanel";
   panel.setAttribute("aria-label","Khaemenes Mathematics forensic audit");
   panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(760px,calc(100vw - 16px));max-height:55vh;overflow:auto;padding:13px 15px;border:3px solid #202724;border-radius:7px;background:#202724!important;color:#fffdf3!important;font:400 16px/1.45 ui-monospace,monospace!important;box-shadow:0 12px 40px #0008";
   const title=document.createElement("strong");
   title.textContent="Mathematics Engine · Forensic Audit";
   title.style.cssText="display:block;color:#fffdf3!important;font-size:16px!important;font-weight:400!important;margin-bottom:8px";
   const close=document.createElement("button");
   close.type="button";close.textContent="Close diagnostics";
   close.style.cssText="background:#fffdf3!important;color:#202724!important;border:0;border-radius:7px;padding:7px 11px;margin-bottom:8px;font:400 16px/1.3 ui-monospace,monospace!important";
   close.addEventListener("click",()=>{panel.remove();panel=null;output=null});
   output=document.createElement("pre");
   output.style.cssText="font:inherit!important;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:#fffdf3!important;background:transparent!important";
   panel.append(title,close,output);document.body.append(panel);
  }
  const s=snapshot();
  const lines=[
   "Current (read-only · no learner data):",
   ...s.components,
   "",
   "Typography:",
   "Visible text elements: "+s.text.textCount,
   "Text below 16px: "+s.text.below16.length,
   ...s.text.below16.slice(0,12).map(x=>"  "+x.size+"px · <"+x.tag+"> · "+x.text),
   "Titles/eyebrows not Cinzel: "+s.text.headingsNotCinzel.length,
   ...s.text.headingsNotCinzel.slice(0,12).map(x=>"  <"+x.tag+"> · "+x.font+" · "+x.text),
   "",
   "Layout:",
   "Viewport: "+s.layout.viewport+"px",
   "Duplicate IDs: "+s.layout.duplicateIds.length,
   ...s.layout.duplicateIds.slice(0,8).map(x=>"  "+x.id+" ×"+x.count),
   "Horizontal overflow suspects: "+s.layout.overflow.length,
   ...s.layout.overflow.slice(0,10).map(x=>"  <"+x.tag+"> #"+x.id+" ."+x.class+" · width "+x.width+" · right "+x.right),
   "",
   "Stylesheets: "+s.stylesheets.length,
   ...s.stylesheets.map(x=>"  "+x),
   "",
   "Event timeline:",
   ...traces.slice(-16)
  ];
  output.textContent=lines.join("\n");
 }

 function record(note){
  traces.push(when()+" "+note);
  if(traces.length>60)traces.shift();
  if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;render()})}
 }

 const obs=new MutationObserver(records=>{
  const changes=[];
  for(const r of records){
   for(const n of [...r.addedNodes,...r.removedNodes]){
    if(n.nodeType!==1)continue;
    for(const [name,id,selector] of targets){
     if((id&&(n.id===id||n.querySelector?.("#"+id)))||(selector&&(n.matches?.(selector)||n.querySelector?.(selector))))changes.push((r.addedNodes.length?"ADDED ":"REMOVED ")+name);
    }
   }
  }
  if(changes.length)record([...new Set(changes)].join("; "));
 });

 function begin(){
  obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["style","hidden","class","aria-hidden"]});
  record("Probe started");
 }

 if(document.body)begin();else document.addEventListener("DOMContentLoaded",begin,{once:true});
 document.addEventListener("DOMContentLoaded",()=>record("DOMContentLoaded"),{once:true});
 window.addEventListener("load",()=>record("window load"),{once:true});
 window.addEventListener("pageshow",()=>record("pageshow"));
 window.addEventListener("error",e=>{
  if(e.target&&e.target!==window&&e.target.tagName==="SCRIPT")record("SCRIPT LOAD ERROR: "+(e.target.src||"").split("/").slice(-1)[0]);
  else if(e.message)record("JS ERROR: "+String(e.message).slice(0,160));
 },true);
 window.addEventListener("unhandledrejection",e=>record("PROMISE REJECTION: "+String(e.reason?.message||e.reason||"unknown").slice(0,160)));

 window.KhaemenesMathForensicAudit=Object.freeze({
  version:"1.0.0",
  snapshot,
  events:()=>traces.slice(),
  refresh:render
 });
})();