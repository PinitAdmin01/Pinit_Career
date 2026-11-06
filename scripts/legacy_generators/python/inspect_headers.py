import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('content/courses/iotnetworknow.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'Day ' in line and ('##' in line or '**Day' in line or 'Day 2' in line or 'Day 1' in line):
        print(f"Line {i+1}: {line.strip()[:100]}")
