# scripts/fix_create_script.py
with open("scripts/create_dist_day36_data.py", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('f.write("# scripts/dist_day36_data.py\\\\n")', 'f.write("# scripts/dist_day36_data.py\\n")')
content = content.replace('indent=2) + "\\\\n")', 'indent=2) + "\\n")')

with open("scripts/create_dist_day36_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement successful!")
