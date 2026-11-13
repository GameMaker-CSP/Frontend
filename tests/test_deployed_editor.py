"""Check the actual Pages output, including JavaScript after URL adaptation."""
import os
from pathlib import Path
import re
import subprocess
import tempfile
import unittest

SITE = Path(os.environ.get('GAMEMAKER_SITE_OUTPUT', '_site'))

class DeployedEditor(unittest.TestCase):
    def test_play_modules_styles_and_navigation_use_the_project_path(self):
        html = (SITE / 'play/index.html').read_text()
        for url in ['/Frontend/assets/css/ocs.css',
                    '/Frontend/assets/css/game-builder.css',
                    '/Frontend/assets/js/uesl-builders/play.mjs']:
            self.assertIn(url, html)
            self.assertTrue((SITE / url.removeprefix('/Frontend/')).is_file())
        self.assertNotIn('href="/uesl-hub/', html)
        self.assertIn('href="/Frontend/"', html)
        for route in ('gamebuilder/v2/', 'gamebuilderv1-2', 'car-racing-builder'):
            self.assertIn(f'data-src="/Frontend/{route}?embed=1"', html)
            target = SITE / route
            self.assertTrue(target.is_dir() or target.with_suffix('.html').is_file())

    def test_old_editor_route_preserves_its_redirect_to_play(self):
        html = (SITE / 'game-maker/index.html').read_text()
        self.assertIn('/Frontend/play/', html)
        self.assertIn('destination.search = window.location.search', html)
        self.assertNotIn('id="gm-app"', html)

    def test_inline_editor_javascript_still_parses_after_url_adaptation(self):
        html = '\n'.join((SITE / route).read_text() for route in (
            'game-maker/index.html', 'play/index.html', 'login.html', 'profile.html'))
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
