import json

for d in [31, 32, 33, 34, 35]:
    path = f'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day{d}_lesson.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"=== DAY {d} (say words) ===")
    for p_idx, part in enumerate(data['parts']):
        words = len(' '.join(part['say']).split())
        status = "OK" if words >= 600 else f"SHORT ({words})"
        print(f"  Part {p_idx+1}: {words} words -> {status}")
