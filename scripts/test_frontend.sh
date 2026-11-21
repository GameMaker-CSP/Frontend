#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
tests=(tests/*.test.cjs tests/*.test.mjs tests/game-maker-guided/*.test.mjs)
for suite in _projects/systems/*/tests/*.test.{cjs,mjs}; do
  case "$suite" in
    # These suites need Portfolio's distributed login pages and dashboard modules.
    # UESL uses its own account routes and imports this system as source only.
    _projects/systems/login/tests/distribution.test.mjs|\
    _projects/systems/login/tests/navbar.test.mjs|\
    _projects/systems/login/tests/signin_signup.test.mjs) continue ;;
  esac
  tests+=("$suite")
done
node --test "${tests[@]}"
