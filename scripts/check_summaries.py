with open('src/lib/data/iotNetLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for d in range(50, 55):
    marker = f'"day": {d}'
    pos = text.find(marker)
    if pos == -1:
        print(f"Day {d} not found")
        continue
    next_marker = f'"day": {d+1}'
    next_pos = text.find(next_marker)
    chunk = text[pos:next_pos] if next_pos != -1 else text[pos:]
    has_sum = '"summary":' in chunk
    print(f"Day {d}: has_summary={has_sum}")
