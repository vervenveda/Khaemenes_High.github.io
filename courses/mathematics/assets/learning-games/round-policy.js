// Shared round selection and settings protection. Practice never writes course mastery.
(()=>{
 const previous=new Map();
 const key=item=>JSON.stringify(item);
 function unique(pool){const seen=new Set();return pool.filter(item=>{const id=key(item);if(seen.has(id))return false;seen.add(id);return true})}
 function shuffle(pool){const out=pool.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
 function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
 function sample(pool,count){
  pool=unique(pool);const bucket=pool.map(key).sort().join('|'),last=previous.get(bucket)||new Set();
  const storageKey='khaemenes-math-game-round-history-v1:'+String(bucket.length)+':'+hash(bucket);
  let remembered=last;
  try{const saved=JSON.parse(sessionStorage.getItem(storageKey)||'null');if(Array.isArray(saved))remembered=new Set(saved)}catch{}
  const out=[...shuffle(pool.filter(x=>!remembered.has(key(x)))),...shuffle(pool.filter(x=>remembered.has(key(x))))].slice(0,Math.max(0,count));
  const selected=new Set(out.map(key));previous.set(bucket,selected);
  try{sessionStorage.setItem(storageKey,JSON.stringify([...selected]))}catch{}
  return out;
 }
 function lock(el,locked){for(const name of ['course','focus','pathway','size'])if(el[name])el[name].disabled=locked}
 window.MathGameRounds={unique,sample,lock};
})();
