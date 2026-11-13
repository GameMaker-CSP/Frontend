const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const test = require('node:test');
const root = path.join(__dirname, '..');
test('account pages share OCS navigation and contain no page-specific CSS', () => {
  for (const route of ['login', 'survey', 'profile']) {
    const html = fs.readFileSync(path.join(root, '_site', route + '.html'), 'utf8');
    assert.match(html, /aria-label="Account menu"/);
    for (const target of ['login', 'survey', 'profile']) assert.ok(html.includes(`href="/${target}"`));
    assert.match(html, new RegExp(`href="/${route}" aria-current="page"`));
    assert.equal((html.match(/id="ocs-system-styles"/g) || []).length, 1);
    assert.doesNotMatch(html, /<style\b|\sstyle="|tailwindcss|profile-card|uesl-input/);
  }
});
test('survey and profile use the OCS modules and shared backend configuration', () => {
  const entry = fs.readFileSync(path.join(root, 'assets/js/profile/account-page.js'), 'utf8');
  assert.match(entry, /import \{ initPersonas \} from '.\/profile-personas.js'/);
  assert.match(entry, /import \{ initAccountForm \} from '.\/profile-account.js'/);
  assert.match(entry, /response.status === 401/);
  const login = fs.readFileSync(path.join(root, 'navigation/authentication/login.md'), 'utf8');
  assert.match(login, /import \{ pythonURI, baseurl \}/);
  assert.doesNotMatch(login, /https:\/\/uesl.opencodingsociety.com/);
});
test('UESL profile asks for account details without school enrollment fields', () => {
  const html = fs.readFileSync(path.join(root, '_site/profile.html'), 'utf8');
  assert.match(html, /Display name/);
  assert.doesNotMatch(html, /schoolChangeInput|sidChangeInput|High school|Student ID|GitHub username/);
  const model = fs.readFileSync(path.join(root, 'assets/js/profile/profile-model.js'), 'utf8');
  assert.match(model, /label: 'Getting started'/);
  assert.match(model, /label: 'Favorite games'/);
});
