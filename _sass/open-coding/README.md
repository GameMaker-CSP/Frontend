# Shared Open Coding Sass (OCS)

This is the GameMaker-CSP shared presentation system. It keeps the UESL identity
and existing editor behavior while moving shared styles out of page templates.
Use native HTML with `ocs__*` classes for new controls and instructional content.

## Loading and ownership

`_includes/ocs-styles.html` loads `/assets/css/ocs.css` exactly once. UESL pages
include it directly; app pages use `head-custom.html`; the local/remote Minima
head uses the same hook. This avoids depending on an optional theme import.
All entry-point links use `relative_url` so project base paths work.

The core site styles are grouped into three implementation files. The combined
builder adds one scoped bundle with imported workbench styles, inherited game
overlays and shared presentation. Small shared controls remain sections within
`_core.scss`, not separate files.

| Source file | Compiled output | Responsibility |
| --- | --- | --- |
| `_core.scss` | `ocs.css` | Tokens, buttons/cards/forms, preferences and accessibility behavior, infographic/module/case components, login, small lesson navigation and arena widget |
| `_game-maker.scss` | `game-maker.css` | Both editors, playback, settings/dialogs, guided flow and OCS integration |
| `_lessons.scss` | `ocs-lesson-player.css` | Minima course/post shell and submission styles |

Community and account pages load only `ocs.css`. The separate UESL site/app skins
have been deleted. `game-builder.scss` is loaded only by Play and its three frames:

| Builder source | Responsibility |
| --- | --- |
| `forms/game-builder.scss` | Inherited builder layout primitives |
| the `open-world` and `racing` project Sass | Inherited drawing overlays, race HUD, garage and results |
| `_projects/systems/gamebuilder/sass/main.scss` | Imported OpenCS workbench and runner components, scoped to the builder frame |
| `_builder-shell.scss` | One shared setup/preview/code layout, controls, tabs and responsive rules for all three builders |

The shell imports last so shared presentation wins without duplicating a skin
in every game. Put common builder styling there; keep canvas-specific rules in
the `open-world` and `racing` project Sass. Both the inherited and imported runtime engines retain
their own behavior. Source attribution is recorded in `docs/OPENCS_SOURCE.md`.

`uesl`, `uesl-app`, and `ocs-account` share one OCS site layout. Navigation,
footer, tools, and social markup live in `_includes/uesl-*.html`; behavior lives in
`assets/js/uesl-community/`. Native dialogs supply modality, keyboard dismissal,
and focus restoration. Sign-in and registration use the existing `/login` page.
There is no second sign-in modal or stylesheet injected by keyboard help.

The builder bundle keeps canvas geometry, code-editor layout and game overlays.
Core retains the existing reading ruler, high contrast, focus and dyslexia modes;
these are functional accessibility styles, not a separate UESL skin.

Do not import all of this into the old `minima/custom-styles.scss`, or recreate
per-component stylesheets. Both editors intentionally share one bundle.

The class grammar follows the Open Coding Society OCS reference inspected in
`opencs/pages/_sass/open-coding/README.md` at commit `0a58765e7`.
This repository's implementation adapts that vocabulary to the existing UESL
variables and native controls; it does not vendor every upstream project or
claim compatibility with every upstream modifier. Existing source attribution
and licenses remain in place.

## Public components

| Classes | Use |
| --- | --- |
| `ocs__container`, `ocs__stack`, `ocs__links` | Bounded content, vertical groups, wrapping actions |
| `ocs__grid`, `cols-2` / `cols-3` / `cols-4`, `ocs__grid-cell` | Responsive grids; explicit columns above 48rem |
| `ocs__card` | A bordered surface, with padding and theme colors |
| `ocs__btn` | Native button or navigation link, minimum 44px height |
| `accent`, `fill`, `pill`, `large`, `utility`, `alert-red/green/yellow` | Button modifiers; use with `ocs__btn` |
| `ocs__field`, `ocs__input`, `ocs__toggle` | Labeled native form controls; toggle wraps a checkbox |
| `ocs__section-title`, `ocs__description`, `ocs__caption` | Heading and readable supporting text |
| `ocs__badge`, `ocs__status-pill`, `ocs__status-pill--good/warn/bad` | Labels/status; always include text |
| `ocs__table-wrap`, `ocs__table` | Scrollable semantic table |
| `ocs__image-frame`, `ocs__callout` | Media frame and supporting message |
| `ocs__hidden`, `ocs__sr-only` | Hidden content and screen-reader-only labels |

Use `disabled` on native buttons. A disabled link also needs
`aria-disabled="true"`, removal from the tab order, and a click guard; CSS alone
does not disable navigation. Focus outlines remain visible. Components do not
remove native semantics or attach business logic.

```html
<section class="ocs__card ocs__stack" aria-labelledby="game-name-heading">
  <h2 class="ocs__section-title" id="game-name-heading">Name your game</h2>
  <label class="ocs__field">
    Game name
    <input class="ocs__input" maxlength="40">
  </label>
  <label class="ocs__toggle"><input type="checkbox">Slower gameplay</label>
  <div class="ocs__links"><button class="ocs__btn accent fill">Continue</button></div>
</section>
```

## Tokens and preferences

The Theme tokens section of `_core.scss` owns default UESL colors/fonts and OCS aliases. Prefer
`--pref-text-color`, `--pref-bg-color`, `--pref-accent-color`, `--panel`,
`--panel-mid`, `--ui-border`, `--text-muted`, and `--ocs-space` in shared rules.

`assets/js/user-preferences.js` sets values and state only. Its fixed override
selectors live in the Preference overrides section of `_core.scss`; it no longer injects style blocks.
Reset removes inline tokens, revealing Sass defaults. Filled actions use a
black or white foreground chosen for the accent's contrast. The Light preset
has readable dark text. Arbitrary user-selected background/text pairs still
need a contrast check; the system does not silently replace custom choices.

Keep existing scoped `gm-*`, `slm-*`, and UESL selectors for product composition.
Shared controls use OCS class selectors. Scoped builder styles load afterward
for canvas layout and runtime states.
Preferences and reduced-motion styles must continue to work after extensions.

## Instructional components

The existing `tailwind/infograph.html`, `plagiarism_info.html`, and
`plagiarism_cases.html` paths remain compatible, but their markup now uses OCS.
The Flask infographic no longer needs the Tailwind CDN. It keeps existing
course titles, data and links; absent inherited illustrations are omitted while
the text navigation remains available.

Plagiarism includes read `page.lxdData` by default, or `include.data` for a
reference/example. Existing progress storage keys and lesson links are retained.
Progress hooks survive repeated updates; locked links cannot be activated by
keyboard or click, and unlocked links regain their tab stop.

See `/ocs-components/` for real shared controls and Light/Ocean/reset checks.
`/ocs-components/lessons/` renders explicitly illustrative data because this
checkout has the plagiarism includes but no actual plagiarism course page/data.
Do not present those examples as completed course assignments.

## Adding or changing styles

1. Reuse a component first. Add shared presentation to a named section in `_core.scss`; add product layout rules to its existing main file.
2. Use page-specific selectors only for layout or behavior unique to that page.
   Group selectors when controls share the same declarations, as the editor
   does for voice/face controls, canvas frames, panel surfaces and button bases.
   Keep differences and states beside their component; preserve specificity and
   cascade order instead of adding overrides or a mixin for every small rule.
3. Avoid new static inline styles, generated CSS strings, global input rules,
   and a new stylesheet for each tiny variation.
4. Runtime canvas coordinates, colors chosen in the editor, progress percentages,
   and dynamic visibility may stay in JavaScript. Historical inline attributes
   remain a migration backlog; this change is not a rewrite of every old lesson.
5. Run the startup scripts and checks in `docs/LOCAL_DEMO.md`. Inspect the actual
   page at desktop and mobile widths, with keyboard focus and theme changes.

No new runtime packages, backend schema changes, or game-save format changes
are required by OCS.

Builder source folders and publication paths are documented in
[`_projects/README.md`](../../_projects/README.md). Edit each builder’s `sass/main.scss`
there; `assets/css/game-builder.scss` loads them together with the shared OCS shell.
