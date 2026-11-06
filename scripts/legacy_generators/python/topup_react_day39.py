import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from react_day39_data import day39

part4_extra2 = [
    "This bailout behavior underscores a key architectural rule: in React's concurrent model, performance optimization is achieved through structural design rather than manual code obfuscation. By pairing declarative hooks like `useDeferredValue` with memoized component boundaries, developers allow the engine to intelligently prune entire subtrees from execution without writing fragile imperative caching logic."
]

part5_extra2 = [
    "As you integrate these patterns into your daily development workflow, you will discover that concurrent rendering transforms how you approach application architecture. Instead of treating performance as an afterthought or adding clumsy loading states, you design interfaces that naturally adapt to device speeds, gracefully handle heavy computational loads, and maintain an unwavering standard of 60 FPS responsiveness across any user interaction."
]

day39['parts'][3]['say'].extend(part4_extra2)
day39['parts'][4]['say'].extend(part5_extra2)

print("Updated Day 39 Word Counts:")
for i, p in enumerate(day39['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    print(f"Part {i+1} ({p['title'][:35]}...): words={wc}")

output_py = []
output_py.append("import hashlib\n")
output_py.append("import json\n\n")
output_py.append("def sha256(text: str) -> str:\n")
output_py.append("    return hashlib.sha256(text.encode('utf-8')).hexdigest()\n\n")
output_py.append("day39 = " + repr(day39) + "\n")

with open('scripts/react_day39_data.py', 'w', encoding='utf-8') as f:
    f.write("".join(output_py))

print("Successfully updated scripts/react_day39_data.py!")
