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
