# Racing

Canonical source for the Racing tab in UESL Play, organized like the OpenCS
GameBuilder project. Edit files here; Jekyll publishes them directly to `_site`.

```text
racing/
├── docs/
├── images/
├── js/
├── navigation/
├── notebooks/
├── sass/
├── tests/
├── index.md
└── README.md
```

- `index.md`: the builder's page, published at `/car-racing-builder`.
- `js/`: builder logic; scripts publish at `/projects/systems/racing/js/`.
- `sass/main.scss`: styles specific to this builder. The shared stylesheet
  `assets/css/game-builder.scss` composes all three with shared OCS controls.
- `images/`: owned game artwork and manifests, or documentation of procedural art.
- `docs/`: source notes and editing/demo guidance.
- `navigation/`: the route map back to this builder in Play.
- `notebooks/`: a home for future lessons; none have been added for this builder.
- `tests/`: the builder's focused behavior checks.

See [development notes](docs/DEVELOPMENT.md), [navigation](navigation/README.md)
and the [shared project guide](../../README.md).
