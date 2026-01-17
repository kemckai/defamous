# Host Permissions Justification for Chrome Web Store

## Important Note: You May Not Need Explicit Host Permissions

Your extension uses `content_scripts` with matches for `*://*.facebook.com/*`. In Manifest V3, content scripts automatically grant the necessary host permissions for the matched URLs, so you may **not need** to declare `host_permissions` separately.

However, if Chrome Web Store asks about host permissions during review, use the justification below.

---

## Host Permissions Justification (If Required)

**If Chrome Web Store asks about host permissions, use this text:**

---

### Host Permissions: facebook.com

**Justification:**

This extension requires access to `facebook.com` to filter celebrity and public figure content from the Facebook feed. The extension uses content scripts that run only on Facebook.com pages to:

1. Detect and filter posts from verified accounts
2. Filter celebrity-related content
3. Hide shared posts from celebrity pages/groups
4. Apply user-configured filters to the Facebook feed

The extension does not access any other websites or domains. All functionality is limited to Facebook.com pages where the user is already browsing. The extension does not read, store, or transmit any Facebook data to external servers. All filtering occurs locally in the user's browser through DOM manipulation.

**Privacy Impact:** Minimal - Extension only runs on Facebook.com when the user is already visiting that site. No data is collected or transmitted.

---

## Shorter Version (If Character Limit)

If there's a character limit, use this shorter version:

---

### Host Permissions: facebook.com

The extension requires access to `facebook.com` to filter celebrity content from the Facebook feed. The extension runs only on Facebook.com pages where the user is browsing, filtering posts locally in the browser. No data is collected or transmitted to external servers.

**Privacy Impact:** Minimal - Only runs on Facebook.com when the user is visiting that site.

---

## Current Manifest V3 Configuration

Your current manifest uses content scripts, which automatically grant host permissions:

```json
"content_scripts": [
  {
    "matches": ["*://*.facebook.com/*"],
    "js": ["content.js"],
    "run_at": "document_idle"
  }
]
```

This means:
- ✅ You automatically have permission to run on `facebook.com`
- ✅ No explicit `host_permissions` declaration needed
- ✅ Chrome Web Store recognizes content_scripts matches as host permissions

---

## When You Might Need Explicit Host Permissions

You would need to add explicit `host_permissions` if:

1. **You need to make network requests to Facebook.com** (you don't)
2. **You use `chrome.tabs` API with specific URLs** (you don't)
3. **You want to be more explicit about permissions** (optional)

### If You Want to Be Explicit (Optional)

If you want to explicitly declare host permissions (not required but can be clearer), you could add:

```json
{
  "manifest_version": 3,
  "permissions": ["storage"],
  "host_permissions": [
    "*://*.facebook.com/*"
  ],
  "content_scripts": [
    {
      "matches": ["*://*.facebook.com/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ]
}
```

**Note:** This is optional - your current manifest already works without explicit `host_permissions`.

---

## What Chrome Web Store Reviewers Will See

When reviewers evaluate your extension, they will see:

1. **Content Scripts Matches**: `*://*.facebook.com/*`
2. **Implicit Host Permissions**: Automatically granted for matched URLs
3. **No External Requests**: Extension doesn't make network requests
4. **Local Processing Only**: All filtering happens client-side

---

## Justification Template for Different Scenarios

### Scenario 1: Content Scripts Only (Your Current Setup)

**Justification:**
"This extension uses content scripts that run on Facebook.com pages to filter celebrity content from the feed. All processing occurs locally in the browser. No data is collected or transmitted to external servers."

### Scenario 2: Explicit Host Permissions (If You Add Them)

**Justification:**
"This extension requires access to `facebook.com` to filter celebrity and public figure content. The extension runs only on Facebook.com pages, filtering posts locally in the browser. No data is collected or transmitted."

### Scenario 3: If Asked About Network Access

**Justification:**
"This extension does not make network requests to Facebook.com or any other domains. All filtering occurs through local DOM manipulation in the user's browser."

---

## Key Points to Emphasize

✅ **Limited Scope**: Only runs on Facebook.com  
✅ **User-Initiated**: Only works when user is already on Facebook  
✅ **Local Processing**: All filtering happens in the browser  
✅ **No Data Collection**: No data is collected or transmitted  
✅ **No External Requests**: Doesn't communicate with external servers  
✅ **Privacy-First**: Respects user privacy  

---

## Summary

- **Current Setup**: Your content_scripts automatically grant host permissions for Facebook.com
- **Explicit Declaration**: Not required, but optional if you want to be more explicit
- **If Asked**: Use the justification text above explaining why Facebook.com access is needed
- **Privacy**: Emphasize that all processing is local and no data is collected

---

**Your extension's current configuration is correct!** You may not need explicit host_permissions, but if Chrome Web Store asks about it during review, use the justification above.

