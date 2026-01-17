#!/usr/bin/env python3
"""
Create Marquee Promo Tile for Chrome Web Store
Size: 1400x560 pixels
Format: 24-bit PNG (no alpha)
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Error: PIL (Pillow) is required. Install with: pip3 install Pillow")
    exit(1)

import os

# Canvas dimensions
CANVAS_WIDTH = 1400
CANVAS_HEIGHT = 560

# Icon settings
ICON_SIZE = 400  # Size for the main icon
ICON_PATH = "Defamous Icon.jpeg"
OUTPUT_PATH = "marquee-promo-tile.png"

def create_marquee_tile():
    # Create canvas with dark background (matching the icon theme)
    # Using a dark grey/black background like the star's pavement
    canvas = Image.new('RGB', (CANVAS_WIDTH, CANVAS_HEIGHT), color=(20, 20, 20))
    
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
        
        # Resize icon maintaining aspect ratio
        icon.thumbnail((ICON_SIZE, ICON_SIZE), Image.Resampling.LANCZOS)
        
        # Calculate position to center the icon
        icon_x = (CANVAS_WIDTH - icon.width) // 2
        icon_y = (CANVAS_HEIGHT - icon.height) // 2
        
        # Paste icon onto canvas
        canvas.paste(icon, (icon_x, icon_y))
        
        # Add text "Defamous" below the icon
        try:
            # Try to use a nice font
            # On macOS, try system fonts
            font_paths = [
                '/System/Library/Fonts/Helvetica.ttc',
                '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
                '/Library/Fonts/Arial Bold.ttf',
            ]
            
            font = None
            font_size = 72
            
            for font_path in font_paths:
                if os.path.exists(font_path):
                    try:
                        font = ImageFont.truetype(font_path, font_size)
                        break
                    except:
                        continue
            
            if font is None:
                # Use default font
                font = ImageFont.load_default()
            
            # Draw text
            draw = ImageDraw.Draw(canvas)
            text = "Defamous"
            
            # Get text size
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            # Position text below icon, centered
            text_x = (CANVAS_WIDTH - text_width) // 2
            text_y = icon_y + icon.height + 30
            
            # Draw text with white color
            draw.text((text_x, text_y), text, fill=(255, 255, 255), font=font)
            
        except Exception as e:
            print(f"Warning: Could not add text: {e}")
            print("Saving tile with icon only...")
        
        # Save as 24-bit PNG (no alpha)
        canvas.save(OUTPUT_PATH, 'PNG')
        print(f"✓ Marquee promo tile created: {OUTPUT_PATH}")
        print(f"  Size: {CANVAS_WIDTH}x{CANVAS_HEIGHT} pixels")
        print(f"  Format: 24-bit PNG (RGB)")
        
        return True
        
    except Exception as e:
        print(f"Error processing icon: {e}")
        return False

if __name__ == "__main__":
    success = create_marquee_tile()
    if success:
        print("\n✓ Promo tile ready for Chrome Web Store!")
    else:
        exit(1)

