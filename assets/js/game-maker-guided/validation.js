// Match the existing guided and advanced title inputs' maxlength.
export const MAX_GAME_TITLE_LENGTH = 40;

/**
 * Validate a proposed title without changing editor state.
 * @param {unknown} value
 * @returns {{ok: true, value: string} | {ok: false, errors: Array<{field: string, code: string, message: string}>}}
 */
export function validateGameTitle(value) {
  const failure = (code, message) => ({
    ok: false,
    errors: [{ field: 'title', code, message }],
  });
  if (typeof value !== 'string') {
    return failure('title_type', 'Enter your game name as text.');
  }
  const title = value.trim();
  if (!title) {
    return failure('title_required', 'Give your game a name.');
  }
  if (title.length > MAX_GAME_TITLE_LENGTH) {
    return failure('title_too_long', 'Shorten your game name to fit the 40-character limit.');
  }
  return { ok: true, value: title };
}
