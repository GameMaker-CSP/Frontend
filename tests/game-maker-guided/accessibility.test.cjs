const test = require('node:test');
const assert = require('node:assert/strict');
require('../../assets/js/game-maker-accessibility.js');

const { resolveProfile } = globalThis.GameMakerAccessibility;

test('profiles resolve supported settings while preserving unrelated preferences', () => {
  const result = resolveProfile('calm', {}, { audioEnabled: false, musicVolume: 0.3 });
  assert.deepEqual(
    { slowMode: result.slowMode, highContrast: result.highContrast, largeSprites: result.largeSprites, reduceMotion: result.reduceMotion },
    { slowMode: true, highContrast: false, largeSprites: false, reduceMotion: true },
  );
  assert.equal(result.audioEnabled, false);
  assert.equal(result.musicVolume, 0.3);
});

test('explicit overrides win over profile rules and unknown keys are ignored', () => {
  const result = resolveProfile('calm', { slowMode: false, unsupported: true }, { audioEnabled: true });
  assert.equal(result.slowMode, false);
  assert.equal(result.reduceMotion, true);
  assert.equal(result.unsupported, undefined);
  assert.equal(result.audioEnabled, true);
});

test('unknown profiles fall back to balanced defaults without mutating current state', () => {
  const current = { slowMode: true, customPreference: 'kept' };
  const result = resolveProfile('not-a-profile', {}, current);
  assert.equal(result.slowMode, false);
  assert.equal(result.customPreference, 'kept');
  assert.equal(current.slowMode, true);
});
