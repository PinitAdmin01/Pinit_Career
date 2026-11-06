with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines, 1):
    if '"day":' in line:
        print(f"Line {idx}: {line.strip()}")
