// UESL adaptation: keep the current OpenCS runtime separate from inherited games.
export const ENGINE_PATH = '/assets/js/opencs-engine/GameEnginev1.1/';

export function normalizeEngineImport(path) {
  return path.replace(/^\/assets\/js\/GameEnginev1\.1\//, ENGINE_PATH);
}

export function createGameImportResolver(baseUrl) {
  const moduleBase = `${baseUrl}${ENGINE_PATH}`;
  return {
    gameModule: `${moduleBase}essentials/Game.js`,
    resolve(importPath) {
      if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(importPath) || importPath.startsWith('@')) {
        return importPath;
      }
      const path = normalizeEngineImport(importPath);
      if (path.startsWith('/')) return `${baseUrl}${path}`;
      if (path.startsWith('./') || path.startsWith('../')) return new URL(path, moduleBase).href;
      return `${baseUrl}/${path}`;
    }
  };
}
