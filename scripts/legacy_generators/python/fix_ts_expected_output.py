with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace "expectedOutput": with "output":
cleaned = text.replace('"expectedOutput":', '"output":')

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(cleaned)

print("Renamed 'expectedOutput' to 'output' in designWebLongLessons.ts.")
