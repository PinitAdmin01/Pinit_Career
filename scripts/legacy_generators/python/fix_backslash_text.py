with open('scripts/generate_visuals_block10.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if '{"text": \\' in line:
        print(f"Fixing line {i+1}: {line.strip()[:80]}")
        line = line.replace('{"text": \\', '{"text": ')
    new_lines.append(line)

with open('scripts/generate_visuals_block10.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Done fixing lines!")
