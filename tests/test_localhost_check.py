"""Exercise the startup checker against disposable HTTP servers."""

import contextlib
from http.server import BaseHTTPRequestHandler, HTTPServer
import importlib.util
import io
from pathlib import Path
import threading
import unittest

spec = importlib.util.spec_from_file_location(
    'check_localhost', Path(__file__).resolve().parents[1] / 'scripts/check_localhost.py'
)
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


class StartupCheckTests(unittest.TestCase):
    def setUp(self):
        self.routes = {
            '/play/': (200, b'<html>Play</html>'),
            '/login': (200, b'<html>Login</html>'),
            '/api/health': (200, b'{"status":"ok","service":"gamemaker-backend"}'),
            '/api/id': (401, b'{"message":"Unauthorized"}'),
        }
        routes = self.routes

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                status, body = routes.get(self.path, (404, b''))
                self.send_response(status)
                self.end_headers()
                self.wfile.write(body)

            def log_message(self, *_args):
                pass

        self.server = HTTPServer(('127.0.0.1', 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.addCleanup(self.stop_server)

    def stop_server(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=2)

    def run_check(self):
        port = str(self.server.server_port)
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            result = checker.main(['--frontend-port', port, '--backend-port', port])
        return result, output.getvalue()

    def test_running_services_and_protected_account_pass(self):
        result, output = self.run_check()
        self.assertEqual(result, 0)
        self.assertEqual(output.count('PASS '), 4)

    def test_missing_frontend_page_fails_with_startup_help(self):
        self.routes['/play/'] = (404, b'Not found')
        result, output = self.run_check()
        self.assertEqual(result, 1)
        self.assertIn('FAIL Play page: HTTP 404', output)
        self.assertIn('bash run_frontend.sh', output)

    def test_wrong_service_or_invalid_health_json_fails(self):
        for body in [b'not json', b'[]', b'{"status":"ok","service":"another-app"}', b'{"status":"error","service":"gamemaker-backend"}']:
            with self.subTest(body=body):
                self.routes['/api/health'] = (200, body)
                self.assertEqual(self.run_check()[0], 1)

    def test_unprotected_identity_is_not_reported_as_ready(self):
        self.routes['/api/id'] = (200, b'{}')
        result, output = self.run_check()
        self.assertEqual(result, 1)
        self.assertIn('FAIL Signed-out account protection', output)

    def test_stopped_service_returns_failure_without_traceback(self):
        self.server.shutdown()
        self.server.server_close()
        result, output = self.run_check()
        self.assertEqual(result, 1)
        self.assertIn('cannot connect', output)
        self.assertNotIn('Traceback', output)


if __name__ == '__main__':
    unittest.main()
