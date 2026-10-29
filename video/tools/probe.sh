#!/usr/bin/env bash
# Dev helper: prints the compiled frame timings of every terminal session.
set -euo pipefail
cd "$(dirname "$0")/.."
node_modules/.bin/esbuild "$1" --bundle --platform=node --format=esm --jsx=automatic \
  --outfile=.probe.tmp.mjs --log-level=error '--external:react*' '--external:remotion' '--external:@remotion/*'
node .probe.tmp.mjs; rm -f .probe.tmp.mjs
