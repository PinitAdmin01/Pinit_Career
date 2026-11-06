with open('tests/java_basics_days11_15_overhaul.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for idx, l in enumerate(lines[95:135]):
    print(f"{idx+96}: {l}")
