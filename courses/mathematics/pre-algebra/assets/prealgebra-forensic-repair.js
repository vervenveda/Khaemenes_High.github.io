(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;
  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument;if(!doc)return;
    window.setTimeout(()=>{
      const script=doc.createElement("script");
      script.src="assets/prealgebra-forensic-repair-runtime.js";
      script.defer=false;
      doc.body.appendChild(script);
    },150);
  });
})();