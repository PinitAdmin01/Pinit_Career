import json

for day in [31, 32, 33, 34, 35]:
    path = f'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day{day}_lesson.json'
    with open(path, 'r', encoding='utf-8') as f:
        d = json.load(f)
    words = sum(sum(len(s.split()) for s in p['say']) + len(p['example'].split()) + len(p['tryIt'].split()) for p in d['parts'])
    print(f"Day {day}: {d['title'][:55]} | {len(d['parts'])} parts | {words} words")
