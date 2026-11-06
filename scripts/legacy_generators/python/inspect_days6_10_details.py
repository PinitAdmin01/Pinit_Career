with open('src/lib/data/iotSecurity30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for day in range(6, 11):
    marker = f'"day": {day}'
    idx = text.find(marker)
    next_marker = f'"day": {day+1}' if day < 10 else '"day": 11'
    end_idx = text.find(next_marker)
    chunk = text[idx:end_idx] if end_idx != -1 else text[idx:idx+1500]
    print(f"\n==================== DAY {day} ====================")
    for line in chunk.splitlines()[:15]:
        print(line.encode('ascii', errors='replace').decode('ascii'))
