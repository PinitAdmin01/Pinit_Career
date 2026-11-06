with open("src/lib/data/dsaWebLongLessons.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
print("Last 40 lines:")
print("".join(lines[-40:]))
