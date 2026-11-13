const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.join(__dirname, '..');
const site = path.join(root, '_site');
const projectRoot = path.join(root, '_projects/systems');
const read = file => fs.readFileSync(file, 'utf8');
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? files(file) : [file];
});

test('all three project pages publish their extracted scripts at working URLs', async () => {
  const { parse } = await import('../assets/js/vendor/acorn.mjs');
  for (const route of ['gamebuilder/v2/index.html', 'gamebuilderv1-2.html', 'car-racing-builder.html']) {
    const html = read(path.join(site, route));
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
    assert.ok(scripts.some(([, attrs]) => attrs.includes('/projects/systems/')), route);
    for (const [, attrs, inline] of scripts) {
      const src = attrs.match(/\bsrc="([^"]+)"/);
      if (src && !src[1].startsWith('/')) continue;
      const code = src ? read(path.join(site, src[1].split('?')[0])) : inline;
      assert.doesNotMatch(code, /\{\{\s*site\.baseurl/, `${route}: Liquid must be rendered`);
      parse(code, { ecmaVersion: 'latest', sourceType: attrs.includes('module') ? 'module' : 'script' });
    }
  }
});

test('project modules preserve their relative imports in the published tree', async () => {
  const { parse } = await import('../assets/js/vendor/acorn.mjs');
  for (const name of ['gamebuilder', 'open-world', 'racing']) {
    const directory = path.join(site, 'projects/systems', name, 'js');
    for (const file of files(directory).filter(file => /\.(m?js)$/.test(file))) {
      const module = parse(read(file), { ecmaVersion: 'latest', sourceType: 'module' });
      for (const statement of module.body.filter(node => node.type === 'ImportDeclaration')) {
        const source = statement.source.value;
        if (source.startsWith('.')) assert.ok(fs.existsSync(new URL(source, pathToFileURL(file))), `${file}: ${source}`);
      }
    }
    for (const folder of ['tests', 'notebooks', 'sass']) {
      assert.equal(fs.existsSync(path.join(site, 'projects/systems', name, folder)), false);
    }
  }
});

test('moved artwork and template catalog retain the bytes at existing saved-game URLs', () => {
  for (const [name, destination] of [['gamebuilder', 'images/projects/gamebuilder'], ['open-world', 'images/gamebuilder']]) {
    const directory = path.join(projectRoot, name, 'images');
    for (const file of files(directory).filter(file => !file.endsWith('.md'))) {
      const published = path.join(site, destination, path.relative(directory, file));
      assert.deepEqual(fs.readFileSync(published), fs.readFileSync(file), published);
    }
  }
  assert.equal(read(path.join(site, 'assets/js/GameEnginev1.2/builder/templates.js')),
    read(path.join(projectRoot, 'open-world/js/templates.js')));
  assert.ok(fs.existsSync(path.join(site, 'gamebuilderv1-2/doc.html')));
});
