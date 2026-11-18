// Adapted from Open-Coding-Society/portfolio dashboard preferences and GlobalNodCursor.
const read = key => {
    try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { return {}; }
};
const head = { mode: 'scroll', sensitivity: 0.45, ...read('ueslHeadTracking') };
let calibration = read('ueslHeadCalibration');
let cursor, last;
export function clearCursor() {
    if (cursor) cursor.hidden = true;
    last = null;
}
function axis(value, low, center, high) {
    if (!(low < center && center < high)) return value;
    return Math.min(1, Math.max(0, value < center
        ? 0.5 * (value - low) / (center - low)
        : 0.5 + 0.5 * (value - center) / (high - center)));
}
export function trackingFrame(face) {
    if (head.mode !== 'cursor' || !face.detected) {
        clearCursor();
        return head.mode === 'cursor';
    }
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.setAttribute('aria-hidden', 'true');
        Object.assign(cursor.style, { position:'fixed', width:'18px', height:'18px', top:'0', left:'0',
            border:'2px solid var(--pref-accent-color)', borderRadius:'50%', pointerEvents:'none', zIndex:'99999' });
        document.body.append(cursor);
    }
    const x = axis(face.x, calibration.left?.x, calibration.center?.x, calibration.right?.x) * (innerWidth - 1);
    const y = axis(face.y, calibration.up?.y, calibration.center?.y, calibration.down?.y) * (innerHeight - 1);
    last = last ? {x:last.x + (x-last.x)*head.sensitivity, y:last.y + (y-last.y)*head.sensitivity} : {x,y};
    cursor.hidden = false;
    cursor.style.transform = `translate(${Math.round(last.x)-9}px,${Math.round(last.y)-9}px)`;
    document.elementFromPoint(last.x,last.y)?.dispatchEvent(new MouseEvent('mousemove',
        { bubbles:true, clientX:last.x, clientY:last.y }));
    return true;
}
function luminance(hex) {
    const rgb = hex.match(/[a-f\d]{2}/gi).map((part) => {
        const channel = parseInt(part, 16) / 255;
        return channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrastRatio(first, second) {
    const a = luminance(first);
    const b = luminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function updateCheck(element, ratio) {
    if (!element) return;

    const passed = ratio >= 4.5;
    element.textContent = `${ratio.toFixed(2)}:1 — ${passed ? 'Good contrast' : 'Needs improvement'}`;
    element.dataset.status = passed ? 'pass' : 'warning';
    element.setAttribute('aria-label',
        `Contrast ratio ${ratio.toFixed(2)} to 1. ${passed ? 'Passes' : 'Below'} the recommended 4.5 to 1 text contrast.`);
}

export function showThemeContrast(preset) {
    updateCheck(document.getElementById('text-contrast'), contrastRatio(preset.bg, preset.text));
    updateCheck(document.getElementById('accent-contrast'), contrastRatio(preset.bg, preset.accent));
}

export function setupPortfolioControls() {
    const mode = document.getElementById('head-mode');
    if (!mode) return;
    mode.value = head.mode;
    mode.onchange = () => { head.mode = mode.value; clearCursor(); localStorage.setItem('ueslHeadTracking', JSON.stringify(head)); };
    const sensitivity = document.getElementById('head-sensitivity');
    sensitivity.value = head.sensitivity;
    sensitivity.nextElementSibling.value = sensitivity.value;
    sensitivity.oninput = () => {
        sensitivity.nextElementSibling.value = sensitivity.value;
        head.sensitivity = Number(sensitivity.value);
        localStorage.setItem('ueslHeadTracking', JSON.stringify(head));
    };
    const status = document.getElementById('head-status');
    document.getElementById('head-calibration').onclick = event => {
        const direction = event.target.dataset.direction;
        if (event.target.id === 'head-reset') {
            calibration = {};
            status.textContent = 'Calibration reset.';
        } else if (direction) {
            const face = window.FaceTracker?.faceData;
            if (!face?.detected || !window.FaceTracker.active) { status.textContent = 'Start the camera and look toward it first.'; return; }
            calibration[direction] = {x:face.x,y:face.y};
            status.textContent = `Captured ${direction}. ${Object.keys(calibration).length} of 5 positions saved.`;
        } else return;
        localStorage.setItem('ueslHeadCalibration', JSON.stringify(calibration));
    };

    const synth = window.speechSynthesis;
    if (!synth) {
        document.getElementById('voice-settings').hidden = true;
        document.getElementById('voice-note').textContent = 'Read aloud is unavailable in this browser.';
        return;
    }
    const settings = window.SitePreferences.getTTSSettings();
    const voice = document.getElementById('pref-tts-voice');
    function voices() {
        voice.replaceChildren(new Option('Device default',''));
        for (const v of synth.getVoices()) voice.add(new Option(v.name + ' (' + v.lang + ')', v.name));
        voice.value = settings.voice;
        if (voice.selectedIndex < 0) voice.selectedIndex = 0;
    }
    voices();
    synth.addEventListener('voiceschanged',voices);
    const persist = () => localStorage.setItem('ueslSpeech', JSON.stringify({
        ttsVoice:settings.voice, ttsRate:settings.rate, ttsPitch:settings.pitch, ttsVolume:settings.volume
    }));
    voice.onchange = () => { settings.voice = voice.value; persist(); };
    for (const key of ['rate','pitch','volume']) {
        const input = document.getElementById('pref-tts-' + key);
        input.value = settings[key]; input.nextElementSibling.value = input.value;
        input.oninput = () => { settings[key] = Number(input.value); input.nextElementSibling.value = input.value; persist(); };
    }
    document.getElementById('tts-test-btn').onclick = () => window.SitePreferences.speak(document.getElementById('tts-test-text').value, settings);
    document.getElementById('tts-stop-btn').onclick = () => window.SitePreferences.stopSpeaking();
}
