import os
import re

# collect all API routes
api_routes = set()
for root, dirs, files in os.walk('src/app/api'):
    for f in files:
        if f in ('route.ts', 'route.js'):
            rel = os.path.relpath(root, 'src/app')
            api_routes.add('/' + rel.replace('\\', '/'))

# collect all public files
public_files = set()
for root, dirs, files in os.walk('public'):
    for f in files:
        rel = os.path.relpath(os.path.join(root, f), 'public')
        public_files.add('/' + rel.replace('\\', '/'))

print(f"Total API Routes: {len(api_routes)}")
print(f"Total Public Files: {len(public_files)}")

# Search for fetches across all ts/tsx files in src
fetch_re = re.compile(r'''(?:fetch|api\.(?:get|post|put|delete|patch)|axios\.(?:get|post|put|delete))\s*\(\s*([`'"][^`'"]+[`'"])''')

issues = []

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
                for m in fetch_re.finditer(txt):
                    raw_arg = m.group(1).strip('`\'"')
                    # ignore template variables inside url like ${id}
                    clean_path = raw_arg.split('?')[0].split('${')[0].rstrip('/')
                    if clean_path.startswith('/api/'):
                        # check if matched in api_routes
                        # handle dynamic route segments like [id]
                        matched = False
                        if clean_path in api_routes:
                            matched = True
                        else:
                            for r in api_routes:
                                # regex match
                                r_regex = '^' + re.sub(r'\[[^\]]+\]', '[^/]+', r) + '$'
                                if re.match(r_regex, clean_path):
                                    matched = True
                                    break
                                # prefix match if clean_path was truncated at ${
                                if '${' in raw_arg and r.startswith(clean_path):
                                    matched = True
                                    break
                        if not matched:
                            issues.append(('API_404', clean_path, p))
                    elif clean_path.startswith('/') and not clean_path.startswith('/_next'):
                        # check static file
                        if clean_path not in public_files and not any(p.startswith(clean_path) for p in public_files):
                            # ignore false positives like page routes /quests/lesson
                            if not any(clean_path.startswith(prefix) for prefix in ['/dashboard', '/quests', '/missions', '/interview', '/arena', '/friends', '/profile', '/leaderboard', '/projects', '/group-discussion', '/attention-span', '/trust', '/vault', '/help', '/login', '/signup', '/verify']):
                                issues.append(('STATIC_404', clean_path, p))

print(f"Total potential fetch issues: {len(issues)}")
for typ, path, src in sorted(set(issues)):
    print(f"  [{typ}] {path:40} in {src}")
