import assert from 'node:assert/strict';
import test from 'node:test';
import { GUIDED_THEMES, selectGuidedTheme } from '../../assets/js/game-maker-guided/theme-catalog.js';

test('lists three collector scenes and selects each inherited engine ID', () => {
  assert.deepEqual(selectGuidedTheme().options.map(t => t.id), ['space', 'sunset', 'ocean']);
  for (const id of ['space', 'sunset', 'ocean']) {
    const result = selectGuidedTheme({ id });
    assert.equal(result.ok, true);
    assert.equal(result.selected.id, id);
  }
});
test('eligibility depends on game mode rather than silently changing a game format', () => {
  assert.equal(selectGuidedTheme({ id: 'maze', mode: 'maze' }).selected.id, 'maze');
  assert.equal(selectGuidedTheme({ id: 'maze', mode: 'collect-stars' }).ok, false);
  assert.equal(selectGuidedTheme({ id: 'ocean', mode: 'maze' }).ok, false);
});
test('unknown and empty choices return a field correction with no selected replacement', () => {
  for (const id of ['missing', '', null]) {
    const result = selectGuidedTheme({ id });
    assert.equal(result.ok, false);
    assert.equal(result.errors[0].field, 'background');
    assert.equal(result.selected, undefined);
  }
  assert.deepEqual(selectGuidedTheme({}, []).options, []);
});
test('adding an eligible entry needs only catalog data, not another selector branch', () => {
  const catalog = [...GUIDED_THEMES, { id: 'dark', label: 'Dark Space', modes: ['collect-stars'] }];
  assert.equal(selectGuidedTheme({ id: 'dark' }, catalog).selected.id, 'dark');
  assert.equal(GUIDED_THEMES.length, 4);
});
