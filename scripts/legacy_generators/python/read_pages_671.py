with open('scripts/pages_671_to_end.txt', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for i, line in enumerate(lines[:100]):
    print(line.encode('ascii', errors='replace').decode('ascii'))
