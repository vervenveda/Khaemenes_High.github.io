(() => {
  "use strict";
  const frame = document.getElementById("courseFrame");
  if (!frame) return;

  frame.addEventListener("load", () => {
    const doc = frame.contentDocument;
    if (!doc) return;
    const script = doc.createElement("script");
    script.textContent = `(() => {
"use strict";
const norm=v=>String(v??"").trim().replace(/\\s+/g," ").toLowerCase();
const promptOf=item=>Array.isArray(item)?item[0]:item?.q??item?.prompt??"";
const choicesOf=item=>Array.isArray(item)&&Array.isArray(item[1])?item[1]:Array.isArray(item?.choices)?item.choices:[];
const answerOf=item=>Number(Array.isArray(item)?item[2]:item?.answer);
const explainOf=item=>Array.isArray(item)?item[3]:item?.explain??item?.explanation??"";
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const simplify=(num,den)=>{const g=gcd(num,den);return String(num/g)+"/"+String(den/g)};

function auditNow(){
  if(!window.APP||!APP.quizBank||!window.__KHAEMENES_PREALGEBRA_FORENSIC_REPAIR__)return false;
  if(!window.__KHAEMENES_PREALGEBRA_SANITY__)return false;
  const weekly=[];
  for(const w of APP.weeks||[]){
    const bank=APP.quizBank?.[w.quizKey]||[];
    bank.forEach((item,index)=>weekly.push({scope:"week",week:Number(w.week)||null,index,item}));
  }
  const mid=(APP.midterm||[]).map((item,index)=>({scope:"midterm",index,item}));
  const fin=(APP.final||[]).map((item,index)=>({scope:"final",index,item}));
  const all=[...weekly,...mid,...fin],issues=[],semanticIssues=[],positions=[0,0,0,0],promptMap=new Map();

  for(const row of all){
    const p=String(promptOf(row.item)||"").trim();
    const cs=choicesOf(row.item),a=answerOf(row.item),ex=String(explainOf(row.item)||"").trim();
    const where={scope:row.scope,...(Number.isInteger(row.week)?{week:row.week}:{}),index:row.index};
    if(!p)issues.push({...where,type:"empty-prompt"});
    if(!ex)issues.push({...where,type:"empty-explanation"});
    if(cs.length!==4)issues.push({...where,type:"choice-count",count:cs.length});
    if(new Set(cs.map(norm)).size!==cs.length)issues.push({...where,type:"duplicate-visible-choice"});
    if(!Number.isInteger(a)||a<0||a>=cs.length)issues.push({...where,type:"invalid-answer-index",answer:a});
    else if(a<4)positions[a]++;
    const text=[p,...cs.map(String),ex].join(" ");
    if(/\\b(?:NaN|Infinity|undefined|null)\\b/.test(text))semanticIssues.push({...where,type:"non-finite-or-placeholder-token"});
    const denominatorMatches=[...text.matchAll(/(?:^|[^\\d])(-?\\d+)\\/(-?\\d+)/g)];
    for(const m of denominatorMatches){if(Number(m[2])===0)semanticIssues.push({...where,type:"zero-denominator"});}

    const rational=p.match(/^Compute 2\\/3 × 3\\/(\\d+)\\.$/);
    if(rational&&Number.isInteger(a)&&a>=0&&a<cs.length){
      const den=Number(rational[1]);
      const expected=simplify(2,den);
      if(String(cs[a]).trim()!==expected)semanticIssues.push({...where,type:"fraction-product-not-simplified",expected,actual:String(cs[a]).trim()});
    }

    const key=norm(p);
    if(key){const uses=promptMap.get(key)||[];uses.push(where);promptMap.set(key,uses);}
  }

  const exactPromptDuplicates=[...promptMap.entries()].filter(([,uses])=>uses.length>1).map(([prompt,uses])=>({prompt,uses}));
  const weeklyPrompts=new Set(weekly.map(r=>norm(promptOf(r.item))));
  const midOverlap=mid.filter(r=>weeklyPrompts.has(norm(promptOf(r.item)))).length;
  const finalOverlap=fin.filter(r=>weeklyPrompts.has(norm(promptOf(r.item)))).length;

  window.__KHAEMENES_PREALGEBRA_FORENSIC_AUDIT__={
    generatedAt:new Date().toISOString(),
    counts:{weekly:weekly.length,midterm:mid.length,final:fin.length,total:all.length},
    answerPositions:positions,
    issues,
    semanticIssues,
    exactPromptDuplicates,
    weeklyOverlap:{midterm:midOverlap,final:finalOverlap},
    upstream:{
      duplicateChoiceRepairs:Number(window.__KHAEMENES_PREALGEBRA_SANITY__?.duplicateChoiceRepairs)||0,
      simplifiedFractionProducts:Number(window.__KHAEMENES_PREALGEBRA_CONTENT_INTEGRITY__?.simplifiedFractionProducts)||0
    }
  };
  return true;
}
let tries=0;const timer=setInterval(()=>{tries++;if(auditNow()||tries>40)clearInterval(timer)},100);
})();`;
    doc.body.appendChild(script);
  });
})();
