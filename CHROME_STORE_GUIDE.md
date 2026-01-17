# Publishing Defamous to Chrome Web Store
f famous people to

## Prerequisites

1. **Developer Account**: $5 one-time registration fee (required)
2. **Chrome Developer Dashboard Access**
3. **Prepared Extension Package** (ZIP file)
4. **Store Assets**: Screenshots, descriptions, icons

---

## Step-by-Step Guide

### Step 1: Prepare Your Extension Package

#### Create a Distribution ZIP File

**Important**: Your ZIP should contain:
- ✅ `manifest.json`
- ✅ `content.js`
- ✅ `popup.html`
- ✅ `popup.js`
- ✅ `icon16.png`
- ✅ `icon48.png`
- ✅ `icon128.png`
- ❌ Do NOT include: `.git/`, `.gitignore`, `README.md`, source files, development notes

**Create the package:**
```bash
cd /Users/spectorclef/facebook-no-celebrity-mode
zip -r defamous-extension.zip manifest.json content.js popup.html popup.js icon*.png
```

Or create a clean directory with only necessary files first.

---

### Step 2: Set Up Chrome Web Store Developer Account

1. **Go to Chrome Web Store Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Sign in with your Google account

2. **Pay Registration Fee**
   - One-time payment of $5 USD
   - Required for publishing extensions
   - Use Google Pay or credit card

3. **Accept Developer Agreement**
   - Read and accept the Developer Distribution Agreement
   - This allows you to publish extensions

---

### Step 3: Prepare Store Assets

You'll need the following for your store listing:

#### A. Extension Details

**Name**: Defamous (128 characters max)
**Summary**: One-line description (132 characters max)
**Description**: Detailed description (up to 16,000 characters)

**Example Summary:**
> Filter out celebrity content from your Facebook feed. Focus on posts from friends and family.

**Example Description:**
```
Defamous filters out celebrity and public figure content from your Facebook feed, helping you focus on posts from your real friends, family, and communities.

FEATURES:
• Hide verified accounts (blue checkmarks)
• Filter celebrity content from pages and groups
• Block high-engagement viral posts
• Remove shared posts from celebrity pages/groups
• Fully customizable filters - toggle on/off as needed
• Real-time filtering as you scroll

HOW IT WORKS:
Defamous uses intelligent filtering to detect and hide:
- Posts from verified accounts
- Content from public figures and celebrities
- Shared posts from celebrity pages/groups
- High-engagement posts that are likely viral/celebrity content
- Posts containing celebrity-related keywords

All filtering happens locally in your browser - no data is sent to external servers. Your privacy is protected.

CUSTOMIZABLE:
Every filter can be toggled on/off through the extension popup. Adjust the engagement threshold or disable specific filters to customize your experience.

PRIVACY-FOCUSED:
• No data collection
• No external servers
• Everything runs locally in your browser
• Open source and transparent

Perfect for anyone who wants a more personal, less celebrity-focused Facebook experience.
```

#### B. Store Images (Required)

**Screenshots**: At least 1, up to 5
- Size: 1280x800 or 640x400 pixels
- Formats: PNG or JPEG
- Show your extension in action on Facebook

**Small Promo Tile**: 440x280 pixels (optional but recommended)
**Marquee Promo Tile**: 920x680 pixels (optional, for featured placement)

#### C. Privacy & Permissions

**Privacy Policy** (Required if you collect data):
- Since Defamous doesn't collect data, you can create a simple policy stating that
- Host it on GitHub Pages, your website, or a free hosting service
- Or use a template like: "Defamous does not collect, store, or transmit any user data. All filtering occurs locally in the user's browser."

**Permissions Justification**:
- Explain why each permission is needed in the store listing
- Example: "Storage permission: Used to save your filter preferences locally"

---

### Step 4: Upload Your Extension

1. **Click "New Item"** in the developer dashboard
2. **Upload ZIP file**: Drag and drop or select your `defamous-extension.zip`
3. **Review**: Chrome will validate your extension
4. **Fix any errors** shown (common issues: manifest errors, missing icons)

---

### Step 5: Complete Store Listing

Fill out all required fields:

#### Required Information:
- ✅ **Name**: Defamous
- ✅ **Summary**: One-line description
- ✅ **Description**: Full description (from Step 3A)
- ✅ **Category**: Choose "Productivity" or "Social & Communication"
- ✅ **Language**: Select your primary language (usually English)
- ✅ **Icon**: Upload `icon128.png`

#### Optional but Recommended:
- ✅ **Screenshots**: Upload 1-5 images showing your extension
- ✅ **Promotional images**: For featured placement
- ✅ **Website**: If you have one
- ✅ **Support URL**: GitHub repo or contact page
- ✅ **Privacy Policy URL**: Link to your privacy policy

#### Pricing & Distribution:
- **Pricing**: Free (default)
- **Visibility**: 
  - **Public**: Visible to everyone (recommended)
  - **Unlisted**: Accessible via direct link
  - **Private**: Only specific users

---

### Step 6: Submit for Review

1. **Review your listing** for completeness
2. **Check for warnings** or required actions
3. **Click "Submit for Review"**
4. **Wait for approval** (typically 1-3 business days, can take longer)

---

### Step 7: Post-Approval

Once approved:
- ✅ Your extension goes live on the Chrome Web Store
- ✅ Users can install it via the store link
- ✅ You'll receive a store URL: `https://chrome.google.com/webstore/detail/YOUR-EXTENSION-ID`

---

## Important Notes

### Privacy Policy (If Required)

Create a simple privacy policy file. Example:

**Privacy Policy for Defamous**
```
Defamous Extension Privacy Policy

Last updated: [Date]

Defamous ("the Extension") respects your privacy.

DATA COLLECTION:
The Extension does not collect, store, or transmit any personal data or browsing information. All filtering operations occur locally within your browser.

STORAGE:
The Extension uses Chrome's local storage API solely to save your filter preferences (which filters are enabled/disabled). This data remains on your device and is never transmitted externally.

PERMISSIONS:
- Storage: Used to save your filter preferences locally
- Active Tab: Required to filter content on facebook.com pages

CONTACT:
For privacy-related questions, contact: [Your email]

NO THIRD-PARTY SERVICES:
The Extension does not use any third-party analytics, advertising, or tracking services.
```

Host this on GitHub Pages or another free hosting service.

### Common Issues & Solutions

**Issue**: "Manifest file not found"
- ✅ Make sure `manifest.json` is in the root of your ZIP

**Issue**: "Invalid icon size"
- ✅ Ensure icons are exactly 16x16, 48x48, and 128x128 pixels

**Issue**: "Missing description"
- ✅ Complete all required fields in the store listing

**Issue**: "Privacy policy required"
- ✅ Even if you don't collect data, provide a simple policy

### Best Practices

1. **Test thoroughly** before submitting
2. **Create good screenshots** showing the extension in action
3. **Write clear descriptions** explaining what it does
4. **Respond to reviews** after launch
5. **Update regularly** based on user feedback and Facebook changes

---

## Quick Command to Create Package

```bash
cd /Users/spectorclef/facebook-no-celebrity-mode

# Create a clean package directory
mkdir -p defamous-package
cp manifest.json content.js popup.html popup.js icon*.png defamous-package/

# Create ZIP
cd defamous-package
zip -r ../defamous-extension.zip .

# Clean up
cd ..
rm -rf defamous-package

echo "Package created: defamous-extension.zip"
```

---

## Store Listing URL Structure

Once published, your extension will be available at:
```
https://chrome.google.com/webstore/detail/defamous/[extension-id]
```

---

## Next Steps After Publishing

1. Share the store link on social media
2. Update your README with the store link
3. Monitor reviews and user feedback
4. Plan updates for Facebook HTML structure changes
5. Consider creating a Firefox version (similar process)

---

## Resources

- **Chrome Web Store Developer Dashboard**: https://chrome.google.com/webstore/devconsole
- **Developer Documentation**: https://developer.chrome.com/docs/webstore/
- **Publishing Checklist**: Check the developer dashboard for the official checklist

---

Good luck with your submission! 🚀

