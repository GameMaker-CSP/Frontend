const content = document.querySelector('.uesl-builder-content');
const toggle = document.querySelector('[data-toggle-setup]');
const workbenchViews = [...content.querySelectorAll('[data-workbench-view]')];
for (const button of workbenchViews) {
  button.addEventListener('click', () => {
    button.closest('.game-runner-container').dataset.view = button.dataset.workbenchView;
    for (const option of workbenchViews) {
      const active = option === button;
      option.classList.toggle('active', active);
      option.setAttribute('aria-pressed', String(active));
    }
    window.dispatchEvent(new Event('resize'));
  });
}
if (toggle) {
  toggle.setAttribute('aria-expanded', 'true');
  toggle.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('is-setup-collapsed');
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.textContent = collapsed ? 'Show setup' : 'Hide setup';
  });
}

// Name the inherited symbol buttons and associate their adjacent form labels.
for (const button of content.querySelectorAll('button[data-tooltip], button[title]')) {
  if (!button.hasAttribute('aria-label')) button.setAttribute('aria-label', button.dataset.tooltip || button.title);
}
for (const label of content.querySelectorAll('label:not([for])')) {
  const input = label.nextElementSibling;
  if (input?.matches('input[id], select[id], textarea[id]')) label.htmlFor = input.id;
}
for (const editor of content.querySelectorAll('textarea:not([aria-label])')) {
  editor.setAttribute('aria-label', 'Game code');
}

if (window.parent !== window) {
  let previousHeight = 0;
  const reportSize = () => {
    const height = Math.ceil(content.getBoundingClientRect().height);
    if (height < 200 || height === previousHeight) return;
    previousHeight = height;
    window.parent.postMessage({ type: 'uesl:builder-size', height }, location.origin);
  };
  new ResizeObserver(reportSize).observe(content);
  window.addEventListener('load', reportSize);
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== window.parent || event.data?.type !== 'uesl:builder-visibility') return;
    if (event.data.visible === false) window.dispatchEvent(new CustomEvent('uesl:pause-builder'));
    else { previousHeight = 0; reportSize(); }
  });
  reportSize();
}
