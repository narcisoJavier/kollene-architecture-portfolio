(() => {
  'use strict';
  const key = 'kollene-site-motion';
  const system = matchMedia('(prefers-reduced-motion: reduce)');
  const changes = new EventTarget();
  const valid = value => ['on', 'off', 'system'].includes(value);
  let setting = 'on'; // Explicit portfolio direction: motion plays by default.
  try { const saved = localStorage.getItem(key); if (valid(saved)) setting = saved; } catch {}
  let reduced = setting === 'off' || (setting === 'system' && system.matches);
  const preference = {
    get matches() { return reduced; },
    get setting() { return setting; },
    addEventListener: (...args) => changes.addEventListener(...args),
    removeEventListener: (...args) => changes.removeEventListener(...args),
    set(value) {
      if (!valid(value)) return;
      setting = value;
      try { localStorage.setItem(key, value); } catch {}
      sync();
    }
  };
  function sync() {
    document.documentElement.dataset.motion = setting;
    const control = document.querySelector('#site-motion-setting');
    if (control) control.value = setting;
    const next = setting === 'off' || (setting === 'system' && system.matches);
    if (next !== reduced) { reduced = next; changes.dispatchEvent(new Event('change')); }
  }
  window.portfolioMotion = preference;
  sync();
  system.addEventListener('change', sync);
  addEventListener('storage', event => {
    if (event.key !== key) return;
    setting = valid(event.newValue) ? event.newValue : 'on'; sync();
  });
  addEventListener('DOMContentLoaded', () => {
    const control = document.querySelector('#site-motion-setting');
    if (!control) return;
    control.value = setting;
    control.addEventListener('change', () => preference.set(control.value));
    document.querySelector('#site-motion-control').hidden = false;
  });
})();
