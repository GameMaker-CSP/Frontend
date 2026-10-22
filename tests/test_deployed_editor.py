"""Check the actual Pages output, including JavaScript after URL adaptation."""
import os
from pathlib import Path
import re
import subprocess
import tempfile
import unittest

SITE = Path(os.environ.get('GAMEMAKER_SITE_OUTPUT', '_site'))

class DeployedEditor(unittest.TestCase):
    def test_editor_modules_styles_and_navigation_use_the_project_path(self):
        html = (SITE / 'game-maker/index.html').read_text()
        for url in ['/Frontend/assets/css/game-maker-guided.css',
                    '/Frontend/assets/js/game-maker-guided/state-adapter.js',
                    '/Frontend/assets/js/game-maker-guided/theme-catalog.js',
                    '/Frontend/assets/js/face-tracker.js']:
            self.assertIn(url, html)
            self.assertTrue((SITE / url.removeprefix('/Frontend/')).is_file())
        self.assertNotIn('href="/uesl-hub/', html)
        self.assertIn('href="/Frontend/"', html)

    def test_inline_editor_javascript_still_parses_after_url_adaptation(self):
        html = (SITE / 'game-maker/index.html').read_text()
        checked = 0
        with tempfile.TemporaryDirectory() as directory:
            for number, match in enumerate(re.finditer(r'<script\b([^>]*)>([\s\S]*?)</script>', html)):
                attrs, code = match.groups()
                if 'src=' in attrs or not code.strip():
                    continue
                path = Path(directory) / f"inline-{number}.{'mjs' if 'module' in attrs else 'js'}"
                path.write_text(code)
                result = subprocess.run(['node', '--check', str(path)], capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                checked += 1
        self.assertGreater(checked, 0)

if __name__ == '__main__':
    unittest.main()
