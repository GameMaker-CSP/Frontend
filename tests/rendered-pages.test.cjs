const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

test('primary navigation links resolve to generated pages', () => {
  for (const route of ['index.html', 'about/index.html', 'locations/index.html', 'play/index.html', 'contact/index.html', 'login.html']) {
    const html = fs.readFileSync(path.join(root, '_site', route), 'utf8');
    const navigation = html.match(/<nav\b[^>]*id="nav"[^>]*>([\s\S]*?)<\/nav>/i);
    assert.ok(navigation, `${route}: main navigation is present`);
    const links = [...navigation[1].matchAll(/\bhref="([^"]+)"/g)].map(match => match[1]);
    const localLinks = links.filter(href => href.startsWith('/') && !href.startsWith('//'));
    assert.ok(localLinks.length >= 5, `${route}: primary page links are present`);
    for (const href of localLinks) {
      const url = new URL(href, 'http://localhost');
      const target = path.join(root, '_site', url.pathname);
      const candidates = [target + '.html', path.join(target, 'index.html')];
      const destination = candidates.find(file => fs.existsSync(file) && fs.statSync(file).isFile());
      assert.ok(destination, `${route}: ${href} must point to a generated page`);
      if (url.hash) {
        const page = fs.readFileSync(destination, 'utf8');
        assert.ok(page.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route}: ${href} must identify a real section`);
      }
    }
  }
});

test('the preserved guided editor retains its controls and usable button sizing', () => {
  const html = fs.readFileSync(path.join(root, 'pages/game-maker.html'), 'utf8');
  assert.match(html, /id="gm-mode-guided"/);
  const styles = fs.readFileSync(path.join(root, '_site/assets/css/game-maker.css'), 'utf8');
  assert.match(styles, /\.gm-guided__primary[^{}]*\{[^}]*min-height:\s*44px/);
  assert.match(styles, /\.gm-guided__progress\s*\{[^}]*display:\s*grid/);
});

test('Play has one canonical output route', () => {
  const pages = fs.readdirSync(path.join(root, 'pages')).filter(name => /\.(html|md)$/.test(name));
  const owners = pages.filter(name => /^permalink: \/play\/\s*$/m.test(fs.readFileSync(path.join(root, 'pages', name), 'utf8')));
  assert.deepEqual(owners, ['uesl-play.html']);
});

test('standalone editor bookmarks open Play without publishing the newer editor', () => {
  for (const route of ['game-maker/index.html', 'game-maker-prototype/index.html']) {
    const html = fs.readFileSync(path.join(root, '_site', route), 'utf8');
    assert.match(html, /rel="canonical" href="\/play\/"/);
    assert.match(html, /<noscript><meta http-equiv="refresh" content="0; url=\/play\/#game-builder">/);
    assert.ok(!html.includes('id="gm-app"'), `${route}: no second editor is rendered`);
    const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
    for (const search of ['', '?room=demo%20room&embed=1']) {
      let redirected;
      vm.runInNewContext(script, { URL, window: { location: {
        origin: 'http://localhost:4700', search, replace: url => { redirected = new URL(url); },
      } } });
      assert.equal(redirected.origin, 'http://localhost:4700');
      assert.equal(redirected.pathname, '/play/');
      assert.equal(redirected.hash, '#game-builder');
      assert.equal(redirected.searchParams.has('embed'), false);
      assert.equal(redirected.searchParams.get('room'), search ? 'demo room' : null);
    }
  }
});

test('Play exposes all three real builders through one accessible workspace', () => {
  const html = fs.readFileSync(path.join(root, '_site/play/index.html'), 'utf8');
  assert.match(html, /id="game-builder"/);
  const frames = [...html.matchAll(/<iframe\b[^>]*>/g)].map(match => match[0]);
  assert.equal(frames.length, 3);
  const routes = ['/gamebuilder/v2/', '/gamebuilderv1-2', '/car-racing-builder'];
  const kinds = ['workbench', 'open-world', 'racing'];
  for (let i = 0; i < routes.length; i++) {
    assert.ok(frames[i].includes(`data-src="${routes[i]}?embed=1"`));
    assert.ok(!/\ssrc=/.test(frames[i]), 'Builders are loaded on selection, not all at page startup');
    assert.ok(html.includes(`aria-controls="panel-${kinds[i]}"`));
    assert.ok(html.includes(`aria-labelledby="tab-${kinds[i]}"`));
    const file = routes[i].endsWith('/') ? `${routes[i]}index.html` : `${routes[i]}.html`;
    const builder = fs.readFileSync(path.join(root, '_site', file), 'utf8');
    assert.match(builder, /href="\/assets\/css\/game-builder\.css(?:\?[^\"]*)?"/);
    assert.match(builder, /class="uesl-builder-root"/);
  }
  assert.equal([...html.matchAll(/role="tab" aria-selected="true"[^>]*data-builder=/g)].length, 1);
  assert.match(html, /type="module" src="\/assets\/js\/uesl-builders\/play\.mjs"/);
});

test('rendered login scripts coexist without duplicate globals', () => {
  const html = fs.readFileSync(path.join(root, '_site/login.html'), 'utf8');
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, attrs]) => !/\bsrc=|type=["'](?:module|application\/ld\+json)/i.test(attrs))
    .map(([, , code]) => code);
  assert.doesNotThrow(() => new vm.Script(scripts.join('\n;\n')));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const formIds = ids.filter(id => /^(login-page-)?slm-/.test(id));
  assert.equal(new Set(formIds).size, formIds.length, 'Login and social forms must not share IDs');
  assert.ok(ids.includes('login-page-slm-uid'));
});

test('shared and page styles ship once with real local assets across the primary routes', () => {
  for (const route of ['index.html', 'login.html', 'play/index.html', 'gamebuilder/v2/index.html', 'gamebuilderv1-2.html', 'car-racing-builder.html', 'ocs-components/index.html', 'ocs-components/lessons/index.html', 'python/flask.html']) {
    const html = fs.readFileSync(path.join(root, '_site', route), 'utf8');
    const assets = [...html.matchAll(/<link\b[^>]*href="([^"?]+\.css)(?:\?[^\"]*)?"[^>]*>/gi)].map(match => match[1]).filter(href => href.startsWith('/'));
    assert.equal(assets.filter(href => href === '/assets/css/ocs.css').length, 1, `${route}: OCS must load once`);
    assert.equal(new Set(assets).size, assets.length, `${route}: no duplicate stylesheet links`);
    for (const asset of assets) assert.ok(fs.existsSync(path.join(root, '_site', asset)), `${route}: missing ${asset}`);
  }
});

test('lesson components render course content and usable navigation without a Tailwind runtime', () => {
  const flask = fs.readFileSync(path.join(root, '_site/python/flask.html'), 'utf8');
  for (const title of ['Crash Course', 'Anatomy', 'API creation', 'Jinja UI']) assert.ok(flask.includes(title));
  const examples = fs.readFileSync(path.join(root, '_site/ocs-components/lessons/index.html'), 'utf8');
  assert.equal([...examples.matchAll(/data-module="c[1-6]"/g)].length, 6);
  assert.ok(examples.includes('Planning a shared interface'));
  assert.ok(!examples.includes('cdn.tailwindcss.com'));
  assert.ok(examples.includes('ocs__module'));
});
