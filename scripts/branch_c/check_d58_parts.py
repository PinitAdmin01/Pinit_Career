import json
with open('scripts/branch_c/ai_day58_lesson.json', 'r', encoding='utf-8') as f:
    d = json.load(f)
for i, p in enumerate(d['parts']):
    print(f"Part {i+1}: has code? {bool(p.get('code'))}, len={len(p.get('code',''))}")
