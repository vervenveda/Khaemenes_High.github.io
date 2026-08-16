(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;
  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument;if(!doc)return;
    window.setTimeout(()=>{
      const script=doc.createElement("script");
      script.textContent=`(()=>{
"use strict";
function rotateItem(item,shift){
  if(!item||!Array.isArray(item.choices)||item.choices.length!==4)return item;
  shift=((shift%4)+4)%4;
  if(!shift)return item;
  const old=[...item.choices];
  const next=old.map((_,i)=>old[(i-shift+4)%4]);
  return {...item,choices:next,answer:(item.answer+shift)%4};
}
function balance(items,salt){return (items||[]).map((item,i)=>rotateItem(item,(salt+i)%4));}
for(const w of APP.weeks){
  const key=w.quizKey;
  if(key&&APP.quizBank[key])APP.quizBank[key]=balance(APP.quizBank[key],w.week);
}
APP.midterm=balance(APP.midterm,1);
APP.final=balance(APP.final,2);
if(typeof render==="function")render();
})();`;
      doc.body.appendChild(script);
    },140);
  });
})();