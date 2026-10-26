/* Khaemenes High · verified mentor boundary v1.0.0
 * Fail closed. No remote mentor provider is accepted solely because an object
 * advertises itself as authenticated. Service authorization must be integrated
 * with an authenticated Academy backend before remote transport is enabled.
 * Local, clue-first teaching remains available on the mentor page.
 */
(()=>{"use strict";
const VERSION="1.0.0";
const allowedIntents=new Set(["concept","mistake","study","plan"]);
const MAX_QUESTION=1200,MAX_ANSWER=4000;
const BOUNDARY=Object.freeze({version:VERSION,mode:"local-only-until-server-authorization",remoteEnabled:false});
function learner(){try{return window.KhaemenesFamilyRegistry?.getLearner?.()||null}catch{return null}}
function safe(value,max){return typeof value==="string"?value.trim().slice(0,max):""}
async function ask(input={}){
 const active=learner();
 const id=safe(input.learnerId,120),text=safe(input.question,MAX_QUESTION);
 const intent=safe(input.intent,40);
 if(!active?.learnerId||!id||active.learnerId!==id)throw Error("mentor-learner-binding-failed");
 if(!allowedIntents.has(intent)||!text)throw Error("mentor-scope-rejected");
 if(input.context?.allowMasteryAward!==false||
    input.context?.allowGradeChange!==false||
    input.context?.allowProgressionBypass!==false||
    input.context?.allowLockedAssessmentDisclosure!==false)throw Error("mentor-authority-contract-invalid");
 // This adapter does not send queries to an unauthenticated custom transport.
 // Later integration requires an Academy-authenticated server endpoint with
 // learner authorization, unlocked-scope validation and response filtering.
 throw Error("mentor-verified-transport-not-commissioned");
}
window.KhaemenesVerifiedMentorBoundary=Object.freeze({version:VERSION,policy:BOUNDARY,ask,status:()=>BOUNDARY});
})();