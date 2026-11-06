with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for d in [23, 24, 25]:
    idx = text.find(f'"day": {d}')
    start = text.rfind('\n  {\n', 0, idx)
    print(f"Day {d}:")
    print(text[start:start+250])
    print("-" * 50)
