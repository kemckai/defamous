# Facebook No-Celebrity Mode Browser Extension

A browser extension that filters out celebrity and public figure content from your Facebook feed, helping you focus on posts from friends, family, and personal connections.

## Features

- **Hide Verified Accounts**: Automatically hides posts from verified accounts (blue checkmark)
- **Filter Public Figures**: Removes content from public figure pages
- **Hide Brand Pages**: Filters out posts from brand and business pages
- **High Engagement Filter**: Optionally hides posts with very high engagement (likes/comments/shares)
- **Trending Content Filter**: Removes trending and viral content
- **Customizable Settings**: Adjust all filters through the extension popup
- **Real-time Filtering**: Works dynamically as you scroll through your feed

## Installation

### Chrome/Edge (Chromium-based browsers)

1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the folder containing the extension files
6. The extension should now appear in your extensions list

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension folder

## Usage

1. After installation, navigate to Facebook.com
2. Click the extension icon in your browser toolbar
3. Configure your filtering preferences:
   - Toggle filters on/off
   - Adjust the engagement threshold (default: 10,000)
4. Settings are saved automatically and apply immediately
5. Refresh your Facebook feed to see filtered results

## How It Works

The extension uses DOM manipulation to:
- Detect verified account badges
- Identify public figure and brand page indicators
- Analyze post engagement metrics
- Filter content based on your preferences

## Limitations

- **HTML Structure Dependency**: Facebook may change their HTML structure, which could break some filtering features
- **Web Version Only**: Works on Facebook's web interface, not the mobile app
- **No API Access**: Cannot access follower counts or detailed metrics directly
- **Terms of Service**: Use at your own discretion; Facebook's ToS may prohibit modifications

## Privacy

- All filtering happens locally in your browser
- No data is sent to external servers
- Settings are stored locally in your browser's sync storage

## Troubleshooting

**Extension not working?**
- Refresh the Facebook page after installation
- Check that the extension is enabled in your browser
- Try disabling and re-enabling the extension

**Too many posts hidden?**
- Adjust the engagement threshold in settings
- Disable filters that are too aggressive
- The extension learns from Facebook's current structure

**Posts still showing?**
- Facebook's structure may have changed
- Some posts may not match the filtering criteria
- Try refreshing the page

## Legal & Ethical Considerations

- This extension modifies the display of Facebook content but does not violate data access
- Use responsibly and in accordance with Facebook's Terms of Service
- The extension is for personal use and educational purposes

## Contributing

Feel free to submit issues or pull requests to improve the extension.

## License

This project is provided as-is for educational and personal use.

## Disclaimer

This extension is not affiliated with, endorsed by, or connected to Facebook/Meta. Use at your own risk.

