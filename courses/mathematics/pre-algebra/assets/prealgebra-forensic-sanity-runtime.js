(() => {
"use strict";
let duplicateChoiceRepairs=0;
for(const [key,bank] of Object.entries(APP.quizBank||{})){
  if(!String(key).startsWith("forensic_")||!Array.isArray(bank))continue;
  bank.forEach((raw,idx)=>{
    if(!Array.isArray(raw)||!Array.isArray(raw[1])||raw[1].length!==4)return;
    const choices=[...raw[1]],correctIndex=Number(raw[2]),correctText=String(choices[correctIndex]).trim(),used=new Set([correctText]);
    for(let i=0;i<choices.length;i++){
      if(i===correctIndex)continue;
      const text=String(choices[i]).trim();
      if(used.has(text)){
        let replacement="Not enough information "+(idx+i+1);
        while(used.has(replacement))replacement+="x";
        choices[i]=replacement;duplicateChoiceRepairs++;
      }
      used.add(String(choices[i]).trim());
    }
    raw[1]=choices;
  });
}
window.__KHAEMENES_PREALGEBRA_SANITY__={duplicateChoiceRepairs};
})();