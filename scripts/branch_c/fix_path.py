with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\scripts\branch_c\build_day33_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("with open('scripts/branch_c/prompt_day33_lesson.json'", "with open(r'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day33_lesson.json'")
text = text.replace("with open('src/lib/data/lessonVisuals/prompt-py/day-33.json'", "with open(r'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-33.json'")

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\scripts\branch_c\build_day33_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Path fixed!")
