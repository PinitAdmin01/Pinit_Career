import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from react_day38_data import day38

part5_extra2 = [
    "As we prepare for Day 39's deep dive into `useDeferredValue`, note the essential architectural distinction between the two hooks: `useTransition` gives you explicit control over the function that dispatches the state update, providing the `startTransition` wrapper and the `isPending` boolean flag. In contrast, `useDeferredValue` operates on incoming values (such as props received from a parent component) where you do not have direct access to the state dispatch function. Together, these two hooks form the twin pillars of React's modern concurrent responsiveness toolkit."
]

day38['parts'][4]['say'].extend(part5_extra2)

print("Updated Day 38 Word Counts:")
for i, p in enumerate(day38['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    print(f"Part {i+1} ({p['title'][:35]}...): words={wc}")

output_py = []
output_py.append("import hashlib\n")
output_py.append("import json\n\n")
output_py.append("def sha256(text: str) -> str:\n")
output_py.append("    return hashlib.sha256(text.encode('utf-8')).hexdigest()\n\n")
output_py.append("day38 = " + repr(day38) + "\n")

with open('scripts/react_day38_data.py', 'w', encoding='utf-8') as f:
    f.write("".join(output_py))

print("Successfully updated scripts/react_day38_data.py!")
