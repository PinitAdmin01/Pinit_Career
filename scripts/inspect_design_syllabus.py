import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/course-curriculum-summary.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

for c in courses:
    if c['id'] == 'course-design-systems':
        blocks = c.get('blocks', [])
        print(f"Total blocks: {len(blocks)}")
        for b in blocks:
            print(f"\nBlock {b.get('blockNum')}: {b.get('title')}")
            for d in b.get('days', []):
                title = d.get('title', '')
                desc = d.get('desc', '')[:120]
                print(f"  Day {d.get('day')}: {title}")
                if desc:
                    print(f"    -> {desc}")
