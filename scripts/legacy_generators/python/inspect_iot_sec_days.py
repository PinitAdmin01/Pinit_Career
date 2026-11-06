with open('src/lib/data/iotSecLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\bday\s*:\s*\d+|"day"\s*:\s*\d+)', text)
print("Matches found:", matches)
