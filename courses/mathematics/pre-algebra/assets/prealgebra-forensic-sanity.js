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
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=b;b=a%b;a=t}return a}
function rotate(correct,wrongs,answerIndex){
  const correctText=String(correct),used=new Set([correctText]),safe=[];
  for(const w of wrongs){let s=String(w);if(used.has(s))s="Not enough information "+(safe.length+1);used.add(s);safe.push(s)}
  const base=[correctText,...safe.slice(0,3)];
  while(base.length<4)base.push("Not enough information "+base.length);
  const shift=((answerIndex%4)+4)%4;
  return {choices:base.map((_,i)=>base[(i-shift+4)%4]),answer:shift};
}
let duplicateChoiceRepairs=0,gcfRepairs=0;
for(const [key,bank] of Object.entries(APP.quizBank||{})){
  if(!String(key).startsWith("forensic_")||!Array.isArray(bank))continue;
  bank.forEach((raw,idx)=>{
    if(!Array.isArray(raw)||!Array.isArray(raw[1])||raw[1].length!==4)return;
    const match=String(raw[0]).match(/greatest common factor of (\d+) and (\d+)/i);
    if(match){
      const actual=gcd(Number(match[1]),Number(match[2])),r=rotate(actual,[actual+1,actual+2,Math.min(Number(match[1]),Number(match[2]))+1],raw[2]);
      raw[1]=r.choices;raw[2]=r.answer;raw[3]="The GCF is the greatest positive integer that divides both values exactly.";gcfRepairs++;
    }
    const choices=[...raw[1]],correctIndex=Number(raw[2]),correctText=String(choices[correctIndex]).trim(),used=new Set([correctText]);
    for(let i=0;i<choices.length;i++){
      if(i===correctIndex)continue;
      const text=String(choices[i]).trim();
      if(used.has(text)){
        let replacement=`Not enough information ${idx+i+1}`;
        while(used.has(replacement))replacement+="x";
        choices[i]=replacement;duplicateChoiceRepairs++;
      }
      used.add(String(choices[i]).trim());
    }
    raw[1]=choices;
  });
}
window.__KHAEMENES_PREALGEBRA_SANITY__={gcfRepairs,duplicateChoiceRepairs};
})();`;
      doc.body.appendChild(script);
    },165);
  });
})();