# Starter verification

## 2026-10-05: contract audit

Checked `game`, `emptyLevel`, `a11y`, `applyGameData`, `gmConfirmSave`, `loadGame`,
`gmLibLoad`, and `startPlay` in `pages/game-maker.html`. Cross-checked the account
save/load envelope against Backend `api/game_api.py`. Confirmed accessibility
settings are not serialized and that account labels are separate from game titles.

## Title validation

Five Node tests and the syntax check passed. Inputs at the 40-unit limit are
accepted; a 41-unit name receives a correction instead of silent truncation.
Non-text values are not coerced. The validator neither reads nor writes storage.

## Title adapter

All 11 starter tests passed with `node --test tests/game-maker-guided/*.test.mjs`.
The six adapter checks cover frozen-input preservation, invalid titles, malformed
envelopes, JSON save/load format, repeat application, and older optional fields.
The complete output is compared against a known expected envelope, including a
star ID and future metadata. The adapter syntax check passed. These are module
tests; they do not claim a new browser flow or full corrupted-save recovery.
