# OpenCS workbench in UESL

The OpenCS workbench is available at `/gamebuilder/v2/` and is embedded by the
UESL Play page alongside the inherited games. Its settings, JavaScript editor,
and preview are the real OpenCS GameBuilder v2 modules.

## Source and attribution

Imported on 2026-10-12 from the local `opencs/pages` checkout:

- Repository: <https://github.com/RazorCrest00/pages>
- Commit: `6ca16e956809135a71a6ae7b9704f234d5c1c878`
- GameBuilder: `_projects/systems/gamebuilder/index.md`, `js/*.mjs`,
  `sass/main.scss`, the starter background/sprite manifests and their images.
- Runner: `_includes/runners/game.html`, its editor/workspace fragments,
  `assets/js/pages/runners/core/*.js`, and `executors/GameExecutor.js`.
- Engine: the v1.1 essentials needed for a background, player, NPC dialogue,
  touch input, spline barriers, pause, and optional score/leaderboard services.
- Styles: `_sass/open-coding/forms/{game-runner,_runner-base}.scss`.
- Regression tests: GameBuilder contracts, code importer, workspace contracts,
  and action feedback tests.

OpenCS source is distributed under Apache-2.0. Copies of its license are in
`_projects/systems/gamebuilder/js/LICENSE` and `assets/js/opencs-engine/LICENSE`.
Original source documentation is retained. Integration changes are described
below; no inherited engine files were replaced.

Acorn **8.15.0** is the unmodified shared parser from the same source checkout,
originally `dist/acorn.mjs` from the official `acorn@8.15.0` package. It is
vendored at `assets/js/vendor/acorn.mjs` with its MIT license at
`assets/js/vendor/acorn-LICENSE`. Pull parses JavaScript without executing it.
No package installation is required at runtime.

## Integration changes

- `_projects/systems/gamebuilder/index.md` owns the page using the UESL builder
  layout; the unrelated OpenCS navigation is omitted.
- The runner imports only its used modules, avoiding the upstream barrel's
  unrelated executors. Its textarea fallback supports typing, recovery, and
  every code action without requiring CodeMirror or a CDN connection.
- All workbench and runner styling lives in `_projects/systems/gamebuilder/sass/main.scss`
  under `.uesl-builder-root`, reusing the existing OCS mixins and theme tokens.
  The shared builder stylesheet must load this module.
- Current engine files are isolated under
  `assets/js/opencs-engine/GameEnginev1.1/essentials/`. Generated and exported
  JavaScript imports these actual compatible files. Lazy engine imports resolve
  alongside their module; optional API imports use the existing configuration.
- The workbench supports the current OpenCS v1.1 engine. Engine v1 workspace
  documents fail validation before replacement because that older engine does
  not support the workbench's spline barriers.
- Upstream v1.1 import paths resolve to the isolated engine when run here.
  Pull normalizes only the two known engine import prefixes for comparison;
  arbitrary custom imports, settings, or behavior still prevent destructive
  Push. Importing a workspace preserves its exact source text.
- Page/manifest URLs honor Jekyll's base URL. Engine and image paths in exported
  source remain site-root paths; the runner adds the configured site base URL
  when executing them.
- Switching UESL tabs sends a same-origin parent message that stops the hidden
  runner. Stop also cancels pending module launches and exits its fullscreen UI.
- Toolbar controls and the fallback editor retain explicit accessible labels.
- The UESL shell applies the referenced OpenCS setup/preview/code composition to
  all three builders, with Game/Code/Split and persistent runner controls.
- Imported engine adaptation fixes in-place resizing, stable listener removal,
  and complete Stop teardown. Fullscreen and setup collapse use that same resize
  path; a hidden preview does not replace dimensions with zero.

## Workspace behavior

Configure the panels, **Push Builder to Code**, then **Start Game**. **Pull Code
into Builder** reads supported literal settings without running the code.
Player movement uses WASD; mobile devices receive touch controls. NPCs and
multiple spline barriers are supported.

Automatic recovery keeps exact editor code, panel values, and unfinished barrier
edits. **Save Workspace** records a separate explicit save; **Load Saved
Workspace** asks before replacing the open work. **Export/Import Workspace JSON**
transfers the complete workspace. **Export Code** downloads current JavaScript.
Invalid JSON and conflicting cross-tab storage writes do not overwrite the last
valid draft. Push refuses to replace code with custom behavior it cannot preserve.

Saves are local to this browser, origin, and `/gamebuilder/v2/` path. They are
separate from inherited-builder saves and account game saves; no data is migrated
or deleted. Use JSON export for a portable backup. The local workbench does not
require the Flask backend, and it does not claim account or multiplayer saving.

## Verification

Run the portable behavior checks with:

```sh
node --test _projects/systems/gamebuilder/tests/*.test.mjs
```

They cover code generation, safe Pull/Push, normalized spline geometry, draft
recovery, saved snapshots, failed writes, cross-tab conflicts, textarea input,
isolated engine resolution, and root/subdirectory deployment paths. Browser
verification of the full UESL page is recorded in `reports/verification.md`.
