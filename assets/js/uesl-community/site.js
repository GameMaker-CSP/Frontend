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
  const header = button.closest('header');
  new ResizeObserver(() => {
    document.documentElement.style.setProperty('--uesl-header-height', header.offsetHeight + 'px');
  }).observe(header);
  const nav = document.getElementById('nav');
  const compact = window.matchMedia('(max-width: 69rem)');
  function resize() {
    button.hidden = !compact.matches;
    nav.hidden = compact.matches;
    button.setAttribute('aria-expanded', String(!nav.hidden));
  }
  button.addEventListener('click', () => {
    closeMenus();
    nav.hidden = !nav.hidden;
    button.setAttribute('aria-expanded', String(!nav.hidden));
  });
  const menus = [...header.querySelectorAll('details')];
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  let timer;
  function closeMenus(except) {
    clearTimeout(timer);
    menus.forEach(menu => { if (menu !== except) menu.open = false; });
  }
  for (const menu of menus) {
    let openedByHover = false;
    const trigger = menu.querySelector('summary');
    menu.addEventListener('pointerenter', event => {
      if (compact.matches || !hover.matches || event.pointerType !== 'mouse') return;
      closeMenus(menu);
      if (!menu.open) { menu.open = true; openedByHover = true; }
    });
    menu.addEventListener('pointerleave', () => {
      if (openedByHover) timer = setTimeout(() => {
        if (!menu.contains(document.activeElement)) menu.open = false;
      }, 200);
    });
    trigger.addEventListener('click', event => {
      if (compact.matches && !nav.hidden) dismissMobile();
      closeMenus(menu);
      if (openedByHover && menu.open && event.detail > 0) event.preventDefault();
      openedByHover = false;
    });
    menu.addEventListener('focusout', event => {
      if (!menu.contains(event.relatedTarget)) menu.open = false;
    });
  }
  function dismissMobile() {
    if (compact.matches && !nav.hidden) button.click();
  }
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.uesl-topbar details')) closeMenus();
    if (!event.target.closest('.uesl-topbar')) dismissMobile();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = menus.find(menu => menu.open);
    if (open) { closeMenus(); open.querySelector('summary').focus(); }
    else if (compact.matches && !nav.hidden) { dismissMobile(); button.focus(); }
  });
  compact.addEventListener('change', resize);
  resize();
})();
