with open('scripts/design_day37_data.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(85, 110):
    print(f"{i+1}: {repr(lines[i])}")
