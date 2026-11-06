with open('temp_snippets/day57_p2.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(30, 48):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end='')
