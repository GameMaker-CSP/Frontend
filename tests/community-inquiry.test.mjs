import assert from 'node:assert/strict';
import test from 'node:test';
import { makeInquiry } from '../assets/js/uesl-community/inquiry.mjs';
import { pacificDate, refreshEvents } from '../assets/js/uesl-community/events.mjs';

const values = { topic: 'party', name: 'A & B', email: 'person@example.com', message: 'Games & friends?\nThank you!', date: '2026-12-01', size: '12', place: 'Community hall' };
test('party inquiry preserves text, routes to programs, and encodes an email draft', () => {
  const draft = makeInquiry(values);
  const url = new URL(draft.href);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'matthew@unifiedesl.com');
  assert.equal(url.searchParams.get('body'), draft.body);
  assert.equal(url.searchParams.size, 2);
  for (const value of [values.name, values.message, values.date, values.place]) assert.ok(draft.body.includes(value));
});
test('unknown inquiry types cannot change recipients; empty optional fields are omitted', () => {
  const draft = makeInquiry({ ...values, topic: 'attacker@example.com', date: '', size: '', place: '' });
  assert.equal(draft.recipient, 'services@unifiedesl.com');
  assert.equal(draft.subject, 'UESL question');
  assert.doesNotMatch(draft.body, /Preferred date:|Group size:|City or venue:/);
});
test('event expiry follows the local calendar, not UTC midnight', () => {
  assert.equal(pacificDate(new Date('2026-11-13T06:00:00Z')), '2026-11-12');
  assert.equal(pacificDate(new Date('2026-07-02T06:00:00Z')), '2026-07-01');
});
test('past events disappear and the inquiry fallback returns when none remain', () => {
  const element = end => ({ dataset: { eventEnd: end }, classList: { toggle(_name, hidden) { this.hidden = hidden; } } });
  const cards = [element('2026-11-11'), element('2026-11-12')];
  const empty = element();
  const root = { querySelectorAll: () => cards, querySelector: () => empty };
  refreshEvents(root, '2026-11-12');
  assert.deepEqual(cards.map(card => card.classList.hidden), [true, false]);
  assert.equal(empty.classList.hidden, true);
  refreshEvents(root, '2026-11-13');
  assert.equal(empty.classList.hidden, false);
});
