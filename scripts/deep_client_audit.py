import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Collect all API routes defined in src/app/api/
api_routes = set()
for root, dirs, files in os.walk('src/app/api'):
    for f in files:
        if f in ('route.ts', 'route.js'):
            rel_dir = os.path.relpath(root, 'src/app')
            # convert windows path separators to forward slash
            route_path = '/' + rel_dir.replace('\\', '/')
            api_routes.add(route_path)

print(f"=== Registered API Routes in Next.js ({len(api_routes)}) ===")
for r in sorted(api_routes):
    print("  API:", r)

# 2. Collect all static assets in public/
public_files = set()
for root, dirs, files in os.walk('public'):
    for f in files:
        rel_file = os.path.relpath(os.path.join(root, f), 'public')
        asset_path = '/' + rel_file.replace('\\', '/')
        public_files.add(asset_path)

print(f"\n=== Static Files in public/ ({len(public_files)}) ===")

# 3. Scan src/ for all client fetches and static resource references
fetch_pattern = re.compile(r'''(?:fetch|axios\.(?:get|post|put|delete)|apiClient\.[a-z]+)\s*\(\s*[`'"](/[^`'"?#]+)''')
img_pattern = re.compile(r'''(?:src|href)=['"](/[^'"]+\.(?:png|jpg|jpeg|svg|webp|gif|ico|glb|gltf|json))['"]''')
url_css_pattern = re.compile(r'''url\(['"]?(/[^'")]+)['"]?\)''')
glb_pattern = re.compile(r'''['"](/avatar/[^'"]+\.glb)['"]''')

client_api_calls = []
client_asset_calls = []

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts', '.jsx', '.js')):
            path = os.path.join(root, f).replace('\\', '/')
            # skip api routes themselves
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
                
                # Check fetches
                for m in fetch_pattern.finditer(content):
                    url = m.group(1)
                    if url.startswith('/api/'):
                        client_api_calls.append((url, path))
                    elif url.startswith('/'):
                        client_asset_calls.append((url, path))
                
                # Check images & assets
                for m in img_pattern.finditer(content):
                    client_asset_calls.append((m.group(1), path))
                
                for m in url_css_pattern.finditer(content):
                    client_asset_calls.append((m.group(1), path))
                
                for m in glb_pattern.finditer(content):
                    client_asset_calls.append((m.group(1), path))

print(f"\n=== Analyzing Client API Calls ({len(client_api_calls)}) ===")
unmatched_apis = []
for url, src in client_api_calls:
    # Handle dynamic routes like /api/notes/[id] or /api/opportunities/...
    # Exact match first
    matched = False
    clean_url = url.rstrip('/')
    if clean_url in api_routes:
        matched = True
    else:
        # Check parameterized routes, e.g. /api/arena/rooms/[id]
        for route in api_routes:
            # simple regex convert [param] -> [^/]+
            regex = '^' + re.sub(r'\[[^\]]+\]', '[^/]+', route) + '$'
            if re.match(regex, clean_url):
                matched = True
                break
    
    if not matched:
        unmatched_apis.append((url, src))

if unmatched_apis:
    print(f"❌ Found {len(unmatched_apis)} UNMATCHED API calls (potential 404s in browser):")
    for url, src in sorted(set(unmatched_apis)):
        print(f"   404 Target: {url:40} called in {src}")
else:
    print("✅ All client API calls match existing Next.js routes!")

print(f"\n=== Analyzing Client Static Assets ({len(client_asset_calls)}) ===")
missing_assets = []
for asset, src in client_asset_calls:
    # clean query string
    clean_asset = asset.split('?')[0].split('#')[0]
    if clean_asset not in public_files:
        missing_assets.append((clean_asset, src))

if missing_assets:
    print(f"❌ Found {len(missing_assets)} MISSING static assets (will 404 in browser):")
    for asset, src in sorted(set(missing_assets)):
        print(f"   Missing: {asset:40} referenced in {src}")
else:
    print("✅ All referenced static assets exist in public/!")
