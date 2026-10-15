/* Khaemenes High · Archaemenes Voice Bridge · v1.0.0
   Presentation-only voice layer. No microphone, no network transport, no transcript storage.
   A future sovereign/custom provider may register through registerProvider(). */
(() => {
  "use strict";

  const SETTINGS_KEY="khaemenes_archaemenes_voice_v1";
  const VERSION="1.0.0";
  const PROFILE=Object.freeze({
    profileId:"archaemenes-high-v1",
    displayName:"Archaemenes",
    language:"en-US",
    defaultMode:"system",
    defaultRate:0.94,
    defaultPitch:0.96,
    defaultVolume:1
  });
  const MAX_TEXT=4000;
  let customProvider=null;
  let activeUtterance=null;

  const clean=(value,max=MAX_TEXT)=>String(value??"").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim().slice(0,max);
  const clamp=(value,min,max,fallback)=>{
    const n=Number(value);
    return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;
  };
  const defaults=()=>({
    version:VERSION,
    profileId:PROFILE.profileId,
    mode:"system",
    autoSpeak:false,
    voiceName:"",
    language:PROFILE.language,
    rate:PROFILE.defaultRate,
    pitch:PROFILE.defaultPitch,
    volume:PROFILE.defaultVolume
  });
  function readSettings(){
    try{
      const parsed=JSON.parse(localStorage.getItem(SETTINGS_KEY)||"null");
      return sanitizeSettings(parsed);
    }catch{return defaults()}
  }
  function sanitizeSettings(input){
    const d=defaults(),x=input&&typeof input==="object"?input:{};
    return {
      ...d,
      mode:x.mode==="custom"?"custom":"system",
      autoSpeak:x.autoSpeak===true,
      voiceName:clean(x.voiceName,160),
      language:clean(x.language,32)||d.language,
      rate:clamp(x.rate,.5,1.5,d.rate),
      pitch:clamp(x.pitch,.5,1.5,d.pitch),
      volume:clamp(x.volume,0,1,d.volume)
    };
  }
  function saveSettings(patch){
    const next=sanitizeSettings({...readSettings(),...(patch||{})});
    try{
      localStorage.setItem(SETTINGS_KEY,JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("khaemenes:archaemenes-voice-settings",{detail:{settings:{...next}}}));
    }catch{}
    return next;
  }
  function voices(){
    try{
      if(!("speechSynthesis" in window))return[];
      return speechSynthesis.getVoices().map(v=>({
        name:String(v.name||""),
        lang:String(v.lang||""),
        localService:v.localService===true,
        default:v.default===true
      })).filter(v=>v.name).sort((a,b)=>Number(b.localService)-Number(a.localService)||Number(b.default)-Number(a.default)||a.name.localeCompare(b.name));
    }catch{return[]}
  }
  function chooseSystemVoice(settings){
    try{
      const list=speechSynthesis.getVoices();
      return list.find(v=>v.name===settings.voiceName)
        ||list.find(v=>v.localService&&String(v.lang||"").toLowerCase()===settings.language.toLowerCase())
        ||list.find(v=>v.localService&&String(v.lang||"").toLowerCase().startsWith(settings.language.slice(0,2).toLowerCase()))
        ||list.find(v=>v.default)
        ||list[0]
        ||null;
    }catch{return null}
  }
  function cancel(){
    try{customProvider?.cancel?.()}catch{}
    try{speechSynthesis?.cancel?.()}catch{}
    activeUtterance=null;
  }
  function systemSpeak(text,settings){
    return new Promise(resolve=>{
      if(!("speechSynthesis" in window)||typeof SpeechSynthesisUtterance!=="function"){
        resolve({ok:false,reason:"speech-synthesis-unavailable"});return;
      }
      const utterance=new SpeechSynthesisUtterance(text);
      const voice=chooseSystemVoice(settings);
      if(voice)utterance.voice=voice;
      utterance.lang=voice?.lang||settings.language||PROFILE.language;
      utterance.rate=settings.rate;
      utterance.pitch=settings.pitch;
      utterance.volume=settings.volume;
      activeUtterance=utterance;
      utterance.onend=()=>{if(activeUtterance===utterance)activeUtterance=null;resolve({ok:true,mode:"system",voice:voice?.name||null})};
      utterance.onerror=event=>{if(activeUtterance===utterance)activeUtterance=null;resolve({ok:false,reason:String(event?.error||"speech-error")})};
      try{
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }catch(error){
        activeUtterance=null;
        resolve({ok:false,reason:String(error?.message||"speech-error")});
      }
    });
  }
  async function speak(text,context={}){
    const cleaned=clean(text);
    if(!cleaned)return{ok:false,reason:"empty-text"};
    const settings=readSettings();
    cancel();
    if(settings.mode==="custom"){
      if(!customProvider||typeof customProvider.speak!=="function")return{ok:false,reason:"custom-provider-unavailable"};
      try{
        const result=await customProvider.speak({
          text:cleaned,
          profile:{...PROFILE},
          settings:{...settings},
          context:{
            stage:clean(context.stage,20)||"high",
            subject:clean(context.subject,60),
            courseId:clean(context.courseId,100),
            source:clean(context.source,240),
            mentor:"Archaemenes"
          }
        });
        return result&&typeof result==="object"?result:{ok:result!==false,mode:"custom",provider:customProvider.id||"custom"};
      }catch(error){return{ok:false,reason:clean(error?.message||"custom-provider-error",160)}}
    }
    return systemSpeak(cleaned,settings);
  }
  function registerProvider(provider){
    if(!provider||typeof provider!=="object"||typeof provider.speak!=="function")return false;
    const id=clean(provider.id,80);
    if(!id)return false;
    customProvider=Object.freeze({
      id,
      label:clean(provider.label||id,120),
      speak:provider.speak.bind(provider),
      cancel:typeof provider.cancel==="function"?provider.cancel.bind(provider):null,
      status:typeof provider.status==="function"?provider.status.bind(provider):null
    });
    window.dispatchEvent(new CustomEvent("khaemenes:archaemenes-custom-voice-provider",{detail:{id:customProvider.id,label:customProvider.label}}));
    return true;
  }
  function status(){
    const settings=readSettings();
    return {
      version:VERSION,
      profile:{...PROFILE},
      settings,
      systemAvailable:"speechSynthesis" in window&&typeof SpeechSynthesisUtterance==="function",
      customProvider:customProvider?{id:customProvider.id,label:customProvider.label}:null,
      microphoneRequired:false,
      storesConversationText:false,
      authority:"presentation-only"
    };
  }

  if("speechSynthesis" in window){
    try{
      speechSynthesis.addEventListener?.("voiceschanged",()=>window.dispatchEvent(new CustomEvent("khaemenes:archaemenes-voices-changed",{detail:{voices:voices()}})));
      if("onvoiceschanged" in speechSynthesis&&!speechSynthesis.onvoiceschanged){
        speechSynthesis.onvoiceschanged=()=>window.dispatchEvent(new CustomEvent("khaemenes:archaemenes-voices-changed",{detail:{voices:voices()}}));
      }
    }catch{}
  }

  window.KhaemenesArchaemenesVoice=Object.freeze({
    version:VERSION,
    profile:PROFILE,
    settings:readSettings,
    saveSettings,
    voices,
    speak,
    cancel,
    registerProvider,
    status
  });
})();
