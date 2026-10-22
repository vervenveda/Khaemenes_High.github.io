/* Algebra I non-grading learning tools menu; optional, no storage or mastery changes. */
(()=>{"use strict";
const hideTools=/\/(?:assessment|assessments|diagnostic)\//.test(location.pathname);
const links=[
 ["Scientific calculator","https://vervenveda.github.io/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/"],
 ["Slope & Rate Studio","https://vervenveda.github.io/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/slope-and-rate-studio/"],
 ["Quadratic Graph Lab","https://vervenveda.github.io/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/quadratic-graph-lab/"],
 ["PROSE · ProTools","https://vervenveda.github.io/proresource_hub.github.io/"]
];
function mount(){
 if(hideTools||document.getElementById("khae-algebra1-tool-menu"))return;
 const root=document.createElement("aside");root.id="khae-algebra1-tool-menu";root.setAttribute("aria-label","Algebra I learning tools");
 const style=document.createElement("style");style.textContent=`
 #khae-algebra1-tool-menu{position:fixed;right:14px;bottom:16px;z-index:990;max-width:min(310px,calc(100vw - 28px));font:400 15px/1.5 "Avenir Next",Arial,sans-serif;color:#f6f0df}
 #khae-algebra1-tool-menu details{background:#172c40;border:1px solid #ae9467;border-radius:7px;box-shadow:0 8px 24px #0005}
 #khae-algebra1-tool-menu summary{cursor:pointer;padding:11px 16px;list-style-position:inside}
 #khae-algebra1-tool-menu nav{display:grid;gap:5px;padding:0 12px 12px}
 #khae-algebra1-tool-menu a{display:block;color:#f6f0df;text-decoration:underline;text-underline-offset:3px;padding:7px 6px;border-radius:7px}
 #khae-algebra1-tool-menu a:focus-visible,#khae-algebra1-tool-menu summary:focus-visible{outline:2px solid #f0d58a;outline-offset:2px}
 #khae-algebra1-tool-menu p{margin:4px 5px 0;font-size:12px;line-height:1.4;color:#ebdab7}
 @media print{#khae-algebra1-tool-menu{display:none!important}}`;
 root.innerHTML="<details><summary>Learning Tools ▾</summary><nav aria-label='Learning tools links'></nav></details>";
 const nav=root.querySelector("nav");
 links.forEach(([label,url])=>{const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=label;nav.append(a)});
 const note=document.createElement("p");note.textContent="Practice and lessons: show your reasoning. Follow assessment tool rules during tests.";nav.append(note);
 document.head.append(style);document.body.append(root);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
/* Result navigation does not grant mastery; links remain subject to canonical gates. */
function installNextStep(){
 const path=location.pathname;
 const match=path.match(/\/units\/unit-(\d{2})\/(lessons|assessment|practice)\//);
 if(!match)return;
 const num=Number(match[1]),kind=match[2];
 const result=document.getElementById("result")||document.getElementById("scoreMsg");
 const score=document.getElementById("score");
 if(!result||!score){const main=document.getElementById("main");if(main&&!main.dataset.khaeNextStepAwait){main.dataset.khaeNextStepAwait="1";const wait=new MutationObserver(()=>{if(document.getElementById("result")||document.getElementById("scoreMsg")){wait.disconnect();delete main.dataset.khaeNextStepAwait;installNextStep()}});wait.observe(main,{childList:true,subtree:true})}return;}
 const section=document.createElement("div");section.id="khae-next-learning-step";section.style.cssText="margin:18px 0;padding:16px;border:1px solid #a99066;border-radius:7px;line-height:1.6";
 section.setAttribute("aria-label","Next learning step");
 section.hidden=true;result.after(section);
 function link(label,href){const a=document.createElement("a");a.href=href;a.className="btn";a.textContent=label;a.style.margin="5px 10px 5px 0";return a}
 function update(){
  if(!score.disabled||!result.textContent.trim()||/NOT saved|Could not save|not saved/i.test(result.textContent)){section.hidden=true;return}
  let m=result.textContent.match(/(\d{1,3})%/);if(!m)return;
  const passed=Number(m[1])>=80;section.replaceChildren();
  const heading=document.createElement("p");heading.textContent=passed?"Next learning step · Mastery target reached":"Next learning step · More practice recommended";heading.style.margin="0 0 8px";section.append(heading);
  const unitHome=kind==="lessons"?"../index.html":"../index.html";
  if(kind==="lessons"&&passed){
   const data=window["KHAE_UNIT"+match[1]]||window.ALGEBRA1_DATA;
   const n=Number(document.body.dataset.lesson)||Number((path.match(/lesson-(\d+)/)||[])[1]);
   const lessons=data?.lessons||[];
   const next=lessons.find(l=>l.number===n+1&&(l.unit===undefined||l.unit===num));
   if(next?.file)section.append(link("Continue to Lesson "+String(n+1).padStart(2,"0"),next.file));
   else if(next?.slug)section.append(link("Continue to Lesson "+String(n+1).padStart(2,"0"),"lesson-"+String(n+1).padStart(2,"0")+"-"+next.slug+".html"));
   else section.append(link("Continue to Unit Pathway",unitHome));
  }else if(kind==="assessment"&&passed){
   section.append(link("Continue to Course Pathway","../../../index.html#units"));
   if(num<13)section.append(link("Check Unit "+String(num+1).padStart(2,"0")+" readiness","../../unit-"+String(num+1).padStart(2,"0")+"/"));
  }else{
   section.append(link(passed?"Return to Unit Pathway":"Review lessons and examples",unitHome));
  }
  if(!passed){let text=document.createElement("p");text.textContent="Use the new shuffled attempt button after reviewing. Your saved best score remains intact.";text.style.margin="8px 0 0";section.append(text)}
  section.hidden=false;
 }
 const observer=new MutationObserver(update);observer.observe(result,{childList:true,subtree:true,characterData:true});update();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installNextStep,{once:true});else installNextStep();

})();
