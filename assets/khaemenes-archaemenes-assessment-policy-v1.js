/* Archaemenes · assessment-safe mentor policy v1.0.0.
 * Defense in depth only. Never give the mentor answer-bank access.
 * This client classifier is not a substitute for authenticated server policy.
 */
(function(global){"use strict";
const MAX=4000;
const restricted=/\b(?:answer\s*(?:key|sheet|list)|marking\s*scheme|solutions?\s*(?:to|for|of)\s*(?:the\s*)?(?:exam|quiz|test|assessment)|(?:exam|test|quiz)\s*(?:answers?|solutions?|questions?|items?|paper)|locked\s*(?:item|lesson|question|assessment|quiz|test)|unreleased\s*(?:question|assessment|exam)|future\s*(?:test|quiz|exam|assessment)|bypass\s*(?:the\s*)?(?:mastery|prerequisite|gate|lock)|change\s*(?:my\s*)?(?:grade|score)|what\s*(?:is|are)\s*(?:the\s*)?(?:correct\s*)?(?:option|choice|letter|answer)|(?:a|b|c|d)\s*(?:is|was)\s*(?:the\s*)?correct\s*(?:option|answer))\b/i;
const assessment=/\b(?:quiz|exam|test|assessment|checkpoint|midterm|final|graded|grade|answer|score|mastery|unlock|prerequisite|correct\s+option|marking\s+scheme)\b/i;
const refusal="I can help you learn the concept using fresh practice examples, but I cannot reveal protected assessments, locked questions, answer keys, or alter Academy grades or mastery gates. Tell me which idea you want to practice.";
function classify(text){
 const value=String(text??"").slice(0,MAX).normalize("NFKC").replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/[_-]+/g," ").replace(/\s+/g," ").trim();
 return Object.freeze({restricted:restricted.test(value),assessmentRelated:assessment.test(value),normalized:value});
}
function request(text,kind){
 const c=classify(text);
 return Object.freeze({allowTransport:!c.restricted&&!c.assessmentRelated&&["concept","mistake","study","plan"].includes(kind),restricted:c.restricted,assessmentRelated:c.assessmentRelated});
}
function response(text){
 if(typeof text!=="string"||!text.trim()||text.length>MAX)return Object.freeze({allowed:false,reason:"invalid-response"});
 const c=classify(text);
 if(c.restricted)return Object.freeze({allowed:false,reason:"potential-protected-content"});
 return Object.freeze({allowed:true,text:text.trim()});
}
global.KhaemenesArchaemenesAssessmentPolicy=Object.freeze({version:"1.0.0",classify,request,response,refusal});
})(window);