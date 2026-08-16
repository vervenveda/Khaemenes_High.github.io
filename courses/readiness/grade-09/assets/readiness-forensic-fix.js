(() => {
  "use strict";
  try{
    const e01=CORE.find(x=>x.id==="E01");
    if(e01){
      e01.prompt="Read: 'Although the road was flooded, the crew continued after rerouting through higher ground.' Which relationship is signaled most directly by the word 'Although'?";
      e01.choices=["Contrast or concession","Chronology only","Definition","Cause and effect only"];
      e01.answer=0;
      e01.skill="reading relationships";
    }
    const mv2=VERIFY.find(x=>x.id==="MV2");
    if(mv2){
      mv2.prompt="A line has slope -2 and passes through (1,5). Which point is NOT on the line?";
      mv2.choices=["(2,3)","(2,7)","(3,1)","(0,7)"];
      mv2.answer=1;
      mv2.skill="linear verification";
    }
    window.__KHAEMENES_READINESS_FORENSIC_FIX__={version:"2026-08-16",items:["E01","MV2"]};
  }catch(err){
    console.error("Grade 09 readiness forensic fix could not attach",err);
  }
})();