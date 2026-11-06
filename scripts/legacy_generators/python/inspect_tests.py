with open('src/lib/data/courseTests.ts', 'r', encoding='utf-8') as f:
    text = f.read()

print("courseTests.ts size:", len(text))
import re
# Look for python test definitions
m = re.search(r'export const COURSE_TESTS.*?(\{[^;]+)', text, re.DOTALL)
keys = re.findall(r'[\'"]([a-zA-Z0-9_-]+)[\'"]\s*:', text[:10000])
print("First keys in courseTests.ts:", keys[:15])

# Search for python day 1 or day 2 test
py_test = re.search(r'[\'"]python[\'"]\s*:\s*\[(.*?)\]', text, re.DOTALL)
if py_test:
    py_text = py_test.group(1)
    print("Python tests found! Length:", len(py_text))
    # Look for return in python test
    if 'return' in py_text:
        print("Found 'return' in python tests!")
        lines = [l.strip() for l in py_text.split('\n') if 'return' in l]
        for l in lines[:5]:
            print("  ->", l)
else:
    print("Could not find 'python' key in courseTests.ts directly.")
