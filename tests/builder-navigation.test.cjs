const assert = require('node:assert/strict');
const test = require('node:test');
const navigation = import('../assets/js/uesl-builders/navigation.mjs');

test('room invitations select Open World unless a valid builder is explicitly requested', async () => {
  const { selectedBuilder } = await navigation;
  assert.equal(selectedBuilder(''), 'workbench');
  assert.equal(selectedBuilder('?room=demo'), 'open-world');
  assert.equal(selectedBuilder('?builder=racing&room=demo'), 'racing');
  assert.equal(selectedBuilder('?builder=unknown'), 'workbench');
  assert.equal(selectedBuilder('?builder=unknown&room=demo'), 'open-world');
});

test('builder embeds retain the deployment prefix and pass rooms only to Open World', async () => {
  const { builderSource } = await navigation;
  for (const kind of ['workbench', 'open-world', 'racing']) {
    const url = new URL(builderSource('/demo/builder?layout=wide', 'http://localhost:4700', '?room=demo%20room', kind));
    assert.equal(url.pathname, '/demo/builder');
    assert.equal(url.searchParams.get('layout'), 'wide');
    assert.equal(url.searchParams.get('embed'), '1');
    assert.equal(url.searchParams.get('room'), kind === 'open-world' ? 'demo room' : null);
  }
  assert.throws(() => builderSource('https://elsewhere.example/builder', 'http://localhost:4700', '', 'workbench'), /same origin/);
});

test('tab URLs preserve invitation and deployment information', async () => {
  const { builderLocation } = await navigation;
  const url = new URL(builderLocation('http://localhost:4700/site/play/?room=demo#old', 'racing'));
  assert.equal(url.pathname, '/site/play/');
  assert.equal(url.searchParams.get('room'), 'demo');
  assert.equal(url.searchParams.get('builder'), 'racing');
  assert.equal(url.hash, '#game-builder');
  assert.throws(() => builderLocation(url.href, 'missing'), /Unknown builder/);
});

test('keyboard tab navigation wraps and supports Home and End', async () => {
  const { nextBuilderIndex } = await navigation;
  assert.equal(nextBuilderIndex('ArrowRight', 2, 3), 0);
  assert.equal(nextBuilderIndex('ArrowLeft', 0, 3), 2);
  assert.equal(nextBuilderIndex('Home', 2, 3), 0);
  assert.equal(nextBuilderIndex('End', 0, 3), 2);
  assert.equal(nextBuilderIndex('Tab', 1, 3), null);
});
