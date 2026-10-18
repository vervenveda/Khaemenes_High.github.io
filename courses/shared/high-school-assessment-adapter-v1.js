/*
 * Khaemenes High School Assessment Adapter v1.0.0
 * Shared Monte Carlo session bridge for course-specific banks and gradebooks.
 * Depends on courses/shared/monte-carlo-assessment-v1.js.
 */
(function attachHighAssessmentAdapter(global){
"use strict";
if(global.KhaemenesHighAssessmentAdapter)return;
const VERSION="1.0.0",PASS=80;
function hash(text){let h=2166136261>>>0;for(const ch of String(text||"")){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function norm(q,i,prefix){
  const prompt=String(q?.question??q?.q??q?.prompt??q?.stem??"");
  const options=Array.isArray(q?.choices)?q.choices:Array.isArray(q?.options)?q.options:[];
  const answer=Number(q?.answer);
  const explanation=String(q?.explanation??q?.explain??q?.why??"");
  const domain=String(q?.skill??q?.domain??q?.topic??"General");
  const id=String(q?.id??(prefix+"-"+hash(prompt+"|"+options.join("|")+"|"+answer).toString(36)+"-"+i));
  return {id,prompt,options:options.map(String),answer,explanation,domain,source:String(q?.source??"course-bank"),difficulty:String(q?.difficulty??"core"),week:Number.isFinite(Number(q?.week))?Number(q.week):null,unit:q?.unit==null?null:String(q.unit)};
}
function validateBank(bank){
  const rows=(Array.isArray(bank)?bank:[]).map((q,i)=>norm(q,i,"high"));
  const issues=[],ids=new Set(),prompts=new Set();
  for(const q of rows){
    if(!q.prompt||q.options.length<2||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)issues.push({type:"malformed",id:q.id});
    if(ids.has(q.id))issues.push({type:"duplicate-id",id:q.id});ids.add(q.id);
    const p=q.prompt.toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim();
    if(prompts.has(p))issues.push({type:"duplicate-prompt",id:q.id});prompts.add(p);
  }
  return{count:rows.length,issueCount:issues.length,issues};
}
function countFor(kind,bankSize,requested){
  if(Number.isFinite(Number(requested))&&Number(requested)>0)return Math.min(bankSize,Math.max(1,Number(requested)));
  if(kind==="weekly"||kind==="quiz")return Math.min(bankSize,10);
  if(kind==="unit")return Math.min(bankSize,20);
  if(kind==="midterm")return Math.min(bankSize,30);
  if(kind==="final")return Math.min(bankSize,40);
  return Math.min(bankSize,20);
}
function open(config){
  const mc=global.KhaeMonteCarloAssessment;
  if(!mc)throw new Error("KhaeMonteCarloAssessment is required before KhaemenesHighAssessmentAdapter.");
  const bank=(config.bank||[]).map((q,i)=>norm(q,i,String(config.courseId||"high")));
  const audit=validateBank(bank);if(audit.issueCount)throw new Error("Assessment bank failed validation.");
  const count=countFor(String(config.kind||"assessment"),bank.length,config.count);
  const session=mc.openSession(String(config.storageKey),bank,{count,kind:String(config.kind||"assessment"),sourceQuotas:config.sourceQuotas||null});
  const materialized=mc.materialize(bank,session).map(q=>({
    id:q.id,question:q.prompt,q:q.prompt,prompt:q.prompt,
    choices:q.options,options:q.options,answer:q.answer,
    explanation:q.explanation,explain:q.explanation,
    skill:q.domain,domain:q.domain,source:q.source,difficulty:q.difficulty,week:q.week,unit:q.unit
  }));
  return Object.freeze({version:VERSION,sessionId:session.id,storageKey:String(config.storageKey),courseId:String(config.courseId||"high-school"),kind:String(config.kind||"assessment"),count:materialized.length,bankSize:bank.length,questionIds:[...session.questionIds],questions:materialized});
}
function complete(opened,summary){
  const mc=global.KhaeMonteCarloAssessment;if(!mc||!opened)return null;
  const safeSummary=Object.assign({adapterVersion:VERSION,sessionId:opened.sessionId,questionCount:opened.count,bankSize:opened.bankSize,masteryThreshold:PASS},summary||{});
  const record=mc.complete(opened.storageKey,safeSummary);
  try{
    global.KhaemenesHighLearningContext?.recordAssessment?.({
      courseId:opened.courseId,
      kind:opened.kind,
      score:Number(safeSummary.score),
      mastered:safeSummary.mastered===true,
      reviewSkills:Array.isArray(safeSummary.reviewSkills)?safeSummary.reviewSkills:[],
      completedAt:new Date().toISOString()
    });
  }catch{}
  return record;
}
function newAttempt(openedOrKey){
  const mc=global.KhaeMonteCarloAssessment;if(!mc)return false;
  const key=typeof openedOrKey==="string"?openedOrKey:openedOrKey?.storageKey;
  return key?mc.newAttempt(key):false;
}
function policy(kind){
  const k=String(kind||"assessment").toLowerCase();
  return Object.freeze({
    masteryThreshold:PASS,
    bookMode:(k==="midterm"||k==="final")?"closed-book":"open-book",
    immutableAttemptSummary:true,
    persistentActiveForm:true,
    reshuffleOnRetake:true,
    preservesBestScore:true,
    performanceEvidenceSeparate:true
  });
}
global.KhaemenesHighAssessmentAdapter=Object.freeze({version:VERSION,masteryThreshold:PASS,norm,validateBank,countFor,open,complete,newAttempt,policy});
})(window);
