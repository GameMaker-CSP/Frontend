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

## 2026-10-06: OCS validation

- `bash run_frontend.sh` and `bash run_backend.sh` started successfully using
  the existing local dependencies and configuration. Backend source stayed clean.
- `node --test tests/*.test.cjs tests/game-maker-guided/*.test.mjs`: 23 passed.
  Added behavioral checks for theme replacement/reset, accent contrast choice,
  repeated lesson progress updates, locked links, and rendered stylesheet
  ownership/asset existence across seven primary routes.
- Backend integration suite: three passed with real temporary SQLite databases.
  Existing datetime deprecation and missing optional KASM notices remain.
- JavaScript and startup shell syntax checks passed; `git diff --check` passed.
- Alternate build with baseurl `/gamemaker-check` into a temporary directory
  succeeded. Seven routes each load OCS once; all 18 local stylesheet links
  contain the prefix and point to generated files.
- Browser: demo sign-in succeeded. Created `OCS Integration Demo` with Ocean Sky;
  completed all six guided steps; applied Calm; previewed/paused/returned with
  settings and focus intact; saved to the account. Reloaded, found the save in
  My Games, loaded it, and played the retained ocean level/title (two levels).
  The retained prototype also entered play without console errors.
- At 1280px and 390px widths, inspected the shared components, editor, and Flask
  infographic. Mobile game canvas measured 366px inside the 390px viewport;
  guided controls were 44px tall and no horizontal overflow was observed.
  The mobile component grid stacked; the new lesson reference rendered six
  modules. Light/Ocean/reset worked, with visible keyboard focus.
- Visual review caught missing component padding and wrong filled-link text
  color due to the old reset. Corrected specificity; verified 28px desktop card
  padding and white text on the dark Light-theme accent. The full scoped design
  detector then returned no findings after removing progress-width animation.
- No browser console errors appeared during checked game/prototype/lesson flows.
  The backend logs confirmed successful save/list/load requests. The optional
  preference-sync 404 is a known inherited integration limitation, not a save
  or game failure.
- Screenshots are kept outside source in `../OCS-Verification-2026-10-06/`.

## 2026-10-06: Sass consolidation

- Fresh Jekyll build into `/private/tmp/ocs-consolidation-build` succeeded.
  The running frontend's five compiled assets match this build byte for byte.
- Saved the eight previous compiled assets as a baseline. After removing only
  comments/whitespace, site, app, editor and course CSS are unchanged. New core
  CSS equals the prior core plus login/navigation/widget styles, with only the
  intended selector scoping and removal of the duplicate login body rule.
- All 23 frontend tests passed; removed asset/import paths have no remaining
  live source references; `git diff --check` passed.
- Browser: login retains a 460px card and its original surface color using only
  core/site assets. Profile sidebar remains fixed with a 256px content margin;
  the Flask sidebar stays static with zero main margin and a grid layout. The
  shared component page retains its appearance.
- Screenshot: `../OCS-Verification-2026-10-06/consolidated-ocs.png`.
