const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../assets/js/api/config.js'), 'utf8')
  .replace(/^---\s*\n---\s*\n/, '').replace(/\bexport /g, '');

function load(hostname, ok = true) {
  const message = { textContent: '' };
  const context = {
    location: { hostname },
    sessionStorage: { getItem: () => null },
    document: { getElementById: () => message },
    console: { log() {} },
    fetch: async () => ({ ok, status: ok ? 200 : 401 }),
  };
  vm.createContext(context);
  vm.runInContext(source + '\nthis.api = { pythonURI, login };', context);
  return { ...context.api, message };
}

test('loopback API preserves the browser hostname for cookie authentication', () => {
  assert.equal(load('localhost').pythonURI, 'http://localhost:8424');
  assert.equal(load('127.0.0.1').pythonURI, 'http://127.0.0.1:8424');
});

test('hosted deployments retain the inherited API endpoint', () => {
  assert.equal(load('ueslhub.opencodingsociety.com').pythonURI, 'https://uesl.opencodingsociety.com');
});

test('failed authentication never invokes the success callback', async () => {
  const api = load('localhost', false);
  let success = false;
  await api.login({ URL: '/api/authenticate', method: 'POST', body: {}, message: 'error', callback: () => { success = true; } });
  assert.equal(success, false);
  assert.match(api.message.textContent, /401/);
});

test('successful authentication invokes its callback', async () => {
  const api = load('localhost');
  let success = false;
  await api.login({ URL: '/api/authenticate', method: 'POST', body: {}, message: 'error', callback: () => { success = true; } });
  assert.equal(success, true);
});
