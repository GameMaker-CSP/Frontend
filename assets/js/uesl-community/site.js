// OCS visibility utilities also apply to asynchronously rendered form fields.
(() => {
  const sync = node => {
    if (node.nodeType !== 1) return;
    node.classList.toggle('ocs__hidden', node.hidden);
    node.querySelectorAll('[hidden]').forEach(child => child.classList.add('ocs__hidden'));
  };
  document.querySelectorAll('[hidden]').forEach(sync);
  const observer = new MutationObserver(records => records.forEach(record => {
    if (record.type === 'attributes') sync(record.target);
    else record.addedNodes.forEach(sync);
  }));
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden'] });
})();
