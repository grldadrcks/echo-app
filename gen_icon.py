"""
ECHO icon generator.
Design: 7 horizontal white bars on pure black, opacity ascending top→bottom,
suggesting descent through layers.
"""

from PIL import Image, ImageDraw, ImageFilter
import os

BASE = os.path.dirname(os.path.abspath(__file__))
RES  = os.path.join(BASE, "android", "app", "src", "main", "res")

# 7 bars: one per stratum. Opacity increases downward (35% → 100%).
OPACITIES = [0.30, 0.42, 0.54, 0.66, 0.78, 0.90, 1.00]

def draw_bars(draw, size, padding_frac=0.18):
    """Draw 7 horizontal bars centered in the canvas."""
    pad   = int(size * padding_frac)
    inner = size - 2 * pad          # usable height & width

    bar_w = int(inner * 0.72)       # bar width as fraction of inner
    x0    = (size - bar_w) // 2
    x1    = x0 + bar_w

    # Distribute 7 bars + 6 gaps evenly across inner height
    total_bars = 7
    bar_h      = max(2, int(inner * 0.072))
    gap        = max(1, (inner - total_bars * bar_h) // (total_bars - 1))
    block      = total_bars * bar_h + (total_bars - 1) * gap
    y_start    = pad + (inner - block) // 2

    for i, alpha in enumerate(OPACITIES):
        y0 = y_start + i * (bar_h + gap)
        y1 = y0 + bar_h
        r  = g = b = 220                       # near-white (#dcdcdc)
        a  = int(alpha * 255)
        draw.rectangle([x0, y0, x1, y1], fill=(r, g, b, a))

def make_flat(size):
    """Flat launcher icon — black bg + 7 bars."""
    img  = Image.new("RGBA", (size, size), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    draw_bars(draw, size, padding_frac=0.16)
    return img

def make_foreground(size):
    """
    Adaptive icon foreground — transparent bg, bars in the centre
    72/108 safe zone (so padding_frac ≈ 0.18 on a 108dp canvas).
    """
    img  = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_bars(draw, size, padding_frac=0.26)    # extra padding for safe zone
    return img

# ── Sizes ────────────────────────────────────────────────────────────────────

FLAT_SIZES = {
    "mipmap-mdpi":    48,
    "mipmap-hdpi":    72,
    "mipmap-xhdpi":   96,
    "mipmap-xxhdpi":  144,
    "mipmap-xxxhdpi": 192,
}

# Adaptive foreground canvas is 108dp at each density
FOREGROUND_SIZES = {
    "mipmap-mdpi":    108,
    "mipmap-hdpi":    162,
    "mipmap-xhdpi":   216,
    "mipmap-xxhdpi":  324,
    "mipmap-xxxhdpi": 432,
}

def save(img, folder, filename):
    path = os.path.join(RES, folder, filename)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG")
    print(f"  wrote {os.path.relpath(path, BASE)}")

print("Generating ECHO icons...")

for folder, size in FLAT_SIZES.items():
    icon = make_flat(size)
    save(icon, folder, "ic_launcher.png")
    save(icon, folder, "ic_launcher_round.png")

for folder, size in FOREGROUND_SIZES.items():
    fg = make_foreground(size)
    save(fg, folder, "ic_launcher_foreground.png")

print("Done.")
