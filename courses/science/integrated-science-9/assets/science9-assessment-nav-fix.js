(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;
  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument;if(!doc)return;
    function clearAssessmentNavLock(){
      doc.querySelectorAll('button[data-view="assessments"],.navBtn[data-view="assessments"],.tab[data-view="assessments"]').forEach(el=>{
        el.removeAttribute("data-mastery-locked");
        el.removeAttribute("aria-disabled");
        el.removeAttribute("title");
        el.style.opacity="";
      });
    }
    const observer=new MutationObserver(()=>queueMicrotask(clearAssessmentNavLock));
    observer.observe(doc.documentElement,{subtree:true,childList:true});
    clearAssessmentNavLock();
  });
})();