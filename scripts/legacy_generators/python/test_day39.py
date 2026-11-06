import os
import sys
import subprocess
import json

sys.path.insert(0, os.path.abspath('scripts'))
from react_day39_data import day39

print(f"Day {day39['day']}: {day39['title']}")
total_words = 0
for idx, part in enumerate(day39['parts']):
    words = sum(len(s.split()) for s in part['say'])
    total_words += words
    print(f"Part {idx+1} ({part['title'][:35]}...): words={words}")
    if words < 580:
        print(f"WARNING: Part {idx+1} is below 580 words ({words})!")

print(f"Total words: {total_words}")

print("Testing code snippets for Day 39...")
for idx, part in enumerate(day39['parts']):
    code = part['code']
    expected_output = part['output'].strip()
    
    # Run in Node
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR in Part {idx+1} execution:\n{res.stderr}")
        sys.exit(1)
    
    actual_output = res.stdout.strip()
    if actual_output != expected_output:
        print(f"MISMATCH in Part {idx+1} output!")
        print("Expected:")
        print(expected_output)
        print("Actual:")
        print(actual_output)
        sys.exit(1)
    else:
        print(f"Part {idx+1} code output verified!")

print("Day 39 verified successfully!")
