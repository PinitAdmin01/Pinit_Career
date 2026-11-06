import json

with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-33.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

entry1 = d['entries'][1]
print("Part 2 title:", entry1['partTitle'])
print("Step 1 (say2) caption:", entry1['spec']['steps'][1]['caption'])

with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day33_lesson.json', 'r', encoding='utf-8') as f:
    d33 = json.load(f)

p2 = d33['parts'][1]
print("say[0]:", p2['say'][0][:150])
print("say[1]:", p2['say'][1][:150])
