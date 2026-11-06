import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('content/courses/iotnetworknow.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Print lines 2911 to 3596
print("".join(lines[2910:3596]))
