import { selectedBuilder, builderSource, builderLocation, nextBuilderIndex } from './navigation.mjs';

const root = document.querySelector('[data-builder-switcher]');
const tabs = [...root.querySelectorAll('[role="tab"]')];
const panels = [...root.querySelectorAll('[data-builder-panel]')];
let activeKind;

function notifyFrame(frame, visible) {
  if (frame.hasAttribute('src')) {
    frame.contentWindow.postMessage({ type: 'uesl:builder-visibility', visible }, location.origin);
  }
}

function selectBuilder(kind, { updateLocation = true, focus = false } = {}) {
  activeKind = kind;
  for (const tab of tabs) {
    const active = tab.dataset.builder === kind;
    tab.setAttribute('aria-selected', String(active));
    tab.classList.toggle('accent', active);
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  }
  for (const panel of panels) {
    const active = panel.dataset.builderPanel === kind;
    const frame = panel.querySelector('iframe');
    panel.hidden = !active;
    // Retain each iframe: switching never discards in-progress code or settings.
    if (active && !frame.hasAttribute('src')) {
      frame.src = builderSource(frame.dataset.src, location.origin, location.search, kind);
    }
    notifyFrame(frame, active);
  }
  if (updateLocation) history.replaceState(null, '', builderLocation(location.href, kind));
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectBuilder(tab.dataset.builder));
  tab.addEventListener('keydown', event => {
    const next = nextBuilderIndex(event.key, index, tabs.length);
    if (next === null) return;
    event.preventDefault();
    selectBuilder(tabs[next].dataset.builder, { focus: true });
  });
});

for (const panel of panels) {
  const frame = panel.querySelector('iframe');
  frame.addEventListener('load', () => notifyFrame(frame, panel.dataset.builderPanel === activeKind));
}

window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.data?.type !== 'uesl:builder-size') return;
  const frame = panels.map(panel => panel.querySelector('iframe')).find(item => item.contentWindow === event.source);
  const height = event.data.height;
  if (!frame || !Number.isFinite(height) || height < 200 || height > 20000) return;
  frame.style.height = `${Math.ceil(height)}px`;
});

window.addEventListener('popstate', () => selectBuilder(selectedBuilder(location.search), { updateLocation: false }));
window.addEventListener('pagehide', () => panels.forEach(panel => notifyFrame(panel.querySelector('iframe'), false)));
selectBuilder(selectedBuilder(location.search), { updateLocation: false });
