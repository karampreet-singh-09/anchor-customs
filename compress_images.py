import os
from PIL import Image

def compress_images(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                try:
                    with Image.open(file_path) as img:
                        # Convert to RGB if it's RGBA (PNG usually is)
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                        
                        # Resize if too large (max 1200px width/height)
                        max_size = 1200
                        if max(img.size) > max_size:
                            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                        
                        # Save as optimized JPEG
                        # We'll replace the original if it's JPEG, or save as JPG if it's PNG
                        if file.lower().endswith('.png'):
                            # Change extension in the data.js mapping if needed, 
                            # but for now let's just overwrite the PNG with JPEG data
                            # Actually, overwriting PNG with JPEG content is bad for browsers.
                            # I'll save as .jpg and we'll update the paths in data.js.
                            new_file_path = os.path.splitext(file_path)[0] + '.jpg'
                            img.save(new_file_path, "JPEG", quality=80, optimize=True)
                            print(f"Compressed {file} -> {os.path.basename(new_file_path)}")
                            # os.remove(file_path) # Optional: remove old PNG
                        else:
                            img.save(file_path, "JPEG", quality=80, optimize=True)
                            print(f"Compressed {file} in place")
                except Exception as e:
                    print(f"Error processing {file}: {e}")

if __name__ == "__main__":
    products_dir = os.path.join("public", "products")
    compress_images(products_dir)
