const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const builderPath = path.join(__dirname, '../_projects/systems');
const read = (name, file) => fs.readFileSync(path.join(builderPath, name, file), 'utf8');
const racingSource = read('racing', 'index.md');
const worldSource = read('open-world', 'index.md');
const scripts = name => fs.readdirSync(path.join(builderPath, name, 'js'))
  .filter(file => file.endsWith('.js'))
  .map(file => read(name, 'js/' + file).replace(/^---\n[\s\S]*?\n---\n/, ''));
const racingScripts = scripts('racing');
const worldScripts = scripts('open-world');

test('the shared presentation preserves inherited game choices and accessibility controls', () => {
  for (const value of ['desert', 'alien', 'maze', 'maze2', 'chillguy', 'tux', 'r2d2']) {
    assert.ok(worldSource.includes(`value="${value}"`), `Open World choice ${value} remains available`);
  }
  for (const id of ['gb-slow-mode', 'gb-high-contrast', 'gb-large-sprites', 'gb-dpad-right', 'gb-voice', 'gb-face']) {
    assert.ok(worldSource.includes(`id="${id}"`), `${id} remains available`);
  }
  for (const value of ['city_sprint', 'mountain_pass', 'desert_dash', 'coastal_circuit', 'forest_rally', 'night_circuit']) {
    assert.ok(racingSource.includes(`value="${value}"`), `Race track ${value} remains available`);
  }
  for (const [source, scripts] of [[worldSource, worldScripts], [racingSource, racingScripts]]) {
    assert.match(source, /layout: uesl-builder/);
    assert.ok(source.indexOf('class="glass-panel panel-game"') < source.indexOf('class="glass-panel code-panel panel-code"'), 'keyboard order follows preview then code, matching OpenCS');
    assert.match(scripts.join('\n'), /addEventListener\('uesl:pause-builder'/);
    for (const script of scripts) {
      new vm.Script(script, { filename: 'inherited-builder-script.js' });
    }
  }
});

test('Run and Stop remain available outside the panels hidden by Game or Code view', () => {
  for (const [source, runId, stopId, statusId] of [
    [worldSource, 'btn-code-play', 'btn-code-stop', 'gb-run-status'],
    [racingSource, 'crb-btn-race', 'crb-btn-stop', 'crb-run-status'],
  ]) {
    const toolbar = source.slice(source.indexOf('<div class="view-controls">'), source.indexOf('<div class="main-content">'));
    assert.match(toolbar, /class="uesl-builder-run-controls"/);
    for (const id of [runId, stopId, statusId]) {
      assert.ok(toolbar.includes(`id="${id}"`), `${id} is in the persistent toolbar`);
      assert.equal(source.split(`id="${id}"`).length - 1, 1, `${id} stays unique`);
    }
    const views = [...toolbar.matchAll(/class="view-btn[^>]*>(Game|Code|Split)<\/button>/g)].map(match => match[1]);
    assert.deepEqual(views, ['Game', 'Code', 'Split']);
  }
});

