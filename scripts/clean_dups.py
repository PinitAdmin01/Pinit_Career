with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

if '"goal":' in lines[9000] and '"goal":' in lines[9003]:
    print("Deleting lines 9003-9005...")
    del lines[9003:9006]

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Cleaned!")
