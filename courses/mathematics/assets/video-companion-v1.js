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
let lesson=fileLesson?.[2]||(/u\d{2}-l(\d{2})/i.exec(bodyLesson)?.[1])||namedLesson?.[1]||(/^(\d{1,2})$/.exec(bodyLesson)?.[1]);
if(!unit||!lesson)return;
const u=String(Number(unit)).padStart(2,"0"),l=String(Number(lesson)).padStart(2,"0");
const courseCode={"algebra-1":"A1","geometry":"GEO","algebra-2":"A2"}[course];
const lessonId=`KH-MATH-${courseCode}-U${u}-L${l}`;
const mathRoot=new URL("../",own.src);
const courseRoot=new URL(course+"/",mathRoot);
const mapURL=new URL("video-map.json",courseRoot);
const escape=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
async function loadJSON(url){const r=await fetch(url,{credentials:"same-origin"});if(!r.ok)throw new Error("resource unavailable");return r.json()}
function approvedPlacement(record){return record?.enabled===true&&record?.release_approved===true}
function blockedCurriculumPlatform(asset){const name=String(asset?.instructor||asset?.publisher||"").toLowerCase();return name.includes("khan academy")}
function approvedAsset(asset){
 if(blockedCurriculumPlatform(asset)||asset?.enabled!==true)return false;
 const c=asset?.certification;
 if(!c||c.student_release_approved!==true||c.whole_video_reviewed!==true||
    c.privacy_embed_verified!==true||c.captions_verified!==true||
    c.responsive_lesson_rendering_verified!==true||c.transcript_or_text_fallback_verified!==true||
    c.topic_alignment_verified!==true||asset.playback_verified!==true||
    asset.captions_verified!==true)return false;
 try{
   const url=new URL(asset.embed_url);
   return url.protocol==="https:"&&url.hostname==="www.youtube-nocookie.com"&&
     /^\/embed\/[A-Za-z0-9_-]{11}$/.test(url.pathname)&&
     !url.search&&!url.hash&&asset.provider==="youtube"&&
     url.pathname.endsWith("/"+asset.video_id);
 }catch{return false}
}
function makeCard(record,asset,index){
 const section=document.createElement("section");
 section.className="lesson-section math-video-companion";
 section.dataset.assetId=asset.asset_id||"";
 section.style.cssText="border:1px solid rgba(169,137,84,.7);border-radius:7px;padding:18px;margin:18px 0;background:rgba(255,249,237,.96);color:#30281e";
 const title=escape(asset.title||"Optional lesson video");
 const note=escape(record.alignment_note||"Optional video companion for this lesson.");
 const embed=escape(asset.embed_url);
 const headingId=`khaeVideoCompanionTitle-${index}`;
 section.setAttribute("aria-labelledby",headingId);
 section.innerHTML=`<p style="font-size:13px;letter-spacing:.07em;text-transform:uppercase;margin:0 0 7px">Optional video · formative support</p><h2 id="${headingId}" style="font-weight:400">${title}</h2><p>${note}</p><div style="aspect-ratio:16/9;width:100%;overflow:hidden;border-radius:7px;background:#111"><iframe title="${title}" loading="lazy" src="${embed}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="width:100%;height:100%;border:0"></iframe></div><p style="font-size:.9rem;margin-bottom:0">This optional video does not award mastery or unlock course progress. If video is unavailable, use the lesson reading and worked examples.</p>`;
 return section;
}
function insertCards(items){
 const main=document.querySelector("main");if(!main||!items.length||document.getElementById("khaeVideoCompanions"))return;
 const host=main.querySelector(".lesson-main,.lesson-content,.lesson-body")||main;
 const wrap=document.createElement("div");wrap.id="khaeVideoCompanions";wrap.className="math-video-companions";
 items.forEach((item,index)=>wrap.appendChild(makeCard(item.record,item.asset,index+1)));
 host.insertBefore(wrap,host.firstChild);
}
(async()=>{try{
 const map=await loadJSON(mapURL);
 const placements=(map.placements||[]).filter(x=>x.lesson_id===lessonId&&approvedPlacement(x));
 if(!placements.length)return;
 const items=[];
 for(const record of placements){
   try{
     const assetURL=new URL(record.shared_file,mapURL);
     const asset=await loadJSON(assetURL);
     if(approvedAsset(asset))items.push({record,asset});
   }catch{}
 }
 insertCards(items);
}catch{}})();
})();