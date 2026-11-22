import fs from "node:fs";
import assert from "node:assert/strict";

const read=p=>fs.readFileSync(p,"utf8");
const map=JSON.parse(read("courses/science/biology-10/course-map.json"));
const raw=read("courses/science/biology-10/biology10-course-data-v1.js");
const marker="window.KhaemenesBiology10CourseData=";
const data=JSON.parse(raw.slice(raw.indexOf(marker)+marker.length).trim().replace(/;$/,""));
const engine=read("courses/shared/upper-science-instruction-engine-v1.js");

assert.equal(map.weeks.length,36,"Biology map must contain 36 weeks");
assert.equal(data.weeks.length,36,"Biology dashboard payload must contain 36 weeks");
const fields=["title","essentialQuestion","phenomenon","lab","concepts","quantitative","standards","reading"];
for(const w of map.weeks){
  const d=data.weeks.find(x=>x.week===w.week);
  assert.ok(d,"Dashboard data missing Week "+w.week);
  for(const field of fields){
    assert.ok(String(w[field]??"").trim(),"Week "+w.week+" missing "+field);
    assert.equal(String(d[field]??""),String(w[field]??""),"Course-map/dashboard drift Week "+w.week+" "+field);
  }
}
const vague=/^(?:open|read|use|a published|scientific|ngss)\b/i;
const vagueWeeks=map.weeks.filter(w=>![18,36].includes(w.week)&&vague.test(String(w.reading||""))&&!/linked Deep Lesson|lesson page is the required reading/i.test(String(w.reading||"")));
assert.deepEqual(vagueWeeks.map(w=>w.week),[],"Undefined Biology reading placeholders remain");

const required=[
 "essential-question","objectives","phenomenon","safety","explicit-teaching","vocabulary",
 "worked-example","model","guided-practice","quantitative","investigation","independent-practice",
 "misconception","formative-check","retrieval","explanation","cer","evidence-revision",
 "differentiation","teacher-guidance","evidence-handoff","standards"
];
const weeklyQuestion=map.weeks[0].essentialQuestion;
for(let day=1;day<=5;day++){
 const p="courses/science/biology-10/weeks/week-01/lessons/day-"+String(day).padStart(2,"0")+".html";
 const html=read(p);
 assert.ok(html.includes('data-science-engine="upper-science-v1"'),"Week 01 Day "+day+" not mounted to Upper Science engine");
 assert.ok(html.includes("shared/upper-science-instruction-engine-v1.js"),"Week 01 Day "+day+" missing engine loader");
 assert.ok(html.includes(weeklyQuestion),"Week 01 Day "+day+" missing canonical essential question");
 const contracts=[...html.matchAll(/data-science-contract="([^"]+)"/g)].flatMap(m=>m[1].split(/\s+/)).filter(Boolean);
 for(const key of required)assert.ok(contracts.includes(key),"Week 01 Day "+day+" missing curriculum contract "+key);
 const plain=html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&[a-z#0-9]+;/gi," ").replace(/\s+/g," ").trim();
 assert.ok(plain.split(/\s+/).length>=500,"Week 01 Day "+day+" is unexpectedly shallow");
 assert.ok(/Constructed explanation/i.test(html),"Week 01 Day "+day+" lacks constructed explanation/CER task");
}
assert.ok(engine.includes('const VERSION="1.2.0"'),"Upper Science engine must be v1.2.0");
assert.ok(engine.includes("inspectContract"),"Engine curriculum inspection API missing");
assert.ok(engine.includes("CONTRACT[token]===stage.key"),"Explicit curriculum contract must drive stage mapping");
for(const forbidden of ["localStorage","sessionStorage","indexedDB","document.cookie","fetch(","XMLHttpRequest","high-school-global-chrome"]){
 assert.ok(!engine.includes(forbidden),"Engine authority boundary violated: "+forbidden);
}
console.log("PASS: Biology 10 curriculum map and dashboard are synchronized; Week 01 all five deep lessons expose the complete Upper Science curriculum representation contract.");
