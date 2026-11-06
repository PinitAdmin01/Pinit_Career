import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

for filename in ['pythonPilotDays.ts', 'reactPilotDays.ts', 'dsaPilotDays.ts', 'databasePilotDays.ts']:
    p = Path('src/lib/data') / filename
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8', errors='ignore')
    print(f"=== {filename} ===")
    # count blocks or sections
    blocks = re.findall(r'\"blockTitle\"|\"title\"', text)
    teacher_speaks = re.findall(r'\"teacherScript\"|\"spokenText\"|\"say\"|\"explanation\"', text)
    print(f"Total blocks/titles: {len(blocks)}, Teacher script/speak fields: {len(teacher_speaks)}")
    # find sample teacher script
    m = re.search(r'\"(?:teacherScript|spokenText|say)\"\s*:\s*([^\n]+)', text)
    if m:
        print(f"  Sample speak: {m.group(0)[:120]}...")
    else:
        print("  No teacherScript / spokenText / say found!")
    print()
