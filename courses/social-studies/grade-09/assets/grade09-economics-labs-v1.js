/* Khaemenes Grade 9 Social Studies · local economics labs v1
   Small, transparent classroom models. No network calls and no financial advice. */
(() => {
  'use strict';
  const root = document.querySelector('[data-ss9-economic-lab]');
  if (!root) return;
  const kind = root.dataset.ss9EconomicLab;
  const base = `khaemenes_ss9_${kind}_lab_v1`;
  const records = window.KhaemenesSS9Records;
  const status = document.getElementById('lab-status');
  const setStatus = (text, bad = false) => {
    if (!status) return;
    status.textContent = text;
    status.className = `notice${bad ? ' lab-error' : ''}`;
  };
  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
  const number = id => Number(document.getElementById(id)?.value || 0);
  const value = id => document.getElementById(id)?.value || '';
  const setValue = (id, next) => { const el = document.getElementById(id); if (el && next !== undefined) el.value = next; };

  function load() {
    try {
      const raw = records?.storage?.getItem(base);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      setStatus('This lab record could not be read safely. Saving is paused; copy any writing before reloading.', true);
      return {};
    }
  }
  function save(state) {
    try {
      if (!records?.storage) throw new Error('The guarded course record adapter is unavailable.');
      records.storage.setItem(base, JSON.stringify(state));
      setStatus('Saved on this device. The model output is classroom evidence for reasoning, not historical proof.');
    } catch (error) {
      setStatus('Saving is paused because the learner record changed or could not be written. Copy your work before leaving this page.', true);
    }
  }
  function collect() {
    const state = { version: 1, savedAt: new Date().toISOString(), kind };
    root.querySelectorAll('[data-save]').forEach(el => { state[el.id] = el.value; });
    root.querySelectorAll('[data-run]').forEach(row => {
      const run = {};
      row.querySelectorAll('[data-field]').forEach(el => { run[el.dataset.field] = el.value; });
      state.runs = state.runs || [];
      state.runs.push(run);
    });
    return state;
  }
  function restore(state) {
    root.querySelectorAll('[data-save]').forEach(el => { if (state[el.id] !== undefined) el.value = state[el.id]; });
    (state.runs || []).forEach((run, i) => {
      const row = root.querySelectorAll('[data-run]')[i];
      if (!row) return;
      row.querySelectorAll('[data-field]').forEach(el => { if (run[el.dataset.field] !== undefined) el.value = run[el.dataset.field]; });
    });
  }
  function renderGrowth() {
    const savings = number('growth-savings') / 100;
    const depreciation = number('growth-depreciation') / 100;
    const population = number('growth-population') / 10;
    const technology = number('growth-technology') / 10;
    const capital = clamp(100 * (0.35 + 0.8 * savings - 0.55 * depreciation - 0.2 * population + 0.25 * technology));
    const output = clamp(100 * (0.25 + 0.45 * Math.sqrt(capital / 100) + 0.2 * technology - 0.1 * population));
    const potential = clamp(100 * (0.4 * output / 100 + 0.25 * savings + 0.2 * technology - 0.25 * depreciation));
    [['growth-capital', capital], ['growth-output', output], ['growth-potential', potential]].forEach(([id, n]) => {
      const el = document.getElementById(id); if (el) { el.value = Math.round(n); el.textContent = Math.round(n); }
    });
    [['growth-savings', 'growth-savings-out'], ['growth-depreciation', 'growth-depreciation-out'], ['growth-population', 'growth-population-out'], ['growth-technology', 'growth-technology-out']].forEach(([input, outputId]) => {
      const el = document.getElementById(outputId); if (el) el.textContent = value(input);
    });
  }
  function renderSupply() {
    const demand = number('market-demand');
    const supply = number('market-supply');
    const price = clamp(50 + 0.7 * (demand - 50) - 0.6 * (supply - 50));
    const quantity = clamp(50 + 0.45 * (demand - 50) + 0.55 * (supply - 50));
    [['market-price', price], ['market-quantity', quantity]].forEach(([id, n]) => {
      const el = document.getElementById(id); if (el) { el.value = Math.round(n); el.textContent = Math.round(n); }
    });
    [['market-demand', 'market-demand-out'], ['market-supply', 'market-supply-out']].forEach(([input, outputId]) => {
      const el = document.getElementById(outputId); if (el) el.textContent = value(input);
    });
  }
  const state = load();
  restore(state);
  const render = kind === 'week26' ? renderGrowth : renderSupply;
  root.querySelectorAll('input[type="range"]').forEach(el => el.addEventListener('input', render));
  root.querySelectorAll('[data-save]').forEach(el => el.addEventListener('change', () => setStatus('Changes are ready to save.')));
  document.getElementById('save-lab')?.addEventListener('click', () => save(collect()));
  document.getElementById('print-lab')?.addEventListener('click', () => window.print());
  render();
  setStatus(state.savedAt ? `Restored the last saved ${kind === 'week26' ? 'growth' : 'market'} record from this device.` : 'Local course model ready. No online tool is required.');
})();
