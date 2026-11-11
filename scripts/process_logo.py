import os
import shutil
from PIL import Image

source_path = r"C:\Users\bansa\.gemini\antigravity\brain\2ff19fab-b11d-4f04-b999-9e0557f71197\.user_uploaded\media_1794417501502_3f177675.jpg"
output_dirs = [r"public\images", r"public\assets", r"images"]
for d in output_dirs:
    os.makedirs(d, exist_ok=True)

img = Image.open(source_path).convert("RGB")
width, height = img.size

# Estimate exact background color from borders
bg_samples = []
for x in range(width):
    bg_samples.append(img.getpixel((x, 5)))
    bg_samples.append(img.getpixel((x, height - 5)))
bg_r = sum(p[0] for p in bg_samples) / len(bg_samples)
bg_g = sum(p[1] for p in bg_samples) / len(bg_samples)
bg_b = sum(p[2] for p in bg_samples) / len(bg_samples)
print(f"Estimated BG RGB: ({bg_r:.2f}, {bg_g:.2f}, {bg_b:.2f})")

def unmat_image(src_img, threshold_low=6.0, threshold_high=36.0):
    src_rgba = Image.new("RGBA", src_img.size)
    pixels = src_img.load()
    out_pixels = src_rgba.load()

    for y in range(src_img.height):
        for x in range(src_img.width):
            r, g, b = pixels[x, y]
            dist = ((r - bg_r) ** 2 + (g - bg_g) ** 2 + (b - bg_b) ** 2) ** 0.5

            if dist <= threshold_low:
                out_pixels[x, y] = (0, 0, 0, 0)
            elif dist >= threshold_high:
                out_pixels[x, y] = (r, g, b, 255)
            else:
                t = (dist - threshold_low) / (threshold_high - threshold_low)
                alpha = t * t * (3 - 2 * t)
                a_int = int(round(alpha * 255))

                inv = 1.0 / max(alpha, 0.01)
                fg_r = max(0, min(255, int(round((r - (1 - alpha) * bg_r) * inv))))
                fg_g = max(0, min(255, int(round((g - (1 - alpha) * bg_g) * inv))))
                fg_b = max(0, min(255, int(round((b - (1 - alpha) * bg_b) * inv))))

                out_pixels[x, y] = (fg_r, fg_g, fg_b, a_int)

    return src_rgba

print("De-matting logo...")
full_rgba = unmat_image(img)

# 1. Exact Stacked Logo WITHOUT last line ("CONNECTION • SAFETY • INCLUSION" & divider dot)
# Content ends cleanly at y=812 (after "— PSYCHOLOGICAL SERVICES —" at y=809)
stacked_region = full_rgba.crop((80, 115, 945, 816))
stacked_bbox = stacked_region.getbbox()
stacked_trimmed = stacked_region.crop(stacked_bbox)
# Add modest 16px transparent margin around all sides
pad = 16
logo_stacked = Image.new("RGBA", (stacked_trimmed.width + pad * 2, stacked_trimmed.height + pad * 2), (0, 0, 0, 0))
logo_stacked.paste(stacked_trimmed, (pad, pad), stacked_trimmed)
print("logo-stacked.png size:", logo_stacked.size)

# 2. Isolated Emblem Icon (pot + figures + heart + drips)
icon_region = full_rgba.crop((260, 120, 750, 615))
icon_bbox = icon_region.getbbox()
icon_trimmed = icon_region.crop(icon_bbox)

max_dim = max(icon_trimmed.width, icon_trimmed.height)
target_dim = max_dim + 24
logo_icon = Image.new("RGBA", (target_dim, target_dim), (0, 0, 0, 0))
logo_icon.paste(icon_trimmed, ((target_dim - icon_trimmed.width) // 2, (target_dim - icon_trimmed.height) // 2), icon_trimmed)
print("logo-icon.png size:", logo_icon.size)

# 3. Exact Horizontal Lockup (Exact Pot Emblem on left + Exact "Melting Pot" & "— PSYCHOLOGICAL SERVICES —" on right)
text_region = full_rgba.crop((85, 620, 935, 816))
text_bbox = text_region.getbbox()
text_trimmed = text_region.crop(text_bbox)

target_h = 340
# Scale icon_trimmed tightly to target_h - 16 vertical padding
icon_h = target_h - 16
icon_w = int(round(icon_trimmed.width * (icon_h / icon_trimmed.height)))
icon_scaled = icon_trimmed.resize((icon_w, icon_h), Image.Resampling.LANCZOS)

# Scale text block to ~72% of target_h for clear navbar readability
text_h = int(round(target_h * 0.72))
text_w = int(round(text_trimmed.width * (text_h / text_trimmed.height)))
text_scaled = text_trimmed.resize((text_w, text_h), Image.Resampling.LANCZOS)

gap = 38
margin_x = 12
h_w = margin_x + icon_w + gap + text_w + margin_x
logo_horizontal = Image.new("RGBA", (h_w, target_h), (0, 0, 0, 0))
logo_horizontal.paste(icon_scaled, (margin_x, (target_h - icon_h) // 2), icon_scaled)
logo_horizontal.paste(text_scaled, (margin_x + icon_w + gap, (target_h - text_h) // 2 + 4), text_scaled)
print("logo-horizontal.png size:", logo_horizontal.size, "ratio:", round(h_w / target_h, 2))

# Save all generated brand assets across public/images, public/assets, and images/
for d in output_dirs:
    logo_stacked.save(os.path.join(d, "logo-stacked.png"), "PNG", optimize=True)
    logo_stacked.save(os.path.join(d, "logo.png"), "PNG", optimize=True)
    logo_icon.save(os.path.join(d, "logo-icon.png"), "PNG", optimize=True)
    logo_horizontal.save(os.path.join(d, "logo-horizontal.png"), "PNG", optimize=True)

# Update favicons
favicon_32 = logo_icon.resize((32, 32), Image.Resampling.LANCZOS)
favicon_192 = logo_icon.resize((192, 192), Image.Resampling.LANCZOS)
favicon_apple = logo_icon.resize((180, 180), Image.Resampling.LANCZOS)

for root_dir in ["public", "."]:
    favicon_32.save(os.path.join(root_dir, "favicon-32x32.png"), "PNG")
    favicon_32.save(os.path.join(root_dir, "favicon.png"), "PNG")
    favicon_192.save(os.path.join(root_dir, "favicon-192x192.png"), "PNG")
    favicon_apple.save(os.path.join(root_dir, "apple-touch-icon.png"), "PNG")
    favicon_32.save(os.path.join(root_dir, "favicon.ico"), format="ICO", sizes=[(32, 32), (48, 48), (64, 64)])

print("All brand assets updated successfully!")
