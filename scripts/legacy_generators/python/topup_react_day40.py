import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from react_day40_data import day40

part5_extra2 = [
    "As we advance into Month 2 Block 9, we will take these concurrent rendering foundations and apply them to advanced server rendering paradigms: React Server Components (RSC), asynchronous streaming SSR with Suspense, and selective hydration architectures that minimize client JavaScript bundle footprints while preserving instant interactive performance."
]

day40['parts'][4]['say'].extend(part5_extra2)

print("Updated Day 40 Word Counts:")
for i, p in enumerate(day40['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    print(f"Part {i+1} ({p['title'][:35]}...): words={wc}")

output_py = []
output_py.append("import hashlib\n")
output_py.append("import json\n\n")
output_py.append("def sha256(text: str) -> str:\n")
output_py.append("    return hashlib.sha256(text.encode('utf-8')).hexdigest()\n\n")
output_py.append("day40 = " + repr(day40) + "\n")

with open('scripts/react_day40_data.py', 'w', encoding='utf-8') as f:
    f.write("".join(output_py))

print("Successfully updated scripts/react_day40_data.py!")
