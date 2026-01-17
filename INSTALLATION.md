# Quick Installation Guide

## Step-by-Step Installation

### For Chrome/Edge (Chromium browsers)

1. **Open Extensions Page**
   - Chrome: Type `chrome://extensions/` in the address bar
   - Edge: Type `edge://extensions/` in the address bar

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to this folder: `/Users/spectorclef/facebook-no-celebrity-mode`
   - Click "Select" or "Open"

4. **Verify Installation**
   - You should see "Facebook No-Celebrity Mode" in your extensions list
   - The extension icon will appear in your browser toolbar

5. **Test the Extension**
   - Navigate to https://www.facebook.com
   - Click the extension icon in your toolbar
   - Adjust settings as needed
   - Refresh your Facebook feed to see filtered content

### For Firefox

1. **Open Debugging Page**
   - Type `about:debugging` in the address bar
   - Click "This Firefox" in the left sidebar

2. **Load Temporary Add-on**
   - Click "Load Temporary Add-on..."
   - Navigate to this folder
   - Select `manifest.json`
   - Click "Open"

3. **Note**: Firefox requires the extension to be reloaded each time you restart the browser (temporary add-on)

## Icon Files (Optional but Recommended)

Before loading the extension, you may want to add icon files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)  
- `icon128.png` (128x128 pixels)

See `ICONS.md` for instructions on creating these.

**Note**: The extension will work without icons, but you'll see a default icon in your browser.

## Troubleshooting

### Extension doesn't appear
- Make sure Developer Mode is enabled
- Check that you selected the correct folder (should contain `manifest.json`)
- Try reloading the extension

### Extension doesn't filter posts
- Refresh the Facebook page after installation
- Check the extension popup to ensure filters are enabled
- Open browser console (F12) to check for errors
- Facebook's HTML structure may have changed - the extension may need updates

### Settings not saving
- Check that you have storage permissions enabled
- Try disabling and re-enabling the extension
- Clear browser cache and reload

## Updating the Extension

When you make changes to the code:
1. Go to `chrome://extensions/` (or `edge://extensions/`)
2. Find "Facebook No-Celebrity Mode"
3. Click the refresh/reload icon
4. Refresh your Facebook page

## Uninstalling

1. Go to `chrome://extensions/` (or `edge://extensions/`)
2. Find "Facebook No-Celebrity Mode"
3. Click "Remove"
4. Confirm removal

