const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const worldSource = fs.readFileSync(path.join(__dirname, '../js/settings.js'), 'utf8');

test('the inherited D-pad preference works after Run without an undefined callback', () => {
  const start = worldSource.indexOf('function applyDpadPosition()');
  const end = worldSource.indexOf("window.addEventListener('resize'", start);
  assert.ok(start >= 0 && end > start, 'the runtime callback must be defined');
  const pad = { parentElement: { style: {} } };
  let pads = [pad];
  let bounds = { left: 100, right: 850, bottom: 650 };
  const context = vm.createContext({
    gbSettings: { dpadRight: true },
    window: { innerWidth: 1000, innerHeight: 800 },
    document: {
      getElementById: () => bounds ? { getBoundingClientRect: () => bounds } : null,
      querySelectorAll: selector => { assert.equal(selector, '.dpad-container'); return pads; },
    },
  });
  vm.runInContext(worldSource.slice(start, end), context);
  vm.runInContext('applyDpadPosition()', context);
  assert.deepEqual(pad.parentElement.style, { left: 'auto', right: '166px', bottom: '166px' });
  vm.runInContext('gbSettings.dpadRight = false; applyDpadPosition()', context);
  assert.deepEqual(pad.parentElement.style, { left: '116px', right: 'auto', bottom: '166px' });
  bounds = null;
  vm.runInContext('applyDpadPosition()', context);
  assert.deepEqual(pad.parentElement.style, { left: '16px', right: 'auto', bottom: '16px' });
  pads = [];
  assert.doesNotThrow(() => vm.runInContext('applyDpadPosition()', context), 'desktop games without touch controls still run');
});
