const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function preferences() {
  const properties = new Map();
  const classes = new Set();
  const root = {
    style: { setProperty: (key, value) => properties.set(key, value), removeProperty: key => properties.delete(key) },
    classList: { add: value => classes.add(value), remove: value => classes.delete(value), contains: value => classes.has(value) },
    setAttribute() {},
  };
  const document = {
    documentElement: root, readyState: 'loading', addEventListener() {},
    getElementById: () => null, querySelector: () => null,
    createElement: () => { throw new Error('Theme changes must not inject CSS or external resources'); },
  };
  const window = { location: { hostname: 'localhost' }, localStorage: { getItem: () => null } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/js/user-preferences.js'), 'utf8'), { document, window });
  return { api: window.SitePreferences, properties, classes };
}

test('repeated theme changes replace tokens and reset restores CSS defaults without injected styles', () => {
  const { api, properties, classes } = preferences();
  api.applyPreferences({ ...api.PRESETS.Ocean, buttonStyle: 'pill' });
  assert.equal(properties.get('--pref-bg-color'), '#0c1929');
  assert.equal(properties.get('--pref-button-radius'), '9999px');
  assert.equal(properties.get('--ocs-on-accent'), '#000000');
  api.applyPreferences({ ...api.PRESETS.Light, size: 18, buttonStyle: 'square' });
  assert.equal(properties.get('--pref-text-color'), '#172b3a');
  assert.equal(properties.get('--pref-font-size'), '18px');
  assert.equal(properties.get('--pref-button-radius'), '0');
  assert.equal(properties.get('--ocs-on-accent'), '#ffffff');
  assert.ok(classes.has('user-theme-active'));
  api.resetPreferences();
  assert.equal(properties.size, 0, 'No inline theme tokens may survive a reset');
  assert.ok(!classes.has('user-theme-active'));
});

test('filled button foreground chooses the higher-contrast black or white for custom accents', () => {
  const { api, properties } = preferences();
  for (const [accent, foreground] of [['#fff', '#000000'], ['#000000', '#ffffff'], ['#155586', '#ffffff'], ['#00d4ff', '#000000']]) {
    api.applyPreferences({ accent });
    assert.equal(properties.get('--ocs-on-accent'), foreground);
  }
});
