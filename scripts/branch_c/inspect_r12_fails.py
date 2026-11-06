import json

# Day 34 Part 4 (index 3) say[1]
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day34_lesson.json', 'r', encoding='utf-8') as f:
    d34 = json.load(f)
print("=== DAY 34 PART 4 say[1] ===")
print(d34['parts'][3]['say'][1])

# Day 35 Part 3 (index 2) say[1]
# Day 35 Part 4 (index 3) say[1]
# Day 35 Part 5 (index 4) say[1]
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day35_lesson.json', 'r', encoding='utf-8') as f:
    d35 = json.load(f)
print("=== DAY 35 PART 3 say[1] ===")
print(d35['parts'][2]['say'][1])
print("=== DAY 35 PART 4 say[1] ===")
print(d35['parts'][3]['say'][1])
print("=== DAY 35 PART 5 say[1] ===")
print(d35['parts'][4]['say'][1])
