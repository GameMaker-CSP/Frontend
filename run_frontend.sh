#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# macOS ships an old Ruby; prefer Homebrew Ruby when it is installed.
if command -v brew >/dev/null 2>&1; then
    ruby_prefix="$(brew --prefix ruby 2>/dev/null || true)"
    if [ -n "$ruby_prefix" ] && [ -x "$ruby_prefix/bin/ruby" ]; then
        export PATH="$ruby_prefix/bin:$PATH"
    fi
fi
export BUNDLE_GEMFILE="$PWD/Gemfile.local"
bundle check || bundle install
exec bundle exec jekyll serve --config _config.yml,_config.local.yml \
    --host 127.0.0.1 --port 4700 --livereload
