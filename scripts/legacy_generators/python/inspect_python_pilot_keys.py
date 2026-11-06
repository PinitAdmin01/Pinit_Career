import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

text = Path('src/lib/data/pythonPilotDays.ts').read_text(encoding='utf-8', errors='ignore')
print("Keys in pythonPilotDays Day 1:")
for line in text.split('\n')[:50]:
    print(line)
