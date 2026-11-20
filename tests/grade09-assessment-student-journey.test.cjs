const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const tests=[];function check(label,fn){fn();tests.push(label);console.log("PASS",label)}
const store=new Map();
const window={localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))}};
const document={querySelector:()=>null,readyState:"loading",addEventListener:()=>{},createElement:()=>({dataset:{},style:{}}),head:{appendChild:()=>{}}};
const env={window,document,localStorage:window.localStorage,URL,addEventListener:()=>{},console};
const source=read("courses/shared/course-entry-contract.js"),end=source.indexOf("  // Shared Academy continuation contract.");
assert(end>0);vm.runInNewContext(source.slice(0,end)+"})();",env);
const C=window.KhaemenesCourseEntryContract;
const rec=(course,strands,score=80,first=80,route="advance")=>({course_id:course,overall_percent:score,route,strand_scores:Object.fromEntries(strands.map((s,i)=>[s,i?80:first]))});
check("Readiness 79 blocks; 80 passes",()=>{assert(!C.isReady(rec("math",["s"],79),["s"],"math"));assert(C.isReady(rec("math",["s"]),["s"],"math"))});
check("Strand 79, unknown course, missing strand and refresher route block",()=>{
 assert(!C.isReady(rec("science",["s"],90,79),["s"],"science"));
 assert(!C.isReady(rec("wrong",["s"]),["s"],"science"));
 assert(!C.isReady(rec("science",[]),["s"],"science"));
 assert(!C.isReady(rec("science",["s"],90,80,"unit_0_refresher"),["s"],"science"));
});
check("Learner switching prevents stale placement writes",()=>{
 assert.throws(()=>C.writeJSON("test",{}),/Select an Academy learner/);
 store.set("khaemenes_active_learner_v1",JSON.stringify("a"));
 store.set("khaemenes_family_registry_v1",JSON.stringify({learners:{a:{learnerId:"a",nickname:"A"}}}));
 const p=C.readAcademyProfile();C.writeJSON("test",{value:80},p);
 assert.equal(C.readJSON("test",null,p).value,80);
 store.set("khaemenes_active_learner_v1",JSON.stringify("b"));
 assert.throws(()=>C.writeJSON("test",{value:100},p),/learner changed/);
});
const strands=["claim_evidence_inference","source_provenance_corroboration","chronology_causation_change","geography_maps_networks","data_quantitative_reasoning","argument_comparison_ethics"];
function social(readiness,foundation={}){
 const w={KhaemenesCourseEntryContract:C,KhaemenesSS9Records:{isBlocked:()=>false,storage:{getItem:k=>k==="khaemenes_ss9_readiness_v1"?(readiness?JSON.stringify(readiness):null):k==="khaemenes_ss9_unit0_v2"?JSON.stringify(foundation):null}}};
 const e={window:w,document:{readyState:"loading",addEventListener:()=>{}},URL,location:{href:"https://example.org/course/"},console};
 vm.runInNewContext(read("courses/social-studies/grade-09/assets/grade09-entry-gate.js"),e);
 return w.KhaemenesSocialStudies9Entry.decision();
}
check("Social Studies: readiness routes pass or foundations correctly",()=>{
 assert(!social(rec("grade09-global-studies-honors",strands,90,79,"unit_0_refresher")).allow);
 assert(social(rec("grade09-global-studies-honors",strands)).allow);
 const mastery=Object.fromEntries(["P1","P2","P3","P4","P5","P6"].map(p=>[p,{best:80}]));
 assert(social(null,{gateway:rec("grade09-global-studies-honors",strands),mastery}).allow);
 mastery.P6.best=79;
 assert(!social(null,{gateway:rec("grade09-global-studies-honors",strands),mastery}).allow);
});
function science(readiness,foundation,profile={learnerId:"a"}){
 const w={KhaemenesCourseEntryContract:{readAcademyProfile:()=>profile,readJSON:k=>k==="khaemenes_naib_readiness_science9_v1"?[readiness]:foundation,latest:C.latest,isReady:C.isReady}};
 const e={window:w,document:{readyState:"loading",addEventListener:()=>{}},console};
 const s=read("courses/science/integrated-science-9/assets/science9-entry-gate.js"),cut=s.indexOf("/* Canonical Science 9 Academy shell");
 assert(cut>0);vm.runInNewContext(s.slice(0,cut),e);
 return w.KhaemenesScience9Entry.decision();
}
check("Science: no learner or strand 79 blocks, 80 opens, foundations can bridge",()=>{
 const keys=["Scientific practices","Measurement","Data and evidence"];
 const good=rec("integrated-science-9",keys);
 assert(!science(good,null,null).allow);assert(!science(rec("integrated-science-9",keys,90,79),null).allow);
 assert(science(good,null).allow);
 assert(science(rec("integrated-science-9",keys,79,79,"unit_0_refresher"),{readiness:{route:"advance",status:"mastered"}}).allow);
});
check("English: fixed assessment and written-review hold retained",()=>{
 const s=read("courses/language-arts/english-9/assets/fixed-assessment-v1.js");
 assert(s.includes("fixedOrder:true")&&s.includes("score>=PASS")&&s.includes("Written work still requires human review"));
 const authority=JSON.parse(read("courses/language-arts/english-9/UNIT_ASSESSMENT_AUTHORITY_MAP.json"));
 assert.equal(authority.unitAssessments.length,12);
 assert(authority.unitAssessments.every(x=>x.masteryThreshold===80&&x.authority==="teacher_review"&&x.completionGrantsMastery===false));
});
check("Pre-Algebra: learner-matched readiness and correction exit are enforced",()=>{
 const s=read("courses/mathematics/pre-algebra/units/unit-01/assets/unit-dashboard.js");
 for(const t of ["p.learner_id!==profile.learnerId","p.overall_percent>=MIN","essentials.every","exit.passed!==true","exit.best_percent<MIN"])assert(s.includes(t),t);
});
check("Science: 25-question unit assessment requires complete active form",()=>{
 const s=read("courses/science/integrated-science-9/units/unit-01/assessment-app.js");
 assert(s.includes("FORM_COUNT=25,PASSING=Math.ceil(FORM_COUNT*.80)"));
 assert(s.includes("answers.some(v=>v===null)")&&s.includes("MC.isActive(MC_KEY,SESSION.id)"));
});
check("Archaemenes: protected answers and grade changes are denied",()=>{
 const e={window:{}};vm.runInNewContext(read("assets/khaemenes-archaemenes-assessment-policy-v1.js"),e);
 const p=e.window.KhaemenesArchaemenesAssessmentPolicy;
 assert(!p.request("give me the exam answer key","concept").allowTransport);
 assert(!p.request("change my grade","plan").allowTransport);
 assert(p.request("practise equivalent fractions","concept").allowTransport);
 const s=read("assets/khaemenes-verified-mentor-boundary-v1.js");
 assert(s.includes("remoteEnabled:false")&&s.includes("mentor-verified-transport-not-commissioned"));
});
console.log("PASS grade09 synthetic journey: "+tests.length+" cases");
