import { pythonURI, fetchOptions, baseurl } from '../api/config.js';
import { putUpdate } from '../api/profile.js';
import { initAccountForm } from './profile-account.js';
import { initPersonas } from './profile-personas.js';
import { personaSections, personaTitle } from './profile-model.js';

const status = document.getElementById('accountStatus');
const form = document.getElementById('profileSettingsForm');
if (form) [...form.elements].forEach(input => { input.disabled = true; });
const api = { pythonURI, fetchOptions, putUpdate, springEnabled: false, personaURL: `${pythonURI}/api/persona?collection=gamemaker` };
try {
  const response = await fetch(`${pythonURI}/api/id`, fetchOptions);
  if (response.status === 401) {
    status.append('Sign in to load and save your account. ');
    const link = document.createElement('a');
    link.className = 'ocs__btn'; link.href = `${baseurl}/login`; link.textContent = 'Login';
    status.append(link);
  } else {
    if (!response.ok) throw new Error(`Account request failed (${response.status})`);
    const user = await response.json();
    status.textContent = `Signed in as ${user.name || user.uid}.`;
    if (form) {
      [...form.elements].forEach(input => { input.disabled = false; });
      await initAccountForm({ api, form, saveButton: document.getElementById('saveChangesBtn'), status: document.getElementById('saveStatus') });
      const [all, mine] = await Promise.all([
        fetch(api.personaURL, fetchOptions), fetch(`${pythonURI}/api/user/personas`, fetchOptions),
      ]);
      if (!all.ok || !mine.ok) throw new Error('Could not load saved survey choices');
      const sections = personaSections(await all.json(), (await mine.json()).personas);
      const chosen = sections.filter(section => section.chosen);
      document.getElementById('surveySummary').textContent = `${chosen.length} of ${sections.length} chosen. ` + chosen.map(section => `${section.label}: ${personaTitle(section.chosen)}`).join(' · ');
    } else {
      document.getElementById('surveyContent').hidden = false;
      await initPersonas({ api, container: document.getElementById('personaSelectionContainer'), progress: document.getElementById('personaProgress'), editButton: document.getElementById('personaEditBtn') });
    }
  }
} catch (error) {
  status.textContent = `${error.message}. Check the backend and reload to try again.`;
  status.setAttribute('role', 'alert');
}
document.getElementById('accountLogout')?.addEventListener('click', async () => {
  try {
    const response = await fetch(`${pythonURI}/api/authenticate`, { ...fetchOptions, method: 'DELETE' });
    if (!response.ok) throw new Error('Log out failed');
    location.href = `${baseurl}/login`;
  } catch (error) { status.textContent = error.message; }
});
