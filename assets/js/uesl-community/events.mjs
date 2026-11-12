export function pacificDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

export function refreshEvents(root, today = pacificDate()) {
  let visible = 0;
  for (const card of root.querySelectorAll('[data-event-end]')) {
    const past = card.dataset.eventEnd < today;
    card.classList.toggle('ocs__hidden', past);
    if (!past) visible += 1;
  }
  root.querySelector('[data-events-empty]').classList.toggle('ocs__hidden', visible > 0);
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-events-list]').forEach(root => {
    refreshEvents(root);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) refreshEvents(root);
    });
  });
}
