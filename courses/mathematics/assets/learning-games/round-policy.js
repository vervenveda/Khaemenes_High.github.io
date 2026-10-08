// Shared round selection and settings protection. Practice never writes course mastery.
(()=>{
 const previous=new Map();
 const key=item=>JSON.stringify(item);
 function unique(pool){const seen=new Set();return pool.filter(item=>{const id=key(item);if(seen.has(id))return false;seen.add(id);return true})}
 function shuffle(pool){const out=pool.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
 function sample(pool,count){
  pool=unique(pool);const bucket=pool.map(key).sort().join('|'),last=previous.get(bucket)||new Set();
  const out=[...shuffle(pool.filter(x=>!last.has(key(x)))),...shuffle(pool.filter(x=>last.has(key(x))))].slice(0,Math.max(0,count));
  previous.set(bucket,new Set(out.map(key)));return out;
 }
 function lock(el,locked){for(const name of ['course','focus','pathway','size'])if(el[name])el[name].disabled=locked}
 window.MathGameRounds={unique,sample,lock};
})();
