/* Pre-Algebra · standalone weekly mastery center adapter v1 */
(()=>{"use strict";
const W=window.KhaemenesPreAlgebraWeeklyMasteryV2;if(!W?.ready||!W.bank)return;
const weeks=(window.APP?.weeks||[]).filter(w=>Number(w.week)>=2&&Number(w.week)<=36).map(w=>({week:Number(w.week),title:w.title,unit:Number(w.unitNumber)}));
window.KhaemenesMathWeeklyAdapter={course:"pre-algebra",title:"Pre-Algebra Weekly Mastery",storageKey:"khaemenes-prealgebra-weekly-center-v1",weeks,bank:W.bank,defaultWeek:2,missingFor:()=>[]};
})();