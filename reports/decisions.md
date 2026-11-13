# Starter decisions

- 2026-10-05: build on the organization's existing guided flow at `b7b506f53`.
- Preserve the inherited `{game, nextId}` envelope and unknown fields.
- Keep the first configuration slice limited to the existing 40-unit title field.
  Use dependency-free modules and Node's built-in test runner.
- Agree on UI integration and accessibility persistence with the affected owners
  before changing those contracts.
- The title adapter copies only its two wrappers and shares unchanged nested
  data. It accepts parsed envelopes and leaves storage and live-state mutation
  to the existing editor. Envelope guards are not full level-data validation.

- 2026-10-06: preserve the individual starter commit history with a merge.
  Use a separate locked local Ruby bundle to keep the inherited hosting setup.
  Load the existing guided styles directly on the editor, independent of the
  theme's optional custom-style hooks; no visual redesign was introduced.
- Removed inherited credentials from the current tracked configuration and
  kept local environment files ignored. Existing history was not rewritten.

## 2026-10-06: OCS ownership

- Keep a small shared core and scoped product bundles. Importing the entire
  upstream OCS project aggregator would also load unrelated applications.
- Keep existing IDs, event handlers, game envelope, and public include paths.
  Reuse OCS class vocabulary with a UESL-native token implementation.
- Own the Minima head hook explicitly: local Minima 2 does not load the remote
  theme's custom-head hook. Verify each generated page's local CSS references.
- Core classes need normal class specificity. Browser verification demonstrated
  that zero-specificity `:where()` rules lost padding/color to the inherited
  universal reset; scoped product selectors still override core defaults.
- Theme application now changes variables rather than injecting fixed CSS.
  Reset removes every applied token; accent foreground picks black/white for
  contrast. Corrected Light preset text and light-surface secondary text.
- Keep progress percentages dynamic. Remove decorative progress-width animation.
  Preserve progress selector hooks and accessible locked/unlocked link behavior.
- Use labeled reference fixtures for plagiarism includes because this checkout
  has no actual plagiarism page/data. Do not invent coursework completion.

## 2026-10-06: consolidate Sass files

- Group by major surface rather than each small component. Shared controls and
  small views are sections within `_core.scss`; five three-line Jekyll loaders
  remain because they produce five independently loaded assets.
- Keep full-site, compact-app, editor and course bundles separate. Their global
  resets and similarly named navigation selectors cannot safely load everywhere.
- Scope the merged dashboard sidebar/main and arena helper selectors so the
  core does not impose dashboard positioning on the Flask course layout.
- Remove the login-specific body rule because it duplicated the UESL shell.

## 2026-10-07: deduplicate the shell and editor

- Share one `_shell.scss` implementation using the `$full-site` compile-time
  option. Preserve the five public CSS asset URLs and each layout's existing
  reset, login colors/radii, mobile overflow and focus-cascade behavior. The
  compact app continues to omit full-site social/content/toolkit styles.
- Prefer grouped selectors for identical declarations. Keep distinct component
  states and values explicit; avoid adding per-control files or generic mixins.
- Keep core, shell, editor and Minima lessons separate: they serve different
  surfaces, and concatenating their global rules would change the cascade.

## 2026-10-07: independent template history

- Create an independent template with a fresh baseline and replay only genuine
  team commits, preserving author identities and the existing merge structure.
  Retain the Apache license and baseline source attribution. The fresh baseline
  omits the inherited `.env` and uses the already-sanitized configuration.
- Retain the old repository as `Frontend-history` instead of GitHub's destructive
  fork-detachment option. Transfer the existing issues and preserve Kanban IDs;
  keep the original PR and historical branches accessible in the retained fork.
- Preserve the published main tree and OCS feature tree exactly. Pending Sass
  changes stay uncommitted. Keep original local refs under `refs/archive/pre-template/`.

## 2026-10-08: keep only the active frontend on GitHub

- The user's explicit removal request supersedes the earlier decision to keep
  `Frontend-history` online. Delete only that old repository, preserving the new
  independent template, its issues, the local checkout and local history backup.

## 2026-10-12: one public builder entry point for now

- Honor the user's choice of the inherited builder by placing the experience in
  Play and redirecting the newer editor URLs. Keep their source for later work.
- Reuse the inherited Sass through an explicit asset loader rather than copy
  styles. Keep the interactive frame visible without a scroll-reveal animation.
- Preserve existing saved-game formats. Document the inherited account API gap
  rather than silently adapting incompatible data or changing the backend.

## 2026-10-12: shared OpenCS builder workspace

- The user confirmed the actual OpenCS workbench plus inherited Open World and
  Racing, then pinned the local OpenCS setup / preview / code arrangement. Use
  that composition for all three, with UESL navigation and OCS theme tokens.
- Keep each builder in a retained, lazy-loaded same-origin frame. This isolates
  old global scripts and engines while retaining unfinished edits across tabs.
  Validate message origin and source for sizing and visibility commands.
- Scope presentation through one game-builder.css loader and shared builder Sass.
  Move Run/Stop outside the panels hidden by Game/Code views.
- Import current OpenCS workbench behavior and its required v1.1 essentials into
  isolated directories; preserve existing inherited engine files and save formats.
  Vendor the source checkout's Acorn 8.15.0 parser and retain licenses; no runtime
  CDN or package installation is required for the workbench.
- Correct the imported engine's resize and teardown lifecycle so changing views
  resizes existing canvases, hidden views keep valid dimensions, and stopped
  games cannot recreate canvases or leave input/timer handlers active.
- Preserve the inherited account-save limitation instead of silently converting
  incompatible game envelopes or changing the backend database.

## 2026-10-13: OpenCS-style builder source ownership

- Place `gamebuilder`, `open-world` and `racing` beside one another under
  `_projects/systems`, each with the same nine source entries as the reference.
- Move actual source instead of making duplicate copies or cosmetic wrapper
  folders. Extract inherited page scripts into each project's `js`; split the
  already-scoped legacy Sass into their respective `sass/main.scss` files.
- Keep shared OCS, frame/tab wiring, engines, vendor code and shared game art in
  their existing common locations. Runtime engines are not builder page source.
- Use a small Jekyll generator rather than importing OpenCS's full project
  registration/Makefile system. It publishes directly to `_site`, runs through
  existing startup/build workflows, and does not create scattered authored copies.
- Preserve all three page permalinks, image URLs, template-catalog compatibility
  URL, storage keys and game formats. Mirror JS directory depth when publishing
  so shared relative imports resolve both in Node tests and in the browser.
- Reserve navigation and lesson homes with descriptive READMEs; no unrelated
  lesson notebooks or screenshot assets were copied. Racing's artwork is procedural.

## 2026-10-13: College Board preparation issue structure

- Keep Frontend as the shared issues home and retain personal hubs #2–#4.
  Backend/MM-Pages issue settings remain unchanged. Link six concrete new tasks
  to each owner and shared planning/integration gates to roadmap #8.
- Use current official student directions and the 2027 exam overview, while
  labeling released 2026 scoring prompts as examples. Map useful capstone
  behavior to evidence instead of claiming that OCS, Flask, commits or a Kanban
  board are separate College Board scoring requirements.
- Separate class practice, inherited/AI-assisted code and future formal artifacts.
  Record genuine student authorship, understanding and teacher clarification;
  individual formal artifacts remain the student's responsibility.
- Preserve original issue bodies/checkboxes and project card statuses. Correct
  obsolete repository/board links and prepend the current scope note. Use native
  sub-issues and dependencies, four undated milestones, two planning fields and
  five views; do not fabricate classroom dates or implementation completion.

## 2026-10-13: prefer real screenshots and short issue captions

User requested pictures with brief explanations rather than annotated graphics
and long paragraphs. The 20 visual issues now lead with relevant real UI
screenshots and action captions; the full original planning and College Board
requirements remain expandable for implementation. This supersedes the earlier
annotated-guide presentation, preserving all issue ownership and board state.

## 2026-10-22: reuse OC Kanban and keep issue details expandable

Reuse the same shared Kanban component as UGRC CSA, with short task titles,
owner filters and the existing backlog toggle. Add no CSS/Sass or duplicate
renderer. Retain full requirements and screenshots beneath concise summaries.
Keep project privacy unchanged until explicitly approved. The prepared
structure proposes To do / In progress / In review / Done, with future work
in Backlog; refresh live status values before applying any migration.

## 2026-10-22: approved public board and current-state migration

Explicit user approval resolved the visibility boundary. Keep the existing
project and issue identities; preserve teammates' current progress instead of
applying the earlier snapshot. Rename Code Complete to In review and Verified
to Done, reuse the previously empty Deployed option as Backlog, and move only
P2 future tasks out of To do. Shared tasks use Everyone in the new Owner field.
Submit the existing OC include and YAML wiring as a two-file PR, without new
CSS, copied renderers, app code, or a production merge.

## 2026-10-23: shared issue home and evidence-based account planning

Keep Frontend as the existing shared issue home, with the Backend workstream
used for the full account journey. The parent has Ishan as coordinator and
Everyone as board owner; six implementation/verification tasks are split two
per teammate. Use native sub-issues and blocked-by links. Add collapsed gates
without resetting historical statuses or claiming teacher acceptance.

Use the existing Flask account API as the local source of truth. A profile
update must resolve successfully before showing Saved; HTTP/network failures
must remain visible and keep editable values. Do not create a parallel Spring
account or weaken OTP/authentication to make the local demo pass.

Fetch official upstreams, but preserve the current application and uncommitted
builder work while conflicts are reviewed. `git merge-tree` provides an
integration inventory without changing working files. No upstream merge is
claimed; #55 owns the separate integration and build acceptance criteria.

## 2026-11-12: reuse OCS survey mechanics, tailor the content

Keep OCS's persona API category keys for compatibility; introduce gm- catalogue
aliases for UESL instead of reinterpreting historical answers. Map newer OCS card
classes to existing local OCS primitives. Share an account-menu include across
login/survey/profile. Retain Flask OTP/signup rather than importing school-only
Google verification or a Spring dependency. No new CSS/Sass.

## 2026-11-12: prioritize UESL gatherings and reuse OCS

Use the incumbent visual system for the community surfaces. Events, announcements,
photos, locations, and visits precede the between-events Game Maker. Keep source
data in small shared JSON files; reference the official site for live availability.
Do not invent event dates, prices, participant counts, or registration confirmation.
Replace the invalid contact endpoint with the official form and a local email-draft
helper. Remove the simulated newsletter success. Keep externally hosted photos
attributed. Render all event records so the browser can apply Pacific-time expiry
even when the build server uses another timezone. No new CSS/Sass or backend API.

## 2026-11-13: remove the separate UESL skin

Use the existing OCS core rather than adding another set of theme overrides.
Native dialog/details behavior replaces overlay/dropdown CSS and its duplicate
open/close handling. Authentication stays on the existing OCS account page.
Retain the existing accessibility rules in core and builder geometry in the
builder bundle. They implement reading aids and editor behavior. Do not touch
canvas coordinates, runtime colors, backend schema, or game-save formats.
Keep Inter and OCS tokens despite generic design-detector warnings: the user's
requirement is consistency with the incumbent OCS system. The lightbox image
gets its source only when a selected chat image opens it; no placeholder is shown.
