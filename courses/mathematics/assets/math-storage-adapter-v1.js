/* Khaemenes Academy · verified mathematics storage adapter v1
   Persistent writes are never reported as saved until a read-back matches.
   When browser persistence fails, the latest value remains available in page memory
   so learners can export/copy work before navigating away. */
(()=>{"use strict";
if(window.KhaemenesMathStorageAdapter)return;
const memory=new Map();
let last={available:null,verified:null,persisted:null,memory:false,mode:"unknown",at:null,error:null,key:null};
const errorText=e=>String(e?.name||e?.message||e||"storage-error");
function emit(detail){last={...last,...detail,at:new Date().toISOString()};try{window.dispatchEvent(new CustomEvent("khaemenes-math-storage-state",{detail:{...last}}))}catch{}return {...last}}
function readRaw(key,fallback=null){
 const k=String(key);
 try{
  const value=localStorage.getItem(k);
  if(value!==null)memory.set(k,value);
  emit({available:true,key:k,error:null,memory:memory.has(k),mode:"protected-local"});
  return value===null?(memory.has(k)?memory.get(k):fallback):value;
 }catch(error){
  emit({available:false,verified:false,persisted:false,key:k,error:errorText(error),memory:memory.has(k),mode:"memory-only"});
  return memory.has(k)?memory.get(k):fallback;
 }
}
function readJSON(key,fallback=null){
 const raw=readRaw(key,null);if(raw==null)return fallback;
 try{return JSON.parse(raw)??fallback}catch{return fallback}
}
function writeRaw(key,value){
 const k=String(key),data=String(value);memory.set(k,data);
 try{
  localStorage.setItem(k,data);
  const check=localStorage.getItem(k);
  if(check!==data)throw new Error("write-verification-mismatch");
  emit({available:true,verified:true,persisted:true,memory:true,key:k,error:null,mode:"protected-local"});
  return {ok:true,persisted:true,verified:true,memory:true,key:k};
 }catch(error){
  const e=errorText(error);
  emit({available:false,verified:false,persisted:false,memory:true,key:k,error:e,mode:"memory-only"});
  return {ok:false,persisted:false,verified:false,memory:true,key:k,error:e};
 }
}
function writeJSON(key,value){
 let data;try{data=JSON.stringify(value)}catch(error){return {ok:false,persisted:false,verified:false,memory:false,key:String(key),error:"json-serialize:"+errorText(error)}}
 return writeRaw(key,data);
}
function remove(key){
 const k=String(key);memory.delete(k);
 try{localStorage.removeItem(k);const ok=localStorage.getItem(k)===null;if(!ok)throw new Error("remove-verification-mismatch");emit({available:true,verified:true,persisted:true,memory:false,key:k,error:null,mode:"protected-local"});return {ok:true,persisted:true,verified:true,key:k}}
 catch(error){const e=errorText(error);emit({available:false,verified:false,persisted:false,memory:false,key:k,error:e,mode:"memory-only"});return {ok:false,persisted:false,verified:false,key:k,error:e}}
}
function probe(){
 const k="__khae_math_storage_probe__"+Math.random().toString(36).slice(2),value=Date.now().toString(36);
 try{
  localStorage.setItem(k,value);const verified=localStorage.getItem(k)===value;localStorage.removeItem(k);
  if(!verified)throw new Error("probe-verification-mismatch");
  return emit({available:true,verified:true,persisted:true,memory:memory.size>0,key:null,error:null,mode:"protected-local"});
 }catch(error){
  try{localStorage.removeItem(k)}catch{}
  return emit({available:false,verified:false,persisted:false,memory:memory.size>0,key:null,error:errorText(error),mode:"memory-only"});
 }
}
function status(){return {...last,memory_entries:memory.size}}
function hasMemory(key){return memory.has(String(key))}
function memorySnapshot(){
 const out={};for(const [k,v] of memory.entries())out[k]=v;return out;
}
window.KhaemenesMathStorageAdapter=Object.freeze({readRaw,readJSON,writeRaw,writeJSON,remove,probe,status,hasMemory,memorySnapshot,version:"1.0.0"});
probe();
})();