import json
import re

with open('src/lib/data/bcomAitLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = list(re.finditer(r'\{\s*"day":\s*(\d+)', text))
for idx, m in enumerate(matches):
    start = m.start()
    end = matches[idx+1].start() if idx+1 < len(matches) else text.rfind('];')
    chunk = text[start:end].strip().rstrip(',')
    data = json.loads(chunk)
    day = data['day']
    words = [sum(len(s.split()) for s in p['say']) for p in data['parts']]
    print(f"Day {day}: total={sum(words)}, per_part={words}")
