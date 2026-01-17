 Storage Permission Justification for Chrome Web Store

## Justification Text (Copy-Paste Ready)

**Use this text in the Chrome Web Store submission form:**

---

### Required Permission: Storage

**Justification:**

This extension requires the `storage` permission to save user filter preferences locally in the browser. The extension stores which filters are enabled/disabled (hide verified accounts, hide public figures, hide brand pages, etc.) and the user's engagement threshold setting.

All data is stored locally using Chrome's `chrome.storage.sync` API and is never transmitted to external servers. The extension does not collect, store, or transmit any personal data, browsing history, or Facebook content. Storage is used solely to remember user preferences between browser sessions.

**Privacy Impact:** Minimal - Only stores filter settings locally on the user's device.

---

## Alternative Shorter Version (If Character Limit)

If there's a character limit, use this shorter version:

---

### Storage Permission

The `storage` permission is required to save user filter preferences (which filters are enabled/disabled and engagement threshold settings) locally in the browser. All data is stored locally using Chrome's storage API and never transmitted to external servers. No personal data or browsing information is collected or stored.

**Privacy Impact:** Minimal - Only stores user preferences locally.

---

## Detailed Explanation (For Your Reference)

### What Data is Stored

The extension stores only the following data:
- Filter settings (boolean values):
  - `hideVerified`: Whether to hide verified accounts
  - `hidePublicFigures`: Whether to hide public figures
  - `hideBrandPages`: Whether to hide brand pages
  - `hideTrending`: Whether to hide trending content
  - `hideHighEngagement`: Whether to hide high-engagement posts
  - `hideSharedFromPages`: Whether to hide posts shared from pages
  - `hideSharedFromGroups`: Whether to hide posts shared from groups
  - `filterSharedCelebrityContent`: Whether to filter celebrity content in shared posts
- Engagement threshold (number):
  - `engagementThreshold`: The threshold value for hiding high-engagement posts (default: 10000)

### Where Data is Stored

- **Local Storage**: Uses Chrome's `chrome.storage.sync` API
- **Location**: Stored in the user's browser profile
- **Sync**: Settings sync across devices if Chrome sync is enabled (user-controlled)

### What Data is NOT Stored

- ❌ No personal information
- ❌ No browsing history
- ❌ No Facebook posts or content
- ❌ No user profile data
- ❌ No authentication credentials
- ❌ No network requests or responses
- ❌ No analytics or tracking data

### How Data is Used

- Filter preferences are loaded when the extension starts
- Settings are saved when the user changes them via the popup
- Settings are used to determine which posts to filter/hide
- All processing happens locally in the browser

### Privacy Guarantees

- ✅ All data stored locally in the browser
- ✅ No external server communication
- ✅ No third-party services
- ✅ No data collection or analytics
- ✅ User can clear data anytime through Chrome settings

---

## For Chrome Web Store Reviewers

When Chrome Web Store reviewers evaluate your extension, they will look for:

1. ✅ **Clear justification** - You have a valid reason for the permission
2. ✅ **Minimal scope** - You only use what's necessary
3. ✅ **Privacy considerations** - You've thought about user privacy
4. ✅ **No overreach** - You're not collecting unnecessary data

Your extension meets all these criteria. The storage permission is used only for its intended purpose: saving user preferences.

---

## Tips for Submission

1. **Be specific** - Mention exactly what you're storing (filter preferences)
2. **Emphasize privacy** - Highlight that data is local and not transmitted
3. **Keep it concise** - Don't over-explain, but be clear
4. **Use the format** - Follow Chrome Web Store's justification format if provided

---

**Ready to submit!** Copy the justification text above and paste it into your Chrome Web Store submission form.

