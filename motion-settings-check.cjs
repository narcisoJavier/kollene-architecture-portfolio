// Run with Node; exercises the real controller without a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'dist/assets/motion-settings.js'), 'utf8');
const key = 'kollene-site-motion';
let checks = 0;
function check(actual, expected, label) { assert.equal(actual, expected, label); checks++; }

function load({ osReduced = true, saved, storage = new Map(), failRead = false, failWrite = false } = {}) {
  if (saved !== undefined) storage.set(key, saved);
  const system = new EventTarget();
  system.matches = osReduced;
  const control = new EventTarget();
  const wrapper = { hidden: true };
  const window = new EventTarget();
  const document = {
    documentElement: { dataset: {} },
    querySelector(selector) {
      return selector === '#site-motion-setting' ? control : selector === '#site-motion-control' ? wrapper : null;
    }
  };
  const context = {
    EventTarget, Event, window, document,
    matchMedia(query) { check(query, '(prefers-reduced-motion: reduce)', 'Controller requests the system motion preference'); return system; },
    localStorage: {
      getItem(name) { if (failRead) throw new Error('Storage read denied'); return storage.get(name) ?? null; },
      setItem(name, value) { if (failWrite) throw new Error('Storage write denied'); storage.set(name, value); }
    },
    addEventListener: window.addEventListener.bind(window)
  };
  vm.runInNewContext(source, context, { filename: 'motion-settings.js' });
  window.dispatchEvent(new Event('DOMContentLoaded'));
  return {
    preference: window.portfolioMotion, document, control, wrapper, storage,
    os(value) { system.matches = value; system.dispatchEvent(new Event('change')); },
    select(value) { control.value = value; control.dispatchEvent(new Event('change')); },
    external(value) {
      const event = new Event('storage'); event.key = key; event.newValue = value; window.dispatchEvent(event);
    }
  };
}

const defaultOn = load();
check(defaultOn.preference.setting, 'on', 'No saved choice defaults to On');
check(defaultOn.preference.matches, false, 'Default On overrides system reduction');
check(defaultOn.document.documentElement.dataset.motion, 'on', 'CSS receives On');
check(defaultOn.control.value, 'on', 'Visible control reflects On');
check(defaultOn.wrapper.hidden, false, 'Motion control becomes available after DOM ready');
let events = 0;
defaultOn.preference.addEventListener('change', () => events++);
defaultOn.os(false); defaultOn.os(true);
check(defaultOn.preference.matches, false, 'Explicit On remains enabled when OS changes');
check(events, 0, 'No effective preference change emits no event');

const savedOff = load({ saved: 'off', osReduced: false });
check(savedOff.preference.matches, true, 'Saved Off disables motion even when OS permits it');
check(savedOff.control.value, 'off', 'Saved Off is shown in control');
savedOff.os(true); savedOff.os(false);
check(savedOff.preference.matches, true, 'Explicit Off remains disabled when OS changes');

const device = load({ saved: 'system', osReduced: true });
let deviceEvents = 0;
const onDeviceChange = () => deviceEvents++;
device.preference.addEventListener('change', onDeviceChange);
check(device.preference.matches, true, 'Device mode respects reduced motion');
device.os(false);
check(device.preference.matches, false, 'Device mode follows a live change to normal motion');
device.os(true);
check(device.preference.matches, true, 'Device mode follows a live change to reduced motion');
check(deviceEvents, 2, 'Both effective changes dispatch events');
device.preference.removeEventListener('change', onDeviceChange);
device.os(false);
check(deviceEvents, 2, 'Listeners can be removed');
check(load({ saved: 'system', osReduced: false }).preference.matches, false, 'Saved Device mode permits motion with normal OS setting');

defaultOn.select('off');
check(defaultOn.preference.matches, true, 'Visible control updates effective preference');
check(defaultOn.storage.get(key), 'off', 'Selection persists');
check(defaultOn.document.documentElement.dataset.motion, 'off', 'CSS updates after selection');
const reloaded = load({ storage: defaultOn.storage, osReduced: false });
check(reloaded.preference.setting, 'off', 'Reload restores the saved selection');
reloaded.preference.set('system');
check(reloaded.preference.matches, false, 'Public setter enables Device mode');
check(reloaded.control.value, 'system', 'Public setter updates the control');
reloaded.preference.set('invalid');
check(reloaded.preference.setting, 'system', 'Invalid choices are ignored');

const unavailable = load({ saved: 'off', failRead: true, failWrite: true });
check(unavailable.preference.setting, 'on', 'Storage read failure safely defaults On');
unavailable.select('off');
check(unavailable.preference.matches, true, 'Storage write failure still applies the current selection');
check(unavailable.document.documentElement.dataset.motion, 'off', 'CSS remains consistent when storage is unavailable');
check(load({ saved: 'unexpected' }).preference.setting, 'on', 'Invalid stored values default On');

reloaded.external('on');
check(reloaded.preference.setting, 'on', 'Another tab can update the setting');
check(reloaded.preference.matches, false, 'Cross-tab On permits motion');
reloaded.external(null);
check(reloaded.preference.setting, 'on', 'Deleting saved setting restores On');

console.log(`Motion settings: ${checks} checks passed.`);
