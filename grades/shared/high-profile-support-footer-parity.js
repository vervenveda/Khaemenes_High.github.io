/* Grade 09-approved Support Free Access and footer presentation, Grades 10–12.
 * Adjusts CSS classes and presentation style only. Does not change donation
 * destinations, learner identity, grades, enrollment, or academic storage.
 */
(()=>{"use strict";
const grade=document.body?.dataset.grade;
if(!["10","11","12"].includes(grade)||window.KhaemenesHighSupportFooterParity)return;
const dark="#243038",ink="#fff8e9",subtle="#eadcc5",cream="#fffaf2",cardInk="#243038",cardSubtle="#45554c";
const set=(node,key,value)=>{
 if(node&&node.style.getPropertyValue(key)!==value)
  node.style.setProperty(key,value,"important");
};
function footer(){
 const node=document.querySelector("footer.grade09-dashboard-footer");
 if(!node)return false;
 set(node,"background",dark);
 set(node,"background-image","none");
 set(node,"color",ink);
 set(node,"border-top","1px solid #b48b45");
 set(node,"text-align","center");
 for(const child of node.querySelectorAll("div,span,p,a,strong,small")){
  const color=child.matches("small")?subtle:ink;
  set(child,"color",color);
  set(child,"-webkit-text-fill-color",color);
 }
 return true;
}
function support(){
 const headings=[...document.querySelectorAll("h2,h3,h4,div,span,p")]
  .filter(n=>n.children.length===0&&/^support free access$/i.test((n.textContent||"").trim()));
 for(const heading of headings){
  const eligible=[];
  for(let n=heading.parentElement;n&&n!==document.body;n=n.parentElement){
   const copy=n.textContent||"";
   if(!/everything here is free/i.test(copy)||!/voluntary/i.test(copy))continue;
   const hasAction=[...n.querySelectorAll("a,button")]
    .some(a=>/support with stripe|stripe/i.test((a.textContent||"")+" "+(a.getAttribute("href")||"")));
   if(!hasAction)continue;
   const rect=n.getBoundingClientRect();
   if(rect.width>=280&&rect.width<=950&&rect.height<850)eligible.push(n);
  }
  if(!eligible.length)continue;
  const panel=eligible[eligible.length-1];
  panel.classList.add("grade09-contribute-panel");
  set(panel,"background",cream);
  set(panel,"background-image","none");
  set(panel,"color",cardInk);
  set(panel,"border","2px solid #b48b45");
  set(panel,"text-align","center");
  for(const node of panel.querySelectorAll("h2,h3,h4,p,small,div,span")){
   if(node.closest("a,button"))continue;
   const color=node.matches("small")?cardSubtle:cardInk;
   set(node,"color",color);
   set(node,"-webkit-text-fill-color",color);
   if(node===heading||/^support free access$/i.test((node.textContent||"").trim())){
    set(node,"text-align","center");set(node,"display","block");
    set(node,"width","100%");set(node,"margin-left","auto");
    set(node,"margin-right","auto");set(node,"transform","none");
   }
  }
  for(const action of panel.querySelectorAll("a,button")){
   if(!/support with stripe|stripe/i.test((action.textContent||"")+" "+(action.getAttribute("href")||"")))continue;
   action.classList.add("grade09-contribute-action");
   set(action,"background",dark);set(action,"background-image","none");
   set(action,"color",ink);set(action,"-webkit-text-fill-color",ink);
   for(const child of action.querySelectorAll("span,strong")){
    set(child,"color",ink);set(child,"-webkit-text-fill-color",ink);
   }
  }
  return true;
 }
 return false;
}
let observer=null;
function run(){
 footer();
 if(support()&&observer){observer.disconnect();observer=null;}
}
run();
if(!support()){
 observer=new MutationObserver(()=>run());
 observer.observe(document.body,{subtree:true,childList:true});
}
window.addEventListener("pageshow",run);
window.KhaemenesHighSupportFooterParity=Object.freeze({version:"1.0.0",refresh:run});
})();
