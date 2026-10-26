#!/usr/bin/env python3
"""Check the local demo without signing in or changing data (Python 3 only)."""

import argparse
import json
from urllib.error import HTTPError, URLError
from urllib.request import urlopen


def port_number(value):
    port = int(value)
    if not 1 <= port <= 65535:
        raise argparse.ArgumentTypeError('port must be between 1 and 65535')
    return port


def check(label, url, expected_status=200, health=False):
    try:
        with urlopen(url, timeout=5) as response:
            status = response.status
            body = response.read(1024 * 1024) if health else b''
    except HTTPError as error:
        status, body = error.code, b''
        error.close()
    except (URLError, OSError):
        print(f'FAIL {label}: cannot connect to {url}')
        return False

    if status != expected_status:
        print(f'FAIL {label}: HTTP {status}; expected {expected_status} ({url})')
        return False
    if health:
        try:
            data = json.loads(body)
        except (ValueError, UnicodeError):
            data = None
        if not isinstance(data, dict) or data.get('status') != 'ok' or data.get('service') != 'gamemaker-backend':
            print(f'FAIL {label}: response is not a healthy GameMaker backend ({url})')
            return False
    print(f'PASS {label}: HTTP {status} ({url})')
    return True


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--frontend-port', type=port_number, default=4700)
    parser.add_argument('--backend-port', type=port_number, default=8424)
    args = parser.parse_args(argv)
    frontend = f'http://localhost:{args.frontend_port}'
    backend = f'http://localhost:{args.backend_port}'
    results = [
        check('Play page', frontend + '/play/'),
        check('Login page', frontend + '/login'),
        check('Backend health', backend + '/api/health', health=True),
        check('Signed-out account protection', backend + '/api/id', expected_status=401),
    ]
    if all(results):
        print('Startup checks passed. Open ' + frontend + '/play/')
        print('Login, saving and gameplay still need the browser demo.')
        return 0
    print('Keep both servers running in separate terminals:')
    print('  Backend:  cd ~/RazorCrest00/GameMaker-CSP/Backend && bash run_backend.sh')
    print('  Frontend: cd ~/RazorCrest00/GameMaker-CSP/Frontend && bash run_frontend.sh')
    print('Wait for each server address, then rerun this check. Do not delete the database.')
    return 1


if __name__ == '__main__':
    raise SystemExit(main())
