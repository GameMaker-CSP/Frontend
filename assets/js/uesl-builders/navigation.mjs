export const builderKinds = Object.freeze(['workbench', 'open-world', 'racing']);

export function selectedBuilder(search) {
  const params = new URLSearchParams(search);
  const requested = params.get('builder');
  if (builderKinds.includes(requested)) return requested;
  return params.has('room') ? 'open-world' : 'workbench';
}

export function builderSource(path, origin, search, kind) {
  const url = new URL(path, origin);
  if (url.origin !== origin) throw new Error('A builder must use the same origin as Play.');
  url.searchParams.set('embed', '1');
  const room = new URLSearchParams(search).get('room');
  if (room && kind === 'open-world') url.searchParams.set('room', room);
  return url.href;
}

export function builderLocation(href, kind) {
  if (!builderKinds.includes(kind)) throw new Error('Unknown builder.');
  const url = new URL(href);
  url.searchParams.set('builder', kind);
  url.hash = 'game-builder';
  return url.href;
}

export function nextBuilderIndex(key, current, length) {
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  if (key === 'ArrowRight') return (current + 1) % length;
  if (key === 'ArrowLeft') return (current + length - 1) % length;
  return null;
}
