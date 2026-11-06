import json

for day in [1, 2, 3, 4, 5]:
    p = f'src/lib/data/lessonVisuals/java-basics/day-{day:02d}.json'
    with open(p, 'r', encoding='utf-8') as f:
        d = json.load(f)
        print(f"--- Day {day} ---")
        print(f"entries count: {len(d.get('entries', []))}")
        for i, e in enumerate(d.get('entries', [])):
            print(f"  Entry {i+1}: title='{e.get('partTitle')}', hash='{e.get('codeHash')}'")
