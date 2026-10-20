// These are inherited procedural backgrounds in pages/game-maker.html.
// They introduce no new media or licenses and preserve the engine's background IDs.
export const GUIDED_THEMES = Object.freeze([
  { id: 'space', label: '🚀 Deep Space', modes: ['collect-stars'] },
  { id: 'sunset', label: '🌅 Sunset', modes: ['collect-stars'] },
  { id: 'ocean', label: '🌊 Ocean Sky', modes: ['collect-stars'] },
  { id: 'maze', label: '🌀 Maze', modes: ['maze'] },
].map(theme => Object.freeze({ ...theme, modes: Object.freeze(theme.modes) })));

/** Return eligible choices, or resolve one choice without changing editor state. */
export function selectGuidedTheme({ id, mode = 'collect-stars' } = {}, catalog = GUIDED_THEMES) {
  const options = [];
  let selected;
  for (const theme of catalog) {
    if (!theme.modes.includes(mode)) continue;
    options.push(theme);
    if (theme.id === id) selected = theme;
  }
  if (id !== undefined && !selected) {
    return { ok: false, options, errors: [{
      field: 'background', code: 'theme_unavailable',
      message: 'Choose an available background for this game type.',
    }] };
  }
  return { ok: true, options, selected };
}
