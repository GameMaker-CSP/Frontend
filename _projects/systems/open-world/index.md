---
layout: uesl-builder
builder_kind: open-world
builder_label: Open World
title: GameBuilder
description: Helping programmers understand how to create a game
permalink: /gamebuilderv1-2
---

<div class="ocs__builder-workbench-header">
  <div><h1>Open World</h1><p>Choose your world, add characters and build each level.</p></div>
  <button type="button" class="ocs__btn" data-toggle-setup aria-expanded="true" aria-controls="col-asset">Hide setup</button>
</div>

<!-- Ensure GameTemplatesV1_1 is available as a global by loading templates.js -->
<script src="{{ site.baseurl }}/projects/systems/open-world/js/load-templates.js"></script>

<!-- MediaPipe + Face Tracker + Socket.IO -->
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js" crossorigin="anonymous"></script>
<script src="{{ site.baseurl }}/assets/js/face-tracker.js"></script>
<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>

<!-- main builder layout: left (assets) + right (code and game) -->
<div class="creator-layout">
    <div class="col-asset" id="col-asset">
        <!-- Drag this handle to resize the left panel -->
        <div id="left-panel-resize" title="Drag to resize panel"></div>
        <!-- assets panel: background, player, NPCs, and walls inputs -->
        <div class="glass-panel creator-panel" style="position: relative;">
            <div class="panel-header">
                <span>Assets</span>
                <div class="panel-controls">
                    <span class="step-indicator" id="step-indicator-mini">Step 1/2</span>
                    <button id="btn-confirm" class="icon-btn" data-tooltip="Confirm Step" aria-label="Confirm Step">✓</button>
                    <button id="btn-refresh-assets" class="icon-btn" data-tooltip="Refresh Assets" aria-label="Refresh Assets">⟳</button>
                    <button id="btn-help" class="icon-btn" data-tooltip="Help" aria-label="Help">?</button>
                </div>
            </div>
            <!-- help panel: shows step-by-step guidance and tips -->
            <div class="help-panel" id="help-panel">
                <strong>Steps:</strong><br>
                1. Background - Select environment<br>
                2. Player - Configure character<br>
                3. Freestyle - Add NPCs, Walls, etc<br><br>
                <strong>Tips:</strong> Draw red barriers directly on the game view. Barriers collide. Walls are visible in-game by default; use the Walls toggle to hide them while testing.
            </div>
            <!-- level tabs: switch between saved levels -->
            <div class="level-tabs-bar" id="level-tabs-bar">
                <!-- tabs rendered by JS -->
            </div>
            <!-- scrollable form: asset configuration sections -->
            <div class="scroll-form">
                <div class="asset-group">
                    <!-- environment selection and upload instructions -->
                    <div class="group-title">ENVIRONMENT</div>
                    <label for="bg-select">Background Selection</label>
                    <select id="bg-select">
                        <option value="" selected disabled>Select background…</option>
                        <option value="desert">🏜️ Desert Dunes</option>
                        <option value="alien">👽 Alien Planet</option>
                        <option value="maze">🟩 Maze Classic</option>
                        <option value="maze2">🟣 Maze v2 — Cyber Space</option>
                    </select>
                    <div class="upload-instructions" style="margin-top:6px;">
                        <button id="bg-instructions-btn" class="btn btn-sm">Upload Instructions ▸</button>
                        <div id="bg-instructions-panel" class="instructions-panel" style="display:none; font-size:0.75em; margin-top:6px;">
                            To add your own backgrounds, place files under <code>_projects/systems/open-world/images/bg</code> and then press the Refresh Assets button. See <a href="{{ site.baseurl }}/gamebuilderv1-2/doc" target="_blank" rel="noopener noreferrer">upload instructions</a>.
                            <div style="margin-top:4px;">Backgrounds json: <a href="{{ site.baseurl }}/images/gamebuilder/bg/index.json" target="_blank" rel="noopener noreferrer">images/gamebuilder/bg/index.json</a></div>
                        </div>
                    </div>
                </div>
                <div class="asset-group">
                    <!-- player configuration: name, sprite, position, controls, advanced settings -->
                    <div class="group-title">PLAYER</div>
                    <label for="player-name">Name</label>
                    <input type="text" id="player-name" value="" placeholder="Player name">
                    <label for="player-select">Sprite</label>
                    <select id="player-select">
                        <option value="" selected disabled>Select sprite…</option>
                        <optgroup label="Adventure">
                        <option value="chillguy">😎 Chill Guy</option>
                        <option value="tux">🐧 Tux</option>
                        <option value="r2d2">🤖 R2-D2</option>
                        <option value="octocat">🐙 Octocat</option>
                        <option value="robot">🦾 Robot</option>
                        </optgroup>
                        <optgroup label="Superheroes">
                        <option value="ironman">🦸 Iron Man</option>
                        <option value="spiderman">🕷️ Spider-Man</option>
                        <option value="captain_america">🛡️ Captain America</option>
                        <option value="batman">🦇 Batman</option>
                        <option value="superman">💪 Superman</option>
                        <option value="wonder_woman">⚡ Wonder Woman</option>
                        <option value="thor">🔨 Thor</option>
                        </optgroup>
                        <optgroup label="Pokémon">
                        <option value="pikachu">⚡ Pikachu</option>
                        <option value="charizard">🔥 Charizard</option>
                        <option value="mewtwo">🔮 Mewtwo</option>
                        <option value="eevee">🦊 Eevee</option>
                        <option value="gengar">👻 Gengar</option>
                        <option value="lucario">💙 Lucario</option>
                        </optgroup>
                    </select>
                    <div class="upload-instructions" style="margin-top:6px;">
                        <button id="sprite-instructions-btn" class="btn btn-sm">Upload Instructions ▸</button>
                        <div id="sprite-instructions-panel" class="instructions-panel" style="display:none; font-size:0.75em; margin-top:6px;">
                            To add your own spritesheets, place files under <code>_projects/systems/open-world/images/sprites</code> (and set rows/cols in index.json). Then press Refresh Assets. See <a href="{{ site.baseurl }}/gamebuilderv1-2/doc" target="_blank" rel="noopener noreferrer">upload instructions</a>.
                            <div style="margin-top:4px;">Sprites json: <a href="{{ site.baseurl }}/images/gamebuilder/sprites/index.json" target="_blank" rel="noopener noreferrer">images/gamebuilder/sprites/index.json</a></div>
                        </div>
                    </div>
                    <label for="player-x">X Position</label>
                    <input type="range" id="player-x" min="0" max="800" value="100">
                    <label for="player-y">Y Position</label>
                    <input type="range" id="player-y" min="0" max="600" value="300">
                    <label style="display:flex;justify-content:space-between;align-items:center;">
                      Speed <span id="player-speed-val" style="font-size:0.78rem;color:#a5b4fc;font-weight:600;">5</span>
                    </label>
                    <input type="range" id="player-speed" min="1" max="10" step="1" value="5">
                    <label for="movement-keys">Movement Keys</label>
                    <select id="movement-keys">
                        <option value="" selected disabled>Select keys…</option>
                        <option value="wasd">⌨️ WASD</option>
                        <option value="arrows">↕️ Arrow Keys</option>
                    </select>
                    <div class="upload-instructions" style="margin-top:6px;">
                        <button id="player-advanced-btn" class="btn btn-sm">Advanced ▸</button>
                        <div id="player-advanced-panel" class="instructions-panel" style="display:none; font-size:0.85em; margin-top:6px;">
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; align-items:end;">
                                <div>
                                    <label for="player-scale">Scale Factor</label>
                                    <input type="number" id="player-scale" min="1" max="40" value="10">
                                </div>
                                <div>
                                    <label for="player-step">Step Factor</label>
                                    <input type="number" id="player-step" min="100" max="5000" value="1000">
                                </div>
                                <div>
                                    <label for="player-anim">Animation Rate (ms)</label>
                                    <input type="number" id="player-anim" min="10" max="500" value="50">
                                </div>
                                <div>
                                    <label for="player-rows">Rows</label>
                                    <input type="number" id="player-rows" min="1" value="1">
                                </div>
                                <div>
                                    <label for="player-cols">Columns</label>
                                    <input type="number" id="player-cols" min="1" value="1">
                                </div>
                            </div>
                            <div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);">
                                <div style="font-weight:600; margin-bottom:6px;">Directional Rows</div>
                                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; align-items:end;">
                                    <div>
                                        <label for="player-dir-down-row">Down Row</label>
                                        <input type="number" id="player-dir-down-row" min="0" value="0">
                                    </div>
                                    <div>
                                        <label for="player-dir-right-row">Right Row</label>
                                        <input type="number" id="player-dir-right-row" min="0" value="1">
                                    </div>
                                    <div>
                                        <label for="player-dir-left-row">Left Row</label>
                                        <input type="number" id="player-dir-left-row" min="0" value="2">
                                    </div>
                                    <div>
                                        <label for="player-dir-up-row">Up Row</label>
                                        <input type="number" id="player-dir-up-row" min="0" value="3">
                                    </div>
                                    <div>
                                        <label for="player-dir-upright-row">Up-Right Row</label>
                                        <input type="number" id="player-dir-upright-row" min="0" value="3">
                                    </div>
                                    <div>
                                        <label for="player-dir-downright-row">Down-Right Row</label>
                                        <input type="number" id="player-dir-downright-row" min="0" value="1">
                                    </div>
                                    <div>
                                        <label for="player-dir-upleft-row">Up-Left Row</label>
                                        <input type="number" id="player-dir-upleft-row" min="0" value="2">
                                    </div>
                                    <div>
                                        <label for="player-dir-downleft-row">Down-Left Row</label>
                                        <input type="number" id="player-dir-downleft-row" min="0" value="0">
                                    </div>
                                </div>
                                <div style="display:grid; grid-template-columns: 1fr; gap:8px; align-items:end; margin-top:8px;">
                                    <div>
                                        <label for="player-dir-columns">Direction Frames (columns)</label>
                                        <input type="number" id="player-dir-columns" min="1" value="3">
                                    </div>
                                </div>
                                <div style="margin-top:12px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);">
                                    <div style="font-weight:600; margin-bottom:6px;">Hitbox (collision box)</div>
                                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; align-items:end;">
                                        <div>
                                            <label for="player-hitbox-width">Width Reduction (%)</label>
                                            <input type="number" id="player-hitbox-width" min="0" max="0.9" step="0.01" value="0.00">
                                        </div>
                                        <div>
                                            <label for="player-hitbox-height">Height Reduction (%)</label>
                                            <input type="number" id="player-hitbox-height" min="0" max="0.9" step="0.01" value="0.00">
                                        </div>
                                    </div>
                                    <div style="margin-top:6px; font-size:0.75em;">
                                        Smaller values mean a larger collision box (closer to sprite edges). Larger values trim the box inward symmetrically.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="asset-group">
                    <!-- NPC builder: dynamic slots with sprite and dialogue -->
                    <div class="group-title">
                        <span>NPC</span>
                        <button class="add-item-btn" id="add-npc">+</button>
                    </div>
                    <div class="upload-instructions" style="margin-top:6px;">
                        <button id="npc-sprite-instructions-btn" class="btn btn-sm">Upload Instructions ▸</button>
                        <div id="npc-sprite-instructions-panel" class="instructions-panel" style="display:none; font-size:0.75em; margin-top:6px;">
                            NPCs use the same spritesheet system as the Player. Place files under <code>_projects/systems/open-world/images/sprites</code> and set <code>rows</code>/<code>cols</code> in index.json, then press Refresh Assets. See <a href="{{ site.baseurl }}/gamebuilderv1-2/doc" target="_blank" rel="noopener noreferrer">upload instructions</a>.
                            <div style="margin-top:4px;">Sprites json: <a href="{{ site.baseurl }}/images/gamebuilder/sprites/index.json" target="_blank" rel="noopener noreferrer">images/gamebuilder/sprites/index.json</a></div>
                            <div style="margin-top:6px;">
                                Interaction: Walk up to an NPC and press <strong>E</strong> to open their dialogue. Interactions trigger on collision or close proximity. Ensure the NPC has either a <code>greeting</code> or <code>dialogues</code> set for text to appear.
                            </div>
                        </div>
                    </div>
                    <div id="npcs-container"></div>
                </div>
                <div class="asset-group">
                    <!-- walls: toggle visibility, draw barriers, clear shapes -->
                    <div class="group-title"><span>WALLS &amp; OBJECTS</span></div>
                    <div class="draw-toolbar">

                        <!-- Visibility -->
                        <div class="draw-section-label">Visibility</div>
                        <button id="toggle-walls-game" class="draw-btn">👁 Show Walls in Game</button>

                        <!-- Drawing -->
                        <div class="draw-section-label">Drawing</div>
                        <button id="draw-barrier" class="draw-btn">🧱 Draw Collision Wall</button>
                        <button id="draw-star"    class="draw-btn">⭐ Place Stars</button>

                        <!-- NPCs -->
                        <div class="draw-section-label">NPCs</div>
                        <div class="draw-btn-pair">
                            <button id="draw-route-npc"  class="draw-btn">🧍 Route NPC</button>
                            <button id="finish-route-npc" class="draw-btn finish-btn" style="display:none;background:#065f46;border-color:#10b981;color:#a7f3d0;">✓ Done</button>
                        </div>
                        <div class="draw-btn-pair">
                            <button id="draw-attack-npc" class="draw-btn" title="Click to draw a patrol route. Click again after ✓ Done to add more.">⚔️ Attack NPC <span id="attack-npc-count" style="display:none;background:#ef4444;color:#fff;border-radius:9px;padding:0 5px;font-size:.7rem;font-weight:700;margin-left:2px;vertical-align:middle;"></span></button>
                            <button id="finish-attack-npc" class="draw-btn finish-btn" style="display:none;background:#7f1d1d;border-color:#ef4444;color:#fca5a5;">✓ Done</button>
                        </div>

                        <!-- Game Settings -->
                        <div class="draw-section-label">Game Settings</div>
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 2px;gap:8px;">
                            <label for="global-max-hearts" style="font-size:.78rem;color:#94a3b8;white-space:nowrap;">❤️ Player Hearts</label>
                            <div style="display:flex;align-items:center;gap:6px;">
                                <button id="hearts-dec" style="width:24px;height:24px;background:#1e293b;border:1px solid #334155;border-radius:5px;color:#e2e8f0;cursor:pointer;font-size:.9rem;line-height:1;padding:0;">−</button>
                                <input type="number" id="global-max-hearts" min="1" max="10" value="3"
                                       style="width:42px;text-align:center;padding:3px 4px;background:#0f172a;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:.85rem;">
                                <button id="hearts-inc" style="width:24px;height:24px;background:#1e293b;border:1px solid #334155;border-radius:5px;color:#e2e8f0;cursor:pointer;font-size:.9rem;line-height:1;padding:0;">+</button>
                            </div>
                        </div>

                        <!-- Clear -->
                        <div class="draw-section-label">Actions</div>
                        <button id="draw-clear" class="draw-btn draw-btn-danger">🗑 Clear All Walls</button>

                    </div>
                    <div id="drawn-barriers-list" style="margin-top:8px;display:flex;flex-direction:column;gap:4px;"></div>
                    <div id="walls-container"></div>
                </div>
                <!-- ── SETTINGS ─────────────────────────────────────── -->
                <details id="settings-panel" open style="margin-top:12px;">
                  <summary style="cursor:pointer;font-weight:700;font-size:.82rem;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;padding:6px 0;">⚙ Settings</summary>
                  <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
                    <label style="display:flex;align-items:center;gap:8px;font-size:.82rem;cursor:pointer;">
                      <input type="checkbox" id="gb-slow-mode"> 🐌 Slow Mode
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;font-size:.82rem;cursor:pointer;">
                      <input type="checkbox" id="gb-high-contrast"> ⚡ High Contrast
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;font-size:.82rem;cursor:pointer;">
                      <input type="checkbox" id="gb-large-sprites"> 🔍 Large Sprites
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;font-size:.82rem;cursor:pointer;">
                      <input type="checkbox" id="gb-dpad-right" checked> 📱 D-pad on Right
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;font-size:.82rem;cursor:pointer;">
                      <input type="checkbox" id="gb-voice"> 🎤 Voice Commands
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;font-size:.82rem;cursor:pointer;">
                      <input type="checkbox" id="gb-face"> 📷 Face Tracking
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;font-size:.82rem;cursor:pointer;">
                      <input type="checkbox" id="gb-coach"> 🧑‍🏫 UESL Coach
                    </label>
                    <div id="gb-coach-speed-panel" style="display:none;flex-direction:column;gap:7px;padding:4px 0 6px 22px;">
                      <label style="font-size:.78rem;color:#94a3b8;display:flex;align-items:center;gap:6px;">
                        👾 Character:
                        <select id="gb-coach-char" style="flex:1;background:#0f172a;color:#c4b5fd;border:1px solid #3730a3;border-radius:6px;padding:2px 4px;font-size:.78rem;cursor:pointer;">
                          <option value="chillguy">😎 Chill Guy</option>
                          <option value="enderman">🖤 Enderman</option>
                          <option value="creepa">💥 Creeper</option>
                          <option value="robot">🤖 Robot</option>
                          <option value="mzombie">🧟 Zombie</option>
                        </select>
                      </label>
                      <label style="font-size:.78rem;color:#94a3b8;display:flex;align-items:center;gap:6px;">
                        ⚡ Speed:
                        <input type="range" id="gb-coach-speed" min="0.5" max="8" step="0.5" value="2.5" style="width:80px;accent-color:#6366f1;">
                        <span id="gb-coach-speed-val" style="min-width:24px;color:#a5b4fc;">2.5</span>
                      </label>
                      <label style="font-size:.78rem;color:#94a3b8;display:flex;align-items:center;gap:6px;">
                        ❤️ Hearts:
                        <input type="range" id="gb-coach-hearts" min="1" max="5" step="1" value="3" style="width:80px;accent-color:#ef4444;">
                        <span id="gb-coach-hearts-val" style="min-width:24px;color:#fca5a5;">3</span>
                      </label>
                      <label style="font-size:.78rem;color:#94a3b8;display:flex;align-items:center;gap:6px;">
                        👁️ Chase Range:
                        <input type="range" id="gb-coach-range" min="80" max="700" step="20" value="300" style="width:80px;accent-color:#f59e0b;">
                        <span id="gb-coach-range-val" style="min-width:28px;color:#fcd34d;">300</span>px
                      </label>
                    </div>
                    <!-- More Information expandable panel -->
                    <button id="gb-info-btn" style="margin-top:8px;width:100%;padding:6px 10px;background:#1e293b;border:1px solid #334155;border-radius:7px;color:#94a3b8;cursor:pointer;font-size:.78rem;text-align:left;display:flex;align-items:center;gap:6px;">
                      <span>📖</span><span>How to Build &amp; Play</span><span id="gb-info-arrow" style="margin-left:auto;">▸</span>
                    </button>
                    <div id="gb-info-panel" style="display:none;margin-top:6px;background:rgba(0,0,0,.25);border:1px solid #1e3a5f;border-radius:8px;padding:10px 12px;font-size:.75rem;color:#94a3b8;line-height:1.6;">
                      <div style="font-weight:700;color:#a5b4fc;margin-bottom:6px;">🏗️ Building Your Game</div>
                      <ol style="margin:0 0 10px 14px;padding:0;">
                        <li><strong style="color:#e2e8f0;">Environment</strong> — Pick a background from the dropdown to set the scene.</li>
                        <li><strong style="color:#e2e8f0;">Player</strong> — Choose a sprite, set a name, pick movement keys (WASD or Arrows), and adjust position/scale.</li>
                        <li><strong style="color:#e2e8f0;">NPCs</strong> — Press <kbd style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:1px 4px;">+</kbd> to add characters. Give each a name, sprite, greeting, and position.</li>
                        <li><strong style="color:#e2e8f0;">Walls &amp; Objects</strong> — Use <em>Draw Collision Wall</em> to drag red barriers on the canvas. Use <em>Place Stars</em> to drop collectibles.</li>
                        <li><strong style="color:#e2e8f0;">Run</strong> — Press <kbd style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:1px 4px;">▶</kbd> to preview your game. Press <kbd style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:1px 4px;">■</kbd> to stop.</li>
                        <li><strong style="color:#e2e8f0;">Export</strong> — Press <kbd style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:1px 4px;">⤓</kbd> to copy the generated level code.</li>
                      </ol>
                      <div style="font-weight:700;color:#a5b4fc;margin-bottom:6px;">🎮 Playing the Game</div>
                      <ul style="margin:0 0 10px 14px;padding:0;">
                        <li>Move with <kbd style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:1px 4px;">WASD</kbd> or <kbd style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:1px 4px;">↑↓←→</kbd> depending on your chosen keys.</li>
                        <li>Walk into <strong style="color:#e2e8f0;">NPCs</strong> and press <kbd style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:1px 4px;">E</kbd> to open their dialogue.</li>
                        <li>Collect <strong style="color:#e2e8f0;">⭐ Stars</strong> to score points.</li>
                        <li>Avoid the <strong style="color:#fca5a5;">⚔️ Attack NPCs</strong> — touching them costs a heart.</li>
                        <li>Red collision walls block movement; toggle <em>Show Walls in Game</em> to see them in-game.</li>
                        <li>Enable <strong style="color:#c4b5fd;">🧑‍🏫 UESL Coach</strong> for an extra challenge — it chases you!</li>
                      </ul>
                      <div style="font-weight:700;color:#a5b4fc;margin-bottom:6px;">💾 Saving &amp; Sharing</div>
                      <ul style="margin:0 0 0 14px;padding:0;">
                        <li>Press <kbd style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:1px 4px;">💾</kbd> to save your game to the server (login required).</li>
                        <li>Press <kbd style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:1px 4px;">👥</kbd> to create or join a multiplayer room.</li>
                        <li>Use <em>Refresh Assets</em> (<kbd style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:1px 4px;">⟳</kbd>) after uploading custom backgrounds or sprites.</li>
                      </ul>
                    </div>
                    <div id="gb-face-panel" style="display:none;background:rgba(0,0,0,.25);border-radius:8px;padding:8px;margin-top:4px;">
                      <video id="gb-face-video" style="display:none;"></video>
                      <canvas id="gb-face-preview" width="120" height="90" style="border-radius:6px;width:100%;"></canvas>
                      <button id="gb-recalibrate" style="margin-top:6px;width:100%;padding:4px;background:#3730a3;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:.78rem;">🔄 Recalibrate</button>
                    </div>
                    <div id="gb-voice-status" style="display:none;font-size:.75rem;color:#94a3b8;margin-top:2px;padding:4px 8px;background:rgba(0,0,0,.2);border-radius:6px;">Voice: off</div>
                  </div>
                </details>
            </div>
        </div>
    </div>
    <div class="col-main view-split">
        <!-- view controls: switch between code, game, or split view -->
        <div class="view-controls">
            <button class="view-btn" data-view="game" aria-pressed="false">Game</button>
            <button class="view-btn" data-view="code" aria-pressed="false">Code</button>
            <button class="view-btn active" data-view="split" aria-pressed="true">Split</button>
            <div class="uesl-builder-run-controls">
                <span id="gb-run-status" class="ocs__builder-status" role="status">Ready</span>
                <button id="btn-code-play" class="ocs__btn accent fill" type="button">Run</button>
                <button id="btn-code-stop" class="ocs__btn" type="button">Stop</button>
            </div>
        </div>
        <div class="main-content">
            <!-- game panel + drawing overlay -->
            <div class="glass-panel panel-game">
                <div class="panel-header" style="display:flex;align-items:center;justify-content:space-between;">
                    <span>Game Viewer</span>
                    <span id="uesl-heart-hud" style="font-size:1.3rem;letter-spacing:3px;pointer-events:none;"></span>
                </div>
                <div class="game-frame">
                    <div class="game-output"
                        id="game-output-builder">
                        <div id="game-container-builder" class="gameContainer">
                            <canvas id="game-canvas-builder"></canvas>
                        </div>
                    </div>
                    <div id="draw-overlay" class="draw-overlay"></div>
                </div>
            </div>
            <!-- Fixed-position layer for route/attack NPC path lines.
                 Lives outside the game-frame so overflow:hidden on ancestors can't clip it. -->
            <div id="route-vis-layer"></div>
            <!-- code panel: live JS editor with highlight -->
            <div class="glass-panel code-panel panel-code">
                <div class="panel-header">
                    <span>Game code</span>
                    <div class="panel-controls">
                        <button id="btn-export" class="ocs__btn" type="button">Export code</button>
                        <button id="gb-save-btn" type="button" class="ocs__btn" title="Account Save / Load">Save / Load</button>
                        <button id="gb-mp-btn" type="button" class="ocs__btn">Multiplayer</button>
                    </div>
                </div>
                <!-- Multiplayer mode notice — shown when in a room -->
                <div id="gb-mp-edit-banner" style="display:none;background:linear-gradient(90deg,#1e1b4b,#312e81);border:1px solid #4f46e5;border-radius:8px;padding:8px 14px;margin-bottom:6px;font-size:.82rem;color:#a5b4fc;align-items:center;gap:10px;">
                  <span style="font-size:1rem;">🎮</span>
                  <span>You are in <strong style="color:#c4b5fd;">multiplayer mode</strong>. Editing is disabled while playing. <a id="gb-mp-exit-edit" href="#" style="color:#818cf8;text-decoration:underline;">Exit multiplayer</a> to make changes.</span>
                </div>
                <div class="editor-container" id="editor-container">
                    <div id="highlight-layer" class="highlight-layer"></div>
                    <textarea aria-label="Open World game code" id="code-editor" class="code-layer" spellcheck="false"></textarea>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- My Games Modal -->
<div id="gb-save-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;align-items:center;justify-content:center;backdrop-filter:blur(4px);">
  <div style="position:relative;background:linear-gradient(160deg,#0f1729 0%,#0e1117 100%);border:1px solid #334455;border-radius:18px;padding:28px 28px 24px;min-width:340px;max-width:480px;width:92%;color:#e2e8f0;font-family:sans-serif;box-shadow:0 24px 60px rgba(0,0,0,.7);">
    <button id="gb-save-close" aria-label="Close saved games" style="position:absolute;top:14px;right:16px;background:rgba(255,255,255,.07);border:none;color:#94a3b8;font-size:1.1rem;cursor:pointer;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;">×</button>

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
      <div style="width:38px;height:38px;background:linear-gradient(135deg,#0ea5e9,#6366f1);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">💾</div>
      <div>
        <h3 style="margin:0;color:#7dd3fc;font-size:1.05rem;">My Games</h3>
        <div style="font-size:.72rem;color:#64748b;">Save &amp; load your game projects</div>
      </div>
    </div>

    <!-- Not logged in notice -->
    <div id="gb-save-login-msg" style="display:none;background:#1e2030;border:1px solid #f59e0b;border-radius:10px;padding:14px 16px;font-size:.85rem;color:#fbbf24;text-align:center;margin-bottom:12px;">
      ⚠ You must be logged in to save or load games.<br>
      <a href="https://uesl.opencodingsociety.com/login" target="_blank" rel="noopener" style="color:#60a5fa;margin-top:6px;display:inline-block;">Log in to UESL →</a>
    </div>

    <!-- Save current game -->
    <div id="gb-save-form" style="display:none;margin-bottom:16px;">
      <div style="display:flex;gap:8px;">
        <input id="gb-save-name" aria-label="Game name" placeholder="Game name…" maxlength="120"
          style="flex:1;padding:9px 12px;background:#1a2035;border:1px solid #2d3a55;border-radius:9px;color:#e2e8f0;font-size:.9rem;outline:none;">
        <button id="gb-save-confirm" style="padding:9px 16px;background:linear-gradient(135deg,#0ea5e9,#6366f1);border:none;border-radius:9px;color:#fff;font-weight:700;font-size:.85rem;cursor:pointer;white-space:nowrap;">Save</button>
      </div>
      <div id="gb-save-status" style="min-height:18px;font-size:.78rem;color:#64748b;margin-top:5px;"></div>
    </div>

    <!-- Saved games list -->
    <div id="gb-save-list-wrap" style="display:none;">
      <div style="font-size:.72rem;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">Saved Games</div>
      <div id="gb-save-list" style="display:flex;flex-direction:column;gap:6px;max-height:240px;overflow-y:auto;"></div>
      <p id="gb-save-empty" style="display:none;font-size:.82rem;color:#475569;margin:8px 0 0;text-align:center;">No saved games yet. Build something and hit Save!</p>
    </div>

    <div id="gb-save-loading" style="display:none;font-size:.85rem;color:#64748b;text-align:center;padding:16px 0;">Loading…</div>
  </div>
</div>

<!-- Multiplayer Modal -->
<div id="gb-mp-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;align-items:center;justify-content:center;backdrop-filter:blur(4px);">
  <div style="position:relative;background:linear-gradient(160deg,#0f1729 0%,#0e1117 100%);border:1px solid #3344aa;border-radius:18px;padding:28px 28px 24px;min-width:340px;max-width:420px;width:90%;color:#e2e8f0;font-family:sans-serif;box-shadow:0 24px 60px rgba(0,0,0,.7);">
    <button id="gb-mp-close" aria-label="Close multiplayer" style="position:absolute;top:14px;right:16px;background:rgba(255,255,255,.07);border:none;color:#94a3b8;font-size:1.1rem;cursor:pointer;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;">×</button>

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
      <div style="width:38px;height:38px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">👥</div>
      <div>
        <h3 style="margin:0;color:#c4b5fd;font-size:1.05rem;">Multiplayer</h3>
        <div id="gb-mp-conn-dot" style="font-size:.72rem;color:#64748b;">● Not connected</div>
      </div>
    </div>

    <!-- Setup panel (shown when not in a room) -->
    <div id="gb-mp-setup">
      <button id="gb-mp-create" style="width:100%;padding:11px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:10px;color:#fff;font-weight:700;font-size:.95rem;cursor:pointer;letter-spacing:.02em;transition:opacity .15s;">🚀 Create Room</button>
      <div style="display:flex;align-items:center;gap:8px;margin:10px 0;">
        <div style="flex:1;height:1px;background:#1e293b;"></div>
        <span style="font-size:.75rem;color:#475569;">or join with a code</span>
        <div style="flex:1;height:1px;background:#1e293b;"></div>
      </div>
      <div style="display:flex;gap:8px;">
        <input id="gb-mp-join-code" aria-label="Room code" placeholder="Room code (e.g. AB12CD)" style="flex:1;padding:9px 12px;background:#1a2035;border:1px solid #2d3a55;border-radius:9px;color:#e2e8f0;font-size:.9rem;letter-spacing:.08em;text-transform:uppercase;outline:none;">
        <button id="gb-mp-join" style="padding:9px 16px;background:#1a2035;border:1px solid #6366f1;border-radius:9px;color:#818cf8;cursor:pointer;font-weight:700;white-space:nowrap;">Join →</button>
      </div>
    </div>

    <!-- Active room panel (shown when in a room) -->
    <div id="gb-mp-room-active" style="display:none;">
      <!-- Room code card -->
      <div style="background:#1a2035;border:1px solid #2d3a55;border-radius:10px;padding:12px 14px;margin-bottom:12px;">
        <div style="font-size:.72rem;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Room Code</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span id="gb-mp-room-code" style="font-size:1.4rem;font-weight:800;color:#a78bfa;letter-spacing:.18em;font-family:monospace;"></span>
          <button id="gb-mp-copy-btn" style="padding:5px 12px;background:#312e81;border:1px solid #4f46e5;border-radius:7px;color:#a5b4fc;font-size:.78rem;cursor:pointer;">📋 Copy</button>
        </div>
        <div style="font-size:.73rem;color:#475569;margin-top:5px;">Share this code — your partner enters it to join</div>
      </div>

      <!-- Players in room -->
      <div style="background:#1a2035;border:1px solid #2d3a55;border-radius:10px;padding:12px 14px;margin-bottom:12px;">
        <div style="font-size:.72rem;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">Players in Room</div>
        <div id="gb-mp-player-list" style="display:flex;flex-direction:column;gap:5px;"></div>
      </div>

      <!-- Actions -->
      <div style="display:flex;gap:8px;">
        <button id="gb-mp-send-level" style="flex:1;padding:9px;background:linear-gradient(135deg,#0ea5e9,#6366f1);border:none;border-radius:9px;color:#fff;font-weight:700;font-size:.85rem;cursor:pointer;">📤 Share Level</button>
        <button id="gb-mp-leave" style="padding:9px 14px;background:#1a2035;border:1px solid #ef4444;border-radius:9px;color:#f87171;font-size:.85rem;cursor:pointer;font-weight:600;">Leave</button>
      </div>

      <!-- Invite friends (logged-in only) -->
      <div id="gb-mp-friends-section" style="display:none;margin-top:12px;">
        <div style="font-size:.72rem;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Invite a Friend</div>
        <div id="gb-mp-friends-list" style="display:flex;flex-direction:column;gap:5px;max-height:120px;overflow-y:auto;"></div>
        <p id="gb-mp-no-friends" style="display:none;font-size:.78rem;color:#475569;margin:4px 0 0;">No friends found. Add friends on the UESL hub first.</p>
      </div>

      <p id="gb-mp-login-note" style="font-size:.75rem;color:#f59e0b;margin:8px 0 0;display:none;">⚠ Log in on the UESL hub to invite friends directly.</p>
    </div>

    <!-- Status bar -->
    <div id="gb-mp-status" style="margin-top:12px;font-size:.8rem;color:#64748b;min-height:18px;padding:6px 0 0;border-top:1px solid #1e293b;"></div>
  </div>
</div>

<script src="{{ site.baseurl }}/projects/systems/open-world/js/app.js"></script>

<script src="{{ site.baseurl }}/projects/systems/open-world/js/settings.js"></script>
