// Social behavior retained; presentation comes from shared OCS components.
(function () {
    'use strict';

    // ── Config ───────────────────────────────────────────────────────────────
    const PYTHON_URI = (document.body.dataset.apiSameOrigin === "true" ? location.origin : ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? `http://${location.hostname}:8424` : 'https://uesl.opencodingsociety.com'));
    const FETCH_OPTS = { mode: 'cors', cache: 'default', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' } };

    // ── Per-user friends in localStorage ─────────────────────────────────────
    // Each account has its own list so two accounts on the same browser don't collide.
    const friendsKey  = uid => `uesl_friends_v1_${uid}`;
    const REQUESTS_KEY = 'uesl_social_requests_v1';

    // My friends (uses myUid — only call after login)
    function lsLoad()           { try { return JSON.parse(localStorage.getItem(friendsKey(myUid))) || []; } catch(e) { return []; } }
    function lsSave(list)       { localStorage.setItem(friendsKey(myUid), JSON.stringify(list)); }
    function lsAdd(uid, name)   { const l=lsLoad(); if (!l.find(f=>f.uid===uid)) { l.push({uid,name,status:'offline'}); lsSave(l); } }
    function lsRemove(uid)      { lsSave(lsLoad().filter(f=>f.uid!==uid)); }

    // Add someone to ANOTHER user's friends list (used when accepting — both sides become friends)
    function lsAddForUser(targetUid, uid, name) {
      const key = friendsKey(targetUid);
      let l = []; try { l = JSON.parse(localStorage.getItem(key)) || []; } catch(e) {}
      if (!l.find(f => f.uid === uid)) { l.push({ uid, name, status: 'offline' }); }
      localStorage.setItem(key, JSON.stringify(l));
    }

    // ── Friend requests (server-side) ─────────────────────────────────────────
    async function reqSend(toUid, toName) {
      const r = await api('/api/friend/request', {
        method: 'POST',
        body: JSON.stringify({ to_uid: toUid, to_name: toName }),
      });
      return r.ok;
    }

    async function reqGetIncoming() {
      try {
        const r = await api('/api/friend/requests');
        if (!r.ok) return [];
        return await r.json();
      } catch(e) { return []; }
    }

    async function reqIsPending(toUid) {
      const reqs = await reqGetIncoming();
      // check outgoing — server doesn't expose these, so check via a simple GET
      // treat as "not pending" if we can't verify; the send will 409 if already pending
      return false;
    }

    async function reqAccept(reqId) {
      await api('/api/friend/accept', {
        method: 'POST',
        body: JSON.stringify({ request_id: reqId }),
      });
    }

    async function reqDecline(reqId) {
      await api('/api/friend/decline', {
        method: 'POST',
        body: JSON.stringify({ request_id: reqId }),
      });
    }

    // ── People cache (fetched once per session from Python backend) ─────────────
    let _peopleCache = null;
    async function getPeople() {
      if (_peopleCache) return _peopleCache;
      const attempts = [
        () => fetch(PYTHON_URI + '/api/user'),
        () => fetch(PYTHON_URI + '/api/user', { credentials: 'include' }),
      ];
      let lastErr = null;
      for (const attempt of attempts) {
        try {
          const r = await attempt();
          if (!r.ok) { lastErr = new Error(`HTTP ${r.status}`); continue; }
          const raw = await r.text();
          if (!raw || !raw.includes('[')) { lastErr = new Error('Empty response'); continue; }
          const clean = raw.slice(0, raw.lastIndexOf(']') + 1);
          const parsed = JSON.parse(clean);
          if (!Array.isArray(parsed)) { lastErr = new Error('Not an array'); continue; }
          _peopleCache = parsed;
          return _peopleCache;
        } catch(e) { lastErr = e; }
      }
      throw new Error(lastErr?.message || 'Could not reach Python backend');
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    const $ = id => document.getElementById(id);
    function initials(name) { return (name||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase(); }
    function fmtTime(iso) { try { const d=new Date(iso); return d.toDateString()===new Date().toDateString() ? d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : d.toLocaleDateString([],{month:'short',day:'numeric'}); } catch(e){ return ''; } }
    function api(path, opts) { return fetch(PYTHON_URI + path, Object.assign({}, FETCH_OPTS, opts)); }
    function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    // ── Auth check (mirrors game-maker checkLogin) ───────────────────────────
    let _loggedIn = null;
    let myUid = null, myName = '', myUser = null;

    async function checkLogin() {
      if (_loggedIn !== null) return _loggedIn;
      // Wait up to 2s for window.user (set by login.js if loaded)
      await new Promise(res => {
        let ticks = 0;
        const id = setInterval(() => { if (window.user !== undefined || ++ticks >= 20) { clearInterval(id); res(); } }, 100);
      });
      if (window.user !== undefined) { _loggedIn = !!window.user; if (window.user) { myUser = window.user; myUid = window.user.uid || window.user.id || null; myName = window.user.name || window.user.username || 'You'; if (myUid)  sessionStorage.setItem('uesl_my_uid',  String(myUid)); if (myName) sessionStorage.setItem('uesl_my_name', myName); } return _loggedIn; }
      // Fallback: ping /api/id directly
      try {
        const r = await api('/api/id');
        if (r.ok) { myUser = await r.json(); myUid = myUser.uid || myUser.id || null; myName = myUser.name || myUser.username || 'You'; _loggedIn = true; if (myUid)  sessionStorage.setItem('uesl_my_uid',  String(myUid)); if (myName) sessionStorage.setItem('uesl_my_name', myName); }
        else _loggedIn = false;
      } catch(e) { _loggedIn = false; }
      return _loggedIn;
    }

    // ── State ────────────────────────────────────────────────────────────────
    let activeFriend = null;   // { uid, name }
    let activeGroup  = null;   // { id, name, members: [{uid,name}] }
    let friendsCache = [];     // [{ uid, name, status }]
    let pollTimer    = null;
    let groupPollTimer = null;
    let reqPollTimer = null;   // polls for incoming friend requests every 5s
    let lastMsgTs    = '';     // ISO timestamp of newest fetched message

    // ── DOM refs ─────────────────────────────────────────────────────────────
    const overlay      = $('social-overlay');
    const afModal      = $('add-friend-modal');
    const friendList   = $('friend-list');
    const chatEmpty    = $('chat-empty');
    const chatHeader   = $('chat-header');
    const chatMsgs     = $('chat-messages');
    const chatInputRow = $('chat-input-row');
    const chatInput    = $('chat-input');

    // ── Render topbar ────────────────────────────────────────────────────────
    function renderTopbar() {
      $('suc-name').textContent = myUid;
    }

    // ── Nav auth state — show user chip when logged in ────────────────────────
    function _updateNavAuthState() {
      $('nav-signin-btn').hidden = Boolean(myUid);
      $('nav-social-btn').hidden = !myUid;
      $('nav-user-chip').hidden = !myUid;
      $('nav-user-name').textContent = myUid || '';
    }

    // Check login on page load and update nav immediately
    (async () => {
      await checkLogin();
      if (myUid) _updateNavAuthState();
    })();

    // ── Friend requests UI ────────────────────────────────────────────────────
    async function renderRequests() {
      const badge   = $('req-badge');
      const list    = $('request-list');
      const empty   = $('req-empty');
      if (!list) return;

      const incoming = await reqGetIncoming();

      if (!incoming.length) {
        badge.hidden = true;
        list.innerHTML = '';
        if (empty) { empty.hidden = false; list.appendChild(empty); }
        return;
      }

      badge.hidden = false;
      badge.textContent = incoming.length;
      list.innerHTML = '';
      incoming.forEach(req => {
        const item = document.createElement('div');
        item.className = 'ocs__links';
        item.innerHTML = `
          <div>${esc(initials(req.from_uid))}</div>
          <div>
            <div>@${esc(req.from_uid)}</div>
            <div>wants to be friends</div>
          </div>
          <button class="ocs__btn" aria-label="Accept friend request" data-act="accept">✓</button>
          <button class="ocs__btn" aria-label="Decline friend request" data-act="decline">✕</button>`;
        item.querySelector('[data-act="accept"]').addEventListener('click', async () => {
          await reqAccept(req.id); await loadFriends();
        });
        item.querySelector('[data-act="decline"]').addEventListener('click', async () => {
          await reqDecline(req.id); await renderRequests();
        });
        list.appendChild(item);
      });
    }

    // ── Friends list (server + localStorage cache for chat) ───────────────────
    async function loadFriends() {
      // Pull accepted friends from server, merge into localStorage for chat/DM use
      try {
        const r = await api('/api/friend/list');
        if (r.ok) {
          const serverFriends = await r.json();
          const current = lsLoad();
          serverFriends.forEach(f => {
            if (!current.find(c => c.uid === f.uid)) {
              current.push({ uid: f.uid, name: f.uid, status: 'offline' });
            }
          });
          lsSave(current);
        }
      } catch(e) {}
      friendsCache = lsLoad();
      renderFriendList();
      await renderRequests();
      renderGroupList();
    }

    function renderFriendList() {
      const online = friendsCache.filter(f => f.status === 'online').length;
      $('online-count').textContent = online;
      friendList.innerHTML = '';
      if (!friendsCache.length) {
        friendList.innerHTML = '<p>No friends yet. Choose <strong>Add friend</strong> to find someone.</p>';
        return;
      }
      friendsCache.forEach(friend => {
        const item = document.createElement('div');
        item.className = 'friend-item ocs__links' + (activeFriend?.uid === friend.uid ? ' active' : '');
        item.setAttribute('role','listitem'); item.setAttribute('tabindex','0');
        const statusCls = friend.status === 'online' ? 'online' : friend.status === 'away' ? 'away' : 'offline';
        item.innerHTML = `
          <div class="ocs__badge">
            ${esc(initials(friend.name))}<span class="fi-status ${statusCls}"></span>
          </div>
          <div class="ocs__grid-cell">
            <div class="fi-name">${esc(friend.name)}</div>
            <div class="ocs__caption">${statusCls === 'online' ? 'Online' : statusCls === 'away' ? 'Away' : 'Offline'}</div>
          </div>
          <button class="fi-remove-btn ocs__btn" title="Remove friend">✕</button>`;
        item.querySelector('.fi-remove-btn').addEventListener('click', e => {
          e.stopPropagation();
          lsRemove(friend.uid);
          if (activeFriend?.uid === friend.uid) {
            activeFriend = null;
            stopPoll();
            chatEmpty.hidden = false;
            chatHeader.hidden = chatMsgs.hidden = chatInputRow.hidden = true;
            document.getElementById('emoji-picker').hidden = true;
          }
          loadFriends();
        });
        item.addEventListener('click', () => openChat(friend));
        item.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') openChat(friend); });
        friendList.appendChild(item);
      });
    }

    // ── Open chat ────────────────────────────────────────────────────────────
    function openChat(friend) {
      activeFriend = friend;
      activeGroup  = null;
      stopPoll();
      renderFriendList();
      const avatarEl = $('chat-friend-avatar');
      avatarEl.textContent = initials(friend.name);
      $('chat-friend-name').textContent = friend.name;
      const sc = friend.status === 'online' ? 'online' : friend.status === 'away' ? 'away' : 'offline';
      $('chat-friend-status').innerHTML = `<span class="dot ${sc}"></span>${sc.charAt(0).toUpperCase()+sc.slice(1)}`;
      chatEmpty.hidden = true;
      chatHeader.hidden = false;
      chatMsgs.hidden = false;
      chatInputRow.hidden = false;
      document.getElementById('emoji-picker').hidden = true; // reset picker
      chatMsgs.innerHTML = '';
      lastMsgTs = '';
      fetchMessages(true);
      startPoll();
      chatInput.focus();
    }

    // ── localStorage chat store ───────────────────────────────────────────────
    // Key is sorted so both users (A→B and B→A) share the exact same slot.
    function chatKey(uid1, uid2) {
      return 'uesl_chat_v1__' + [String(uid1), String(uid2)].sort().join('__');
    }
    function chatLoadAll(uid1, uid2) {
      try { return JSON.parse(localStorage.getItem(chatKey(uid1, uid2))) || []; } catch(e) { return []; }
    }
    function chatAppendStore(uid1, uid2, msg) {
      const msgs = chatLoadAll(uid1, uid2);
      msgs.push(msg);
      // Keep last 500 messages to avoid ballooning localStorage
      if (msgs.length > 500) msgs.splice(0, msgs.length - 500);
      localStorage.setItem(chatKey(uid1, uid2), JSON.stringify(msgs));
    }

    // ── Messages ─────────────────────────────────────────────────────────────
    function fetchMessages(initial) {
      if (!activeFriend) return;
      const all = chatLoadAll(myUid, activeFriend.uid);
      if (initial) {
        chatMsgs.innerHTML = '';
        if (!all.length) {
          chatMsgs.innerHTML = '<div class="ocs__caption">Today</div><p>Say hello! 👋</p>';
          return;
        }
        all.forEach(msg => appendMessage(msg));
        if (all.length) lastMsgTs = all[all.length - 1].created_at;
        return;
      }
      // Poll: only append messages newer than lastMsgTs
      const newMsgs = lastMsgTs ? all.filter(m => m.created_at > lastMsgTs) : all;
      newMsgs.forEach(msg => appendMessage(msg));
      if (newMsgs.length) lastMsgTs = newMsgs[newMsgs.length - 1].created_at;
    }

    function appendMessage(msg) {
      // Compare as strings — myUid can be number or string depending on auth path
      const isMine = String(msg.sender_uid) === String(myUid);
      const sender  = isMine ? myName : (activeFriend?.name || '?');
      const text    = msg.text || '';
      const ts      = msg.created_at || '';
      const row = document.createElement('div');
      row.className = 'ocs__card ocs__stack' + (isMine ? ' me' : '');
      let contentHtml;
      if (msg.type === 'image' && msg.image) {
        contentHtml = `<img class="msg-img ocs__image-frame" src="${esc(msg.image)}" alt="photo">`;
      } else if (msg.type === 'game_invite' && msg.room_id) {
        const gmUrl = (window.baseurl || '') + '/play/?room=' + encodeURIComponent(msg.room_id) + '#game-builder';
        const isMineInvite = String(msg.sender_uid) === String(myUid);
        contentHtml = `
          <div>
            <div>🎮</div>
            <div>Game Invite</div>
            <div>${esc(msg.game_name || 'A Game')}</div>
            ${isMineInvite
              ? `<div>Waiting for friend to join…</div>`
              : `<a class="ocs__btn accent" href="${gmUrl}" target="_blank">▶ Join Game</a>`
            }
          </div>`;
      } else {
        contentHtml = `<div class="ocs__description">${esc(text)}</div>`;
      }
      row.innerHTML = `
        <div class="ocs__badge">${esc(initials(sender))}</div>
        <div>
          ${contentHtml}
          <div class="ocs__caption">${fmtTime(ts)}</div>
        </div>`;
      // Lightbox on image click
      if (msg.type === 'image') {
        row.querySelector('.msg-img').addEventListener('click', () => {
          document.getElementById('img-lightbox-img').src = msg.image;
          document.getElementById('img-lightbox').showModal();
        });
      }
      chatMsgs.appendChild(row);
      chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }

    function startPoll() { pollTimer = setInterval(() => fetchMessages(false), 2000); }
    function stopPoll()  {
      clearInterval(pollTimer); pollTimer = null;
      clearInterval(groupPollTimer); groupPollTimer = null;
    }

    // ── Send message ─────────────────────────────────────────────────────────
    function sendMsg() {
      if (activeGroup) { sendGroupMsg(); return; }
      const text = chatInput.value.trim();
      if (!text || !activeFriend) return;
      chatInput.value = '';
      const msg = {
        id:         Date.now() + '_' + Math.random().toString(36).slice(2),
        sender_uid: String(myUid),
        sender_name: myName,
        text,
        created_at: new Date().toISOString()
      };
      // Write to the shared localStorage slot — both users read from here
      chatAppendStore(myUid, activeFriend.uid, msg);
      // Immediately render on sender's side
      appendMessage(msg);
      lastMsgTs = msg.created_at;
    }

    $('chat-send-btn').addEventListener('click', sendMsg);
    chatInput.addEventListener('keydown', e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } });

    // ════════════════════════════════════════════════════════════════════════
    //  GROUP CHATS
    // ════════════════════════════════════════════════════════════════════════

    // ── localStorage helpers ──────────────────────────────────────────────────
    function groupsKey()         { return `uesl_groups_v1__${myUid}`; }
    function gchatKey(groupId)   { return `uesl_gchat_v1__${groupId}`; }

    function groupsLoad() {
      try { return JSON.parse(localStorage.getItem(groupsKey())) || []; } catch(e) { return []; }
    }
    function groupsSave(arr) { localStorage.setItem(groupsKey(), JSON.stringify(arr)); }

    function gchatLoadAll(groupId) {
      try { return JSON.parse(localStorage.getItem(gchatKey(groupId))) || []; } catch(e) { return []; }
    }
    function gchatAppend(groupId, msg) {
      const msgs = gchatLoadAll(groupId);
      msgs.push(msg);
      if (msgs.length > 500) msgs.splice(0, msgs.length - 500);
      try { localStorage.setItem(gchatKey(groupId), JSON.stringify(msgs)); }
      catch(e) { alert('Storage full — try clearing some messages.'); }
    }

    // ── Render group list in sidebar ──────────────────────────────────────────
    function renderGroupList() {
      const groupListEl = document.getElementById('group-list');
      if (!groupListEl) return;
      const groups = groupsLoad();
      groupListEl.innerHTML = '';
      if (!groups.length) {
        groupListEl.innerHTML = '<p>No groups yet. Choose <strong>Create group</strong> to get started.</p>';
        return;
      }
      groups.forEach(group => {
        const item = document.createElement('div');
        item.className = 'friend-item ocs__links' + (activeGroup?.id === group.id ? ' active' : '');
        item.setAttribute('role', 'listitem'); item.setAttribute('tabindex', '0');
        const memberPreview = group.members.map(m => m.name.split(' ')[0]).join(', ');
        item.innerHTML = `
          <div class="ocs__badge">${group.members.length}</div>
          <div class="ocs__grid-cell">
            <div class="fi-name">${esc(group.name)}</div>
            <div class="ocs__caption">${esc(memberPreview)}</div>
          </div>
          <button class="fi-remove-btn ocs__btn" title="Leave group">✕</button>`;
        item.querySelector('.fi-remove-btn').addEventListener('click', e => {
          e.stopPropagation();
          groupsSave(groupsLoad().filter(g => g.id !== group.id));
          if (activeGroup?.id === group.id) {
            activeGroup = null;
            stopPoll();
            chatEmpty.hidden = false;
            chatHeader.hidden = chatMsgs.hidden = chatInputRow.hidden = true;
            document.getElementById('emoji-picker').hidden = true;
          }
          renderGroupList();
        });
        item.addEventListener('click', () => openGroupChat(group));
        item.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') openGroupChat(group); });
        groupListEl.appendChild(item);
      });
    }

    // ── Open group chat ───────────────────────────────────────────────────────
    function openGroupChat(group) {
      activeFriend = null;
      activeGroup  = group;
      stopPoll();
      renderFriendList();
      renderGroupList();

      const avatarEl = $('chat-friend-avatar');
      avatarEl.textContent = group.members.length;
      $('chat-friend-name').textContent = group.name;
      $('chat-friend-status').innerHTML =
        `<span>${esc(group.members.map(m => m.name).join(', '))}</span>`;

      chatEmpty.hidden = true;
      chatHeader.hidden = false;
      chatMsgs.hidden = false;
      chatInputRow.hidden = false;
      document.getElementById('emoji-picker').hidden = true;
      chatMsgs.innerHTML = '';
      lastMsgTs = '';
      fetchGroupMessages(true);
      groupPollTimer = setInterval(() => fetchGroupMessages(false), 2000);
      chatInput.focus();
    }

    // ── Group message fetch / render ──────────────────────────────────────────
    function fetchGroupMessages(initial) {
      if (!activeGroup) return;
      const all = gchatLoadAll(activeGroup.id);
      if (initial) {
        chatMsgs.innerHTML = '';
        if (!all.length) {
          chatMsgs.innerHTML = '<div class="ocs__caption">Today</div><p>Group created! Say hello 👋</p>';
          return;
        }
        all.forEach(msg => appendGroupMessage(msg));
        if (all.length) lastMsgTs = all[all.length - 1].created_at;
        return;
      }
      const newMsgs = lastMsgTs ? all.filter(m => m.created_at > lastMsgTs) : all;
      newMsgs.forEach(msg => appendGroupMessage(msg));
      if (newMsgs.length) lastMsgTs = newMsgs[newMsgs.length - 1].created_at;
    }

    function appendGroupMessage(msg) {
      const isMine = String(msg.sender_uid) === String(myUid);
      const senderName = msg.sender_name || '?';
      const text = msg.text || '';
      const ts   = msg.created_at || '';
      const row  = document.createElement('div');
      row.className = 'ocs__card ocs__stack' + (isMine ? ' me' : '');
      let contentHtml;
      if (msg.type === 'image' && msg.image) {
        contentHtml = `<img class="msg-img ocs__image-frame" src="${esc(msg.image)}" alt="photo">`;
      } else {
        contentHtml = `<div class="ocs__description">${esc(text)}</div>`;
      }
      row.innerHTML = `
        <div class="ocs__badge">${esc(initials(senderName))}</div>
        <div>
          ${!isMine ? `<div class="ocs__caption">${esc(senderName)}</div>` : ''}
          ${contentHtml}
          <div class="ocs__caption">${fmtTime(ts)}</div>
        </div>`;
      if (msg.type === 'image') {
        const imgEl = row.querySelector('.msg-img');
        if (imgEl) imgEl.addEventListener('click', () => {
          document.getElementById('img-lightbox-img').src = msg.image;
          document.getElementById('img-lightbox').showModal();
        });
      }
      chatMsgs.appendChild(row);
      chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }

    // ── Send group message ────────────────────────────────────────────────────
    function sendGroupMsg() {
      const text = chatInput.value.trim();
      if (!text || !activeGroup) return;
      chatInput.value = '';
      const msg = {
        id:          Date.now() + '_' + Math.random().toString(36).slice(2),
        sender_uid:  String(myUid),
        sender_name: myName,
        text,
        created_at:  new Date().toISOString()
      };
      gchatAppend(activeGroup.id, msg);
      // Mirror group membership into each member's group list so they see it
      activeGroup.members.forEach(m => {
        if (String(m.uid) !== String(myUid)) {
          try {
            const key = `uesl_groups_v1__${m.uid}`;
            const mGroups = JSON.parse(localStorage.getItem(key) || '[]');
            if (!mGroups.find(g => g.id === activeGroup.id)) {
              mGroups.push(activeGroup);
              localStorage.setItem(key, JSON.stringify(mGroups));
            }
          } catch(e) {}
        }
      });
      appendGroupMessage(msg);
      lastMsgTs = msg.created_at;
    }

    // ── Create Group modal ────────────────────────────────────────────────────
    document.getElementById('open-create-group').addEventListener('click', () => {
      const checkboxes = document.getElementById('cgm-friend-checkboxes');
      checkboxes.innerHTML = '';
      const friends = lsLoad();
      if (!friends.length) {
        checkboxes.innerHTML = '<p>Add some friends first!</p>';
      } else {
        friends.forEach(f => {
          const label = document.createElement('label');
          label.className = 'ocs__toggle';
          label.innerHTML = `
            <input type="checkbox" value="${esc(String(f.uid))}" data-name="${esc(f.name)}">
            <div>${esc(initials(f.name))}</div>
            <span>${esc(f.name)}</span>`;
          checkboxes.appendChild(label);
        });
      }
      document.getElementById('cgm-name-input').value = '';
      document.getElementById('cgm-msg').hidden = true;
      document.getElementById('create-group-modal').showModal();
    });

    document.getElementById('cgm-cancel-btn').addEventListener('click', () => {
      document.getElementById('create-group-modal').close();
    });

    document.getElementById('cgm-create-btn').addEventListener('click', () => {
      const name = document.getElementById('cgm-name-input').value.trim();
      const msgEl = document.getElementById('cgm-msg');
      if (!name) {
        msgEl.textContent = 'Please enter a group name.'; msgEl.hidden = false; return;
      }
      const checked = [...document.querySelectorAll('#cgm-friend-checkboxes input:checked')];
      if (!checked.length) {
        msgEl.textContent = 'Select at least one friend.'; msgEl.hidden = false; return;
      }
      msgEl.hidden = true;
      const members = [
        { uid: String(myUid), name: myName },
        ...checked.map(cb => ({ uid: cb.value, name: cb.dataset.name }))
      ];
      const groupId = 'grp_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      const group = { id: groupId, name, members, createdAt: new Date().toISOString() };

      // Save to my groups
      const myGroups = groupsLoad();
      myGroups.push(group);
      groupsSave(myGroups);

      // Mirror into each member's group list (works when members share the same browser)
      members.forEach(m => {
        if (String(m.uid) !== String(myUid)) {
          try {
            const key = `uesl_groups_v1__${m.uid}`;
            const mGroups = JSON.parse(localStorage.getItem(key) || '[]');
            if (!mGroups.find(g => g.id === groupId)) {
              mGroups.push(group);
              localStorage.setItem(key, JSON.stringify(mGroups));
            }
          } catch(e) {}
        }
      });

      document.getElementById('create-group-modal').close();
      renderGroupList();
      openGroupChat(group);
    });

    // ── Emoji picker ─────────────────────────────────────────────────────────
    try {
      const EMOJIS = ['😀','😂','😍','🥰','😎','🤩','😭','😤','🥺','😱',
                      '👍','👎','❤️','🔥','🎉','✨','💯','🙌','👏','🤝',
                      '😊','🤣','😅','😇','🙃','😏','😒','😔','😢','😡',
                      '🫡','💀','👀','🫶','💪','🤔','🥳','😴','🤯','🫠'];
      const emojiPickerEl  = document.getElementById('emoji-picker');
      const emojiToggleBtn = document.getElementById('emoji-toggle-btn');

      if (emojiPickerEl && emojiToggleBtn) {
        EMOJIS.forEach(em => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'ocs__btn utility';
          btn.textContent = em;
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (chatInput) { chatInput.value += em; chatInput.dispatchEvent(new Event('input')); chatInput.focus(); }
            emojiPickerEl.hidden = true;
          });
          emojiPickerEl.appendChild(btn);
        });

        emojiToggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = !emojiPickerEl.hidden;
          emojiPickerEl.hidden = isOpen;
          emojiToggleBtn.setAttribute('aria-expanded', String(!isOpen));
        });

        document.addEventListener('click', () => { emojiPickerEl.hidden = true; });
        emojiPickerEl.addEventListener('click', e => e.stopPropagation());
      }
    } catch(emojiErr) { console.warn('Emoji picker setup failed:', emojiErr); }

    // ── Image upload ─────────────────────────────────────────────────────────
    try {
      const imgUploadBtn = document.getElementById('img-upload-btn');
      const imgFileInput = document.getElementById('img-file-input');

      if (imgUploadBtn) {
        imgUploadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!activeFriend && !activeGroup) { alert('Select a chat first.'); return; }
          if (imgFileInput) imgFileInput.click();
        });
      }

      if (imgFileInput) {
        imgFileInput.addEventListener('change', function () {
          const file = this.files[0];
          if (!file) return;
          if (file.size > 1.5 * 1024 * 1024) { alert('Image must be under 1.5 MB.'); this.value = ''; return; }
          const reader = new FileReader();
          reader.onload = (ev) => {
            const original = new Image();
            original.onload = () => {
              const MAX = 400;
              const scale = Math.min(1, MAX / original.width);
              const canvas = document.createElement('canvas');
              canvas.width  = Math.round(original.width  * scale);
              canvas.height = Math.round(original.height * scale);
              canvas.getContext('2d').drawImage(original, 0, 0, canvas.width, canvas.height);
              const compressed = canvas.toDataURL('image/jpeg', 0.7);
              const msg = {
                id: Date.now() + '_' + Math.random().toString(36).slice(2),
                sender_uid: String(myUid), sender_name: myName,
                type: 'image', image: compressed, text: '',
                created_at: new Date().toISOString()
              };
              try {
                if (activeGroup) { gchatAppend(activeGroup.id, msg); appendGroupMessage(msg); }
                else { chatAppendStore(myUid, activeFriend.uid, msg); appendMessage(msg); }
              } catch(e) { alert('Storage full — try a smaller image.'); return; }
              lastMsgTs = msg.created_at;
            };
            original.src = ev.target.result;
          };
          reader.readAsDataURL(file);
          this.value = '';
        });
      }
    } catch(imgErr) { console.warn('Image upload setup failed:', imgErr); }

    // ── Lightbox close ───────────────────────────────────────────────────────
    try {
      const lightbox      = document.getElementById('img-lightbox');
      const lightboxClose = document.getElementById('img-lightbox-close');
      if (lightboxClose) lightboxClose.addEventListener('click', () => { if (lightbox) lightbox.close(); });
      if (lightbox)      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
    } catch(lbErr) { console.warn('Lightbox setup failed:', lbErr); }

    // ── Add friend search ────────────────────────────────────────────────────
    $('open-add-friend').addEventListener('click', () => { $('afm-input').value=''; $('afm-results').innerHTML=''; afModal.showModal(); $('afm-input').focus(); });
    $('afm-close-btn').addEventListener('click', () => afModal.close());
    $('afm-search-btn').addEventListener('click', doSearch);
    $('afm-input').addEventListener('keydown', e => { if(e.key==='Enter') doSearch(); });

    function renderPersonRow(container, uid, name, alreadyFriend, isMe) {
      const item = document.createElement('div');
      item.className = 'ocs__links';
      item.innerHTML = `
        <div class="ocs__badge">${esc(initials(uid))}</div>
        <div><div class="ocs__description">@${esc(uid)}</div></div>
        <button class="afm-add-btn ocs__btn" ${(alreadyFriend||isMe)?'disabled':''}>
          ${isMe ? 'You' : alreadyFriend ? 'Friends ✓' : '+ Add'}
        </button>`;
      if (!alreadyFriend && !isMe) {
        item.querySelector('.afm-add-btn').addEventListener('click', async e => {
          const btn = e.currentTarget;
          btn.disabled = true;
          btn.textContent = 'Sending…';
          const ok = await reqSend(uid, uid);
          btn.textContent = ok ? 'Sent ✓' : 'Already sent';
        });
      }
      container.appendChild(item);
    }

    async function doSearch() {
      const q = $('afm-input').value.trim();
      const container = $('afm-results');
      if (!q) { container.innerHTML = '<p>Enter a name or UID to search.</p>'; return; }
      const searchBtn = $('afm-search-btn');
      searchBtn.disabled = true; searchBtn.textContent = '…';
      container.innerHTML = '<p>Searching…</p>';
      try {
        const all = await getPeople();
        const ql = q.toLowerCase();
        const matches = all.filter(p => {
          const name = (p.name || '').toLowerCase();
          // Java returns integer id; Flask uid is a string
          const uid  = String(p.uid || p.id || '').toLowerCase();
          return name.includes(ql) || uid.includes(ql);
        }).slice(0, 12);

        container.innerHTML = '';
        if (!matches.length) {
          container.innerHTML = '<p>No users found matching "' + esc(q) + '".</p>';
          return;
        }
        matches.forEach(p => {
          // Support both Flask uid (string) and Java id (integer)
          const uid  = String(p.uid || p.id || '');
          const name = p.name || uid;
          // isMe: compare against both string uid and numeric id from myUser
          const isMe = (myUser && (
            uid === String(myUser.uid || '') ||
            uid === String(myUser.id  || '') ||
            name === myName
          ));
          renderPersonRow(container, uid, name, friendsCache.some(f => f.uid === uid), isMe);
        });
      } catch(e) {
        // Java backend unreachable — show error + manual-add fallback
        _peopleCache = null; // reset so next search retries
        container.innerHTML = `
          <p>
            ⚠ Could not reach the user directory (${esc(e.message)}).<br>
            Try again when the service is available.
          </p>
          <p>You can still add someone by entering their exact UID:</p>
          <div>
            <input class="ocs__input" aria-label="Exact user ID" id="afm-manual-uid" type="text" placeholder="exact_uid"
             
              value="${esc(q)}"/>
            <button class="ocs__btn" id="afm-manual-add">Add</button>
          </div>`;
        $('afm-manual-add').addEventListener('click', async () => {
          const uid = $('afm-manual-uid').value.trim();
          if (!uid) return;
          const ok = await reqSend(uid, uid);
          container.innerHTML = ok
            ? `<p>Friend request sent to @${esc(uid)}!</p>`
            : `<p>Could not send request — user not found or already sent.</p>`;
        });
        $('afm-manual-uid').addEventListener('keydown', e => { if (e.key === 'Enter') $('afm-manual-add').click(); });
      } finally {
        searchBtn.disabled = false; searchBtn.textContent = 'Search';
      }
    }

    // ── Message search (sidebar filter) ─────────────────────────────────────
    $('social-msg-search').addEventListener('input', function() {
      const q = this.value.toLowerCase();
      document.querySelectorAll('.friend-item').forEach(item => {
        const name = item.querySelector('.fi-name')?.textContent.toLowerCase()||'';
        item.hidden = Boolean(q && !name.includes(q));
      });
    });

    function startReqPoll() {
      if (reqPollTimer) return;
      reqPollTimer = setInterval(renderRequests, 5000);
    }
    function stopReqPoll() { clearInterval(reqPollTimer); reqPollTimer = null; }

    // ── Game Invite Notifications ─────────────────────────────────────────────
    let invitePollTimer = null;
    const _seenInvites = new Set(JSON.parse(localStorage.getItem('uesl_seen_invites') || '[]'));
    const inviteToast    = document.getElementById('invite-toast');
    const inviteNavBtn   = document.getElementById('nav-social-btn');
    let _pendingInvites  = []; // queue of unseen invites

    function _saveSeenInvites() {
      // keep only last 200 IDs to avoid bloat
      const arr = [..._seenInvites].slice(-200);
      localStorage.setItem('uesl_seen_invites', JSON.stringify(arr));
    }

    function _showNextInvite() {
      if (!_pendingInvites.length) {
        inviteToast.close();
        return;
      }
      const inv = _pendingInvites[0];
      const gmUrl = (window.baseurl || '') + '/play/?room=' + encodeURIComponent(inv.room_id) + '#game-builder';
      document.getElementById('it-title').textContent = `${inv.sender_name || 'A friend'} wants to play with you!`;
      document.getElementById('it-sub').innerHTML    = `<strong>${esc(inv.game_name || 'A Game')}</strong> — join now before the invite expires`;
      document.getElementById('it-join-btn').href    = gmUrl;
      if (!inviteToast.open) inviteToast.showModal();
      // Vibrate on mobile if supported
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }

    document.getElementById('it-dismiss-btn').addEventListener('click', () => {
      if (_pendingInvites.length) {
        const inv = _pendingInvites.shift();
        _seenInvites.add(inv.id);
        _saveSeenInvites();
      }
      inviteToast.close();
      setTimeout(() => {
        if (_pendingInvites.length) _showNextInvite();
        else inviteNavBtn.classList.remove('accent');
      }, 400);
    });

    document.getElementById('it-join-btn').addEventListener('click', () => {
      if (_pendingInvites.length) {
        const inv = _pendingInvites.shift();
        _seenInvites.add(inv.id);
        _saveSeenInvites();
      }
      inviteToast.close();
      if (!_pendingInvites.length) inviteNavBtn.classList.remove('accent');
    });

    function scanInvites() {
      if (!myUid) return;
      const friends = (() => { try { return JSON.parse(localStorage.getItem(`uesl_friends_v1_${myUid}`)) || []; } catch(e) { return []; } })();
      friends.forEach(f => {
        const msgs = (() => { try { return JSON.parse(localStorage.getItem(chatKey(myUid, f.uid))) || []; } catch(e) { return []; } })();
        msgs.forEach(m => {
          if (m.type !== 'game_invite') return;
          if (String(m.sender_uid) === String(myUid)) return; // sent by me
          if (_seenInvites.has(m.id)) return; // already seen
          if (_pendingInvites.find(p => p.id === m.id)) return; // already queued
          _pendingInvites.push(m);
        });
      });
      if (_pendingInvites.length) {
        inviteNavBtn.classList.add('accent');
        if (!inviteToast.open) _showNextInvite();
      }
    }

    function startInvitePoll() {
      if (invitePollTimer) return;
      scanInvites(); // immediate first scan
      invitePollTimer = setInterval(scanInvites, 4000);
    }

    // ── Open / close overlay ─────────────────────────────────────────────────
    $('nav-social-btn').addEventListener('click', async () => {
      const loggedIn = await checkLogin();
      if (!loggedIn) { window.location.href = (window.baseurl || '') + '/login'; return; }
      overlay.showModal();
      renderTopbar();
      loadFriends();
      startReqPoll();
      startInvitePoll();
    });

    $('social-close-btn').addEventListener('click', closeOverlay);
    overlay.addEventListener('close', () => { stopPoll(); stopReqPoll(); });
    inviteToast.addEventListener('cancel', event => { event.preventDefault(); $('it-dismiss-btn').click(); });
    function closeOverlay() {
      stopPoll(); stopReqPoll();
      overlay.close();
    }

    $('nav-dd-logout').addEventListener('click', () => $('social-logout-btn').click());

    // ── Sign out ─────────────────────────────────────────────────────────────
    $('social-logout-btn').addEventListener('click', async () => {
      _loggedIn = null; myUid = null; myName = ''; myUser = null; activeFriend = null;
      stopPoll(); stopReqPoll();
      chatEmpty.hidden = false;
      chatHeader.hidden = chatMsgs.hidden = chatInputRow.hidden = true;
      try { await api('/api/authenticate', { method: 'DELETE' }); } catch(e) {}
      window.location.href = (window.baseurl || '') + '/';
    });

  })();
