/* Khaemenes High School Formative Evidence Bridge v1.0.0 */
(function attachHighFormativeEvidence(global){
"use strict";
if(global.KhaemenesHighFormativeEvidence)return;
const VERSION="1.0.0",DAILY_KEY="khaemenes_high_formative_page_day_v1",MAX_FOCUS=220;
const esc=v=>String(v??"").replace(/[&<>"\']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","\'":"&#39;"}[c]));
const read=(k,f=null)=>{try{const raw=global.localStorage?.getItem(k);return raw?JSON.parse(raw):f}catch{return f}};
const write=(k,v)=>{try{global.localStorage?.setItem(k,JSON.stringify(v));return true}catch{return false}};
function today(){const d=new Date(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return d.getFullYear()+"-"+m+"-"+day}
function courseMeta(){
 const p=String(global.location?.pathname||"").toLowerCase();
 const rows=[
  [/\/courses\/language-arts\/english-9\//,"english-9","language-arts"],
  [/\/courses\/language-arts\/english-10\//,"english-10","language-arts"],
  [/\/courses\/language-arts\/english-11\//,"english-11","language-arts"],
  [/\/courses\/language-arts\/english-12\//,"english-12","language-arts"],
  [/\/courses\/mathematics\/pre-algebra\//,"pre-algebra","mathematics"],
  [/\/courses\/mathematics\/algebra-1\//,"algebra-1","mathematics"],
  [/\/courses\/mathematics\/geometry\//,"geometry","mathematics"],
  [/\/courses\/mathematics\/algebra-2\//,"algebra-2","mathematics"],
  [/\/courses\/science\/integrated-science-9\//,"integrated-science-9","science"],
  [/\/courses\/science\/biology-10\//,"biology-10","science"],
  [/\/courses\/science\/chemistry-11\//,"chemistry-11","science"],
  [/\/courses\/science\/physics-engineering-12\//,"physics-engineering-12","science"],
  [/\/courses\/social-studies\/grade-09\//,"global-studies-9","social-studies"],
  [/\/courses\/social-studies\/grade-10\//,"us-history-10","social-studies"],
  [/\/courses\/social-studies\/grade-11\//,"government-economics-11","social-studies"],
  [/\/courses\/social-studies\/grade-12\//,"global-politics-12","social-studies"]
 ];
 for(const row of rows)if(row[0].test(p))return{courseId:row[1],department:row[2]};
 return{courseId:"high-school",department:"general"};
}
function pageScope(){const p=String(global.location?.pathname||""),w=p.match(/week-(\d{1,2})/i)?.[1],u=p.match(/unit-(\d{1,2})/i)?.[1],l=p.match(/(?:lesson|day)[-_]?(\d{1,3})/i)?.[1];return [w?"week-"+String(Number(w)).padStart(2,"0"):null,u?"unit-"+String(Number(u)).padStart(2,"0"):null,l?"lesson-"+String(Number(l)).padStart(2,"0"):null].filter(Boolean).join(" · ")}
function pageTitle(){const d=global.document,c=[d?.querySelector?.("main h1")?.textContent,d?.querySelector?.(".hero h1")?.textContent,d?.querySelector?.("h1")?.textContent,d?.title];return String(c.find(Boolean)||"High School lesson").replace(/\s+/g," ").trim().slice(0,150)}
function activeLearnerId(){return global.KhaemenesHighLearningContext?.learner?.()?.learnerId||null}
function claimKey(){const id=activeLearnerId()||"preview",p=String(global.location?.pathname||"").replace(/[?#].*$/,"").toLowerCase();return today()+"|"+id+"|"+p}
function claims(){const v=read(DAILY_KEY,{});return v&&typeof v==="object"&&!Array.isArray(v)?v:{}}
function alreadySaved(){return Boolean(claims()[claimKey()])}
function rememberSave(meta){const map=claims();map[claimKey()]={savedAt:new Date().toISOString(),courseId:meta.courseId,path:String(global.location?.pathname||"")};const cutoff=Date.now()-60*86400000;for(const [k,v] of Object.entries(map))if(Date.parse(v?.savedAt||"")<cutoff)delete map[k];return write(DAILY_KEY,map)}
function mentorHref(meta){const params=new URLSearchParams();params.set("subject",meta.department);params.set("course",meta.courseId);params.set("source",String(global.location?.pathname||"/Khaemenes_High.github.io/"));return "/Khaemenes_High.github.io/mentor/?"+params.toString()}
function style(){
 if(global.document?.getElementById("highFormativeEvidenceStyle"))return;
 const s=global.document.createElement("style");s.id="highFormativeEvidenceStyle";
 s.textContent=".khae-high-formative{width:min(calc(100% - 28px),920px);margin:28px auto;padding:18px;border:1px solid rgba(16,43,67,.16);border-top:3px solid #b48b45;border-radius:7px;background:#fffdf8;color:#17211d;box-shadow:0 10px 28px rgba(16,43,67,.06);text-align:left}.khae-high-formative h2{margin:0;color:#102b43;font:400 24px/1.25 Cinzel,Georgia,serif}.khae-high-formative .copy{margin:7px 0 14px;color:#6f7a73;font-size:.9rem}.khae-high-formative-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.khae-high-formative label{display:grid;gap:6px;color:#233e34;font-size:.78rem;font-weight:700}.khae-high-formative textarea,.khae-high-formative select{width:100%;min-height:44px;padding:10px;border:1px solid rgba(16,43,67,.2);border-radius:7px;background:#fff;color:#17211d;font:inherit}.khae-high-formative textarea{min-height:96px;resize:vertical}.khae-high-formative .wide{grid-column:1/-1}.khae-high-formative-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px}.khae-high-formative button,.khae-high-formative a{min-height:40px;padding:8px 12px;border:1px solid rgba(16,43,67,.2);border-radius:7px;background:#fff;color:#102b43;text-decoration:none;font:inherit;font-weight:700;cursor:pointer}.khae-high-formative button.primary{background:#102b43;color:#fff;border-color:#102b43}.khae-high-formative-status{min-height:20px;margin:8px 0 0;color:#52605a;font-size:.76rem}.khae-high-formative-boundary{margin-top:10px;padding:9px 11px;border-left:3px solid #b48b45;background:#f8f3e8;color:#52605a;font-size:.74rem}@media(max-width:680px){.khae-high-formative-grid{grid-template-columns:1fr}.khae-high-formative .wide{grid-column:auto}}@media print{.khae-high-formative{display:none!important}}";
 global.document.head?.appendChild(s);
}
function mount(){
 if(!global.document||global.document.getElementById("khaeHighFormativeEvidence"))return;
 const context=global.KhaemenesHighLearningContext;if(!context?.recordFormative)return;
 style();const meta=courseMeta(),box=global.document.createElement("section"),saved=alreadySaved();
 box.id="khaeHighFormativeEvidence";box.className="khae-high-formative";
 box.innerHTML='<h2>Lesson Evidence</h2><p class="copy">Capture what changed in your understanding before you leave this lesson. This is formative learning evidence—not a grade.</p><div class="khae-high-formative-grid"><label class="wide">What idea, method, source, or result can you explain now?<textarea data-focus maxlength="'+MAX_FOCUS+'" placeholder="Write a concise explanation in your own words."></textarea></label><label>What still needs review?<textarea data-review maxlength="240" placeholder="List one or two skills, terms, or reasoning steps."></textarea></label><label>How ready do you feel to use this independently?<select data-readiness><option value="ready-to-explain">Ready to explain or apply it</option><option value="need-another-example">I need another example</option><option value="need-mentor-help">I need Mentor help</option></select></label></div><div class="khae-high-formative-actions"><button type="button" class="primary" data-save '+(saved?'disabled aria-disabled="true"':'')+'>'+(saved?'Lesson Evidence Saved Today':'Save Lesson Evidence')+'</button><a href="'+esc(mentorHref(meta))+'">Ask Archaemenes</a></div><div class="khae-high-formative-status" aria-live="polite">'+(saved?'A formative reflection for this page is already saved today.':'')+'</div><div class="khae-high-formative-boundary">Formative reflections cannot award mastery, change a score, unlock curriculum, alter placement, or replace essays, laboratories, projects, oral defense, portfolios, or course-specific assessments.</div>';
 const main=global.document.querySelector("main"),footer=global.document.querySelector("footer");if(main)main.insertAdjacentElement("afterend",box);else if(footer)footer.insertAdjacentElement("beforebegin",box);else global.document.body?.appendChild(box);
 const status=box.querySelector(".khae-high-formative-status");
 box.querySelector("[data-save]")?.addEventListener("click",()=>{
  if(alreadySaved()){status.textContent="A formative reflection for this page is already saved today.";return}
  const focus=String(box.querySelector("[data-focus]")?.value||"").replace(/\s+/g," ").trim(),reviewRaw=String(box.querySelector("[data-review]")?.value||"").replace(/\s+/g," ").trim(),readiness=String(box.querySelector("[data-readiness]")?.value||"ready-to-explain");
  if(focus.length<8){status.textContent="Write a short explanation of what you learned before saving.";return}
  const reviewSkills=[...new Set(reviewRaw.split(/[,;\n]+/).map(v=>v.trim()).filter(Boolean).slice(0,5))];if(readiness==="need-another-example")reviewSkills.unshift("needs another example");if(readiness==="need-mentor-help")reviewSkills.unshift("mentor help requested");
  const ok=context.recordFormative({courseId:meta.courseId,department:meta.department,kind:"lesson-reflection",scope:pageScope()||String(global.location?.pathname||"lesson"),focus:(pageTitle()+" · "+focus).slice(0,MAX_FOCUS),reviewSkills,mastered:false,score:null,formative:true,affectsGrade:false,completedAt:new Date().toISOString()});
  if(!ok){status.textContent=activeLearnerId()?"This browser could not save the lesson evidence.":"Select the matching Academy learner before saving owned lesson evidence.";return}
  rememberSave(meta);const button=box.querySelector("[data-save]");button.disabled=true;button.setAttribute("aria-disabled","true");button.textContent="Lesson Evidence Saved Today";status.textContent="Saved to the learner-scoped High School learning ledger. This reflection does not change formal mastery.";
 });
}
if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
global.KhaemenesHighFormativeEvidence=Object.freeze({version:VERSION,dailyKey:DAILY_KEY,courseMeta,pageScope,authority:Object.freeze({awardsMastery:false,changesScore:false,unlocksCurriculum:false,changesPlacement:false,replacesPerformanceEvidence:false}),mount});

/* Science Investigation Notebook loader.
   Upper-science weekly architecture reserves Wednesday for data, Thursday for
   investigation/design, and Friday for CER/synthesis. Load the shared handoff
   on those evidence-rich days without editing 108 lesson files individually. */
function attachScienceInvestigationNotebook(){
 const path=String(global.location?.pathname||"").toLowerCase();
 const match=path.match(/\/courses\/science\/(biology-10|chemistry-11|physics-engineering-12)\/weeks\/week-\d{2}\/lessons\/day-(\d{2})\.html$/);
 if(!match)return;
 const day=Number(match[2]);
 if(day<3||day>5)return;
 if(global.document.querySelector('script[src*="science-investigation-lesson-bridge.js"]'))return;
 const script=global.document.createElement("script");
 script.src=new URL("../science/science-investigation-lesson-bridge.js",global.document.currentScript?.src||global.location.href).href;
 script.defer=true;
 script.dataset.khaemenesScienceInvestigation="shared-v1";
 (global.document.head||global.document.documentElement).appendChild(script);
}
if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",attachScienceInvestigationNotebook,{once:true});else attachScienceInvestigationNotebook();

/* Social Studies printable portfolio bridge: provides a separate, ungraded record. */
function attachSocialStudiesPortfolio(){
 const m=location.pathname.match(/\/social-studies\/grade-(09|10|11|12)\/(?:weeks\/)?week-(\d\d)\/student-packet\.html$/);
 if(!m||document.querySelector("[data-academic-portfolio-link]"))return;
 const grade=Number(m[1]),week=Number(m[2]),title=(document.querySelector("h1")?.textContent||document.title||"").trim().slice(0,180);
 const unit=(Array.from(document.querySelectorAll(".pill, .pills span")).map(n=>n.textContent.trim()).find(t=>/^Unit\s+\d/i.test(t))||"").slice(0,180);
 const url=new URL("../social-studies/tools/academic-evidence-printout.html",document.currentScript?.src||location.origin+"/courses/shared/high-school-formative-evidence-v1.js");
 for(const [key,val] of Object.entries({grade,unit,lesson:"Week "+week,title}))url.searchParams.set(key,String(val));
 const area=document.createElement("aside");area.className="academic-portfolio-bridge";area.setAttribute("data-academic-portfolio-link","");
 area.style.cssText="margin:16px 0;padding:15px;border:1px solid #857d69;border-radius:7px;break-inside:avoid";
 const heading=document.createElement("h2");heading.textContent="Khaemenes Academy · Printable Academic Evidence";
 const note=document.createElement("p");note.textContent="Keep a dated portfolio record alongside this weekly lesson. Add student name, sources, completed work and parent/teacher review. This form does not submit or change your quiz grades.";
 const link=document.createElement("a");link.href=url.href;link.textContent="Save Academic Evidence · Week "+week+" (Print / JSON)";link.style.cssText="display:inline-block;padding:9px 12px;border:1px solid currentColor;border-radius:7px;overflow-wrap:anywhere";
 area.append(heading,note,link);
 const dest=document.querySelector("main footer, footer");if(dest)dest.before(area);else document.querySelector("main")?.append(area);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attachSocialStudiesPortfolio,{once:true});else attachSocialStudiesPortfolio();
/* Senior-year visual source investigation: supplements existing packets without modifying assessments. */
function attachSeniorVisualInvestigation(){
 const match=location.pathname.match(/\/social-studies\/grade-12\/weeks\/week-(\d\d)\/student-packet\.html$/);
 if(!match||document.querySelector(".khaemenes-visual-investigation"))return;
 const week=Number(match[1]);if(week<1||week>36)return;
 const title=(document.querySelector("h1")?.textContent||"Senior civic inquiry").trim();
 const model=week<=12?"an institutional comparison diagram":week<=18?"a comparative-government evidence matrix":week<=24?"a dated international-law or diplomacy timeline":week<=30?"a geographic or statistical evidence comparison":"a capstone source-authentication and argument map";
 const area=document.createElement("section");area.className="card khaemenes-visual-investigation";
 area.setAttribute("aria-label","Khaemenes Academy original visual investigation");
 area.style.cssText="margin:18px 0;padding:15px;border:1px solid #857d69;border-radius:7px;break-inside:avoid";
 const heading=document.createElement("h2");heading.textContent="Khaemenes Academy · Original Senior Visual Investigation";
 const prompt=document.createElement("p");prompt.textContent="For Week "+week+" — "+title+": construct "+model+" using at least two independently attributed documents or datasets. Compare perspectives, identify the author, jurisdiction or geography, date and limits of each source; explain how the evidence supports or qualifies a defensible conclusion.";
 const link=document.createElement("a");link.href=new URL("../social-studies/tools/visual-studio.html",document.currentScript?.src||location.origin+"/courses/shared/high-school-formative-evidence-v1.js").href;link.textContent="Open Original Academy Visual Studio";link.style.cssText="display:inline-block;padding:9px 12px;border:1px solid currentColor;border-radius:7px;overflow-wrap:anywhere";
 const caution=document.createElement("p");caution.textContent="Historical borders and initial chart values in the studio are schematic or illustrative. Verify original source evidence before treating any visualization as factual.";
 const line=document.createElement("p");line.textContent="Source, publication date, geography / jurisdiction and limitation: ________________________________________________";
 area.append(heading,prompt,link,caution,line);
 const dest=document.querySelector("main footer, footer");if(dest)dest.before(area);else document.querySelector("main")?.append(area);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attachSeniorVisualInvestigation,{once:true});else attachSeniorVisualInvestigation();

})(window);
