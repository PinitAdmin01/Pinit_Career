import os

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8', errors='ignore') as file:
                c = file.read()
                if 'AppSidebar' in c or 'AppShell' in c or 'StudentDashboardShell' in c:
                    print(f"{fp}: {len(c)} bytes")
