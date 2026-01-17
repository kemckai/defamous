#!/usr/bin/env python3
"""
Create Store Icon for Chrome Web Store
Size: 128x128 pixels
Format: 24-bit PNG (no alpha)
"""

try:
    from PIL import Image
except ImportError:
    print("Error: PIL (Pillow) is required. Install with: pip3 install Pillow")
    exit(1)

import os

# Icon settings
ICON_SIZE = 128
ICON_PATH = "Defamous Icon.jpeg"
OUTPUT_PATH = "store-icon.png"

def create_store_icon():
    # Try to load the icon
    if not os.path.exists(ICON_PATH):
        print(f"Error: {ICON_PATH} not found!")
        return False
    
    try:
        # Load and resize the icon
        icon = Image.open(ICON_PATH)
        
        # Convert to RGB if needed (remove alpha channel)
        if icon.mode == 'RGBA':
            # Create white background for transparency
            background = Image.new('RGB', icon.size, (255, 255, 255))
            background.paste(icon, mask=icon.split()[3])  # Use alpha channel as mask
            icon = background
        elif icon.mode != 'RGB':
            icon = icon.convert('RGB')
        
        # Resize icon to exactly 128x128 (square)
        icon = icon.resize((ICON_SIZE, ICON_SIZE), Image.Resampling.LANCZOS)
        
        # Save as 24-bit PNG (no alpha)
        icon.save(OUTPUT_PATH, 'PNG')
        print(f"✓ Store icon created: {OUTPUT_PATH}")
        print(f"  Size: {ICON_SIZE}x{ICON_SIZE} pixels")
        print(f"  Format: 24-bit PNG (RGB)")
        
        # Verify the output
        verify_img = Image.open(OUTPUT_PATH)
        if verify_img.size == (ICON_SIZE, ICON_SIZE) and verify_img.mode == 'RGB':
            print(f"  ✓ Verified: Correct size and format")
        else:
            print(f"  ✗ Warning: Size or format mismatch")
        
        return True
        
    except Exception as e:
        print(f"Error processing icon: {e}")
        return False

if __name__ == "__main__":
    success = create_store_icon()
    if success:
        print("\n✓ Store icon ready for Chrome Web Store!")
        print(f"  Use {OUTPUT_PATH} as your store icon")
    else:
        exit(1)

