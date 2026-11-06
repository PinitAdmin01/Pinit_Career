import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import os

matches = []
for root, dirs, files in os.walk('src/app/quests/lesson'):
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            p = os.path.join(root, f)
            text = Path(p).read_text(encoding='utf-8', errors='ignore')
            if 'useLessonEngine' in text:
                matches.append(p)

print("Files calling useLessonEngine:")
for m in matches:
    print(" ", m)
