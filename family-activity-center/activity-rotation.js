/* Family Activity Center · Monte Carlo-style nonrepeating sampling.
   Runs offline; leaves initial HTML cards as a no-JS fallback.
   No learner records, cookies, tracking or external data fetches. */
(()=>{"use strict";
if(window.KhaemenesFamilyActivityRotation)return;
const bank=window.KhaemenesFamilyActivityBank;
if(!bank)return;
const config=Object.freeze({ideas:4,movies:4,games:4,coupons:6});
const lastSelection={};
function rand(max){
 if(max<=1)return 0;
 // Rejection sampling avoids bias and remains offline.
 if(window.crypto?.getRandomValues){
  const tmp=new Uint32Array(1),ceiling=Math.floor(4294967296/max)*max;
  do{crypto.getRandomValues(tmp)}while(tmp[0]>=ceiling);
  return tmp[0]%max;
 }
 return Math.floor(Math.random()*max);
}
function choose(name,forceDifferent){
 const data=bank[name]||[],count=config[name]||0;
 if(data.length<count*2)return null;
 const previous=lastSelection[name];
 // Sample a complete set without replacement (Fisher–Yates).
 // Prefer any previously unseen members so a new shuffle feels different.
 let ids=Array.from({length:data.length},(_,i)=>i);
 for(let i=ids.length-1;i>0;i--){const j=rand(i+1);[ids[i],ids[j]]=[ids[j],ids[i]]}
 if(forceDifferent&&previous?.length){
  const fresh=ids.filter(id=>!previous.includes(id));
  if(fresh.length>=count)ids=[...fresh,...ids.filter(id=>previous.includes(id))];
 }
 const selected=ids.slice(0,count);
 lastSelection[name]=selected;
 try{sessionStorage.setItem("khae-family-last-"+name,JSON.stringify(selected))}catch{}
 return selected.map(id=>data[id]);
}
function selectionBeforeFirstDraw(name){
 try{const old=JSON.parse(sessionStorage.getItem("khae-family-last-"+name)||"null");
  if(Array.isArray(old)&&old.every(n=>Number.isInteger(n)&&n>=0&&n<(bank[name]||[]).length))lastSelection[name]=old
 }catch{}
}
function itemNode(name,row){
 const box=document.createElement(name==="coupons"?"div":"article");
 box.className=name==="coupons"?"coupon":"tile";
 const h=document.createElement("h3"),p=document.createElement("p");
 h.textContent=row[0];p.textContent=row[1];box.append(h,p);
 if(name==="coupons"){
  const date=document.createElement("small");date.textContent="Date: __________________";box.append(date)
 }
 return box;
}
function mount(name){
 const section=document.getElementById(name);
 const grid=section?.querySelector(name==="coupons"?".coupon-grid":".grid");
 if(!section||!grid)return;
 const controls=document.createElement("div");
 controls.className="shuffle-controls no-print";
 const button=document.createElement("button");
 button.type="button";button.className="action";
 button.textContent=name==="coupons"?"Shuffle printable coupons":"Shuffle "+({ideas:"activity ideas",movies:"movie suggestions",games:"game-night ideas"}[name]||"ideas");
 button.setAttribute("aria-label","Show a different selection of "+name);
 const status=document.createElement("span");
 status.className="muted shuffle-status";
 status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 status.textContent="Showing "+config[name]+" of "+bank[name].length+" ideas";
 controls.append(button,status);
 grid.before(controls);
 function draw(){
  const rows=choose(name,true);
  if(!rows)return;
  grid.replaceChildren(...rows.map(row=>itemNode(name,row)));
  status.textContent="Showing "+rows.length+" of "+bank[name].length+" choices";
 }
 selectionBeforeFirstDraw(name);
 button.addEventListener("click",draw);
 draw();
}
Object.keys(config).forEach(mount);
document.getElementById("printCoupons")?.addEventListener("click",()=>window.print());
window.KhaemenesFamilyActivityRotation=Object.freeze({version:1,counts:Object.freeze({ideas:8,movies:8,games:8,coupons:12})});
})();