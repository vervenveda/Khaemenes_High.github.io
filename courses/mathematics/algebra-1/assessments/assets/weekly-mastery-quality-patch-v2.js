(()=>{
"use strict";
const bank=window.KhaemenesAlgebra1WeeklyMasteryV2||{};
function patch(id,changes){
  for(const week of Object.values(bank)){
    const item=week?.questions?.find(q=>q.id===id);
    if(item){Object.assign(item,changes);return true}
  }
  return false;
}
patch("a1-w08-q07",{
  answer:0,
  explanation:"W=(P−2L)/2=(50−18)/2=16."
});
patch("a1-w09-q07",{
  options:["1 h","2 h","3 h","4 h"],
  answer:1,
  explanation:"The first part covers 100 miles; 110 miles remain, and 110/55=2 hours."
});
patch("a1-w18-q07",{
  options:["$117","$132","$141","$165"],
  answer:2,
  explanation:"0.18(650)+24=117+24=141 dollars."
});
})();