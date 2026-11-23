#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const {spawnSync}=require("node:child_process");
const root=path.resolve(__dirname,"..");
const reportDir=path.join(root,"reports");
fs.mkdirSync(reportDir,{recursive:true});
const checks=[
  {id:"program-contract",cmd:process.execPath,args:["tools/validate-high-school-program-contract-v1.cjs"]},
  {id:"course-ownership",cmd:process.execPath,args:["tools/validate-high-school-course-ownership-v1.cjs"]},
  {id:"legacy-runtime",cmd:process.execPath,args:["tools/validate-high-school-legacy-dependencies-v1.cjs"]},
  {id:"release-certification",cmd:process.execPath,args:["tools/validate-high-school-release-certification-v1.cjs"]},
  {id:"public-entry-routes",cmd:process.execPath,args:["tools/validate-public-entry-routes.mjs"]},
  {id:"main-landings-shell",cmd:process.execPath,args:["tools/validate-high-main-landings-vnv-shell.mjs"]},
  {id:"subject-landings-shell",cmd:process.execPath,args:["tools/validate-high-subject-landings-vnv-shell.mjs"]},
  {id:"elective-landing-chrome",cmd:process.execPath,args:["tools/validate-elective-landing-canonical-chrome-v1.cjs"]},
  {id:"navigation-routes",cmd:process.execPath,args:["tools/test-high-navigation-routes.mjs"]},
  {id:"lower-right-conflicts",cmd:process.execPath,args:["tools/audit-lower-right-utility-conflicts.mjs"]},
  {id:"student-toolbar-coverage",cmd:process.execPath,args:["tools/audit-student-toolbar-coverage.mjs"],env:{REQUIRE_FULL_TOOLBAR_COVERAGE:"1"}},
  {id:"sitewide-routes",cmd:"python3",args:["tools/validate-sitewide-routes.py"]}
];
const results=[];
for(const check of checks){
  const p=spawnSync(check.cmd,check.args,{
    cwd:root,encoding:"utf8",maxBuffer:16*1024*1024,
    env:{...process.env,...(check.env||{})}
  });
  results.push({
    id:check.id,
    pass:p.status===0,
    exitCode:p.status,
    stdout:(p.stdout||"").trim().slice(-5000),
    stderr:(p.stderr||"").trim().slice(-5000)
  });
}
const readJson=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const ownership=readJson("courses/shared/high-school-course-ownership-manifest-v1.json");
const release=readJson("courses/shared/high-school-release-certification-v1.json");
const runtime=readJson("courses/shared/high-school-runtime-certification-matrix-v1.json");
const executableStateCounts={};
for(const row of release.courses) executableStateCounts[row.releaseState]=(executableStateCounts[row.releaseState]||0)+1;
const catalogStateCounts={};
for(const row of release.catalogAndFederatedSurfaces||[]) catalogStateCounts[row.surfaceState]=(catalogStateCounts[row.surfaceState]||0)+1;
const runtimeHolds=runtime.classes.map(row=>({
  id:row.id,
  browserRuntime:row.browserRuntime,
  deviceAcceptance:row.deviceAcceptance,
  offlineAcceptance:row.offlineAcceptance,
  evidence:row.evidence||null
}));
const commit=(spawnSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8"}).stdout||"").trim()||process.env.GITHUB_SHA||"unknown";
const report={
  schema:"khaemenes-high-school-forensic-state-v1",
  generatedAt:new Date().toISOString(),
  commit,
  sourceScope:{
    executableCourses:release.courses.length,
    catalogAndFederatedSurfaces:(release.catalogAndFederatedSurfaces||[]).length,
    ownershipSurfaces:ownership.courses.length,
    prState:"external-to-source-audit"
  },
  checks,
  releaseStates:{executable:executableStateCounts,catalogAndFederated:catalogStateCounts},
  runtimeHolds,
  boundaries:{
    routePresenceNeverEqualsCompletion:true,
    sourcePassCannotImplyBrowserOrDevicePass:true,
    catalogPlansDoNotGainAcademicAuthority:true,
    federatedTranscriptReturnRemainsAuditedBoundary:true
  }
};
const out=path.join(reportDir,"high-school-forensic-state.json");
fs.writeFileSync(out,JSON.stringify(report,null,2)+"\n");
const failures=results.filter(x=>!x.pass);
console.log(JSON.stringify({
  commit,
  checks:results.length,
  passed:results.length-failures.length,
  failed:failures.map(x=>x.id),
  executableStateCounts,
  catalogStateCounts,
  runtimeHolds
},null,2));
if(failures.length){
  console.error("FAIL High School forensic state: "+failures.map(x=>x.id).join(", "));
  process.exit(1);
}
console.log("PASS High School forensic state: canonical ownership, routes, chrome, toolbar, legacy/runtime boundaries and release-state ledgers are coherent.");
