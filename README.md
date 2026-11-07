# Defamous

**Filter celebrity and public figure content from your Facebook feed**

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-4285F4?style=for-the-badge&logo=Google-Chrome&logoColor=white)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Privacy](https://img.shields.io/badge/Privacy-First-green.svg)](privacy-policy.html)

Defamous is a privacy-focused browser extension that hides public figures from the Facebook feed, including posts about them and friends sharing those posts. Ordinary friend posts stay, including posts that are verified or widely liked.

## 🎯 Features

- ✅ **Hide known public figures** - Hides a post when its author matches a built-in name or a name you add
- ✅ **Hide posts about them** - Hides captions, photo labels, and shares that name a public figure, including a friend passing the post along
- ✅ **Facebook public-figure labels** - Hides a header whose category is exactly “Public figure”, “Actor”, “Musician”, “Athlete”, or a similar short page category
- ✅ **Your own block list** - Extra names stay in browser storage on this device
- ✅ **Optional extras, off by default** - Verified badges, high like counts, every Page, every Group, and Trending are not treated as fame unless you turn them on
- ✅ **Real-time updates** - Rechecks the feed as Facebook inserts or recycles posts, and shows a post again when a rule no longer matches

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

Defamous reads the post already on the page. It does not call Facebook, and it does not send the feed anywhere.

A post is hidden when any of these is true:

- The author, or the author of a shared attachment, matches a known public-figure name or a name you added. Matching uses the whole name, not a fragment, so “Smith” or “cook” in an ordinary sentence is not treated as “Will Smith” or “Tim Cook”.
- The caption, photo alt text, accessible name, or shared attachment mentions one of those names, or a specific coverage phrase such as “red carpet” or “celebrity”.
- A short header label is Facebook’s own category, such as “Public figure” or “Musician”.

A blue checkmark, a large like count, a local Page, and a local Group do not hide a post unless you turn that extra rule on. The built-in name list is the list already in the extension. It is not a complete list of famous people, and a photo with no name in the text is not recognized.

## 🎛️ Customization

Click the Defamous icon in your browser toolbar:

- **Hide posts by known public figures** — on by default
- **Hide posts and shares about them** — on by default
- **Hide Facebook “Public figure” labels** — on by default
- **Extra names to block** — blank by default, stored only in this browser
- **Hide every verified account** — off by default
- **Hide high-engagement posts** and the engagement threshold — off by default
- **Hide every post shared from a Page** — off by default
- **Hide every post shared from a Group** — off by default
- **Hide posts marked Trending** — off by default

Turning a rule off puts matching posts back. A previously saved setting is kept, so an older “hide verified accounts” choice stays on until you turn it off.

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

Defamous hides:

- Posts authored by a name on the built-in list or your extra list
- Posts and nested shares whose visible text or photo label names those people
- Posts whose header category is a public-figure label
- Coverage phrases such as “red carpet”, “paparazzi”, and “celebrity”

It leaves visible, unless you opt in:

- Ordinary friend posts, including ones with a verified badge or a large like count
- A friend mentioning a celebrity only inside a comment
- A shared local Page or Group that does not name a public figure
- Sentences that merely contain “smith”, “cook”, “james”, or “Adelaide”

## ⚠️ Limitations

- **Not a complete list of famous people.** Someone absent from the built-in list and from your extra names stays visible unless Facebook labels the header as a public figure.
- **Single-word names collide.** “Adele”, “Prince”, or “Drake” also matches a friend who has that name. “Adelaide” does not match “Adele”.
- **No face recognition.** A photo is hidden only when its alt text, title, or accessible name includes a matched name.
- **Comments are not scanned.** A celebrity named only in a comment does not hide the post.
- **HTML structure.** The feed scan uses `role="feed"`, `role="article"`, message text, and accessible labels. A Facebook markup change can miss posts.
- **Desktop site.** Selectors target the desktop Facebook DOM, not the mobile site or the Facebook app.
- **Verified and viral are optional.** Those signals are not fame by themselves.

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
