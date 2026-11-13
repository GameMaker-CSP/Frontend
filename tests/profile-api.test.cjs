const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/api/profile.js'), 'utf8')
  .replace(/^import .*;$/m, '').replace(/\bexport /g, '');
function load(fetch) {
  const context = {fetch, fetchOptions: {credentials: 'include', headers: {'Content-Type': 'application/json'}}};
  vm.createContext(context);
  vm.runInContext(source + '\nthis.api = {putUpdate, postUpdate};', context);
  return context.api;
}
test('profile save waits for the backend before invoking success', async () => {
  let resolve, called = false, request;
  const api = load((url, options) => {request = {url, options}; return new Promise(r => {resolve = r;});});
  let complete = false;
  const pending = api.putUpdate({URL:'/api/user', body:{name:'Demo'}, callback:()=>{called=true;}}).then(()=>{complete=true;});
  await Promise.resolve();
  assert.equal(called, false); assert.equal(complete, false);
  resolve({ok:true, status:200}); await pending;
  assert.equal(called, true); assert.equal(complete, true);
  assert.equal(request.url, '/api/user'); assert.equal(request.options.method, 'PUT');
  assert.equal(request.options.credentials, 'include');
  assert.deepEqual(JSON.parse(request.options.body), {name:'Demo'});
});
test('profile saves do not require a success callback', async () => {
  const result = await load(async()=>({ok:true,status:200})).putUpdate({URL:'/api/user',body:{name:'Demo'}});
  assert.equal(result.status,200);
});
test('failed profile saves reject without a success callback', async () => {
  let called=false;
  const api=load(async()=>({ok:false,status:401}));
  await assert.rejects(api.putUpdate({URL:'/api/user',body:{name:'Demo'},callback:()=>{called=true;}}), /401/);
  assert.equal(called,false);
});
test('network failure remains a failed save for the UI', async () => {
  const api=load(async()=>{throw new Error('offline');});
  await assert.rejects(api.postUpdate({URL:'/api/user',body:{}}), /offline/);
});
