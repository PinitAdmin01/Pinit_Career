import os

css_files = [
    r'src/styles/globals.css',
    r'src/styles/tokens.css',
    r'src/styles/portal-pages.css',
]

for p in css_files:
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
            for kw in ['.sidebar', '.nav-item', '--bg-sidebar', '.right-sidebar']:
                if kw in c:
                    print(f"Found {kw} in {p}")
