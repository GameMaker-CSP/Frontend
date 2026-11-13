import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import GameLevel from '../../../../assets/js/opencs-engine/GameEnginev1.1/essentials/GameLevel.js';
import GameEnvBackground from '../../../../assets/js/opencs-engine/GameEnginev1.1/essentials/GameEnvBackground.js';
import { GameCore } from '../../../../assets/js/opencs-engine/GameEnginev1.1/essentials/Game.js';
import GameControl from '../../../../assets/js/opencs-engine/GameEnginev1.1/essentials/GameControl.js';
import { GameExecutor } from '../js/runner/GameExecutor.js';

function fixture(t) {
  const previous = { window: globalThis.window, document: globalThis.document,
    requestAnimationFrame: globalThis.requestAnimationFrame, cancelAnimationFrame: globalThis.cancelAnimationFrame };
  const listeners = new Set();
  const frames = new Map();
  let frameId = 0;
  globalThis.requestAnimationFrame = (callback) => { frames.set(++frameId, callback); return frameId; };
  globalThis.cancelAnimationFrame = (id) => frames.delete(id);
  const fills = [];
  const container = {
    clientWidth: 800, clientHeight: 450, children: [],
    appendChild(canvas) { this.children.push(canvas); canvas.parentNode = this; },
    removeChild(canvas) { this.children.splice(this.children.indexOf(canvas), 1); canvas.parentNode = null; },
    querySelectorAll() { return [...this.children]; }
  };
  globalThis.window = {
    innerWidth: 1200, innerHeight: 900,
    addEventListener(type, handler) { if (type === 'resize') listeners.add(handler); },
    removeEventListener(type, handler) { if (type === 'resize') listeners.delete(handler); }
  };
  globalThis.document = {
    querySelector() { return null; }, getElementById() { return null; },
    removeEventListener() {},
    createElement() {
      return { style: {}, parentNode: null,
        getContext() { return { clearRect() {}, fillRect(...args) { fills.push(args); } }; },
        remove() { this.parentNode?.removeChild(this); }
      };
    }
  };
  t.after(() => Object.assign(globalThis, previous));
  const core = Object.create(GameCore.prototype);
  core.environment = { innerWidth: 800, innerHeight: 450 };
  core.gameContainer = container;
  core.path = '';
  const control = new GameControl(core, []);
  const level = new GameLevel(control);
  core.gameControl = control;
  control.currentLevel = level;
  class BackgroundLevel {
    constructor() { this.classes = [{ class: GameEnvBackground, data: {} }]; }
  }
  level.create(BackgroundLevel);
  const resize = () => [...listeners].forEach((handler) => handler());
  return { level, core, control, container, listeners, fills, resize, frames, BackgroundLevel };
}

test('layout changes resize the existing canvas and background using visible container dimensions', (t) => {
  const { level, core, container, fills, resize } = fixture(t);
  const canvas = level.gameEnv.canvas;
  const context = level.gameEnv.ctx;
  for (const width of [420, 900, 350, 800]) {
    container.clientWidth = width;
    container.clientHeight = 360;
    resize();
    assert.equal(container.children.length, 1);
    assert.equal(level.gameEnv.canvas, canvas);
    assert.equal(level.gameEnv.ctx, context);
    assert.equal(canvas.width, width);
    assert.equal(canvas.height, 360);
    assert.equal(core.environment.innerWidth, width);
    assert.deepEqual(fills.at(-1), [0, 0, width, 360]);
  }
  level.destroy();
});

test('Code-only hidden preview keeps valid dimensions and resizes correctly when shown again', (t) => {
  const { level, container, fills, resize } = fixture(t);
  const canvas = level.gameEnv.canvas;
  container.clientWidth = 0;
  container.clientHeight = 0;
  resize();
  assert.equal(container.children.length, 1);
  assert.equal(canvas.width, 800);
  assert.equal(canvas.height, 450);
  assert.equal(fills.length, 0);
  container.clientWidth = 480;
  container.clientHeight = 600;
  resize();
  assert.equal(canvas.width, 480);
  assert.equal(canvas.height, 600);
  assert.deepEqual(fills.at(-1), [0, 0, 480, 600]);
  level.destroy();
});

test('destroy removes its exact resize listener and repeated resize cannot resurrect a stopped level', (t) => {
  const { level, container, listeners, resize } = fixture(t);
  assert.equal(listeners.size, 1);
  level.destroy();
  assert.equal(listeners.size, 0);
  resize();
  level.resize();
  level.gameEnv.resize();
  assert.equal(container.children.length, 0);
  assert.equal(level.gameEnv.canvas, null);
  assert.doesNotThrow(() => level.destroy());
});

test('runner Stop tears down the live level before a subsequent view resize', (t) => {
  const { level, core, control, container, listeners, resize } = fixture(t);
  const runner = new GameExecutor({ getGameContainer: () => container });
  runner.gameCore = core;
  runner.gameControl = control;
  runner.stop();
  assert.equal(listeners.size, 0);
  resize();
  assert.equal(container.children.length, 0);
  assert.equal(level.gameEnv.canvas, null);
  assert.equal(runner.gameCore, null);
  assert.equal(runner.gameControl, null);
});

test('Stop cancels animation callbacks and a delayed old frame cannot restart the level', (t) => {
  const { core, control, container, frames } = fixture(t);
  control.gameLoop();
  assert.equal(frames.size, 1);
  const queuedCallback = [...frames.values()][0];
  core.destroy();
  assert.equal(frames.size, 0);
  queuedCallback();
  assert.equal(frames.size, 0);
  assert.equal(container.children.length, 0);
});

test('a new run after Stop has one resize listener and fullscreen delegates to that level', (t) => {
  const { core, container, listeners, BackgroundLevel, resize } = fixture(t);
  core.destroy();
  const nextCore = Object.assign(Object.create(GameCore.prototype), {
    environment: { innerWidth: 800, innerHeight: 450 }, path: '', gameContainer: container
  });
  const nextControl = new GameControl(nextCore, []);
  nextCore.gameControl = nextControl;
  const nextLevel = new GameLevel(nextControl);
  nextControl.currentLevel = nextLevel;
  nextLevel.create(BackgroundLevel);
  assert.equal(listeners.size, 1);
  const runner = new GameExecutor({ getGameContainer: () => container });
  runner.gameCore = nextCore;
  runner.gameControl = nextControl;
  container.clientWidth = 1000;
  container.clientHeight = 700;
  runner._resizeGameForViewport();
  resize();
  assert.equal(container.children.length, 1);
  assert.equal(nextLevel.gameEnv.canvas.width, 1000);
  assert.equal(nextLevel.gameEnv.canvas.height, 700);
  runner.stop();
  assert.equal(listeners.size, 0);
});

test('Hide and Show builder resize the running canvas after changing the workspace width', (t) => {
  const { level, container, resize } = fixture(t);
  const source = readFileSync(new URL('../js/app.mjs', import.meta.url), 'utf8');
  const handler = source.slice(source.indexOf("collapseButton.addEventListener('click'"), source.indexOf('\ntry {'));
  let click;
  let expanded = 'true';
  const builderPanel = { hidden: false };
  const collapseButton = {
    addEventListener(type, callback) { assert.equal(type, 'click'); click = callback; },
    getAttribute() { return expanded; },
    setAttribute(name, value) { expanded = value; }
  };
  vm.runInNewContext(handler, {
    collapseButton, builderPanel,
    workspace: { classList: { toggle(name, hidden) {
      assert.equal(name, 'is-builder-collapsed');
      container.clientWidth = hidden ? 1100 : 800;
    } } },
    window: { dispatchEvent(event) { assert.equal(event.type, 'resize'); resize(); } }, Event
  });
  click();
  assert.equal(builderPanel.hidden, true);
  assert.equal(level.gameEnv.canvas.width, 1100);
  click();
  assert.equal(builderPanel.hidden, false);
  assert.equal(level.gameEnv.canvas.width, 800);
  assert.equal(container.children.length, 1);
  level.destroy();
});
