(() => {
"use strict";
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
function simplify(num,den){const g=gcd(num,den);return `${num/g}/${den/g}`}
function apply(){
  if(!window.APP||!APP.quizBank||!window.__KHAEMENES_PREALGEBRA_FORENSIC_REPAIR__)return false;
  let simplifiedFractionProducts=0;
  for(const [key,bank] of Object.entries(APP.quizBank)){
    if(!String(key).startsWith("forensic_")||!Array.isArray(bank))continue;
    for(const raw of bank){
      if(!Array.isArray(raw)||!Array.isArray(raw[1])||raw[1].length!==4)continue;
      const prompt=String(raw[0]||""),m=prompt.match(/^Compute 2\/3 × 3\/(\d+)\.$/);
      if(!m)continue;
      const den=Number(m[1]),oldCorrect=String(raw[1][Number(raw[2])]);
      const nextCorrect=simplify(2,den);
      if(oldCorrect===nextCorrect)continue;
      raw[1][Number(raw[2])]=nextCorrect;
      raw[3]=`Cancel the common factor 3, then simplify 2/${den} to ${nextCorrect}.`;
      simplifiedFractionProducts++;
    }
  }
  window.__KHAEMENES_PREALGEBRA_CONTENT_INTEGRITY__={version:"1.0.0",simplifiedFractionProducts};
  return true;
}
let tries=0;const timer=setInterval(()=>{tries++;if(apply()||tries>20)clearInterval(timer)},40);
})();