# UESL builder projects

The three Play builders live side by side, following the OpenCS feature layout:

```text
_projects/systems/
├── gamebuilder/    # OpenCS Workbench
├── open-world/     # inherited level builder
└── racing/         # inherited racing builder
```

Each owns `index.md`, `README.md`, `docs`, `images`, `js`, `navigation`,
`notebooks`, `sass` and `tests`. Empty teaching/art categories contain an honest
README instead of copied, unrelated content.

## Publishing

`_plugins/builder_projects.rb` publishes the three indexes using their existing
permalinks, scripts at `/projects/systems/<name>/js/`, and images at their original
public URLs. Documentation with YAML front matter is also published. Other docs,
tests, Sass source and notebooks stay out of the website. The template catalog
retains `/assets/js/GameEnginev1.2/builder/templates.js` for older consumers.

The plugin runs automatically with `bash run_frontend.sh`, direct Jekyll builds,
the Makefile and the existing GitHub Actions build. There is no separate copy
command and no generated source tree to edit. Do not exclude `_projects` from
Jekyll's watcher; its underscore already keeps it out of the normal page reader.
Plugins must be enabled (do not add `--safe` to the build).

## Shared ownership

- `pages/uesl-play.html` and `assets/js/uesl-builders/`: common tabs and frame lifecycle.
- `_layouts/uesl-builder.html`, `_includes/uesl-runner/`: shared page/runner markup.
- `_sass/open-coding/`: OCS tokens, controls, builder layout and mixins.
- `assets/css/game-builder.scss`: one ordered Sass entry point for all builders.
- `assets/js/GameEnginev1.2/`, `assets/js/opencs-engine/`: separate engine runtimes.
- `assets/js/vendor/`, `assets/js/api/`, `images/gamify/`: shared dependencies.
- `tests/`: cross-builder navigation, presentation and published-asset integration.

Public routes, browser storage keys, engines and saved-game formats are unchanged.
Source paths differ from runtime URLs where compatibility requires it. Always
edit this project tree, not `_site`.

## Verification

After starting/building the frontend, run `bash scripts/test_frontend.sh`.
See `docs/LOCAL_DEMO.md` for startup, login and manual demonstration instructions.
