with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for j in range(463, 480):
    print(f"{j+1}: {lines[j]}")
