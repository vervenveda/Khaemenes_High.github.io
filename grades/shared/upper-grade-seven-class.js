(()=>{"use strict";
const grade=Number(document.body.dataset.grade),root="../../../",pin=window.KhaemenesHighCoursePins;
const continuation=window.KhaemenesLearningContinuation,profile=window.KhaemenesStudentProfileV2;
if(![10,11,12].includes(grade)||!pin)return;
const el=(t,s)=>{const n=document.createElement(t);if(s!==undefined)n.textContent=s;return n};
const courses=({
10:[
["Mathematics","courses/mathematics/algebra-1/","algebra-1"],
["Literature","courses/language-arts/english-10/","english-10"],
["Social Studies","courses/social-studies/grade-10/","social-studies-10"],
["Science","courses/science/biology-10/","biology-10"],
["Physical Education","courses/physical-education/","physical-education-10"],
["Foreign Language","https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/","world-language-10"],
["Elective","courses/electives/","elective-10"]],
11:[
["Mathematics","courses/mathematics/geometry/","geometry"],
["Literature","courses/language-arts/english-11/","english-11"],
["Social Studies","courses/social-studies/grade-11/","social-studies-11"],
["Science","courses/science/chemistry-11/","chemistry-11"],
["Physical Education","courses/physical-education/","physical-education-11"],
["Foreign Language","https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/","world-language-11"],
["Elective","courses/electives/","elective-11"]],
12:[
["Mathematics","courses/mathematics/algebra-2/","algebra-2"],
["Literature","courses/language-arts/english-12/","english-12"],
["Social Studies","courses/social-studies/grade-12/","social-studies-12"],
["Science","courses/science/physics-engineering-12/","physics-engineering-12"],
["Physical Education","courses/physical-education/","physical-education-12"],
["Foreign Language","https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/","world-language-12"],
["Elective","courses/electives/","elective-12"]]
})[grade];
const languageOptions=["spanish","french","german","mandarin","japanese","arabic","russian"];
const selected=()=>pin.readLanguageChoices()[String(grade)]||"spanish";
const ids=()=>courses.map(item=>item[2]);
const legacyIds=()=>courses.map((_,i)=>"grade-"+grade+"-period-"+(i+1));
function languageRoute(){
 const id=selected(),params=new URLSearchParams({language:id,source:"khaemenes-high-grade"+grade});
 if(["arabic","russian"].includes(id))params.set("mode","atlas");
 return "https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?"+params.toString();
}
function migrateLegacyPins(){
 const current=pin.readPins(),legacy=legacyIds();let changed=false;
 const next=current.map(value=>{const at=legacy.indexOf(value);if(at<0)return value;changed=true;return ids()[at]});
 if(changed)pin.writePins([...new Set(next)]);
}
function learnerId(){return profile?.activeLearner?.()?.learnerId||pin.activeLearner?.()||null}
function snapshots(){const id=learnerId();return id&&continuation?.readLearner?continuation.readLearner(id):[]}
function snapshotFor(id,subject){
 const list=snapshots(),exact=list.find(s=>s.courseId===id);if(exact)return exact;
 return list.find(s=>String(s.grade||"").replace(/^0/,"")===String(grade)&&String(s.subject||"").toLowerCase().includes(String(subject||"").split(" ")[0].toLowerCase()))||null;
}
function stepFor(id,subject,route,index){
 const s=snapshotFor(id,subject),fallback=index===5?languageRoute():(route.startsWith("https:")?route:root+route);
 return {href:s?.nextHref||fallback,label:s?.stale?"Refresh":({corrections:"Review",mastery:"Mastery",assessment:"Assessment",complete:"Review Record"})[s?.status]||"Open class",detail:s?.stale?"Progress changed in the course. Open it to refresh this summary.":(s?.nextTitle||s?.summary||"Ready to open."),status:s?.status||"continue",snapshot:s};
}
const holder=document.getElementById("upperClasses"),feedback=document.getElementById("status");
function render(){
 migrateLegacyPins();
 holder.replaceChildren();
 const learner=profile?.activeLearner?.(),name=learner?.nickname||learner?.displayName||learner?.name||"Student";
 const identity=el("section");identity.style.cssText="border:1px solid #b6a787;border-radius:7px;padding:18px;margin-bottom:16px;background:#15243a";
 identity.append(el("h2",name),el("p","Grade "+grade+" · learner-owned schedule and continuation workspace"));
 const profileLink=el("a","Open Academy Learning Profile");profileLink.href="https://vervenveda.com/Khaemenes_Academy.github.io/student/";identity.append(profileLink);holder.append(identity);
 const steps=courses.map(([subject,route,id],i)=>({subject,route,id,i,step:stepFor(id,subject,route,i)}));
 const priority=steps.find(x=>x.step.snapshot&&x.step.status!=="complete")||steps[0];
 const today=el("section");today.style.cssText="border:1px solid #b6a787;border-radius:7px;padding:18px;margin-bottom:16px;background:#1b2d46";
 today.append(el("h2","Learning Today"),el("p",(priority.i===5?selected()[0].toUpperCase()+selected().slice(1):courses[priority.i][0])+" · "+priority.step.detail));
 const todayLink=el("a",priority.step.label);todayLink.href=priority.step.href;today.append(todayLink);holder.append(today);
 const lang=el("select");lang.setAttribute("aria-label","Select foreign language");
 for(const x of languageOptions){const o=el("option",x[0].toUpperCase()+x.slice(1));o.value=x;lang.append(o)}
 lang.value=selected();lang.addEventListener("change",()=>{
  const next=pin.readLanguageChoices();next[String(grade)]=lang.value;
  feedback.textContent=pin.writeLanguageChoices(next)?"Language choice saved.":"Unable to save language choice.";
  render();
 });
 const label=el("label","Language choice ");label.append(lang);holder.append(label);
 const list=el("div");list.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:20px";
 courses.forEach(([subject,route,id],i)=>{
  const card=el("article");card.style.cssText="border:1px solid #b6a787;border-radius:7px;padding:18px";
  const h=el("h2",(i+1)+". "+subject);card.append(h);
  if(i===5)card.append(el("p",selected()[0].toUpperCase()+selected().slice(1)+" · learner-selected language"));
  if(i===0)card.append(el("p","This grade's mathematics doorway opens the assigned course. Placement and mastery remain course-owned."));
  if(i===6)card.append(el("p","Open the electives hall for the learner's selected elective."));
  const step=stepFor(id,subject,route,i);
  card.append(el("p",step.detail));
  const link=el("a",step.label);link.href=step.href;card.append(link);
  const button=el("button",pin.readPins().includes(id)?"★ Pinned":"☆ Pin class");
  button.type="button";button.style.marginLeft="14px";button.setAttribute("aria-pressed",String(pin.readPins().includes(id)));
  button.addEventListener("click",()=>{const current=pin.readPins(),newPins=current.includes(id)?current.filter(x=>x!==id):[...current,id];feedback.textContent=pin.writePins(newPins)?"Saved class preferences.":"Unable to save pinned classes.";render()});
  card.append(button);list.append(card);
 });
 holder.append(list);
 const all=el("button","Pin all seven classes");all.type="button";all.style.marginTop="18px";
 all.addEventListener("click",()=>{const merged=[...new Set([...pin.readPins(),...ids()])];feedback.textContent=pin.writePins(merged)?"Seven classes pinned.":"Unable to save all classes.";render()});
 holder.append(all);
}
render();window.addEventListener("storage",render);
})();