(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;
  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument;if(!doc)return;
    const script=doc.createElement("script");
    script.src="assets/english9-transfer-runtime.js";
    script.async=false;
    doc.body.appendChild(script);
  });
})();