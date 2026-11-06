"""
Inspect all fetch/api calls inside 'use client' files to find real browser 404s.
"""
import os, re

# Find all existing API routes
existing_routes = set()
for root, _, files in os.walk(os.path.join('src', 'app', 'api')):
    for f in files:
        if f in ('route.ts', 'route.js'):
            rel = os.path.relpath(root, os.path.join('src', 'app'))
            url = '/' + rel.replace(os.sep, '/')
            existing_routes.add(url)

print(f"Existing API routes ({len(existing_routes)}):")
for r in sorted(existing_routes):
    pass # valid

# Scan client files
fetch_re = re.compile(r'(?:fetch|api\.get|api\.post|api\.put|api\.delete|axios\.get|axios\.post)\s*\(\s*[`\'"](/api/[^`\'"$\s]+)[`\'"]')

real_client_404s = []

for root, _, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts', '.jsx', '.js')):
            p = os.path.join(root, f)
            if 'src/app/api' in p.replace(os.sep, '/'):
                continue
            with open(p, 'r', encoding='utf-8', errors='ignore') as fl:
                content = fl.read()
                # Check if it's a client component or client hook
                is_client = "'use client'" in content or '"use client"' in content or 'src/components/' in p.replace(os.sep, '/') or 'src/lib/api/' in p.replace(os.sep, '/') or 'hooks' in p

                lines = content.split('\n')
                for lno, line in enumerate(lines):
                    matches = fetch_re.findall(line)
                    for m in matches:
                        clean_m = m.split('?')[0].rstrip('/')
                        # check if matched
                        matched = False
                        if clean_m in existing_routes:
                            matched = True
                        else:
                            # check dynamic
                            parts = clean_m.split('/')
                            for ex in existing_routes:
                                ex_parts = ex.split('/')
                                if len(ex_parts) == len(parts):
                                    if all(e == p or (e.startswith('[') and e.endswith(']')) for e, p in zip(ex_parts, parts)):
                                        matched = True
                                        break
                        if not matched:
                            real_client_404s.append((clean_m, f"{p}:{lno+1}", is_client))

print(f"\nREAL CLIENT-SIDE FETCH CALLS RETURNING 404 ({len(real_client_404s)}):")
for url, loc, is_cl in sorted(real_client_404s):
    if is_cl:
        print(f"  [CLIENT 404] {url}  at {loc}")
