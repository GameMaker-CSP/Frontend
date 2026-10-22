import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('prefix_site_urls', Path(__file__).parents[1] / 'scripts/prefix_site_urls.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class ProjectUrls(unittest.TestCase):
    def test_assets_routes_css_and_inline_js_use_the_project_path(self):
        with tempfile.TemporaryDirectory() as directory:
            site = Path(directory)
            (site / 'assets').mkdir()
            (site / 'assets/main.css').touch()
            (site / 'images').mkdir()
            (site / 'images/scene.png').touch()
            (site / 'game-maker').mkdir()
            original = '''<link href="/assets/main.css?v=2"><a href="/game-maker/">Play</a>
            <style>body{background:url(/images/scene.png)}</style>
            <script>const scene='/images/scene.png';const home='/';</script>'''
            result = module.prefix_urls(original, site, '/Frontend')
            for url in ['/Frontend/assets/main.css?v=2', '/Frontend/game-maker/', '/Frontend/images/scene.png', "home='/Frontend/'"]:
                self.assertIn(url, result)
            self.assertEqual(module.prefix_urls(result, site, '/Frontend'), result)

    def test_api_external_unknown_and_relative_urls_are_preserved(self):
        with tempfile.TemporaryDirectory() as directory:
            text = '''fetch('/api/game/save'); const x="https://example.com/images/a.png";
            const cdn='//cdn.example.com/a.js';const relative='./themes.js';
            const absent='/unknown/path'; const escape='/../assets/a.js';'''
            self.assertEqual(module.prefix_urls(text, Path(directory), '/Frontend'), text)

    def test_javascript_regex_literals_are_not_urls(self):
        with tempfile.TemporaryDirectory() as directory:
            text = "const clean = String(x).replace(/</g, '&lt;').replace(/>/g, '&gt;');"
            self.assertEqual(module.prefix_urls(text, Path(directory), '/Frontend'), text)

if __name__ == '__main__':
    unittest.main()
