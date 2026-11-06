with open('tests/java_basics_days6_10_overhaul.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for idx, l in enumerate(lines[95:130]):
    print(f"{idx+96}: {l}")
