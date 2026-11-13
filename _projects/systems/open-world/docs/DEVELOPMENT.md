# Developing Open World

`js/app.js` owns the inherited level editor and code generation;
`js/settings.js` owns accessibility, input and multiplayer controls.
`js/load-templates.js` loads the inherited catalog in `js/templates.js`.
GameEngine v1.2, face tracking and `images/gamify/` remain shared site resources.

Smoke check: change a world/character, Run, switch Game/Code/Split, then Stop.
The inherited account Save/Load still needs the absent `/api/gamebuilder` API;
this folder move does not add that endpoint. [Asset instructions](ASSETS.md).

From the frontend repository root:

```sh
bash run_frontend.sh
node --test _projects/systems/open-world/tests/*.test.cjs
```

The local server watches project source changes. The Jekyll publisher in
`_plugins/builder_projects.rb` runs for both local serve and deployment builds.
Run the full checks with `bash scripts/test_frontend.sh` after a Jekyll build.
Tests and notebook sources are never published as runtime assets.
