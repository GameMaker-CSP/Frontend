import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createGameImportResolver, normalizeEngineImport } from '../js/engine-paths.mjs';
import { createAssetCatalog } from '../js/asset-catalog.mjs';
import { createDefaultBuilderState, createNpcState } from '../js/builder-state.mjs';
import { generateLevelCode } from '../js/code-generator.mjs';
import { importLevelCode } from '../js/code-importer.mjs';

test('workbench imports resolve to the isolated engine at the origin and under a site base URL', () => {
  for (const base of ['', '/Frontend']) {
    const imports = createGameImportResolver(`https://example.org${base}`);
    const engine = `https://example.org${base}/assets/js/opencs-engine/GameEnginev1.1/`;
    assert.equal(imports.gameModule, `${engine}essentials/Game.js`);
    assert.equal(imports.resolve('/assets/js/GameEnginev1.1/essentials/SplineBarrier.js'), `${engine}essentials/SplineBarrier.js`);
    assert.equal(imports.resolve('/assets/js/opencs-engine/GameEnginev1.1/essentials/Npc.js'), `${engine}essentials/Npc.js`);
    assert.equal(imports.resolve('./essentials/Player.js'), `${engine}essentials/Player.js`);
    assert.equal(imports.resolve('https://example.org/custom.js'), 'https://example.org/custom.js');
    assert.equal(imports.resolve('/assets/js/custom.js'), `https://example.org${base}/assets/js/custom.js`);
  }
  assert.equal(normalizeEngineImport('/custom/GameEnginev1.1.js'), '/custom/GameEnginev1.1.js');
});

test('OpenCS source imports remain readable without losing custom code protection', () => {
  const catalog = createAssetCatalog([{ name: 'Alien', src: 'alien.jpg' }],
    [{ name: 'Player', src: 'player.png', rows: 1, cols: 1, scaleFactor: 5, movementPreset: 'single-row' }]);
  const state = createDefaultBuilderState('alien', 'player');
  state.npcs = [createNpcState(0, 'player')];
  state.barriers = [{ id: 'barrier-1', name: 'Barrier 1', points: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }] }];
  const code = generateLevelCode(state, catalog).code;
  const upstreamCode = code.replaceAll('/assets/js/opencs-engine/', '/assets/js/');
  assert.equal(importLevelCode(upstreamCode, catalog).canRegenerate, true);
  assert.equal(importLevelCode(upstreamCode.replace('STEP_FACTOR: 1000', 'STEP_FACTOR: 500'), catalog).canRegenerate, false);
  for (const match of code.matchAll(/from '([^']+)'/g)) {
    assert.match(match[1], /^\/assets\/js\/opencs-engine\/GameEnginev1\.1\//);
    assert.equal(existsSync(new URL(`../../../..${match[1]}`, import.meta.url)), true, match[1]);
  }
});

test('isolated runtime resolves lazy imports alongside itself and retains the existing API configuration', () => {
  const root = new URL('../../../../assets/js/opencs-engine/GameEnginev1.1/essentials/', import.meta.url);
  for (const name of ['Game.js', 'GameEnv.js']) {
    const source = readFileSync(new URL(name, root), 'utf8');
    assert.doesNotMatch(source, /\$\{this\.path\}\/assets\/js\/GameEnginev1\.1/);
    for (const match of source.matchAll(/new URL\('(\.\/[^']+\.js)'/g)) {
      assert.equal(existsSync(new URL(match[1], root)), true, match[1]);
    }
  }
  for (const name of ['GameEnvScore.js', 'Leaderboard.js']) {
    const source = readFileSync(new URL(name, root), 'utf8');
    const path = source.match(/from '([^']+api\/config\.js)'/)[1];
    assert.equal(existsSync(new URL(path, root)), true);
  }
});
