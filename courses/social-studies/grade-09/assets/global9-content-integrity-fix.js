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
const item=(q,choices,answer,explain,skill)=>({q,choices,answer,explain,skill});
const fixes=[];
function replace(week,index,next,reason){
  const key="week_"+String(week).padStart(2,"0");
  const bank=APP.quizBank?.[key];
  if(!Array.isArray(bank)||index<0||index>=bank.length)return;
  bank[index]=next;
  fixes.push({week,index,reason});
}
replace(13,0,item(
  "In later imperial China, civil service examinations were used chiefly to…",
  ["Recruit educated candidates for government service","Select hereditary knights","Choose merchant guild leaders","Train naval explorers only"],
  0,
  "Examination systems, especially as they expanded under the Sui, Tang, and Song and later dynasties, became an important route into the imperial bureaucracy, while access and recruitment practices still varied by period.",
  "East Asia"
),"Avoids implying one unchanged examination system across all imperial Chinese history.");
replace(20,4,item(
  "The Peace of Westphalia settlements of 1648 are most accurately associated with…",
  ["Ending the Thirty Years’ War and revising territorial, constitutional, and confessional arrangements in Europe","Creating modern sovereign states from nothing in a single moment","Beginning the Crusades","Ending all religious conflict in Europe"],
  0,
  "The 1648 settlements ended the Thirty Years’ War and altered important political and confessional arrangements; historians caution against treating them as a single birth certificate for modern sovereignty.",
  "Early modern Europe"
),"Removes the common Westphalia-sovereignty oversimplification.");
replace(30,0,item(
  "Which explanation of the Great Depression is strongest?",
  ["It emerged from interacting financial, banking, demand, trade, policy, and international monetary stresses that deepened after 1929","The stock-market crash alone explains every cause and consequence","One country’s policy caused the entire global crisis by itself","The Depression began because industrialization ended"],
  0,
  "The 1929 crash was important, but the Depression became a prolonged global crisis through interacting banking failures, collapsing demand and investment, trade contraction, policy choices, and international financial pressures.",
  "Interwar"
),"Replaces a circular chronology item with a multicausal historical explanation.");
replace(31,0,item(
  "The Holocaust refers specifically to…",
  ["Nazi Germany’s systematic, state-sponsored persecution and murder of six million European Jews, carried out with collaborators; Nazi persecution and mass murder also targeted other groups","All civilian deaths during World War II","Only the imprisonment of political leaders","A military campaign fought only on battlefields"],
  0,
  "The Holocaust specifically names the genocide of European Jews. Nazi Germany and its collaborators also persecuted and murdered millions of other victims under distinct policies and programs.",
  "Holocaust"
),"Uses more precise genocide terminology while preserving the broader history of Nazi persecution.");
replace(32,1,item(
  "In Cold War history, a proxy war is best described as…",
  ["A local or regional conflict in which outside powers support opposing actors as part of a wider rivalry, while the conflict also has its own local causes and goals","A conflict with no outside involvement","A war in which local actors have no agency of their own","Any conflict in which the United States and Soviet Union fight each other directly in full-scale war"],
  0,
  "Proxy-war analysis should recognize outside sponsorship without reducing local actors, causes, and objectives to superpower puppetry.",
  "Conflict"
),"Preserves local agency instead of defining proxy conflict only from the perspective of great powers.");
window.__KHAEMENES_GLOBAL9_CONTENT_FIX__={version:"1.0.0",applied:fixes};
if(typeof render==="function")render();
})();`;
      doc.body.appendChild(script);
    },120);
  });
})();