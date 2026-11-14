/* Biology 10 advanced studio persistence · learner-scoped through learner-scope-v1.js */
(()=>{"use strict";
const body=document.body,id=body?.dataset?.studioId;if(!id)return;
const key="khaemenes-biology-10-v1:studio:"+id;
const fields=[...document.querySelectorAll("[data-studio-field]")];
let stored={};
try{stored=JSON.parse(localStorage.getItem(key)||"{}")||{}}catch{}
for(const el of fields){const name=el.dataset.studioField;if(Object.hasOwn(stored,name))el.value=stored[name];el.addEventListener("input",save)}
function snapshot(){return Object.fromEntries(fields.map(el=>[el.dataset.studioField,el.value]))}
function save(){try{localStorage.setItem(key,JSON.stringify(snapshot()))}catch{}}
document.querySelector("[data-studio-export]")?.addEventListener("click",()=>{const payload={schema:"khaemenes-biology10-studio-evidence-v1",course:"KH-SCI-BIO10",studio:id,authority:"learner-formative-evidence-only",exportedAt:new Date().toISOString(),fields:snapshot()};const u=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"})),a=document.createElement("a");a.href=u;a.download="biology10-"+id+"-evidence.json";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)});
})();
