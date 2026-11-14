/* Pre-Algebra Assessments forensic CSS/UI diagnostic. Opt-in ?chrome_audit=1.
   Read-only: no learner data, input values, cookies, storage, or network reporting. */
(()=>{"use strict";
if(new URLSearchParams(location.search).get("chrome_audit")!=="1"||window.KhaemenesPreAlgebraAssessmentAudit)return;
const VERSION="1.0.0",PANEL_ID="prealgebraCssAuditPanel",MAX=5000;
const events=[],errors=[];
const watch=[["333 ticker","#vnv333NetworkTicker"],["Auto ticker","#vnvTickerAutoPopulate"],["VNV header","#vnvHeaderAutoPopulate"],["Legacy header","header.site-header"],["Enriched menu","#vnvEnrichedMenuOverlay"],["Translator rail","#vnv-language-rail"],["Floating toolbar","#vnvEcosystemUtilityDock"],["Footer","footer.footer"],["Assessment cards","#assessment-destinations .landing-card"],["Pathway","#evidence-pathway"],["Checklist","#completion-checklist"],["Record standards","#record-standards"]];
function stamp(){return Math.round(performance.now())+"ms"}
function safeName(el){const name=el.tagName.toLowerCase();return (name+(el.id?"#"+el.id:"")+[...el.classList].slice(0,2).map(x=>"."+x).join("")).slice(0,160)}
function rect(el){const r=el.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)}}
function allowed(el){return !el.closest("#"+PANEL_ID)&&!el.matches("svg,svg *,script,style,noscript,template,option")}
function inspect(el){
 const c=getComputedStyle(el);
 return {selector:safeName(el),rect:rect(el),display:c.display,visibility:c.visibility,opacity:c.opacity,
 position:c.position,zIndex:c.zIndex,fontSize:c.fontSize,fontFamily:c.fontFamily,
 fontWeight:c.fontWeight,lineHeight:c.lineHeight,color:c.color,background:c.backgroundColor,
 borderColor:c.borderTopColor,padding:c.padding,margin:c.margin,width:c.width,height:c.height,
 overflow:c.overflow,gridColumns:c.gridTemplateColumns,gap:c.gap,textAlign:c.textAlign};
}
function cssInventory(){
 const sheets=[],rules=[];
 function walk(collection,source,depth){
  if(depth>4)return;
  for(const rule of collection){
   if(rules.length>=6500)return;
   if(rule.type===1){
    const props=[];
    for(let i=0;i<rule.style.length&&i<100;i++){const key=rule.style[i];props.push({key,value:rule.style.getPropertyValue(key),priority:rule.style.getPropertyPriority(key)})}
    rules.push({source,selector:rule.selectorText,properties:props});
   }else if(rule.cssRules)walk(rule.cssRules,source,depth+1);
  }
 }
 for(const sheet of document.styleSheets){
  const source=sheet.ownerNode?.id||sheet.ownerNode?.getAttribute?.("href")?.split("?")[0]||"inline";
  try{sheets.push({source,accessible:true,count:sheet.cssRules.length});walk(sheet.cssRules,source,0)}
  catch{sheets.push({source,accessible:false,reason:"Cross-origin CSS browser restriction"})}
 }
 return {sheets,rules,truncated:rules.length>=6500};
}
function snapshot(){
 const nodes=[...document.body.querySelectorAll("*")].filter(allowed).slice(0,MAX),all=[],small=[],clipped=[],overflow=[];
 for(const el of nodes){
  const c=getComputedStyle(el),r=el.getBoundingClientRect();
  if(c.display==="none"||c.visibility==="hidden"||Number(c.opacity)===0||r.width===0||r.height===0)continue;
  if(el.matches("h1,h2,h3,h4,p,small,span,a,button,li,label,dt,dd,input,select,textarea,header,footer,nav,section,article,.card,.panel"))all.push(inspect(el));
  const n=parseFloat(c.fontSize);
  if(n<16&&el.matches("h1,h2,h3,h4,p,small,span,a,button,li,label,dt,dd,input,select,textarea"))small.push({element:safeName(el),fontSize:c.fontSize,rect:rect(el)});
  if(el.scrollWidth>el.clientWidth+5&&c.overflowX==="hidden")clipped.push({element:safeName(el),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth});
  if(r.right>innerWidth+8&&r.left<innerWidth&&c.position!=="fixed")overflow.push({element:safeName(el),right:Math.round(r.right)});
 }
 const ids=new Map();for(const el of document.querySelectorAll("[id]"))if(allowed(el))ids.set(el.id,(ids.get(el.id)||0)+1);
 const chrome=watch.map(pair=>{const els=[...document.querySelectorAll(pair[1])].filter(allowed);return {name:pair[0],selector:pair[1],count:els.length,elements:els.slice(0,5).map(inspect)}});
 const a=document.getElementById("vnvEcosystemUtilityDock"),b=document.querySelector("footer.footer");
 const overlap=a&&b?(()=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return x.left<y.right&&x.right>y.left&&x.top<y.bottom&&x.bottom>y.top})():false;
 return {version:VERSION,page:location.origin+location.pathname,generatedAt:new Date().toISOString(),
 viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},sampled:nodes.length,
 chrome,below16:{count:small.length,elements:small},clipped,overflow,computedElements:all,
 duplicateIds:[...ids].filter(v=>v[1]>1),toolbarOverlapsFooter:overlap,
 css:cssInventory(),events:events.slice(),errors:errors.slice()};
}
let panel,out;
function startPanel(){
 if(panel?.isConnected)return;
 panel=document.createElement("aside");panel.id=PANEL_ID;panel.setAttribute("aria-label","Assessments CSS and UI diagnostics");
 panel.style.cssText="all:initial;position:fixed!important;left:8px;bottom:8px;z-index:2147483647!important;width:min(710px,calc(100vw - 16px));max-height:75vh;overflow:auto;padding:14px;box-sizing:border-box;background:#202724!important;color:#fff8e9!important;border:2px solid #b48b45;border-radius:7px;box-shadow:0 15px 45px #0008;font:400 16px/1.5 Nunito,Arial,sans-serif";
 const h=document.createElement("h2");h.textContent="Pre-Algebra · CSS & UI Diagnostics";h.style.cssText="font:400 22px/1.3 Cinzel,Georgia,serif!important;color:#fff8e9!important;margin:0 0 10px";
 const actions=document.createElement("div");actions.style.cssText="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px";
 function button(label,fn){const el=document.createElement("button");el.type="button";el.textContent=label;el.style.cssText="font:400 16px/1.2 Nunito,Arial,sans-serif!important;min-height:44px;padding:8px 12px;border-radius:7px;border:1px solid #b48b45;background:#fff8e9;color:#202724;cursor:pointer";el.addEventListener("click",fn);actions.append(el)}
 button("Refresh",render);
 button("Export CSS + UI JSON",()=>{
  const blob=new Blob([JSON.stringify(snapshot(),null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="prealgebra-assessments-css-ui-audit.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
 });
 button("Close",()=>{panel.remove();panel=null});
 out=document.createElement("pre");out.style.cssText="white-space:pre-wrap;overflow-wrap:anywhere;margin:0;background:transparent!important;color:#fff8e9!important;font:400 16px/1.55 ui-monospace,monospace!important";
 panel.append(h,actions,out);document.body.append(panel);
}
function render(){
 startPanel();let x;try{x=snapshot()}catch(e){out.textContent="Diagnostic error: "+String(e);return}
 const statuses=x.chrome.map(v=>{const expectedOff=v.count===0&&(v.name==="Legacy header"||v.name==="Floating toolbar");const note=v.count?"":expectedOff?(v.name==="Floating toolbar"?" — INTENTIONALLY SUPPRESSED on assessment routes":" — EXPECTED after canonical replacement"):" — MISSING";return v.name+": "+v.count+" instance(s)"+note});
 out.textContent=["Read-only opt-in · no learner data","Viewport: "+x.viewport.width+" × "+x.viewport.height,
 "Computed UI elements: "+x.computedElements.length,
 "CSS stylesheets: "+x.css.sheets.length+" · accessible rules: "+x.css.rules.length,
 "Text elements below 16px: "+x.below16.count,"Duplicate IDs: "+x.duplicateIds.length,
 "Clipped: "+x.clipped.length,"Horizontal overflow suspects: "+x.overflow.length,
 "Toolbar over footer: "+x.toolbarOverlapsFooter,"",...statuses,"",
 "Below 16px (first 20):",...x.below16.elements.slice(0,20).map(v=>v.element+" · "+v.fontSize),
 "","Observed errors: "+errors.length,"","Export JSON for every collected computed style and CSS selector."].join("\n");
}
window.addEventListener("error",e=>{errors.push({time:stamp(),message:e.target&&e.target!==window?"Resource load error":String(e.message||"Error").slice(0,130)});if(errors.length>30)errors.shift()},true);
window.addEventListener("unhandledrejection",e=>{errors.push({time:stamp(),message:String(e.reason?.message||"Promise rejection").slice(0,130)});if(errors.length>30)errors.shift()});
window.addEventListener("pageshow",()=>events.push({time:stamp(),event:"pageshow"}));
function boot(){events.push({time:stamp(),event:"opt-in diagnostic loaded"});render()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
window.KhaemenesPreAlgebraAssessmentAudit=Object.freeze({version:VERSION,snapshot,events:()=>events.slice(),refresh:render});
})();