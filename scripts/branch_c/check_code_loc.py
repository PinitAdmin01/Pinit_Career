import json
for d in [56, 57, 58, 59, 60]:
    with open(f'scripts/branch_c/ai_day{d}_lesson.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"Day {d}: has top code? {bool(data.get('code'))}, has part[0].code? {bool(data['parts'][0].get('code'))}")
