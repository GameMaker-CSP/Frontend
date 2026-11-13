(() => {
  const $ = id => document.getElementById(id);
  const menu = $('toolkit-menu');
  const coach = $('uesl-chat-window');
  const input = $('uesl-chat-input');
  const send = $('uesl-chat-send');
  const messages = $('uesl-chat-messages');
  const ruler = $('reading-ruler');
  const backend = document.body.dataset.apiSameOrigin === 'true' ? location.origin
    : (['localhost', '127.0.0.1'].includes(location.hostname) ? `http://${location.hostname}:8424` : 'https://uesl.opencodingsociety.com');
  const history = [];
  let settings = {};
  try { settings = JSON.parse(localStorage.getItem('uesl_toolkit') || '{}'); } catch (_) {}
  function save() { try { localStorage.setItem('uesl_toolkit', JSON.stringify(settings)); } catch (_) {} }
  function pressed(button, active) {
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('accent', active);
  }
  let dyslexiaFont;
  function loadDyslexiaFont() {
    if (dyslexiaFont) return;
    dyslexiaFont = new FontFace('OpenDyslexic', "url('https://cdn.jsdelivr.net/npm/opendyslexic/WOFF/OpenDyslexic-Regular.woff')");
    dyslexiaFont.load().then(font => document.fonts.add(font)).catch(() => {
      // The existing accessibility rule retains its readable local fallback.
      dyslexiaFont = null;
    });
  }
  const toggles = [
    ['toolkit-dyslexia', 'dyslexia', 'tk-dyslexia'],
    ['toolkit-high-contrast', 'highContrast', 'tk-high-contrast'],
    ['toolkit-focus', 'focus', 'tk-focus'],
  ];
  function applyToggles() {
    toggles.forEach(([id, key, className]) => {
      document.documentElement.classList.toggle(className, Boolean(settings[key]));
      pressed($(id), Boolean(settings[key]));
    });
    if (settings.dyslexia) loadDyslexiaFont();
  }
  toggles.forEach(([id, key]) => $(id).addEventListener('click', () => {
    settings[key] = !settings[key]; applyToggles(); save();
  }));
  applyToggles();

  $('toolkit-ruler').addEventListener('click', () => {
    ruler.hidden = !ruler.hidden;
    pressed($('toolkit-ruler'), !ruler.hidden);
  });
  document.addEventListener('pointermove', event => {
    if (!ruler.hidden) ruler.style.top = `${event.clientY - 15}px`;
  });
  function changeSize(delta) {
    const html = document.documentElement;
    const current = parseFloat(getComputedStyle(html).fontSize) || 16;
    html.style.fontSize = `${Math.min(28, Math.max(10, current + delta))}px`;
  }
  $('toolkit-font-up').addEventListener('click', () => changeSize(2));
  $('toolkit-font-down').addEventListener('click', () => changeSize(-2));
  const readingButton = $('toolkit-tts');
  let readingPoll;
  function stopReading() {
    window.SitePreferences?.stopSpeaking();
    clearInterval(readingPoll);
    readingButton.querySelector('.tk-label').textContent = 'Read selection';
    pressed(readingButton, false);
  }
  readingButton.addEventListener('click', () => {
    const preferences = window.SitePreferences;
    if (!preferences) return;
    if (preferences.isSpeaking()) { stopReading(); return; }
    const label = readingButton.querySelector('.tk-label');
    if (preferences.speakSelection()) {
      label.textContent = 'Stop reading';
      pressed(readingButton, true);
      readingPoll = setInterval(() => { if (!preferences.isSpeaking()) stopReading(); }, 300);
    } else {
      label.textContent = 'Highlight text first';
      setTimeout(() => { label.textContent = 'Read selection'; }, 2200);
    }
  });
  $('toolkit-shortcuts').addEventListener('click', () => { menu.open = false; window.showKeyboardHelp?.(); });
  $('toolkit-revert').addEventListener('click', () => {
    settings = {}; save(); applyToggles(); stopReading();
    ruler.hidden = true; pressed($('toolkit-ruler'), false);
    document.documentElement.style.removeProperty('font-size');
    window.SitePreferences?.resetPreferences();
    document.documentElement.classList.add('user-theme-active');
  });

  function openCoach() { menu.open = false; if (!coach.open) coach.showModal(); input.focus(); }
  $('toolkit-chatbot').addEventListener('click', openCoach);
  $('uesl-chat-close').addEventListener('click', () => coach.close());
  $('toolkit-summarize').addEventListener('click', () => {
    const text = $('main').innerText.replace(/\s+/g, ' ').trim().slice(0, 1800);
    input.value = `Summarize this page in simple terms:\n\n${text}`;
    openCoach(); send.click();
  });
  function addMessage(text, who) {
    const message = document.createElement('p');
    message.className = 'ocs__description';
    message.textContent = `${who}: ${text}`;
    messages.appendChild(message);
    return message;
  }
  async function sendQuestion() {
    const text = input.value.trim();
    if (!text || send.disabled) return;
    input.value = ''; send.disabled = true;
    addMessage(text, 'You'); history.push({ role: 'user', content: text });
    const pending = addMessage('Thinking…', 'Coach');
    try {
      const response = await fetch(`${backend}/api/uesl-chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }),
      });
      const data = await response.json();
      const reply = data.reply || data.error || 'Sorry, something went wrong. Please try again.';
      pending.remove(); addMessage(reply, 'Coach');
      history.push({ role: 'assistant', content: reply });
    } catch (_) {
      pending.remove(); addMessage('Could not connect. Please try again when the service is available.', 'Coach');
    } finally { send.disabled = false; input.focus(); }
  }
  send.addEventListener('click', sendQuestion);
  input.addEventListener('keydown', event => { if (event.key === 'Enter') sendQuestion(); });

  const friends = $('tk-friends-panel');
  const friendList = $('tk-friends-list');
  const api = (path, options = {}) => fetch(backend + path, {
    credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' }, ...options,
  });
  function heartbeat() { api('/api/heartbeat', { method: 'POST' }).catch(() => {}); }
  heartbeat();
  const heartbeatTimer = setInterval(heartbeat, 120000);
  window.addEventListener('pagehide', () => { clearInterval(heartbeatTimer); stopReading(); });
  $('toolkit-friends').addEventListener('click', async () => {
    menu.open = false; friendList.textContent = 'Loading…'; friends.showModal();
    try {
      const response = await api('/api/active-users');
      if (!response.ok) throw new Error('Unavailable');
      const users = await response.json();
      friendList.textContent = users.length ? '' : 'No one else active right now.';
      users.forEach(user => { const row = document.createElement('p'); row.textContent = user.uid; friendList.appendChild(row); });
    } catch (_) { friendList.textContent = 'Could not load active friends. Check that you are logged in and try again.'; }
  });
})();
