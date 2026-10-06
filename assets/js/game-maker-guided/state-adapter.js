import { validateGameTitle } from './validation.js';

/**
 * Prototype one guided choice against an existing {game, nextId} save.
 * Returns new wrappers; nested level data remains shared and must be treated as read-only.
 * This checks the envelope, not whether every level is playable.
 * @param {unknown} snapshot A parsed inherited save or current editor snapshot.
 * @param {unknown} title The participant's proposed title.
 */
export function configureGameTitle(snapshot, title) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)
      || !snapshot.game || typeof snapshot.game !== 'object' || Array.isArray(snapshot.game)
      || !Array.isArray(snapshot.game.levels)
      || !Number.isSafeInteger(snapshot.nextId) || snapshot.nextId < 1) {
    return {
      ok: false,
      errors: [{
        field: 'savedGame', code: 'invalid_save_envelope',
        message: 'This saved game could not be read. Your current game has not been changed.',
      }],
    };
  }

  const result = validateGameTitle(title);
  if (!result.ok) return result;

  return {
    ok: true,
    value: {
      ...snapshot,
      game: { ...snapshot.game, title: result.value },
    },
  };
}
