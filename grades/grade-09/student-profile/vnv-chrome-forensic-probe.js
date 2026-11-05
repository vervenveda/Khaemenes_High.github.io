/* Grade 09 forensic VNV chrome probe.
 * Opt-in only: append ?chrome_audit=1 to page URL.
 * Observes canonical chrome presence, visibility, placement and removal.
 * No cookies, registry reads, storage writes, or external reporting.
 */
(()=>{"use strict";
const params=new URLSearchParams(location.search);
if(!params.has("chrome_audit")||window.KhaemenesGrade09ChromeAudit)return;
const targets=[["333 ticker","vnv333NetworkTicker"],["Auto ticker","vnvTickerAutoPopulate"],["VNV header","vnvHeaderAutoPopulate"],["Branched menu","vnvEnrichedMenuOverlay"]];
const traces=[];let shown=false,queued=false;
const when=()=>Math.round(performance.now())+"ms";
const summary=(name,id)=>{
 const el=document.getElementById(id);
 if(!el)return name+": MISSING";
 let css,rect;
 try{css=getComputedStyle(el);rect=el.getBoundingClientRect()}catch{return name+": CSS read failed"}
 const found=el.isConnected;
 const visible=found&&css.display!=="none"&&css.visibility!=="hidden"&&Number(css.opacity)>0&&rect.height>0&&rect.width>0;
 const x=Math.round(rect.x),y=Math.round(rect.y),w=Math.round(rect.width),h=Math.round(rect.height);
 const parent=el.parentElement?.tagName?.toLowerCase()||"?";
 return name+": "+(visible?"PRESENT":"HIDDEN")+
  " · "+w+"×"+h+" at ("+x+","+y+")"+
  " · display "+css.display+" · visibility "+css.visibility+" · opacity "+css.opacity+
  " · parent "+parent;
};
let panel,output;
function display(){
 if(!panel){
  panel=document.createElement("aside");panel.id="grade09ChromeAuditPanel";
  panel.setAttribute("aria-label","Grade 09 VNV chrome forensic probe");
  panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(680px,calc(100vw - 16px));max-height:48vh;overflow:auto;padding:13px 15px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;font:400 14px/1.45 ui-monospace,monospace!important;box-shadow:0 12px 40px #0009";
  const title=document.createElement("strong");title.textContent="Grade 09 · Header/Ticker Forensic Audit";title.style.cssText="display:block;color:#fff8e9!important;font-size:16px!important;margin-bottom:8px";
  const close=document.createElement("button");close.type="button";close.textContent="Close diagnostics";close.style.cssText="background:#fff8e9!important;color:#243038!important;border:0;border-radius:7px;padding:6px 10px;margin-bottom:8px";
  close.addEventListener("click",()=>{panel.remove();panel=null;output=null;shown=false});
  output=document.createElement("pre");output.style.cssText="font:inherit!important;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:#fff8e9!important;background:transparent!important";
  panel.append(title,close,output);document.body.append(panel);shown=true;
 }
 output.textContent="Current (no student data):\n"+targets.map(([name,id])=>summary(name,id)).join("\n")+"\n\nEvent timeline:\n"+traces.slice(-16).join("\n");
}
function record(note){
 traces.push(when()+" "+note);
 if(traces.length>40)traces.shift();
 if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;if(document.body)display()})}
}
const obs=new MutationObserver(records=>{
 let changes=[];
 for(const r of records){
  for(const n of [...r.addedNodes,...r.removedNodes]){
   if(n.nodeType!==1)continue;
   for(const [name,id] of targets)if(n.id===id||n.querySelector?.("#"+id))changes.push((r.addedNodes.length?"ADDED ":"REMOVED ")+name);
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
window.addEventListener("error",e=>{if(e.target&&e.target!==window&&e.target.tagName==="SCRIPT")record("SCRIPT LOAD ERROR: "+(e.target.src||"").split("/").slice(-1)[0]);else if(e.message)record("JS ERROR: "+String(e.message).slice(0,140))},true);
window.addEventListener("unhandledrejection",e=>record("PROMISE REJECTION: "+String(e.reason?.message||"unknown").slice(0,130)));
window.KhaemenesGrade09ChromeAudit=Object.freeze({version:"1.0.0",snapshot:()=>targets.map(([name,id])=>summary(name,id)),events:()=>traces.slice()});
})();