(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;
  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument;if(!doc)return;
    const script=doc.createElement("script");
    script.src="assets/science9-forensic-runtime.js";
    script.defer=false;
    doc.body.appendChild(script);
  });
})();