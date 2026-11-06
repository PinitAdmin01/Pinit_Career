import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

missing = set()

for root, _, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts', '.jsx', '.js', '.json', '.css')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
                # find quoted strings starting with / and containing an extension or subfolder
                matches = re.findall(r'''['"`](/(?:brand|avatar|avatars|images|icons|img|static|tenants|assets|certificates|audio|sounds)/[^'"`\s\?#]+)''', txt)
                matches += re.findall(r'''['"`](/[^'"`\s\?#]+\.(?:png|jpg|jpeg|svg|webp|gif|ico|glb|gltf|mp3|wav|ogg|json|woff2?))''', txt)
                for clean in matches:
                    if clean.startswith('/api/'):
                        continue
                    pub_path = os.path.join('public', clean.lstrip('/'))
                    if not os.path.exists(pub_path):
                        missing.add((clean, p.replace('\\', '/')))

print(f"Total Missing Static Assets in public/: {len(missing)}")
for asset, loc in sorted(missing):
    print(f"  [MISSING ASSET] {asset:40} referenced in {loc}")
