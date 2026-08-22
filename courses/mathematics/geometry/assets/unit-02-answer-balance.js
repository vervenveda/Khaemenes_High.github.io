(()=>{
"use strict";
const bank=window.GEOMETRY_QUESTIONS;
if(!Array.isArray(bank))return;
let i=0;
window.GEOMETRY_QUESTIONS=bank.map(q=>{
  if(Number(q.unit)!==2)return q;
  const opts=Array.isArray(q.options)?[...q.options]:[];
  if(opts.length<2)return q;
  const shift=i%opts.length;
  i++;
  if(shift===0)return q;
  const rotated=[...opts.slice(shift),...opts.slice(0,shift)];
  const answer=((Number(q.answer)||0)-shift+opts.length)%opts.length;
  return {...q,options:rotated,answer};
});
})();