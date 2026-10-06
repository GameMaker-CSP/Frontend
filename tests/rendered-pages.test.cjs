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
