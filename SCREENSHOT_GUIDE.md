# Screenshot Guide for Chrome Web Store

## Required Screenshots

Chrome Web Store requires at least 1 screenshot (up to 5 recommended).

### Requirements:
- **Size**: 1280x800 OR 640x400 pixels
- **Format**: JPEG or 24-bit PNG (no alpha)
- **Quantity**: Minimum 1, up to 5 recommended

---

## Recommended Screenshots

### Screenshot 1: Main Feed View (REQUIRED)
**What to show:**
- Facebook feed with the extension active
- Some posts visible (preferably showing filtered vs non-filtered)
- Extension icon visible in browser toolbar
- Clean, professional view of the feed

**How to capture:**
1. Open Facebook.com in Chrome
2. Install and enable Defamous extension
3. Navigate to your Facebook feed
4. Adjust browser window to 1280x800 or 640x400 (or crop later)
5. Take a screenshot showing the feed with extension active
6. Make sure some posts are visible

### Screenshot 2: Extension Popup (RECOMMENDED)
**What to show:**
- Click the Defamous icon in toolbar
- Show the popup with all filter settings visible
- Shows the customization options available
- Clear view of all toggles and settings

**How to capture:**
1. Click Defamous icon in Chrome toolbar
2. Make sure popup is fully visible
3. Take screenshot of the popup
4. Note: Popup is small, so you may need to crop/enlarge or show in context

### Screenshot 3: Before/After Comparison (OPTIONAL)
**What to show:**
- Split view or side-by-side showing filtered vs unfiltered feed
- Demonstrates the filtering in action

**How to capture:**
1. Take screenshot with extension disabled (before)
2. Take screenshot with extension enabled (after)
3. Create side-by-side comparison image
4. Add labels if helpful ("Before" / "After")

### Screenshot 4: Settings Interface Detail (OPTIONAL)
**What to show:**
- Close-up of the popup settings
- Highlight the various filter options
- Show engagement threshold setting

### Screenshot 5: Different Facebook Pages (OPTIONAL)
**What to show:**
- Extension working on different Facebook pages (timeline, groups, etc.)
- Shows versatility of the extension

---

## How to Take Screenshots

### Method 1: Chrome Built-in (Mac)
1. **Set browser size**: Open Chrome DevTools (F12) → Device Toolbar (Cmd+Shift+M)
2. **Set custom size**: 1280x800 or 640x400
3. **Take screenshot**: Cmd+Shift+4 to select area, or use DevTools screenshot

### Method 2: Chrome Built-in (Windows)
1. **Set browser size**: Open Chrome DevTools (F12) → Device Toolbar (Ctrl+Shift+M)
2. **Set custom size**: 1280x800 or 640x400
3. **Take screenshot**: Use Snipping Tool or Print Screen

### Method 3: Browser DevTools Screenshot
1. Open Chrome DevTools (F12)
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "screenshot" and select "Capture full size screenshot"
4. Crop to 1280x800 or 640x400 if needed

### Method 4: Using Screenshot Tools
- Use screenshot tools like Lightshot, Greenshot, or native OS tools
- Make sure to set browser window to correct size first

---

## Resizing/Editing Screenshots

### Using Online Tools:
- **Canva**: Create and edit screenshots
- **Photopea**: Free online Photoshop alternative
- **Imgur Edit**: Quick resize tool

### Using Command Line (if you have ImageMagick or similar):
```bash
# Resize to 1280x800
convert screenshot.png -resize 1280x800 screenshot-1280x800.png

# Resize to 640x400
convert screenshot.png -resize 640x400 screenshot-640x400.png
```

### Using Python PIL (if you have it):
```python
from PIL import Image
img = Image.open('screenshot.png')
img_resized = img.resize((1280, 800))
img_resized.save('screenshot-1280x800.png')
```

---

## Tips for Good Screenshots

1. **Hide Personal Info**: Blur or remove any personal information
2. **Professional Look**: Keep screenshots clean and focused
3. **Show Value**: Screenshots should clearly show what the extension does
4. **Consistent Style**: Keep all screenshots with similar styling
5. **Good Lighting**: Make sure screenshots are clear and visible
6. **Correct Size**: Ensure exact dimensions (1280x800 or 640x400)

---

## What NOT to Include

- ❌ Personal information (names, photos, messages)
- ❌ Sensitive data
- ❌ Other people's private information
- ❌ Screenshots that are too cluttered
- ❌ Blurry or low-quality images

---

## File Naming Convention

Save screenshots with clear names:
```
defamous-screenshot-1-main-feed.png
defamous-screenshot-2-popup.png
defamous-screenshot-3-comparison.png
defamous-screenshot-4-settings.png
defamous-screenshot-5-groups.png
```

---

## Next Steps

1. **Take Screenshots**: Follow the guide above to take your screenshots
2. **Edit/Resize**: Make sure they're the correct size (1280x800 or 640x400)
3. **Save as PNG/JPEG**: Ensure no alpha channel (24-bit PNG or JPEG)
4. **Upload to Store**: Use these screenshots when submitting to Chrome Web Store

---

**Note**: I cannot take actual screenshots of the extension running in your browser. You'll need to take these screenshots yourself using the methods above.

