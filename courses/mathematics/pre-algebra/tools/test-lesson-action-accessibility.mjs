import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";

const root="courses/mathematics/pre-algebra";
const official=Array.from({length:13},(_,i)=>"unit-"+String(i+1).padStart(2,"0"));
let lessons=0;
for(const unit of official){
 const dir=path.join(root,"units",unit,"lessons");
 const files=fs.readdirSync(dir).filter(name=>name.endsWith(".html"));
 for(const name of files){
  const file=path.join(dir,name),html=fs.readFileSync(file,"utf8");
  for(const [id,actual] of [["submitPractice","Submit Assignment"],["markComplete","Save Lesson Review"]]){
   const buttons=[...html.matchAll(/<button\b[^>]*\bid="([^"]+)"[^>]*>([^<]*)<\/button>/g)].filter(m=>m[1]===id);
   assert.equal(buttons.length,1,file+": missing or repeated control #"+id);
   assert.equal(buttons[0][2].trim(),actual,file+": visible and static accessible label");
   assert.ok(buttons[0][0].includes('type="button"'),file+": do not submit form accidentally");
  }
  assert.ok(html.includes('id="scoreMessage"'),file+": score status remains available");
  lessons++;
 }
 const css=fs.readFileSync(path.join(root,"units",unit,"assets/unit.css"),"utf8");
 assert.ok(!/#(?:submitPractice|markComplete)::after\s*\{\s*content:/.test(css),unit+": CSS must not invent button text");
 assert.ok(!/#submitPractice\s*,\s*#markComplete\s*\{[^}]*font-size\s*:\s*0/.test(css),unit+": actual label must remain visible");
}
assert.equal(lessons,97,"all 97 official Pre-Algebra lessons inspected");

const enginePath=path.join(root,"assets/prealgebra-generic-lesson-engine-v1.js");
const code=fs.readFileSync(enginePath,"utf8");
new vm.Script(code,{filename:enginePath});
const values=new Map(),elements=new Map();
function el(id){
 if(elements.has(id))return elements.get(id);
 const events={},attrs={};
 const node={
  id,textContent:"",value:"",hidden:false,checked:false,dataset:{},attrs,events,
  addEventListener:(name,cb)=>{events[name]=cb;},setAttribute:(name,v)=>{attrs[name]=v;},
  removeAttribute:(name)=>{delete attrs[name];}
 };
 elements.set(id,node);return node;
}
const lesson={id:"test-lesson-01",title:"Test lesson",mastery_threshold:80,questions:[
 {prompt:"2+2?",options:["3","4","5"],answer:1,explanation:"2+2=4."}
],pathways:{Core:"Study the pattern."},objectives:[],warmup:[],concepts:[],examples:[]};
const unitMap={unit:{number:3,progress_key:"prealgebra-ui-test-record-v1",mastery_threshold:80},lessons:[{id:lesson.id,title:lesson.title,file:"lessons/test.html"}]};
const document={documentElement:{dataset:{}},
 querySelector:sel=>sel==="input[name=\"q0\"]:checked"?(el("answer").chosen?{value:el("answer").value}:null):
 ["#submitPractice","#markComplete","#lessonStatus","#scoreMessage"].includes(sel)?el(sel):null,
 querySelectorAll:()=>[]
};
const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
const context=vm.createContext({document,window:{LESSON_DATA:lesson,UNIT_MAP_FALLBACK:unitMap,VOCAB_FALLBACK:null},localStorage:storage,matchMedia:()=>({matches:false}),console,Date,URL,Blob,setTimeout:()=>0});
vm.runInContext(code,context,{timeout:3000});
const submit=el("#submitPractice"),review=el("#markComplete");
assert.equal(submit.textContent,"Submit Assignment");
assert.equal(submit.attrs["aria-label"],submit.textContent);
assert.equal(review.textContent,"Save Lesson Review");
assert.equal(review.attrs["aria-label"],review.textContent);
assert.equal(review.attrs["aria-pressed"],"false");
review.events.click();
assert.equal(review.textContent,"Remove Lesson Review");
assert.equal(review.attrs["aria-label"],review.textContent);
assert.equal(review.attrs["aria-pressed"],"true");
const afterReview=JSON.parse(values.get(unitMap.unit.progress_key));
assert.equal(afterReview.lessonBestScores?.[lesson.id],undefined,"review is not scored mastery");
assert.ok(afterReview.reviewedLessons.includes(lesson.id),"review mark is recorded separately");
review.events.click();
assert.equal(review.textContent,"Save Lesson Review");
assert.equal(review.attrs["aria-pressed"],"false");
assert.ok(!JSON.parse(values.get(unitMap.unit.progress_key)).reviewedLessons.includes(lesson.id));
el("answer").value="1";el("answer").chosen=true;
submit.events.click();
const saved=JSON.parse(values.get(unitMap.unit.progress_key));
assert.equal(saved.lessonScores[lesson.id],100,"assignment scored at correct percentage");
assert.equal(saved.lessonBestScores[lesson.id],100);
assert.ok(saved.completedLessons.includes(lesson.id),"80% mastery gating preserved");
assert.equal(submit.textContent,"Submit Assignment","submission label remains stable");
assert.equal(review.textContent,"Save Lesson Review","review does not accidentally become mastery");
console.log("PASS: 97 Pre-Algebra lesson button labels, 13 unit styles, dynamic screen-reader labels, independent review toggle, 80% lesson mastery, and no score changes on review.");
