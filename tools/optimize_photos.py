"""
Aura Pixel Studio — photo optimizer

Converts your camera originals into fast, web-ready JPEGs for the site.
- Resizes to sensible web dimensions (camera files are 6000px+; the site needs 1920 max)
- Compresses to quality 82 (visually lossless on the web)
- Strips EXIF metadata (GPS location, camera serial — you don't want that public)

Usage:
    python tools/optimize_photos.py <folder-with-your-photos>

Output goes to assets/img/ next to this repo's index.html.
Then rename the files to match the slots (see assets/img/README.txt).
"""
import sys
import os
from PIL import Image, ImageOps

MAX_WIDE = 1920   # hero / film posters
MAX_STD = 1200    # portfolio / service previews
QUALITY = 82

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    src_dir = sys.argv[1]
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(repo_root, "assets", "img")
    os.makedirs(out_dir, exist_ok=True)

    exts = (".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".bmp")
    files = [f for f in sorted(os.listdir(src_dir)) if f.lower().endswith(exts)]
    if not files:
        print(f"No images found in {src_dir}")
        sys.exit(1)

    for name in files:
        path = os.path.join(src_dir, name)
        try:
            img = Image.open(path)
            img = ImageOps.exif_transpose(img)  # respect rotation, then drop EXIF
            img = img.convert("RGB")

            limit = MAX_WIDE if max(img.size) / min(img.size) > 1.6 else MAX_STD
            if max(img.size) > limit:
                img.thumbnail((limit, limit), Image.LANCZOS)

            base = os.path.splitext(name)[0].lower().replace(" ", "-")
            out_path = os.path.join(out_dir, base + ".jpg")
            img.save(out_path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
            kb = os.path.getsize(out_path) // 1024
            print(f"ok  {name}  ->  assets/img/{base}.jpg  ({img.size[0]}x{img.size[1]}, {kb} KB)")
        except Exception as e:
            print(f"SKIP {name}: {e}")

    print(f"\nDone. Files are in {out_dir}")
    print("Rename them to the slot names in assets/img/README.txt, then refresh the site.")

if __name__ == "__main__":
    main()
