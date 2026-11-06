with open('scripts/design_day38_data.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(568, 582):
    print(f"{i+1}: {repr(lines[i])}")
