import assert from 'node:assert/strict';
import test from 'node:test';
import { validateGameTitle } from '../../assets/js/game-maker-guided/validation.js';

test('trims outer whitespace while preserving the participant name', () => {
  assert.deepEqual(validateGameTitle('  Rohan’s Star Quest 🎮  '), {
    ok: true, value: 'Rohan’s Star Quest 🎮',
  });
});

test('blank titles receive a correction tied to the title field', () => {
  for (const title of ['', '   ', '\n\t']) {
    const result = validateGameTitle(title);
    assert.equal(result.ok, false);
    assert.deepEqual(result.errors, [{
      field: 'title', code: 'title_required', message: 'Give your game a name.',
    }]);
  }
});

test('missing and non-text values are rejected instead of silently converted', () => {
  for (const title of [undefined, null, 123, false, [], {}]) {
    const result = validateGameTitle(title);
    assert.equal(result.ok, false);
    assert.equal(result.errors[0].code, 'title_type');
    assert.equal('value' in result, false);
  }
});

test('accepts the 40-unit boundary and rejects overlong names without truncating', () => {
  assert.deepEqual(validateGameTitle('A'.repeat(40)), { ok: true, value: 'A'.repeat(40) });
  const result = validateGameTitle('A'.repeat(41));
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].code, 'title_too_long');
  assert.equal('value' in result, false);
});

test('emoji follow the same UTF-16 length rule as the existing HTML input', () => {
  assert.equal(validateGameTitle('🎮'.repeat(20)).ok, true);
  assert.equal(validateGameTitle('🎮'.repeat(20) + 'A').ok, false);
});
