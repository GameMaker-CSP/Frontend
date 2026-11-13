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
