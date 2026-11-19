if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    const hadController=Boolean(navigator.serviceWorker.controller);
    let recoveryReload=false;
    navigator.serviceWorker.addEventListener("controllerchange",()=>{
      if(!hadController||recoveryReload)return;
      recoveryReload=true;
      location.reload();
    },{once:true});
    navigator.serviceWorker.register("service-worker.js",{scope:"./",updateViaCache:"none"})
      .then(registration=>registration.update())
      .catch(error=>console.warn("Pre-Algebra offline core could not be registered.",error));
  },{once:true});
}
