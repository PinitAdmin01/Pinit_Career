with open('tests/java_basics_days6_10_overhaul.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for idx, l in enumerate(lines):
    if "minutes" in l:
        print(f"{idx+1}: {l}")
