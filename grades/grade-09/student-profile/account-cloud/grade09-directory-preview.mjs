// Grade 09 -> Family Storage OS -> Account Cloud directory bridge, v1.
// PURE METADATA PLANNER: no localStorage, network, writes, accounts or secrets.
const TOOL_REGISTRY = Object.freeze([
  Object.freeze({tool:"Schedule",type:"enrollment-schedule",owner:"academy-eight-class-schedule",action:"reference"}),
  Object.freeze({tool:"Student Progress",type:"course-progress-evidence",owner:"course-engines",action:"reference"}),
  Object.freeze({tool:"Student Portfolio",type:"learning-portfolio",owner:"learning-evidence",action:"reference"}),
  Object.freeze({tool:"KlasaiPeer",type:"peer-collaboration",owner:"klasaipeer",action:"consent-required"}),
  Object.freeze({tool:"Edit Profile",type:"student-profile",owner:"student-profile-v2",action:"reference"}),
  Object.freeze({tool:"Edit Background",type:"visual-preferences",owner:"grade09-design",action:"reference"}),
  Object.freeze({tool:"Yearbook",type:"yearbook-media",owner:"academy-yearbook",action:"consent-required"}),
  Object.freeze({tool:"Creative Tools",type:"creative-artifacts",owner:"creative-tools",action:"consent-required"})
]);
const FORBIDDEN = /password|passcode|token|credential|secret|keymaterial|recoverycode|sessioncookie/i;
function buildGrade09DirectoryDraft(input={}){
  if(input===null||typeof input!=="object"||Array.isArray(input))throw new TypeError("INVALID_INPUT");
  if(Object.keys(input).some(k=>k!=="sourceStatus"))throw new TypeError("UNEXPECTED_INPUT_FIELD");
  const status=input.sourceStatus===undefined?"unverified":input.sourceStatus;
  if(!["unverified","synthetic"].includes(status))throw new TypeError("INVALID_SOURCE_STATUS");
  return Object.freeze({
    schema:"khaemenes-grade09-directory-preview-v1",
    category:"learner-continuity",
    grade:"09",
    source:"vervenveda/Khaemenes_High.github.io/grades/grade-09/student-profile/",
    mode:"SOURCE_ONLY_NOT_SYNCED",
    studentDataIncluded:false,
    accountCloudWriteEnabled:false,
    storageDeleteEnabled:false,
    sourceStatus:status,
    sections:Object.freeze(TOOL_REGISTRY.map(t=>Object.freeze({...t,state:"NOT_COLLECTED"})))
  });
}
function validateGrade09DirectoryDraft(candidate){
  if(!candidate||typeof candidate!=="object"||Array.isArray(candidate))return false;
  try{
    const expected=buildGrade09DirectoryDraft({sourceStatus:candidate.sourceStatus});
    return JSON.stringify(candidate)===JSON.stringify(expected)&&
      !FORBIDDEN.test(JSON.stringify(candidate))&&
      candidate.sections.length===8;
  }catch{return false}
}
export {TOOL_REGISTRY,buildGrade09DirectoryDraft,validateGrade09DirectoryDraft};
