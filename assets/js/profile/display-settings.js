import { appearance, appearanceEditor } from './appearance.js';
import { trackingFrame, clearCursor, restoreTrackingOptions, restoreSpeechOptions, showThemeContrast, setupPortfolioControls } from './portfolio-accessibility.js';
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
let cacheKey;
let editor;
const saveButton = form?.querySelector('[type="submit"]');
function readLocal(key) {
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
}
async function generatePalette(idea) {
    const response = await fetch(pythonURI + '/api/gemini', {...fetchOptions, method: 'POST',
        body: JSON.stringify({text: idea, prompt: 'Design an accessible color palette for this description. Return only a JSON object with four hex color strings: bg, text, accent, selectionColor. Text and accent should contrast with bg by at least 4.5 to 1.'})});
    if (!response.ok) throw Error();
    const {text} = await response.json();
    return JSON.parse(text.trim().replace(/^```(?:json)?\s*|\s*```$/gi, ''));
}
if (form) editor = appearanceEditor(form, options => {
    applyPreferences(appearance(PRESETS[form.elements.theme.value] || PRESETS['Site Default'], options), {preview:true});
    showThemeContrast(options);
}, generatePalette);
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
    const options = data.options ?? (cacheKey ? readLocal(cacheKey) : {});
    const preset = PRESETS[data.theme];
    if (form) {
        form.elements.theme.value = data.theme;
        editor.fill(preset, options);
    }
    applyPreferences({...appearance(preset, options), language: data.language});
    if (Object.keys(options).length) {
        document.dispatchEvent(new CustomEvent('uesl:reading-preferences', {detail: options}));
        if (options.mode) restoreTrackingOptions(options);
        if (options.ttsRate !== undefined) restoreSpeechOptions(options);
    }
    if (nod) {
        if (!data.nod && window.FaceTracker?.active) stop();
        nod.hidden = !data.nod;
    }
    if (form) {
        form.elements.theme.value = data.theme;

        form.elements.language.value = data.language;
        form.elements.nod.checked = data.nod;
    }
}

if (form) {
    for (const name of Object.keys(PRESETS)) form.elements.theme.add(new Option(name, name));
    for (const [code, language] of Object.entries(LANGUAGES)) form.elements.language.add(new Option(code ? language.name : 'English', code));
    form.elements.theme.onchange = () => editor.fill(PRESETS[form.elements.theme.value]);
    showThemeContrast(PRESETS[form.elements.theme.value]);
    form.onsubmit = async e => {
        e.preventDefault();
        const button = saveButton;
        button.disabled = true;
        try {
            const {dyslexia=false, highContrast=false, focus=false, ruler=false, fontSize} = readLocal('uesl_toolkit');
            const {mode='scroll', sensitivity=.45} = readLocal('ueslHeadTracking');
            const {voice, rate, pitch, volume} = window.SitePreferences.getTTSSettings();
            const options = {...editor.read(), readingSize: parseFloat(fontSize) || 0, dyslexia, highContrast, focus, ruler, mode, sensitivity,
                ttsVoice:voice, ttsRate:rate, ttsPitch:pitch, ttsVolume:volume};
            const response = await fetch(endpoint, { ...fetchOptions, method: 'PUT', body: JSON.stringify({
                options, theme: form.elements.theme.value, language: form.elements.language.value, nod: form.elements.nod.checked,
            }) });
            if (!response.ok) throw new Error();
            const data = await response.json();
            if (cacheKey) {
                if (data.options) localStorage.removeItem(cacheKey);
                else localStorage.setItem(cacheKey, JSON.stringify(options));
            }
            show({...data, options});
            status.textContent = data.options ? 'Preferences saved to your account.' :
                'Theme, language and head tracking saved to your account. Custom settings are saved on this device until the server is updated.';
        } catch { status.textContent = 'Could not save your preferences. Try again.'; }
        finally { button.disabled = false; }
    };
}
try {
    const response = await fetch(endpoint + '?extended=1', { ...fetchOptions, cache: 'no-store' });
    if (response.ok) {
        const data = await response.json();
        if (!data.options && form) form.elements.theme.querySelector('option[value="Sunset"]')?.remove();
        if (!data.options || !Object.keys(data.options).length) {
            const identity = await fetch(pythonURI + '/api/id', {...fetchOptions, cache:'no-store'});
            if (!identity.ok) throw Error();
            cacheKey = 'ueslAppearance:' + (await identity.json()).uid;
            if (data.options && localStorage.getItem(cacheKey)) data.options = readLocal(cacheKey);
        }
        show(data);
        if (form) saveButton.disabled = false;
    } else if (response.status !== 401) throw new Error();
} catch { if (status) status.textContent = 'Could not load your saved preferences. Reload to retry.'; }
