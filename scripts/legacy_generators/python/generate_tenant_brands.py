import os
from PIL import Image, ImageDraw

os.makedirs('public/brand/tenants', exist_ok=True)

configs = [
    ('apex.png', (79, 70, 229, 255), 'APEX', 'Apex University'),
    ('apex-seal.png', (67, 56, 202, 255), 'SEAL', 'Apex Official Seal'),
    ('metro.png', (8, 145, 178, 255), 'METRO', 'Metropolitan Institute'),
    ('metro-seal.png', (14, 116, 144, 255), 'SEAL', 'Metro Official Seal'),
    ('royal.png', (124, 58, 237, 255), 'ROYAL', 'Royal Academy'),
    ('royal-seal.png', (109, 40, 217, 255), 'SEAL', 'Royal Academy Seal'),
    ('default-seal.png', (37, 99, 235, 255), 'PINIT', 'Accreditation Seal'),
]

for filename, bg_color, badge, label in configs:
    img = Image.new('RGBA', (256, 256), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer circle
    draw.ellipse([(12, 12), (244, 244)], fill=bg_color, outline=(255, 255, 255, 255), width=4)
    # Inner ring
    draw.ellipse([(28, 28), (228, 228)], outline=(255, 255, 255, 120), width=2)
    
    # Center text box
    draw.text((128, 115), badge, fill=(255, 255, 255, 255), anchor='mm')
    draw.text((128, 145), label[:18], fill=(224, 231, 255, 255), anchor='mm')
    
    out_path = os.path.join('public/brand/tenants', filename)
    img.save(out_path, 'PNG')
    print('Generated:', out_path)
