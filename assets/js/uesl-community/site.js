// OCS visibility utilities also apply to asynchronously rendered form fields.
(() => {
  const syncAdded = node => {
    if (node.nodeType !== 1) return;
    // Class-only visibility is owned by the component, not this observer.
    if (node.hidden) node.classList.add('ocs__hidden');
    node.querySelectorAll('[hidden]').forEach(child => child.classList.add('ocs__hidden'));
  };
  document.querySelectorAll('[hidden]').forEach(syncAdded);
  const observer = new MutationObserver(records => records.forEach(record => {
    if (record.type === 'attributes') record.target.classList.toggle('ocs__hidden', record.target.hidden);
    else record.addedNodes.forEach(syncAdded);
  }));
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden'] });
})();

// Keep the logo and controls on one row, with the same links in the compact menu.
(() => {
  const button = document.getElementById('nav-menu-toggle');
  if (!button) return;
  const nav = document.getElementById('nav');
  const compact = window.matchMedia('(max-width: 69rem)');
  function resize() {
    button.hidden = !compact.matches;
    nav.hidden = compact.matches;
    button.setAttribute('aria-expanded', String(!nav.hidden));
  }
  button.addEventListener('click', () => {
    nav.hidden = !nav.hidden;
    button.setAttribute('aria-expanded', String(!nav.hidden));
  });
  compact.addEventListener('change', resize);
  resize();
})();
