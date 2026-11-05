/* Grade 09 canonical VNV chrome integrity guard.
   No legacy menu, no new ticker implementation, no data writes.
   Recover only missing official components, once per actual removal.
*/
(()=>{"use strict";
if(window.KhaemenesGrade09ChromeIntegrity)return;
const IDS=["vnv333NetworkTicker","vnvTickerAutoPopulate","vnvHeaderAutoPopulate"];
const options={
 replaceLegacy:false,
 title:"Grade 9 Student Profile",subtitle:"Khaemenes Academy · High School",
 icon:"9",home:"https://vervenveda.com/Khaemenes_Academy.github.io/",
 actions:[
  {label:"PROFILE",href:"profile/"},
  {label:"LESSONS",href:"daily-lessons/"},
  {label:"GRADES",href:"grades/"},
  {label:"GAMES",href:"games/"},
  {label:"HOME",href:"../../../"}
 ]
};
let pending=false,checking=false,recoveries=0;
const exists=id=>!!document.getElementById(id);
function check(){
 pending=false;
 if(checking||!document.body)return;
 checking=true;
 try{
  // The shared VNV assets own creation, accessibility and branched menu wiring.
  // In particular do not call mount on a component that already exists.
  if(!exists(IDS[0])&&window.VNV333Ticker?.mount){
    window.VNV333Ticker.mount();recoveries++;
  }
  if(!exists(IDS[1])&&window.VNV_TICKER?.autoPopulate){
    window.VNV_TICKER.autoPopulate({label:"Grade 9 Profile Quick Links",max:14});recoveries++;
  }
  if(!exists(IDS[2])&&window.VNV_HEADER?.mount){
    window.VNV_HEADER.mount(options);recoveries++;
  }
 }catch(error){console.warn("[Grade09 VNV chrome] mount recovery failed",error)}
 finally{checking=false}
}
function schedule(){
 if(pending)return;
 pending=true;
 requestAnimationFrame(check);
}
const obs=new MutationObserver(mutations=>{
 if(mutations.some(m=>[...m.removedNodes,...m.addedNodes].some(n=>n.nodeType===1)))schedule();
});
if(document.body)obs.observe(document.body,{childList:true});
document.addEventListener("DOMContentLoaded",schedule,{once:true});
window.addEventListener("load",schedule,{once:true});
window.addEventListener("pageshow",schedule);
schedule();
window.KhaemenesGrade09ChromeIntegrity=Object.freeze({
 version:"1.0.0",check,diagnose:()=>Object.freeze({
  ticker333:exists(IDS[0]),tickerAuto:exists(IDS[1]),header:exists(IDS[2]),
  recoveries
 })
});
})();