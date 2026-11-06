import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import os

matches = []
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            p = os.path.join(root, f)
            text = Path(p).read_text(encoding='utf-8', errors='ignore')
            if 'resolvePilotDay' in text or 'getLongLesson' in text:
                matches.append(p)

print(f"Files using resolvePilotDay or getLongLesson: {len(matches)}")
for m in matches:
    print(" ", m)
