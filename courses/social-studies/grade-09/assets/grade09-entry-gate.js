(() => {
'use strict';
const records=window.KhaemenesSS9Records,contract=window.KhaemenesCourseEntryContract;
const read=(key,fallback=null)=>{try{return JSON.parse(records.storage.getItem(key)||'null')??fallback}catch{return fallback}};
const strands=['claim_evidence_inference','source_provenance_corroboration','chronology_causation_change','geography_maps_networks','data_quantitative_reasoning','argument_comparison_ethics'];
const passed=r=>contract?.isReady?.(r,strands,'grade09-global-studies-honors')|| (r?.route==='advance'&&typeof r.overall_percent==='number'&&r.overall_percent>=(contract?.overallReadyPercent||80)&&strands.every(s=>typeof r.strand_scores?.[s]==='number'&&r.strand_scores[s]>=(contract?.essentialStrandFloorPercent||80)&&r.strand_scores[s]<=100));
function decision(){
 if(!records||records.isBlocked())return {allow:false,title:'Saved work needs attention',message:'Saving is paused. Preserve your work and resolve the record warning before continuing.',href:'index.html',label:'Course Entrance'};
 const db=read('khaemenes_grade09_social_studies_v1',{});
 if(records.isBlocked())return {allow:false,title:'Saved work needs attention',message:'The stored course record was preserved. Resolve the visible record warning.',href:'index.html',label:'Course Entrance'};
 const s=Array.isArray(db.students)?db.students.find(s=>s.id===db.activeId):null;
 const hasReturningWork=Boolean(s&&(
   Object.values(s.completedLessons||{}).some(days=>Array.isArray(days)&&days.some(Boolean))||
   Object.keys(s.assignments||{}).length||
   Object.keys(s.quizzes||{}).length||
   Object.keys(s.exams||{}).length
 ));
 const foundations=read('khaemenes_ss9_unit0_v2',{});
 if(passed(foundations.gateway)&&['P1','P2','P3','P4','P5','P6'].every(p=>typeof foundations.mastery?.[p]?.best==='number'&&foundations.mastery[p].best>=80))return {allow:true,pathway:'supported_42_week'};
 const readiness=read('khaemenes_ss9_readiness_v1');
 if(records.isBlocked())return {allow:false,title:'Saved placement needs attention',message:'The placement record was preserved. Resolve the record warning before continuing.',href:'index.html',label:'Course Entrance'};
 if(passed(readiness))return {allow:true,pathway:hasReturningWork?'returning_learner':'core_36_week'};
 if(readiness?.route==='unit_0_refresher')return {allow:false,title:'Continue your foundations',message:'Build the six foundation strands at your own pace. There is no calendar deadline.',href:'prep/index.html',label:'Open Foundations'};
 if(hasReturningWork)return {allow:false,title:'Complete readiness before resuming',message:'Your saved Global Studies work is preserved. Complete the readiness or foundations pathway before resuming official lessons.',href:'assessments/readiness.html',label:'Open Readiness'};
 return {allow:false,title:'Begin with readiness when you are ready',message:'This low-stakes check identifies support before the first official lesson. Take your time.',href:'assessments/readiness.html',label:'Open Readiness'};
}
function mount(result){
 if(result.allow){document.documentElement.dataset.grade09Entry='open';return;}
 const script=document.currentScript||document.querySelector('script[src*="grade09-entry-gate"]');const base=new URL('../',script?.src||location.href);
 const gate=document.createElement('section');gate.className='grade09-entry-gate';gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');gate.setAttribute('aria-labelledby','grade09EntryTitle');
 gate.style.cssText='position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;background:#08111ff5;color:white';
 const card=document.createElement('article');card.style.cssText='max-width:650px;padding:26px;border:1px solid #ead39a;border-radius:7px;background:#0b1c2d';
 const title=document.createElement('h1');title.id='grade09EntryTitle';title.textContent=result.title;title.style.cssText='font-weight:400;font-size:1.6rem';const text=document.createElement('p');text.textContent=result.message;card.append(title,text);
 for(const [path,label] of [[result.href,result.label],['index.html','Course Entrance']]){const a=document.createElement('a');a.href=new URL(path,base).href;a.textContent=label;a.style.cssText='display:inline-block;padding:12px;margin:8px;border:1px solid #ead39a;border-radius:7px;color:#fff';card.append(a);}
 gate.append(card);document.querySelectorAll('body > :not(script)').forEach(e=>{if(e.id!=='ss9-record-error')e.inert=true;});document.body.append(gate);
 const links=Array.from(gate.querySelectorAll('a'));gate.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const i=links.indexOf(document.activeElement);links[(i+(e.shiftKey?-1:1)+links.length)%links.length].focus();}});links[0]?.focus();
}
window.KhaemenesSocialStudies9Entry=Object.freeze({decision,passed});
const run=()=>{if(document.querySelector('[data-ss9-require-entry]'))mount(decision());};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
