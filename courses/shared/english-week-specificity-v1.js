/* Khaemenes Academy · English Week Specificity v1
   Strengthens weekly instruction without changing grades, mastery, storage, or assessment state. */
(()=>{"use strict";
if(window.__KHAE_ENGLISH_WEEK_SPECIFICITY_V1__)return;
window.__KHAE_ENGLISH_WEEK_SPECIFICITY_V1__=true;
const m=location.pathname.match(/\/english-(9|10|11|12)\/weeks\/week-(\d{2})\//i);
if(!m)return;
const grade=Number(m[1]),weekNo=Number(m[2]);
const clean=s=>String(s||"").replace(/\s+/g," ").trim();
const style=document.createElement("style");
style.textContent=`
.khae-specificity{margin:12px 0;padding:14px 16px;border:1px solid rgba(40,35,26,.18);border-radius:7px;background:#f7f3ea;color:#24231f}
.khae-specificity h3{margin:.2rem 0 .6rem;font:400 20px/1.3 Cinzel,"Iowan Old Style",Georgia,serif}
.khae-specificity p{margin:.45rem 0}
.khae-specificity strong{font-weight:400;color:#705719}
`;document.head.append(style);

const dayKeys=["monday","tuesday","wednesday","thursday","friday"];
let grade9Plan=null;

function upperWeek(){
 const data=grade===10?window.ELA10_COURSE:grade===11?window.ENGLISH_11_CURRICULUM:window.ENGLISH_12_CURRICULUM;
 return data?.weeks?.find(w=>Number(w.week)===weekNo)||null;
}
function fallbackLens(card,index){
 const title=clean(card.querySelector("h2,h3")?.textContent)||("Day "+(index+1));
 const target=clean(card.querySelector(".comment,.flow-step p")?.textContent)||"the stated learning target";
 const generic=[
  {model:`Model the exact reasoning demanded by “${title}” using one worked example from today’s course text.`,misconception:"Do not let the learner substitute summary or task completion for evidence-based reasoning.",evidence:`Preserve work that directly demonstrates: ${target}`},
  {model:`Think aloud through one evidence chain for “${title}”: detail → inference → reasoning → significance.`,misconception:"Annotation without explanation is not sufficient evidence of understanding.",evidence:"Preserve a ranked evidence set and explain why one piece is stronger than another."},
  {model:`Model a small section of today’s required product before independent drafting.`,misconception:"Do not reward evidence-dropping; every detail should be followed by reasoning.",evidence:"Preserve a draft excerpt plus one clearly named revision target."},
  {model:`Model feedback tied to the actual success criteria for “${title},” not personal preference.`,misconception:"Feedback should name evidence, reasoning, accuracy, audience, or clarity—not simply whether the reviewer likes the work.",evidence:"Preserve feedback and a revision note explaining what changed and why."},
  {model:`Retrieve the week’s central ideas before rereading, then transfer them to a fresh example.`,misconception:"A corrected answer is incomplete unless the learner explains the original error and the corrected reasoning.",evidence:"Preserve mastery evidence, corrections, strongest artifact, and one transferable next-step reflection."}
 ][index]||{};
 return generic;
}
function lensFor(card,index){
 if(grade===9)return grade9Plan?.specificity?.[dayKeys[index]]||fallbackLens(card,index);
 const week=upperWeek();
 return week?.specificity?.[dayKeys[index]]||fallbackLens(card,index);
}
function mount(card,index){
 if(card.querySelector(":scope .khae-specificity"))return;
 const lens=lensFor(card,index);
 if(!lens?.model)return;
 const box=document.createElement("aside");
 box.className="khae-specificity";
 box.setAttribute("aria-label","Week-specific teaching focus");
 box.innerHTML=`<p class="eyebrow">Specific Teaching Focus</p><h3>${clean(card.querySelector("h2,h3")?.textContent)||"Learning Step"}</h3><p><strong>Model:</strong> ${lens.model}</p><p><strong>Watch for:</strong> ${lens.misconception}</p><p><strong>Evidence target:</strong> ${lens.evidence}</p>`;
 const head=card.querySelector(".lesson-head,h2")?.parentElement||card;
 const anchor=card.querySelector(".lesson-grid,h3,.flow");
 if(anchor)card.insertBefore(box,anchor);else head.append(box);
}
async function run(){
 if(grade===9){
  try{
   const res=await fetch(new URL("../../curriculum.json",location.href),{cache:"no-store"});
   if(res.ok){
    const data=await res.json();
    grade9Plan=(data.weekPlans||[]).find(w=>Number(w.n)===weekNo)||null;
   }
  }catch{}
 }
 let cards=[...document.querySelectorAll("article.lesson-day")];
 if(!cards.length)cards=[...document.querySelectorAll("#lessons article.lesson-detail")];
 cards.slice(0,5).forEach(mount);
 document.documentElement.dataset.englishWeekSpecificity="v1";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{run()},{once:true});else run();
})();