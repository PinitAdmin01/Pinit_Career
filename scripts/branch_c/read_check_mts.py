with open('scripts/visuals/check.mts', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for i, l in enumerate(lines[:60]):
    print(f"{i+1}: {l}")
