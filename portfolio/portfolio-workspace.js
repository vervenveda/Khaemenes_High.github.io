/* Progressive portfolio enhancement: presentation and filtering only. */
(()=>{"use strict";
if(window.KhaemenesPortfolioWorkspace)return;
const $=id=>document.getElementById(id);
const entries=$("entries"),count=$("count"),search=$("filterQuery"),filter=$("filterSubject");
if(!entries||!count||!search||!filter)return;
function update(){
 const cards=[...entries.querySelectorAll(".entry")];
 const q=search.value.trim().toLowerCase();
 const subjects=new Set(cards.map(c=>c.querySelector("small")?.textContent.split(" · ")[0]||"").filter(Boolean));
 const selected=filter.value,listed=[...filter.options].slice(1).map(o=>o.value);
 if(subjects.size!==listed.length||[...subjects].some(x=>!listed.includes(x))){
  filter.replaceChildren(new Option("All subjects",""));
  [...subjects].sort().forEach(s=>filter.add(new Option(s,s)));
  filter.value=[...subjects].includes(selected)?selected:"";
 }
 let visible=0;
 cards.forEach(c=>{
  const subject=c.querySelector("small")?.textContent.split(" · ")[0]||"";
  const match=(!q||c.textContent.toLowerCase().includes(q))&&(!filter.value||subject===filter.value);
  c.hidden=!match;if(match)visible++;
 });
 $("portfolioEntryTotal").textContent=String(cards.length);
 $("portfolioSubjectTotal").textContent=String(subjects.size);
 let empty=$("portfolioSearchEmpty");
 if(!empty){empty=document.createElement("p");empty.id="portfolioSearchEmpty";empty.className="portfolio-empty";entries.after(empty)}
 empty.textContent=cards.length===0?"No portfolio entries yet. Use Add Learning Evidence to begin.":visible===0?"No entries match these filters. Try another search.":"";
 empty.hidden=visible!==0;
}
search.addEventListener("input",update);filter.addEventListener("change",update);
const observer=new MutationObserver(update);
observer.observe(entries,{childList:true});update();
window.KhaemenesPortfolioWorkspace=Object.freeze({refresh:update,version:1});
})();