with open(r'src/components/ui/AppShell.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'right_nav' in line.lower() or 'rightsidebar' in line.lower() or 'right-rail' in line.lower() or 'aside' in line.lower():
        print(f"{i+1}: {line.strip()[:100]}")
