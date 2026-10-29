#!/usr/bin/env bash
# Exports the rendered masters (out/bash-wizardry-<locale>.mp4) into web-ready
# assets under web/public/video/:
#   bash-wizardry-<locale>.mp4          H.264 high, yuv420p, 1080p, faststart, silent
#   bash-wizardry-<locale>-poster.webp  title card, fully settled
#
# Requires ffmpeg (libx264) and cwebp. Render the masters first (npm run render).
# Override: LOCALES="en", CRF=26, POSTER_FRAME=220, FFMPEG=/path/to/ffmpeg.
set -euo pipefail
cd "$(dirname "$0")/.."

FFMPEG=${FFMPEG:-ffmpeg}
LOCALES=${LOCALES:-"en es"}
# crf 26 keeps each cut around 3.5 MB. The background vignette only spans a few
# 8-bit code values, so higher crf turns its steps blocky; aq-mode=3 spends the
# bits on those dark flat areas instead.
CRF=${CRF:-26}
# Title scene runs frames 120-270 (src/timeline.ts); by 220 both lines have
# settled and the cross-fade into the next scene has not started.
POSTER_FRAME=${POSTER_FRAME:-220}
DEST=../web/public/video

command -v "$FFMPEG" >/dev/null || { echo "ffmpeg not found" >&2; exit 1; }
command -v cwebp >/dev/null || { echo "cwebp not found (brew install webp)" >&2; exit 1; }
mkdir -p "$DEST"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

for locale in $LOCALES; do
  src="out/bash-wizardry-$locale.mp4"
  [[ -f $src ]] || { echo "missing $src: render it first" >&2; exit 1; }

  "$FFMPEG" -hide_banner -loglevel error -y -i "$src" -an \
    -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -preset slow -tune animation -crf "$CRF" -x264-params aq-mode=3 \
    -movflags +faststart \
    "$DEST/bash-wizardry-$locale.mp4"

  # Poster from the master, not the re-encode, so it stays crisp.
  "$FFMPEG" -hide_banner -loglevel error -y -i "$src" \
    -vf "select=eq(n\,$POSTER_FRAME)" -frames:v 1 "$tmp/poster-$locale.png"
  cwebp -quiet -q 80 -m 6 "$tmp/poster-$locale.png" \
    -o "$DEST/bash-wizardry-$locale-poster.webp"
done

ls -l "$DEST"
