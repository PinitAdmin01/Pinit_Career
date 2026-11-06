ts_path = 'src/lib/data/excelVizLongLessons.ts'
with open(ts_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = lines[:6098] + lines[6349:]
with open(ts_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Duplicate unboosted Day 24 removed successfully!")
