/* Read-only evidence stars + learner-specific discovery notes. Does not assign grades. */
(()=>{"use strict";
const match=location.pathname.match(/\/grade-(09|10|11|12)\/student-profile\//);
const grade=match?.[1]||String(document.body.dataset.grade||"").padStart(2,"0");
if(!["09","10","11","12"].includes(grade))return;
const mount=grade==="09"?document.querySelector("main"):document.getElementById("my-profile-extras");
if(!mount||document.getElementById("khaeDreamsAchievements"))return;
const api=window.KhaemenesStudentProfileV2,contract=window.KhaemenesCourseEntryContract;
const starting=api?.activeLearner?.()?.learnerId,canonical=contract?.readAcademyProfile?.()?.learnerId;
const id=starting&&canonical&&String(starting)===String(canonical)?String(starting):null;
const boardKey=id?"khaemenes.student.dream-board.v1:"+encodeURIComponent(id):null;
const evidenceKey=id?"khae-learning-portfolio-v1:learner:"+encodeURIComponent(id):null;
const current=()=>!!id&&String(api?.activeLearner?.()?.learnerId||"")===id&&String(contract?.readAcademyProfile?.()?.learnerId||"")===id;
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
const section=el("section");section.id="khaeDreamsAchievements";section.style.cssText="max-width:1050px;margin:18px auto;padding:18px;border:1px solid #b9a787;border-radius:7px;background:#17283c;color:#f0e9d9;font:400 17px/1.55 Arial,sans-serif";
section.append(el("h2","My Achievements & Dreams"));
const explanation=el("p","Celebrate the evidence you have recorded and create a private board of future ideas. This section never changes academic scores, course completion, or mastery.");section.append(explanation);
const constellation=el("section");constellation.id="achievement-constellation";constellation.append(el("h3","My Achievement Constellation"));
const starNote=el("p","Each star represents a subject with saved portfolio evidence, not an independently verified award.");constellation.append(starNote);
const stars=el("div");stars.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px";constellation.append(stars);section.append(constellation);
const boardSection=el("section");boardSection.id="dream-discovery-board";boardSection.style.marginTop="26px";boardSection.append(el("h3","My Dream & Discovery Board"));
const form=el("form");form.style.cssText="display:grid;gap:10px;max-width:680px";
const title=el("input");title.placeholder="A dream, idea or discovery";title.maxLength=100;title.required=true;title.setAttribute("aria-label","Dream board title");
const details=el("textarea");details.placeholder="What would I like to explore?";details.maxLength=700;details.rows=3;details.setAttribute("aria-label","Dream board details");
for(const field of [title,details])field.style.cssText="padding:10px;color:#202b29;background:#fff;border-radius:7px;border:1px solid #9eacb1;font:inherit";
const add=el("button","Add my idea");add.type="submit";
form.append(title,details,add);boardSection.append(form);
const entries=el("div");entries.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:14px 0";boardSection.append(entries);
const download=el("button","Export my board JSON");download.type="button";boardSection.append(download);
const message=el("p");message.setAttribute("role","status");message.setAttribute("aria-live","polite");boardSection.append(message);
section.append(boardSection);
if(grade==="09")mount.insertBefore(section,mount.firstChild);else mount.append(section);
const portfolioUrl="../../../portfolio/index.html?grade="+grade;
const link=el("a","Open my learning portfolio");link.href=portfolioUrl;link.style.color="#f3dba6";constellation.append(link);
let board=[];
function secure(){if(current())return true;stars.replaceChildren();entries.replaceChildren();title.disabled=details.disabled=add.disabled=download.disabled=true;message.textContent="Select your Academy learner and reload the page to access personal records.";return false}
function load(){if(!boardKey)return [];try{const v=JSON.parse(localStorage.getItem(boardKey)||"[]");return Array.isArray(v)?v.filter(x=>x&&typeof x.title==="string"&&typeof x.detail==="string"&&x.title.length<=100&&x.detail.length<=700).slice(0,40):[]}catch{return []}}
function refreshStars(){stars.replaceChildren();if(!secure())return;let evidence=[];try{const v=JSON.parse(localStorage.getItem(evidenceKey)||"[]");if(Array.isArray(v))evidence=v.filter(x=>x&&typeof x.id==="string"&&typeof x.subject==="string"&&typeof x.title==="string"&&typeof x.detail==="string").slice(0,500)}catch{}
const grouped=new Map();for(const record of evidence){const subject=record.subject.slice(0,70);grouped.set(subject,(grouped.get(subject)||0)+1)}
if(!grouped.size){stars.append(el("p","Your constellation begins when you add academic evidence to your portfolio."));return}
for(const [subject,count] of grouped){const card=el("article");card.style.cssText="padding:12px;border:1px solid #b9a787;border-radius:7px";card.append(el("span","✦ "),el("strong",subject),el("p",count+" saved evidence "+(count===1?"entry":"entries")));stars.append(card)}
}
function renderBoard(){entries.replaceChildren();if(!secure())return;if(!board.length)entries.append(el("p","Your board is ready for its first idea."));
board.forEach((item,i)=>{const card=el("article");card.style.cssText="padding:12px;border:1px solid #b9a787;border-radius:7px";card.append(el("h4",item.title),el("p",item.detail));const remove=el("button","Remove");remove.type="button";remove.addEventListener("click",()=>{if(!secure())return;const next=board.filter((_,j)=>j!==i);try{localStorage.setItem(boardKey,JSON.stringify(next));board=next;renderBoard();message.textContent="Idea removed."}catch{message.textContent="Unable to update the board."}});card.append(remove);entries.append(card)})}
form.addEventListener("submit",e=>{e.preventDefault();if(!secure())return;const t=title.value.trim().slice(0,100),d=details.value.trim().slice(0,700);if(!t)return;if(board.length>=40){message.textContent="Export or remove an idea before adding more.";return}const next=[...board,{title:t,detail:d}];try{localStorage.setItem(boardKey,JSON.stringify(next));board=next;title.value=details.value="";renderBoard();message.textContent="Your idea was saved on this device."}catch{message.textContent="Unable to save. Browser storage may be full."}});
download.addEventListener("click",()=>{if(!secure())return;const blob=new Blob([JSON.stringify({format:"khaemenes-dream-board-v1",grade,learnerId:id,ideas:board},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=el("a");a.href=url;a.download="my-dream-board.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
function refresh(){if(!secure())return;board=load();refreshStars();renderBoard()}
window.addEventListener("pageshow",refresh);
window.addEventListener("focus",refresh);
window.addEventListener("storage",e=>{if(!e.key||e.key===boardKey||e.key===evidenceKey||e.key==="khaemenes_active_learner_v1")refresh()});
window.addEventListener("khaemenes-student-profile-changed",refresh);
refresh();
})();