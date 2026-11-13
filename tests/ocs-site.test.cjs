const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('community and account routes share OCS without the removed skin or duplicate IDs', () => {
  const routes = ['index.html', 'login.html', 'survey.html', 'profile.html',
    ...['about', 'events', 'announcements', 'gallery', 'locations', 'contact', 'play'].map(route => `${route}/index.html`)];
  for (const route of routes) {
    const html = read(`_site/${route}`);
    const styles = [...html.matchAll(/<link[^>]*href="([^"?]+\.css)(?:\?[^\"]*)?"/g)].map(m => m[1]).filter(url => url.startsWith('/'));
    assert.deepEqual(styles, route.startsWith('play/') ? ['/assets/css/ocs.css', '/assets/css/game-builder.css'] : ['/assets/css/ocs.css'], route);
    assert.doesNotMatch(html, /\sstyle="|<style\b|slm-overlay|social-login-modal/, route);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${route}: every control must have a unique ID`);
    assert.match(html, /<dialog id="social-overlay"/);
    assert.match(html, /<main[^>]+id="main"/);
  }
});

test('social controls keep real DOM targets after replacing the shell', () => {
  const html = read('_site/index.html');
  const script = read('assets/js/uesl-community/social.js');
  const generatedIds = ['afm-manual-uid', 'afm-manual-add'];
  for (const [, id] of script.matchAll(/(?:\$|getElementById)\('([^']+)'\)/g)) {
    assert.ok(html.includes(`id="${id}"`) || generatedIds.includes(id), `Missing social control: ${id}`);
  }
  assert.doesNotMatch(script, /\.style\.|\sstyle="|createElement\(['"]style/);
  new vm.Script(script);
});

test('hidden OCS fields stay hidden when added dynamically and can be revealed', () => {
  const element = hidden => {
    const classes = new Set();
    return { nodeType: 1, hidden, classes, querySelectorAll: () => [],
      classList: { add: name => classes.add(name), toggle: (name, on) => on ? classes.add(name) : classes.delete(name) } };
  };
  const initial = element(true);
  let notify;
  vm.runInNewContext(read('assets/js/uesl-community/site.js'), {
    document: { body: {}, querySelectorAll: () => [initial] },
    MutationObserver: class { constructor(callback) { notify = callback; } observe() {} },
  });
  assert.ok(initial.classes.has('ocs__hidden'));
  const classOnly = element(false);
  classOnly.classes.add('ocs__hidden');
  notify([{ type: 'childList', addedNodes: [classOnly] }]);
  assert.ok(classOnly.classes.has('ocs__hidden'), 'Do not reveal components that manage visibility with classes');
  const added = element(true);
  notify([{ type: 'childList', addedNodes: [added] }]);
  assert.ok(added.classes.has('ocs__hidden'));
  added.hidden = false;
  notify([{ type: 'attributes', target: added }]);
  assert.equal(added.classes.has('ocs__hidden'), false);
  added.hidden = true;
  notify([{ type: 'attributes', target: added }]);
  assert.ok(added.classes.has('ocs__hidden'));
});

test('keyboard help opens one native dialog and Escape dismisses it without injecting CSS', () => {
  const elements = [];
  let keydown;
  const window = {};
  const document = {
    activeElement: null,
    createElement(tag) {
      const element = { tag, open: false, setAttribute() {}, showModal() { this.open = true; }, close() { this.open = false; } };
      elements.push(element); return element;
    },
    body: { appendChild() {} },
    addEventListener(type, callback) { if (type === 'keydown') keydown = callback; },
  };
  vm.runInNewContext(read('assets/js/keyboard-shortcuts.js'), { document, window });
  window.showKeyboardHelp(); window.showKeyboardHelp();
  assert.equal(elements.length, 1);
  assert.equal(elements[0].tag, 'dialog');
  assert.equal(elements[0].open, true);
  keydown({ key: 'Escape', preventDefault() {} });
  assert.equal(elements[0].open, false);
});
