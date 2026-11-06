/* High School VNV chrome forensic probe (Grades 11–12).
 * Opt-in only: ?chrome_audit=1. Runs before canonical chrome scripts.
 * No cookies, registry reads, storage writes, external reporting or repairs.
 * Derived from the Grade 09 read-only diagnostic supplied by the founder.
 */
(()=>{"use strict";
const params=new URLSearchParams(location.search);
const grade=String(document.body?.dataset.grade||"");
if(params.get("chrome_audit")!=="1"||!["11","12"].includes(grade)||window.KhaemenesHighChromeAudit)return;
const targets=[
 ["333 ticker","vnv333NetworkTicker"],
 ["Auto ticker","vnvTickerAutoPopulate"],
 ["VNV header","vnvHeaderAutoPopulate"],
 ["Branched menu","vnvEnrichedMenuOverlay"]
];
const traces=[];let panel=null,output=null,queued=false,closed=false;
const when=()=>Math.round(performance.now())+"ms";
function summary(name,id){
 const matches=document.querySelectorAll('[id="'+id+'"]');
 const el=matches[0];
 if(!el)return name+": MISSING";
 let css,rect;
 try{css=getComputedStyle(el);rect=el.getBoundingClientRect()}
 catch{return name+": CSS read failed";}
 const visible=el.isConnected&&css.display!=="none"&&css.visibility!=="hidden"&&Number(css.opacity)>0&&rect.width>0&&rect.height>0;
 let hiddenAncestor=null;
 for(let p=el.parentElement;p&&p!==document.documentElement;p=p.parentElement){
  const st=getComputedStyle(p);
  if(p.hidden||st.display==="none"||st.visibility==="hidden"||Number(st.opacity)===0){hiddenAncestor=p.tagName.toLowerCase()+(p.id?"#"+p.id:"");break;}
 }
 return name+": "+(visible&&!hiddenAncestor?"PRESENT":"HIDDEN")+
 " · "+Math.round(rect.width)+"×"+Math.round(rect.height)+
 " at ("+Math.round(rect.x)+","+Math.round(rect.y)+")"+
 " · position "+css.position+" · z "+css.zIndex+
 " · display "+css.display+" · visibility "+css.visibility+
 " · opacity "+css.opacity+
 " · parent "+(el.parentElement?.tagName?.toLowerCase()||"?")+
 (hiddenAncestor?" · hidden ancestor "+hiddenAncestor:"")+
 (matches.length>1?" · DUPLICATE IDs "+matches.length:"");
}
function display(){
 if(closed||!document.body)return;
 if(!panel){
  panel=document.createElement("aside");
  panel.id="highChromeAuditPanel";
  panel.setAttribute("aria-label","Grade "+grade+" VNV chrome forensic probe");
  panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(680px,calc(100vw - 16px));max-height:48vh;overflow:auto;padding:13px 15px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;font:400 14px/1.45 ui-monospace,monospace!important;box-shadow:0 12px 40px #0009";
  const title=document.createElement("strong");
  title.textContent="Grade "+grade+" · Header/Ticker Forensic Audit";
  title.style.cssText="display:block;color:#fff8e9!important;font-size:16px!important;margin-bottom:8px";
  const close=document.createElement("button");
  close.type="button";close.textContent="Close diagnostics";
  close.style.cssText="background:#fff8e9!important;color:#243038!important;border:0;border-radius:7px;padding:6px 10px;margin-bottom:8px";
  close.addEventListener("click",()=>{closed=true;panel?.remove();panel=null;output=null;});
  const copy=document.createElement("button");
  copy.type="button";copy.textContent="Copy diagnostic text";
  copy.style.cssText="background:#fff8e9!important;color:#243038!important;border:0;border-radius:7px;padding:6px 10px;margin:0 0 8px 8px";
  copy.addEventListener("click",()=>{
   if(output&&navigator.clipboard?.writeText)navigator.clipboard.writeText(output.textContent).catch(()=>{});
  });
  output=document.createElement("pre");
  output.style.cssText="font:inherit!important;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:#fff8e9!important;background:transparent!important";
  panel.append(title,close,copy,output);document.body.append(panel);
 }
 output.textContent="Current (no student data):\n"+targets.map(([name,id])=>summary(name,id)).join("\n")+
 "\n\nPage chrome sequence:\n"+[...document.body.children].filter(n=>targets.some(([,id])=>n.id===id)||n.classList?.contains("grade09-local-masthead")).map(n=>n.id||"charcoal hero").join(" → ")+
 "\n\nEvent timeline:\n"+traces.slice(-24).join("\n");
}
function record(note){
 traces.push(when()+" "+note);
 if(traces.length>80)traces.shift();
 if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;display()});}
}
function describeMutation(r,n,action){
 if(n.nodeType!==1)return;
 for(const [name,id] of targets){
  if(n.id===id||n.querySelector?.("#"+id))record(action+" "+name);
 }
}
const obs=new MutationObserver(records=>{
 for(const r of records){
  if(r.type==="childList"){
   for(const n of r.addedNodes)describeMutation(r,n,"ADDED");
   for(const n of r.removedNodes)describeMutation(r,n,"REMOVED");
  }else if(r.type==="attributes"&&targets.some(([,id])=>r.target.id===id)){
   record("ATTRIBUTE "+r.attributeName+" "+r.target.id);
  }
 }
});
function begin(){
 if(!document.body)return;
 obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["style","hidden","class","aria-hidden"]});
 record("Probe started");
}
begin();
document.addEventListener("DOMContentLoaded",()=>{if(!obs.takeRecords().length){}record("DOMContentLoaded")},{once:true});
window.addEventListener("load",()=>record("window load"),{once:true});
window.addEventListener("pageshow",()=>record("pageshow"));
window.addEventListener("error",e=>{
 if(e.target&&e.target!==window&&e.target.tagName==="SCRIPT")
  record("SCRIPT LOAD ERROR: "+(e.target.src||"").split("/").slice(-1)[0]);
 else if(e.message)record("JS ERROR: "+String(e.message).slice(0,180));
},true);
window.addEventListener("unhandledrejection",e=>record("PROMISE REJECTION: "+String(e.reason?.message||"unknown").slice(0,160)));
window.KhaemenesHighChromeAudit=Object.freeze({version:"1.0.0",snapshot:()=>targets.map(([name,id])=>summary(name,id)),events:()=>traces.slice()});
})();
