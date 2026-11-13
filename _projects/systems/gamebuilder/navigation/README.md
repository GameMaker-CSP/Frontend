# OpenCS Workbench navigation

- Play tab: `/play/?builder=workbench#game-builder`
- Standalone builder: `/gamebuilder/v2/`
- Embedded builder: `/gamebuilder/v2/?embed=1`

The shared tab UI is `pages/uesl-play.html`. Its selection, keyboard handling,
invitation forwarding and iframe lifecycle live in `assets/js/uesl-builders/`.
Keep navigation behavior shared so changing builders preserves open work.
