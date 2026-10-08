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

## 2026-10-07: Sass deduplication

- Final build: `BUNDLE_GEMFILE="$PWD/Gemfile.local" bundle exec jekyll build
  --config _config.yml,_config.local.yml --destination
  /private/tmp/ocs-dedup-2026-10-07/build` passed. All five live CSS assets match
  the independent build byte for byte. Existing legacy build warnings remain.
- `node --test tests/*.test.cjs tests/game-maker-guided/*.test.mjs`: 23 passed.
  `git diff --check` passed; no dependencies, JavaScript or backend code changed.
- Saved pre-change CSS and compared final declaration values per selector and
  media/keyframe context: all 1,115 contexts match across the five assets. This
  checks rule values; browser checks below additionally cover sampled cascade
  and layout behavior after grouping/reordering.
- Before/after browser comparison at 1280x900 and 390x900 across the editor,
  login and OCS reference: 320 sampled elements, 20 computed properties each,
  zero differences. Checked desktop/mobile play screenshots; mobile canvas is
  366px and document width is 390px, matching its viewport.
- Mobile menu opens/closes. Live demo sign-in succeeds; My Games lists all three
  existing saves. Loaded `OCS Integration Demo`, retained Ocean Sky and two
  levels, played and paused it. No browser console errors; saves were unchanged.
- Implementation source lines: 3,507 to 3,355, a net reduction of 152. Compiled
  editor CSS excluding comments decreased from 37,978 to 36,606 bytes. These are
  source/asset size measurements, not a claim of faster runtime performance.
- Temporary comparison scripts, baselines and build/test logs are in
  `/private/tmp/ocs-dedup-2026-10-07/`. Durable computed-style evidence and
  screenshots are in `../OCS-Verification-2026-10-07/` outside the source repo.

## 2026-10-07: template migration verification

- New GitHub repository ID 1409357939 is `GameMaker-CSP/Frontend`, independent
  (`fork: false`) and a template (`is_template: true`). Main has 14 commits;
  GitHub lists RazorCrest00 (7), ishans17321 (4), and myhomies123 (3), with no
  other contributors. The original repository ID 1357489910 is `Frontend-history`.
- Published main tree `920c42e7fe1b9455ccfa18397791c540e52b9849` is unchanged.
  Main changed from `33321fa85` to `d4dd98843`; the committed OCS feature changed
  from `3689b3dab` to `c42a71ff2` with the same file tree. Original identities and
  author dates were preserved while parent history was replaced.
- All seven issues retained numbers, titles, assignees, labels, states, creation
  dates and discussions. GitHub automatically qualified four issue references
  in issue #5. All seven Kanban item IDs and custom fields remain unchanged and
  now point to the active repository. PR #8 remains merged in Frontend-history;
  its attachment in this chat was updated to the retained repository's URL.
- All three collaborators retain admin access. Actions were paused for initial
  upload and restored to their previous permissions afterward.
- Before adding these migration notes, verified the complete pending working
  patch and untracked shell file were byte-identical to their saved copies.
  Main and the active feature branch match their new remote counterparts. No
  runtime code changed, so file-tree equality is the relevant migration check.
- Verified the complete pre-migration Git bundle. Metadata snapshots, commit
  mapping, pending patch and validation results are under
  `/private/tmp/gamemaker-template-migration-2026-10-07/`; original local refs
  also remain under `refs/archive/pre-template/`. The history remote is fetchable
  with pushes disabled locally. The backup repository remains unarchived after
  automatic approval review rejected archiving without an explicit request.
