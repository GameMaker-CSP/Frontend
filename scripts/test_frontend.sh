#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node --test tests/*.test.cjs tests/*.test.mjs tests/game-maker-guided/*.test.mjs \
  _projects/systems/*/tests/*.test.cjs tests/*.test.mjs _projects/systems/*/tests/*.test.mjs
