import os
from PIL import Image, ImageOps

source_path = r"C:\Users\bansa\.gemini\antigravity\brain\2ff19fab-b11d-4f04-b999-9e0557f71197\.user_uploaded\media_1793789041599_8446f138.jpg"
output_dir = r"public\assets"
os.makedirs(output_dir, exist_ok=True)

img = Image.open(source_path).convert("RGB")
width, height = img.size

# Background color estimation
bg_r, bg_g, bg_b = 250.06, 243.06, 236.08

def unmat_image(src_img, threshold_low=6.0, threshold_high=38.0):
    src_rgba = Image.new("RGBA", src_img.size)
    pixels = src_img.load()
    out_pixels = src_rgba.load()
    
    for y in range(src_img.height):
        for x in range(src_img.width):
            r, g, b = pixels[x, y]
            dist = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
            
            if dist <= threshold_low:
                out_pixels[x, y] = (0, 0, 0, 0)
            elif dist >= threshold_high:
                out_pixels[x, y] = (r, g, b, 255)
            else:
                t = (dist - threshold_low) / (threshold_high - threshold_low)
                # smoothstep curve for natural antialiasing
                alpha = t * t * (3 - 2 * t)
                a_int = int(round(alpha * 255))
                
                # Un-matte foreground color
                fg_r = max(0, min(255, int(round((r - (1 - alpha) * bg_r) / max(alpha, 0.01)))))
                fg_g = max(0, min(255, int(round((g - (1 - alpha) * bg_g) / max(alpha, 0.01)))))
                fg_b = max(0, min(255, int(round((b - (1 - alpha) * bg_b) / max(alpha, 0.01)))))
                
                out_pixels[x, y] = (fg_r, fg_g, fg_b, a_int)
                
    return src_rgba

print("Processing transparency for full logo...")
full_rgba = unmat_image(img)

# 1. Full logo (cropped to bounding box + padding)
bbox = full_rgba.getbbox()
print("Full logo content bbox:", bbox)
# Add small balanced padding
pad = 30
crop_x1 = max(0, bbox[0] - pad)
crop_y1 = max(0, bbox[1] - pad)
crop_x2 = min(width, bbox[2] + pad)
crop_y2 = min(height, bbox[3] + pad)

full_cropped = full_rgba.crop((crop_x1, crop_y1, crop_x2, crop_y2))
full_cropped.save(os.path.join(output_dir, "logo.png"), "PNG", optimize=True)
print("Saved logo.png:", full_cropped.size)

# Also save full logo with original cream background if needed
img.crop((crop_x1, crop_y1, crop_x2, crop_y2)).save(os.path.join(output_dir, "logo-warm.png"), "PNG", optimize=True)

# 2. Extract emblem icon (pot + people + heart + drips)
# From Y: 130 to 608, X: 270 to 740
icon_crop = full_rgba.crop((260, 125, 750, 615))
icon_bbox = icon_crop.getbbox()
icon_final = icon_crop.crop(icon_bbox)

# Add square padding so icon is perfectly centered
max_dim = max(icon_final.width, icon_final.height)
pad_total = 24
target_dim = max_dim + pad_total
square_icon = Image.new("RGBA", (target_dim, target_dim), (0, 0, 0, 0))
offset_x = (target_dim - icon_final.width) // 2
offset_y = (target_dim - icon_final.height) // 2
square_icon.paste(icon_final, (offset_x, offset_y), icon_final)

square_icon.save(os.path.join(output_dir, "logo-icon.png"), "PNG", optimize=True)
print("Saved logo-icon.png:", square_icon.size)

# 3. Create high-res Favicons
favicon_32 = square_icon.resize((32, 32), Image.Resampling.LANCZOS)
favicon_32.save("public/favicon-32x32.png", "PNG")

favicon_192 = square_icon.resize((192, 192), Image.Resampling.LANCZOS)
favicon_192.save("public/favicon-192x192.png", "PNG")

favicon_apple = square_icon.resize((180, 180), Image.Resampling.LANCZOS)
favicon_apple.save("public/apple-touch-icon.png", "PNG")

# Default favicon.ico and favicon.png
favicon_32.save("public/favicon.ico", format="ICO", sizes=[(32, 32), (48, 48), (64, 64)])
favicon_32.save("public/favicon.png", "PNG")
print("Saved favicons in public/")

# 4. Extract typography sections for horizontal lockup
# "Melting Pot" text: y 625 to 775, x 95 to 920
text_crop = full_rgba.crop((95, 625, 920, 815))
text_bbox = text_crop.getbbox()
text_final = text_crop.crop(text_bbox)

# Combine emblem on left + text on right into a horizontal lockup
# Scale emblem to match text height or slightly taller
target_h = 160
# Scale icon
scale_icon = target_h / square_icon.height
new_icon_w = int(round(square_icon.width * scale_icon))
icon_scaled = square_icon.resize((new_icon_w, target_h), Image.Resampling.LANCZOS)

# Scale text
scale_text = (target_h * 0.88) / text_final.height
new_text_w = int(round(text_final.width * scale_text))
new_text_h = int(round(text_final.height * scale_text))
text_scaled = text_final.resize((new_text_w, new_text_h), Image.Resampling.LANCZOS)

# Create horizontal lockup canvas
spacing = 30
h_lockup_w = new_icon_w + spacing + new_text_w + 20
h_lockup_h = target_h
h_lockup = Image.new("RGBA", (h_lockup_w, h_lockup_h), (0, 0, 0, 0))

# Paste icon on left
h_lockup.paste(icon_scaled, (10, 0), icon_scaled)
# Paste text on right, vertically centered
text_y = (target_h - new_text_h) // 2
h_lockup.paste(text_scaled, (new_icon_w + spacing, text_y), text_scaled)

h_lockup.save(os.path.join(output_dir, "logo-horizontal.png"), "PNG", optimize=True)
print("Saved logo-horizontal.png:", h_lockup.size)

