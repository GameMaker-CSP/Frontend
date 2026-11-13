import assert from 'node:assert/strict';
import test from 'node:test';
import { signedInDestination } from '../assets/js/profile/account-session.js';

const catalogue = ['student', 'social', 'achievement', 'fantasy'].map((category, index) => ({ id: index + 1, category }));
const choices = Object.fromEntries(catalogue.map(p => [p.category, { persona_id: p.id }]));
const config = { pythonURI: 'https://api.example', baseurl: '/uesl', fetchOptions: { credentials: 'include' } };
const response = (data, status = 200) => ({ ok: status === 200, status, json: async () => data });
function server(personas, status = 200) {
    return async (url, options) => {
        assert.equal(options.credentials, 'include');
        assert.equal(options.cache, 'no-store');
        return url.includes('/api/persona?') ? response(catalogue) : response({ personas }, status);
    };
}

test('new or partly completed accounts are prompted only through the signed-in flow', async () => {
    assert.equal(await signedInDestination(config, server({})), '/uesl/survey');
    assert.equal(await signedInDestination(config, server({ student: choices.student })), '/uesl/survey');
});
test('returning accounts go to profile and do not inherit the previous account choices', async () => {
    assert.equal(await signedInDestination(config, server(choices)), '/uesl/profile');
    assert.equal(await signedInDestination(config, server({})), '/uesl/survey');
    assert.equal(await signedInDestination(config, server(choices)), '/uesl/profile');
});
test('old unrelated persona answers do not count as completed UESL preferences', async () => {
    assert.equal(await signedInDestination(config, server({ ...choices, student: { persona_id: 999 } })), '/uesl/survey');
});
test('expired sessions return to login instead of displaying survey prompts', async () => {
    assert.equal(await signedInDestination(config, server({}, 401)), '/uesl/login');
});
test('loading failures are not treated as empty preferences', async () => {
    await assert.rejects(signedInDestination(config, server({}, 500)), /preferences could not be loaded/);
    await assert.rejects(signedInDestination(config, async () => { throw new Error('offline'); }), /offline/);
});
