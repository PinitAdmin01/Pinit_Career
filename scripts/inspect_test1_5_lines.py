with open('tests/java_basics_days1_5_overhaul.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for j in range(45, 90):
    if j < len(lines):
        print(f"{j+1}: {lines[j]}")
