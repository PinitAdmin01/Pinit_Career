import json

for d in [31, 32, 33, 34, 35]:
    path = f'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-{d}.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"=== DAY {d} ===")
    for e_idx, entry in enumerate(data['entries']):
        for s_idx, step in enumerate(entry['spec']['steps']):
            rows_len = len(step['rows'])
            if rows_len != 2:
                print(f"  Entry {e_idx} Step {s_idx} ({step['at']}): {rows_len} rows!")
