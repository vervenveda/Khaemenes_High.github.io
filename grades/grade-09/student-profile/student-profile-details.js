/* Grade 09 learner-specific Personal Details.
 * One module for the Edit Profile controls and student dashboard display.
 * Does not publish online, share with social apps, or alter academic records.
 * Additional details are stored inside the existing learner-scoped profile JSON.
 */
(()=>{"use strict";
const pageGrade=document.body?.dataset.grade||"";
if(["10","11","12"].includes(pageGrade)){
 const registered=window.KhaemenesHighProfileGradeContext?.active?.();
 // Don't mount an editor for another grade or an unselected learner.
 if(!registered||registered.gradeNumber!==Number(pageGrade))return;
}

if(window.KhaemenesHighProfileDetails)return;
const BASE="khaemenes-high-profile-v1";
const LEGACY=[
 ["name","Name"],["pathway","Pathway / Focus"],["interests","Interests"],
 ["goals","Current Goals"],["strengths","Strengths"],["supports","Helpful Supports"],
 ["portfolio","Portfolio / Project Links"]
];
const GROUPS=[
 ["School & Personal Information",[
  ["schoolName","School Name","fixed","Khaemenes Academy"],
  ["age","Age","number"],["dateOfBirth","Date of Birth","date"],
  ["grade","Grade","fixed","Grade 9"],
  ["teacherName","Teacher Name","text"],["schoolYear","School Year","text"],
  ["gender","Male / Female","gender"],
  ["graduationYear","Expected Graduation Year","text"]
 ]],
 ["Interests, Learning & Activities",[
  ["hobbies","Hobbies","textarea"],
  ["educationalGoals","Educational Goals","textarea"],
  ["academicAwards","Academic Awards (student reported)","textarea"],
  ["personalSkills","Personal Skills","textarea"],
  ["extracurricular","Extracurricular Activities — Clubs, Organizations, Sports","textarea"],
  ["volunteering","Volunteering / Community Service","textarea"]
 ]],
 ["My Favorites",[
  ["favoriteBook","Book","text"],["favoriteSport","Sport","text"],
  ["favoriteColor","Color","text"],["favoriteFood","Food","text"],
  ["favoriteMovie","Movie","text"],["favoriteTV","TV Show","text"],
  ["favoriteHoliday","Holiday","text"],["favoriteSubject","School Subject","text"],
  ["favoriteHobby","Hobby","text"],["favoriteGame","Game","text"],
  ["favoritePlace","Place to Go","text"],["favoriteFamilyActivity","Family Activity","text"],
  ["favoriteAnimal","Animal","text"],
  ["favoriteSong","Song","text"],["favoriteSeason","Season","text"]
 ]],
 ["My Dreams & My Academy",[
  ["futureCareer","I Want to Be…","text"],
  ["wordOne","One Word That Describes Me","text"],
  ["wordTwo","Second Word That Describes Me","text"],
  ["wordThree","Third Word That Describes Me","text"],
  ["favoriteAcademyThing","My Favorite Thing About Khaemenes Academy","textarea"],
  ["favoriteMentor","My Favorite AI Mentor","text"]
 ]]
];
const entries=[...LEGACY.map(([id,label])=>({id,label,legacy:true,group:"Original Profile Details"})),
 ...GROUPS.flatMap(([group,fields])=>fields.map(([id,label,type,defaultValue])=>({id,label,type,defaultValue,group})))];
const selectors=new Map(), editors=new Map();
const tag=(name,txt)=>{const node=document.createElement(name);if(txt!==undefined)node.textContent=txt;return node};
function activeLearner(){
 try{
  const id=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
  const registry=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
  if(typeof id!=="string"||registry?.learners?.[id]?.learnerId!==id)return null;
  const contract=window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId;
  const shared=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
  if((contract&&String(contract)!==id)||(shared&&String(shared)!==id))return null;
  return id;
 }catch{return null}
}
function selectedProfile(){
 const id=activeLearner();if(!id)return null;
 try{
  const raw=localStorage.getItem(BASE+":learner:"+encodeURIComponent(id));
  const data=raw?JSON.parse(raw):{};
  if(!data||typeof data!=="object"||Array.isArray(data))return null;
  if(data.learnerId&&data.learnerId!==id)return null;
  if(data.grade&&!["9","09","10","11","12"].includes(String(data.grade)))return null;
  return data;
 }catch{return null}
}
function registeredGradeLabel(){
 try{
  const id=activeLearner();
  const record=id?JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null")?.learners?.[id]:null;
  const grade=String(record?.grade||"");
  return record?.stage==="high"&&["9","09","10","11","12"].includes(grade)?"Grade "+Number(grade):"Grade 9";
 }catch{return "Grade 9"}
}
function optionRow(label,id){
 const wrapper=tag("label");
 wrapper.style.cssText="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 7px;color:#243038;font:400 16px/1.35 Nunito,Arial,sans-serif;cursor:pointer";
 const checkbox=tag("input");checkbox.type="checkbox";
 checkbox.setAttribute("aria-label","Show "+label+" on My Student Profile");
 checkbox.style.cssText="box-sizing:border-box;width:20px;height:20px;flex:none;margin:0;accent-color:#243c33";
 const span=tag("span","Show on My Student Profile");
 wrapper.append(checkbox,span);
 selectors.set(id,checkbox);
 return wrapper;
}
function mountEditor(){
 const save=document.getElementById("saveProfile");if(!save)return false;
 const card=save.closest(".card");
 if(!card||document.getElementById("grade09ExtendedDetails"))return false;
 for(const [id,label] of LEGACY){
  const input=document.getElementById(id);
  const field=input?.closest(".field");
  if(field)field.insertBefore(optionRow(label,id),field.firstChild);
 }
 const container=tag("section");container.id="grade09ExtendedDetails";
 container.style.cssText="display:grid;gap:13px;min-width:0;margin:18px 0 0 18px;padding-top:16px;max-width:calc(100% - 18px);border-top:1px solid #c3b59a";
 const h=tag("h3","More About Me");h.style.cssText="margin:0;color:#243038;font:400 24px/1.3 Cinzel,Georgia,serif";
 const info=tag("p","Optional student information. Check Show on My Student Profile beside each item to display it below your photograph. Nothing is automatically published to the web or Bazaar Art. Public sharing requires a separate future permission process.");
 info.style.cssText="margin:0 0 6px;color:#243038;font:400 16px/1.55 Nunito,Arial,sans-serif";
 container.append(h,info);
 for(const [group,fields] of GROUPS){
  const details=tag("details");details.open=group==="School & Personal Information";
  details.style.cssText="box-sizing:border-box;min-width:0;padding:12px;border:1px solid #c8b89a;border-radius:7px;background:#f7f1e6";
  const summary=tag("summary",group);summary.style.cssText="cursor:pointer;color:#243038;font:400 21px/1.3 Cinzel,Georgia,serif;padding:5px";
  const grid=tag("div");
  // Keep complete desktop rows: 8 School cards in two columns;
  // 15 Favorite cards in three columns. Responsive auto-fit collapses naturally.
  const isSchool=group==="School & Personal Information";
  const isFavorites=group==="My Favorites";
  const maxWidth=isSchool?"850px":isFavorites?"900px":"100%";
  const minCard=isSchool?"330px":isFavorites?"260px":"260px";
  grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,"+minCard+"),1fr));gap:13px;margin:12px auto 0;max-width:"+maxWidth+";width:100%";
  for(const [id,label,type,defaultValue] of fields){
   const box=tag("div");box.className="grade09-extra-field";
   box.style.cssText="display:grid;align-content:start;gap:5px;min-width:0;border:1px solid #d3c6ad;border-radius:7px;padding:10px;background:#fffdf8";
   const toggle=optionRow(label,id);
   const cap=tag("label",label);cap.setAttribute("for","grade09Detail-"+id);
   cap.style.cssText="color:#243038;font:400 16px/1.35 Nunito,Arial,sans-serif";
   let control;
   if(type==="textarea"){control=tag("textarea");control.rows=3;control.maxLength=2000}
   else if(type==="gender"){
    control=tag("select");
    for(const [value,text] of [["","Choose (optional)"],["Female","Female"],["Male","Male"],["Prefer not to say","Prefer not to say"]]){
     const option=tag("option",text);option.value=value;control.append(option);
    }
   }else{control=tag("input");control.type=type==="fixed"?"text":type;
    if(type==="number"){control.min="0";control.max="120";control.step="1"}
    control.maxLength=160;
   }
   control.id="grade09Detail-"+id;
   control.style.cssText="box-sizing:border-box;width:100%;max-width:100%;min-width:0;min-height:44px;padding:9px;border:1px solid #b8ac98;border-radius:7px;background:#fffaf0;color:#243038;font:400 16px/1.4 Nunito,Arial,sans-serif";
   if(type==="fixed"){control.readOnly=true;control.value=defaultValue}
   control.setAttribute("autocomplete","off");
   editors.set(id,control);
   box.append(toggle,cap,control);grid.append(box);
  }
  details.append(summary,grid);container.append(details);
 }
 // Dedicated optional portfolio workspace — a navigation section, not another
 // editable questionnaire or a second learner record. Idempotent on remount.
 if(!document.getElementById("highStudentPortfolioSection")){
  const section=tag("details");section.id="highStudentPortfolioSection";
  section.style.cssText="box-sizing:border-box;min-width:0;padding:12px;border:1px solid #c8b89a;border-radius:7px;background:#f7f1e6";
  const heading=tag("summary","Student Portfolio");
  heading.style.cssText="cursor:pointer;color:#243038;font:400 21px/1.3 Cinzel,Georgia,serif;padding:5px";
  const area=tag("div");area.style.cssText="display:grid;gap:12px;padding:14px 9px 8px;color:#243038";
  const explanation=tag("p","Continue to your Academy Portfolio Studio for additional learning-workspace features and personal learning evidence. Your High School picture, questionnaire, goals, and grade-specific classes stay managed in their existing places.");
  explanation.style.cssText="margin:0;color:#243038;font:400 16px/1.55 Nunito,Arial,sans-serif";
  const link=tag("a","Open Student Portfolio Studio");
  link.href="https://vervenveda.com/Khaemenes_Academy.github.io/student/profile.html#profileStudio";
  link.className="btn secondary";
  link.style.cssText="display:inline-flex;align-items:center;justify-content:center;justify-self:start;min-height:48px;padding:10px 16px;border:1px solid #243038;border-radius:7px;background:#243038;color:#fff8e9;-webkit-text-fill-color:#fff8e9;text-decoration:none;font:400 16px/1.4 Nunito,Arial,sans-serif";
  area.append(explanation,link);
  section.append(heading,area);
  container.append(section);
 }
 const actions=save.closest(".actions");
 card.insertBefore(container,actions);
 return true;
}
function load(profile){
 const data=profile&&typeof profile==="object"?profile:{};
 const record=data.studentDetailsV1&&typeof data.studentDetailsV1==="object"?data.studentDetailsV1:{};
 const values=record.values&&typeof record.values==="object"?record.values:{};
 const shown=record.visible&&typeof record.visible==="object"?record.visible:{};
 for(const entry of entries){
  const selector=selectors.get(entry.id);if(selector)selector.checked=shown[entry.id]===true;
  const control=editors.get(entry.id);if(control){
   const value=entry.type==="fixed"?(entry.id==="grade"?registeredGradeLabel():entry.defaultValue):(typeof values[entry.id]==="string"?values[entry.id]:"");
   control.value=value;
  }
 }
}
function collect(){
 const values={},visible={};
 for(const entry of entries){
  const c=editors.get(entry.id);
  if(c)values[entry.id]=entry.type==="fixed"?(entry.id==="grade"?registeredGradeLabel():entry.defaultValue):String(c.value||"").slice(0,2000).trim();
  visible[entry.id]=selectors.get(entry.id)?.checked===true;
 }
 return {version:1,values,visible};
}
function renderDashboard(){
 const photo=document.querySelector(".grade09-profile-first .profile-row");
 if(!photo)return;
 const details=photo.querySelector(".grade09-identity-details")||photo.querySelector(".profile-name")?.parentElement;
 if(!details)return;
 let area=document.getElementById("grade09VisibleProfileDetails");
 if(!area){area=tag("section");area.id="grade09VisibleProfileDetails";
  area.setAttribute("aria-label","Selected student profile details");
  area.style.cssText="box-sizing:border-box;width:100%;min-width:0;max-width:100%;margin-top:15px;padding-top:12px;border-top:1px solid currentColor;color:inherit;font:400 16px/1.5 Nunito,Arial,sans-serif";
  details.append(area);
 }
 area.replaceChildren();
 const person=activeLearner(),profile=person?selectedProfile():null;
 if(!person||!profile){area.hidden=true;return}
 const record=profile.studentDetailsV1||{};
 const values=record.values||{},shown=record.visible||{};
 let displayed=0;
 const groups=[["Original Profile Details",LEGACY.map(([id,label])=>({id,label,legacy:true}))],
  ...GROUPS.map(([group,fields])=>[group,fields.map(([id,label,type,defaultValue])=>({id,label,type,defaultValue}))])];
 for(const [group,fields] of groups){
  const visible=fields.flatMap(field=>{
   if(shown[field.id]!==true)return [];
   const value=field.legacy?String(profile[field.id]||"").trim():
      field.type==="fixed"?(field.id==="grade"?registeredGradeLabel():field.defaultValue):String(values[field.id]||"").trim();
   return value?[{label:field.label,value:value.slice(0,2000)}]:[];
  });
  if(!visible.length)continue;
  const heading=tag("h3",group);
  heading.style.cssText="margin:12px 0 8px;color:inherit;font:400 19px/1.3 Cinzel,Georgia,serif";
  const list=tag("dl");list.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:9px;margin:0";
  for(const item of visible){
   const pair=tag("div");pair.style.cssText="box-sizing:border-box;min-width:0;padding:8px;border:1px solid currentColor;border-radius:7px";
   const label=tag("dt",item.label);label.style.cssText="font:400 16px/1.4 Nunito,Arial,sans-serif;opacity:.85";
   const value=tag("dd",item.value);value.style.cssText="margin:4px 0 0;font:400 16px/1.5 Nunito,Arial,sans-serif;white-space:pre-wrap;overflow-wrap:anywhere";
   pair.append(label,value);list.append(pair);
  }
  area.append(heading,list);displayed+=visible.length;
 }
 area.hidden=!displayed;
}
window.KhaemenesHighProfileDetails=Object.freeze({load,collect,render:renderDashboard,fieldCount:entries.length});
if(document.getElementById("saveProfile"))mountEditor();
else if(document.getElementById("avatar")){renderDashboard();
 for(const event of ["pageshow","khaemenes-student-profile-changed","storage"])
  window.addEventListener(event,renderDashboard);
}
})();