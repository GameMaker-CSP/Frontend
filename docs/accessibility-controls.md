# Existing accessibility controls — issue #3

The guided builder and preview in `pages/game-maker.html` share the existing
`a11y` object. Guided controls update the matching Settings checkbox. The
data-driven profiles live in `assets/js/game-maker-accessibility.js` and are
unit tested in `tests/game-maker-guided/accessibility.test.cjs`.

| Support | Guided control | Existing setting / state | Preview behavior |
| --- | --- | --- | --- |
| Slow mode | `gm-guided-slow` | `gs-slow` / `a11y.slowMode` | Movement runs at 0.45× normal speed. |
| High contrast | `gm-guided-contrast` | `gs-contrast` / `a11y.highContrast` | Canvas uses a black background and brighter, outlined game objects. |
| Larger characters | `gm-guided-large` | `gs-large` / `a11y.largeSprites` | Player size becomes 52 pixels; stars, NPCs, and labels also draw larger. |
| Reduced motion | `gm-guided-reduce` | `gs-reduce` / `a11y.reduceMotion` | Particles and visual effects are reduced in the game preview. |

Profiles are Balanced (all four supports off), Calm (slow mode and reduced
motion), and Focus (high contrast and larger characters). Changing an
individual checkbox overrides that setting for the selected profile; choosing
another profile or pressing “Use profile defaults” clears those overrides.
Unknown profile IDs fall back to Balanced. The resolver changes only its four
supported settings and leaves unrelated audio and game preferences intact.

Reduced motion already exists as `gs-reduce` / `a11y.reduceMotion`; it suppresses
particles and reduces visual effects. These are the page's existing Canvas
preview controls, separate from the `GameEnginev1.2` module runtime.

This document describes code behavior, not a completed manual accessibility
audit. Keyboard-only operation, 200% zoom, narrow-screen layouts, touch
steering, and independent teammate feedback still require hands-on verification
for each supported builder.
