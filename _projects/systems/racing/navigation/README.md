# Racing navigation

- Play tab: `/play/?builder=racing#game-builder`
- Standalone builder: `/car-racing-builder`
- Embedded builder: `/car-racing-builder?embed=1`

The shared tab UI is `pages/uesl-play.html`. Its selection, keyboard handling,
invitation forwarding and iframe lifecycle live in `assets/js/uesl-builders/`.
Keep navigation behavior shared so changing builders preserves open work.
