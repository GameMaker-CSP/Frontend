---
layout: uesl-builder
builder_kind: racing
builder_label: Racing
title: Car Racing Builder
description: Build and race custom cars on custom tracks
permalink: /car-racing-builder
---

<div class="ocs__builder-workbench-header">
  <div><h1>Racing</h1><p>Tune your car, choose a track and take it for a spin.</p></div>
  <button type="button" class="ocs__btn" data-toggle-setup aria-expanded="true" aria-controls="col-asset">Hide setup</button>
</div>

<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>

<!-- ══════════════════════════════════════════════════════════════════════
     MAIN LAYOUT  (reuses GameBuilder CSS classes)
═══════════════════════════════════════════════════════════════════════ -->
<div class="creator-layout">

  <!-- ── Left panel ──────────────────────────────────────────────────── -->
  <div class="col-asset" id="col-asset">
    <div class="glass-panel creator-panel">

      <!-- panel header buttons -->
      <div class="panel-header">
        <span>Car Config</span>
        <div class="panel-controls">
          <button id="crb-btn-confirm"  class="icon-btn" data-tooltip="Confirm &amp; Apply" aria-label="Confirm &amp; Apply">✓</button>
          <button id="crb-btn-refresh"  class="icon-btn" data-tooltip="Reset to defaults" aria-label="Reset to defaults">⟳</button>
          <button id="crb-btn-help"     class="icon-btn" data-tooltip="Help" aria-label="Help">?</button>
        </div>
      </div>

      <!-- help panel -->
      <div class="help-panel" id="crb-help-panel" style="display:none;">
        <strong>How to race:</strong><br>
        1. Design your car (body, color, decals)<br>
        2. Set performance stats with sliders<br>
        3. Choose race settings (track, laps, weather)<br>
        4. Click Run race or Confirm<br><br>
        <strong>Controls:</strong><br>
        Arrow keys / WASD = steer<br>
        Space = handbrake (drift!)<br>
        Shift = nitro boost (2s)<br><br>
        <strong>Tip:</strong> Edit the code panel to add custom race events!
      </div>

      <!-- scrollable form -->
      <div class="scroll-form">

        <!-- ── 1. CAR BUILDER ──────────────────────────────────────── -->
        <div class="asset-group">
          <div class="group-title">CAR BUILDER</div>

          <label for="crb-car-name">Car Name</label>
          <input type="text" id="crb-car-name" value="My Racer" placeholder="Name your car...">

          <label for="crb-body-kit">Body Kit</label>
          <select id="crb-body-kit">
            <option value="stock">🏎️ Stock</option>
            <option value="sedan">🚗 Sedan</option>
            <option value="suv">🚙 SUV</option>
            <option value="formula">🏁 Formula</option>
            <option value="pickup">🛻 Pickup</option>
            <option value="muscle">🚓 Muscle</option>
          </select>

          <label>Colors</label>
          <div class="color-row">
            <label for="crb-color-primary">Primary</label>
            <input type="color" id="crb-color-primary" value="#6366f1">
            <label for="crb-color-secondary">Secondary</label>
            <input type="color" id="crb-color-secondary" value="#f59e0b">
          </div>

          <label for="crb-wheel-style">Wheel Style</label>
          <select id="crb-wheel-style">
            <option value="stock">🔵 Stock</option>
            <option value="sport">⚫ Sport</option>
            <option value="slick">🔴 Racing Slicks</option>
            <option value="offroad">⚪ Off-Road</option>
            <option value="chrome">🟡 Chrome</option>
          </select>

          <label for="crb-decal">Decal</label>
          <select id="crb-decal">
            <option value="none">None</option>
            <option value="flames">Flames 🔥</option>
            <option value="lightning">Lightning ⚡</option>
            <option value="stripes">Stripes</option>
            <option value="stars">Stars ⭐</option>
            <option value="camo">Camo</option>
          </select>
        </div>

        <!-- ── 2. PERFORMANCE STATS ────────────────────────────────── -->
        <div class="asset-group">
          <div class="group-title">PERFORMANCE STATS</div>
          <div class="stat-bar">
            <div class="stat-row">
              <label for="stat-speed">Speed</label>
              <input type="range" class="crb-stat" id="stat-speed"        min="1" max="10" value="5">
              <span class="stat-val" id="val-speed">5</span>
            </div>
            <div class="stat-row">
              <label for="stat-accel">Acceleration</label>
              <input type="range" class="crb-stat" id="stat-accel"        min="1" max="10" value="5">
              <span class="stat-val" id="val-accel">5</span>
            </div>
            <div class="stat-row">
              <label for="stat-handling">Handling</label>
              <input type="range" class="crb-stat" id="stat-handling"     min="1" max="10" value="5">
              <span class="stat-val" id="val-handling">5</span>
            </div>
            <div class="stat-row">
              <label for="stat-braking">Braking</label>
              <input type="range" class="crb-stat" id="stat-braking"      min="1" max="10" value="5">
              <span class="stat-val" id="val-braking">5</span>
            </div>
            <div class="stat-row">
              <label for="stat-aero">Aerodynamics</label>
              <input type="range" class="crb-stat" id="stat-aero"         min="1" max="10" value="5">
              <span class="stat-val" id="val-aero">5</span>
            </div>
            <div class="stat-row">
              <label for="stat-grip">Tire Grip</label>
              <input type="range" class="crb-stat" id="stat-grip"         min="1" max="10" value="5">
              <span class="stat-val" id="val-grip">5</span>
            </div>
          </div>
          <div class="power-rating">
            <div class="pr-label">Power Rating</div>
            <div class="pr-score" id="crb-power-score">300</div>
            <div class="pr-max">/ 600</div>
          </div>
        </div>

        <!-- ── 3. ENGINE & TIRES ───────────────────────────────────── -->
        <div class="asset-group">
          <div class="group-title">ENGINE &amp; TIRES</div>

          <label for="crb-engine">Engine</label>
          <select id="crb-engine">
            <option value="stock4">🔧 Stock 4-Cyl</option>
            <option value="turbo4">⚡ Turbo 4-Cyl</option>
            <option value="v6">🔥 V6 Sport</option>
            <option value="v8">💨 V8 Muscle</option>
            <option value="v12">🚀 V12 Hypercar</option>
            <option value="electric">⚡ Electric Motor</option>
          </select>

          <label for="crb-tires">Tires</label>
          <select id="crb-tires">
            <option value="allseason">🟤 All Season</option>
            <option value="sport">🔵 Sport Compound</option>
            <option value="slick">🔴 Racing Slick</option>
            <option value="offroad">⛰️ Off-Road</option>
            <option value="wet">🌧️ Wet Weather</option>
          </select>
        </div>

        <!-- ── 4. RACE SETTINGS ────────────────────────────────────── -->
        <div class="asset-group">
          <div class="group-title">RACE SETTINGS</div>

          <label for="crb-track">Track</label>
          <select id="crb-track">
            <option value="city_sprint">🏁 City Sprint</option>
            <option value="mountain_pass">🌄 Mountain Pass</option>
            <option value="desert_dash">🏜️ Desert Dash</option>
            <option value="coastal_circuit">🌊 Coastal Circuit</option>
            <option value="forest_rally">🌲 Forest Rally</option>
            <option value="night_circuit">🌙 Night Circuit</option>
          </select>

          <label for="crb-laps">Laps</label>
          <input type="number" id="crb-laps" min="1" max="20" value="3">

          <label for="crb-opponents">AI Opponents</label>
          <input type="number" id="crb-opponents" min="0" max="7" value="3">

          <label for="crb-difficulty">AI Difficulty</label>
          <select id="crb-difficulty">
            <option value="rookie">🐢 Rookie</option>
            <option value="amateur">🚗 Amateur</option>
            <option value="pro">🏎️ Pro</option>
            <option value="legend">💀 Legend</option>
          </select>

          <label for="crb-weather">Weather</label>
          <select id="crb-weather">
            <option value="clear">☀️ Clear</option>
            <option value="rain">🌧️ Rain</option>
            <option value="snow">❄️ Snow</option>
            <option value="fog">🌫️ Fog</option>
          </select>
        </div>

        <!-- ── 5. UPGRADES / GARAGE ───────────────────────────────── -->
        <div class="asset-group">
          <div class="group-title">UPGRADES / GARAGE</div>
          <div class="crb-xp-label">XP: <span id="crb-xp-cur">0</span> / <span id="crb-xp-next">100</span></div>
          <div class="crb-xp-bar-wrap">
            <div class="crb-xp-bar" id="crb-xp-bar" style="width:0%"></div>
          </div>
          <div class="crb-badges" id="crb-badges">
            🏆 0 wins &nbsp;|&nbsp; ⭐ 0 stars &nbsp;|&nbsp; 🔓 0 unlocks
          </div>
          <button class="draw-btn draw-btn-danger" id="crb-reset-garage" style="margin-top:8px;">Reset Garage</button>
        </div>

        <!-- ── MULTIPLAYER ─────────────────────────────────────────── -->
        <div class="asset-group">
          <div class="group-title">MULTIPLAYER</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="draw-btn" id="crb-host-btn" style="flex:1">📡 Host Race</button>
            <button class="draw-btn" id="crb-join-btn" style="flex:1">🔗 Join Race</button>
          </div>
          <label for="crb-room-code">Room code</label>
          <input type="text" id="crb-room-code" placeholder="Room code…" style="margin-top:6px;">
          <div id="crb-mp-status" style="font-size:0.68rem;color:#64748b;margin-top:4px;">Not connected</div>
        </div>

      </div><!-- /scroll-form -->
    </div><!-- /glass-panel creator-panel -->
  </div><!-- /col-asset -->

  <!-- ── Right panel ─────────────────────────────────────────────────── -->
  <div class="col-main view-split" id="crb-col-main">

    <!-- view controls -->
    <div class="view-controls">
      <button class="view-btn" id="crb-view-game" aria-pressed="false">Game</button>
      <button class="view-btn" id="crb-view-code" aria-pressed="false">Code</button>
      <button class="view-btn active" id="crb-view-split" aria-pressed="true">Split</button>
      <div class="uesl-builder-run-controls">
        <span id="crb-run-status" class="ocs__builder-status" role="status">Ready</span>
        <button id="crb-btn-race" type="button" class="ocs__btn accent fill">Run race</button>
        <button id="crb-btn-stop" type="button" class="ocs__btn" disabled>Stop race</button>
      </div>
    </div>

    <div class="main-content">
    <!-- game panel -->
    <div class="glass-panel panel-game">
      <div class="panel-header"><span>Game preview</span><span class="ocs__builder-hint">WASD / arrows · Shift: boost</span></div>
      <div class="race-frame">
      <!-- HUD overlay -->
      <div class="race-hud" id="race-hud">
        <div class="race-hud-item hud-speed" id="hud-speed">🚗 0 km/h</div>
        <div class="race-hud-item hud-lap"   id="hud-lap">Lap 0 / 3</div>
        <div class="race-hud-item hud-pos"   id="hud-pos">P1</div>
        <div class="race-hud-item hud-nitro">
          ⚡
          <div class="hud-nitro-bar-wrap">
            <div class="hud-nitro-bar" id="hud-nitro-bar" style="width:100%"></div>
          </div>
        </div>
        <canvas id="crb-minimap" class="minimap-canvas" width="120" height="90"></canvas>
        <!-- pre-race track preview banner -->
        <div class="crb-preview" id="crb-preview" style="display:none;">
          <div class="crb-preview-box">
            <div class="crb-preview-label">Get Ready</div>
            <div class="crb-preview-track" id="crb-preview-track">City Sprint</div>
            <div class="crb-preview-sub">Find your car on the track ↓</div>
          </div>
          <div class="crb-preview-arrow"></div>
        </div>
        <!-- countdown -->
        <div class="crb-countdown" id="crb-countdown">
          <div class="crb-countdown-num" id="crb-countdown-num">3</div>
        </div>
        <!-- results -->
        <div class="crb-results" id="crb-results">
          <h2 id="crb-res-title">🏆 Race Complete!</h2>
          <div class="res-table" id="crb-res-table"></div>
          <div class="xp-gained" id="crb-xp-gained">+0 XP</div>
          <button id="crb-res-close" class="ocs__btn" type="button">Play Again</button>
        </div>
      </div>
      <canvas id="race-canvas" width="900" height="580" aria-label="Racing game preview"></canvas>
      </div><!-- /race-frame -->
    </div><!-- /panel-game -->

    <!-- code panel -->
    <div class="glass-panel code-panel panel-code">
      <div class="panel-header">
        <span>Race code</span>
      </div>
      <div class="editor-container">
      <textarea aria-label="Racing game code" id="code-editor" class="code-layer" spellcheck="false">// 🏎️ Car Racing Builder — Custom Race Script
// Edit this code to customize your race experience!

// Called once when the race starts
function onRaceStart(race) {
  // race.cars  = array of all cars
  // race.track = current track data
  console.log('Race started on: ' + race.track.name);
}

// Called every frame during the race (~60 fps)
function onRaceUpdate(race, delta) {
  // race.playerCar = your car object
  // race.aiCars    = array of AI competitor objects
  // race.lap       = current lap number
  // Add boost zones, weather changes, custom events here!
}

// Called when any car completes a lap
function onLapComplete(car, lapNumber) {
  if (car.isPlayer) {
    console.log('Lap ' + lapNumber + ' complete!');
    // Give a small nitro boost on lap completion
    car.nitro = Math.min(car.nitro + 30, 100);
  }
}

// Called when the race ends
function onRaceEnd(results) {
  // results.winner    = the winning car object
  // results.times     = array of finish times (ms)
  // results.positions = ordered array of cars
  console.log('Winner: ' + results.winner.name);
}

// --- EXAMPLES ---

// Add a boost zone at (400, 200) with radius 50 — cars get 1.5x speed for 3s:
// race.addBoostZone({ x: 400, y: 200, radius: 50, multiplier: 1.5, duration: 3000 });

// Trigger an oil slick at (300, 350) — reduces grip for 4s:
// race.addHazard({ x: 300, y: 350, radius: 30, type: 'oil', duration: 4000 });

// Give the player unlimited nitro for 5 seconds:
// function onRaceStart(race) { setInterval(() => { race.playerCar.nitro = 100; }, 100); }
</textarea>
      </div>
    </div>
    </div><!-- /main-content -->

  </div><!-- /col-main -->
</div><!-- /creator-layout -->

<!-- ══════════════════════════════════════════════════════════════════════
     RACING ENGINE
═══════════════════════════════════════════════════════════════════════ -->
<script type="module" src="{{ site.baseurl }}/projects/systems/racing/js/app.js"></script>
