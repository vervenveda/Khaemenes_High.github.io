/* High School front hall — opt-in VNV chrome forensic probe.
   Enable only with ?chrome_audit=1. Inspects DOM geometry and UI changes.
   No cookies, local/session storage, learner registry, network calls or reporting.
*/
(()=>{"use strict";
  if(new URLSearchParams(location.search).get("chrome_audit")!=="1" || window.KhaemenesHighChromeAudit) return;
  const targets=[
    ["333 ticker","vnv333NetworkTicker"],
    ["Auto ticker","vnvTickerAutoPopulate"],
    ["VNV header","vnvHeaderAutoPopulate"],
    ["Branched menu","vnvEnrichedMenuOverlay"],
    ["Ecosystem toolbar","vnvEcosystemUtilityDock"],
    ["Language rail","vnv-language-rail"]
  ];
  const events=[]; let panel=null,output=null,queued=false,closed=false;
  const time=()=>Math.round(performance.now())+"ms";
  const inspect=(name,id)=>{
    const found=[...document.querySelectorAll('[id="'+id+'"]')];
    if(!found.length)return name+": MISSING (count 0)";
    return found.map((el,i)=>{
      try{
        const s=getComputedStyle(el),r=el.getBoundingClientRect();
        const visible=el.isConnected&&s.display!=="none"&&s.visibility!=="hidden"&&Number(s.opacity)>0&&r.width>0&&r.height>0;
        return name+(found.length>1?" ["+(i+1)+"/"+found.length+"]":"")+
          ": "+(visible?"PRESENT":"HIDDEN")+" · "+Math.round(r.width)+"×"+Math.round(r.height)+
          " @ ("+Math.round(r.x)+","+Math.round(r.y)+")"+
          " · "+s.position+" · z="+s.zIndex+" · parent="+(el.parentElement?.tagName?.toLowerCase()||"?");
      }catch{return name+": CSS read failed"}
    }).join("\n");
  };
  function render(){
    if(closed||!document.body)return;
    if(!panel){
      panel=document.createElement("aside");panel.id="highSchoolChromeAuditPanel";
      panel.setAttribute("aria-label","High School VNV chrome forensic diagnostic");
      panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(720px,calc(100vw - 16px));max-height:48vh;overflow:auto;padding:13px 15px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;font:400 14px/1.45 ui-monospace,monospace!important;box-shadow:0 12px 40px #0009";
      const title=document.createElement("strong");
      title.textContent="High School · VNV Chrome Forensic Audit";
      title.style.cssText="display:block;color:#fff8e9!important;font-size:16px!important;margin-bottom:8px";
      const button=document.createElement("button");button.type="button";button.textContent="Close diagnostics";
      button.style.cssText="background:#fff8e9!important;color:#243038!important;border:0;border-radius:7px;padding:7px 11px;margin-bottom:8px;cursor:pointer";
      button.addEventListener("click",()=>{closed=true;observer.disconnect();panel.remove();panel=null;output=null});
      output=document.createElement("pre");output.style.cssText="font:inherit!important;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:#fff8e9!important;background:transparent!important";
      panel.append(title,button,output);document.body.append(panel);
    }
    const duplicates=[...document.querySelectorAll("header.site-header,header[data-khae-header],#vnvHeaderAutoPopulate")].map(x=>x.id||x.className||x.tagName);
    output.textContent="Current DOM (no student data):\n"+targets.map(([n,id])=>inspect(n,id)).join("\n")+
      "\n\nPotential header elements: "+(duplicates.join(", ")||"none")+
      "\n\nEvent timeline:\n"+events.slice(-16).join("\n");
  }
  function note(s){events.push(time()+" "+s);if(events.length>40)events.shift();if(!queued&&!closed){queued=true;requestAnimationFrame(()=>{queued=false;render()})}}
  const observer=new MutationObserver(records=>{
    const changes=[];
    for(const record of records){
      for(const node of [...record.addedNodes,...record.removedNodes]){
        if(node.nodeType!==1||node.id==="highSchoolChromeAuditPanel")continue;
        for(const [label,id] of targets){
          if(node.id===id||node.querySelector?.('[id="'+id+'"]'))changes.push((record.addedNodes.length?"ADDED ":"REMOVED ")+label);
        }
      }
    }
    if(changes.length)note([...new Set(changes)].join("; "));
  });
  function begin(){
    observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["style","hidden","class","aria-hidden"]});
    note("Probe started");
  }
  if(document.body)begin();else document.addEventListener("DOMContentLoaded",begin,{once:true});
  document.addEventListener("DOMContentLoaded",()=>note("DOMContentLoaded"),{once:true});
  window.addEventListener("load",()=>note("window load"),{once:true});
  window.addEventListener("pageshow",()=>note("pageshow"));
  window.addEventListener("error",e=>{
    if(e.target&&e.target!==window&&e.target.tagName==="SCRIPT")note("SCRIPT LOAD ERROR: "+(e.target.src||"").split("/").pop().split("?")[0]);
    else if(e.message)note("JS ERROR: "+String(e.message).slice(0,140));
  },true);
  window.addEventListener("unhandledrejection",e=>note("PROMISE REJECTION: "+String(e.reason?.message||"unknown").slice(0,130)));
  window.KhaemenesHighChromeAudit=Object.freeze({version:"1.0.0",snapshot:()=>targets.map(([n,id])=>inspect(n,id)),events:()=>events.slice()});
})();