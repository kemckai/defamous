# How to Reload the Extension After Updates

After making changes to the extension code, you need to reload it:

## Quick Steps:

1. **Open Extensions Page**
   - Chrome/Edge: Type `chrome://extensions/` in address bar
   - Or click the puzzle piece icon → "Manage extensions"

2. **Find the Extension**
   - Look for "Facebook No-Celebrity Mode"

3. **Reload It**
   - Click the **refresh/reload icon** (circular arrow) on the extension card
   - Or toggle it off and back on

4. **Refresh Facebook**
   - Go to Facebook.com
   - Press `F5` or `Cmd+R` (Mac) / `Ctrl+R` (Windows) to refresh the page
   - The updated filtering should now be active

## Troubleshooting:

- **Changes not working?** Make sure you:
  1. Reloaded the extension (step 3 above)
  2. Refreshed the Facebook page (step 4 above)
  3. Checked that the extension is enabled (toggle should be ON)

- **Still seeing celebrities?** 
  - Open browser console (F12) and check for errors
  - Try disabling and re-enabling the extension
  - Make sure you're on facebook.com (not m.facebook.com)

## Adding More Celebrity Names:

To add more celebrities to the filter list:
1. Open `content.js`
2. Find the `celebrityNames` array (around line 199)
3. Add names in the format: `'firstname lastname', 'firstnamelastname'`
4. Save the file
5. Reload the extension (follow steps above)

