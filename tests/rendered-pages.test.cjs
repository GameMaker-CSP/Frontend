const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

test('the local editor ships guided controls with usable button sizing', () => {
  const html = fs.readFileSync(path.join(root, '_site/game-maker/index.html'), 'utf8');
  const styles = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/gi)]
    .map(([, href]) => path.join(root, '_site', href))
    .filter(file => fs.existsSync(file))
    .map(file => fs.readFileSync(file, 'utf8')).join('\n');
  assert.match(styles, /\.gm-guided__primary[^{}]*\{[^}]*min-height:\s*44px/);
  assert.match(styles, /\.gm-guided__progress\s*\{[^}]*display:\s*grid/);
});

test('the editor has one canonical output route', () => {
  const pages = fs.readdirSync(path.join(root, 'pages')).filter(name => /\.(html|md)$/.test(name));
  const owners = pages.filter(name => /^permalink: \/game-maker\/\s*$/m.test(fs.readFileSync(path.join(root, 'pages', name), 'utf8')));
  assert.deepEqual(owners, ['game-maker.html']);
});

test('rendered login scripts coexist without duplicate globals', () => {
  const html = fs.readFileSync(path.join(root, '_site/login.html'), 'utf8');
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, attrs]) => !/\bsrc=|type=["'](?:module|application\/ld\+json)/i.test(attrs))
    .map(([, , code]) => code);
  assert.doesNotThrow(() => new vm.Script(scripts.join('\n;\n')));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const formIds = ids.filter(id => /^(login-page-)?slm-/.test(id));
  assert.equal(new Set(formIds).size, formIds.length, 'Login and social forms must not share IDs');
  assert.ok(ids.includes('login-page-slm-uid'));
});

test('shared and page styles ship once with real local assets across the primary routes', () => {
  for (const route of ['index.html', 'login.html', 'game-maker/index.html', 'game-maker-prototype/index.html', 'ocs-components/index.html', 'ocs-components/lessons/index.html', 'python/flask.html']) {
    const html = fs.readFileSync(path.join(root, '_site', route), 'utf8');
    const assets = [...html.matchAll(/<link\b[^>]*href="([^"?]+\.css)"[^>]*>/gi)].map(match => match[1]).filter(href => href.startsWith('/'));
    assert.equal(assets.filter(href => href === '/assets/css/ocs.css').length, 1, `${route}: OCS must load once`);
    assert.equal(new Set(assets).size, assets.length, `${route}: no duplicate stylesheet links`);
    for (const asset of assets) assert.ok(fs.existsSync(path.join(root, '_site', asset)), `${route}: missing ${asset}`);
  }
});

test('lesson components render course content and usable navigation without a Tailwind runtime', () => {
  const flask = fs.readFileSync(path.join(root, '_site/python/flask.html'), 'utf8');
  for (const title of ['Crash Course', 'Anatomy', 'API creation', 'Jinja UI']) assert.ok(flask.includes(title));
  const examples = fs.readFileSync(path.join(root, '_site/ocs-components/lessons/index.html'), 'utf8');
  assert.equal([...examples.matchAll(/data-module="c[1-6]"/g)].length, 6);
  assert.ok(examples.includes('Planning a shared interface'));
  assert.ok(!examples.includes('cdn.tailwindcss.com'));
  assert.ok(examples.includes('ocs__module'));
});
