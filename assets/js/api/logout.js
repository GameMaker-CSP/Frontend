import { pythonURI, fetchOptions } from './config.js';

export async function handleLogout() {
    try {
        await fetch(pythonURI + '/api/authenticate', {
            ...fetchOptions,
            method: 'DELETE'
        });
    } catch (e) {
        console.error('logout failed:', e);
    }
}
