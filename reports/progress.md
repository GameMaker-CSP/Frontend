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
- Earlier localhost changes were separate and uncommitted at this checkpoint;
  see the integration checkpoint below.

## 2026-10-06: merge the team foundations

- Integrated Adhvay's three starter commits and Ishan's current four commits
  with Rohan's three commits already on main, preserving their history.
- Committed the existing localhost startup, login, API configuration, and
  canonical editor-route fixes separately from the starter tasks.
- Browser testing found guided styles absent from the local theme. Moved the
  existing scoped Sass into a shared partial and linked a compiled editor asset.
- Done: local Jekyll build; 18 frontend checks; three backend integration tests;
  browser login, six guided steps, Calm, preview return, account save, reload,
  account load, and playback. The browser reported no console errors.
- Added `docs/LOCAL_DEMO.md` and updated startup instructions. The capstone's
  remaining features and teammate review remain separate work.

## 2026-10-06: shared OCS implementation

- Done: explicit shared stylesheet loader, theme tokens, native OCS components,
  static preference styles, and separate page/layout bundles.
- Done: consolidated canonical/prototype editor CSS; extracted UESL shell,
  social panels, toolkit, login, app, lesson/post and accessibility-widget CSS.
  The 11 style blocks in the modified existing files are now zero; historical
  inline attributes and unrelated old lessons remain outside this migration.
- Done: converted the infographic and plagiarism includes to OCS while retaining
  data interfaces and progress hooks. Added clearly labeled component references.
- Done: 23 frontend tests, three backend tests, local and alternate-baseurl
  Jekyll builds, desktop/mobile browser checks, login and account save/load/play.
- Done: ownership/extension guide in `_sass/open-coding/README.md`; startup and
  demonstration instructions updated in `docs/LOCAL_DEMO.md`.
- No backend implementation or schema changes were needed. No commits, pushes,
  hosted deployments, or issue-completion claims are part of this change.
- All four implementation stages are done; no required work is blocked.

## 2026-10-06: simplify the Sass organization

- Done: consolidated 20 implementation partials into five main files:
  `_core.scss`, `_site.scss`, `_app.scss`, `_game-maker.scss`, `_lessons.scss`.
- Done: merged login, small dashboard/lesson navigation, and arena-widget styles
  into the core and removed their separate stylesheet links/loaders. Total Sass
  files for this system decreased from 28 to 10 (five sources, five loaders).
- Done: updated the ownership guide; clean Jekyll build and all 23 frontend
  checks passed. Compared compiled CSS against a saved pre-change baseline and
  inspected login, profile, Flask and shared components in the running browser.
- No backend, startup-script, game behavior, commit, or push changes.

## 2026-10-07: remove repeated Sass implementations

- Done: replaced `_site.scss` and `_app.scss` with `_shell.scss`. The existing
  loaders compile the full-site and compact-app variants from one implementation
  of resets, navigation, responsive menus and authentication controls.
- Done: grouped repeated editor declarations for tool/action buttons, canvas
  frames, panel surfaces, modal backdrops, D-pad controls, voice/face controls
  and chat headings. Updated the ownership guide without adding dependencies.
- Implementation Sass decreased from 3,507 to 3,355 lines (152 fewer); four
  sources plus five loaders now replace the previous five sources/five loaders.
- Done: final Jekyll build, all 23 frontend tests, compiled-declaration comparison,
  desktop/mobile computed-style comparison and live sign-in/load/play checks.
  See `verification.md` for evidence and the scope of the comparisons.
- All stages are complete. Changes remain uncommitted; no backend or game-save
  format changes were needed. Historical styles outside OCS remain out of scope.

## 2026-10-07: independent frontend template

- Done: replaced the active GitHub fork with an independent template at the same
  `GameMaker-CSP/Frontend` URL. Main has one attributed template-import commit
  followed by the 13 original team commits, retaining their authors and merges.
- Done: moved issues #1–#7 with their original numbers, assignees, labels and
  Kanban item IDs/custom fields. All three teammates retain admin access.
- Done: preserved published main and committed OCS file trees exactly; mapped
  the four local branches to the new history without changing the pending Sass
  patch. Published the existing OCS branch as part of preserving the work.
- Done: retained the original fork and PR #8 at `Frontend-history`, plus local
  archive refs and a verified Git bundle. Backup archiving was cancelled after
  automatic approval review rejected that optional availability change.
- Done: verified GitHub reports `fork: false`, `is_template: true` and exactly
  RazorCrest00, ishans17321 and myhomies123 as contributors. No work is blocked.
- Teammates' old clones need fresh checkouts of the replacement repository before
  pushing; this local checkout is already updated. Other repositories were not
  converted in this frontend-specific migration.

## 2026-10-08: remove the old frontend repository

- Done: deleted `GameMaker-CSP/Frontend-history` at the user's explicit request.
  The organization now has only one frontend repository, `Frontend`.
- Done: verified the existing complete Git bundle and saved merged PR #8 metadata
  before deletion. Removed the obsolete local `history` remote and chat attachment.
- Done: verified the new repository remains an independent template with issues
  #1–#7. The local working copy and application code were preserved; no runtime
  tests were needed for this repository administration change.
- Recovery evidence remains in `/private/tmp/gamemaker-template-migration-2026-10-07/`
  and original local branch refs remain under `refs/archive/pre-template/`.

## 2026-10-12: use the inherited builder in Play

- Made Play the shared entry point for the inherited GameBuilder v1.2. Both
  standalone editor URLs redirect there, and invitation links preserve rooms.
- Preserved the newer editors' source and existing saves. Added a loader for
  the inherited builder's existing Sass so its controls render locally.
- Verified redirects, Game/Code/Split controls, demo login, and 26 frontend
  checks. Updated local demo instructions. Changes remain uncommitted.
- The inherited builder's account Save/Load requires the absent `/api/gamebuilder`
  endpoint; this routing change does not implement it or migrate saved games.

## 2026-10-12: OpenCS workbench in UESL

Requested outcome: bring the OpenCS workbench into Play and give the inherited
Open World and Racing builders the same OCS presentation, retaining their games.

Plan:
1. Done — inspected OpenCS source, inherited builders and runtime dependencies.
2. Done — integrated the workbench with isolated engine dependencies and built one Play shell.
3. Done — applied shared OCS panels and controls to inherited builders; preserved save formats.
4. Done — verified responsive layout, builder switching, create/run/stop/save,
   safe resize, independent review, 78 frontend checks and three backend tests.

Design direction: keep UESL navigation and colors, put the builder near the top
of Play, and reuse OpenCS's setup panel plus code/preview workspace. Workbench,
Open World and Racing are equal, named modes in one interface. Existing local
drafts retain their formats; no automatic conversion or backend schema change.

The user confirmed the actual workbench plus inherited builders, then clarified
the exact OpenCS folder layout. Desktop now uses setup / game / code columns,
with consistent Game / Code / Split controls. Run and Stop stay outside panels
that can be hidden. Browser testing exposed and fixed the inherited missing
D-pad positioning callback. No backend files or existing game data were changed.

All stages are done. The final Jekyll build passed and the three generated
builder routes and CSS were inspected. Desktop and phone views were checked
in the browser. Demo login and authenticated identity both returned HTTP 200.
Changes remain local and uncommitted; both local servers are still running.
Known account-save and external-service gaps are listed in limitations.md.

## 2026-10-13: colocate the three builder projects

Requested outcome: match the OpenCS feature-folder structure, with each builder
beside the others, preserving the working Play experience.

Plan:
1. Done — inspected the reference project structure and current route, asset,
   script, Sass and test ownership.
2. Done — move authored sources into `_projects/systems/gamebuilder`,
   `open-world` and `racing`; extract inherited scripts and split their Sass.
3. Done — publish project pages/assets through Jekyll while retaining game
   routes, saved-code image URLs and shared OCS/engine dependencies.
4. Done — update ownership docs, run tests and clean builds, then exercise
   all three builders on localhost and check live source regeneration.

Shared site layouts, OCS primitives, engines, runner includes and Play tab code
stay shared. Each feature owns its index, JS, Sass, images, docs and tests;
navigation and notebooks have explicit homes without inventing lesson content.

All four stages are complete. The final clean build and 81 frontend tests pass.
All three builders ran in the browser, existing Workbench recovery restored,
Racing responded to driving input, and Open World/Racing stopped correctly.
The project watcher rebuilt after a Racing JS source change. Both local servers
remain running. No commit or push was requested or made.

## 2026-10-13: Create task preparation issues and Kanban

Requested outcome: create a thorough College Board-aligned issue/sub-issue plan,
reuse the three personal hubs, and organize the existing organization board.

Plan:
1. Done — reviewed all seven existing issues, board fields/statuses, current
   project boundaries, official student directions, 2026 released scoring and
   the current 2027 exam overview.
2. Done — prepare a requirement map, owner-specific work, evidence gates,
   and dependencies; distinguish class preparation from formal AP submission.
3. Done — create native sub-issues, labels/milestones and board fields/views;
   repair outdated planning links without changing existing completion states.
4. Done — verify every issue's owner, parent, dependencies, milestone and
   board placement against the prepared inventory; report live links.

Frontend is the established issues home; Backend and MM-Pages have issues disabled.
No application code, student submission artifacts, commit, deployment or AP
Digital Portfolio action is part of this task.

Created Frontend #8–#34: one roadmap, eight shared tasks, and six sub-issues
under each existing personal hub (#2–#4). All 34 issues appear once on the
existing organization project, with 33 native parent links and 58 dependencies.
Added four milestones, Priority/Workstream fields and three focused views;
retained the original full table and Team Kanban. Existing issue #5 remains
In Progress; the other 33 cards are To Do / Backlog. Remote read-back checks
passed, including assignments, complete bodies, metadata, hierarchy, dependency
cycles, views, privacy and preservation of the seven original cards/checkboxes.

Start with roadmap https://github.com/GameMaker-CSP/Frontend/issues/8 and
Tuesday analysis https://github.com/orgs/GameMaker-CSP/projects/1/views/3.
All four planning stages are complete; actual implementation and student
discussion remain tracked work, not claims of completion.

## 2026-10-13: annotated UI guides in GitHub issues

Plan:
1. Done — capture current Workbench, Open World and Racing locally and prepare
   four issue-linked visual guides using the existing UESL/OCS appearance.
2. Done — upload final guides as native GitHub attachments and insert
   relevant callout explanations into the 20 UI-related parent/shared/feature issues.
3. Done — verify image rendering, unchanged issue metadata/checklists and
   preserved Kanban state; record the final issue links.

Images are illustrative AI-assisted proposals, not screenshots of implemented
future changes. Image files and intermediate work stay outside the repository
under `/private/tmp/gamemaker-issue-visuals-2026-10-13/`; no application code or
repository image assets are being changed. Original image-generation outputs
remain in the Codex generated-images directory.

All four final images are native GitHub attachments. Illustrated issues:
#1–#5, #8, #10, #12–#15 and #17–#25. Each includes alt text, numbered callout
guidance and the distinction between the current UI and proposed behavior.
All attachment URLs returned HTTP 200 as images without browser authentication.
Remote read-back confirms the original issue content, metadata and board state
are preserved. Browser checks confirmed the Rohan and Adhvay images render.
The temporary frontend server used for capture was stopped after the work.
All three stages are complete; no application implementation was performed.

## 2026-10-13: image-first issue revision

Completed the user's requested simpler format in the 20 illustrated issues:
replaced generated annotated guides with seven real browser screenshots and
33 short, issue-specific action captions. Full original requirements and
checkboxes remain inside expandable implementation sections. Verification
passed; issue metadata and Kanban fields/statuses are unchanged. Capture
assets remain under `/private/tmp/gamemaker-issue-photos-2026-10-13/`.
The temporary capture server was stopped; no application code was changed.

## 2026-10-22: compact UGRC-style Kanban presentation

Shortened all 34 existing project-card issue titles and added one-sentence
summaries (maximum 39 title characters / 17 summary words). Preserved the
original bodies, real screenshots, checklists, assignments and relationships.
Used UGRC-CSA/Pages and the current shared OC Kanban source as references.

Prepared a two-file OC capstone patch and a labeled local snapshot preview
using the unchanged OC include, JavaScript and stylesheet; added no CSS/Sass.
Publication read-back, snapshot assertions and browser owner/backlog/expansion
checks passed. Prepared files and screenshots are outside the workspace at
`/private/tmp/gamemaker-kanban-2026-10-22/`.

Blocked: public embedding needs approval to make the private organization
project public. The proposed board structure and OC capstone patch remain
unpublished. New issue/status updates arrived after verification, so the saved
status mapping must be refreshed before applying it. No application code,
commits or deployments were made for this task.

## 2026-10-22: public board and OCS PR #1852

User explicitly approved public project visibility and requested a PR. Refreshed
all 34 current cards, made the project public, added Owner filters, and aligned
Status options while preserving item IDs and live progress. Code Complete maps
to In review, Verified to Done, and eight P2 future cards to Backlog.

OCS PR https://github.com/Open-Coding-Society/pages/pull/1852 is open and mergeable.
Commit 6d71670b4 changes only the capstone Markdown and `_data/uesl_game_maker.yml`
(15 additions, 8 deletions). Shared CSS/Sass/JavaScript is unchanged. All four
PR-plan stages are complete. Maintainer review/merge and deployment remain
outside this requested PR-creation task. Temporary preview server stopped.

## 2026-10-23: account planning, lifecycle and localhost verification

Completed the requested Backend workstream planning in shared issue home
GameMaker-CSP/Frontend: parent #48, six native sub-issues #49–#54 with two
tasks per teammate, and upstream integration #55. All eight new cards are
Backlog / P1 with owners and dependencies; account issues use milestone #6.
Relevant login/profile/Play screenshots lead the UI issues. Applied collapsed
Quick/Formal lifecycle gates to 45 existing issues and reusable templates in
the project guide, preserving every old body, assignment and board field.
Remote read-back verified all 53 cards, six children, dependencies and guide.

Configured/fetched official Portfolio and Flask upstreams while retaining
Malware-Madness as legacy. Safe merge analysis found 104/38 conflicting paths;
no working-tree merge or commit was made. Issue #55 tracks integration.

Fixed the demonstrated profile save defect in `_layouts/profile.html` and
`assets/js/api/profile.js`: one awaited Flask update, honest success/failure
feedback, and no requests to the unavailable Spring group service. Added four
frontend helper tests and a Backend login/profile database integration test.
Updated `docs/LOCAL_DEMO.md`. Existing builder changes and backend startup
logging were preserved; no CSS was added in this task.

Both run scripts remain serving localhost:4700 and localhost:8424. Verified
invalid/valid login, profile save/reload/restoration and all three builder
Run/Stop paths. Frontend 85 tests and Backend four tests passed. The new quiz,
preferences, roles and upstream merge remain assigned planning, not completed
features. Code fixes remain local and uncommitted; no hosted deployment.
Evidence: `/private/tmp/gamemaker-login-upstream-2026-10-23/`.

## 2026-11-12: OCS account menu and UESL interest survey

Reused the upstream OCS profile/account and persona selection modules. Login,
survey, and profile share OCS-only markup and a data-driven account menu. Removed
custom profile CSS/Tailwind usage; no CSS or Sass authored. Preserved password/OTP
login and profile persistence through the existing Flask helpers. Added a UESL
catalogue with distinct aliases so existing school personas and answers survive.
The user requested audience-specific wording: no high-school/student-ID fields;
questions concern getting started, game interests, goals, and helpful options.
Validation details and source provenance: docs/OCS_ACCOUNT_FLOW.md. Deployment
remains paused; no commits, pushes, or server changes were made.

## 2026-11-12: community-first UESL website

Done: event and party inquiries, dated announcements, attributed community
photographs, verified location directory, event-first homepage, shared navigation,
and focused regression checks. Game Maker remains available between events.
Reused existing OCS components; added no CSS/Sass or dependencies.
Jekyll build, all 109 frontend tests, actual Liquid rendering checks, and desktop/
mobile browser verification passed. Fixed a UTC/Pacific event expiry boundary.
The request is split into seven local commits; earlier account/builder/deployment
work remains separate and preserved. No push or production deployment.
See docs/UESL_COMMUNITY.md for content maintenance and known source limitations.

## 2026-11-13: shared OCS site presentation

Replaced the UESL skin with shared OCS navigation, content, forms and native
dialogs. Community and account pages use one layout; duplicate inline auth
implementations and injected keyboard-help CSS are removed. Social API/storage
behavior and toolkit controls remain; existing game layouts are retained.
Removed the 1,471-line shell and both UESL style entry points. Baseline and audit
artifacts are outside the workspace at /private/tmp/uesl-ocs-uniform-20261113.
Initial build and 109 tests passed; browser login, saved survey, profile, help,
social dialogs and validation passed. Final responsive/game checks are pending.

Final result: 1,518 net Sass lines removed across the affected bundles. Community
CSS dropped from 77,952 to 19,733 bytes (74.7%); builder CSS dropped from 75,003 to
71,779 bytes. Final Jekyll build, 113 Node tests, actual Liquid template checks,
and diff whitespace checks passed. Both startup scripts are running on ports
4700/8424. Changes are local and uncommitted; prior work was preserved.

## 2026-11-13: signed-in preferences and main integration

Login now reads the authenticated account's saved UESL answers: incomplete
accounts see the optional survey, completed accounts go to Profile settings.
Survey/Profile public tabs are removed; an OCS account menu exposes settings
and logout only after login. Direct signed-out visits return to Login.
No new styling rules were authored. Rohan's eight existing guided validation
style lines moved into the consolidated game-maker Sass during the merge.

Merged the shared-OCS branch with existing main work rather than replacing main.
Preserved Rohan's navigation, theme catalogue, validated review and tests, plus
the Pages path handling and localhost checker. Updated Pages-output tests to
check the current Play workbench and legacy redirects.

Validation: local and /Frontend-prefixed builds pass; 122 frontend Node tests,
11 frontend Python tests and 7 isolated backend tests pass. Liquid community
render checks pass. Browser verified login, new-account survey, automatic save,
skip to profile, returning-account bypass, account isolation and signed-out
profile/survey redirects. Mobile profile: 390px viewport, 390px document width;
desktop: 1440px/1440px. Temporary local test account and answer removed afterward;
existing demo answers unchanged. Screenshot: /private/tmp/uesl-account-profile-final.png.
Production deployment remains paused; inherited console/build limitations remain
as recorded above. Email/OTP delivery was not exercised.
