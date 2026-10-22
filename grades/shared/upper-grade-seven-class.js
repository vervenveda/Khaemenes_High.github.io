(()=>{"use strict";
const grade=Number(document.body.dataset.grade),root="../../../../",pin=window.KhaemenesHighCoursePins;
if(![10,11,12].includes(grade)||!pin)return;
const el=(t,s)=>{const n=document.createElement(t);if(s!==undefined)n.textContent=s;return n};
const courses=[
["Mathematics","courses/mathematics/"],
["Literature","courses/language-arts/english-"+grade+"/"],
["Social Studies","courses/social-studies/grade-"+grade+"/"],
["Science","courses/science/"+({10:"biology-10",11:"chemistry-11",12:"physics-engineering-12"}[grade])+"/"],
["Physical Education","courses/physical-education/"],
["Foreign Language","https://vervenveda.github.io/Khaemenes_Linguistics.github.io/Halls/"],
["Psychology / Elective","electives/grades/grade-09/psych-101/"]];
const languageOptions=["spanish","french","german","mandarin","japanese","arabic","russian"];
const selected=()=>pin.readLanguageChoices()[String(grade)]||"spanish";
const ids=()=>courses.map((_,i)=>"grade-"+grade+"-period-"+(i+1));
const holder=document.getElementById("upperClasses"),feedback=document.getElementById("status");
function render(){
 holder.replaceChildren();
 const lang=el("select");lang.setAttribute("aria-label","Select foreign language");
 for(const x of languageOptions){const o=el("option",x[0].toUpperCase()+x.slice(1));o.value=x;lang.append(o)}
 lang.value=selected();lang.addEventListener("change",()=>{
  const next=pin.readLanguageChoices();next[String(grade)]=lang.value;
  feedback.textContent=pin.writeLanguageChoices(next)?"Language choice saved.":"Unable to save language choice.";
  render();
 });
 const label=el("label","Language choice ");label.append(lang);holder.append(label);
 const list=el("div");list.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:20px";
 courses.forEach(([subject,route],i)=>{
  const card=el("article");card.style.cssText="border:1px solid #b6a787;border-radius:7px;padding:18px";
  const h=el("h2",(i+1)+". "+subject);card.append(h);
  if(i===5)card.append(el("p",selected()[0].toUpperCase()+selected().slice(1)+" · choose the appropriate course in Linguistics Halls"));
  if(i===0)card.append(el("p","Choose the mathematics course assigned by placement; this door opens the mathematics hall."));
  if(i===6)card.append(el("p","Psychology 101 is available as an elective; confirm the grade's chosen elective."));
  const link=el("a","Open class");link.href=route.startsWith("https:")?route:root+route;card.append(link);
  const id=ids()[i],button=el("button",pin.readPins().includes(id)?"★ Pinned":"☆ Pin class");
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