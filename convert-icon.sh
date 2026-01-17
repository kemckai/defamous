#!/bin/bash
# Script to convert an image to extension icons (16x16, 48x48, 128x128)

if [ $# -eq 0 ]; then
    echo "Usage: ./convert-icon.sh <image-file>"
    echo "Example: ./convert-icon.sh defamous-icon.png"
    exit 1
fi

INPUT_FILE="$1"

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: File '$INPUT_FILE' not found!"
    exit 1
fi

echo "Converting $INPUT_FILE to extension icons..."

# Convert to PNG and resize to required sizes
sips -s format png -z 16 16 "$INPUT_FILE" --out icon16.png
sips -s format png -z 48 48 "$INPUT_FILE" --out icon48.png
sips -s format png -z 128 128 "$INPUT_FILE" --out icon128.png

if [ $? -eq 0 ]; then
    echo "✓ Successfully created icon16.png, icon48.png, and icon128.png"
    echo "✓ Icons are ready for the Defamous extension!"
else
    echo "Error: Conversion failed. Make sure 'sips' is available."
    exit 1
fi

