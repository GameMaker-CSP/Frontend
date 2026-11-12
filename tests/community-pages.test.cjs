const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const routes = ['index.html', ...['events', 'announcements', 'gallery', 'contact', 'locations'].map(route => `${route}/index.html`)];

test('community routes render one title, valid section targets, and working local links', () => {
  for (const route of routes) {
    const html = read(`_site/${route}`);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
    assert.equal((main.match(/<h1\b/g) || []).length, 1, route);
    const ids = [...main.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${route}: duplicate IDs`);
    for (const [, label] of main.matchAll(/aria-labelledby="([^"]+)"/g)) assert.ok(ids.includes(label), `${route}: missing ${label}`);
    for (const [, href] of main.matchAll(/\bhref="([/#][^"]*)"/g)) {
      const url = new URL(href, `http://localhost/${route}`);
      const target = path.join(root, '_site', url.pathname);
      const file = [target, `${target}.html`, path.join(target, 'index.html')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
      assert.ok(file, `${route}: missing ${href}`);
      if (url.hash) assert.ok(fs.readFileSync(file, 'utf8').includes(`id="${url.hash.slice(1)}"`), `${route}: missing anchor ${href}`);
    }
  }
});

test('homepage leads with gatherings and places Game Maker after community content', () => {
  const html = read('_site/index.html');
  const hero = html.match(/<section id="home"[\s\S]*?<\/section>/)[0];
  assert.match(hero, /href="\/events\/"/);
  assert.doesNotMatch(hero, /href="\/play\//);
  const positions = ['gatherings', 'announcements', 'photos-heading', 'getting-started-heading', 'between-events'].map(id => html.indexOf(`id="${id}"`));
  assert.ok(positions.every((pos, i) => pos >= 0 && (i === 0 || pos > positions[i - 1])));
  assert.match(html, /href="\/play\/"/);
});

test('event and contact empty states do not promise registrations or message delivery', () => {
  const events = JSON.parse(read('_data/uesl_events.json'));
  if (events.length === 0) assert.match(read('_site/events/index.html'), /No confirmed event dates/);
  const contact = read('_site/contact/index.html');
  assert.match(contact, /https:\/\/www.unifiedesl.com\/#contact/);
  assert.doesNotMatch(contact, /formspree|novalidate/);
  assert.match(contact, /Nothing is sent or stored here/);
  assert.doesNotMatch(read('_layouts/uesl.html'), /Subscribed!|Newsletter no-op/);
});

test('new community markup uses existing shared styles without inline CSS', () => {
  for (const name of ['home', 'events', 'announcements', 'gallery', 'contact', 'locations']) {
    const source = read(`pages/uesl-${name}.html`);
    assert.doesNotMatch(source, /<style\b|\sstyle=|<link[^>]+\.css/);
    assert.match(source, /ocs__/);
  }
});

test('announcements and gallery retain source attribution and complete records', () => {
  for (const notice of JSON.parse(read('_data/uesl_announcements.json'))) {
    assert.ok(notice.starts_on <= notice.ends_on);
    assert.match(notice.verified_on, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new URL(notice.source).hostname, 'www.unifiedesl.com');
    assert.ok(read('_site/announcements/index.html').includes(notice.title));
  }
  for (const photo of JSON.parse(read('_data/uesl_gallery.json'))) {
    assert.equal(new URL(photo.image).hostname, 'images.squarespace-cdn.com');
    assert.ok(photo.alt.length > 20 && photo.width > 0 && photo.height > 0);
    assert.ok(read('_site/gallery/index.html').includes(photo.image));
  }
  for (const event of JSON.parse(read('_data/uesl_events.json'))) {
    for (const field of ['title', 'starts_at', 'ends_on', 'when', 'location', 'description', 'url']) assert.ok(event[field], `Missing ${field}`);
    assert.equal(new URL(event.url).protocol, 'https:');
    assert.ok(!Number.isNaN(Date.parse(event.starts_at)));
    assert.match(event.ends_on, /^\d{4}-\d{2}-\d{2}$/);
  }
});
