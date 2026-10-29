#!/usr/bin/env bash
# Renders one representative still per scene for each locale into out/stills/.
set -euo pipefail
cd "$(dirname "$0")/.."
FRAMES=(100 220 370 730 1080 1270 1630 1800 1930 2105)
LOCALES=${LOCALES:-"en es"}
for locale in $LOCALES; do
  for i in "${!FRAMES[@]}"; do
    n=$(printf '%02d' $((i + 1)))
    npx remotion still src/index.ts "BashWizardry-$locale" "out/stills/$locale-$n.png" \
      --frame="${FRAMES[$i]}" --log=error
  done
done
