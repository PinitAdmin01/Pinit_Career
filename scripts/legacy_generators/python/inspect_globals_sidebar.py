with open(r'src/styles/globals.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '.sidebar' in line or '--bg-sidebar' in line or '.nav-item' in line:
        print(f"{i+1}: {line.strip()[:100]}")
