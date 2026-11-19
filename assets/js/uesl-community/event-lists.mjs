import { button, eventLink, node, request, timestamp } from './event-api.mjs';

for (const section of document.querySelectorAll('[data-event-feed]')) {
  const feed = section.dataset.eventFeed;
  const list = section.querySelector('[data-event-items]');
  const status = section.querySelector('[data-event-status]');
  const limit = feed === 'upcoming' ? 2 : 20;
  let offset = 0;
  const more = button('Load more', () => load());
  more.hidden = true;
  section.append(more);
  const path = feed === 'albums' ? 'albums=true&' : feed === 'upcoming' ? 'upcoming=true&' : '';

  async function load() {
    status.textContent = 'Loading…';
    more.disabled = true;
    try {
      const events = await request(`?${path}limit=${limit}&offset=${offset}`);
      for (const event of events) {
        const card = node('article', '', 'ocs__card ocs__stack');
        const title = node('h3', event.title);
        const date = node('time', timestamp(event.starts_at_utc, event.timezone));
        date.dateTime = event.starts_at_utc;
        const link = node('a', feed === 'albums' ? 'View event photos' : 'Event details', 'ocs__btn accent');
        link.href = eventLink(event.id) + (feed === 'albums' ? '#event-photos' : '');
        link.setAttribute('aria-label', `${link.textContent}: ${event.title}`);
        const actions = node('div', '', 'ocs__links');
        actions.append(link);
        card.append(title, date, node('p', event.location), actions);
        if (event.state === 'cancelled') title.append(' · Cancelled');
        list.append(card);
      }
      offset += events.length;
      more.textContent = 'Load more';
      more.hidden = feed === 'upcoming' || events.length < limit;
      const item = feed === 'albums' ? 'album' : 'event';
      status.textContent = offset ? `${offset} ${item}${offset === 1 ? '' : 's'} shown.` :
        feed === 'albums' ? 'No event albums have been published yet.' : 'No confirmed events are listed yet.';
      if (offset) section.querySelector('[data-events-list]')?.setAttribute('hidden', '');
    } catch {
      status.textContent = 'Could not load live events. Try again.';
      more.textContent = 'Retry';
      more.hidden = false;
    } finally {
      more.disabled = false;
    }
  }
  load();
}
