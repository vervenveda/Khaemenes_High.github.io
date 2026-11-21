/**
 * Grade 09 Academy Account Cloud reconciliation plan.
 * NO account IDs, records, storage, HTTP, GitHub or STOS writes.
 * Evidence must arrive independently from authenticated protected services.
 * Browser selection and claimed assessment scores never prove account ownership.
 */
const deny=(code)=>Object.freeze({schema:'grade09-family-course-reconciliation-v1',status:'HOLD',code,
 eligibleForReview:false,recordWrites:0,cloudSynced:false,claimEnrollment:false});
export const GRADE09_SUBJECTS=Object.freeze([
 Object.freeze({slot:'mathematics',courseCandidates:Object.freeze(['pre-algebra','algebra-1']),authority:'placement-and-course-engine'}),
 Object.freeze({slot:'english',courseCandidates:Object.freeze(['english-9']),authority:'english-course-engine'}),
 Object.freeze({slot:'social-studies',courseCandidates:Object.freeze(['global-studies-9']),authority:'social-studies-course-engine'}),
 Object.freeze({slot:'science',courseCandidates:Object.freeze(['integrated-science-9']),authority:'science-course-engine'}),
 Object.freeze({slot:'physical-education',courseCandidates:Object.freeze(['physical-education-9']),authority:'physical-education-course-engine'}),
 Object.freeze({slot:'psychology-life-skills',courseCandidates:Object.freeze([]),authority:'approved-academy-course-map-pending'}),
 Object.freeze({slot:'foreign-language',courseCandidates:Object.freeze([]),authority:'learner-choice-and-language-engine-pending'}),
 Object.freeze({slot:'elective',courseCandidates:Object.freeze([]),authority:'learner-choice-and-elective-engine-pending'})
]);
const allowed=new Set(['identityEvidence','familyLinkEvidence','gradeEvidence','assessmentEvidence','cloudEvidence']);
function witnessed(value){return value&&typeof value==='object'&&!Array.isArray(value)&&
 value.source==='trusted-protected-runtime'&&value.verified===true}
export function reviewGrade09Reconciliation(v){
 if(!v||typeof v!=='object'||Array.isArray(v))return deny('missing_review_evidence');
 if(Object.keys(v).some(k=>!allowed.has(k)))return deny('unexpected_or_sensitive_field');
 if(!witnessed(v.identityEvidence))return deny('learner_identity_unverified');
 if(!witnessed(v.familyLinkEvidence))return deny('parent_family_link_unverified');
 if(!witnessed(v.gradeEvidence)||v.gradeEvidence.grade!=='09')return deny('grade09_placement_unverified');
 if(!witnessed(v.assessmentEvidence)||v.assessmentEvidence.owner!=='course-assessment-authority'||
    v.assessmentEvidence.learnerMatched!==true)return deny('assessment_attribution_unverified');
 if(!witnessed(v.cloudEvidence)||v.cloudEvidence.commissioned!==true||
    v.cloudEvidence.sessionAuthorized!==true||v.cloudEvidence.durableReadback!==true)
    return deny('protected_account_cloud_unverified');
 // Input claims, even with "verified" flags, are NEVER cryptographic proof.
 // They cannot approve ingestion, transcript certification or enrollment.
 return Object.freeze({schema:'grade09-family-course-reconciliation-v1',status:'INDEPENDENT_REVIEW_REQUIRED',
  code:'attested_identity_and_record_receipts_must_be_checked_offline',
  eligibleForReview:true,recordWrites:0,cloudSynced:false,claimEnrollment:false,
  slots:GRADE09_SUBJECTS.length});
}
