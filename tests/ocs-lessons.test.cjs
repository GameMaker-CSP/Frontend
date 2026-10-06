const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

test('module states retain their hooks, unlock on recheck, and block locked links under a baseurl', () => {
  const stored = new Map();
  const element = className => ({ className, textContent: '', style: {}, attributes: {}, listeners: {},
    setAttribute(key, value) { this.attributes[key] = value; }, getAttribute(key) { return this.attributes[key]; },
    addEventListener(key, handler) { this.listeners[key] = handler; } });
  const cards = Array.from({ length: 6 }, () => {
    const parts = [element('ocs__status-pill module-badge'), element('ocs__progress-bar module-progress-bar'), element('ocs__btn lesson-link')];
    return { parts, querySelector: selector => parts.find(part => part.className.split(' ').includes(selector.slice(1))) };
  });
  const overall = element(''); const text = element(''); let init;
  const document = {
    addEventListener: (event, callback) => { init = callback; },
    querySelector: selector => selector === '[data-module]' ? cards[0] : cards[Number(selector.match(/c(\d)/)?.[1]) - 1],
    querySelectorAll: () => cards.map(card => card.parts[2]),
    getElementById: id => id === 'overall-progress' ? overall : text,
  };
  const source = fs.readFileSync(path.join(__dirname, '../_includes/tailwind/plagiarism_info.html'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(source, { document, window: { location: { pathname: '/project/plagiarism/' } }, localStorage: { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) } });
  init();
  assert.equal(cards[0].parts[0].textContent, 'Completed');
  assert.equal(cards[1].parts[0].textContent, 'Available');
  const link = cards[2].parts[2];
  assert.equal(link.getAttribute('aria-disabled'), 'true');
  let prevented = false;
  link.listeners.click({ preventDefault() { prevented = true; } });
  assert.ok(prevented);
  stored.set('plagiarism-c2-assessment', '{}');
  init();
  assert.equal(cards[2].parts[0].textContent, 'Available', 'The module-badge selector must survive updates');
  assert.equal(link.getAttribute('aria-disabled'), 'false');
  assert.equal(link.tabIndex, 0);
  assert.equal(text.textContent, '2/6 modules completed');
  assert.equal(overall.style.width, (2 / 6) * 100 + '%');
});
