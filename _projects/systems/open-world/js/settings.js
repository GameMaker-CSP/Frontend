
window.addEventListener('keydown', function(e) {
    const keys = [32, 37, 38, 39, 40];
    if (!keys.includes(e.keyCode)) return;
    const tgt = e.target;
    const isForm = tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable);
    if (!isForm) {
        e.preventDefault();
    }
}, { passive: false });

document.querySelector('.game-frame')?.addEventListener('click', () => {
    const canvas = document.getElementById('game-canvas-builder');
    try { canvas?.focus?.(); } catch (_) {}
});

// ── Settings state ──────────────────────────────────────────────────────────
const gbSettings = {
  slowMode: false, highContrast: false, largeSprites: false,
  dpadRight: true,
  voice: false, face: false, coach: false, coachChaseSpeed: 2.5, coachPatrolSpeed: 1.2,
};

// TouchControls attaches its fixed-position wrapper to the document body.
// Keep its preferred side aligned with the preview, including after a resize.
function applyDpadPosition() {
  const container = document.getElementById('gameContainer')
    || document.getElementById('game-container-builder');
  const bounds = container?.getBoundingClientRect();
  const inset = 16;
  const left = bounds ? Math.max(inset, bounds.left + inset) : inset;
  const right = bounds ? Math.max(inset, window.innerWidth - bounds.right + inset) : inset;
  const bottom = bounds ? Math.max(inset, window.innerHeight - bounds.bottom + inset) : inset;
  document.querySelectorAll('.dpad-container').forEach(pad => {
    Object.assign(pad.parentElement.style, {
      left: gbSettings.dpadRight ? 'auto' : `${left}px`,
      right: gbSettings.dpadRight ? `${right}px` : 'auto',
      bottom: `${bottom}px`,
    });
  });
}

window.addEventListener('resize', () => requestAnimationFrame(applyDpadPosition));

document.getElementById('gb-slow-mode')?.addEventListener('change', e => { gbSettings.slowMode = e.target.checked; });
document.getElementById('gb-high-contrast')?.addEventListener('change', e => {
  gbSettings.highContrast = e.target.checked;
  document.body.style.filter = e.target.checked ? 'contrast(1.6) brightness(1.1)' : '';
});
document.getElementById('gb-large-sprites')?.addEventListener('change', e => { gbSettings.largeSprites = e.target.checked; });
document.getElementById('gb-dpad-right')?.addEventListener('change', e => { gbSettings.dpadRight = e.target.checked; applyDpadPosition(); });

document.getElementById('gb-voice')?.addEventListener('change', e => {
  gbSettings.voice = e.target.checked;
  if (e.target.checked) initVoice(); else stopVoice();
});
document.getElementById('gb-face')?.addEventListener('change', e => {
  gbSettings.face = e.target.checked;
  document.getElementById('gb-face-panel').style.display = e.target.checked ? 'block' : 'none';
  if (e.target.checked) initFaceTracking(); else stopFaceTracking();
});
document.getElementById('gb-coach')?.addEventListener('change', e => {
  gbSettings.coach = e.target.checked;
  document.getElementById('gb-coach-speed-panel').style.display = e.target.checked ? 'flex' : 'none';
});
document.getElementById('gb-coach-char')?.addEventListener('change', e => {
  gbSettings.coachChar = e.target.value;
});
document.getElementById('gb-coach-speed')?.addEventListener('input', e => {
  const v = parseFloat(e.target.value);
  gbSettings.coachChaseSpeed  = v;
  gbSettings.coachPatrolSpeed = Math.max(0.3, v * 0.48);
  document.getElementById('gb-coach-speed-val').textContent = v.toFixed(1);
});
document.getElementById('gb-coach-hearts')?.addEventListener('input', e => {
  gbSettings.coachMaxHearts = parseInt(e.target.value, 10);
  document.getElementById('gb-coach-hearts-val').textContent = e.target.value;
});
document.getElementById('gb-coach-range')?.addEventListener('input', e => {
  gbSettings.coachChaseRange = parseInt(e.target.value, 10);
  document.getElementById('gb-coach-range-val').textContent = e.target.value;
});
document.getElementById('gb-recalibrate')?.addEventListener('click', () => window.FaceTracker?.recalibrate?.());
document.getElementById('gb-info-btn')?.addEventListener('click', () => {
  const panel = document.getElementById('gb-info-panel');
  const arrow = document.getElementById('gb-info-arrow');
  const open = panel.style.display === 'none';
  panel.style.display = open ? 'block' : 'none';
  arrow.textContent = open ? '▾' : '▸';
});

// ── Face Tracking ────────────────────────────────────────────────────────────
let _faceInterval = null;
function initFaceTracking() {
  if (!window.FaceTracker) { console.warn('FaceTracker not loaded'); return; }
  const video = document.getElementById('gb-face-video');
  const preview = document.getElementById('gb-face-preview');
  FaceTracker.start(video, preview).catch(console.error);
  _faceInterval = setInterval(() => {
    if (!gbSettings.face || !window.FaceTracker?.active) return;
    const c = FaceTracker.controls;
    // Fire both Arrow keys AND WASD keys so face tracking works regardless of player key setting
    const fire = (key, keyCode, on) => {
      const type = on ? 'keydown' : 'keyup';
      document.dispatchEvent(new KeyboardEvent(type, { key, code: key, keyCode, which: keyCode, bubbles: true, cancelable: true }));
    };
    fire('ArrowLeft',  37, !!c.left);
    fire('ArrowRight', 39, !!c.right);
    fire('ArrowUp',    38, !!c.up);
    fire('ArrowDown',  40, !!c.down);
    fire('a',          65, !!c.left);
    fire('d',          68, !!c.right);
    fire('w',          87, !!c.up);
    fire('s',          83, !!c.down);
  }, 80);
}
function stopFaceTracking() {
  clearInterval(_faceInterval); _faceInterval = null;
  window.FaceTracker?.stop?.();
}

// ── Voice Commands ───────────────────────────────────────────────────────────
let _voiceRecog = null;
let _voiceActive = false;
const WORD_NUMS = { one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10 };

function parseVoiceCommand(text) {
  text = text.toLowerCase().trim();
  if (/\b(stop|halt|freeze|stay|wait)\b/.test(text)) return { dir: null, blocks: 0, stop: true };
  let dir = null;
  if (/\b(right|forward)\b/.test(text)) dir = 'ArrowRight';
  else if (/\b(left|back)\b/.test(text)) dir = 'ArrowLeft';
  else if (/\b(up|jump)\b/.test(text)) dir = 'ArrowUp';
  else if (/\b(down)\b/.test(text)) dir = 'ArrowDown';
  if (!dir) return null;
  let blocks = 1;
  const numMatch = text.match(/\b(\d+)\b/);
  if (numMatch) blocks = parseInt(numMatch[1]);
  else { for (const [w, n] of Object.entries(WORD_NUMS)) { if (text.includes(w)) { blocks = n; break; } } }
  return { dir, blocks: Math.min(blocks, 20) };
}

function showVoiceStatus(msg) {
  const el = document.getElementById('gb-voice-status');
  if (el) { el.style.display = 'block'; el.textContent = '🎤 ' + msg; }
}

function initVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showVoiceStatus('Not supported in this browser'); return; }
  _voiceRecog = new SR();
  _voiceRecog.continuous = true;
  _voiceRecog.interimResults = false;
  _voiceRecog.lang = 'en-US';
  _voiceRecog.onstart = () => { _voiceActive = true; showVoiceStatus('Listening…'); };
  _voiceRecog.onend = () => { if (gbSettings.voice) _voiceRecog.start(); };
  _voiceRecog.onerror = e => showVoiceStatus('Error: ' + e.error);
  _voiceRecog.onresult = e => {
    const transcript = e.results[e.results.length - 1][0].transcript;
    showVoiceStatus('"' + transcript + '"');
    const cmd = parseVoiceCommand(transcript);
    if (!cmd) return;
    // Map arrow key names to both arrow keyCodes and WASD keyCodes
    const KEY_MAP = {
      ArrowLeft:  [{ key: 'ArrowLeft', keyCode: 37 }, { key: 'a', keyCode: 65 }],
      ArrowRight: [{ key: 'ArrowRight', keyCode: 39 }, { key: 'd', keyCode: 68 }],
      ArrowUp:    [{ key: 'ArrowUp', keyCode: 38 }, { key: 'w', keyCode: 87 }],
      ArrowDown:  [{ key: 'ArrowDown', keyCode: 40 }, { key: 's', keyCode: 83 }],
    };
    const fireKey = (type, keyInfo) => {
      document.dispatchEvent(new KeyboardEvent(type, { key: keyInfo.key, keyCode: keyInfo.keyCode, which: keyInfo.keyCode, bubbles: true, cancelable: true }));
    };
    if (cmd.stop) {
      Object.values(KEY_MAP).flat().forEach(k => fireKey('keyup', k));
      return;
    }
    // hold key for ~blocks * 180ms, firing both Arrow and WASD keyCodes
    const keys = KEY_MAP[cmd.dir] || [];
    keys.forEach(k => fireKey('keydown', k));
    setTimeout(() => keys.forEach(k => fireKey('keyup', k)), cmd.blocks * 180);
  };
  _voiceRecog.start();
}
function stopVoice() {
  _voiceActive = false;
  _voiceRecog?.stop(); _voiceRecog = null;
  showVoiceStatus('off');
}

// ── Multiplayer editing lock ─────────────────────────────────────────────────
function _enableMpMode() {
  document.getElementById('gb-mp-edit-banner').style.display = 'flex';
  const editor = document.getElementById('code-editor');
  if (editor) { editor.readOnly = true; editor.style.opacity = '0.45'; editor.style.pointerEvents = 'none'; }
  ['btn-code-apply', 'btn-export', 'btn-run'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.disabled = true; el.style.opacity = '0.35'; el.style.pointerEvents = 'none'; }
  });
}
function _disableMpMode() {
  document.getElementById('gb-mp-edit-banner').style.display = 'none';
  const editor = document.getElementById('code-editor');
  if (editor) { editor.readOnly = false; editor.style.opacity = ''; editor.style.pointerEvents = ''; }
  ['btn-code-apply', 'btn-export', 'btn-run'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.disabled = false; el.style.opacity = ''; el.style.pointerEvents = ''; }
  });
}

// ── Remote player overlay ────────────────────────────────────────────────────
function _createRemoteOverlay(isHost) {
  document.getElementById('gb-mp-remote-overlay')?.remove();
  // runInRunner renames the container from 'game-container-builder' to 'gameContainer'
  // before calling this function, so try both to be safe
  const gc = document.getElementById('gameContainer') || document.getElementById('game-container-builder');
  if (!gc) return;
  const overlay = document.createElement('canvas');
  overlay.id = 'gb-mp-remote-overlay';
  overlay.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:200;';
  overlay.width = gc.offsetWidth || 800;
  overlay.height = gc.offsetHeight || 580;
  if (getComputedStyle(gc).position === 'static') gc.style.position = 'relative';
  gc.appendChild(overlay);
  const ctx = overlay.getContext('2d');
  // Host sees the guest as "Player 2"; guest sees the host as "Host"
  const partnerLabel = isHost ? 'Player 2' : 'Host';
  function _renderLoop() {
    if (!document.getElementById('gb-mp-remote-overlay')) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    const pos = window.__mpPartnerPos;
    if (pos) {
      const w = pos.width || 32, h = pos.height || 32;
      ctx.fillStyle = 'rgba(99,102,241,0.5)';
      ctx.fillRect(pos.x, pos.y, w, h);
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(pos.x, pos.y, w, h);
      ctx.fillStyle = '#c4b5fd';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(partnerLabel, pos.x + w / 2, pos.y - 5);
    }
    requestAnimationFrame(_renderLoop);
  }
  _renderLoop();
}

// ── Shared backend URI (used by save/load and multiplayer) ───────────────────
const PYTHON_URI = window.GAMEMAKER_API_ORIGIN;

// ── Save / Load games ────────────────────────────────────────────────────────
(function () {
  const API = PYTHON_URI + '/api/gamebuilder';

  async function apiGetUser() {
    try {
      const r = await fetch(PYTHON_URI + '/api/id', { credentials: 'include' });
      if (!r.ok) return null;
      const d = await r.json();
      return d && d.id ? d : null;
    } catch (_) { return null; }
  }

  async function apiList() {
    const r = await fetch(API, { credentials: 'include' });
    if (!r.ok) throw new Error(await apiErrorMsg(r));
    return r.json();
  }

  async function apiErrorMsg(r) {
    try { const d = await r.json(); return `HTTP ${r.status}: ${d.message || d.error || JSON.stringify(d)}`; }
    catch (_) { return `HTTP ${r.status}`; }
  }

  async function apiSave(name, data) {
    const r = await fetch(API, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, data })
    });
    if (!r.ok) throw new Error(await apiErrorMsg(r));
    return r.json();
  }

  async function apiUpdate(id, name, data) {
    const r = await fetch(API + '/' + id, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, data })
    });
    if (!r.ok) throw new Error(await apiErrorMsg(r));
    return r.json();
  }

  async function apiDelete(id) {
    const r = await fetch(API + '/' + id, { method: 'DELETE', credentials: 'include' });
    if (r.status !== 200 && r.status !== 204) throw new Error('Delete failed');
  }

  function saveStatus(msg, color) {
    const el = document.getElementById('gb-save-status');
    if (el) { el.textContent = msg; el.style.color = color || '#64748b'; }
  }

  function renderSavedGames(projects) {
    const list  = document.getElementById('gb-save-list');
    const empty = document.getElementById('gb-save-empty');
    if (!list) return;
    list.innerHTML = '';
    if (!projects || projects.length === 0) {
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    projects.forEach(proj => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;background:#1a2035;border:1px solid #2d3a55;border-radius:9px;padding:9px 12px;';
      const nameEl = document.createElement('span');
      nameEl.textContent = proj.name;
      nameEl.style.cssText = 'flex:1;font-size:.88rem;color:#e2e8f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';

      const dateEl = document.createElement('span');
      const d = proj.updated_at ? new Date(proj.updated_at) : null;
      dateEl.textContent = d ? d.toLocaleDateString() : '';
      dateEl.style.cssText = 'font-size:.72rem;color:#475569;white-space:nowrap;';

      const loadBtn = document.createElement('button');
      loadBtn.textContent = '↓ Load';
      loadBtn.style.cssText = 'padding:5px 10px;background:#0ea5e9;border:none;border-radius:7px;color:#fff;font-size:.78rem;font-weight:700;cursor:pointer;white-space:nowrap;';
      loadBtn.onclick = () => loadProject(proj);

      const overBtn = document.createElement('button');
      overBtn.textContent = '⟳';
      overBtn.title = 'Overwrite with current game';
      overBtn.style.cssText = 'padding:5px 8px;background:#1e293b;border:1px solid #334155;border-radius:7px;color:#94a3b8;font-size:.78rem;cursor:pointer;';
      overBtn.onclick = () => overwriteProject(proj.id, proj.name);

      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑';
      delBtn.title = 'Delete';
      delBtn.style.cssText = 'padding:5px 8px;background:none;border:1px solid #4c1d1d;border-radius:7px;color:#f87171;font-size:.78rem;cursor:pointer;';
      delBtn.onclick = () => deleteProject(proj.id);

      row.appendChild(nameEl);
      row.appendChild(dateEl);
      row.appendChild(loadBtn);
      row.appendChild(overBtn);
      row.appendChild(delBtn);
      list.appendChild(row);
    });
  }

  function getCurrentLevels() {
    return typeof window.__gb_getLevels === 'function' ? window.__gb_getLevels() : [];
  }

  function loadProject(proj) {
    if (!proj.data || !Array.isArray(proj.data) || proj.data.length === 0) {
      saveStatus('This project has no level data.', '#f87171');
      return;
    }
    if (typeof window.__gb_loadLevels === 'function') {
      window.__gb_loadLevels(proj.data);
    }
    document.getElementById('gb-save-overlay').style.display = 'none';
    saveStatus('');
  }

  async function overwriteProject(id, name) {
    try {
      await apiUpdate(id, name, getCurrentLevels());
      saveStatus('Overwritten ✓', '#4ade80');
      await refreshList();
    } catch (e) {
      saveStatus('Error: ' + e.message, '#f87171');
    }
  }

  async function deleteProject(id) {
    if (!confirm('Delete this saved game?')) return;
    try {
      await apiDelete(id);
      await refreshList();
    } catch (e) {
      saveStatus('Error: ' + e.message, '#f87171');
    }
  }

  async function refreshList() {
    const loading = document.getElementById('gb-save-loading');
    const wrap    = document.getElementById('gb-save-list-wrap');
    if (loading) loading.style.display = 'block';
    if (wrap)    wrap.style.display    = 'none';
    try {
      const projects = await apiList();
      renderSavedGames(projects);
      if (loading) loading.style.display = 'none';
      if (wrap)    wrap.style.display    = 'block';
    } catch (e) {
      if (loading) loading.style.display = 'none';
      saveStatus('Could not load saved games.', '#f87171');
    }
  }

  async function openModal() {
    const overlay   = document.getElementById('gb-save-overlay');
    const loginMsg  = document.getElementById('gb-save-login-msg');
    const saveForm  = document.getElementById('gb-save-form');
    const listWrap  = document.getElementById('gb-save-list-wrap');
    const loading   = document.getElementById('gb-save-loading');
    if (!overlay) return;

    overlay.style.display = 'flex';
    if (loginMsg)  loginMsg.style.display  = 'none';
    if (saveForm)  saveForm.style.display  = 'none';
    if (listWrap)  listWrap.style.display  = 'none';
    if (loading)   loading.style.display   = 'block';
    saveStatus('');

    const user = await apiGetUser();
    if (loading) loading.style.display = 'none';

    if (!user) {
      if (loginMsg) loginMsg.style.display = 'block';
      return;
    }

    if (saveForm) saveForm.style.display = 'block';
    await refreshList();
  }

  // Open button
  document.getElementById('gb-save-btn')?.addEventListener('click', openModal);

  // Close button
  document.getElementById('gb-save-close')?.addEventListener('click', () => {
    document.getElementById('gb-save-overlay').style.display = 'none';
  });
  document.getElementById('gb-save-overlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('gb-save-overlay'))
      document.getElementById('gb-save-overlay').style.display = 'none';
  });

  // Save new game
  document.getElementById('gb-save-confirm')?.addEventListener('click', async () => {
    const nameInput = document.getElementById('gb-save-name');
    const name = (nameInput?.value || '').trim() || 'My Game';
    saveStatus('Saving…', '#64748b');
    try {
      await apiSave(name, getCurrentLevels());
      if (nameInput) nameInput.value = '';
      saveStatus('Saved ✓', '#4ade80');
      await refreshList();
    } catch (e) {
      saveStatus('Error: ' + e.message, '#f87171');
    }
  });

  // Allow Enter key in name input
  document.getElementById('gb-save-name')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('gb-save-confirm')?.click();
  });
})();

// ── Multiplayer ──────────────────────────────────────────────────────────────
let _socket = null;
let _mpRoom  = null;
let _mpPlayerCount = 1;

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function mpStatus(msg, color) {
  const el = document.getElementById('gb-mp-status');
  if (el) { el.textContent = msg; if (color) el.style.color = color; }
}

function mpConnDot(msg, color) {
  const el = document.getElementById('gb-mp-conn-dot');
  if (el) { el.textContent = '● ' + msg; el.style.color = color || '#64748b'; }
}

function mpRenderPlayers(count) {
  _mpPlayerCount = count;
  const list = document.getElementById('gb-mp-player-list');
  if (!list) return;
  list.innerHTML = '';
  for (let i = 0; i < Math.max(2, count); i++) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:.82rem;';
    const dot = i < count ? '🟢' : '⭕';
    const label = i === 0 ? 'You (Host)' : (i < count ? 'Player ' + (i + 1) + ' — Connected!' : 'Waiting for player ' + (i + 1) + '…');
    const color = i < count ? '#a5f3fc' : '#475569';
    row.innerHTML = `<span>${dot}</span><span style="color:${color}">${label}</span>`;
    list.appendChild(row);
  }
}

function mpShowRoom(code) {
  document.getElementById('gb-mp-setup').style.display = 'none';
  document.getElementById('gb-mp-room-active').style.display = 'block';
  document.getElementById('gb-mp-room-code').textContent = code;
  // Update the toolbar button
  const btn = document.getElementById('gb-mp-btn');
  if (btn) { btn.style.borderColor = '#22c55e'; btn.style.color = '#4ade80'; btn.title = 'Multiplayer — In Room: ' + code; }
  mpRenderPlayers(1);
  _renderFriendsList();
}

function mpHideRoom() {
  document.getElementById('gb-mp-setup').style.display = 'block';
  document.getElementById('gb-mp-room-active').style.display = 'none';
  const btn = document.getElementById('gb-mp-btn');
  if (btn) { btn.style.borderColor = '#334155'; btn.style.color = '#94a3b8'; btn.title = 'Multiplayer'; }
}

// ── localStorage helpers (mirrors UESL hub) ─────────────────────────────────
function _chatKey(uid1, uid2) {
  return 'uesl_chat_v1__' + [String(uid1), String(uid2)].sort().join('__');
}
function _chatAppend(uid1, uid2, msg) {
  try {
    const key = _chatKey(uid1, uid2);
    const msgs = JSON.parse(localStorage.getItem(key) || '[]');
    msgs.push(msg);
    if (msgs.length > 500) msgs.splice(0, msgs.length - 500);
    localStorage.setItem(key, JSON.stringify(msgs));
  } catch (_) {}
}
function _friendsList(uid) {
  try { return JSON.parse(localStorage.getItem('uesl_friends_v1_' + uid) || '[]'); } catch(_) { return []; }
}

// ── Socket connection ────────────────────────────────────────────────────────
// isHost=true  → host path: emits create_room, waits for partner_joined
// isHost=false → guest path: emits join_room_event, receives game_data
function connectSocket(room, isHost, gameData, gameName) {
  if (_socket) { _socket.disconnect(); }
  mpConnDot('Connecting…', '#f59e0b');
  mpStatus('Connecting to server…');
  _socket = io(PYTHON_URI, {
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1500,
    timeout: 20000,
  });
  window.__mpSocket = _socket;
  window.__mpRoom = room;
  const myUid  = sessionStorage.getItem('uesl_my_uid')  || '';
  const myName = sessionStorage.getItem('uesl_my_name') || (isHost ? 'Host' : 'Player 2');

  // Track whether guest has successfully joined (game_data received)
  let _guestJoined = isHost;

  // Timeout: if guest doesn't receive game_data within 12s, reset
  let _joinTimeout = null;
  if (!isHost) {
    _joinTimeout = setTimeout(() => {
      if (!_guestJoined) {
        mpStatus('⚠ Could not join — room not found or host disconnected. Try again.', '#ef4444');
        mpConnDot('Not connected', '#64748b');
        disconnectSocket();
      }
    }, 12000);
  }

  // Real-time partner position for the overlay renderer
  _socket.on('partner_update', data => {
    window.__mpPartnerPos = data;
  });

  _socket.on('connect', () => {
    if (isHost) {
      mpConnDot('In room ' + room, '#22c55e');
      const code = gameData || document.getElementById('code-editor')?.value || '';
      _socket.emit('create_room', {
        room_id:   room,
        uid:       myUid,
        name:      myName,
        game_data: code,
        game_name: gameName || 'UESL Game Builder',
      });
    } else {
      mpConnDot('Joining room ' + room + '…', '#f59e0b');
      mpStatus('Connected — waiting for host to confirm…');
      _socket.emit('join_room_event', { room_id: room, uid: myUid, name: myName });
    }
  });

  // HOST: room confirmed by server
  _socket.on('room_created', ({ room_id }) => {
    mpStatus('✅ Room ' + room_id + ' ready — share the code with a friend!', '#4ade80');
    mpRenderPlayers(1);
  });

  // HOST: a guest joined
  _socket.on('partner_joined', ({ name }) => {
    mpStatus('🎮 ' + (name || 'A player') + ' joined the room!', '#4ade80');
    mpRenderPlayers(2);
    _createRemoteOverlay(true);
  });

  // GUEST: receive host's game data and launch it
  _socket.on('game_data', ({ game_data, game_name, host_name }) => {
    clearTimeout(_joinTimeout);
    _guestJoined = true;
    if (game_data) {
      mpConnDot('In room ' + room, '#22c55e');
      mpStatus('📥 Level received from ' + (host_name || 'host') + ' — launching…', '#a5f3fc');
      window.__mpInjectedCode = game_data;
      const editor = document.getElementById('code-editor');
      if (editor) editor.value = game_data;
      // Show the room panel now that join is confirmed
      mpShowRoom(room);
      _enableMpMode();
      setTimeout(() => {
        if (typeof window.__runInRunner === 'function') {
          window.__runInRunner();
        } else {
          document.getElementById('btn-code-play')?.click();
        }
        setTimeout(() => _createRemoteOverlay(false), 600);
        mpStatus('🎮 Playing "' + (game_name || 'Game') + '" — have fun!', '#4ade80');
      }, 500);
    }
  });

  _socket.on('join_error', ({ msg }) => {
    clearTimeout(_joinTimeout);
    mpStatus('⚠ ' + (msg || 'Could not join room — check the code and try again.'), '#ef4444');
    mpConnDot('Not connected', '#64748b');
    // Reset to setup so the user can try again
    disconnectSocket();
  });

  _socket.on('partner_left', () => {
    mpRenderPlayers(1);
    mpStatus('⚠ Your partner left the room.', '#f59e0b');
    mpConnDot('In room ' + room + ' (1 player)', '#22c55e');
  });

  _socket.on('disconnect', (reason) => {
    // Ignore transport upgrade disconnects (socket.io reconnects automatically)
    if (reason === 'transport upgrade') return;
    if (_guestJoined || isHost) {
      mpConnDot('Reconnecting…', '#f59e0b');
      mpStatus('Connection lost — attempting to reconnect…');
    } else {
      // Guest disconnected before join was confirmed
      clearTimeout(_joinTimeout);
      mpStatus('⚠ Connection lost before joining — check the room code and try again.', '#ef4444');
      mpConnDot('Not connected', '#64748b');
      disconnectSocket();
    }
  });

  _socket.on('reconnect', () => {
    mpConnDot('In room ' + room, '#22c55e');
    mpStatus('✅ Reconnected!', '#4ade80');
  });

  _socket.on('reconnect_failed', () => {
    mpConnDot('Disconnected', '#ef4444');
    mpStatus('⚠ Could not reconnect. Please leave and rejoin.', '#ef4444');
  });

  _socket.on('connect_error', (err) => {
    mpConnDot('Connection failed', '#ef4444');
    mpStatus('⚠ Could not reach the server — close this modal and try again.', '#ef4444');
  });
}

function disconnectSocket() {
  if (_socket) { _socket.disconnect(); _socket = null; }
  _mpRoom = null;
  window.__mpSocket = null;
  window.__mpRoom = null;
  window.__mpPartnerPos = null;
  (window.__mpPosIntervals || []).forEach(id => clearInterval(id));
  window.__mpPosIntervals = [];
  document.getElementById('gb-mp-remote-overlay')?.remove();
  mpHideRoom();
  mpConnDot('Not connected', '#64748b');
  mpStatus('');
  _disableMpMode();
}

// ── Create room & send invite via UESL localStorage chat ────────────────────
function _createRoomAndInviteFriend(friendUid, friendName) {
  const myUid  = sessionStorage.getItem('uesl_my_uid');
  const myName = sessionStorage.getItem('uesl_my_name') || 'A friend';
  if (!myUid) { mpStatus('⚠ Not logged in — log in on the UESL hub first'); return; }
  _mpRoom = generateRoomCode();
  // Generate fresh code from builder state so guest always gets the actual game,
  // not just whatever happened to be in the editor at invitation time.
  const code = (typeof window.__generateCurrentCode === 'function' ? window.__generateCurrentCode() : null)
    || document.getElementById('code-editor')?.value || '';
  connectSocket(_mpRoom, true, code, 'UESL Game Builder');
  mpShowRoom(_mpRoom);
  mpStatus('Room ' + _mpRoom + ' created — inviting ' + friendName + '…');
  const invite = {
    id: Date.now() + '_' + Math.random().toString(36).slice(2),
    sender_uid:  String(myUid),
    sender_name: myName,
    type:        'game_invite',
    room_id:     _mpRoom,
    game_name:   'UESL Game Builder',
    created_at:  new Date().toISOString()
  };
  _chatAppend(myUid, friendUid, invite);
  mpStatus('✅ Invite sent to ' + friendName + ' — room: ' + _mpRoom);
}

// ── Populate friends list in modal ──────────────────────────────────────────
function _renderFriendsList() {
  const myUid = sessionStorage.getItem('uesl_my_uid');
  const loginNote = document.getElementById('gb-mp-login-note');
  const friendsSection = document.getElementById('gb-mp-friends-section');
  const listEl = document.getElementById('gb-mp-friends-list');
  const noFriendsEl = document.getElementById('gb-mp-no-friends');
  if (!listEl) return;
  listEl.innerHTML = '';
  if (!myUid) {
    if (loginNote) loginNote.style.display = 'block';
    if (friendsSection) friendsSection.style.display = 'none';
    return;
  }
  if (loginNote) loginNote.style.display = 'none';
  if (friendsSection) friendsSection.style.display = 'block';
  const friends = _friendsList(myUid);
  if (!friends.length) {
    if (noFriendsEl) noFriendsEl.style.display = 'block';
    return;
  }
  if (noFriendsEl) noFriendsEl.style.display = 'none';
  friends.forEach(f => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:#0f1729;border-radius:7px;font-size:.82rem;';
    row.innerHTML = `
      <span style="color:#e2e8f0;">${f.name || f.uid}</span>
      <button style="padding:3px 10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:6px;color:#fff;font-size:.75rem;font-weight:700;cursor:pointer;">🎮 Invite</button>
    `;
    row.querySelector('button').addEventListener('click', () => _createRoomAndInviteFriend(f.uid, f.name || f.uid));
    listEl.appendChild(row);
  });
}

// ── Button wiring ────────────────────────────────────────────────────────────
document.getElementById('gb-mp-btn')?.addEventListener('click', () => {
  document.getElementById('gb-mp-overlay').style.display = 'flex';
  if (!_mpRoom) _renderFriendsList();
  // Auto-join if ?room= in URL (guest path)
  const urlRoom = new URLSearchParams(location.search).get('room');
  if (urlRoom && !_mpRoom) {
    _mpRoom = urlRoom;
    connectSocket(urlRoom, false);
    mpStatus('Joining room ' + urlRoom + '…');
  }
});

document.getElementById('gb-mp-close')?.addEventListener('click', () => {
  document.getElementById('gb-mp-overlay').style.display = 'none';
});

document.getElementById('gb-mp-create')?.addEventListener('click', () => {
  _mpRoom = generateRoomCode();
  const code = (typeof window.__generateCurrentCode === 'function' ? window.__generateCurrentCode() : null)
    || document.getElementById('code-editor')?.value || '';
  connectSocket(_mpRoom, true, code, 'UESL Game Builder');
  mpShowRoom(_mpRoom);
  mpStatus('Room created — share the code with a friend!');
  _enableMpMode();
});

document.getElementById('gb-mp-join')?.addEventListener('click', () => {
  const code = document.getElementById('gb-mp-join-code')?.value.trim().toUpperCase();
  if (!code || code.length < 4) { mpStatus('⚠ Enter a valid room code'); return; }
  _mpRoom = code;
  // Don't show the room UI yet — wait until game_data is received to confirm join
  mpStatus('Joining room ' + code + '…');
  mpConnDot('Connecting…', '#f59e0b');
  connectSocket(code, false);
});

document.getElementById('gb-mp-copy-btn')?.addEventListener('click', () => {
  const code = document.getElementById('gb-mp-room-code')?.textContent;
  if (code) {
    navigator.clipboard.writeText(code).then(() => {
      const btn = document.getElementById('gb-mp-copy-btn');
      if (btn) { btn.textContent = '✅ Copied!'; setTimeout(() => { btn.textContent = '📋 Copy'; }, 1800); }
    }).catch(() => {
      mpStatus('Code: ' + code + ' — copy it manually');
    });
  }
});

document.getElementById('gb-mp-send-level')?.addEventListener('click', () => {
  if (!_mpRoom) { mpStatus('⚠ Not connected to a room'); return; }
  // Re-create the room with updated code so the guest receives the latest level
  const code = (typeof window.__generateCurrentCode === 'function' ? window.__generateCurrentCode() : null)
    || document.getElementById('code-editor')?.value || '';
  connectSocket(_mpRoom, true, code, 'UESL Game Builder');
  mpStatus('📤 Updating level for partner…', '#4ade80');
});

document.getElementById('gb-mp-leave')?.addEventListener('click', () => {
  disconnectSocket();
  document.getElementById('gb-mp-overlay').style.display = 'none';
});

// "Exit multiplayer" link inside the editing-lock banner
document.getElementById('gb-mp-exit-edit')?.addEventListener('click', (e) => {
  e.preventDefault();
  disconnectSocket();
  document.getElementById('gb-mp-overlay').style.display = 'none';
});

// Auto-join room from URL on page load (guest path)
(function() {
  const urlRoom = new URLSearchParams(location.search).get('room');
  if (urlRoom) { _mpRoom = urlRoom; connectSocket(urlRoom, false); }
})();

// ── Left panel horizontal resize ────────────────────────────────────────────
(function() {
    const handle   = document.getElementById('left-panel-resize');
    const colAsset = document.getElementById('col-asset');
    const layout   = colAsset?.closest('.creator-layout');
    if (!handle || !colAsset) return;

    const MIN_W      = 165;
    const MAX_W      = 520;
    const STORAGE_KEY = 'gb-left-panel-width';

    // Returns the maximum width the panel should occupy given current window size
    // (cap at 40% of the layout width so the right panel always has room)
    function maxAllowed() {
        const layoutW = layout ? layout.getBoundingClientRect().width : window.innerWidth;
        return Math.min(MAX_W, Math.floor(layoutW * 0.40));
    }

    // Apply a width, clamping it to the current window-based limit
    function applyWidth(w) {
        const clamped = Math.min(maxAllowed(), Math.max(MIN_W, w));
        colAsset.style.width = clamped + 'px';
        colAsset.style.flex  = 'none';
        return clamped;
    }

    // Restore saved width (clamped to current window)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const w = parseInt(saved, 10);
        if (w >= MIN_W) applyWidth(w);
    }

    // Re-clamp on window resize so the panel never overflows
    window.addEventListener('resize', () => {
        if (colAsset.style.width) applyWidth(parseInt(colAsset.style.width, 10));
    });

    let dragging = false, startX = 0, startW = 0;

    handle.addEventListener('mousedown', e => {
        dragging = true;
        startX   = e.clientX;
        startW   = colAsset.getBoundingClientRect().width;
        handle.classList.add('dragging');
        document.body.style.cursor     = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        applyWidth(startW + (e.clientX - startX));
    });

    document.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        handle.classList.remove('dragging');
        document.body.style.cursor     = '';
        document.body.style.userSelect = '';
        localStorage.setItem(STORAGE_KEY, parseInt(colAsset.style.width, 10));
    });
})();
