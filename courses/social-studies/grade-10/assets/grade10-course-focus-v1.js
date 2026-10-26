/* Grade 10 optional course drawer. Never modifies grade or learner records. */
(()=>{
"use strict";
const drawer=document.getElementById("ss10CourseDrawer");
const opener=document.getElementById("ss10OpenDrawer");
const closer=document.getElementById("ss10CloseDrawer");
if(!drawer||!opener||!closer)return;
let prior=null;
const veil=document.createElement("div");
veil.id="ss10DrawerBackdrop";veil.hidden=true;
document.body.appendChild(veil);
function setOpen(open){
  if(open){
    prior=document.activeElement;
    drawer.removeAttribute("inert");
    drawer.setAttribute("aria-hidden","false");
    drawer.dataset.open="true";
    document.body.classList.add("ss10-drawer-open");
    opener.setAttribute("aria-expanded","true");
    veil.hidden=false;
    closer.focus();
  }else{
    drawer.dataset.open="false";
    drawer.setAttribute("aria-hidden","true");
    document.body.classList.remove("ss10-drawer-open");
    opener.setAttribute("aria-expanded","false");
    veil.hidden=true;
    if(prior?.isConnected)prior.focus();
    drawer.setAttribute("inert","");
    prior=null;
  }
}
opener.addEventListener("click",()=>setOpen(true));
closer.addEventListener("click",()=>setOpen(false));
veil.addEventListener("click",()=>setOpen(false));
drawer.addEventListener("click",e=>{
  if(e.target.closest(".navBtn,.weekBtn"))setOpen(false);
});
document.addEventListener("keydown",e=>{
  if(drawer.dataset.open!=="true")return;
  if(e.key==="Escape"){e.preventDefault();setOpen(false);return}
  if(e.key!=="Tab")return;
  const links=[...drawer.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled])')].filter(el=>el.getClientRects().length>0);
  if(!links.length)return;
  const first=links[0],last=links[links.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
})();
