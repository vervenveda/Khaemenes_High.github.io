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
function norm(v){return String(v??"").trim().replace(/\\s+/g," ").toLowerCase()}
function answerIndex(item){return Number(item?.answer)}
function choices(item){return Array.isArray(item?.choices)?item.choices:[]}
function prompt(item){return item?.q??item?.prompt??item?.title??""}
const weekly=[];
for(const w of APP.weeks||[]){
  const bank=APP.quizBank?.[w.quizKey]||[];
  bank.forEach((item,i)=>weekly.push({scope:"week",week:w.week,index:i,item}));
}
const mid=(APP.midterm||[]).map((item,i)=>({scope:"midterm",index:i,item}));
const fin=(APP.final||[]).map((item,i)=>({scope:"final",index:i,item}));
const all=[...weekly,...mid,...fin],issues=[],positions=[0,0,0,0],promptMap=new Map();
for(const row of all){
  const cs=choices(row.item),a=answerIndex(row.item),p=norm(prompt(row.item));
  if(cs.length!==4)issues.push({...row,type:"choice-count",count:cs.length});
  if(new Set(cs.map(norm)).size!==cs.length)issues.push({...row,type:"duplicate-visible-choice"});
  if(!Number.isInteger(a)||a<0||a>=cs.length)issues.push({...row,type:"invalid-answer-index",answer:a});
  else if(a<4)positions[a]++;
  if(p){const uses=promptMap.get(p)||[];uses.push({scope:row.scope,week:row.week,index:row.index});promptMap.set(p,uses)}
}
const exactPromptDuplicates=[...promptMap.entries()].filter(([,uses])=>uses.length>1).map(([prompt,uses])=>({prompt,uses}));
const weeklyPrompts=new Set(weekly.map(r=>norm(prompt(r.item)))),midOverlap=mid.filter(r=>weeklyPrompts.has(norm(prompt(r.item)))).length,finalOverlap=fin.filter(r=>weeklyPrompts.has(norm(prompt(r.item)))).length;
window.__KHAEMENES_GLOBAL9_FORENSIC_AUDIT__={generatedAt:new Date().toISOString(),counts:{weekly:weekly.length,midterm:mid.length,final:fin.length,total:all.length},answerPositions:positions,issues,exactPromptDuplicates,weeklyOverlap:{midterm:midOverlap,final:finalOverlap}};
})();`;
      doc.body.appendChild(script);
    },260);
  });
})();