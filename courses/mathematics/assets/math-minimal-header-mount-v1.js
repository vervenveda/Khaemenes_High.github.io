/* Khaemenes Academy Mathematics · minimal official header mount v1.0.0
   One responsibility only: mount the official VNV header with no shortcut actions.
   No tickers, toolbars, learner records, navigation rewriting, observers, or persistence. */
(()=>{"use strict";
if(window.__KHAE_MATH_MINIMAL_HEADER_MOUNT_V1__)return;
window.__KHAE_MATH_MINIMAL_HEADER_MOUNT_V1__=true;

function mount(){
  if(document.getElementById("vnvHeaderAutoPopulate"))return;
  if(!window.VNV_HEADER?.mount)return;
  window.VNV_HEADER.mount({
    replaceLegacy:false,
    title:"Khaemenes Academy",
    subtitle:"High School · Mathematics",
    icon:"K",
    home:"https://vervenveda.com/KhaemenesAcademy_Home.github.io/",
    actions:[]
  });
}
function start(){
  if(window.VNV_HEADER?.mount){mount();return}
  const headerScript=[...document.scripts].find(s=>/vnv-header-autopopulate\.js(?:$|[?#])/.test(s.src||""));
  headerScript?.addEventListener("load",mount,{once:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();