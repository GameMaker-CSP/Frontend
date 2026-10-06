# Existing accessibility controls — issue #3

The guided builder and preview in `pages/game-maker.html` share the existing
`a11y` object. Guided controls update the matching Settings checkbox.

| Support | Guided control | Existing setting / state | Preview behavior |
| --- | --- | --- | --- |
| Slow mode | `gm-guided-slow` | `gs-slow` / `a11y.slowMode` | Movement runs at 0.45× normal speed. |
| High contrast | `gm-guided-contrast` | `gs-contrast` / `a11y.highContrast` | Canvas uses a black background and brighter, outlined game objects. |
| Larger characters | `gm-guided-large` | `gs-large` / `a11y.largeSprites` | Player size becomes 52 pixels; stars, NPCs, and labels also draw larger. |

Reduced motion already exists as `gs-reduce` / `a11y.reduceMotion`; it suppresses
particles and reduces visual effects. These are the page's existing Canvas
preview controls, separate from the `GameEnginev1.2` module runtime.
