import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
let failed=false;
const ok=(v,m)=>{if(v)console.log("OK "+m);else{failed=true;console.error("FAIL "+m)}};

const shared=read("assets/applied-mission-studio-v1.js");
const manifest=JSON.parse(read("APPLIED_MISSION_STUDIO_RELEASE.json"));
const blobSha=crypto.createHash("sha1").update("blob "+Buffer.byteLength(shared)+"\0").update(shared).digest("hex");
ok(manifest.version==="1.7.0","release manifest pins Applied Mission Studio v1.7.0");
const offlineRelease="ams-v1.7.0-recovery-popout-r1-20261015";
ok(manifest.offline_release===offlineRelease,"release manifest pins the atomic Mission Studio offline release");
ok(blobSha===manifest.git_blob_sha,"shared Applied Mission Studio matches pinned Git blob");
ok(shared.includes('const V="1.7.0"'),"runtime reports v1.7.0");
ok(shared.includes("pageOwnerId")&&shared.includes("ownerOk"),"runtime binds writes to the active Academy learner");
ok(shared.includes("Review & Replace Newer Version")&&shared.includes("competing-tab"),"runtime protects competing tabs");
ok(shared.includes("importBytes:524288")&&shared.includes("verifiedWrite"),"runtime bounds imports and verifies writes");
ok(shared.includes("khaemenes-evidence-integrity-v1")&&shared.includes("sealEnvelope")&&shared.includes("verifyEnvelope"),"runtime seals and verifies portable evidence with SHA-256");
ok(shared.includes("course_progression_authority:false"),"mission evidence remains outside mastery authority");
const vault=read("evidence-vault/index.html"),vaultSw=read("evidence-vault/service-worker.js");
ok(shared.includes('href="../../../../evidence-vault/"'),"Mission Studio exposes the Evidence Vault");
ok(vault.includes("Khaemenes Mathematics Evidence Vault"),"Evidence Vault route is present");
ok(vault.includes("khaemenes-math-evidence-vault-export-v1")&&vault.includes("SHA-256"),"Evidence Vault creates sealed full-program backups");
ok(vault.includes("Verify Bundle")&&vault.includes("read-only"),"Evidence Vault verification is read-only");
ok(vault.includes("prealgebra")&&vault.includes("algebra1")&&vault.includes("geometry")&&vault.includes("algebra2")&&vault.includes("precalculus-trigonometry")&&vault.includes("calculus1"),"Evidence Vault inventories all six mathematics courses");
ok(vaultSw.includes("khaemenes-math-evidence-vault-v1"),"Evidence Vault has its own offline shell");

ok(shared.includes("RECOVERY_JOURNAL")&&shared.includes("Evidence Recovery"),"runtime exposes learner-scoped Evidence Recovery");
ok(shared.includes("Restore as New Revision")&&shared.includes("recovery-restore"),"recovery restores evidence as a new revision");
ok(shared.includes("khaemenes-math-applied-mission-recovery-export-v1"),"recovery exports are integrity-sealed first-party evidence packages");
ok(shared.includes('id="asRecoveryDialog"')&&shared.includes("showModal"),"Evidence Recovery uses a compact pop-out dialog instead of expanding the lesson page");
ok(shared.includes("data-as-recovery-preview")&&shared.includes("Export Recovery Bundle"),"recovery dialog supports preview and sealed bundle export");
const nativeStudio=read("algebra-1/assets/applied-mission-studio-v1.js");
ok(nativeStudio.includes('id="missionRecoveryDialog"')&&nativeStudio.includes("data-mission-recovery-preview"),"Algebra I native Mission Studio uses the same pop-out recovery model");
ok(!shared.includes("limits.text+' data-as-field")&&!shared.includes("limits.evaluator+' value="),"Mission Studio bounded-field markup is well formed");

const coreMatch=shared.match(/\/\*__AMS_CORE_BEGIN__\*\/([\s\S]*?)\/\*__AMS_CORE_END__\*\//);
ok(!!coreMatch,"testable persistence core is embedded in the runtime");
let core=null;
if(coreMatch){
 const box={TextEncoder,Uint8Array,crypto:crypto.webcrypto};vm.createContext(box);vm.runInContext(coreMatch[1]+";globalThis.__AMSCore=AMSCore;",box);core=box.__AMSCore;
}
if(core){
 ok(core.scopeKey("record","learner-a")!==core.scopeKey("record","learner-b"),"learner-scoped keys are distinct");
 const huge="x".repeat(core.limits.text+500);
 const dirty={mission_id:"m1",custom:"y".repeat(500),fields:{question:huge,unknown:"should-drop"},checks:{0:true,99:true},review:{scores:["4","9"],feedback:"z".repeat(core.limits.feedback+50),attempts:Array.from({length:40},(_,i)=>({score:i,target:80,evaluator:"Evaluator"}))},unknown:"drop"};
 const clean=core.sanitizeRecord(dirty,{course:"geometry",unit:1,project:"Test",fieldKeys:["question"],legacyKeys:[],checkCount:1,rubricCount:2,recordId:"r1"});
 ok(clean.fields.question.length===core.limits.text&&!Object.hasOwn(clean.fields,"unknown"),"record sanitizer caps evidence and drops unknown fields");
 ok(clean.custom.length===core.limits.custom&&clean.review.feedback.length===core.limits.feedback,"record sanitizer enforces text bounds");
 ok(clean.review.attempts.length===core.limits.attempts,"review history is bounded");
 class MemoryStorage{constructor(){this.m=new Map()}getItem(k){return this.m.has(k)?this.m.get(k):null}setItem(k,v){this.m.set(k,String(v))}removeItem(k){this.m.delete(k)}}
 const st=new MemoryStorage(),key="store:learner:a",unit="unit-01",base=core.sanitizeRecord({mission_id:"m1"},{course:"geometry",unit:1,project:"Test",fieldKeys:[],legacyKeys:[],checkCount:0,rubricCount:0,recordId:"r1"});
 const first=core.commitUnit(st,key,unit,base,0,"tab-a");
 const stale=core.commitUnit(st,key,unit,{...base,mission_id:"m2"},0,"tab-b");
 const forced=core.commitUnit(st,key,unit,{...base,mission_id:"m2"},first.revision,"tab-b",{force:true});
 ok(first.ok&&first.revision===1,"first verified mission commit creates revision 1");
 ok(stale.conflict===true,"stale competing-tab commit is refused");
 ok(forced.ok&&forced.revision===2,"explicit forced replacement advances the revision");
 const recoveryKey="recovery:learner:a:unit-01";
 for(let i=1;i<=9;i++)core.appendRecovery(st,recoveryKey,{course:"geometry",unit:1,reason:"test-"+i,record:{...base,revision:i,record_id:"r1"}},7);
 const recovery=core.recoveryPoints(st,recoveryKey);
 ok(recovery.length===7&&recovery[0].revision===3&&recovery.at(-1).revision===9,"recovery journal retains the newest seven restore points");
 const before=st.getItem(key);const bad={getItem:k=>st.getItem(k),setItem(){throw Error("blocked")},removeItem(){}};
 ok(core.verifiedWrite(bad,key,{x:1})===false&&st.getItem(key)===before,"failed verified write preserves previous storage");
 const deterministicA=core.canonicalize({b:2,a:{z:1,y:[3,2]}});
 const deterministicB=core.canonicalize({a:{y:[3,2],z:1},b:2});
 ok(deterministicA===deterministicB,"integrity canonicalization is deterministic across object key order");
 const sealedEvidence=await core.sealEnvelope({schema:"mission-test",course:"geometry",unit:1,record:{mission_id:"m1",fields:{question:"test"}}});
 ok(await core.verifyEnvelope(sealedEvidence),"SHA-256 evidence seal verifies unchanged payload");
 ok(!(await core.verifyEnvelope({...sealedEvidence,unit:2})),"SHA-256 evidence seal rejects changed payload");
}

const preNames=["number-systems-investigation.html","signed-data-investigation.html","rational-quantity-investigation.html","community-scale-rate-investigation.html","consumer-financial-decision-investigation.html","scale-of-universe-investigation.html","algebraic-model-design-investigation.html","equation-formula-design-investigation.html","constraint-design-investigation.html","linear-relationship-data-story-investigation.html","accessible-space-scale-design-investigation.html","community-data-evidence-investigation.html","mathematical-modelling-capstone-portfolio.html"];
const a1Data=read("algebra-1/course-data.js");
const a1Slugs=[...a1Data.matchAll(/"number":(\d+)[\s\S]*?"project_slug":"([^"]+)"/g)].slice(0,13).map(m=>({unit:Number(m[1]),slug:m[2]}));
const routeSets={
 "pre-algebra":preNames.map((name,i)=>`./units/unit-${String(i+1).padStart(2,"0")}/projects/${name}`),
 "algebra-1":a1Slugs.map(x=>`./units/unit-${String(x.unit).padStart(2,"0")}/projects/${x.slug}.html`),
 "geometry":Array.from({length:13},(_,i)=>`./units/unit-${String(i+1).padStart(2,"0")}/projects/${String(i+1).padStart(2,"0")}-project.html`),
 "algebra-2":Array.from({length:13},(_,i)=>`./units/unit-${String(i+1).padStart(2,"0")}/projects/${String(i+1).padStart(2,"0")}-project.html`)
};
for(const [course,routes] of Object.entries(routeSets)){
 const sw=read(course+"/service-worker.js");
 ok(sw.includes('MISSION_OFFLINE_RELEASE="'+offlineRelease+'"'),course+" service worker pins the atomic offline release");
 ok(sw.includes("const MISSION_CRITICAL=")&&sw.includes("cache.addAll(MISSION_CRITICAL"),course+" mission-critical offline routes install atomically");
 ok(sw.includes("await caches.delete("),course+" failed mission-critical install removes its incomplete candidate cache");

 ok(sw.includes("../assets/applied-mission-studio-v1.js"),course+" offline release caches the shared Mission Studio");
 for(const route of routes){
  ok(sw.includes(route),course+" first-use offline cache includes "+route);
  ok(fs.existsSync(path.join(ROOT,course,route.replace(/^\.\//,""))),course+" canonical project exists: "+route);
 }
}
const native=read("algebra-1/assets/applied-mission-studio-v1.js");
for(const token of ["AMSCore=SHARED?.core","STORE=scoped(STORE_BASE)","Review & Replace Newer Version","importBytes","verifiedWrite","khaemenes-algebra1-applied-mission-export-v2","verifyEnvelope","RECOVERY_JOURNAL","Evidence Recovery","recovery-restore","khaemenes-algebra1-applied-mission-recovery-export-v1"])ok(native.includes(token),"Algebra I native studio hardening contains "+token);
const contract=read("../shared/course-entry-contract.js");
ok(contract.includes("data-khae-applied-mission-studio"),"High School lesson/project entry contract still loads the shared Mission Studio");
for(const [course,stem] of [["geometry","geometry"],["algebra-2","algebra2"]]){
 const app=read(course+"/assets/app.js");
 ok(app.includes(`khaemenes-${stem}-applied-mission-portfolio-v1`),course+" portfolio surfaces Applied Mission evidence");
}
if(failed)process.exit(1);
console.log("\nPASS High School mathematics Applied Mission Studio hardened contract.");
