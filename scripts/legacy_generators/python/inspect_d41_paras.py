import sys
import os

sys.path.insert(0, os.path.abspath('.'))
from scripts.nlp_builder.day41 import DAY_41_DATA

for i, p in enumerate(DAY_41_DATA['parts']):
    words = len(' '.join(p['say']).split())
    print(f"Part {i+1}: {words} words - Title: {p['title']}")
    if i in [1, 3, 4]:
        print("  Last say paragraph:\n  ", p['say'][-1])
