/* High School Profile Tools shared presentation contract.
 * Owns labels/order/visual treatment only; grade-specific scripts own actions,
 * access decisions, profile data, and dialog implementations.
 */
(function attachHighProfileToolSpec(global){
 "use strict";
 if(global.KhaemenesHighProfileToolSpec)return;
 const entries=Object.freeze([
  Object.freeze({id:"edit-profile",label:"Edit Profile"}),
  Object.freeze({id:"class-progress",label:"Class Progress"}),
  Object.freeze({id:"schedule",label:"Schedule"}),
  Object.freeze({id:"klasaipeer",label:"KlasaiPeer"}),
  Object.freeze({id:"yearbook",label:"Yearbook"}),
  Object.freeze({id:"creative-tools",label:"Creative Tools"}),
  Object.freeze({id:"student-portfolio",label:"Student Portfolio"}),
  Object.freeze({id:"customize-background",label:"Customize Background"})
 ]);
 const byId=new Map(entries.map((v,i)=>[v.id,Object.freeze({...v,position:i+1})]));
 function ordered(actions){
  if(!Array.isArray(actions))throw new TypeError("tool-actions-required");
  const seen=new Set();
  for(const action of actions){
   if(!byId.has(action?.id)||seen.has(action.id))throw new Error("invalid-or-duplicate-tool");
   seen.add(action.id);
  }
  return actions.slice().sort((a,b)=>byId.get(a.id).position-byId.get(b.id).position);
 }
 function label(id){return byId.get(id)?.label||null}
 function decorate(element,id){
  const rule=byId.get(id);
  if(!element||!rule)throw new Error("unknown-profile-tool");
  element.dataset.profileToolId=id;
  element.style.setProperty("order",String(rule.position));
  return element;
 }
 // Styling intentionally scoped to profile-tool rails; does not alter the
 // global header, course cards, popups, or learner-owned appearance settings.
 function installStyles(doc=global.document){
  if(!doc||doc.getElementById("khaeHighProfileToolsParityStyle"))return;
  const sheet=doc.createElement("style");sheet.id="khaeHighProfileToolsParityStyle";
  sheet.textContent=`
   #khaeProfileToolRail > div,
   #khaeProfileToolRail .grade09-blueprint-tool-grid {
    display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;
    gap:11px!important;align-items:stretch;
   }
   #khaeProfileToolRail :is(.grade09-profile-tool,.grade09-blueprint-tool,#openGrade09BackgroundDialog,[data-background-return]){
    box-sizing:border-box;min-width:0;min-height:56px;padding:11px 10px;
    display:flex;align-items:center;justify-content:center;
    font:400 16px/1.4 "Brandon Grotesque",Nunito,Arial,sans-serif!important;
    text-align:center;text-decoration:none;overflow-wrap:anywhere;
    border-radius:7px;border:1px solid #b48b45;
    background-color:#243038!important;background-image:none!important;
    color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important;
   }
   #khaeProfileToolRail :is(.grade09-profile-tool,.grade09-blueprint-tool,#openGrade09BackgroundDialog,[data-background-return]) :is(span){
    color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important;
   }
   #khaeProfileToolRail :is(button,a):focus-visible{outline:3px solid #d5b77b!important;outline-offset:3px}
   #khaeProfileToolRail :is(#openGrade09BackgroundDialog,[data-background-return]){order:8}
   @media(max-width:760px){
    #khaeProfileToolRail > div,#khaeProfileToolRail .grade09-blueprint-tool-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
   }
   @media(max-width:420px){
    #khaeProfileToolRail > div,#khaeProfileToolRail .grade09-blueprint-tool-grid{grid-template-columns:minmax(0,1fr)!important}
   }
  `;
  (doc.head||doc.documentElement)?.append(sheet);
 }
 global.KhaemenesHighProfileToolSpec=Object.freeze({version:"1.0.0",entries,ordered,label,decorate,installStyles});
 installStyles();
})(window);
