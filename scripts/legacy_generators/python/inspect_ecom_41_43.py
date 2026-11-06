# scripts/inspect_ecom_41_43.py
import json

for d in [41, 42, 43]:
    path = f'C:/Users/Admin/Desktop/projects/Present-Career-os-commerce/scripts/branch_b/day{d}_ecom_data.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"Day {d}: {data.get('title')}")
    words = [sum(len(x.split()) for x in p['say']) for p in data['parts']]
    print(f"  Parts words: {words}, Total: {sum(words)}, Min: {min(words)}")
