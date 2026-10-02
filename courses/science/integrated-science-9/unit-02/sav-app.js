"use strict";
document.addEventListener("DOMContentLoaded",()=>{
 const side=document.querySelector("#cubeSide"),result=document.querySelector("#savResult");
 function calc(){const s=Number(side.value);if(!Number.isFinite(s)||s<=0){result.textContent="Enter a side length greater than zero.";return}const area=6*s*s,volume=s*s*s,ratio=area/volume;result.textContent=`Surface area: ${area.toFixed(2)} units² · Volume: ${volume.toFixed(2)} units³ · SA:V = ${ratio.toFixed(2)}:1`;}
 document.querySelector("#calculateSav").addEventListener("click",calc);side.addEventListener("input",calc);calc();
});