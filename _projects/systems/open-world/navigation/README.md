# Open World navigation

- Play tab: `/play/?builder=open-world#game-builder`
- Standalone builder: `/gamebuilderv1-2`
- Embedded builder: `/gamebuilderv1-2?embed=1`

The shared tab UI is `pages/uesl-play.html`. Its selection, keyboard handling,
invitation forwarding and iframe lifecycle live in `assets/js/uesl-builders/`.
Keep navigation behavior shared so changing builders preserves open work.
