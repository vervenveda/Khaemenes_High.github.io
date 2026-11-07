/* Grade 11 read-only UI diagnostic. Opt in with ?ui_audit=1.
 * Reports element counts and computed presentation only; never student data.
 */
(()=>{"use strict";
if(document.body?.dataset.grade!=="11"||new URLSearchParams(location.search).get("ui_audit")!=="1")return;
if(window.KhaemenesGrade11UIAudit)return;
const ids=["vnv333NetworkTicker","vnvTickerAutoPopulate","vnvHeaderAutoPopulate","vnvEnrichedMenuOverlay","grade11JuniorPlanning","upperGradeScheduleDialog"];
function audit(){
 const results=[];
 for(const id of ids){
  const items=document.querySelectorAll('[id="'+id+'"]');
  results.push(id+": "+items.length+(items.length>1?" [DUPLICATE]":""));
 }
 const actionable=[...document.querySelectorAll('main button,main a,main input,main select,main textarea')]
  .filter(el=>!el.closest('[hidden],[aria-hidden="true"]'));
 const tooSmall=[];const faint=[];const noName=[];
 const luminance=c=>{const rgb=c.match(/[\d.]+/g);if(!rgb||rgb.length<3)return null;const x=rgb.slice(0,3).map(v=>Number(v)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*x[0]+.7152*x[1]+.0722*x[2]};
 actionable.forEach(el=>{
  const css=getComputedStyle(el),r=el.getBoundingClientRect();
  if(!r.width||!r.height||css.display==="none"||css.visibility==="hidden")return;
  const description=(el.id||el.className?.toString()||el.tagName).slice(0,55);
  if(parseFloat(css.fontSize)<16)tooSmall.push(description);
  if(css.opacity!=="1"&&Number(css.opacity)<.5)faint.push(description);
  if((el.matches('button,a')&&!el.textContent.trim()&&!el.getAttribute("aria-label")&&!el.querySelector("img[alt]")))noName.push(description);
 });
 const overflow=document.documentElement.scrollWidth>innerWidth+3;
 const save=document.querySelector("#grade11JuniorPlanning .khae-junior-save");
 if(save){
  const cs=getComputedStyle(save),bg=luminance(cs.backgroundColor),fg=luminance(cs.color);
  if(bg!==null&&fg!==null){const contrast=(Math.max(bg,fg)+.05)/(Math.min(bg,fg)+.05);
   results.push("Planner Save button contrast (direct colors): "+contrast.toFixed(2)+":1");
  }
 }
 results.push("Visible controls below 16px: "+tooSmall.length+" ["+tooSmall.slice(0,8).join(", ")+"]");
 results.push("Low-opacity controls: "+faint.length+" ["+faint.slice(0,8).join(", ")+"]");
 results.push("Potential nameless buttons/links: "+noName.length+" ["+noName.slice(0,8).join(", ")+"]");
 results.push("Horizontal document overflow: "+(overflow?"YES":"NO"));
 return results;
}
function display(){
 if(document.getElementById("grade11UIAuditPanel"))return;
 const box=document.createElement("aside");box.id="grade11UIAuditPanel";
 box.setAttribute("aria-label","Grade 11 read-only UI diagnostics");
 box.style.cssText="position:fixed;z-index:2147483646;right:10px;bottom:10px;width:min(620px,calc(100vw - 20px));max-height:45vh;overflow:auto;padding:15px;border:2px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9;font:400 16px/1.45 monospace";
 const heading=document.createElement("p");heading.textContent="Grade 11 · Read-only UI Audit";
 heading.style.cssText="color:#fff8e9;margin:0 0 8px";
 const result=document.createElement("pre");result.style.cssText="white-space:pre-wrap;overflow-wrap:anywhere;color:#fff8e9;background:transparent;font:inherit";
 const refresh=document.createElement("button");refresh.textContent="Rescan";refresh.type="button";
 const close=document.createElement("button");close.textContent="Close";close.type="button";
 for(const b of [refresh,close])b.style.cssText="margin:6px 8px 6px 0;padding:8px 12px;border:1px solid #fff8e9;border-radius:7px;background:#fff8e9;color:#243038;font:400 16px Nunito,Arial,sans-serif";
 refresh.addEventListener("click",()=>{result.textContent=audit().join("\n")});
 close.addEventListener("click",()=>box.remove());
 box.append(heading,refresh,close,result);document.body.append(box);
 result.textContent=audit().join("\n");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",display,{once:true});else display();
window.KhaemenesGrade11UIAudit=Object.freeze({audit,version:"1.0.0"});
})();