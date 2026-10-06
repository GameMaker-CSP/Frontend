# Adhvay: starter tasks for Frontend #4

## 2026-10-05

- Done: audit `game`, `a11y`, `applyGameData`, local saves, and account saves.
- Added `docs/guided-state-contract.md`; checked each entry against the editor
  at `b7b506f53` and Backend `api/game_api.py`.
- Verification: documentation-only source review; no runtime behavior changed.
- Done: `validation.js` and five focused tests cover trimming, blank input,
  missing/non-text values, the 40-unit boundary, and emoji length.
- Verification: `node --test tests/game-maker-guided/validation.test.mjs` (5 passed)
  and `node --check assets/js/game-maker-guided/validation.js` (passed).
- Done: `state-adapter.js` prototypes a title-only configuration change while
  preserving levels, IDs, optional legacy fields, and unknown metadata.
- Verification: `node --test tests/game-maker-guided/*.test.mjs` (11 passed),
  including malformed envelopes, frozen inputs, and JSON round trips;
  the adapter syntax check passed.
- All three starter tasks are complete. Later work: teammate review, guided UI
  integration, broader validation, and draft recovery; Issue #4 remains open.
- Earlier localhost changes remain separate and uncommitted.
