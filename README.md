# Defamous

**Filter celebrity and public figure content from your Facebook feed**

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-4285F4?style=for-the-badge&logo=Google-Chrome&logoColor=white)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Privacy](https://img.shields.io/badge/Privacy-First-green.svg)](privacy-policy.html)

Defamous is a privacy-focused browser extension that removes celebrity noise from Facebook. Instead of seeing verified accounts, public figures, and viral celebrity content, you'll see what matters: posts from your actual friends and family.

## 🎯 Features

- ✅ **Hide Verified Accounts** - Automatically detects and hides posts from verified accounts (blue checkmarks)
- ✅ **Filter Public Figures** - Removes content from public figure pages and celebrity profiles
- ✅ **Block Celebrity Pages & Groups** - Filters out posts shared from celebrity pages, fan pages, and celebrity-focused groups
- ✅ **Smart Content Filtering** - Detects celebrity-related keywords and filters accordingly
- ✅ **High Engagement Filter** - Optionally hides viral posts with high engagement
- ✅ **Image Detection** - Filters posts containing celebrity images and photos
- ✅ **Fully Customizable** - Every filter can be toggled on/off through the extension popup
- ✅ **Real-Time Filtering** - Works dynamically as you scroll through your feed

## 🔒 Privacy-First

- **No Data Collection** - The Extension does not collect, store, or transmit any personal data
- **Everything Local** - All filtering happens entirely within your browser - no external servers
- **No Tracking** - We don't use analytics, advertising, or any third-party tracking services
- **Open Source** - The code is publicly available for transparency and review

## 📦 Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/kemckai/defamous.git
   cd defamous
   ```

2. Load the extension in Chrome/Edge:
   - Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `defamous` folder

3. Configure settings:
   - Click the Defamous icon in your browser toolbar
   - Adjust filter preferences as needed
   - Refresh your Facebook feed to see filtered content

### From Chrome Web Store (Coming Soon)

Once published, you'll be able to install Defamous directly from the Chrome Web Store.

## 🚀 Usage

1. After installation, navigate to Facebook.com
2. Click the Defamous icon in your browser toolbar
3. Configure your filtering preferences:
   - Toggle filters on/off individually
   - Adjust the engagement threshold (default: 10,000)
4. Settings are saved automatically and apply immediately
5. Refresh your Facebook feed to see filtered results

## ⚙️ How It Works

Defamous uses intelligent detection to identify:
- Verified accounts (blue checkmarks)
- Public figures and celebrities (100+ celebrities in database)
- Shared posts from celebrity pages/groups
- High-engagement viral content
- Celebrity-related keywords in posts
- Celebrity images and photos

All filtering is done locally in real-time. Posts are hidden immediately as you browse - no page reload required.

## 🎛️ Customization

Click the Defamous icon in your browser toolbar to access settings:
- **Hide Verified Accounts** - Toggle on/off
- **Hide Public Figures** - Toggle on/off
- **Hide Brand Pages** - Toggle on/off
- **Hide Trending Content** - Toggle on/off
- **Hide High Engagement Posts** - Toggle on/off
- **Engagement Threshold** - Adjust the threshold for hiding high-engagement posts
- **Hide Posts Shared from Pages** - Toggle on/off
- **Hide Posts Shared from Groups** - Toggle on/off
- **Filter Celebrity Content in Shared Posts** - Toggle on/off

## 🔧 Technical Details

### Permissions

- **Storage**: Used to save filter preferences locally. No data is transmitted externally.
- **Content Scripts**: Runs only on Facebook.com pages to filter content.

### Browser Compatibility

- ✅ Chrome (all recent versions)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Safari on macOS (as a Safari Web Extension — see below)
- ✅ Works on the desktop Facebook.com web interface

#### Safari on macOS

The checked-in wrapper is `safari/Defamous/Defamous.xcodeproj` (app
`com.kemckai.Defamous`, extension `com.kemckai.Defamous.Extension`). Build
and enablement steps, including the difference between a per-session ad-hoc
build and an Apple Development signature, are in [safari/BUILD.md](safari/BUILD.md).

```bash
safari/build-mac.sh --sync-only   # refresh the bundled web resources
safari/build-mac.sh               # ad-hoc Debug build when no team is set
```

`safari/sync-extension-resources.sh` copies `manifest.json`, `content.js`,
`popup.html`, `popup.js`, and the toolbar icons from the repository root
into the extension bundle and removes anything else from that folder. The
root files stay the source of truth.

The manifest declares `host_permissions` for `*.facebook.com`, which Safari
uses for the extension’s Websites list.

An ad-hoc build loads only while Safari’s Develop → Allow Unsigned Extensions
is on. That switch is per Safari session. Filtering has been confirmed in a
current Safari session against Facebook; whether it is still enabled after
Safari restarts has not been verified. A separate Apple Development Release
build has been produced and was not installed. The installed app is the
ad-hoc one.

#### Safari on iOS / iPadOS

The selectors in `content.js` target the desktop `www.facebook.com` DOM
(`[role="article"]`, `[data-pagelet*="FeedUnit"]`, `div[role="feed"]`).
Mobile Facebook (`m.facebook.com`) uses a different DOM and is not covered
by the current selectors; filtering behavior on iPhone Safari against
`m.facebook.com` is therefore not supported today.

### Architecture

- **Manifest V3** - Uses the latest Chrome extension manifest format
- **Content Scripts** - Filters content through DOM manipulation
- **Chrome Storage API** - Saves preferences locally
- **No External Dependencies** - All code is self-contained

## 📊 What Gets Filtered

Defamous filters out:
- ✅ Verified accounts (blue checkmarks)
- ✅ Celebrity names (100+ celebrities in database)
- ✅ Celebrity photos and images
- ✅ Posts from celebrity pages
- ✅ Shared posts from pages/groups
- ✅ Celebrity-related keywords
- ✅ High-engagement viral posts
- ✅ Award shows and entertainment news
- ✅ Influencer content

## ⚠️ Limitations

- **HTML Structure Dependency**: Facebook may change their HTML structure, which could break some filtering features
- **Web Version Only**: Works on Facebook's web interface, not the mobile app
- **No API Access**: Cannot access follower counts or detailed metrics directly
- **Terms of Service**: Use at your own discretion; Facebook's ToS may prohibit modifications

## 🐛 Troubleshooting

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

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open an issue for bugs or feature requests
- Submit a pull request with improvements
- Help expand the celebrity database
- Improve filtering algorithms

## 📄 License

This project is provided as-is for educational and personal use.

## ⚖️ Legal & Ethical Considerations

- This extension modifies the display of Facebook content but does not violate data access
- Use responsibly and in accordance with Facebook's Terms of Service
- The extension is for personal use and educational purposes
- Not affiliated with, endorsed by, or connected to Facebook/Meta

## 📝 Privacy Policy

For detailed information about data handling, see our [Privacy Policy](privacy-policy.html).

## 🙏 Acknowledgments

- Built with privacy and user control in mind
- Open source for transparency and community improvement

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/kemckai/defamous/issues)
- Check the [documentation](INSTALLATION.md) for detailed instructions

---

**Defamous** - *Filter the fame, focus on friends*

Made with ❤️ for a better Facebook experience
