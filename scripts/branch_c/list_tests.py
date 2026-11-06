import os

test_files = [f for f in os.listdir('tests') if f.endswith('.test.ts')]
print("Existing test files:", test_files)
