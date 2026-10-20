/* Shared, data-driven comfort profiles for the guided Game Maker. */
(function (root) {
  'use strict';

  const SETTING_KEYS = ['slowMode', 'highContrast', 'largeSprites', 'reduceMotion'];
  const PROFILE_RULES = [
    { id: 'balanced', settings: { slowMode: false, highContrast: false, largeSprites: false, reduceMotion: false } },
    { id: 'calm', settings: { slowMode: true, highContrast: false, largeSprites: false, reduceMotion: true } },
    { id: 'focus', settings: { slowMode: false, highContrast: true, largeSprites: true, reduceMotion: false } },
  ];

  function resolveProfile(profileId, overrides = {}, current = {}) {
    const result = { ...current };
    const profile = PROFILE_RULES.find(rule => rule.id === profileId) || PROFILE_RULES[0];
    for (const rule of PROFILE_RULES) {
      if (rule.id !== profile.id) continue;
      for (const key of SETTING_KEYS) {
        if (typeof rule.settings[key] === 'boolean' && typeof overrides[key] !== 'boolean') {
          result[key] = rule.settings[key];
        }
      }
    }
    for (const key of SETTING_KEYS) {
      if (typeof overrides[key] === 'boolean') result[key] = overrides[key];
    }
    return result;
  }

  root.GameMakerAccessibility = Object.freeze({ SETTING_KEYS, PROFILE_RULES, resolveProfile });
})(typeof window === 'undefined' ? globalThis : window);
