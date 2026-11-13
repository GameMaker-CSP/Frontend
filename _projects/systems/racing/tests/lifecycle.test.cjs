const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const racingSource = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

// Exercise the actual inherited race lifecycle without requiring a canvas renderer.
function raceHarness() {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, {
      style: {}, textContent: '', disabled: false, classList: { add() {}, remove() {} },
    });
    return elements.get(id);
  };
  let nextTimer = 0;
  const timers = new Map();
  const cancelledFrames = [];
  const context = vm.createContext({
    document: { getElementById: element },
    setTimeout: callback => { timers.set(++nextTimer, callback); return nextTimer; },
    clearTimeout: id => timers.delete(id),
    cancelAnimationFrame: id => cancelledFrames.push(id),
  });
  const source = racingSource.slice(racingSource.indexOf('class RaceManager {'), racingSource.indexOf('function initStatSliders()'));
  vm.runInContext(source + '\nglobalThis.RaceManager = RaceManager;', context);
  const race = Object.create(context.RaceManager.prototype);
  Object.assign(race, { _runGeneration: 0, _raf: null, _countdownTimer: null, _stopPreview: null, running: false, countdown: false, keys: {} });
  let idleDraws = 0;
  race.drawIdle = () => { idleDraws++; };
  return { race, element, timers, cancelledFrames, idleDraws: () => idleDraws };
}

test('stopping during the race countdown cannot start a hidden race later', () => {
  const { race, timers, element } = raceHarness();
  let starts = 0;
  race._doCountdown(() => starts++);
  const queuedCallback = [...timers.values()][0];
  assert.equal(element('crb-countdown-num').textContent, '3');
  race.stopRace();
  assert.equal(timers.size, 0);
  queuedCallback(); // A callback already queued before cancellation must be inert too.
  assert.equal(starts, 0);
  assert.equal(timers.size, 0);
  assert.equal(race.countdown, false);
  assert.equal(element('crb-countdown-num').style.display, 'none');
});

test('a restarted countdown ignores the previous run and starts exactly once', () => {
  const { race, timers } = raceHarness();
  let oldStarts = 0;
  let starts = 0;
  race._doCountdown(() => oldStarts++);
  const staleCallback = [...timers.values()][0];
  race.stopRace(false);
  race._doCountdown(() => starts++);
  staleCallback();
  while (timers.size) {
    const [id, callback] = timers.entries().next().value;
    timers.delete(id);
    callback();
  }
  assert.equal(oldStarts, 0);
  assert.equal(starts, 1);
  assert.equal(race.countdown, false);
});

test('Stop cancels preview and active frames, clears held controls, and restores idle view', () => {
  const { race, cancelledFrames, element, idleDraws } = raceHarness();
  let previewsStopped = 0;
  Object.assign(race, { running: true, _raf: 42, keys: { ArrowUp: true }, _stopPreview: () => previewsStopped++ });
  race.stopRace();
  assert.equal(race.running, false);
  assert.deepEqual(cancelledFrames, [42]);
  assert.equal(previewsStopped, 1);
  assert.equal(Object.keys(race.keys).length, 0);
  assert.equal(idleDraws(), 1);
  assert.equal(element('crb-run-status').textContent, 'Stopped');
  assert.equal(element('crb-btn-stop').disabled, true);
});

