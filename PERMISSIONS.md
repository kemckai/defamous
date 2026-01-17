# Defamous Extension Permissions Guide

## Current Permissions

Your extension currently uses **only one permission**, which is the minimum required for functionality:

```json
{
  "permissions": [
    "storage
  ]
}
```

## Required Permissions

### ✅ **storage** (REQUIRED)
**Why it's needed:**
- Saves user filter preferences (which filters are enabled/disabled)
- Stores engagement threshold settings
- Allows settings to sync across devices (using `chrome.storage.sync`)

**What it does:**
- Stores filter settings locally in the browser
- Syncs settings across user's Chrome browsers (if signed in)
- **NO external data transmission** - everything stays in the browser

**Privacy impact:** ✅ MINIMAL
- Only stores your filter preferences
- No personal data, browsing history, or Facebook data is stored
- Data never leaves your browser

## Implicit Permissions (No explicit permission needed)

### Content Scripts (Built-in)
**What it does:**
- Runs JavaScript on Facebook.com pages
- Filters posts by manipulating the DOM
- Runs only when you visit Facebook.com

**Why no explicit permission:**
- Declared in `content_scripts` with specific matches
- Only runs on `*://*.facebook.com/*`
- Chrome automatically grants this for declared content scripts

### Action Popup (Built-in)
**What it does:**
- Shows the popup interface when you click the extension icon
- Allows you to toggle filters on/off

**Why no explicit permission:**
- Standard extension action feature
- No special permissions needed

## Permissions You DON'T Need (And Why)

### ❌ **activeTab** - NOT NEEDED
- Your extension only needs to run on Facebook.com
- Content scripts already have access to the page

### ❌ **tabs** - NOT NEEDED
- Extension doesn't need to access other tabs
- Doesn't need to create or modify tabs

### ❌ **host_permissions** - NOT NEEDED
- Content scripts already specify matches for facebook.com
- No need for explicit host permissions

### ❌ **background** - NOT NEEDED
- No background scripts required
- All functionality is in content scripts

### ❌ **history** - NOT NEEDED
- Extension doesn't access browsing history
- No history-related features

### ❌ **cookies** - NOT NEEDED
- Extension doesn't need to access cookies
- No cookie manipulation required

### ❌ **webRequest** - NOT NEEDED
- Extension doesn't intercept network requests
- All filtering happens client-side via DOM manipulation

### ❌ **scripting** - NOT NEEDED
- Content scripts already provide script injection
- No additional scripting permissions needed

## Chrome Web Store Justification

When submitting to Chrome Web Store, you'll need to justify the **"storage"** permission:

**Justification:**
> "Used to save user filter preferences locally in the browser. The extension stores which filters are enabled/disabled and the engagement threshold setting. No data is transmitted to external servers. All storage is local and only accessible to the extension."

## Privacy-Friendly Design

Your extension is designed to be privacy-friendly:

✅ **Minimal permissions** - Only one permission
✅ **No data collection** - No analytics or tracking
✅ **No external servers** - All processing is local
✅ **No network requests** - No data transmission
✅ **User control** - All settings are user-controlled

## Summary

**Current Permissions:** ✅ OPTIMAL
- Only the minimum required permission (`storage`)
- No unnecessary permissions
- Privacy-focused design
- Meets Chrome Web Store best practices

**No changes needed** - Your current permission setup is appropriate and minimal!

