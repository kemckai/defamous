#!/bin/bash
# Script to create a clean Chrome Web Store package for Defamous

cd "$(dirname "$0")"

echo "Creating Defamous extension package for Chrome Web Store..."

# Create a clean package directory
PACKAGE_DIR="defamous-package"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Copy only necessary files
echo "Copying extension files..."
cp manifest.json "$PACKAGE_DIR/"
cp content.js "$PACKAGE_DIR/"
cp popup.html "$PACKAGE_DIR/"
cp popup.js "$PACKAGE_DIR/"
cp icon16.png "$PACKAGE_DIR/"
cp icon48.png "$PACKAGE_DIR/"
cp icon128.png "$PACKAGE_DIR/"

# Create ZIP file
echo "Creating ZIP archive..."
cd "$PACKAGE_DIR"
zip -r ../defamous-extension.zip . -x "*.DS_Store"

cd ..

# Clean up
rm -rf "$PACKAGE_DIR"

# Verify the package
if [ -f "defamous-extension.zip" ]; then
    echo ""
    echo "✓ Package created successfully: defamous-extension.zip"
    echo ""
    echo "Package contents:"
    unzip -l defamous-extension.zip | grep -E "\.(json|js|html|png)$"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://chrome.google.com/webstore/devconsole"
    echo "2. Pay the $5 developer fee (one-time)"
    echo "3. Click 'New Item' and upload defamous-extension.zip"
    echo "4. Complete the store listing with screenshots and description"
    echo "5. Submit for review"
else
    echo "✗ Error: Package creation failed"
    exit 1
fi

