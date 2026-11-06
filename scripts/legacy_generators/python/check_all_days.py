with open('src/lib/data/iotEdgeLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

day_lines = [l.strip() for l in lines if '"day":' in l or 'day:' in l]
print(f'Total day lines found: {len(day_lines)}')
for l in day_lines[-10:]:
    print(l)
