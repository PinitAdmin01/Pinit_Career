import json

for d in range(21, 26):
    data = json.load(open(f'scripts/bcom_acc_day{d}_data.json', encoding='utf-8'))
    print(f"=== DAY {d}: {data['title']} ===")
    for idx, p in enumerate(data['parts']):
        print(f"  Part {idx+1}: {p['title']}")
