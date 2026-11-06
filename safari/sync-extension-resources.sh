#!/bin/bash
# Copy the canonical extension files from the repository root into the
# Safari extension Resources directory. The root copies are the source of
# truth (Chrome/Edge and the Playwright tests use them). Running this
# before every Xcode build keeps the bundled copies from going stale.
#
# Anything else sitting in the extension Resources directory is removed so
# a converter dump of the whole repository cannot ship inside the appex.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/safari/Defamous/Defamous Extension/Resources"

FILES=(
  content.js
  icon128.png
  icon16.png
  icon48.png
  manifest.json
  popup.html
  popup.js
)

mkdir -p "$DEST"

for name in "${FILES[@]}"; do
  src="$ROOT/$name"
  if [[ ! -f "$src" ]]; then
    echo "missing canonical extension file: $src" >&2
    exit 1
  fi
  cp -f "$src" "$DEST/$name"
done

# Drop files the sync did not just write. Keep the directory itself.
find "$DEST" -mindepth 1 -maxdepth 1 -print0 | while IFS= read -r -d '' entry; do
  base="$(basename "$entry")"
  keep=0
  for name in "${FILES[@]}"; do
    if [[ "$base" == "$name" ]]; then
      keep=1
      break
    fi
  done
  if [[ "$keep" -eq 0 ]]; then
    rm -rf "$entry"
  fi
done

echo "Synced ${#FILES[@]} extension files into $DEST"
