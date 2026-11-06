with open('src/lib/data/courseTests.ts', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
matches = re.findall(r'(\b\w+_TESTS\b|\bCOURSE_\w+_TESTS\b)', text)
print("Test suites in courseTests.ts:", sorted(list(set(matches))))
