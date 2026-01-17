#!/usr/bin/env python3
"""
Resize screenshots to Chrome Web Store requirements
Size: 1280x800 or 640x400 pixels
Format: 24-bit PNG or JPEG (no alpha)
"""

try:
    from PIL import Image
except ImportError:
    print("Error: PIL (Pillow) is required. Install with: pip3 install Pillow")
    exit(1)

import os
import sys
import glob

# Target sizes
TARGET_SIZES = [
    (1280, 800),
    (640, 400)
]

def resize_screenshot(input_path, output_path, target_size):
    """Resize a screenshot to target size while maintaining aspect ratio"""
    try:
        # Open image
        img = Image.open(input_path)
        
        # Convert to RGB if needed (remove alpha channel)
        if img.mode == 'RGBA':
            # Create white background for transparency
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Calculate resize to fit target while maintaining aspect ratio
        img.thumbnail(target_size, Image.Resampling.LANCZOS)
        
        # Create new image with target size and paste resized image centered
        new_img = Image.new('RGB', target_size, (255, 255, 255))
        paste_x = (target_size[0] - img.width) // 2
        paste_y = (target_size[1] - img.height) // 2
        new_img.paste(img, (paste_x, paste_y))
        
        # Save as 24-bit PNG (no alpha)
        new_img.save(output_path, 'PNG')
        
        return True
    except Exception as e:
        print(f"Error processing {input_path}: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 resize-screenshots.py <screenshot-file> [target-size]")
        print("\nTarget sizes:")
        print("  1280x800 (default) - Recommended")
        print("  640x400           - Smaller option")
        print("\nExample:")
        print("  python3 resize-screenshots.py screenshot.png")
        print("  python3 resize-screenshots.py screenshot.png 640x400")
        exit(1)
    
    input_path = sys.argv[1]
    
    # Determine target size
    if len(sys.argv) >= 3:
        size_str = sys.argv[2]
        if size_str == '640x400':
            target_size = (640, 400)
        elif size_str == '1280x800':
            target_size = (1280, 800)
        else:
            print(f"Error: Invalid size '{size_str}'. Use '1280x800' or '640x400'")
            exit(1)
    else:
        target_size = (1280, 800)  # Default
    
    # Check if input file exists
    if not os.path.exists(input_path):
        print(f"Error: File '{input_path}' not found!")
        exit(1)
    
    # Generate output filename
    base_name = os.path.splitext(input_path)[0]
    output_path = f"{base_name}-{target_size[0]}x{target_size[1]}.png"
    
    # Resize screenshot
    print(f"Resizing {input_path} to {target_size[0]}x{target_size[1]}...")
    success = resize_screenshot(input_path, output_path, target_size)
    
    if success:
        print(f"✓ Screenshot resized: {output_path}")
        print(f"  Size: {target_size[0]}x{target_size[1]} pixels")
        print(f"  Format: 24-bit PNG (RGB, no alpha)")
        print(f"  ✓ Ready for Chrome Web Store!")
    else:
        print(f"✗ Failed to resize screenshot")
        exit(1)

if __name__ == "__main__":
    main()

