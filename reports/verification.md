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

## 2026-10-06: combined localhost integration

- `bash run_frontend.sh`: successful fresh Jekyll generation and server startup
  on port 4700 using the committed local lockfile/configuration.
- `node --test tests/*.test.cjs tests/game-maker-guided/*.test.mjs`: 18 passed.
  The new guided styling regression failed against the previous rendered page,
  then passed after the existing Sass was connected to a compiled local asset.
- Backend: three real Flask/SQLite tests passed in a temporary database,
  covering CORS, authentication, account isolation, game round trips/upserts,
  logout, deletion, and protection of an incompatible legacy database.
- Browser: signed in as the local demo account; completed six guided steps;
  selected Ocean Sky, title `Merged Team Demo`, and Calm; previewed, paused,
  returned to step 5 with choices and focus preserved; saved to the account.
  Reloaded the page, loaded `Merged Team Demo` from My Games, and played it.
  Title, background, two levels, and four level-1 stars were preserved.
- Actual desktop screenshots showed the styled guided flow and the reloaded
  playable ocean level. Browser error log was empty. Accessibility settings
  resetting after reload remains an explicitly documented inherited limitation.
- `git diff --check` passed. This evidence covers the local foundation pipeline,
  not all historical features or a hosted production deployment.
