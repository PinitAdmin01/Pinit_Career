with open(r'src/components/ui/AppShell.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("AppShell total lines:", len(lines))
# print imports and layout container structure
for i, line in enumerate(lines[:120]):
    if 'sidebar' in line.lower() or 'nav' in line.lower() or 'return' in line.lower() or 'rail' in line.lower():
        print(f"{i+1}: {line.strip()}")
