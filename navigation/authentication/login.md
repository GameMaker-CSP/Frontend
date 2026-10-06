---
layout: uesl
title: Login
permalink: /login
search_exclude: true
show_reading_time: false
---


<div id="login-page-wrap">
  <div class="login-page-slm-card">
    <!-- header -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
      <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--cyan),var(--purple));display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <span style="font-family:var(--font-h);font-size:1.4rem;color:var(--cyan);font-weight:700;">UESL Social</span>
    </div>

    <!-- tabs -->
    <div class="login-page-slm-tabs" id="login-page-slm-tabs">
      <button class="ocs__btn login-page-slm-tab active" id="login-page-slm-tab-login" onclick="loginPage_slmSwitchTab('login')">Sign In</button>
      <button class="ocs__btn login-page-slm-tab" id="login-page-slm-tab-register" onclick="loginPage_slmSwitchTab('register')">Create Account</button>
    </div>

    <!-- LOGIN FLOW -->
    <div id="login-page-slm-login-flow">
      <div id="login-page-slm-l1">
        <div class="login-page-slm-field"><label class="login-page-slm-label">User ID</label><input class="login-page-slm-input" id="login-page-slm-uid" type="text" placeholder="your_user_id" autocomplete="username"/></div>
        <div class="login-page-slm-field"><label class="login-page-slm-label">Password</label><input class="login-page-slm-input" id="login-page-slm-pw" type="password" placeholder="••••••••" autocomplete="current-password"/></div>
        <div class="login-page-slm-err" id="login-page-slm-l1-msg" style="display:none;"></div>
        <button class="ocs__btn login-page-slm-btn" id="login-page-slm-send-otp-btn" onclick="loginPage_slmSendOtp()">Sign In</button>
      </div>
      <div id="login-page-slm-l2" style="display:none;">
        <p style="color:var(--muted);font-size:.88rem;margin-bottom:16px;">Enter the 6-digit code sent to your registered email.</p>
        <div id="login-page-slm-dev-otp-box" style="display:none;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.3);border-radius:var(--r);padding:10px 14px;margin-bottom:14px;font-size:.85rem;color:var(--cyan);">Dev mode — code: <strong id="login-page-slm-dev-otp-code" style="letter-spacing:.12rem;"></strong></div>
        <div class="login-page-slm-field"><input class="login-page-slm-input" id="login-page-slm-otp" type="text" placeholder="000000" maxlength="6" inputmode="numeric" autocomplete="one-time-code" style="text-align:center;letter-spacing:.4rem;font-size:1.4rem;"/></div>
        <div class="login-page-slm-err" id="login-page-slm-l2-msg" style="display:none;"></div>
        <button class="ocs__btn login-page-slm-btn" onclick="loginPage_slmVerifyOtp()">Verify &amp; Sign In</button>
        <button class="ocs__btn login-page-slm-btn" onclick="loginPage_slmBackToL1()" style="margin-top:8px;background:none;border:1px solid var(--border);color:var(--muted);">Back</button>
      </div>
    </div>

    <!-- REGISTER FLOW -->
    <div id="login-page-slm-register-flow" style="display:none;">
      <div id="login-page-slm-r1">
        <div class="login-page-slm-field"><label class="login-page-slm-label">Email Address</label><input class="login-page-slm-input" id="login-page-slm-r-email" type="email" placeholder="you@email.com" autocomplete="email"/></div>
        <div class="login-page-slm-err" id="login-page-slm-r1-msg" style="display:none;"></div>
        <button class="ocs__btn login-page-slm-btn" id="login-page-slm-r-send-btn" onclick="loginPage_slmSuSendOtp()">Send Verification Code</button>
      </div>
      <div id="login-page-slm-r2" style="display:none;">
        <p style="color:var(--muted);font-size:.88rem;margin-bottom:16px;">Enter the 6-digit code sent to <strong id="login-page-slm-r-otp-target" style="color:var(--text);"></strong>.</p>
        <div id="login-page-slm-r-dev-otp-box" style="display:none;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.3);border-radius:var(--r);padding:10px 14px;margin-bottom:14px;font-size:.85rem;color:var(--cyan);">Dev mode — code: <strong id="login-page-slm-r-dev-otp-code" style="letter-spacing:.12rem;"></strong></div>
        <div class="login-page-slm-field"><input class="login-page-slm-input" id="login-page-slm-r-otp" type="text" placeholder="000000" maxlength="6" inputmode="numeric" autocomplete="one-time-code" style="text-align:center;letter-spacing:.4rem;font-size:1.4rem;"/></div>
        <div class="login-page-slm-err" id="login-page-slm-r2-msg" style="display:none;"></div>
        <button class="ocs__btn login-page-slm-btn" onclick="loginPage_slmSuVerifyOtp()">Verify Code</button>
        <button class="ocs__btn login-page-slm-btn" onclick="loginPage_slmSuBackTo1()" style="margin-top:8px;background:none;border:1px solid var(--border);color:var(--muted);">Back</button>
      </div>
      <div id="login-page-slm-r3" style="display:none;">
        <p style="color:var(--muted);font-size:.82rem;margin-bottom:14px;">Verified: <span id="login-page-slm-r-verified-email" style="color:#00ff88;"></span></p>
        <div class="login-page-slm-field"><label class="login-page-slm-label">Full Name</label><input class="login-page-slm-input" id="login-page-slm-r-name" type="text" placeholder="Your Name"/></div>
        <div class="login-page-slm-field"><label class="login-page-slm-label">User ID</label><input class="login-page-slm-input" id="login-page-slm-r-uid" type="text" placeholder="choose_a_username"/></div>
        <div class="login-page-slm-field"><label class="login-page-slm-label">Age</label><input class="login-page-slm-input" id="login-page-slm-r-age" type="number" min="1" max="120" placeholder="Your age"/></div>
        <div class="login-page-slm-field" id="login-page-slm-r-parent-field" style="display:none;"><label class="login-page-slm-label">Parent / Guardian Name</label><input class="login-page-slm-input" id="login-page-slm-r-parent" type="text" placeholder="Parent or guardian name"/></div>
        <div class="login-page-slm-field"><label class="login-page-slm-label">Password (min 8 chars)</label><input class="login-page-slm-input" id="login-page-slm-r-pass" type="password" placeholder="••••••••" autocomplete="new-password"/></div>
        <div class="login-page-slm-field"><label class="login-page-slm-label">Confirm Password</label><input class="login-page-slm-input" id="login-page-slm-r-pass2" type="password" placeholder="••••••••"/></div>
        <button class="ocs__btn login-page-slm-btn" id="login-page-slm-r-create-btn" onclick="loginPage_slmSuCreate()">Create Account</button>
        <div id="login-page-slm-r3-msg" style="display:none;"></div>
      </div>
    </div>

  </div>
</div>

<script>
const _LOGIN_PAGE_AUTH = {
  PYTHON_URI: (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? `http://${location.hostname}:8424` : 'https://uesl.opencodingsociety.com',
  suEmail: '',
};

function loginPage__devMode() { return sessionStorage.getItem('devMode') === 'true'; }

function loginPage__authMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.cssText = 'display:block;padding:8px 12px;border-radius:8px;font-size:.85rem;margin-top:8px;' +
    (type === 'error'   ? 'background:rgba(255,107,107,.15);color:#ff6b6b;border:1px solid rgba(255,107,107,.3);' :
     type === 'success' ? 'background:rgba(0,255,136,.1);color:#00ff88;border:1px solid rgba(0,255,136,.25);' :
                          'background:rgba(0,212,255,.1);color:#00d4ff;border:1px solid rgba(0,212,255,.25);');
}
function loginPage__authClear(id) { const el=document.getElementById(id); if(el){el.style.display='none';el.textContent='';} }

function loginPage_slmSwitchTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('login-page-slm-tab-login').classList.toggle('active', isLogin);
  document.getElementById('login-page-slm-tab-register').classList.toggle('active', !isLogin);
  document.getElementById('login-page-slm-login-flow').style.display    = isLogin ? '' : 'none';
  document.getElementById('login-page-slm-register-flow').style.display = isLogin ? 'none' : '';
}

async function loginPage_slmSendOtp() {
  const uid = document.getElementById('login-page-slm-uid').value.trim();
  const pw  = document.getElementById('login-page-slm-pw').value;
  if (!uid || !pw) { loginPage__authMsg('login-page-slm-l1-msg','Enter your User ID and password.','error'); return; }
  const btn = document.getElementById('login-page-slm-send-otp-btn');
  btn.disabled = true; btn.textContent = 'Signing in…';
  loginPage__authClear('login-page-slm-l1-msg');
  try {
    if (loginPage__devMode()) {
      const r = await fetch(`${_LOGIN_PAGE_AUTH.PYTHON_URI}/api/authenticate`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({uid,password:pw}) });
      if (r.ok) { loginPage__authMsg('login-page-slm-l1-msg','Signed in!','success'); setTimeout(() => { window.location.href = '/'; }, 800); return; }
      const d = await r.json(); loginPage__authMsg('login-page-slm-l1-msg',d.message||'Login failed.','error'); btn.disabled=false; btn.textContent='Sign In'; return;
    }
    const r = await fetch(`${_LOGIN_PAGE_AUTH.PYTHON_URI}/api/otp/send`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({uid,password:pw}) });
    const d = await r.json();
    if (r.ok) {
      if (d.user) { loginPage__authMsg('login-page-slm-l1-msg','Signed in!','success'); setTimeout(() => { window.location.href = '/'; }, 800); }
      else {
        document.getElementById('login-page-slm-l1').style.display = 'none';
        document.getElementById('login-page-slm-l2').style.display = '';
        if (d.dev_otp) { document.getElementById('login-page-slm-dev-otp-code').textContent=d.dev_otp; document.getElementById('login-page-slm-dev-otp-box').style.display=''; }
        loginPage__authMsg('login-page-slm-l2-msg', d.message||'Code sent to your email.','info');
      }
    } else { loginPage__authMsg('login-page-slm-l1-msg',d.message||'Failed.','error'); btn.disabled=false; btn.textContent='Sign In'; }
  } catch(e) { loginPage__authMsg('login-page-slm-l1-msg','Network error — check your connection.','error'); btn.disabled=false; btn.textContent='Sign In'; }
}

async function loginPage_slmVerifyOtp() {
  const uid = document.getElementById('login-page-slm-uid').value.trim();
  const otp = document.getElementById('login-page-slm-otp').value.trim();
  if (!otp) { loginPage__authMsg('login-page-slm-l2-msg','Enter the 6-digit code.','error'); return; }
  loginPage__authMsg('login-page-slm-l2-msg','Verifying…','info');
  try {
    const r = await fetch(`${_LOGIN_PAGE_AUTH.PYTHON_URI}/api/otp/verify`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({uid,otp}) });
    const d = await r.json();
    if (r.ok) { loginPage__authMsg('login-page-slm-l2-msg','Verified!','success'); setTimeout(() => { window.location.href = '/'; }, 800); }
    else loginPage__authMsg('login-page-slm-l2-msg',d.message||'Invalid code.','error');
  } catch(e) { loginPage__authMsg('login-page-slm-l2-msg','Network error.','error'); }
}

function loginPage_slmBackToL1() {
  document.getElementById('login-page-slm-l2').style.display='none';
  document.getElementById('login-page-slm-l1').style.display='';
  document.getElementById('login-page-slm-otp').value='';
  document.getElementById('login-page-slm-dev-otp-box').style.display='none';
  const btn=document.getElementById('login-page-slm-send-otp-btn'); btn.disabled=false; btn.textContent='Sign In';
  loginPage__authClear('login-page-slm-l1-msg');
}

async function loginPage_slmSuSendOtp() {
  const email = document.getElementById('login-page-slm-r-email').value.trim();
  if (!email || !email.includes('@')) { loginPage__authMsg('login-page-slm-r1-msg','Enter a valid email address.','error'); return; }
  if (loginPage__devMode()) {
    _LOGIN_PAGE_AUTH.suEmail = email;
    loginPage__authMsg('login-page-slm-r1-msg','[Dev] OTP skipped — fill in your details.','info');
    setTimeout(() => loginPage__slmSuGoToDetails(email), 600);
    return;
  }
  const btn = document.getElementById('login-page-slm-r-send-btn');
  btn.disabled = true; btn.textContent = 'Sending…';
  loginPage__authClear('login-page-slm-r1-msg');
  try {
    const r = await fetch(`${_LOGIN_PAGE_AUTH.PYTHON_URI}/api/otp/signup/send`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email}) });
    const d = await r.json();
    if (r.ok) {
      _LOGIN_PAGE_AUTH.suEmail = email;
      document.getElementById('login-page-slm-r-otp-target').textContent = email;
      if (d.dev_otp) { document.getElementById('login-page-slm-r-dev-otp-code').textContent=d.dev_otp; document.getElementById('login-page-slm-r-dev-otp-box').style.display=''; }
      document.getElementById('login-page-slm-r1').style.display = 'none';
      document.getElementById('login-page-slm-r2').style.display = '';
    } else { loginPage__authMsg('login-page-slm-r1-msg', d.message||'Failed to send code.','error'); btn.disabled=false; btn.textContent='Send Verification Code'; }
  } catch(e) { loginPage__authMsg('login-page-slm-r1-msg','Network error — check your connection.','error'); btn.disabled=false; btn.textContent='Send Verification Code'; }
}

async function loginPage_slmSuVerifyOtp() {
  const otp = document.getElementById('login-page-slm-r-otp').value.trim();
  if (!otp) { loginPage__authMsg('login-page-slm-r2-msg','Enter the 6-digit code.','error'); return; }
  loginPage__authMsg('login-page-slm-r2-msg','Verifying…','info');
  try {
    const r = await fetch(`${_LOGIN_PAGE_AUTH.PYTHON_URI}/api/otp/signup/verify`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:_LOGIN_PAGE_AUTH.suEmail, otp}) });
    const d = await r.json();
    if (r.ok) loginPage__slmSuGoToDetails(_LOGIN_PAGE_AUTH.suEmail);
    else loginPage__authMsg('login-page-slm-r2-msg', d.message||'Invalid code.','error');
  } catch(e) { loginPage__authMsg('login-page-slm-r2-msg','Network error.','error'); }
}

function loginPage_slmSuBackTo1() {
  document.getElementById('login-page-slm-r2').style.display='none';
  document.getElementById('login-page-slm-r1').style.display='';
  document.getElementById('login-page-slm-r-otp').value='';
  document.getElementById('login-page-slm-r-dev-otp-box').style.display='none';
  const btn=document.getElementById('login-page-slm-r-send-btn'); btn.disabled=false; btn.textContent='Send Verification Code';
  loginPage__authClear('login-page-slm-r1-msg');
}

function loginPage__slmSuGoToDetails(email) {
  document.getElementById('login-page-slm-r-verified-email').textContent = email;
  document.getElementById('login-page-slm-r2').style.display = 'none';
  document.getElementById('login-page-slm-r3').style.display = '';
}

document.addEventListener('DOMContentLoaded', function() {
  const ageInput = document.getElementById('login-page-slm-r-age');
  if (ageInput) ageInput.addEventListener('input', loginPage_slmToggleParent);
  if (new URLSearchParams(location.search).get('tab') === 'register') loginPage_slmSwitchTab('register');
});

function loginPage_slmToggleParent() {
  const age = parseInt(document.getElementById('login-page-slm-r-age').value, 10);
  document.getElementById('login-page-slm-r-parent-field').style.display = (!isNaN(age) && age < 18) ? '' : 'none';
}

async function loginPage_slmSuCreate() {
  const name   = document.getElementById('login-page-slm-r-name').value.trim();
  const uid    = document.getElementById('login-page-slm-r-uid').value.trim();
  const age    = parseInt(document.getElementById('login-page-slm-r-age').value, 10);
  const parentEl = document.getElementById('login-page-slm-r-parent');
  const parent = parentEl ? parentEl.value.trim() : '';
  const pw     = document.getElementById('login-page-slm-r-pass').value;
  const pw2    = document.getElementById('login-page-slm-r-pass2').value;

  if (!name) { loginPage__authMsg('login-page-slm-r3-msg','Full name is required.','error'); return; }
  if (!uid)  { loginPage__authMsg('login-page-slm-r3-msg','User ID is required.','error'); return; }
  if (isNaN(age) || age < 1) { loginPage__authMsg('login-page-slm-r3-msg','Enter a valid age.','error'); return; }
  if (age < 18 && !parent) { loginPage__authMsg('login-page-slm-r3-msg','Parent/guardian name is required for users under 18.','error'); return; }
  if (!pw || pw.length < 8) { loginPage__authMsg('login-page-slm-r3-msg','Password must be at least 8 characters.','error'); return; }
  if (pw !== pw2) { loginPage__authMsg('login-page-slm-r3-msg','Passwords do not match.','error'); return; }

  const btn = document.getElementById('login-page-slm-r-create-btn');
  btn.disabled = true; btn.textContent = 'Creating account…';
  loginPage__authMsg('login-page-slm-r3-msg','Creating account…','info');

  try {
    const body = { name, uid, password: pw, email: _LOGIN_PAGE_AUTH.suEmail, age };
    if (age < 18 && parent) body.parent = parent;
    const r = await fetch(`${_LOGIN_PAGE_AUTH.PYTHON_URI}/api/user`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    const d = await r.json();
    if (r.ok) {
      loginPage__authMsg('login-page-slm-r3-msg','Account created. Sign in with your new account.','success');
      setTimeout(() => { loginPage_slmSwitchTab('login'); document.getElementById('login-page-slm-uid').value = uid; }, 1000);
    } else { loginPage__authMsg('login-page-slm-r3-msg', d.message||'Failed to create account.','error'); btn.disabled=false; btn.textContent='Create Account'; }
  } catch(e) { loginPage__authMsg('login-page-slm-r3-msg','Network error — check your connection.','error'); btn.disabled=false; btn.textContent='Create Account'; }
}
</script>
