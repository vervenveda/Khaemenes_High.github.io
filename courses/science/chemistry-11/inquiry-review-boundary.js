(()=>{"use strict";
const schema="khaemenes-chem11-inquiry-review-boundary-v1";
function assess({ledger,learnerId,authorization}={}){
 const entries=Array.isArray(ledger)?ledger:[];
 const valid=entries.every(x=>x&&Number.isInteger(x.week)&&x.week>=1&&x.week<=36&&Number.isInteger(x.minutes)&&x.minutes>0&&x.minutes<=600&&typeof x.inquiry==="boolean"&&typeof x.evidence==="string"&&x.evidence.trim());
 const total=valid?entries.reduce((n,x)=>n+x.minutes,0):0;
 const inquiry=valid?entries.reduce((n,x)=>n+(x.inquiry?x.minutes:0),0):0;
 const ratio=total?Math.round(inquiry/total*1000)/10:0;
 // This publicly delivered page has no authenticated verifier. Input claiming
 // authorization cannot promote a browser-side review to official credit.
 return Object.freeze({schema,learnerPresent:typeof learnerId==="string"&&!!learnerId,
 evidenceValid:valid&&entries.length>0,recordCount:entries.length,
 instructionalMinutes:total,claimedInquiryMinutes:inquiry,claimedPercent:ratio,
 targetMetBySelfReport:total>0&&ratio>=25,
 approval:"unavailable",reviewAuthority:"not-established",
 shareAllowed:false,creditAllowed:false,
 reason:"Authenticated educator permission, evidence-version custody, and revocation verification are not available in this public course."});
}
window.KhaeChemistryReviewBoundary=Object.freeze({schema,assess});
})();