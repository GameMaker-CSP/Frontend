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
