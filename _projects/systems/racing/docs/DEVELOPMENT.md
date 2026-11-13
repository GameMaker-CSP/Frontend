# Developing Racing

`js/app.js` contains the inherited track definitions, car settings, garage
and race lifecycle. Tracks/cars are drawn on canvas; no bitmap art is required.

Smoke check: choose a track, start a race, wait for the countdown, drive and Stop.
The `crb_garage` local-storage key and all six track choices are preserved.

From the frontend repository root:

```sh
bash run_frontend.sh
node --test _projects/systems/racing/tests/*.test.cjs
```

The local server watches project source changes. The Jekyll publisher in
`_plugins/builder_projects.rb` runs for both local serve and deployment builds.
Run the full checks with `bash scripts/test_frontend.sh` after a Jekyll build.
Tests and notebook sources are never published as runtime assets.
