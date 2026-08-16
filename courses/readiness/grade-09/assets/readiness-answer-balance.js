(() => {
  "use strict";

  function shiftFor(name){
    let hash=0;
    for(const ch of String(name||"")) hash=(hash*31+ch.charCodeAt(0))>>>0;
    return hash%4;
  }

  function balanceChoices(){
    document.querySelectorAll("fieldset.question .choices").forEach(box=>{
      if(box.dataset.forensicBalanced==="true")return;
      const labels=[...box.querySelectorAll(":scope > label.choice")];
      if(labels.length!==4)return;
      const name=labels[0].querySelector("input[type=radio]")?.name||"";
      const shift=shiftFor(name);
      if(shift){
        const ordered=labels.map((_,i)=>labels[(i-shift+4)%4]);
        box.replaceChildren(...ordered);
      }
      box.dataset.forensicBalanced="true";
    });
  }

  const observer=new MutationObserver(()=>queueMicrotask(balanceChoices));
  observer.observe(document.documentElement,{subtree:true,childList:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",balanceChoices,{once:true});
  else balanceChoices();
})();