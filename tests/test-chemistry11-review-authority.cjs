#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const dir=path.resolve(__dirname,"../courses/science/chemistry-11");
const src=fs.readFileSync(path.join(dir,"inquiry-review-boundary.js"),"utf8");
const html=fs.readFileSync(path.join(dir,"inquiry-ledger.html"),"utf8");
assert(html.includes('src="inquiry-review-boundary.js"'));
assert(html.includes('id="reviewBoundaryStatus"'));
const ctx={window:{}};vm.runInNewContext(src,ctx);
const api=ctx.window.KhaeChemistryReviewBoundary;
const records=[{week:1,minutes:90,inquiry:true,evidence:"fictional measurement data"},{week:1,minutes:30,inquiry:false,evidence:"fictional reading"}];
for(const fake of [{role:"educator",approved:true,token:"made-up"},{grant:"revoked",approved:true},{evaluator:true},{valid:true},null]){
 const r=api.assess({ledger:records,learnerId:"fictional-A",authorization:fake});
 assert.equal(r.claimedPercent,75);assert.equal(r.targetMetBySelfReport,true);
 assert.equal(r.approval,"unavailable");assert.equal(r.creditAllowed,false);assert.equal(r.shareAllowed,false);
}
const invalid=api.assess({ledger:[{week:1,minutes:-4,inquiry:true,evidence:"bad"}],learnerId:"fictional-A"});
assert.equal(invalid.evidenceValid,false);assert.equal(invalid.creditAllowed,false);
const missing=api.assess({ledger:records});
assert.equal(missing.learnerPresent,false);assert.equal(missing.shareAllowed,false);
console.log("PASS public Chemistry review adapter cannot issue approval from fake grants, revoked claims or self-reported minutes");
