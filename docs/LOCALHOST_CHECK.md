# Check the local demo

After starting `bash run_backend.sh` and `bash run_frontend.sh` in their respective
folders, run this in a third terminal:

```bash
cd ~/RazorCrest00/GameMaker-CSP/Frontend
python3 scripts/check_localhost.py
```

Four PASS lines mean Play and Login respond, Flask identifies itself as healthy,
and signed-out requests cannot access account information. Exit status is zero
only when all four checks pass. The script uses Python's standard library and
makes read-only requests without credentials or browser cookies.

On FAIL, read the named check and startup command, wait for both server addresses,
then try again. HTTP 404 suggests a missing route or the wrong app on that port;
"cannot connect" means the service is unreachable. Inspect the server terminal
before restarting it. Do not delete the database or stop unrelated processes.

Custom ports: `python3 scripts/check_localhost.py --frontend-port 4700 --backend-port 8424`.

These checks confirm startup, not the full demo. Open <http://localhost:4700/login>,
sign in using the local demo account, and check profile persistence and game play.
Account saving from inherited builders and multiplayer have separate issues.

Regression checks (use disposable local HTTP servers; no application data changes):

```bash
python3 -m unittest discover -s tests -p 'test_localhost_check.py'
```
