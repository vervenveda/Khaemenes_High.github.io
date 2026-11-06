/* Grade 10 learner-owned eight-class profile view.
 * Read-only: course authority, enrollment, grades and mastery stay with their existing engines.
 * Preserves Grade 09 blueprint and explicitly rejects non-Grade 10 learner context.
 */
(()=>{
"use strict";
const host=document.getElementById("grade09SevenClassSchedule");
if(!host||document.body.dataset.grade!=="10")return;
const catalog=window.KhaemenesHighEightClass,context=window.KhaemenesHighProfileGradeContext;
const create=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
function render(){
 host.replaceChildren();
 const grade=context?.active?.();
 if(!grade||grade.grade!=="10"){
  const notice=create("p","Select your registered Grade 10 Academy learner to see class selections.");
  const go=create("a","Open Family Learner Selection");go.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
  host.append(notice,go);return;
 }
 if(!catalog){
  const note=create("p","The course catalog could not load. Your classes and records have not been changed.");
  host.append(note);return;
 }
 const legend=create("p","Your eight Grade 10 subjects. Course titles and links come from the canonical High School class plan; assessment results remain in the individual courses.");
 const grid=create("div");grid.className="grade10-class-grid";
 for(const slot of catalog.slots(10)){
  const card=create("article");card.className="grade10-class-card";
  const heading=create("h3",slot.label),course=create("p",slot.title);
  card.append(heading,course);
  if(typeof slot.href==="string"&&/^https:\/\//i.test(slot.href)){
   const link=create("a","Open Class");link.href=slot.href;
   card.append(link);
  }else{
   const note=create("p","Course doorway is not yet available. No class has been assigned or graded by this page.");
   card.append(note);
  }
  grid.append(card);
 }
 host.append(legend,grid);
}
render();
window.addEventListener("khaemenes-student-profile-changed",render);
window.addEventListener("pageshow",render);
window.addEventListener("khaemenes-family-changed",render);
window.addEventListener("storage",event=>{
 if(!event.key||/khaemenes_(active_learner|family_registry)/.test(event.key))render();
});
})();
