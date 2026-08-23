/* Khaemenes Grade 9 Social Studies · Week 26 Simulation Bridge v1
   Sovereign bridge: links course investigations to reusable Finance Academy simulators.
   No financial advice; educational modeling only. */
(function(){'use strict';
  const sims=[
    {id:'SS9-W26-SIM-GROWTH',title:'Long-Run Economic Growth Simulator',url:'https://vervenveda.github.io/finance/apps/simulator_economic_growth_index.html',concepts:['investment','depreciation','population growth','technology','output per worker'],task:'Change one variable at a time. Record the setting, predicted effect, observed effect, and one limitation of the model.'},
    {id:'SS9-W26-SIM-SUPPLY-DEMAND',title:'Supply & Demand Simulator',url:'https://vervenveda.github.io/finance/apps/simulator_supply_demand_index.html',concepts:['supply','demand','equilibrium','price','quantity'],task:'Run five different supply/demand settings. Record equilibrium price and quantity, then explain one observed change without claiming the model represents an entire historical economy.'}
  ];
  window.KhaemenesWeek26SimulationBridge={version:'1.0.0',course:'grade09-global-studies-honors',week:'26',simulations:sims,learningProtocol:['predict','change one variable','observe','record','explain','identify limitation','corroborate with historical evidence'],get(id){return sims.find(s=>s.id===id)||null;}};
})();