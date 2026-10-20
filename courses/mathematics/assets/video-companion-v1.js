(()=>{"use strict";
const own=document.currentScript;
if(!own)return;
const path=location.pathname;
const course=/\/mathematics\/(pre-algebra|algebra-1|geometry|algebra-2)\//.exec(path)?.[1];
if(!course||course==="pre-algebra")return;
const unit=/\/unit-(\d{1,2})\//.exec(path)?.[1];
const fileLesson=/\/u(\d{2})-l(\d{2})\.html$/i.exec(path);
const namedLesson=/\/lesson-(\d{1,2})-[^/]+\.html$/i.exec(path);
const bodyLesson=document.body?.dataset?.lessonId||document.body?.dataset?.lesson||"";
let lesson= fileLesson?.[2] || (/u\d{2}-l(\d{2})/i.exec(bodyLesson)?.[1]) || namedLesson?.[1] || (/^(\d{1,2})$/.exec(bodyLesson)?.[1]);
if(!unit||!lesson)return;
const u=String(Number(unit)).padStart(2,"0"),l=String(Number(lesson)).padStart(2,"0");
const courseCode={"algebra-1":"A1","geometry":"GEO","algebra-2":"A2"}[course];
const lessonId=`KH-MATH-${courseCode}-U${u}-L${l}`;
const mathRoot=new URL("../",own.src);
const courseRoot=new URL(course+"/",mathRoot);
const mapURL=new URL("video-map.json",courseRoot);
const escape=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
async function loadJSON(url){const r=await fetch(url,{credentials:"same-origin"});if(!r.ok)throw new Error("resource unavailable");return r.json()}
function insertCard(record,asset){
 const main=document.querySelector("main"); if(!main||document.getElementById("khaeVideoCompanion"))return;
 const section=document.createElement("section");section.id="khaeVideoCompanion";section.className="lesson-section math-video-companion";
 section.style.cssText="border:1px solid rgba(169,137,84,.7);border-radius:7px;padding:18px;margin:18px 0;background:rgba(255,249,237,.96);color:#30281e";
 const title=escape(asset.title||"Optional lesson video");
 const note=escape(record.alignment_note||"Optional video companion for this lesson.");
 const embed=asset.embed_url;
 section.innerHTML=`<p style="font-size:13px;letter-spacing:.07em;text-transform:uppercase;margin:0 0 7px">Optional video · formative support</p><h2 style="font-weight:400">${title}</h2><p>${note}</p><div style="aspect-ratio:16/9;width:100%;overflow:hidden;border-radius:7px;background:#111"><iframe title="${title}" loading="lazy" src="${escape(embed)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="width:100%;height:100%;border:0"></iframe></div><p style="font-size:.9rem;margin-bottom:0">This optional video does not award mastery or unlock course progress. If video is unavailable, use the lesson reading and worked examples.</p>`;
 const host=main.querySelector(".lesson-main,.lesson-content,.lesson-body")||main;
 host.insertBefore(section,host.firstChild);
}
(async()=>{try{
 const map=await loadJSON(mapURL);
 const rec=(map.placements||[]).find(x=>x.lesson_id===lessonId&&x.enabled===true);
 if(!rec)return;
 const assetURL=new URL(rec.shared_file,mapURL);
 const asset=await loadJSON(assetURL);
 if(asset.enabled===false||!asset.embed_url)return;
 insertCard(rec,asset);
}catch{}})();
})();