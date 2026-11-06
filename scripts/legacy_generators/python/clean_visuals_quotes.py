import re

with open('scripts/generate_visuals_block8.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace : \"something\" with : "\"something\""
text = re.sub(r':\s*\\"([A-Za-z0-9_ -\[\]|]+)\\"([,}])', r': "\"\\1\""\2', text)

with open('scripts/generate_visuals_block8.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Cleaned quotes in generate_visuals_block8.py!")
