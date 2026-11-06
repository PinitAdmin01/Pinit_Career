import os

paths = [
    r'src/app/dashboard/layout.tsx',
    r'src/app/layout.tsx',
]

for p in paths:
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            print(f"=== {p} ===")
            print(f.read()[:600])
