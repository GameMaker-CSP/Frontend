---
layout: ocs-account
title: Login
permalink: /login
search_exclude: true
show_reading_time: false
---


<div id="login-page-wrap">
  <div class="ocs__card ocs__stack">
    <!-- OCS account form controls -->
    <div class="ocs__links" id="login-page-slm-tabs">
      <button class="ocs__btn accent fill" aria-pressed="true" id="login-page-slm-tab-login" onclick="loginPage_slmSwitchTab('login')">Sign In</button>
      <button class="ocs__btn accent" aria-pressed="false" id="login-page-slm-tab-register" onclick="loginPage_slmSwitchTab('register')">Create Account</button>
    </div>

    <!-- LOGIN FLOW -->
    <div id="login-page-slm-login-flow">
      <div class="ocs__stack" id="login-page-slm-l1">
        <div class="ocs__field"><label class="ocs__label" for="login-page-slm-uid">User ID</label><input class="ocs__input" id="login-page-slm-uid" type="text" placeholder="your_user_id" autocomplete="username"/></div>
        <div class="ocs__field"><label class="ocs__label" for="login-page-slm-pw">Password</label><input class="ocs__input" id="login-page-slm-pw" type="password" placeholder="••••••••" autocomplete="current-password"/></div>
        <div class="ocs__callout" id="login-page-slm-l1-msg" hidden></div>
        <button class="ocs__btn" id="login-page-slm-send-otp-btn" onclick="loginPage_slmSendOtp()">Sign In</button>
      </div>
      <div class="ocs__stack" id="login-page-slm-l2" hidden>
        <p>Enter the 6-digit code sent to your registered email.</p>
        <div id="login-page-slm-dev-otp-box" hidden>Dev mode — code: <strong id="login-page-slm-dev-otp-code"></strong></div>
        <div class="ocs__field"><input class="ocs__input" id="login-page-slm-otp" type="text" placeholder="000000" maxlength="6" inputmode="numeric" autocomplete="one-time-code"/></div>
        <div class="ocs__callout" id="login-page-slm-l2-msg" hidden></div>
        <button class="ocs__btn" onclick="loginPage_slmVerifyOtp()">Verify &amp; Sign In</button>
        <button class="ocs__btn" onclick="loginPage_slmBackToL1()">Back</button>
      </div>
    </div>

    <!-- REGISTER FLOW -->
    <div id="login-page-slm-register-flow" hidden>
      <div class="ocs__stack" id="login-page-slm-r1">
        <div class="ocs__field"><label class="ocs__label" for="login-page-slm-r-email">Email Address</label><input class="ocs__input" id="login-page-slm-r-email" type="email" placeholder="you@email.com" autocomplete="email"/></div>
        <div class="ocs__callout" id="login-page-slm-r1-msg" hidden></div>
        <button class="ocs__btn" id="login-page-slm-r-send-btn" onclick="loginPage_slmSuSendOtp()">Send Verification Code</button>
      </div>
      <div class="ocs__stack" id="login-page-slm-r2" hidden>
        <p>Enter the 6-digit code sent to <strong id="login-page-slm-r-otp-target"></strong>.</p>
        <div id="login-page-slm-r-dev-otp-box" hidden>Dev mode — code: <strong id="login-page-slm-r-dev-otp-code"></strong></div>
        <div class="ocs__field"><input class="ocs__input" id="login-page-slm-r-otp" type="text" placeholder="000000" maxlength="6" inputmode="numeric" autocomplete="one-time-code"/></div>
        <div class="ocs__callout" id="login-page-slm-r2-msg" hidden></div>
        <button class="ocs__btn" onclick="loginPage_slmSuVerifyOtp()">Verify Code</button>
        <button class="ocs__btn" onclick="loginPage_slmSuBackTo1()">Back</button>
      </div>
      <div class="ocs__stack" id="login-page-slm-r3" hidden>
        <p>Verified: <span id="login-page-slm-r-verified-email"></span></p>
        <div class="ocs__field"><label class="ocs__label" for="login-page-slm-r-name">Display name</label><input class="ocs__input" id="login-page-slm-r-name" type="text" placeholder="Name you want to use"/></div>
        <div class="ocs__field"><label class="ocs__label" for="login-page-slm-r-uid">User ID</label><input class="ocs__input" id="login-page-slm-r-uid" type="text" placeholder="choose_a_username"/></div>
        <div class="ocs__field"><label class="ocs__label" for="login-page-slm-r-age">Age</label><input class="ocs__input" id="login-page-slm-r-age" type="number" min="1" max="120" placeholder="Your age"/></div>
        <div class="ocs__field" id="login-page-slm-r-parent-field" hidden><label class="ocs__label" for="login-page-slm-r-parent">Parent / Guardian Name</label><input class="ocs__input" id="login-page-slm-r-parent" type="text" placeholder="Parent or guardian name"/></div>
        <div class="ocs__field"><label class="ocs__label" for="login-page-slm-r-pass">Password (min 8 chars)</label><input class="ocs__input" id="login-page-slm-r-pass" type="password" placeholder="••••••••" autocomplete="new-password"/></div>
        <div class="ocs__field"><label class="ocs__label" for="login-page-slm-r-pass2">Confirm Password</label><input class="ocs__input" id="login-page-slm-r-pass2" type="password" placeholder="••••••••"/></div>
        <button class="ocs__btn" id="login-page-slm-r-create-btn" onclick="loginPage_slmSuCreate()">Create Account</button>
        <div id="login-page-slm-r3-msg" hidden></div>
      </div>
    </div>

  </div>
</div>

<script type="module">
import { pythonURI, baseurl, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
import { signedInDestination } from '{{ site.baseurl }}/assets/js/profile/account-session.js';

async function loginPage_afterSignIn() {
  try {
    location.replace(await signedInDestination({ pythonURI, fetchOptions, baseurl }));
  } catch (error) {
    // Authentication succeeded; profile settings can show and retry a survey error.
    location.replace(`${baseurl}/profile`);
  }
}

// A signed-in visitor manages their account on Profile, outside the login form.
fetch(`${pythonURI}/api/id`, { ...fetchOptions, cache: 'no-store' })
  .then(response => { if (response.ok) location.replace(`${baseurl}/profile`); })
  .catch(() => {});

const _LOGIN_PAGE_AUTH = {
  PYTHON_URI: pythonURI,
  suEmail: '',
};

function loginPage__devMode() { return sessionStorage.getItem('devMode') === 'true'; }

function loginPage__authMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.hidden = false;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');

}
function loginPage__authClear(id) { const el=document.getElementById(id); if(el){el.hidden = true;el.textContent='';} }

function loginPage_slmSwitchTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('login-page-slm-tab-login').classList.toggle('fill', isLogin);
  document.getElementById('login-page-slm-tab-login').setAttribute('aria-pressed', String(isLogin));
  document.getElementById('login-page-slm-tab-register').classList.toggle('fill', !isLogin);
  document.getElementById('login-page-slm-tab-register').setAttribute('aria-pressed', String(!isLogin));
  document.getElementById('login-page-slm-login-flow').hidden = !isLogin;
  document.getElementById('login-page-slm-register-flow').hidden = isLogin;
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
      if (r.ok) { loginPage__authMsg('login-page-slm-l1-msg','Signed in!','success'); await loginPage_afterSignIn(); return; }
      const d = await r.json(); loginPage__authMsg('login-page-slm-l1-msg',d.message||'Login failed.','error'); btn.disabled=false; btn.textContent='Sign In'; return;
    }
    const r = await fetch(`${_LOGIN_PAGE_AUTH.PYTHON_URI}/api/otp/send`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({uid,password:pw}) });
    const d = await r.json();
    if (r.ok) {
      if (d.user) { loginPage__authMsg('login-page-slm-l1-msg','Signed in!','success'); await loginPage_afterSignIn(); }
      else {
        document.getElementById('login-page-slm-l1').hidden = true;
        document.getElementById('login-page-slm-l2').hidden = false;
        if (d.dev_otp) { document.getElementById('login-page-slm-dev-otp-code').textContent=d.dev_otp; document.getElementById('login-page-slm-dev-otp-box').hidden = false; }
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
    if (r.ok) { loginPage__authMsg('login-page-slm-l2-msg','Verified!','success'); await loginPage_afterSignIn(); }
    else loginPage__authMsg('login-page-slm-l2-msg',d.message||'Invalid code.','error');
  } catch(e) { loginPage__authMsg('login-page-slm-l2-msg','Network error.','error'); }
}

function loginPage_slmBackToL1() {
  document.getElementById('login-page-slm-l2').hidden = true;
  document.getElementById('login-page-slm-l1').hidden = false;
  document.getElementById('login-page-slm-otp').value='';
  document.getElementById('login-page-slm-dev-otp-box').hidden = true;
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
      if (d.dev_otp) { document.getElementById('login-page-slm-r-dev-otp-code').textContent=d.dev_otp; document.getElementById('login-page-slm-r-dev-otp-box').hidden = false; }
      document.getElementById('login-page-slm-r1').hidden = true;
      document.getElementById('login-page-slm-r2').hidden = false;
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
  document.getElementById('login-page-slm-r2').hidden = true;
  document.getElementById('login-page-slm-r1').hidden = false;
  document.getElementById('login-page-slm-r-otp').value='';
  document.getElementById('login-page-slm-r-dev-otp-box').hidden = true;
  const btn=document.getElementById('login-page-slm-r-send-btn'); btn.disabled=false; btn.textContent='Send Verification Code';
  loginPage__authClear('login-page-slm-r1-msg');
}

function loginPage__slmSuGoToDetails(email) {
  document.getElementById('login-page-slm-r-verified-email').textContent = email;
  document.getElementById('login-page-slm-r2').hidden = true;
  document.getElementById('login-page-slm-r3').hidden = false;
}

document.addEventListener('DOMContentLoaded', function() {
  const ageInput = document.getElementById('login-page-slm-r-age');
  if (ageInput) ageInput.addEventListener('input', loginPage_slmToggleParent);
  if (new URLSearchParams(location.search).get('tab') === 'register') loginPage_slmSwitchTab('register');
});

function loginPage_slmToggleParent() {
  const age = parseInt(document.getElementById('login-page-slm-r-age').value, 10);
  document.getElementById('login-page-slm-r-parent-field').hidden = !(!isNaN(age) && age < 18);
}

async function loginPage_slmSuCreate() {
  const name   = document.getElementById('login-page-slm-r-name').value.trim();
  const uid    = document.getElementById('login-page-slm-r-uid').value.trim();
  const age    = parseInt(document.getElementById('login-page-slm-r-age').value, 10);
  const parentEl = document.getElementById('login-page-slm-r-parent');
  const parent = parentEl ? parentEl.value.trim() : '';
  const pw     = document.getElementById('login-page-slm-r-pass').value;
  const pw2    = document.getElementById('login-page-slm-r-pass2').value;

  if (!name) { loginPage__authMsg('login-page-slm-r3-msg','Display name is required.','error'); return; }
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

Object.assign(window, { loginPage__devMode, loginPage__authMsg, loginPage__authClear, loginPage_slmSwitchTab, loginPage_slmSendOtp, loginPage_slmVerifyOtp, loginPage_slmBackToL1, loginPage_slmSuSendOtp, loginPage_slmSuVerifyOtp, loginPage_slmSuBackTo1, loginPage__slmSuGoToDetails, loginPage_slmToggleParent, loginPage_slmSuCreate });
document.getElementById('login-page-slm-l1').addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); loginPage_slmSendOtp(); }
});
</script>
