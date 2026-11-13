import { personaSections } from './profile-model.js';

// Read the authenticated account every time; never reuse another user's choices.
export async function signedInDestination({ pythonURI, fetchOptions, baseurl = '' }, request = fetch) {
    const responses = await Promise.all([
        request(`${pythonURI}/api/persona?collection=gamemaker`, { ...fetchOptions, cache: 'no-store' }),
        request(`${pythonURI}/api/user/personas`, { ...fetchOptions, cache: 'no-store' }),
    ]);
    if (responses[1].status === 401) return `${baseurl}/login`;
    if (responses.some(response => !response.ok)) {
        throw new Error('Your preferences could not be loaded. Open profile settings to try again.');
    }
    const [catalogue, saved] = await Promise.all(responses.map(response => response.json()));
    const complete = personaSections(catalogue, saved.personas).every(section => section.chosen);
    return `${baseurl}/${complete ? 'profile' : 'survey'}`;
}
