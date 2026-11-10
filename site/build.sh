#!/bin/bash
# Build the static landing page into site/dist (served at /defamous/).
set -e
cd "$(dirname "$0")/.."
./create-package.sh >/dev/null
rm -rf site/dist && mkdir -p site/dist
cp site/index.html privacy-policy.html icon16.png icon48.png icon128.png marquee-promo-tile.png site/dist/
mv defamous-extension.zip site/dist/
echo "Built site/dist"
