import { trackingFrame, clearCursor, showThemeContrast, setupPortfolioControls } from './portfolio-accessibility.js';
import { pythonURI, fetchOptions, baseurl } from '../api/config.js';

const { PRESETS, LANGUAGES, applyPreferences } = window.SitePreferences;
const endpoint = pythonURI + '/api/user/preferences';
const form = document.querySelector('#displayPreferences');
const status = document.querySelector('#displayStatus');
const nod = document.querySelector('#nod-scroll');
let frame;
let engaged = false;

function stop() {
    clearCursor();
    cancelAnimationFrame(frame);
    window.FaceTracker?.stop();
    engaged = false;
    nod.setAttribute('aria-pressed', 'false');
    nod.textContent = 'Start head tracking';
    updatePreview(false);
}

function scrollFrame() {
    const tracker = window.FaceTracker;
    const pointer = trackingFrame(tracker.faceData);
    const direction = !pointer && tracker.faceData.detected && (tracker.controls.down ? 1 : tracker.controls.up ? -1 : 0);
    if (direction && !engaged) window.scrollBy(0, Math.round(innerHeight * 0.6) * direction);
    engaged = Boolean(direction);
    frame = requestAnimationFrame(scrollFrame);
}

function script(src) {
    return new Promise((resolve, reject) => {
        const tag = document.createElement('script');
        tag.onload = resolve;
        tag.onerror = reject;
        tag.src = src;
        document.head.append(tag);
    });
}

const preview = document.getElementById('head-preview');
function updatePreview(active) {
    if (!preview) return;
    preview.textContent = active ? 'Stop camera' : 'Start camera';
    preview.setAttribute('aria-pressed', String(active));
}
setupPortfolioControls();
preview?.addEventListener('click', () => nod.click());
nod?.addEventListener('click', async () => {
    if (window.FaceTracker?.active) return stop();
    nod.disabled = true;
    if (preview) preview.disabled = true;
    try {
        if (!window.Camera) await script('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js');
        if (!window.FaceMesh) await script('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js');
        if (!window.FaceTracker) await script(baseurl + '/assets/js/face-tracker.js');
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        await window.FaceTracker.start(video);
        if (!window.FaceTracker.active) throw new Error();
        nod.textContent = 'Stop head tracking';
        updatePreview(true);
        nod.setAttribute('aria-pressed', 'true');
        scrollFrame();
    } catch {
        stop();
        nod.textContent = 'Camera unavailable · Retry head tracking';
        const status = document.getElementById('head-status');
        if (status) status.textContent = 'Camera unavailable. Check camera permission and try again.';
    } finally { nod.disabled = false; if (preview) preview.disabled = false; }
});
window.addEventListener('pagehide', () => { if (nod && window.FaceTracker?.active) stop(); });

function show(data) {
    if (!Object.hasOwn(PRESETS, data.theme) || !Object.hasOwn(LANGUAGES, data.language)) throw new Error();
    applyPreferences({ ...PRESETS[data.theme], language: data.language });
    if (nod) {
        if (!data.nod && window.FaceTracker?.active) stop();
        nod.hidden = !data.nod;
    }
    if (form) {
        form.elements.theme.value = data.theme;
        showThemeContrast(PRESETS[data.theme]);
        form.elements.language.value = data.language;
        form.elements.nod.checked = data.nod;
    }
}

if (form) {
    for (const name of Object.keys(PRESETS)) form.elements.theme.add(new Option(name, name));
    for (const [code, language] of Object.entries(LANGUAGES)) form.elements.language.add(new Option(code ? language.name : 'English', code));
    form.elements.theme.onchange = () => showThemeContrast(PRESETS[form.elements.theme.value]);
    showThemeContrast(PRESETS[form.elements.theme.value]);
    form.onsubmit = async e => {
        e.preventDefault();
        const button = form.querySelector('button');
        button.disabled = true;
        try {
            const response = await fetch(endpoint, { ...fetchOptions, method: 'PUT', body: JSON.stringify({
                theme: form.elements.theme.value, language: form.elements.language.value, nod: form.elements.nod.checked,
            }) });
            if (!response.ok) throw new Error();
            show(await response.json());
            status.textContent = 'Preferences saved to your account.';
        } catch { status.textContent = 'Could not save your preferences. Try again.'; }
        finally { button.disabled = false; }
    };
}
try {
    const response = await fetch(endpoint, { ...fetchOptions, cache: 'no-store' });
    if (response.ok) {
        show(await response.json());
        if (form) form.querySelector('button').disabled = false;
    } else if (response.status !== 401) throw new Error();
} catch { if (status) status.textContent = 'Could not load your saved preferences. Reload to retry.'; }
