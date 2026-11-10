/* Grade 9 Account Cloud discovery v1: manually invoked, key names only.
 * No automatic execution, record-value reads, mutation, download, or network activity.
 * A suffix naming a learner is an ownership hint, NOT proof of authenticated identity.
 */
(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.KhaemenesGrade09StorageDiscovery=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const MAX_KEYS=10000;
  const MAX_RESULTS=5000;
  function keyMatches(pattern,key){
    if(typeof pattern!=="string"||typeof key!=="string")return false;
    const i=pattern.indexOf("*");
    if(i<0)return key===pattern||key.startsWith(pattern+":learner:");
    const prefix=pattern.slice(0,i),suffix=pattern.slice(i+1);
    if(!key.startsWith(prefix))return false;
    if(!suffix)return true;
    const rest=key.slice(prefix.length);
    return rest.includes(suffix)&&rest.indexOf(suffix)>=0;
  }
  function groupFor(key,manifest){
    for(const group of manifest.groups||[]){
      if((group.keys||[]).some(pattern=>keyMatches(pattern,key)))return group;
    }
    return null;
  }
  function classify(key,group){
    if(!group)return "unmapped";
    if(group.ownership==="ambiguous-grade-wide-keys")return "ambiguous-unclaimed";
    if(group.ownership==="external-repository-not-yet-audited"||group.ownership==="external-or-unmapped-producers")return "external-unmapped";
    if(/:learner:[^:]+$/.test(key))return "scoped-owner-unverified";
    if(group.ownership==="learner-suffix-required")return "ambiguous-unclaimed";
    if(group.ownership==="legacy-scope-claim-required"||group.ownership==="mixed-scoped-and-legacy")return "ambiguous-unclaimed";
    if(group.ownership==="learner-scoped-when-profile-selected")return "ambiguous-unclaimed";
    return "ownership-unverified";
  }
  function inspect(storage,manifest,sourceOrigin){
    if(!storage||typeof storage.key!=="function"||typeof storage.length!=="number")throw new TypeError("Storage-like source required");
    if(manifest?.schema!=="khaemenes-grade09-account-cloud-inventory-v1"||!Array.isArray(manifest.groups))throw new TypeError("Versioned manifest required");
    if(typeof sourceOrigin!=="string"||!/^https:\/\/[A-Za-z0-9.-]+(?::[0-9]+)?$/.test(sourceOrigin))throw new TypeError("Explicit HTTPS origin required");
    if(storage.length>MAX_KEYS)throw new RangeError("Too many keys; scan this origin in a controlled tool");
    const matched=[],unmapped={count:0};
    for(let i=0;i<storage.length;i++){
      const key=storage.key(i);
      if(typeof key!=="string")continue;
      const group=groupFor(key,manifest);
      if(!group){unmapped.count++;continue}
      if(matched.length===MAX_RESULTS)throw new RangeError("Matched-key safety limit exceeded");
      matched.push(Object.freeze({source_origin:sourceOrigin,source_key:key,record_group:group.id,
        ownership_status:classify(key,group),contents_read:false,migrated:false}));
    }
    return Object.freeze({schema:"khaemenes.grade09.key-discovery.v1",source_origin:sourceOrigin,
      classification:"key-names-only-not-a-backup",total_keys:storage.length,
      known_keys:matched.length,unmapped_count:unmapped.count,known_records:matched,
      values_read:false,owner_verified:false,cloud_uploaded:false,migration_ready:false});
  }
  return Object.freeze({version:"1.0",inspect,keyMatches,groupFor,classify});
});
