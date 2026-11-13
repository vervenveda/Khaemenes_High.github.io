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
 s.textContent="\n/* Khaemenes Academy: coherent single-column evidence form; presentation only */\nhtml:root:root body #khaeHighFormativeEvidence {\n box-sizing:border-box!important;width:min(calc(100% - 32px),780px)!important;\n margin:40px auto!important;padding:clamp(24px,4vw,44px)!important;\n border:1px solid #cdbf9f!important;border-top:3px solid #b8995c!important;\n border-radius:7px!important;background:#fffdf8!important;color:#27302d!important;\n box-shadow:none!important;font:400 18px/1.65 \"Brandon Grotesque\",Nunito,Arial,sans-serif!important;\n text-align:left!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-high-formative-heading {\n max-width:660px;margin:0 auto 30px!important;text-align:center!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-formative-eyebrow {\n margin:0 auto 9px!important;font:400 16px/1.5 Nunito,Arial,sans-serif!important;\n letter-spacing:.06em!important;text-transform:uppercase!important;color:#76592e!important;\n -webkit-text-fill-color:#76592e!important;text-align:center!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence h2 {\n margin:0 auto 12px!important;color:#27302d!important;-webkit-text-fill-color:#27302d!important;\n font:400 clamp(27px,3.5vw,33px)/1.3 Cinzel,Georgia,serif!important;text-align:center!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .copy {\n margin:0 auto!important;color:#47544b!important;-webkit-text-fill-color:#47544b!important;\n font:400 18px/1.65 Nunito,Arial,sans-serif!important;text-align:center!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-high-formative-grid {\n display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:22px!important;\n max-width:660px!important;margin:0 auto!important;align-items:stretch!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-high-formative-field {\n display:grid!important;gap:9px!important;grid-column:1/-1!important;\n min-width:0!important;margin:0!important;\n color:#27302d!important;-webkit-text-fill-color:#27302d!important;\n font:400 18px/1.5 Nunito,Arial,sans-serif!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-formative-label {\n display:block!important;color:#27302d!important;-webkit-text-fill-color:#27302d!important;\n font:400 18px/1.5 Nunito,Arial,sans-serif!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-formative-step {\n color:#76592e!important;-webkit-text-fill-color:#76592e!important;\n font:400 18px/1.5 Cinzel,Georgia,serif!important;margin-right:8px;\n}\nhtml:root:root body #khaeHighFormativeEvidence textarea,\nhtml:root:root body #khaeHighFormativeEvidence select {\n box-sizing:border-box!important;width:100%!important;min-width:0!important;\n padding:13px 15px!important;min-height:50px!important;\n border:1px solid #b9ad96!important;border-radius:7px!important;\n background:#fffdf8!important;color:#27302d!important;-webkit-text-fill-color:#27302d!important;\n font:400 18px/1.6 Nunito,Arial,sans-serif!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence textarea {\n min-height:125px!important;resize:vertical!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence [data-focus] {min-height:165px!important}\nhtml:root:root body #khaeHighFormativeEvidence textarea::placeholder {\n color:#58685d!important;-webkit-text-fill-color:#58685d!important;opacity:1!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence :is(textarea,select):focus-visible {\n outline:3px solid #b8995c!important;outline-offset:3px!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-high-formative-actions {\n display:flex!important;justify-content:center!important;align-items:center!important;\n flex-direction:column!important;gap:12px!important;max-width:660px!important;\n margin:30px auto 0!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence [data-save] {\n display:inline-flex!important;justify-content:center!important;align-items:center!important;\n width:min(100%,330px)!important;min-height:50px!important;\n padding:12px 20px!important;border:1px solid #b8995c!important;border-radius:7px!important;\n background:#202724!important;background-image:none!important;color:#fff8e9!important;\n -webkit-text-fill-color:#fff8e9!important;font:400 18px/1.45 Nunito,Arial,sans-serif!important;\n text-align:center!important;cursor:pointer!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence [data-save]:is(:hover,:focus-visible) {\n background:#34463c!important;color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence [data-save]:disabled {\n opacity:.8!important;cursor:default!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-formative-mentor {\n display:inline-flex!important;align-items:center!important;justify-content:center!important;\n min-height:44px!important;padding:8px 16px!important;\n border:0!important;background:transparent!important;\n color:#27302d!important;-webkit-text-fill-color:#27302d!important;\n font:400 16px/1.5 Nunito,Arial,sans-serif!important;text-decoration:underline!important;\n text-underline-offset:4px!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-high-formative-status {\n max-width:660px!important;min-height:24px!important;\n margin:12px auto 0!important;text-align:center!important;\n font:400 16px/1.55 Nunito,Arial,sans-serif!important;\n color:#47544b!important;-webkit-text-fill-color:#47544b!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-high-formative-boundary {\n max-width:660px!important;margin:19px auto 0!important;\n padding:13px 16px!important;border:1px solid #cdbf9f!important;\n border-radius:7px!important;background:#f7f1e5!important;\n color:#47544b!important;-webkit-text-fill-color:#47544b!important;\n font:400 16px/1.6 Nunito,Arial,sans-serif!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-high-formative-boundary summary {\n cursor:pointer!important;color:#27302d!important;-webkit-text-fill-color:#27302d!important;\n font:400 16px/1.5 Nunito,Arial,sans-serif!important;\n}\nhtml:root:root body #khaeHighFormativeEvidence .khae-high-formative-boundary p {\n margin:12px 0 0!important;font:400 16px/1.6 Nunito,Arial,sans-serif!important;\n color:#47544b!important;-webkit-text-fill-color:#47544b!important;\n}\n@media(max-width:650px){\n html:root:root body #khaeHighFormativeEvidence {padding:24px 17px!important;margin:25px auto!important}\n html:root:root body #khaeHighFormativeEvidence .khae-high-formative-grid{gap:18px!important}\n}\n@media print{#khaeHighFormativeEvidence{display:none!important}}\n";
 global.document.head?.appendChild(s);
}
function mount(){
 if(!global.document||global.document.getElementById("khaeHighFormativeEvidence"))return;
 const context=global.KhaemenesHighLearningContext;if(!context?.recordFormative)return;
 style();const meta=courseMeta(),box=global.document.createElement("section"),saved=alreadySaved();
 box.id="khaeHighFormativeEvidence";box.className="khae-high-formative";
 box.innerHTML='<div class="khae-high-formative-heading"><p class="khae-formative-eyebrow">End-of-lesson reflection</p><h2>Lesson Evidence</h2><p class="copy">Take a moment to reflect on your learning. This is not graded.</p></div><div class="khae-high-formative-grid"><label class="khae-high-formative-field"><span class="khae-formative-label"><span class="khae-formative-step">01</span>What can you explain now?</span><textarea data-focus maxlength="'+MAX_FOCUS+'" placeholder="Explain an idea, method, source, or result in your own words."></textarea></label><label class="khae-high-formative-field"><span class="khae-formative-label"><span class="khae-formative-step">02</span>What still needs practice?</span><textarea data-review maxlength="240" placeholder="Name a skill, term, or idea to revisit."></textarea></label><label class="khae-high-formative-field"><span class="khae-formative-label"><span class="khae-formative-step">03</span>How ready do you feel?</span><select data-readiness><option value="ready-to-explain">Ready to explain or apply it</option><option value="need-another-example">I need another example</option><option value="need-mentor-help">I need Mentor help</option></select></label></div><div class="khae-high-formative-actions"><button type="button" class="primary" data-save '+(saved?'disabled aria-disabled="true"':'')+'>'+(saved?'Lesson Evidence Saved Today':'Save Lesson Evidence')+'</button><a class="khae-formative-mentor" href="'+esc(mentorHref(meta))+'">Need help? Ask Archaemenes</a></div><div class="khae-high-formative-status" role="status" aria-live="polite">'+(saved?'A formative reflection for this page is already saved today.':'')+'</div><details class="khae-high-formative-boundary"><summary>About this reflection</summary><p>Formative reflections cannot award mastery, change a score, unlock curriculum, alter placement, or replace essays, laboratories, projects, oral defense, portfolios, or course-specific assessments.</p></details>';
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
 const upper=path.match(/\/courses\/science\/(biology-10|chemistry-11|physics-engineering-12)\/weeks\/week-\d{2}\/lessons\/day-(\d{2})\.html$/);
 const grade9=path.match(/\/courses\/science\/integrated-science-9\/units\/unit-(\d{2})\/lessons\/day-(\d{2})\.html$/);
 if(!upper&&!grade9)return;
 if(upper){
   const day=Number(upper[2]);if(day<3||day>5)return;
 }else{
   const day=Number(grade9[2]);if(day!==5&&day!==10)return;
   const evidenceText=String(global.document?.querySelector("h1")?.textContent||"")+" "+String(global.document?.querySelector(".unit-lead")?.textContent||"");
   if(!/(laboratory|investigation|survey|design|evidence|data|model|capstone)/i.test(evidenceText))return;
 }
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
