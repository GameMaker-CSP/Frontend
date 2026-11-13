# UESL Game Maker

This frontend lets students build and demonstrate games locally as part of the
GameMaker-CSP capstone. UESL navigation and shared Open Coding Sass (OCS) remain
the site's visual identity.

The Play page combines the actual OpenCS workbench, inherited Open World builder
and inherited Racing builder. The user chose the OpenCS workspace format:
setup on the left, game preview in the middle and code on the right, with
responsive stacking, Game / Code / Split views, and accessible Run / Stop controls.

Switching builders preserves open edits and stops hidden previews. Each builder
keeps its original storage format. Workbench recovery and workspace JSON export
are local browser features, separate from account saves. No existing games are
automatically converted or deleted.

The Flask backend supports local authentication and the preserved newer editor's
game-save API. The inherited Open World `/api/gamebuilder` account Save/Load API
is absent; do not describe that integration as complete. Multiplayer and camera
or microphone controls require separate verification. The reproducible local
demo is documented in `docs/LOCAL_DEMO.md`.
