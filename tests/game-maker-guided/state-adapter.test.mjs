import assert from 'node:assert/strict';
import test from 'node:test';
import { configureGameTitle } from '../../assets/js/game-maker-guided/state-adapter.js';

function exampleSave() {
  return {
    game: {
      title: 'Original', playerName: 'Hero', playerEmoji: '🎮', background: 'dark',
      levels: [{
        playerStart: { x: 60, y: 60 }, barriers: [], npcs: [],
        stars: [{ id: 1, x: 120, y: 120 }], hearts: [], startHearts: 3,
      }],
      futureOption: { enabled: true },
    },
    nextId: 2,
    futureMetadata: 'preserve me',
  };
}

function freezeDeep(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freezeDeep);
    Object.freeze(value);
  }
  return value;
}

test('configures a title without mutating a frozen input or dropping saved fields', () => {
  const snapshot = freezeDeep(exampleSave());
  const before = JSON.stringify(snapshot);
  const result = configureGameTitle(snapshot, '  Star Adventure  ');
  const expected = exampleSave();
  expected.game.title = 'Star Adventure';
  assert.deepEqual(result, { ok: true, value: expected });
  assert.equal(JSON.stringify(snapshot), before);
  assert.notEqual(result.value, snapshot);
  assert.notEqual(result.value.game, snapshot.game);
});

test('an invalid title returns a correction without replacing the draft', () => {
  const snapshot = freezeDeep(exampleSave());
  const result = configureGameTitle(snapshot, '  ');
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].field, 'title');
  assert.equal('value' in result, false);
  assert.deepEqual(snapshot, exampleSave());
});

test('missing or malformed envelopes return a saved-game error instead of throwing', () => {
  const cases = [null, undefined, [], 'broken', {}, { game: null }, { game: [] },
    { game: { levels: 'broken' }, nextId: 1 },
    ...[undefined, 0, -1, 1.5, '2', Number.MAX_SAFE_INTEGER + 1]
      .map(nextId => ({ game: { levels: [] }, nextId }))];
  for (const snapshot of cases) {
    const result = configureGameTitle(snapshot, 'New name');
    assert.equal(result.ok, false);
    assert.equal(result.errors[0].code, 'invalid_save_envelope');
    assert.equal('value' in result, false);
  }
});

test('the output survives the inherited local/account JSON envelope round trip', () => {
  const result = configureGameTitle(exampleSave(), 'Saved Game');
  const accountBody = { name: 'Library label', game_data: JSON.stringify(result.value) };
  const restored = JSON.parse(accountBody.game_data);
  assert.equal(restored.game.title, 'Saved Game');
  assert.equal(restored.nextId, 2);
  assert.deepEqual(restored.game.levels, exampleSave().game.levels);
  assert.equal(accountBody.name, 'Library label');
});

test('reapplying the same title does not change IDs or duplicate levels', () => {
  const first = configureGameTitle(exampleSave(), 'New name');
  assert.deepEqual(configureGameTitle(first.value, 'New name'), first);
});

test('older levels retain absent optional fields without a silent migration', () => {
  const snapshot = exampleSave();
  delete snapshot.game.levels[0].hearts;
  delete snapshot.game.levels[0].startHearts;
  const result = configureGameTitle(snapshot, 'Legacy Game');
  assert.equal(result.ok, true);
  assert.equal('hearts' in result.value.game.levels[0], false);
  assert.equal('startHearts' in result.value.game.levels[0], false);
});
