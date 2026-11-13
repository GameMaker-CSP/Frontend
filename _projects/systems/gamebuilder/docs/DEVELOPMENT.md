# Developing OpenCS Workbench

The workbench uses GameEngine v1.1 isolated in `assets/js/opencs-engine/`.
Its runner markup is shared under `_includes/uesl-runner/`. Acorn remains in
`assets/js/vendor/`. [OpenCS provenance and adaptations](OPENCS_SOURCE.md)
record the source version and licenses.

Smoke check: choose a background and player, Push to Code, Run, Stop, then Save
and Load the workspace. Recovery, saved-workspace and JSON formats are unchanged.

From the frontend repository root:

```sh
bash run_frontend.sh
node --test _projects/systems/gamebuilder/tests/*.test.mjs
```

The local server watches project source changes. The Jekyll publisher in
`_plugins/builder_projects.rb` runs for both local serve and deployment builds.
Run the full checks with `bash scripts/test_frontend.sh` after a Jekyll build.
Tests and notebook sources are never published as runtime assets.
