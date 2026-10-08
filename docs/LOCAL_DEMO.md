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
<http://localhost:4700/game-maker/>. Use `localhost` consistently for cookies.
The backend health check is <http://localhost:8424/api/health>.

## Demonstrate the connection

1. Open Guided, choose a background, and name the game.
2. Choose Calm, continue to Preview, play/pause, and return to the guided builder.
3. Continue to Save, choose Save my game, and confirm a unique save name.
4. Reload the page. Open My Games and load that account save.
5. Confirm the title/background and play the loaded level.

Game data is stored in the backend SQLite database at
`Backend/instance/volumes/user_management.db`. Saving the same account name
updates that save. Calm and other accessibility settings currently need to be
selected again after a page reload; they are not persisted in the inherited
save format. Adhvay's title helpers are tested starter modules, not yet wired
into this UI. AI, email/OAuth, and multiplayer are outside this demo.

Press Ctrl+C in each terminal to stop. If a port is occupied, stop the existing
server in its terminal before restarting. Do not delete the database to fix a
startup error. The backend refuses an incompatible legacy schema to protect
existing data; back it up and plan a migration separately.

## Checks

After the frontend has completed its build, in another terminal:

```bash
cd ~/RazorCrest00/GameMaker-CSP/Frontend
node --test tests/*.test.cjs tests/game-maker-guided/*.test.mjs
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
`_sass/open-coding/README.md`. The local backend supports the core authentication
and saved-game demo. Its inherited preference-sync endpoint is not present;
OCS can apply local preferences, but this change does not add cross-device
preference storage. Do not confuse theme controls with saved gameplay options.
