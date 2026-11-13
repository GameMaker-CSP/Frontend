# Starter limitations

- These tasks do not complete Frontend #4. Guided UI integration, broader input
  validation, draft recovery, accessibility persistence, and teammate review remain.
- Existing saved-game parsing trusts nested level data; these starter helpers do
  not establish that an arbitrary save is safe to play.
- The earlier localhost fixes are not part of these three starter commits.
  They are included separately in the 2026-10-06 integration.
- Accessibility options are not saved in the inherited game envelope; select
  Calm again after a reload. Adhvay's new helpers remain standalone modules.
- AI, email, Google OAuth, webcam/voice controls, multiplayer, and hosted
  deployment were not verified in the localhost foundation demo.
- The inherited Jekyll content still emits Sass deprecations, Liquid warnings,
  and duplicate tutorial/capstone routes outside the tested editor and login.
- Old credential values may still exist in inherited Git history. Owners must
  revoke any real exposed credentials; removing current values is not rotation.

## Shared OCS scope

- Shared components, active shells, both editors, login, and instructional
  includes are migrated. This does not eliminate every inline attribute or
  rewrite the repository's historical games, lessons, canvas rendering, and
  generated runtime styling. New static shared styles belong in OCS.
- Local Minima and an alternate project baseurl were built and checked. The
  remote hosted theme and deployment were not run or changed.
- The inherited Flask infographic illustrations are absent from this checkout.
  The include now omits missing images and preserves text/link navigation.
- The local backend has no user-preferences endpoint. The existing optional
  sync attempt returns 404; local theme application works. Cross-device theme
  storage and external services are not added by a styling migration.
- Jekyll still reports inherited Sass deprecations, Liquid warnings and duplicate
  legacy tutorial/capstone routes; the tested primary routes resolve correctly.

## OpenCS / inherited builders in Play

- The actual workbench, Open World and Racing run locally, but retain separate
  save formats and engines. Switching tabs preserves edits for this page session;
  only each builder's existing persistence rules survive reloads. Workbench JSON
  export is the portable backup. No automatic save conversion is performed.
- Open World's existing account Save/Load uses the absent /api/gamebuilder
  endpoint. The backend's /api/game API remains for the preserved newer editor;
  local login works. Account saves were not presented as an integrated feature.
- Multiplayer, hosted deployment, camera/microphone controls and external
  AI/email/OAuth integrations were not verified in this UI integration.
- Racing retains keyboard steering; this change verifies mobile layout but does
  not add touch steering to that inherited game.
- The workbench uses the native textarea fallback rather than a CodeMirror CDN.
  Supported settings can be pulled from code; custom logic prevents destructive
  regeneration. The only supported workspace engine is the imported v1.1.

## 2026-10-13: builder source organization

- Jekyll custom plugins must remain enabled to publish `_projects`; the existing
  local startup and GitHub Actions build already use normal plugin-enabled builds.
  This turn verified local builds, not a new hosted deployment.
- Notebook folders reserve source ownership only. No lessons were invented or
  automatically wired into the inherited notebook conversion pipeline.
- This reorganization does not change earlier account-save, multiplayer, camera
  or microphone limitations. Public routes, game formats and storage keys remain.

## 2026-10-22: public capstone Kanban approval

The shared OC Kanban requires a public organization project. GameMaker-CSP
project #1 remains private pending explicit approval; the capstone patch and
proposed fields/stages are prepared only. Its snapshot preview is not a live
board. Refresh project data before continuing because teammates updated issue
progress during this task. No full-site deployment or mobile check is claimed.

## 2026-10-22: visibility blocker resolved; PR awaiting review

Public visibility was explicitly approved and applied. Live API, full build
and desktop/phone-width checks now pass, superseding the preparation-only
limitations above. OCS PR #1852 has not been merged or deployed; no GitHub CI
checks were reported when inspected. Existing unrelated local microblog fetch
failure and site-wide post_url warnings remain outside this two-file change.

## 2026-10-23: current account and upstream boundaries

- Official upstreams are fetched, not merged. The 104 frontend / 38 backend
  conflict inventory excludes the current uncommitted builder work. #55 must
  preserve that work and validate the integrated application before committing.
- Verified local login, name persistence and three builder previews do not
  establish delivery of the new interest quiz, gameplay preferences, role
  adaptation or inherited `/api/gamebuilder` account saving. These remain
  planned work. Email/OAuth and hosted deployment were not exercised.
- Lifecycle labels/gates and project templates do not certify existing review
  evidence. Existing statuses were retained, with no fabricated presentation or
  acceptance. Templates are copyable in the Project guide, not new issue forms.
- Frontend profile fixes and new tests remain uncommitted alongside prior work.
  Python deprecation/resource warnings, optional KASM configuration warnings,
  and inherited Jekyll route/Liquid/Sass warnings remain; test/build results pass.
- Desktop verification passed; the browser viewport request did not produce a
  phone-sized layout, so responsive profile verification remains outstanding.
