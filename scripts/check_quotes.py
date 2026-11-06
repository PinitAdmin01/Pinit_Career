with open('scripts/design_day55_data.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '"code":' in l:
        print(f"Line {i+1}: {l.strip()[:60]}")
