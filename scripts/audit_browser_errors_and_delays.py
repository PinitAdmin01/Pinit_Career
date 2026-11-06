"""
Audits potential browser 404s, missing assets, broken API routes, and performance delays.
"""
import os
import re
import json

def check_missing_static_assets():
    print("=== 1. CHECKING STATIC ASSET REFERENCES (Potential 404s) ===")
    asset_exts = r'\.(png|jpg|jpeg|svg|webp|glb|gltf|wasm|json|mp3|wav|ogg|ico)'
    pattern = re.compile(r'["\'](/[^"\'\s]+\.' + r'(?:png|jpg|jpeg|svg|webp|glb|gltf|wasm|json|mp3|wav|ogg|ico))["\']', re.IGNORECASE)

    referenced = set()
    ref_locations = {}

    for root, _, files in os.walk('src'):
        for f in files:
            if f.endswith(('.tsx', '.ts', '.jsx', '.js', '.css', '.json')):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8', errors='ignore') as fl:
                    for lno, line in enumerate(fl):
                        matches = pattern.findall(line)
                        for m in matches:
                            # ignore api routes or dynamic templates
                            if m.startswith('/api/'):
                                continue
                            if '${' in m or '{' in m:
                                continue
                            referenced.add(m)
                            if m not in ref_locations:
                                ref_locations[m] = f"{p}:{lno+1}"

    missing = []
    found = []
    large_assets = []

    for ref in sorted(referenced):
        rel_path = ref.lstrip('/')
        # check query strings like /avatar.png?v=2
        clean_rel = rel_path.split('?')[0].split('#')[0]
        public_path = os.path.join('public', clean_rel.replace('/', os.sep))
        if not os.path.exists(public_path):
            missing.append((ref, ref_locations.get(ref, 'unknown')))
        else:
            sz = os.path.getsize(public_path)
            found.append((ref, sz))
            if sz > 2 * 1024 * 1024: # > 2MB
                large_assets.append((ref, sz, round(sz / (1024*1024), 2)))

    print(f"Total static assets referenced: {len(referenced)}")
    print(f"Found in public/: {len(found)}")
    print(f"MISSING in public/ (THESE THROW 404 IN BROWSER): {len(missing)}")
    for ref, loc in missing:
        print(f"  [404] {ref}  <-- referenced at {loc}")

    print(f"\nHEAVY ASSETS (>2MB, CAN CAUSE CACHE WRITE FAILURE & DELAYS): {len(large_assets)}")
    for ref, sz, mb in sorted(large_assets, key=lambda x: -x[1]):
        print(f"  [HEAVY] {ref}: {mb} MB")

def check_client_api_calls():
    print("\n=== 2. CHECKING CLIENT API CALLS VS SERVER ROUTES (Potential 404s) ===")
    # Collect all API routes in src/app/api
    existing_api_routes = set()
    for root, _, files in os.walk(os.path.join('src', 'app', 'api')):
        for f in files:
            if f in ('route.ts', 'route.js'):
                rel = os.path.relpath(root, os.path.join('src', 'app'))
                # convert to url path e.g. api/interview/chat
                url_path = '/' + rel.replace(os.sep, '/')
                existing_api_routes.add(url_path)

    # Search for all client fetch/axios/api calls in src/
    call_pattern = re.compile(r'["\'](/api/[a-zA-Z0-9_\-\/]+)["\']')
    client_calls = {}

    for root, _, files in os.walk('src'):
        for f in files:
            if f.endswith(('.tsx', '.ts', '.jsx', '.js')):
                p = os.path.join(root, f)
                # Skip route.ts files themselves
                if 'src/app/api' in p.replace(os.sep, '/'):
                    continue
                with open(p, 'r', encoding='utf-8', errors='ignore') as fl:
                    for lno, line in enumerate(fl):
                        matches = call_pattern.findall(line)
                        for m in matches:
                            # clean query string
                            clean_api = m.split('?')[0].rstrip('/')
                            if clean_api not in client_calls:
                                client_calls[clean_api] = []
                            client_calls[clean_api].append(f"{p}:{lno+1}")

    missing_endpoints = []
    matched_endpoints = []

    for endpoint, locs in sorted(client_calls.items()):
        # Check if direct match or dynamic route match e.g. /api/arena/room/[roomCode]
        matched = False
        if endpoint in existing_api_routes:
            matched = True
        else:
            # check dynamic route matching e.g. /api/arena/room/ABC -> /api/arena/room/[roomCode]
            endpoint_parts = endpoint.split('/')
            for ex in existing_api_routes:
                ex_parts = ex.split('/')
                if len(ex_parts) == len(endpoint_parts):
                    if all(e == p or (e.startswith('[') and e.endswith(']')) for e, p in zip(ex_parts, endpoint_parts)):
                        matched = True
                        break

        if matched:
            matched_endpoints.append(endpoint)
        else:
            missing_endpoints.append((endpoint, locs[0]))

    print(f"Total client API endpoints called: {len(client_calls)}")
    print(f"Matched server API routes: {len(matched_endpoints)}")
    print(f"UNMATCHED CLIENT API CALLS (THESE WILL THROW 404): {len(missing_endpoints)}")
    for ep, loc in missing_endpoints:
        print(f"  [API 404] {ep}  <-- called from {loc}")

def check_performance_bottlenecks():
    print("\n=== 3. CHECKING PERFORMANCE DELAYS (Intervals, Polling, Huge Imports) ===")
    interval_pattern = re.compile(r'setInterval\s*\(', re.IGNORECASE)
    timeout_pattern = re.compile(r'setTimeout\s*\(', re.IGNORECASE)
    fetch_in_useeffect = re.compile(r'useEffect\s*\(', re.IGNORECASE)

    rapid_intervals = []
    for root, _, files in os.walk('src'):
        for f in files:
            if f.endswith(('.tsx', '.ts')):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8', errors='ignore') as fl:
                    lines = fl.readlines()
                    for idx, line in enumerate(lines):
                        if 'setInterval' in line:
                            # look ahead for interval duration (e.g. , 100) or , 500)
                            snippet = "".join(lines[idx:idx+10])
                            ms_match = re.search(r',\s*(\d+)\s*\)', snippet)
                            if ms_match:
                                ms = int(ms_match.group(1))
                                if ms < 500:
                                    rapid_intervals.append((p, idx+1, ms))

    print(f"RAPID POLLING INTERVALS (< 500ms, CAN CHOKE MAIN THREAD & BROWSER EVENT LOOP): {len(rapid_intervals)}")
    for p, lno, ms in rapid_intervals[:15]:
        print(f"  [RAPID INTERVAL {ms}ms] {p}:{lno}")

if __name__ == '__main__':
    check_missing_static_assets()
    check_client_api_calls()
    check_performance_bottlenecks()
