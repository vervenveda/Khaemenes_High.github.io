(()=>{"use strict";
const KEY="khaemenes-chemistry-11-v1:inquiry-ledger";
const $=id=>document.getElementById(id);
const learner=()=>window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId||null;
const initial=learner();
const canUse=()=>!!initial&&learner()===initial&&!!window.KhaemenesLearnerScope;
function read(){if(!canUse())return [];try{let a=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(a)?a:[]}catch{return []}}
function totals(a){let clean=a.filter(x=>Number.isInteger(x.minutes)&&x.minutes>0&&x.minutes<=600);let all=clean.reduce((s,x)=>s+x.minutes,0),inquiry=clean.reduce((s,x)=>s+(x.inquiry===true?x.minutes:0),0);return {all,inquiry,percent:all?Math.round(1000*inquiry/all)/10:0}}
function append(item){if(!canUse()||!Number.isInteger(item.week)||item.week<1||item.week>36||!["Monday","Tuesday","Wednesday","Thursday","Friday"].includes(item.day)||!Number.isInteger(item.minutes)||item.minutes<1||item.minutes>600||typeof item.evidence!=="string"||!item.evidence.trim())return false;const next=read().concat([{...item,recorded:new Date().toISOString(),review:"unverified"}]);try{localStorage.setItem(KEY,JSON.stringify(next))}catch{return false}return true}
function render(){const ok=canUse();$("ledger").hidden=!ok;$("status").textContent=ok?"Local provisional record. This does not authorize private sharing or credit.":"No active or unchanged Academy learner: recording locked. Select a learner and reload.";const data=read(),t=totals(data);$("total").textContent=t.all+" recorded minutes; "+t.inquiry+" inquiry minutes; "+t.percent+"% (uncertified).";$("records").textContent="";for(const x of data){let tr=document.createElement("tr");for(const value of ["Week "+x.week+" · "+x.day,x.minutes,x.inquiry?"Yes":"No",x.evidence]){let td=document.createElement("td");td.textContent=String(value);tr.appendChild(td)}$("records").appendChild(tr)}}
for(let w=1;w<=36;w++){let option=document.createElement("option");option.value=w;option.textContent="Week "+w;$("week").appendChild(option)}
$("ledger").addEventListener("submit",event=>{event.preventDefault();const item={week:Number($("week").value),day:$("day").value,minutes:Number($("minutes").value),inquiry:$("inquiry").checked,evidence:$("evidence").value.trim().slice(0,1200)};if(!append(item)){$("status").textContent="Save blocked. Check learner identity and required fields.";return}$("evidence").value="";$("minutes").value="";render()});
window.addEventListener("storage",render);
window.addEventListener("focus",render);
const printButton=$("printReview");if(printButton)printButton.addEventListener("click",()=>{if(!canUse())return;window.print()});
window.KhaeInquiryLedger=Object.freeze({read,append,totals,canUse});render();
})();