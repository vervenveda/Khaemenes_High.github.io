/*
 * Khaemenes High School · Academy Continuity Bridge v1.0.0
 * -------------------------------------------------------
 * Family Registry owns learner identity and formal placement.
 * NAIB receives context and delegates to the appropriate platform/resource.
 * Khaemenes Academy provides Archaemenes as its institutional mentor.
 * High School pages own course-specific learning state; they do not own identity.
 */
(function attachKhaemenesHighContinuity(global){
  "use strict";

  const VERSION="1.0.0";
  const PRESENTATION="academy-scholar";
  const VALID_GRADES=Object.freeze(["grade-09","grade-10","grade-11","grade-12"]);

  const clean=(value,max=120)=>String(value??"").replace(/[\u0000-\u001F\u007F]/g,"").trim().slice(0,max);

  function normalizeGrade(value){
    const raw=clean(value,40).toLowerCase().replace(/[_\s]+/g,"-");
    const match=raw.match(/(?:grade-?)?0?(9|10|11|12)\b/);
    return match?`grade-${String(match[1]).padStart(2,"0")}`:"";
  }

  function activeRegistryLearner(){
    try{return global.KhaemenesFamilyRegistry?.getLearner?.()||null}catch{return null}
  }

  function learner(){
    const raw=activeRegistryLearner();
    if(!raw)return null;
    const stage=clean(raw.stage,40).toLowerCase();
    const grade=normalizeGrade(raw.grade||raw.gradeLevel);
    if(stage!=="high"||!VALID_GRADES.includes(grade))return null;
    const learnerId=clean(raw.learnerId,120);
    if(!learnerId)return null;
    return Object.freeze({
      learnerId,
      familyId:clean(raw.familyId,120)||null,
      nickname:clean(raw.nickname||raw.displayName||"High School Scholar",80),
      stage:"high",
      grade,
      ageBand:clean(raw.ageBand,40)||null,
      interests:Object.freeze(Array.isArray(raw.interests)?raw.interests.slice(0,16).map(v=>clean(v,80)).filter(Boolean):[]),
      familyManaged:true
    });
  }

  function resolveMentor(l=learner()){
    if(!l)return null;
    const router=global.KhaemenesNAIB||null;
    try{
      const delegated=router?.delegate?.({
        stage:"high",
        grade:l.grade,
        ageBand:l.ageBand||undefined,
        interests:[...l.interests],
        surface:"khaemenes-high",
        intent:"academy learning"
      })||null;
      if(delegated?.status==="delegated"&&delegated?.specialist?.id==="archaemenes"){
        return Object.freeze({
          ...delegated.specialist,
          id:"archaemenes",
          name:"Archaemenes",
          presentationMode:delegated.specialist.presentationMode||PRESENTATION,
          providedBy:"Khaemenes Academy",
          delegatedBy:"NAIB",
          delegationId:delegated.delegationId||null
        });
      }
    }catch{}
    try{
      const legacy=router?.assignMentor?.({
        stage:"high",
        ageBand:l.ageBand||undefined,
        interests:[...l.interests],
        surface:"khaemenes-high",
        intent:"academy mentor"
      })||null;
      if(legacy?.status==="assigned"&&legacy?.mentor?.id==="archaemenes"){
        return Object.freeze({...legacy.mentor,id:"archaemenes",name:"Archaemenes",presentationMode:legacy.mentor.presentationMode||PRESENTATION,providedBy:"Khaemenes Academy",delegatedBy:"NAIB"});
      }
    }catch{}
    return Object.freeze({id:"archaemenes",name:"Archaemenes",title:"Scholar of Khaemenes Academy",avatar:"🦉",presentationMode:PRESENTATION,providedBy:"Khaemenes Academy",delegatedBy:"fallback"});
  }

  function summary(){
    const raw=activeRegistryLearner();
    const l=learner();
    let reason="ok";
    if(!raw)reason="no-active-learner";
    else if(clean(raw.stage,40).toLowerCase()!=="high")reason="stage-mismatch";
    else if(!VALID_GRADES.includes(normalizeGrade(raw.grade||raw.gradeLevel)))reason="grade-mismatch";
    return Object.freeze({
      version:VERSION,
      connected:Boolean(global.KhaemenesFamilyRegistry),
      eligible:Boolean(l),
      reason,
      learner:l,
      mentor:l?resolveMentor(l):null,
      presentationMode:PRESENTATION,
      validGrades:VALID_GRADES
    });
  }

  function subscribe(listener){
    if(typeof listener!=="function")throw new TypeError("A listener function is required.");
    const emit=()=>listener(summary());
    const storageHandler=event=>{
      if(["khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1"].includes(event.key))emit();
    };
    global.addEventListener("storage",storageHandler);
    global.addEventListener("khaemenes-family-changed",emit);
    global.addEventListener("khaemenes-naib-ready",emit);
    return ()=>{
      global.removeEventListener("storage",storageHandler);
      global.removeEventListener("khaemenes-family-changed",emit);
      global.removeEventListener("khaemenes-naib-ready",emit);
    };
  }

  global.KhaemenesHighContinuity=Object.freeze({
    version:VERSION,
    presentationMode:PRESENTATION,
    validGrades:VALID_GRADES,
    normalizeGrade,
    getLearner:learner,
    getMentor:()=>resolveMentor(learner()),
    getSummary:summary,
    subscribe
  });
})(window);
