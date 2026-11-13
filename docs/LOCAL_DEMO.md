# Local teacher demo

Keep `Frontend`, `Backend`, and `MM-Pages` together in `GameMaker-CSP`.
Only the first two need servers for this demo. These instructions were verified
on macOS with Homebrew Ruby 4.0 and Python 3.14; Ruby with Bundler and Python
with pip/venv are required. Dependencies may need internet on the first run.

## Start in two terminals

Terminal 1:

```bash
cd ~/RazorCrest00/GameMaker-CSP/Backend
bash run_backend.sh
```

Terminal 2:

```bash
cd ~/RazorCrest00/GameMaker-CSP/Frontend
bash run_frontend.sh
```

Leave both terminals running. Open <http://localhost:4700/login> and sign in
with local-only user ID `demo` and password `password`. Then open
<http://localhost:4700/play/>. Use `localhost` consistently for cookies.
The backend health check is <http://localhost:8424/api/health>.

To demonstrate database persistence, open <http://localhost:4700/profile>,
change the name, and select Save Changes. Wait for the saved confirmation,
then reload: the name should remain. Restore the demo name afterward.
Saving now waits for Flask and retains edits on a failed request. The inherited
Spring group service is unavailable in this Flask-only setup. The interest quiz,
expanded preferences and role adaptation are planned in
[the account roadmap](https://github.com/GameMaker-CSP/Frontend/issues/48).

## Current Play experience

Play combines three builders in one OCS workspace. All use the OpenCS layout:
setup at the left, game preview in the middle, code on the right at desktop
widths. Narrow screens stack the panels. Game / Code / Split changes the view;
Run / Stop remains available in every view. Hide setup gives the preview more
room. Switching builder tabs preserves open edits and stops the hidden game.

- **OpenCS Workbench:** choose a background, player, NPCs and spline barriers.
  Use Push → to generate code, then Run. Pull ← reads supported code changes
  back into the form. Save Workspace and Load Saved Workspace keep an explicit
  return point; browser draft recovery is separate. Export Workspace JSON makes
  a portable backup of both setup and code. Code-only export is also available.
- **Open World:** choose a background and confirm ✓, then choose/name a player
  and confirm again. Run / Stop tests the inherited multi-level game. Drawing,
  maze and accessibility controls remain available. Export Code downloads a
  level; its inherited browser draft storage is retained.
- **Racing:** set the car, track, weather and performance controls, then Run race.
  Use WASD/arrows to steer, Space to drift and Shift to boost. Stop race returns
  to the preview and cancels a pending countdown. Garage progress stays local.

Each builder retains its own save format; there is no automatic conversion.
Browser saves belong to the current device and address (`localhost` and
`127.0.0.1` have separate storage). Export a backup before clearing site data.
The old `/game-maker/` and `/game-maker-prototype/` URLs redirect to Play.
Room invitation links select Open World and retain their room parameter.

The newer guided editor remains in `pages/game-maker.html`, and its prototype
remains in `pages/prototype.html`. Their redirect layout deliberately omits the
editor content for now. To resume that work, restore their `uesl-app` layout.
Existing browser drafts and the SQLite database are not changed by this switch.

Backend login works with the demo account. The inherited builder's account
Save/Load uses `/api/gamebuilder`, which this local backend does not implement.
The newer editor's existing `/api/game` saves remain in
`Backend/instance/volumes/user_management.db`; they are a different format and
are not automatically imported into the inherited builder. AI, email/OAuth,
account saving from the inherited builder, and multiplayer are outside this demo.

Press Ctrl+C in each terminal to stop. If a port is occupied, stop the existing
server in its terminal before restarting. Do not delete the database to fix a
startup error. The backend refuses an incompatible legacy schema to protect
existing data; back it up and plan a migration separately.

## Checks

After the frontend has completed its build, in another terminal:

```bash
cd ~/RazorCrest00/GameMaker-CSP/Frontend
bash scripts/test_frontend.sh
cd ../Backend
.venv/bin/python -m unittest discover -s tests -p 'test_local_pipeline.py'
```

The backend tests use temporary databases and do not alter demo saves.
Local secrets, virtual environments, generated output, and databases stay
ignored. The backend script creates `.env` only when missing; it preserves
existing configuration. After changing Python requirements, install them with
`.venv/bin/python -m pip install -r requirements.txt`.

## Shared OCS styling demo

The same startup commands compile all shared Sass automatically. A Sass edit
rebuilds the frontend while the script is running; allow the rebuild to finish
before interacting with a game, because live reload refreshes the page.

- <http://localhost:4700/ocs-components/>: shared controls, Light/Ocean/reset,
  keyboard focus, and larger text.
- <http://localhost:4700/ocs-components/lessons/>: illustrative module and case
  components; these are examples, not actual plagiarism coursework.
- <http://localhost:4700/python/flask>: the real Flask infographic using OCS.

The style ownership map and extension rules are in
`_sass/open-coding/README.md`. The local backend supports core authentication
and the preserved newer editor's saved-game API. Its inherited preference-sync endpoint is not present;
OCS can apply local preferences, but this change does not add cross-device
preference storage. Do not confuse theme controls with saved gameplay options.

## Builder source folders

The three builders now live side by side under `_projects/systems/`: `gamebuilder`,
`open-world` and `racing`. Each has its own index, JS, Sass, images, docs and tests,
plus homes for navigation and future lesson notebooks. See
[the project guide](../_projects/README.md). Startup commands are unchanged; Jekyll
automatically publishes these sources and watches edits. Existing game/image URLs
and saved-game storage keys stay the same.

## Official upstreams

Both repositories have an `upstream` remote pointing to the official OCS
template: `Open-Coding-Society/portfolio` for Frontend and
`Open-Coding-Society/flask` for Backend. The Malware-Madness sources remain
available through `legacy`. `origin` still points to GameMaker-CSP.

On October 23, both upstream main branches were fetched. An isolated merge
analysis with `--allow-unrelated-histories` found 104 conflicting frontend paths
and 38 backend paths. No merge was applied or committed. The analysis used
committed HEAD, excluding the current uncommitted builder changes. Preserve
that work and verify builds before integrating; the work is assigned in
[issue #55](https://github.com/GameMaker-CSP/Frontend/issues/55).
