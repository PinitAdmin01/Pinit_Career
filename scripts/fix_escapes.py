with open('scripts/make_month2_days41_42.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(r'\"\"\"', '"""')

with open('scripts/make_month2_days41_42.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Escapes fixed successfully!")
