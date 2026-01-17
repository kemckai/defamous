# Chrome Web Store Submission Checklist

Use this checklist before submitting Defamous to the Chrome Web Store.

## ✅ Pre-Submission Checklist

### Package Preparation
- [ ] Package ZIP created (`defamous-extension.zip`)
- [ ] ZIP contains only necessary files (manifest.json, content.js, popup.html, popup.js, icons)
- [ ] No development files in ZIP (.git, README.md, etc.)
- [ ] All icons are correct sizes (16x16, 48x48, 128x128)
- [ ] Manifest.json is valid (test by loading unpacked in Chrome)

### Developer Account
- [ ] Chrome Web Store Developer account created
- [ ] $5 registration fee paid
- [ ] Developer Agreement accepted

### Store Assets
- [ ] Store listing description written
- [ ] Summary (132 chars max) prepared
- [ ] Full description (16,000 chars max) prepared
- [ ] At least 1 screenshot created (1280x800 or 640x400)
- [ ] Store icon ready (icon128.png)
- [ ] Privacy Policy URL obtained (hosted somewhere)

### Privacy & Legal
- [ ] Privacy Policy created (`privacy-policy.html`)
- [ ] Privacy Policy hosted online (GitHub Pages, your website, etc.)
- [ ] Privacy Policy URL ready for submission
- [ ] Understand Chrome Web Store policies

### Testing
- [ ] Extension tested in Chrome (load unpacked)
- [ ] Extension tested in Edge (if applicable)
- [ ] All filters work correctly
- [ ] Popup interface functions properly
- [ ] Settings save correctly
- [ ] No console errors
- [ ] Extension works on actual Facebook.com

## ✅ Submission Process

### Step 1: Upload
- [ ] Go to https://chrome.google.com/webstore/devconsole
- [ ] Click "New Item"
- [ ] Upload `defamous-extension.zip`
- [ ] Wait for validation
- [ ] Fix any errors shown

### Step 2: Store Listing
- [ ] Enter name: "Defamous"
- [ ] Enter summary (132 chars max)
- [ ] Enter full description
- [ ] Select category: "Social & Communication"
- [ ] Select language: "English (United States)"
- [ ] Upload store icon (icon128.png)
- [ ] Upload screenshot(s)
- [ ] Enter Privacy Policy URL
- [ ] (Optional) Enter Support URL
- [ ] (Optional) Enter Website URL

### Step 3: Permissions Justification
- [ ] Review permissions shown
- [ ] Write justification for "Storage" permission:
  "Used to save filter preferences locally. No data is transmitted externally."
- [ ] Ensure no background permissions are requested

### Step 4: Distribution
- [ ] Select "Public" visibility (or Unlisted/Private if preferred)
- [ ] Review pricing (should be Free)
- [ ] Review all information one more time

### Step 5: Submit
- [ ] Click "Submit for Review"
- [ ] Confirm submission
- [ ] Note the submission date
- [ ] Check email for confirmation

## ✅ Post-Submission

### While Waiting for Review (1-3 business days)
- [ ] Check email for updates
- [ ] Check developer dashboard for status
- [ ] Prepare for potential reviewer questions
- [ ] Have privacy policy accessible

### If Rejected
- [ ] Read rejection reason carefully
- [ ] Fix issues identified
- [ ] Resubmit with fixes
- [ ] Respond to any reviewer comments

### After Approval
- [ ] Extension goes live automatically
- [ ] Receive store URL
- [ ] Share on social media
- [ ] Update documentation with store link
- [ ] Monitor reviews and feedback
- [ ] Plan for updates/maintenance

## 📝 Quick Reference URLs

- Developer Dashboard: https://chrome.google.com/webstore/devconsole
- Developer Documentation: https://developer.chrome.com/docs/webstore/
- Policy Documentation: https://developer.chrome.com/docs/webstore/program-policies/

## 📦 Files Ready for Submission

- ✅ `defamous-extension.zip` - Extension package
- ✅ `store-listing.txt` - Copy/paste ready store listing text
- ✅ `privacy-policy.html` - Privacy policy (needs hosting)
- ✅ `SUBMISSION_CHECKLIST.md` - This checklist
- ✅ `SCREENSHOT_INSTRUCTIONS.md` - Screenshot guide

## ⚠️ Important Notes

1. **Privacy Policy URL**: You MUST host the privacy policy online and provide a URL. Cannot be a local file.

2. **Screenshots**: At least 1 screenshot is required. More are better (up to 5).

3. **Review Time**: Typically 1-3 business days, but can take longer.

4. **Rejections**: Common reasons include missing privacy policy, unclear permissions, or policy violations. Read rejection carefully.

5. **Updates**: After approval, you can update the extension at any time through the dashboard.

---

Good luck with your submission! 🚀

