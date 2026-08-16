(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;

  const MAX_ATTEMPTS=30, POLL_MS=200;

  function cleanIssue(issue){
    if(!issue||typeof issue!=="object")return null;
    const clean={type:String(issue.type||"unknown"),scope:String(issue.scope||"unknown")};
    if(Number.isInteger(issue.week))clean.week=issue.week;
    if(Number.isInteger(issue.index))clean.index=issue.index;
    if(Number.isFinite(issue.count))clean.count=Number(issue.count);
    if(Number.isFinite(issue.answer))clean.answerIndex=Number(issue.answer);
    return clean;
  }

  function buildPacket(audit){
    const counts=audit?.counts||{};
    const issues=Array.isArray(audit?.issues)?audit.issues.map(cleanIssue).filter(Boolean):[];
    const semanticIssues=Array.isArray(audit?.semanticIssues)?audit.semanticIssues.map(cleanIssue).filter(Boolean):[];
    return Object.freeze({
      contract:"khaemenes.learning-integrity-evidence",
      contractVersion:1,
      producer:"Khaemenes High School",
      course:"pre-algebra-bridge",
      grade:"09",
      branchContext:"hardening/archaemenes-highschool",
      masteryTargetPercent:80,
      generatedAt:new Date().toISOString(),
      sourceAuditGeneratedAt:audit?.generatedAt||null,
      privacy:{
        containsLearnerIdentity:false,
        containsRawLearnerAnswers:false,
        containsAssessmentPromptText:false,
        networkTransport:false
      },
      assessmentStructure:{
        weekly:Number(counts.weekly)||0,
        midterm:Number(counts.midterm)||0,
        final:Number(counts.final)||0,
        total:Number(counts.total)||0
      },
      structuralIntegrity:{
        issueCount:issues.length,
        issues,
        semanticIssueCount:semanticIssues.length,
        semanticIssues,
        exactPromptDuplicateGroupCount:Array.isArray(audit?.exactPromptDuplicates)?audit.exactPromptDuplicates.length:0,
        answerPositions:Array.isArray(audit?.answerPositions)?audit.answerPositions.slice(0,4).map(v=>Number(v)||0):[0,0,0,0],
        weeklyOverlap:{
          midterm:Number(audit?.weeklyOverlap?.midterm)||0,
          final:Number(audit?.weeklyOverlap?.final)||0
        },
        upstreamRepairs:{
          duplicateChoiceRepairs:Number(audit?.upstream?.duplicateChoiceRepairs)||0,
          simplifiedFractionProducts:Number(audit?.upstream?.simplifiedFractionProducts)||0
        }
      },
      authority:{
        awardsMastery:false,
        changesPlacement:false,
        changesLearnerIdentity:false,
        routesMentors:false
      }
    });
  }

  function publish(packet){
    window.__KHAEMENES_PREALGEBRA_INTEGRITY_PACKET__=packet;
    window.dispatchEvent(new CustomEvent("khaemenes:integrity-evidence",{detail:packet}));
  }

  function collect(attempt=0){
    const audit=frame.contentWindow?.__KHAEMENES_PREALGEBRA_FORENSIC_AUDIT__;
    if(audit){publish(buildPacket(audit));return;}
    if(attempt<MAX_ATTEMPTS)window.setTimeout(()=>collect(attempt+1),POLL_MS);
  }

  frame.addEventListener("load",()=>window.setTimeout(()=>collect(0),400));
})();
